# MACROBLOCO 13.2 — AUDITORIA DE LOCALSTORAGE, MOCKS E LEGADO

**Objetivo:** Matriz de auditoria para a limpeza controlada e incremental da dívida técnica estrutural (localStorage, hardcodes, selects indiscriminados e mocks) identificada na arquitetura do FluxAI OS™.

*Nenhuma ação de remoção ou refatoração foi aplicada neste momento. Este documento serve como base para a autorização das correções.*

---

## 1. MATRIZ DE AUDITORIA: `localStorage` e MOCKS

| Arquivo | Linha | Chave/Dado Usado | Tipo de Uso | Risco | Ação Recomendada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `os/js/utils/ui-helpers.js` | 19, 30, 34 | `mockStorageKey` | mock legado | Alto | Remover fallback estático. |
| `os/js/utils/ui-helpers.js` | 53 | `fluxai_current_project_id` | estado vital proibido | Alto | Remover escrita local. Migrar para estado reativo. |
| `os/js/utils/ui-helpers.js` | 60 | `fluxai_supabase_projects` | cache aceitável | Baixo | Manter se usado apenas para cache UI inicial. |
| `os/js/os-state.js` | 69, 97, 159 | `fluxai_state_${key}` | cache aceitável | Médio | Manter como cache UI, mas auditar hidratação (não pode suplantar estado server-side). |
| `os/js/os-state.js` | 102, 127, 131 | `fluxai_current_project_id` | estado vital proibido | Alto | Remover e abstrair totalmente a leitura do UUID pelo Supabase Auth. |
| `os/js/os-state.js` | 111 | `fluxai_state_activeContext` | sessão/UI temporária | Baixo | Manter (apenas controla qual tab/contexto a UI exibe). |
| `os/js/os-knowledge-core.js` | 115 | `fluxai_mock_projects` | mock legado | Crítico | Remover completamente o fallback. |
| `os/js/os-knowledge-core.js` | 117 | `fluxai_mock_contracts` | mock legado | Crítico | Remover completamente o fallback. |
| `os/js/os-knowledge-core.js` | 119 | `fluxai_mock_extras` | mock legado | Crítico | Remover completamente o fallback. |
| `os/js/os-knowledge-core.js` | 121 | `fluxai_mock_assets` | mock legado | Crítico | Remover completamente o fallback. |
| `os/js/os-knowledge-core.js` | 446, 448 | `fluxai_ai_logs` | cache aceitável | Baixo | Manter ou mover para `sessionStorage` (apenas log local de IA). |
| `os/js/os-integration.js` | 51, 53, 74 | `fluxai_events` | cache aceitável | Médio | Manter como cache paralelo aos `operational_events` (apenas leitura UI). |
| `os/js/os-integration.js` | 129, 132, 312 | `fluxai_mock_payments` | mock legado | Crítico | Remover completamente o fallback e mocks. |
| `os/js/os-integration.js` | 186, 189 | `fluxai_mock_extras` | mock legado | Crítico | Remover completamente o fallback e mocks. |
| `os/js/os-integration.js` | 227, 229 | `fluxai_mock_assets` | mock legado | Crítico | Remover completamente o fallback e mocks. |
| `os/js/os-integration.js` | 313 | `fluxai_mock_contracts` | mock legado | Crítico | Remover completamente o fallback e mocks. |
| `os/js/os-core.js` | 138, 141, 213, 432, 537, 562 | `fluxai_current_project_id` | estado vital proibido | Alto | Remover e padronizar com a sessão do Supabase `auth.uid()`. |
| `os/js/os-core.js` | 218 | `fluxai_mock_projects` | mock legado | Crítico | Remover completamente o fallback. |
| `os/js/os-core.js` | 219 | `fluxai_supabase_projects` | cache aceitável | Baixo | Manter se usado apenas para cache pré-renderização. |
| `os/js/onboarding.js` | 687, 709 | `DRAFT_KEY` (`fluxai_onboarding_draft_*`) | sessão/UI temporária | Baixo | Manter. Uso legítimo para não perder progresso do formulário. |
| `os/js/modules/cliente-detalhe.js` | 379 | `CLIENT_COCKPIT_MOCKS` | mock legado | Crítico | Remover código objeto, forçando o carregamento 100% via banco de dados. |

---

## 2. MATRIZ DE AUDITORIA: HARDCODES E IDENTIDADE LEGADA

