# FLUXAI OS™ — SISTEMA DE CONTEXTO
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_CONTEXT_SYSTEM.md`

---

## O Que É o Sistema de Contexto

O FluxAI OS opera em 3 contextos distintos que determinam:
- Quais itens aparecem na sidebar
- Qual escopo de dados é exibido
- Qual identidade visual é ativada

---

## Contextos Oficiais

### MASTER
**Quem acessa:** ADMIN, OPERATOR
**Escopo:** Todos os clientes ao mesmo tempo
**Sidebar:** Todos os módulos operacionais (sem filtro de cliente)
**Uso:** Operação diária da equipe FluxAI — Centro de Comando, Leads, Demandas, Métricas

### LABS
**Quem acessa:** ADMIN, OPERATOR
**Escopo:** Workspace interno da FluxAI como cliente de si mesma
**Sidebar:** Módulos operacionais + FluxAI Labs
**Uso:** Testes, benchmarks, automações internas da própria FluxAI

### CLIENT
**Quem acessa:** ADMIN, OPERATOR, CLIENT
**Escopo:** Um projeto/cliente específico (via `project_id`)
**Sidebar:** Apenas módulos relevantes ao cliente
**Uso:** Operação focada em um cliente. Portal do cliente. Relatórios individuais.

---

## Fluxo de Contexto

```
Login → SESSION gravada → ADMIN: contexto padrão = MASTER
                       → CLIENT: contexto padrão = CLIENT (project_id fixo)
                       → OPERATOR: contexto padrão = MASTER

Troca de contexto (seletor na topbar):
    ADMIN/OPERATOR → pode alternar MASTER ↔ LABS
    CLIENT → contexto CLIENT fixo, sem alternância
```

---

## Implementação

### Ler contexto atual
```js
import { OSState } from '/os/js/os-state.js';

const context = OSState.get('activeContext') || 'MASTER';
```

### Definir contexto
```js
import { OSState } from '/os/js/os-state.js';
import { ROLE_CONFIG } from '/os/config/os-config.js';

// Verificar se o usuário pode acessar o contexto
if (ROLE_CONFIG.contextAccess[newContext]?.includes(user.role)) {
    OSState.setContext(newContext);
}
```

### Filtrar sidebar por contexto
```js
// os-core.js já implementa isso via:
navItems.filter(item => item.contexts.includes(context))
```

---

## Context + Project ID

Quando o contexto é `CLIENT`, o `project_id` é obrigatório:

```js
const projectId = OSState.get('activeProjectId')
    || localStorage.getItem('fluxai_current_project_id');

if (!projectId && context === 'CLIENT') {
    // Redirecionar para seleção de cliente ou acesso negado
}
```

O `project_id` é passado por query string no portal:
```
client-portal.html?project_id=CLI_XXXX_001
```

---

## OSState — Estado Global

O `OSState` é o store global do OS, persistido em `sessionStorage`.

| Chave | Tipo | Descrição |
|-------|------|-----------|
| `activeContext` | `MASTER` / `LABS` / `CLIENT` | Contexto ativo |
| `activeProjectId` | string | ID do projeto/cliente ativo |
| `activeProject` | object | Dados do projeto ativo |
| `pendingApprovals` | number | Contagem de aprovações pendentes |
| `financialAlerts` | array | Lista de alertas financeiros |

---

## Seletor de Contexto (Topbar)

Visível apenas para ADMIN e OPERATOR:

```html
<!-- Botões Master / Labs -->
<button onclick="window.__OSSetContext('MASTER')">Master</button>
<button onclick="window.__OSSetContext('LABS')">Labs</button>
```

Quando o contexto é `CLIENT`, exibe o nome do cliente ativo em vez dos botões.

---

## Regras de Contexto

1. CLIENT não pode trocar de contexto
2. O contexto é restaurado ao recarregar a página (sessionStorage)
3. O logout limpa o contexto
4. ADMIN sempre inicia em MASTER
5. OPERATOR sempre inicia em MASTER
6. CLIENT sempre inicia em CLIENT com seu project_id
