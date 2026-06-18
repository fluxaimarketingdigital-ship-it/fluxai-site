# STG-B: SUPABASE INVENTÁRIO

## 5.1 Mapa do Supabase

* **Migrations Ativas:** `20260607_rls_homologacao.sql`
* **Tabelas Operacionais Identificadas:** `projects`, `contracts`, `content_assets`, `audit_logs`, `crm_leads`, `governance_users`, `payments_ledger`, `extra_services_contracts`, `operational_events`, `external_approvals`, `ai_usage_logs`, `client_knowledge_cache`, `knowledge_documents`, `SERVICOS_EXTRAS_CLIENTES`, `FINANCEIRO_CLIENTES`, `DEMANDAS_CLIENTES`, `COMUNICACOES_CLIENTE`, `IA_CREDITOS_CLIENTE`.
* **Auth Referências:** Uso intensivo de `auth.users` via sessão nativa do cliente.
* **Roles / Governance:** O modelo intencionado usa `governance_users`, porém, a aplicação atual das policies utiliza amplamente `TO authenticated`, ignorando a checagem da constraint relacional com `governance_users.role`.

## 5.2 Auditoria de Policies

| Tabela | Operação | Role / Scope | Policy USING / WITH CHECK | Risco de Acesso Cruzado | Acesso a `authenticated` | Classificação |
|---|---|---|---|---|---|---|
| Múltiplas (18) | SELECT/ALL | Genérico | `USING (true)` / `WITH CHECK (true)` | Crítico | Sim | CRÍTICA |
| `governance_users` | ALL | Genérico | `USING (true)` | Crítico | Sim | CRÍTICA |
| `payments_ledger` | ALL | Genérico | `USING (true)` | Crítico | Sim | CRÍTICA |

*Nota Documental: Nenhuma policy corrigida nesta rodada, apenas inventariada. A ausência do `auth.uid()` ou junção com `client_id` na expressão `USING` expõe vulnerabilidade arquitetural validada.*

## 5.3 Tabelas Críticas e Risco Residual

1. `governance_users`: A tabela que deve servir de cofre para a role do usuário está exposta a edição/leitura por `authenticated`.
2. `payments_ledger` e `FINANCEIRO_CLIENTES`: Risco financeiro, visíveis por clientes não relacionados.
3. `SERVICOS_EXTRAS_CLIENTES`: Bypass potencial na emissão de autorizações.
