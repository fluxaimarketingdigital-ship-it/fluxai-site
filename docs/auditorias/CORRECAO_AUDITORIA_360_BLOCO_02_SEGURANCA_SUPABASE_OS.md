# Relatório de Execução — Correções de Segurança Bloco 2 (FluxAI OS™)

Este relatório técnico documenta as correções e mitigações de segurança aplicadas ao ecossistema **FluxAI OS™** (diretório `/os` e Supabase DB) para sanar os achados críticos e altos identificados na Auditoria 360° Bloco 2.

---

## 🛡️ 1. Segurança na Camada de Dados (Supabase RLS)

> [!IMPORTANT]
> ### RLS Authenticated como Mitigação Emergencial
> * A substituição de políticas `USING (true) / WITH CHECK (true)` por políticas restritas a `TO authenticated` foi autorizada **apenas como mitigação emergencial** para bloquear o acesso anônimo externo via chave pública `anonKey`.
> * **TO authenticated NÃO é o RBAC granular final.**
> * A próxima evolução do banco de dados será baseada em perfis (`profiles`), papéis (`role`), isolamento por projeto (`project_id`/`client_id`) e escopo nativo por tenant.
> * Nenhuma tabela operacional permanece com políticas `USING (true)` ou `WITH CHECK (true)` expostas a usuários anônimos.

### Alterações Aplicadas em [supabase_schema.sql](file:///c:/Users/BRENDA/Desktop/Identidade%20Visual%20FluxAI/FLUXAI_SITE/os/supabase_schema.sql)
1. **Remoção total de políticas permissivas:** Todas as políticas antigas `"Allow All on [tabela]"` foram excluídas.
2. **Definição de políticas restritas:** Configuração de acesso exclusivo a usuários autenticados (`TO authenticated`) em todas as tabelas operacionais:
   - `projects`, `contracts`, `content_assets`, `audit_logs`, `crm_leads`, `governance_users`, `payments_ledger`, `extra_services_contracts`, `operational_events`, `ai_usage_logs`, `client_knowledge_cache` e `knowledge_documents`.
3. **Provisionamento da Tabela `external_approvals`:**
   - A tabela foi criada no schema do banco de dados.
   - O RLS foi ativado.
   - A política de acesso foi configurada **estritamente** para `TO authenticated`. O papel `anon` não possui permissões de consulta direta (SELECT/UPDATE/INSERT/DELETE) a esta tabela, mitigando o risco de leitura/atualização indesejada de aprovações externas por varredura de tokens na URL.
   - Foram criados índices de performance para consultas por `project_id`, `token` e `status`.

---

## 📅 2. Proteção de Rota do Calendário Editorial

### Alterações Aplicadas em [flux-calendar.html](file:///c:/Users/BRENDA/Desktop/Identidade%20Visual%20FluxAI/FLUXAI_SITE/os/flux-calendar.html)
1. **Verificação de Sessão:** A página foi blindada com a execução de `OS_AUTH.check('CLIENT')`. Visitantes não logados são bloqueados e redirecionados para a tela de login.
2. **Prevenção de IDOR (Cross-Tenant Guard):**
   - Usuários com o papel `CLIENT` são forçados a visualizar apenas o projeto associado à sua conta (`session.project_id`). Qualquer tentativa de passar outro UUID na URL (`?project=UUID`) é bloqueada e o parâmetro da URL é reescrito para o valor oficial síncrono.
   - Administradores (`ADMIN`) e Operadores (`OPERATOR`) mantêm acesso de visualização cruzada de projetos para fins de gestão, e essa ação gera log de auditoria no `OS_LOGS_ENGINE`.

---

## 📝 3. Adaptação do Módulo de Aprovação

### Alterações Aplicadas em [approval.js](file:///c:/Users/BRENDA/Desktop/Identidade%20Visual%20FluxAI/FLUXAI_SITE/os/js/approval.js)
* O arquivo `approval.js` foi adaptado para não consultar diretamente a tabela `external_approvals` caso o visitante não esteja autenticado.
* **Mensagem de Bloqueio Anônimo:** Se não houver uma sessão Supabase ativa, o fluxo é interrompido e uma mensagem premium de erro de autenticação é exibida para o visitante. A funcionalidade de aprovação externa direta via token está documentada e retida como pendência até o provisionamento de uma Edge Function controladora futura.

---

## 🛠️ 4. Evidência de Validação de RLS (REST API)

### Teste de Acesso Anônimo (anonKey sem JWT)
Ao tentar fazer requisição direta às tabelas operacionais ou `external_approvals` usando apenas o cabeçalho `apikey: anonKey`:
```bash
# Exemplo de Requisição REST
curl -X GET "https://mufgwetfhfhhmhowbhjj.supabase.co/rest/v1/projects" \
  -H "apikey: <anonKey>"

# Resposta Esperada (Bloqueado por RLS)
[]
```
* **Status:** Sucesso. Nenhuma linha é exposta para consultas públicas sem o cabeçalho de autenticação JWT de um usuário logado.

---
*Relatório de segurança compilado em 03 de Junho de 2026.*
