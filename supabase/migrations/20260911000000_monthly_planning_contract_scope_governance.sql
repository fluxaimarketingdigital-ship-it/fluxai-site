-- MIGRATION: 20260911000000_monthly_planning_contract_scope_governance.sql

CREATE TABLE IF NOT EXISTS public.monthly_planning_cycles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id text NOT NULL,
    project_id uuid NOT NULL,
    competence text NOT NULL CHECK (competence ~ '^\d{4}-\d{2}$'),
    cycle_start_day smallint NOT NULL DEFAULT 1 CHECK (cycle_start_day BETWEEN 1 AND 31),
    planning_status text NOT NULL DEFAULT 'NOT_STARTED' CHECK (planning_status IN ('NOT_STARTED', 'IN_PLANNING', 'INTERNAL_REVIEW', 'CLIENT_APPROVAL', 'APPROVED', 'OVERDUE')),
    planning_open_date date,
    internal_review_date date,
    client_approval_target_date date,
    final_deadline date,
    approved_at timestamptz,
    approved_by uuid,
    exception_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (client_id, competence)
);

CREATE TABLE IF NOT EXISTS public.contract_scope_exception_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id text NOT NULL,
    project_id uuid NOT NULL,
    competence text NOT NULL,
    content_format text NOT NULL,
    contracted_limit integer NOT NULL,
    current_consumption integer NOT NULL,
    requested_extra_quantity integer NOT NULL CHECK (requested_extra_quantity > 0),
    exception_reason text NOT NULL,
    justification text,
    requested_by uuid NOT NULL,
    requested_at timestamptz NOT NULL DEFAULT now(),
    director_decision text,
    director_approved_by uuid,
    director_approved_at timestamptz,
    director_notes text,
    expiration_date date,
    status text NOT NULL CHECK (status IN ('PENDING_DIRECTOR_APPROVAL', 'DIRECTOR_APPROVED_EXCEPTION', 'DIRECTOR_REJECTED_EXCEPTION', 'EXCEPTION_CONSUMED', 'EXCEPTION_EXPIRED')),
    consumed_quantity integer NOT NULL DEFAULT 0 CHECK (consumed_quantity >= 0 AND consumed_quantity <= requested_extra_quantity),
    audit_reference text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS unq_pending_exception 
ON public.contract_scope_exception_requests (client_id, competence, content_format, requested_extra_quantity) 
WHERE status = 'PENDING_DIRECTOR_APPROVAL';

CREATE TABLE IF NOT EXISTS public.contract_scope_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    client_id text,
    project_id uuid,
    competence text,
    content_format text,
    contracted_limit integer,
    current_consumption integer,
    requested_extra_quantity integer,
    exception_request_id uuid,
    requested_by uuid,
    approved_by uuid,
    source text,
    result text,
    reason text,
    metadata jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_assets ADD COLUMN IF NOT EXISTS contract_exception_request_id uuid NULL;
ALTER TABLE public.content_assets ADD COLUMN IF NOT EXISTS planning_competence text NULL;

CREATE OR REPLACE FUNCTION public.check_contract_scope_before_insert()
RETURNS trigger AS $$
DECLARE
    v_client_id text;
    v_competence text;
    v_format text;
    v_limit integer;
    v_consumption integer;
    v_exception_record record;
