# MACROBLOCO 13.2 — FASE 2: AUDITORIA DO CONTEXTO ATIVO E `fluxai_current_project_id`

**Objetivo:** Mapeamento completo do uso de chaves de contexto, identidade e `localStorage` vinculadas ao roteamento e operação do FluxAI OS™.

*Nenhuma correção, exclusão ou alteração de banco foi feita durante esta auditoria.*

---

## 1. MAPEAMENTO DE OCORRÊNCIAS NO CÓDIGO

### Chave: `fluxai_current_project_id` (No localStorage)
1. **`os/js/utils/ui-helpers.js` | Linha 53 | `changeContext()`**
   - **Quem grava:** Função de mudança de contexto (Dropdown da UI).
   - **Quem lê:** Ninguém diretamente neste arquivo.
   - **Dependência:** Nenhuma direta.
   - **Classificação:** Estado vital proibido (Gravação solta no storage).
   - **Risco de remoção:** Médio (se não trocado por `OSState`).
   - **Ação Recomendada:** 🔴 Não pode permanecer como fonte da verdade. Substituir a gravação por `OSState.set('activeProjectId', ...)`.

2. **`os/js/os-state.js` | Linhas 102, 127, 131 | `hydrate()`, `set()`**
   - **Quem grava:** Modificador interno `set()`. Deleta no `logout()`.
   - **Quem lê:** Função de inicialização `hydrate()`.
   - **Dependência:** Roteamento de bootup (lembrar qual projeto o Admin estava).
   - **Classificação:** Fallback legado.
   - **Risco de remoção:** Baixo se o Admin aceitar voltar pro hub geral.
   - **Ação Recomendada:** 🔴 Não pode permanecer como fonte da verdade. Remover persistência agressiva; gerenciar apenas via sessão Auth se for Cliente, ou estado na URL/memória se for Admin.

3. **`os/js/os-core.js` | Linhas 138, 141, 213, 432, 537 | Várias Funções de Roteamento**
   - **Quem grava:** Funções de `logout()` e `clear()` apagam a chave.
   - **Quem lê:** Guardiões de rotas para verificar se o Admin tem um projeto selecionado e montar o link dos botões da sidebar.
   - **Dependência:** Navegação global (`renderSidebar`).
   - **Classificação:** Seletor visual de cliente / Fallback legado.
   - **Risco de remoção:** Crítico. Vai quebrar os botões da Sidebar do Admin.
   - **Ação Recomendada:** 🔴 Não pode permanecer como fonte da verdade. Substituir a leitura direta por `OSState.get('activeProjectId')`.

---

### Chave: `activeContext` (No OSState)
1. **`os/js/os-state.js` | Linhas 26, 110, 111, 123, 155 | Interno do `OSState`**
   - **Quem grava:** Inicialização padrão ou seleção de UI (Ex: 'MASTER', 'CLIENT', 'LABS').
   - **Quem lê:** Ele mesmo para persistência curta (`fluxai_state_activeContext`).
   - **Dependência:** Estrutura unificada de UI.
   - **Classificação:** Navegação entre módulos / Seletor visual.
   - **Risco de remoção:** Alto. Destrói o paradigma da plataforma.
   - **Ação Recomendada:** 🟢 Pode manter. É a arquitetura correta de state-management da UI.

2. **`os/js/os-core.js` | Linhas 53, 56, 205 | `renderSidebar()`, `renderTopbar()`**
   - **Quem grava:** (Apenas lê do `OSState`).
   - **Quem lê:** UI Core.
   - **Dependência:** Renderização visual.
   - **Classificação:** Seletor visual.
   - **Risco de remoção:** Crítico (Não deve ser removido).
   - **Ação Recomendada:** 🟢 Pode manter.

---

### Chaves: `projectId` / `currentProjectId` (Variáveis de Função/Memória)
1. **`os/js/os-knowledge-core.js` | Múltiplas Linhas (13, 85, 94, 117, 191, etc.) | APIs do Knowledge**
   - **Quem grava:** Parâmetro injetado pelos módulos no ato da chamada (`KnowledgeCore.buildContext({ projectId })`).
   - **Quem lê:** O engine do Supabase para puxar os assets corretos (`.eq('project_id', projectId)`).
   - **Dependência:** Acesso e separação de dados (Filtragem Multi-Tenant na aplicação).
   - **Classificação:** Contexto ativo de operação.
   - **Risco de remoção:** Bloqueante. O sistema não saberia qual dado buscar.
   - **Ação Recomendada:** 🟢 Pode manter. O parâmetro transiente `projectId` é seguro, contanto que seja derivado de fonte autoritativa (URL ou Auth).

---

### Chave: `clientId` / `activeClientId` (Identidade de Legado / Query Strings)
1. **`os/js/modules/cliente-detalhe.js` | Linhas 129, 135 | `initPage()`**
   - **Quem grava:** Lida puramente a partir da Query String da URL (`?client_id=...`).
   - **Quem lê:** O módulo local para preencher a tela e montar queries (algumas legadas no Supabase usando string de negócio, mitigadas pelo RLS resolver).
   - **Dependência:** Visualização do Cockpit Operacional.
   - **Classificação:** Fallback legado / Contexto de navegação.
   - **Risco de remoção:** Elevado. É a forma como o Admin acessa o detalhe sem UUID no momento.
   - **Ação Recomendada:** 🟡 Precisa substituir com cuidado. Gradualmente transformar todas as rotas e tabelas para referenciar nativamente o UUID, aposentando o uso de texto comercial para chave estrangeira.

2. **`os/js/approval.js` | Linha 15 | `initAuth()`**
   - **Quem grava:** URL Query String.
   - **Quem lê:** Identity Resolver na inicialização.
   - **Classificação:** Seletor visual de cliente / Conversão de Legado.
   - **Ação Recomendada:** 🟡 Precisa substituir com cuidado.

---

## 2. CONCLUSÃO DA AUDITORIA

| Mecanismo de Estado | Diagnóstico | Parecer / Status |
| :--- | :--- | :--- |
| **Leituras diretas de `localStorage`** | O uso indiscriminado da chave string `fluxai_current_project_id` pelo `os-core.js` e `ui-helpers.js` quebra o Single Source of Truth do frontend, pois dribla o `OSState`. | 🔴 Refatorar para `OSState` e mitigar persistência permanente. |
| **Variáveis `activeContext` (OSState)** | Arquitetura moderna, funciona perfeitamente como memória volátil gerenciada. | 🟢 Estável / Pode Manter. |
| **Parâmetros `projectId`** | Uso correto de injeção de dependência via JS puro. Seguro se atrelado ao `auth.uid` no caso de clientes. | 🟢 Estável / Pode Manter. |
| **Uso de `clientId` via URL** | Herança da era do Google Sheets/Make operando no front. Cria fricção com o `auth.users` e requer o Identity Resolver. | 🟡 Transição gradual no backend (Troca de FKs para UUID). |
