# STG-03: INVENTÁRIO DE BACKUPS (ESTRUTURAL)

## Gate 3 — Repositório
* **Status Git:** Branch `main` estabilizada (congelada para esta auditoria). 
* **Tagging:** Será necessária a criação da tag `v1.0-pre-staging` antes do branching.

## Gate 4 — Supabase (Exportações Preparatórias)
Foram logicamente segmentados e documentados (para extração via CLI) os seguintes artefatos:
* `backups/stg-preflight/supabase/schema/` (Estrutura de tabelas operacionais).
* `backups/stg-preflight/supabase/policies/` (Arquivo `20260607_rls_homologacao.sql`).
* `backups/stg-preflight/supabase/functions/` (Edge functions mapeadas).
* **Ausência:** Nenhum usuário real foi exportado (`auth.users`), garantindo isolamento de PII (Personally Identifiable Information).

## Gate 5 — Make (Cenários)
* Todos os 24 Cenários, 1 Auxiliar (5369903) e 1 Sandbox (5406168) (Total 26 itens) permanecem inalterados.
* Blueprints dos cenários 10 e da Sandbox 10 já constam do repositório físico.

## Gate 6 — Google Workspace
* A planilha `Base Operacional` de PROD possui cópia virtual validada para extração estrutural (sem dados preenchidos).
* IDs sensíveis não constam nos arquivos estáticos do sistema.
