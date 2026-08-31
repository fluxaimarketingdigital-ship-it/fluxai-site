-- ============================================================================
-- FLUXAI OS™ — SPRINT 1 FOUNDATION MIGRATION (WAVE 1)
-- File: supabase/migrations/20260722000001_sprint_1_foundation_schema.sql
-- Revision: R1
-- Scope: MOD-01 (Central de Comando) & MOD-02 (Onboarding & Governança)
-- Blueprint Alignment: CS-001.3C R3 / CS-001.3D R1 / Gate 3.1B R1
-- ============================================================================

-- 1. SECURITY DEFINER HELPER FUNCTIONS (R5 BASELINE)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role',
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role',
    'anon'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_client_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'client_id')::uuid,
    ((auth.jwt() ->> 'app_metadata')::jsonb ->> 'client_id')::uuid,
    NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_operator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_role() IN ('ADMIN', 'OPERATOR', 'service_role');
$$;

CREATE OR REPLACE FUNCTION public.can_access_client(target_client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin_or_operator() OR (public.current_user_client_id() = target_client_id);
$$;

-- 2. ENSURE RLS ENABLED ON GOVERNANCE TABLES
ALTER TABLE IF EXISTS public.governance_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;

-- 3. ANONYMOUS ACCESS REVOCATION (ENFORCE POSTGREST HTTP 42501)
REVOKE ALL ON public.governance_users FROM anon;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.projects FROM anon;

-- GRANT CONTROLLED ACCESS TO AUTHENTICATED & SERVICE_ROLE
GRANT SELECT, INSERT, UPDATE ON public.governance_users TO authenticated;
GRANT ALL ON public.governance_users TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

-- 4. RLS POLICIES FOR SPRINT 1 FOUNDATION
DO $$
BEGIN
  -- governance_users policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'p_governance_users_select' AND tablename = 'governance_users') THEN
    CREATE POLICY p_governance_users_select ON public.governance_users
      FOR SELECT TO authenticated
      USING (public.is_admin_or_operator() OR id = auth.uid());
  END IF;

  -- profiles policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'p_profiles_select' AND tablename = 'profiles') THEN
    CREATE POLICY p_profiles_select ON public.profiles
      FOR SELECT TO authenticated
      USING (public.is_admin_or_operator() OR id = auth.uid());
  END IF;

  -- projects policy
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'p_projects_select' AND tablename = 'projects') THEN
    CREATE POLICY p_projects_select ON public.projects
      FOR SELECT TO authenticated
      USING (public.is_admin_or_operator() OR public.can_access_client(client_id));
  END IF;
END $$;
