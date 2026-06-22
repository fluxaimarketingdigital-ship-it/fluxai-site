# STG-03: PLANO DE MIGRATIONS DE STAGING

## Fase 1 — Reprodução Estrutural (Schema)
1. `001_base_schema.sql`: Criar tabelas primárias (Users, Services, Clients, Financials).
2. `002_functions.sql`: Reproduzir funções nativas (`executar_webhook`, etc).

## Fase 2 — Seeds Sintéticos
3. `003_seed_governance.sql`: Popular tabela com `STG_ADMIN`, `STG_OP`, `STG_CLIENT_A`.
4. `004_seed_test_data.sql`: 1 Demanda Fictícia, 1 Serviço Fictício.

## Fase 3 — Isolamento RLS (Correção Futura)
5. `005_rls_security_patch.sql`:
   * Dropar todas as 18 policies atreladas a `USING (true)`.
   * Recriar policies atreladas ao modelo de autorização `governance_users` atrelado a `auth.uid()`.

## Rollback
* Arquivo `999_teardown_stg.sql` com instrução única: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`.
