# MACROBLOCO 13.2 — FASE 1: ENTREGA DE LIMPEZA DE MOCKS

**Objetivo:** Remoção estrita de mocks legados classificados como risco Crítico que poderiam gerar dados falsos em ambiente de produção em caso de falha do banco principal.

## 1. Arquivos Alterados
*   `os/js/os-knowledge-core.js`
*   `os/js/os-integration.js`
*   `os/js/modules/cliente-detalhe.js`

## 2. Trechos Removidos/Neutralizados
Foram removidas todas as lógicas que realizavam `localStorage.setItem` ou `localStorage.getItem` com o prefixo `fluxai_mock_` ou variáveis fixas de mock:

*   **Em `os-knowledge-core.js`:** Remoção do bloco `if (!project) { ... }` (linhas 113 a 123) que hidratava variáveis de memória buscando `fluxai_mock_projects`, `fluxai_mock_contracts`, `fluxai_mock_extras` e `fluxai_mock_assets`.
*   **Em `os-integration.js`:** 
    *   Remoção do fallback de mock ao criar pagamento (`fluxai_mock_payments`).
    *   Remoção do fallback ao registrar serviço extra (`fluxai_mock_extras`).
    *   Remoção do mock em `injectPautasLocal` (`fluxai_mock_assets`).
    *   Remoção da leitura no dashboard financeiro (`fluxai_mock_payments` e `fluxai_mock_contracts`).
*   **Em `cliente-detalhe.js`:** 
    *   Exclusão total do objeto estático `CLIENT_COCKPIT_MOCKS` (linhas 15 a 99) contendo 84 linhas de dados arbitrários de clientes.
    *   Remoção da cláusula condicional (linha 379) que sobrescrevia os dados do banco por dados do mock se o `clientId` existisse no objeto estático.

## 3. Substituição e Resiliência
Conforme as regras estabelecidas, nenhum novo dado falso foi criado para substituir.
*   **Se o Supabase falhar na leitura:** O sistema aborta silenciosamente com `console.warn`, devolvendo os arrays primários como vazios `[]` ou objetos como nulos, fazendo com que a UI renderize *Empty States* limpos ou exiba texto padrão ("Dado pendente de sincronização"), que é o comportamento esperado.
*   **Se o Supabase falhar na escrita:** Funções que forçavam gravação em cache (como `createPayment` ou `activateExtraService`) agora retornam `null` ou efetuam um early return sem inflar o `localStorage`.

## 4. Checklist de Teste Pós-Deploy
Para certificar a integridade, o time de QA deverá checar os seguintes itens:
- [ ] Acessar um cliente real via `cliente-detalhe.html?client_id=...` e garantir que o cockpit renderiza dados vazios/reais sem preencher magicamente com o `CLIENT_COCKPIT_MOCKS` legado.
- [ ] Forçar falha de rede (Offline no Chrome DevTools) no carregamento do `os-knowledge-core.js` e constatar se o sistema exibe alertas ou estado vazio, ao invés de buscar no cache os projetos de mock.
- [ ] Testar a criação de um "Serviço Extra" no dashboard. Garantir que, havendo sucesso na rede, grava normalmente no Supabase. Se houver falha de rede, a pauta **não** vai aparecer magicamente injetada via `localStorage`.
- [ ] Validar Fluxos Primários garantindo que continuam operantes (Aprovação, Motor de Conteúdo, Portal).
