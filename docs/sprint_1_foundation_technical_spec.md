# SPRINT 1 FOUNDATION TECHNICAL SPECIFICATION (WAVE 1)
## docs/sprint_1_foundation_technical_spec.md

DOCUMENT_REVISION: R1
GATE: GATE_3_1D_WAVE_1
MODULES: MOD-01 (Central de Comando) & MOD-02 (Onboarding & Governança)
BLUEPRINT_ALIGNMENT: CS-001.3C R3 / CS-001.3D R1 / Gate 3.1B R1 / Gate 3.1C R1

---

## 1. ESCOPO DAS ALTERAÇÕES LOCAIS (WAVE 1)

1. **Migration DDL:** `supabase/migrations/20260722000001_sprint_1_foundation_schema.sql`
   - Define funções utilitárias R5 `SECURITY DEFINER`: `current_user_role()`, `current_user_client_id()`, `is_admin_or_operator()`, `can_access_client()`.
   - Garante RLS ativado nas tabelas `governance_users`, `profiles`, `projects`.
   - Aplica `REVOKE ALL ON ... FROM anon` para forçar o código de erro PostgreSQL `42501`.
   - Declara políticas RLS de seleção para o papel `authenticated`.

2. **Rollback DDL:** `supabase/rollbacks/20260722000001_sprint_1_foundation_schema_rollback.sql`
   - Remove as políticas RLS adicionadas na Sprint 1 e reverte as permissões mantendo a segurança R5.

3. **Suíte de Testes Automatizados Locais:**
   - `supabase/tests/sprint_1_foundation_structure_test.sql` (Verifica funções e RLS).
   - `supabase/tests/sprint_1_foundation_security_42501_test.sql` (Verifica revogação anônima).

---

## 2. RASTREABILIDADE E R5 BASELINE PRESERVATION

- Todas as alterações preservam 100% da homologação FND-00000002 R5.
- Zero acesso anônimo permitido.
- Nenhuma alteração remota foi executada (`REMOTE_DATABASE_CHANGED: NO`, `STAGING_CHANGED: NO`, `PRODUCTION_CHANGED: NO`).
