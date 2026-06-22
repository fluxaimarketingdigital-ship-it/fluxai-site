# STG-04: GATE 8 E 9 — MIGRATIONS E PATCH RLS

## Arquivos Criados Localmente
Os seguintes scripts físicos `.sql` foram gerados localmente e comitados (sem aplicação na nuvem):
1. `supabase/migrations/20260618000001_base_schema.sql`: Definição de DDL segura e tabelas isoladas.
2. `supabase/migrations/20260618000002_rls_patch.sql`: Contém as regras de segurança estritas.

## Regras RLS Asseguradas
Nenhuma instrução contendo `USING (true)` foi inserida. As tabelas em STG iniciarão com acesso nulo (`DEFAULT DENY`) até a especificação atômica de cada Role (`auth.uid() = user_id`).
