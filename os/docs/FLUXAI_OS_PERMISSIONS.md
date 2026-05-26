# FLUXAI OS™ — SISTEMA DE PERMISSÕES
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_PERMISSIONS.md`

---

## Papéis Oficiais

| Role | Label | Descrição |
|------|-------|-----------|
| `ADMIN` | Administrador FluxAI | Acesso total. Vê e opera tudo. |
| `OPERATOR` | Operador FluxAI | Acesso operacional. Não altera configurações críticas de sistema. |
| `CLIENT` | Cliente | Acesso exclusivo ao Portal do Cliente com seu `project_id`. |

---

## Matriz de Acesso por Módulo

| Módulo | ADMIN | OPERATOR | CLIENT |
|--------|-------|----------|--------|
| Centro de Comando | ✅ | ✅ | ❌ |
| Novo Cliente (Onboarding) | ✅ | ✅ | ❌ |
| Clientes | ✅ | ✅ | ❌ |
| Demandas | ✅ | ✅ | ❌ |
| Leads | ✅ | ✅ | ❌ |
| Métricas | ✅ | ✅ | ❌ |
| Relatório Mensal | ✅ | ✅ | ❌ |
| Onboarding Estratégico | ✅ | ✅ | ❌ |
| Motor de Conteúdo | ✅ | ✅ | ❌ |
| Inteligência de CRM | ✅ | ✅ | ❌ |
| Central de Automação | ✅ | ✅ | ❌ |
| Análise de Dados | ✅ | ✅ | ❌ |
| FluxAI Labs | ✅ | ❌ | ❌ |
| Portal do Cliente | ✅ | ✅* | ✅ |
| Contratos & Financeiro | ✅ | ❌ | ❌ |
| Governança | ✅ | ❌ | ❌ |
| Gestão de Usuários | ✅ | ❌ | ❌ |

*Operador acessa o portal para visualizar como o cliente vê. Não como o cliente.

---

## Ações por Role — Inteligência de IA

| Ação | ADMIN | OPERATOR | CLIENT |
|------|-------|----------|--------|
| Gerar conteúdo via GPT | ✅ | ✅ | ❌ |
| Ver prompts internos | ✅ | ✅ | ❌ |
| Aprovar rascunho internamente | ✅ | ✅ | ❌ |
| Excluir rascunho (pré-aprovação) | ✅ | ✅ | ❌ |
| Excluir rascunho (pós-aprovação) | ✅ | ✅* | ❌ |
| Controlar créditos de IA | ✅ | ✅ | ❌ |
| Estornar crédito | ✅ | ❌ | ❌ |
| Ver conteúdo disponibilizado | ✅ | ✅ | ✅ |
| Aprovar/Reprovar entrega | ✅ | ✅ | ✅ |

*Operador pode excluir pós-aprovação, mas o estorno de crédito exige confirmação do ADMIN.

---

## Ações por Role — Portal do Cliente

| Ação | ADMIN | OPERATOR | CLIENT |
|------|-------|----------|--------|
| Solicitar serviço extra | ✅ | ✅ | ✅ |
| Enviar briefing | ✅ | ✅ | ✅ |
| Acompanhar status de solicitação | ✅ | ✅ | ✅ |
| Aprovar orçamento | ✅ | ✅ | ✅ |
| Reprovar orçamento | ✅ | ✅ | ✅ |
| Aprovar entrega | ✅ | ✅ | ✅ |
| Reprovar entrega | ✅ | ✅ | ✅ |
| Ver relatório mensal (aprovado) | ✅ | ✅ | ✅ |
| Alterar pacote contratado | ✅ | ❌ | ❌ |
| Alterar créditos de IA | ✅ | ✅ | ❌ |

---

## Contextos de Visualização

O seletor de contexto na topbar controla o escopo da sidebar e dos dados:

| Contexto | Quem Acessa | Escopo |
|----------|-------------|--------|
| `MASTER` | ADMIN, OPERATOR | Todos os clientes, visão global |
| `LABS` | ADMIN, OPERATOR | Workspace interno FluxAI |
| `CLIENT` | ADMIN, OPERATOR, CLIENT | Um cliente específico |

---

## Implementação no Código

### Verificar acesso
```js
import { ROLE_CONFIG } from '/os/config/os-config.js';

// Verifica se o usuário tem acesso mínimo de OPERATOR
if (!ROLE_CONFIG.hasAccess(user.role, ROLE_CONFIG.OPERATOR)) {
    window.location.href = 'access-denied.html';
}
```

### Verificar permissão de módulo
```js
import { ROLE_CONFIG } from '/os/config/os-config.js';

function canAccess(userRole, moduleId) {
    const perms = ROLE_CONFIG.permissions[userRole] || [];
    return perms.includes('*') || perms.includes(moduleId);
}
```

### Verificar ação de IA
```js
import { GPT_CONFIG, ROLE_CONFIG } from '/os/config/os-config.js';

function canGenerateAI(userRole) {
    return GPT_CONFIG.governance.pode_gerar.includes(userRole);
}
```

---

## Usuários Mock (Desenvolvimento)

| Email | Senha | Role |
|-------|-------|------|
| `admin@fluxai.com` | `[env: DEV_ADMIN_PASS]` | ADMIN |
| `kassia@fluxai.com` | `[env: DEV_OP_PASS]` | OPERATOR |
| `cliente@exemplo.com` | `[env: DEV_CLIENT_PASS]` | CLIENT |

> [!WARNING]
> Senhas nunca devem ser expostas no código-fonte. Em produção, apenas Supabase autentica.
