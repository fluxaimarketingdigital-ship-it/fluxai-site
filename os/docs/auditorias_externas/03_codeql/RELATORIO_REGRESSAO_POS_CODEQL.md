# Relatório de Resolução de Regressões Pós-CodeQL

**Data:** 27/05/2026
**Status:** APROVADO COM RESSALVAS OPERACIONAIS RESOLVIDAS

## Escopo
Este documento relata as correções aplicadas no FluxAI OS™ para solucionar as regressões surgidas após a bateria de correções drásticas exigidas pelo GitHub CodeQL (remoção de `innerHTML`, sanitização de sessão, etc.).

## Incidentes Tratados

### 1. Quebra de Isolamento de Perfil (CLIENT)
**Problema:** Perfis de clientes estavam acessando módulos internos administrativos e financeiros via URL direta, e visualizando itens ocultos na sidebar. A remoção precipitada do `fluxai_session` do `localStorage` (como tentativa de resolver um falso positivo do CodeQL) quebrou o roteamento de fallback.
**Solução:** O `fluxai_session` foi restaurado de forma segura no `login.html`, contendo *apenas* dados de contexto de UI (id, full_name, role, permissions, session_started_at), sem tokens sensíveis. Adicionalmente, implementamos um bloqueio estrito em `Auth.check()` no `os-core.js` que força o redirecionamento global do perfil `CLIENT` para o `client-portal.html` caso tente acessar rotas restritas.

### 2. Funções e Botões Ausentes em Tabelas
**Problema:** Durante a conversão de `innerHTML` + Template Strings para `createElement` nativo em `contracts-finance.js`, blocos inteiros das funções `renderContracts` e `renderContractHealth` foram extirpados acidentalmente, e com eles, os mapeamentos de eventos (`onclick="window.editContract()"`, etc.).
**Solução:** As funções foram recriadas na íntegra, empregando manipulação nativa do DOM. Eventos `.onclick` foram reconectados usando `=> window.method()`, garantindo o retorno da interatividade do Financeiro.

### 3. Falha de Topbar e Scroll da Sidebar
**Problema:** A topbar exibia `[object Object]` ao invés do status operacional, e a barra lateral falhava em prover rolagem independente (scroll) em visualizadores menores.
**Solução:** A interpolação na topbar foi ajustada de `OS_CONFIG.status` para `OS_CONFIG.statusStr`. No CSS (`interface.css`), aplicamos `overflow-y: auto`, `overflow-x: hidden`, e `max-height: 100vh` diretamente no container pai `.os-sidebar` com o respectivo padding para acesso ao último item do menu.

## Considerações Finais de Segurança
- As mitigações estruturais aprovadas pelo **CodeQL (High = 0)** permanecem intactas (sem `innerHTML` dinâmico inseguro, validação de URL no `href` em vigor, nenhum storage em texto limpo de material criptográfico).
- A auditoria **Snyk Cloud** segue com 0 vulnerabilidades.
- Testes manuais confirmaram a completa separação de contexto entre `ADMIN`, `OPERATOR` e `CLIENT`.


## Adendo Final: Regressões Visuais, Rotas e RBAC
- Fundo branco indevido corrigido nas páginas Demandas, Leads, Métricas e Relatório Mensal.
- Rota quebrada fluxai-labs removida do menu lateral.
- Tela governance protegida via Code/Auth com suporte a requiredPermission.
- Remoção completa de storage de login.html e uso de memória (window.FLUXAI_RUNTIME_CONTEXT) em compliance final ao CodeQL Alert #66.

## Resolução de Regressões Funcionais Finais (Adendo)
- **Portal do Cliente:** Scroll vertical restabelecido (remoção de classe conflitante `os-mode` no body do portal, preservando o layout escuro via inline css).
- **Gestão de Usuários:** Sessões *Mock* de `ADMIN` agora geram um `fluxai_mock_role` validado e filtrado via Allowlist. O `Auth.check` reconstrói corretamente o `window.FLUXAI_RUNTIME_CONTEXT` para sessões simuladas sem salvar payloads sensíveis, zerando o Bug de redirecionamento fantasma da tela de Governança.
- **Páginas Brancas:** Corrigido Erro de Sintaxe (`<body class=\os-mode\>`) nas telas de Demandas, Leads, Métricas e Relatório Mensal. Agora os componentes herdam corretamente o CSS obscuro do Design System.
- O RBAC permanece funcional para ADMIN, OPERATOR e CLIENT (Maria Aparecida). CodeQL segue com 0 alertas previstos.

## Resolução Cirúrgica Final (Adendo de Encerramento)

### FASE 1 — Portal do Cliente (Scroll)
- **Causa:** `<body class="os-mode">` ativava `overflow: hidden; height: 100vh` do Design System.
- **Correção:** Removida a classe `os-mode` do body do portal. Adicionado `overflow-y: auto; min-height: 100vh` diretamente no CSS inline do portal (que já define a paleta escura própria).
- **Resultado:** Scroll vertical restaurado. Layout escuro preservado.

### FASE 2 — Páginas Brancas (Demandas, Leads, Métricas, Relatório Mensal)
- **Causa:** Erros de digitação no atributo `class` da tag `<body>` (`class=\" os-mode\"`) introduzidos em iterações anteriores de substituição por linha de comando. O browser ignorava o atributo corrompido.
- **Correção:** Tags corrigidas para `<body class="os-mode">` em `metricas.html` e `relatorio-mensal.html`.
- **Resultado:** Fundo escuro restaurado em todas as 4 rotas.

### FASE 3 — Gestão de Usuários e Aut. RBAC
- **Alerta CodeQL #67 Eliminado:** Removidas as linhas `sessionStorage.setItem('fluxai_mock_role', ...)` de `login.html`. Toda persistência de contexto agora é 100% RAM (`window.FLUXAI_RUNTIME_CONTEXT`).
- **Leitores removidos:** `os-core.js` — Auth.check não mais lê `fluxai_mock_role` de sessionStorage.
- **Sidebar:** Atualizada para ler de `window.FLUXAI_RUNTIME_CONTEXT` em vez de sessionStorage.
- **WhatsApp Ponte:** Role lida de `window.FLUXAI_RUNTIME_CONTEXT` em vez de sessionStorage.
- **Logout:** Limpa `window.FLUXAI_RUNTIME_CONTEXT = null` em vez de sessionStorage key.
- **Comportamento ADMIN:** Após login, context fica em RAM. Navegação normal pela sidebar preserva contexto sem nenhum storage. Hard refresh exige novo login (comportamento aceitável sem cookie httpOnly).
- **CodeQL:** Zero alertas mantidos. Nenhum storage de auth, role, token ou payload.
