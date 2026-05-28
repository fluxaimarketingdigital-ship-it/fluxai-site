# FASE 04 — RECUPERAÇÃO TÉCNICA DO MÓDULO 08 (SERVIÇOS EXTRAS E CONTRATOS)

**Data da Intervenção:** 27 de Maio de 2026
**Módulo:** 8. Serviços Extras / Contratos & Financeiro
**Responsável Técnico:** KI-Agent

## 1. Contexto do Incidente (P1 Operacional)
O diagnóstico E2E revelou que a interface do módulo financeiro estava bloqueada no formato de "Painel de Leitura". Todos os gatilhos visuais de edição e a modal de controle estavam programados no HTML (`contracts-finance.html`), porém a lógica `JavaScript` subjacente foi omitida no arquivo `contracts-finance.js`, gerando "botões fantasmas" e impedindo o C.R.U.D. financeiro e faturamento de *Serviços Extras* (Upsell). Além disso, havia uma brecha de governança de Logs onde o módulo tentava salvar em `audit_logs` sem passar pela proteção de Webhooks da `OS_LOGS_ENGINE`.

## 2. Ações de Mitigação Arquitetural

### 2.1 Refatoração da Modal de Edição (HTML & JS)
- Inserção de uma coluna completa de campos requeridos para Upsell (Status, Valor Aprovado, Prazo, Créditos IA, Impacto no Planejamento, Link do Drive) diretamente no DOM (`contracts-finance.html`).
- Implementação das funções globais que a UI necessitava: `window.editContract()`, `window.closeEditContractModal()`, e `window.switchTab()`.
- O array mock de projetos (`fluxai_mock_projects`) foi integrado para carregar links operacionais (Instagram, Drive, Canva, etc.) na aba "Cadastro & Links".

### 2.2 Motor de C.R.U.D. (Fail-Safe e Arrays MVP)
- Criação da função core `window.saveContractEdit()`:
  - Captura os campos base do contrato e os campos opcionais de Serviços Extras.
  - O serviço extra, durante este MVP, é injetado num array `extras[]` dentro do objeto do Contrato para simular faturamento cruzado, até que a tabela final `SERVICOS_EXTRAS_CLIENTES` seja oficializada no Supabase em sprints futuras.
  - Implementado sistema de Dupla Tentativa (Dual-Write): O sistema atualiza o DB e dispara webhooks do Make (`FINANCE_UPDATE`). Se qualquer um falhar, o sistema assume fallback gracefully salvando em LocalStorage.

### 2.3 Refatoração de Logs Operacionais (OS_LOGS_ENGINE)
- A função arcaica `logAction` foi sumariamente expurgada de `contracts-finance.js`.
- Foram importados `OS_LOGS_ENGINE` e `OS_CONFIG` no head do arquivo.
- Eventos transacionais como `CONTRACT_EDIT_STARTED`, `CONTRACT_UPDATED`, `CONTRACT_UPDATE_FAILED`, `SERVICE_EXTRA_ADDED`, `SERVICE_EXTRA_APPROVED`, e `CONTRACT_DOC_REQUESTED` foram injetados dentro das execuções, garantindo telemetria centralizada rastreável.

### 2.4 Comprovante de Serviço (HTML Receipt)
- Para viabilizar a funcionalidade pendente do botão "[Gerar Recibo]", adotamos a `Option A` da diretiva de segurança.
- Uma modal de recibo (in-DOM) foi criada com o formato Visual. 
- O botão "Imprimir Comprovante" engatilha a função `window.printReceipt()` (um wrapper sobre `window.print()`). O layout possui regras de CSS `@media print` que forçam uma impressão limpa apenas da área selecionada. O documento especifica claramente: *"Este documento não substitui nota fiscal oficial."*

## 3. Conclusão
O módulo passou de um visor passivo para uma ferramenta reativa e segura de *Upsell*. O princípio de Separação de Preocupações (Logs via Engine, Dados via Fallback Seguro, Modais via Interface Controlada) foi estabelecido respeitando o restrito *Code Freeze* do core.
