-- MIGRATION: 20260911000001_monthly_planning_scheduler.sql

-- Enable pg_cron if not already enabled (Supabase uses this natively)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ALERT MODEL
CREATE TABLE IF NOT EXISTS public.monthly_planning_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id text NOT NULL,
    project_id uuid NOT NULL,
    competence text NOT NULL,
    alert_type text NOT NULL CHECK (alert_type IN ('OPEN_NEXT_MONTH_PLANNING', 'INTERNAL_REVIEW_DUE', 'CLIENT_APPROVAL_DUE', 'FINAL_DEADLINE_CRITICAL')),
    alert_status text NOT NULL CHECK (alert_status IN ('PENDING', 'ACTIVE', 'RESOLVED', 'CANCELLED')),
    due_date date NOT NULL,
    triggered_at timestamptz,
    resolved_at timestamptz,
    resolved_by uuid,
    source text NOT NULL DEFAULT 'MONTHLY_PLANNING_SCHEDULER',
    metadata jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(client_id, competence, alert_type)
);

-- RLS
ALTER TABLE public.monthly_planning_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read alerts" ON public.monthly_planning_alerts
FOR SELECT TO authenticated USING (true);

-- FUNCTION: ensure_next_month_planning_cycle
CREATE OR REPLACE FUNCTION public.ensure_next_month_planning_cycle(p_reference_date date)
RETURNS void AS $$
DECLARE
    v_client record;
    v_target_competence text;
    v_open_date date;
    v_internal_review date;
    v_client_approval date;
    v_final_deadline date;
    v_cycle_start_day smallint;
BEGIN
    v_target_competence := to_char(p_reference_date + interval '1 month', 'YYYY-MM');
    v_final_deadline := (date_trunc('month', p_reference_date) + interval '1 month - 1 day')::date;
    
    FOR v_client IN 
        SELECT client_id, id as project_id, COALESCE((metadata->>'cycle_start_day')::smallint, 1) as cycle_start_day
        FROM public.projects
        WHERE status = 'ACTIVE' AND metadata->>'recurring' = 'true'
    LOOP
        v_cycle_start_day := v_client.cycle_start_day;
        
        IF v_cycle_start_day = 1 THEN
            v_open_date := (date_trunc('month', p_reference_date) + interval '24 days')::date;
            v_internal_review := (date_trunc('month', p_reference_date) + interval '26 days')::date;
            v_client_approval := (date_trunc('month', p_reference_date) + interval '27 days')::date;
        ELSE
            v_open_date := (date_trunc('month', p_reference_date) + interval '24 days')::date;
            v_internal_review := (date_trunc('month', p_reference_date) + interval '26 days')::date;
            v_client_approval := (date_trunc('month', p_reference_date) + interval '27 days')::date;
        END IF;
        
        INSERT INTO public.monthly_planning_cycles (
            client_id, project_id, competence, cycle_start_day, planning_status, 
            planning_open_date, internal_review_date, client_approval_target_date, final_deadline
        )
        VALUES (
            v_client.client_id, v_client.project_id, v_target_competence, v_cycle_start_day, 'NOT_STARTED',
            v_open_date, v_internal_review, v_client_approval, v_final_deadline
        )
        ON CONFLICT (client_id, competence) DO NOTHING;
        
    END LOOP;
END;
$$ LANGUAGE plpgsql;
-- Security Invoker, execution relies on pg_cron running as postgres

