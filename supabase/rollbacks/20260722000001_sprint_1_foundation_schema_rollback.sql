-- ============================================================================
-- FLUXAI OS™ — SPRINT 1 FOUNDATION ROLLBACK SCRIPT (WAVE 1)
-- File: supabase/rollbacks/20260722000001_sprint_1_foundation_schema_rollback.sql
-- Revision: R1
-- Blueprint Alignment: CS-001.3D R1 / Gate 3.1B R1 / Gate 3.1D R1
-- ============================================================================

DO $$
BEGIN
  -- Drop Sprint 1 RLS Policies
  DROP POLICY IF EXISTS p_projects_select ON public.projects;
  DROP POLICY IF EXISTS p_profiles_select ON public.profiles;
  DROP POLICY IF EXISTS p_governance_users_select ON public.governance_users;

  -- Re-grant R5 baseline defaults if necessary
  GRANT SELECT ON public.governance_users TO authenticated;
  GRANT SELECT ON public.profiles TO authenticated;
  GRANT SELECT ON public.projects TO authenticated;

  -- Revoke anon access (Maintain R5 Error 42501)
  REVOKE ALL ON public.governance_users FROM anon;
  REVOKE ALL ON public.profiles FROM anon;
  REVOKE ALL ON public.projects FROM anon;
END $$;
