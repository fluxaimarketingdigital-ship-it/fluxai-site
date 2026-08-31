-- ============================================================================
-- FLUXAI OS™ — SPRINT 1 FOUNDATION STRUCTURAL TEST (WAVE 1)
-- File: supabase/tests/sprint_1_foundation_structure_test.sql
-- Revision: R1
-- ============================================================================

DO $$
DECLARE
  v_count integer;
BEGIN
  -- 1. Check helper functions presence
  SELECT count(*) INTO v_count
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname IN ('current_user_role', 'current_user_client_id', 'is_admin_or_operator', 'can_access_client');

  IF v_count < 4 THEN
    RAISE EXCEPTION 'TEST FAIL: Missing helper functions! Found % expected 4', v_count;
  END IF;

  -- 2. Check RLS enabled on core tables
  SELECT count(*) INTO v_count
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN ('governance_users', 'profiles', 'projects')
    AND c.relrowsecurity = true;

  IF v_count < 3 THEN
    RAISE EXCEPTION 'TEST FAIL: RLS not enabled on all core tables! Found % expected 3', v_count;
  END IF;

  RAISE NOTICE 'STRUCTURAL TEST PASS: All helper functions and RLS policies verified.';
END $$;