REVOKE ALL ON FUNCTION public.ensure_next_month_planning_cycle(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_next_month_planning_cycle(date) TO postgres;


-- FUNCTION: process_monthly_planning_alerts
CREATE OR REPLACE FUNCTION public.process_monthly_planning_alerts(p_reference_date date)
RETURNS void AS $$
DECLARE
    v_day integer;
    v_is_last_day boolean;
    v_target_competence text;
    v_cycle record;
BEGIN
    v_day := extract(day from p_reference_date);
    v_is_last_day := (p_reference_date = (date_trunc('month', p_reference_date) + interval '1 month - 1 day')::date);
    v_target_competence := to_char(p_reference_date + interval '1 month', 'YYYY-MM');

    PERFORM public.ensure_next_month_planning_cycle(p_reference_date);

    FOR v_cycle IN 
        SELECT c.* 
        FROM public.monthly_planning_cycles c
        JOIN public.projects p ON p.id = c.project_id
        WHERE c.competence = v_target_competence
          AND p.status = 'ACTIVE' AND p.metadata->>'recurring' = 'true'
    LOOP
        IF v_cycle.planning_status = 'APPROVED' THEN
            UPDATE public.monthly_planning_alerts 
            SET alert_status = 'RESOLVED', resolved_at = now()
            WHERE client_id = v_cycle.client_id AND competence = v_cycle.competence AND alert_status IN ('PENDING', 'ACTIVE');
            CONTINUE;
        END IF;

        IF v_day >= 25 THEN
            INSERT INTO public.monthly_planning_alerts (client_id, project_id, competence, alert_type, alert_status, due_date, triggered_at)
            VALUES (v_cycle.client_id, v_cycle.project_id, v_cycle.competence, 'OPEN_NEXT_MONTH_PLANNING', 'ACTIVE', v_cycle.planning_open_date, now())
            ON CONFLICT (client_id, competence, alert_type) DO NOTHING;
            
            IF v_cycle.planning_status = 'NOT_STARTED' THEN
                UPDATE public.monthly_planning_cycles SET planning_status = 'IN_PLANNING', updated_at = now() WHERE id = v_cycle.id;
            END IF;
        END IF;

        IF v_day >= 27 THEN
            INSERT INTO public.monthly_planning_alerts (client_id, project_id, competence, alert_type, alert_status, due_date, triggered_at)
            VALUES (v_cycle.client_id, v_cycle.project_id, v_cycle.competence, 'INTERNAL_REVIEW_DUE', 'ACTIVE', v_cycle.internal_review_date, now())
            ON CONFLICT (client_id, competence, alert_type) DO NOTHING;
        END IF;

        IF v_day >= 28 THEN
            INSERT INTO public.monthly_planning_alerts (client_id, project_id, competence, alert_type, alert_status, due_date, triggered_at)
            VALUES (v_cycle.client_id, v_cycle.project_id, v_cycle.competence, 'CLIENT_APPROVAL_DUE', 'ACTIVE', v_cycle.client_approval_target_date, now())
            ON CONFLICT (client_id, competence, alert_type) DO NOTHING;
        END IF;

        IF v_is_last_day THEN
            INSERT INTO public.monthly_planning_alerts (client_id, project_id, competence, alert_type, alert_status, due_date, triggered_at)
            VALUES (v_cycle.client_id, v_cycle.project_id, v_cycle.competence, 'FINAL_DEADLINE_CRITICAL', 'ACTIVE', v_cycle.final_deadline, now())
            ON CONFLICT (client_id, competence, alert_type) DO NOTHING;
            
            IF v_cycle.planning_status != 'APPROVED' AND v_cycle.planning_status != 'OVERDUE' THEN
                UPDATE public.monthly_planning_cycles SET planning_status = 'OVERDUE', updated_at = now() WHERE id = v_cycle.id;
            END IF;
        END IF;
        
    END LOOP;
    
    UPDATE public.monthly_planning_alerts a
    SET alert_status = 'CANCELLED', updated_at = now()
    FROM public.projects p 
    WHERE p.id = a.project_id AND (p.status != 'ACTIVE' OR p.metadata->>'recurring' != 'true') AND a.alert_status IN ('PENDING', 'ACTIVE');

END;
$$ LANGUAGE plpgsql;
-- Security Invoker

REVOKE ALL ON FUNCTION public.process_monthly_planning_alerts(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.process_monthly_planning_alerts(date) TO postgres;


-- CRON WRAPPER
CREATE OR REPLACE FUNCTION public.job_monthly_planning_daily()
RETURNS void AS $$
DECLARE
    v_date date;
BEGIN
    v_date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
    PERFORM public.process_monthly_planning_alerts(v_date);
END;
$$ LANGUAGE plpgsql;
-- Security Invoker

REVOKE ALL ON FUNCTION public.job_monthly_planning_daily() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.job_monthly_planning_daily() TO postgres;


-- SCHEDULE CRON JOB
SELECT cron.schedule('fluxai_monthly_planning_daily', '0 11 * * *', 'SELECT public.job_monthly_planning_daily()');