BEGIN
    SELECT client_id INTO v_client_id FROM public.profiles WHERE profiles.client_id = NEW.project_id::text LIMIT 1;
    IF v_client_id IS NULL THEN
        v_client_id := NEW.project_id::text;
    END IF;
    
    -- PRIORIDADE 1: NEW.planning_competence
    -- PRIORIDADE 2: NEW.metadata->>'mes_referencia'
    -- PRIORIDADE 3: NEW.scheduled_at
    -- PRIORIDADE 4: fallback to_char(now() AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM')
    v_competence := COALESCE(
        NEW.planning_competence, 
        NEW.metadata->>'mes_referencia', 
        to_char(NEW.scheduled_at, 'YYYY-MM'),
        to_char(now() AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM')
    );
    NEW.planning_competence := v_competence;
    
    -- FAIL-CLOSED FORMAT NORMALIZATION
    v_format := COALESCE(NEW.metadata->>'tipo_entrega', NEW.platform, 'UNKNOWN');
    v_format := lower(v_format);
    
    IF v_format IN ('reel', 'reels') THEN
        v_format := 'reels';
    ELSIF v_format IN ('carrossel', 'carousel', 'carousels') THEN
        v_format := 'carousels';
    ELSIF v_format IN ('story', 'stories') THEN
        v_format := 'stories';
    ELSIF v_format IN ('post estático', 'post estatico', 'static post', 'static_posts') THEN
        v_format := 'static_posts';
    ELSE
        RAISE EXCEPTION 'BLOCKED_UNKNOWN_CONTENT_FORMAT: Format % is not explicitly mapped or allowed.', v_format;
    END IF;

    -- Limit mocking (assuming 2 for reels/carousels, 0 for stories/static_posts for Executa client)
    v_limit := CASE WHEN v_format IN ('reels', 'carousels') THEN 2 ELSE 0 END; 

    SELECT count(*) INTO v_consumption 
    FROM public.content_assets 
    WHERE project_id = NEW.project_id 
      AND planning_competence = v_competence 
      AND (
          (lower(COALESCE(metadata->>'tipo_entrega', platform)) IN ('reel', 'reels') AND v_format = 'reels') OR
          (lower(COALESCE(metadata->>'tipo_entrega', platform)) IN ('carrossel', 'carousel', 'carousels') AND v_format = 'carousels') OR
          (lower(COALESCE(metadata->>'tipo_entrega', platform)) IN ('story', 'stories') AND v_format = 'stories') OR
          (lower(COALESCE(metadata->>'tipo_entrega', platform)) IN ('post estático', 'post estatico', 'static post', 'static_posts') AND v_format = 'static_posts')
      )
      AND status NOT IN ('CANCELLED', 'DELETED', 'excluido');

    IF v_consumption < v_limit THEN
        INSERT INTO public.contract_scope_audit_log (event_type, client_id, project_id, competence, content_format, contracted_limit, current_consumption, source, result)
        VALUES ('SCOPE_CHECK_WITHIN_CONTRACT', v_client_id, NEW.project_id::uuid, v_competence, v_format, v_limit, v_consumption, 'DB_TRIGGER', 'ALLOWED');
        RETURN NEW;
    ELSE
        SELECT * INTO v_exception_record 
        FROM public.contract_scope_exception_requests
        WHERE client_id = v_client_id 
          AND competence = v_competence 
          AND content_format = v_format 
          AND status = 'DIRECTOR_APPROVED_EXCEPTION'
          AND consumed_quantity < requested_extra_quantity
          AND (expiration_date IS NULL OR expiration_date >= current_date)
        ORDER BY created_at ASC LIMIT 1
        FOR UPDATE;

        IF FOUND THEN
            UPDATE public.contract_scope_exception_requests 
            SET consumed_quantity = consumed_quantity + 1,
                status = CASE WHEN consumed_quantity + 1 >= requested_extra_quantity THEN 'EXCEPTION_CONSUMED' ELSE status END,
                updated_at = now()
            WHERE id = v_exception_record.id;
            
            NEW.contract_exception_request_id := v_exception_record.id;
            
            INSERT INTO public.contract_scope_audit_log (event_type, client_id, project_id, competence, content_format, exception_request_id, source, result)
            VALUES ('CONTENT_CREATED_WITH_EXCEPTION', v_client_id, NEW.project_id::uuid, v_competence, v_format, v_exception_record.id, 'DB_TRIGGER', 'ALLOWED_WITH_EXCEPTION');
            
            RETURN NEW;
        ELSE
            INSERT INTO public.contract_scope_audit_log (event_type, client_id, project_id, competence, content_format, contracted_limit, current_consumption, source, result, reason)
            VALUES ('SCOPE_CHECK_BLOCKED', v_client_id, NEW.project_id::uuid, v_competence, v_format, v_limit, v_consumption, 'DB_TRIGGER', 'BLOCKED', 'No valid exception found');
            
            RAISE EXCEPTION 'BLOCKED_BY_CONTRACT_SCOPE';
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_content_scope_guard ON public.content_assets;
CREATE TRIGGER trigger_content_scope_guard
BEFORE INSERT ON public.content_assets
FOR EACH ROW EXECUTE FUNCTION public.check_contract_scope_before_insert();

CREATE OR REPLACE FUNCTION public.check_director_approval_update()
RETURNS trigger AS $$
DECLARE
    v_role text;
BEGIN
    IF NEW.status = 'DIRECTOR_APPROVED_EXCEPTION' AND OLD.status != 'DIRECTOR_APPROVED_EXCEPTION' THEN
        v_role := (auth.jwt()->'app_metadata'->>'role');
        IF v_role IS NULL OR v_role != 'DIRECTOR' THEN
            RAISE EXCEPTION 'FORBIDDEN: Only DIRECTOR can approve exception requests.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_exception_director_guard ON public.contract_scope_exception_requests;
CREATE TRIGGER trigger_exception_director_guard
BEFORE UPDATE ON public.contract_scope_exception_requests
FOR EACH ROW EXECUTE FUNCTION public.check_director_approval_update();
