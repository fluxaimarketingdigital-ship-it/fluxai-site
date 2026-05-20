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

| # | Tabela | Criada em |
|---|--------|-----------|
| 1 | `projects` | v1.0 |
| 2 | `contracts` | v1.0 |
| 3 | `governance_users` | v1.0 |
| 4 | `content_assets` | v1.0 |
| 5 | `audit_logs` | v1.0 |
| 6 | `payments_ledger` | v3.0 |
| 7 | `extra_services_contracts` | v3.0 |
| 8 | `operational_events` | v3.0 |
| 9 | `ai_usage_logs` | **v4.0** ← nova |
| 10 | `client_knowledge_cache` | **v4.0** ← nova |
| 11 | `knowledge_documents` | **v4.0** ← nova |

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
└── DATABASE (11 tabelas)
    ├── projects            ← workspace_type + is_billing_exempt (NOVO)
    ├── ai_usage_logs       ← (NOVO)
    ├── client_knowledge_cache ← (NOVO)
    └── knowledge_documents ← (NOVO)
```
