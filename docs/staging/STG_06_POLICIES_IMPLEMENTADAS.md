# STG-06: GATE 6 — POLICIES IMPLEMENTADAS E MIGRATIONS RLS

**Referência Técnica:** `20260618000005_rbac_policies.sql`

## Operações Aplicadas
* **Profiles (Governança):**
  - Select Livre (Apenas leitura do PRÓPRIO ID).
  - Select Admin (Leitura Master para Perfis).
  - Update Admin (Unicamente Admins podem modificar Roles).
* **CRM Leads:**
  - Select Admin.
  - As inserções ou visualizações dos Operadores não necessitam mais de bypass, pois dependem de functions.

O `USING(true)` não existe mais no schema compilado em `staging/fluxai-os`.
