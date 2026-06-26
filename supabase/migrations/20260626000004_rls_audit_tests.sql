-- MIGRATION: 20260626000004_rls_audit_tests.sql
-- FASE D: Testes Automatizados de Isolamento Multi-Tenant
-- Descrição: Simula autenticação e realiza assertions para atestar que os dados estão hermeticamente fechados.

DO $$
DECLARE
  v_count INT;
BEGIN
  -- ---------------------------------------------------------
  -- TESTE 1: ADMIN (Visibilidade Global)
  -- ---------------------------------------------------------
  -- MOCK Auth (Seta a role authenticated e injeta o UUID no sub (claim do JWT))
  SET ROLE authenticated;
  PERFORM set_config('request.jwt.claims', '{"sub": "11111111-1111-1111-1111-111111111111"}', true);
  
  SELECT count(*) INTO v_count FROM public."FINANCEIRO_CLIENTES";
  IF v_count < 3 THEN
    RAISE EXCEPTION 'TESTE 1 FALHOU: Admin deveria ver todos os registros financeiros.';
  END IF;

  -- ---------------------------------------------------------
  -- TESTE 2: CLIENTE_A (Visibilidade Estrita)
  -- ---------------------------------------------------------
  PERFORM set_config('request.jwt.claims', '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}', true);
  
  SELECT count(*) INTO v_count FROM public."FINANCEIRO_CLIENTES";
  IF v_count <> 2 THEN
    RAISE EXCEPTION 'TESTE 2 FALHOU: CLIENTE_A viu % registros financeiros. Deveria ver 2.', v_count;
  END IF;
  
  -- Checagem Cruzada: Garantir que nenhum ID do Cliente B vazou
  SELECT count(*) INTO v_count FROM public."FINANCEIRO_CLIENTES" WHERE client_id = 'CLIENTE_B';
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TESTE 2 FALHOU: VAZAMENTO CRÍTICO! CLIENTE_A conseguiu ler registros do CLIENTE_B.';
  END IF;

  -- ---------------------------------------------------------
  -- TESTE 3: CLIENTE_B (Visibilidade Estrita)
  -- ---------------------------------------------------------
  PERFORM set_config('request.jwt.claims', '{"sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}', true);
  
  SELECT count(*) INTO v_count FROM public."FINANCEIRO_CLIENTES";
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TESTE 3 FALHOU: CLIENTE_B viu % registros financeiros. Deveria ver 1.', v_count;
  END IF;

  -- ---------------------------------------------------------
  -- TESTE 4: USUARIO_SEM_CLIENTE (Visibilidade Zero)
  -- ---------------------------------------------------------
  PERFORM set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000000"}', true);
  
  SELECT count(*) INTO v_count FROM public."FINANCEIRO_CLIENTES";
  IF v_count <> 0 THEN
    RAISE EXCEPTION 'TESTE 4 FALHOU: Usuário sem client_id conseguiu acessar % registros.', v_count;
  END IF;

  -- Limpar contexto
  RESET ROLE;
  
  RAISE NOTICE 'AUDITORIA CONCLUÍDA: ISOLAMENTO MULTI-TENANT 100%% HOMOLOGADO. NENHUM VAZAMENTO DETECTADO.';
END;
$$;
