# Guia de Execução — Supabase Schema v4.0.0

## Como rodar o schema agora

### Passo 1 — Abrir o SQL Editor

1. Acesse: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique no seu projeto FluxAI OS™
3. No menu lateral esquerdo, clique em **SQL Editor**
4. Clique em **"New query"** (botão azul no topo)

---

### Passo 2 — Copiar o SQL

Copie **todo o conteúdo** do arquivo:

```
os/supabase_schema.sql
```

Cole no editor e clique em **"Run"** (ou `Ctrl+Enter`).

> O script usa `CREATE TABLE IF NOT EXISTS` e `ALTER TABLE IF NOT EXISTS`, então é **100% seguro rodar mesmo se o banco já existia**. Nenhum dado será perdido.

---

### Passo 3 — Verificar as tabelas criadas

Após rodar, vá em **Table Editor** e confirme que as seguintes tabelas existem:

| # | Tabela | Criada em | Descrição / Função no Ecossistema |
|---|--------|-----------|-----------------------------------|
| 1 | `projects` | v1.0 | Workspace e metadados de cada marca/cliente |
| 2 | `contracts` | v1.0 | Contratos de recorrência e governança financeira |
| 3 | `governance_users` | v1.0 | Usuários do OS e perfis de permissão (RBAC) |
| 4 | `content_assets` | v1.0 | Planejamento, pautas e criativos do motor de conteúdo |
| 5 | `audit_logs` | v1.0 | Logs de auditoria do sistema e ações de operadores |
| 6 | `crm_leads` | v3.0 | Captação e inteligência comercial de leads |
| 7 | `payments_ledger` | v3.0 | Razão financeiro, faturamentos, PIX e comprovantes |
| 8 | `extra_services_contracts` | v3.0 | Contratos de serviços extras e add-ons (avulsos) |
| 9 | `operational_events` | v3.0 | Barramento de eventos operacionais e timeline de valor |
| 10 | `ai_usage_logs` | **v4.0** ← nova | Auditoria de uso e controle de custos de chamadas de IA |
| 11 | `client_knowledge_cache` | **v4.0** ← nova | Contexto consolidado pré-compilado de marcas para a IA |
| 12 | `knowledge_documents` | **v4.0** ← nova | Documentação de briefing e playbooks para RAG semântico |
| 13 | `external_approvals` | **v4.0** ← nova | Solicitações de aprovação externa via token de alta entropia |

---

### Passo 4 — Verificar colunas novas na tabela `projects`

Vá em **Table Editor → projects** e confirme:

- `workspace_type` (TEXT, default: `'CLIENT'`)
- `is_billing_exempt` (BOOLEAN, default: `false`)

Se não aparecer, rode apenas este trecho no SQL Editor:

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workspace_type TEXT DEFAULT 'CLIENT';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_billing_exempt BOOLEAN DEFAULT false;
```

---

### Passo 5 — Criar o projeto FluxAI Labs (INTERNAL_WORKSPACE)

Após rodar o schema, execute este INSERT para criar o workspace interno da FluxAI:

```sql
INSERT INTO projects (
    id,
    company_name,
    segment,
    status,
    workspace_type,
    is_billing_exempt,
    metadata
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'FluxAI Labs',
    'Agência de Marketing Digital & Tecnologia',
    'ATIVO',
    'INTERNAL_WORKSPACE',
    true,
    '{"is_test_environment": true, "allow_benchmark": true, "tone_of_voice": "Técnico, direto, confiável, premium"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
```

> **IMPORTANTE:** O `id` fixo `a0000000-0000-0000-0000-000000000001` é o `FLUXAI_LABS_PROJECT.id` referenciado no código. Se já existir, o `ON CONFLICT DO NOTHING` garante que não duplica.

---

### Passo 6 — Configurar Chave OpenAI (para o Knowledge Core™)

1. Na FluxAI OS™, acesse qualquer módulo com IA (ex: Content Engine™)
2. Clique no botão **"Configurar OpenAI"** ou na engrenagem ⚙️
3. Insira sua chave `sk-...`

A chave fica salva em `localStorage` e é usada em todas as chamadas do `os-knowledge-core.js`.

---

## Arquitetura Final v4.0.0

```
FluxAI OS™ v4.0.0
│
├── CORE ENGINE
│   ├── os-core.js          ← Auth + RBAC + Sidebar + Topbar (com context switcher)
│   ├── os-state.js         ← Estado global (Master/Labs/Cliente)
│   └── os-integration.js   ← Event Bus + Financial + Operational Linking™
│
├── KNOWLEDGE CORE™ (NOVO)
│   ├── os-knowledge-core.js     ← Context Engine + Cache + AI Router
│   ├── os-prompt-templates.js   ← 16 templates de prompt prontos
│   └── os-vertical-knowledge.js ← Regras éticas/legais por nicho
│
├── WORKSPACE INTERNO (NOVO)
│   └── fluxai-labs.html    ← Workspace FluxAI Labs (INTERNAL_WORKSPACE)
│
└── DATABASE (13 tabelas | RLS Mitigado 'authenticated')
    ├── projects            ← workspace_type + is_billing_exempt (NOVO)
    ├── ai_usage_logs       ← (NOVO)
    ├── client_knowledge_cache ← (NOVO)
    ├── knowledge_documents ← (NOVO)
    └── external_approvals  ← (NOVO)
```
