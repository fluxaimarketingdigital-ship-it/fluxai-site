# 🛡️ HOMOLOGAÇÃO FASE 11 — AUDITORIA DE GOVERNANÇA, LOGS E PERMISSÕES

**Status:** Concluído
**Data da Auditoria:** 2026-07-08
**Regra seguida:** NENHUM código foi alterado.

Esta auditoria focou na arquitetura de Controle de Acesso Baseado em Papéis (RBAC), registro de logs e na segurança Row Level Security (RLS) do Supabase.

---

## 1. Mapeamento das Tabelas e Engines

### 1. `governance_users`
- **Uso:** É a tabela oficial usada durante o login (`os/login.html` e `os-core.js`) para mapear o email autenticado a um papel operacional (`ADMIN`, `OPERATOR`, `CLIENT`).
- **Problema Crítico de Segurança:** Suas políticas (RLS) no `supabase_schema.sql` estão como `USING (true) WITH CHECK (true)` para a role `authenticated`. Isso significa que **qualquer cliente logado pode ler e modificar a tabela inteira**, inclusive elevar seus próprios privilégios para `ADMIN`.

### 2. `profiles`
- **Uso:** Encontrada em migrations legadas (`20260627000004` e `20260618000001`). 
- **Status:** Não é mais utilizada pelo núcleo do OS (`os-core.js`). O sistema consolida as identidades em `governance_users`.

### 3. `audit_logs` e 4. `operational_events`
- **Uso:** Destinadas a armazenar logs do sistema (eventos de segurança, navegação e alterações contratuais/financeiras).
- **Problema Crítico de Segurança:** Possuem a mesma vulnerabilidade de RLS. Qualquer usuário `authenticated` pode inserir, modificar ou apagar logs (inclusive destruir todo o registro de auditoria do sistema e ler dados confidenciais de eventos de outros clientes).

### 5. `OS_LOGS_ENGINE`
- **Uso:** Módulo front-end (`os/services/logs-engine.js`) acionado em várias telas para registrar ações (`OS_LOGS_ENGINE.userAction`).
- **Problema:** Sendo um script executado puramente no navegador (client-side), ele não garante a imutabilidade dos logs.

---

## 2. Validação Operacional (RBAC e Logs)

### 6. RBAC por ADMIN, OPERATOR e CLIENT
- O fluxo de autorização (`OS_AUTH_BOOTSTRAP` em `os-core.js`) reconstrói o contexto da sessão em RAM (`window.FLUXAI_RUNTIME_CONTEXT`).
- **Vulnerabilidade:** A validação é predominantemente **client-side**. Se um atacante usar as DevTools do navegador para alterar `window.FLUXAI_RUNTIME_CONTEXT.role = 'ADMIN'`, ele bypassa as proteções do front-end. O que segura o dado real no back-end é o RLS, que atualmente está escancarado.

### 7. Permissões de Menus
- O método `OS_UI.renderSidebar` filtra a exibição dos menus baseado na role armazenada no contexto local. Funciona bem visualmente, mas não oferece proteção contra acessos diretos via URL ou API, já que a RLS do Supabase permite acesso total a quem estiver logado.

### 8. Logs de Alterações Críticas e 10. Eventos sem log
- **Problema:** Qualquer manipulação direta de banco de dados feita por requisições HTTP forjadas (Postman, cURL) usando o token JWT válido do usuário gerará **zero logs** na tabela `audit_logs`, porque a criação do log dependia de a interface gráfica JS disparar a função.

### 9. Tentativas Bloqueadas (Acesso Negado)
- Falhas de login (`signInWithPassword`) acionam `OS_LOGS_ENGINE.security('SECURITY_ACCESS_DENIED')`. Porém, se a gravação depender do Supabase client autenticado, essa gravação falhará, pois a tentativa de login fracassou (usuário não está logado). Logo, logs de brute-force se perdem.

---

## 3. Conclusão e Correção Mínima Proposta

### 🚨 11. Riscos de Permissões Excessivas
Atualmente, o sistema possui **IDOR (Insecure Direct Object Reference) Global** e **Privilege Escalation**. As tabelas `governance_users`, `audit_logs`, `operational_events`, `projects`, `content_assets` e as recém-migradas (`CONTRATOS_CLIENTES`, etc.) permitem que **qualquer pessoa logada (mesmo um Cliente)** leia, apague e edite dados de todos os outros clientes e do próprio sistema FluxAI.

### 🛠️ 12. Correção Mínima Proposta (Fase de Mitigação)
Para estancar a vulnerabilidade sem reconstruir o sistema inteiro, os seguintes passos devem ser implementados na próxima fase via SQL (Supabase):

1. **Restringir `governance_users`**: Criar RLS para que o usuário só possa ler a sua própria linha (baseado em `auth.uid()`) e apenas contas marcadas como `ADMIN` possam fazer UPDATE/INSERT. 
2. **Restringir Tabelas de Log (`audit_logs`, `operational_events`)**: Permitir para a role `authenticated` **apenas INSERT**. Bloquear UPDATE e DELETE integralmente (ninguém apaga logs, nem o admin). Para leitura, apenas `ADMIN` e `OPERATOR` podem ler.
3. **Restringir Dados Transacionais (`projects`, `CONTRATOS_CLIENTES`, etc.)**: 
   - Usuário tipo `CLIENT` só pode fazer SELECT se o `project_id` ou `client_id` for igual ao `scoped_project_id` presente no seu perfil `governance_users`.
   - Adicionar uma *Postgres Function* `check_is_admin_or_operator(auth.uid())` para permitir acesso global à equipe da agência.
4. Remover do código do front-end (`login.html` e `os-core.js`) qualquer dependência de `ALLOWLIST` hardcoded, forçando 100% da verdade a vir do `governance_users`.