| Arquivo | Linha | Hardcode Usado | Risco | Ação Recomendada |
| :--- | :--- | :--- | :--- | :--- |
| `os/js/os-core.js` | 335 | `FLUXAI_LABS_001` | Alto | Substituir por carregamento dinâmico vinculado à Sessão (UUID). |
| `os/js/onboarding.js` | 227, 387, 414, 668 | `FLUXAI_LABS_001` | Alto | Migrar fluxo do onboarding para injetar o UUID do tenant logado. |
| `os/js/modules/cliente-detalhe.js` | 17, 105, 129, 133, 379, 637 | `FLUXAI_LABS_001` | Alto | Remover a constante fallback. Falhas de URL devem redirecionar para lista, não para o ID 001. |
| `os/js/approval.js` | 15 | `FLUXAI_LABS_001` | Alto | Integrar conversão oficial ao Identity Resolver em vez de hardcode condicional do UUID. |

---

## 3. MATRIZ DE AUDITORIA: DÍVIDA DE QUERY (`SELECT *`)

| Arquivo | Linha | Tabela Consultada | Risco de Performance | Ação Recomendada |
| :--- | :--- | :--- | :--- | :--- |
| `os/js/utils/ui-helpers.js` | 64 | `projects` | Médio | Limitar `select('id, name, status')`. |
| `os/js/os-knowledge-core.js` | 97 | `projects` | Médio | Limitar colunas (Over-fetching). |
| `os/js/os-knowledge-core.js` | 98 | `contracts` | Médio | Limitar colunas. |
| `os/js/os-knowledge-core.js` | 99 | `extra_services_contracts` | Médio | Limitar colunas. |
| `os/js/os-integration.js` | 65 | Eventos Diversos | Médio | Limitar colunas e paginação. |
| `os/js/onboarding.js` | 290 | `CLIENTES_ESTRATEGIA` | Baixo | Especificar colunas vitais do Onboarding. |
| `os/js/modules/cliente-detalhe.js` | 211 | `CONTRATOS_CLIENTES` | Médio | Otimizar query de contrato. |
| `os/js/modules/cliente-detalhe.js` | 217 | `CLIENTES_ESTRATEGIA` | Médio | Otimizar colunas de estratégia. |
| `os/js/modules/cliente-detalhe.js` | 288 | `IA_CREDITOS_CLIENTE` | Baixo | Select estrito para creditos. |
| `os/js/modules/cliente-detalhe.js` | 295 | `PLANEJAMENTO_CONTEUDO` | Alto | Tabela pesada, requer select explícito das mídias exigidas na lista. |
| `os/js/modules/cliente-detalhe.js` | 329 | `SERVICOS_EXTRAS_CLIENTES` | Médio | Otimizar colunas. |
| `os/js/modules/cliente-detalhe.js` | 345 | `FINANCEIRO_CLIENTES` | Médio | Limitar a metadata básica e valores. |
| `os/js/modules/cliente-detalhe.js` | 356 | `DEMANDAS_CLIENTES` | Médio | Otimizar colunas. |
| `os/js/modules/cliente-detalhe.js` | 366 | `COMUNICACOES_CLIENTE` | Médio | Otimizar colunas. |
| `os/js/modules/demandas.js` | 69 | `DEMANDAS_CLIENTES` | Médio | Requer colunas específicas da listagem principal (ID, Título, Status). |
| `os/js/modules/command-center.js` | 35 | `operational_events` | Baixo | Select estrito de logs visuais. |
| `os/js/modules/clients.js` | 390 | `projects` | Médio | Limitar colunas de projeto. |
| `os/js/modules/clients.js` | 393 | `CLIENTES_ESTRATEGIA` | Alto | Select sem where limitante associado. Overfetching massivo. |
| `os/js/modules/clients.js` | 394 | `CONTRATOS_CLIENTES` | Alto | Select sem where limitante associado. Overfetching massivo. |
| `os/js/contracts-finance.js` | 71, 72, 73 | Contratos/Fin./Extras | Alto | Overfetching generalizado (Puxa todas as colunas de 3 tabelas e trata no frontend). |
| `os/js/contracts-finance.js` | 871 | `fluxai_bank_accounts` | Baixo | Tabela pequena, mas passível de otimização `select('id, key, status')`. |
| `os/js/approval.js` | 90, 98 | `PLANEJAMENTO_CONTEUDO` | Alto | Arquivos pesados (mídias). Necessário `select('id, title, status, ...')`. |

---

## 4. CONCLUSÃO DA AUDITORIA

Prioridade para a próxima etapa (Macrobloco 13.2 - Execução):
1. Expurgar inteiramente as ocorrências de **mock legado** e **CLIENT_COCKPIT_MOCKS**.
2. Remover o **estado vital proibido** ligado a `fluxai_current_project_id`.
3. Substituir os hardcodes de `FLUXAI_LABS_001` pelo Identity Resolver e Session State.
4. Preservar *caches aceitáveis* (`fluxai_events`, etc) e *sessão temporária* (`DRAFT_KEY`).

**Aguardando autorização para iniciar a execução controlada da Fase 1 de Limpeza.**
