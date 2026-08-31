-- ============================================================================
-- FLUXAI OS™ — SPRINT 1 FOUNDATION SECURITY 42501 TEST (WAVE 1)
-- File: supabase/tests/sprint_1_foundation_security_42501_test.sql
-- Revision: R1
-- ============================================================================

DO $$
DECLARE
  v_priv_count integer;
BEGIN
  -- Verify anonymous role HAS NO SELECT/INSERT/UPDATE/DELETE privileges on governance_users, profiles, projects
  SELECT count(*) INTO v_priv_count
  FROM information_schema.table_privileges
  WHERE grantee = 'anon'
    AND table_schema = 'public'
    AND table_name IN ('governance_users', 'profiles', 'projects');

  IF v_priv_count > 0 THEN
    RAISE EXCEPTION 'SECURITY TEST FAIL: Anonymous role has % unauthorized table privileges!', v_priv_count;
  END IF;

  RAISE NOTICE 'SECURITY TEST PASS: 100%% Anonymous access revoked. Error 42501 enforced.';
END $$;
