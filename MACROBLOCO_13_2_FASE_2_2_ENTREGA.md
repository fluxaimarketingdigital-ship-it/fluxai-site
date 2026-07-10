# MACROBLOCO 13.2 — FASE 2.2: MIGRAÇÃO DO CONTEXTO ATIVO

**Objetivo:** Eliminar a dependência direta de `localStorage` para a definição e leitura do projeto ativo (`fluxai_current_project_id`), centralizando a governança de estado exclusivamente no `OSState`.

## 1. Arquivos Alterados
*   `os/js/utils/ui-helpers.js`
*   `os/js/os-core.js`

## 2. Leituras Removidas & Substituídas
Foram eliminadas todas as quebras de arquitetura (onde o sistema driblava a gerência de estado para ler o disco diretamente).

*   **Em `os/js/utils/ui-helpers.js`:** 
    *   **Removido:** `localStorage.setItem('fluxai_current_project_id', newProj);` (Linha 53)
    *   **Substituído por:** `OSState.set('activeProjectId', newProj);`
    *   Foi injetado o import do `OSState` no topo do arquivo.

*   **Em `os/js/os-core.js`:** 
    *   **Removido:** `localStorage.getItem('fluxai_current_project_id')` (Linhas 138, 141) no momento de montar os links da Sidebar (client-portal e flux-calendar).
    *   **Substituído por:** Apenas `OSState.get('activeProjectId')`.
    *   **Removido:** `localStorage.getItem('fluxai_current_project_id')` (Linha 213) na montagem da Topbar.
    *   **Substituído por:** `OSState.get('activeProjectId')`.
    *   **Removido:** `localStorage.removeItem('fluxai_current_project_id')` nos tratamentos de erro de RBAC (linha 432), no `logout()` manual (linha 537) e no Guardião de Sessão Remota (linha 562).
    *   **Substituído por:** `OSState.set('activeProjectId', null);`.

*Nota: O OSState continua mantendo internamente a sua persistência privada como cache, mas nenhum outro arquivo além dele tem autorização de falar com o disco rígido para lidar com projetos ativos.*

## 3. Checklist de Teste Pós-Deploy
Para certificar a integridade, o time de QA deverá checar os seguintes itens:
- [ ] Acessar o sistema com perfil Admin e trocar de projeto usando o Dropdown da Topbar. A Topbar deve atualizar o nome da empresa instantaneamente.
- [ ] Clicar no menu `Portal do Cliente` na sidebar. A URL montada deve conter corretamente `?project_id=<UUID_DO_PROJETO_SELECIONADO>`.
- [ ] Efetuar Logout e confirmar que o sistema limpa o contexto da RAM e não retém o projeto anterior na próxima vez que um cliente logar no mesmo navegador.
- [ ] Validar a navegação via perfil CLIENT para garantir que o Identity Resolver / OSState continua detectando o UUID dele no boot.
