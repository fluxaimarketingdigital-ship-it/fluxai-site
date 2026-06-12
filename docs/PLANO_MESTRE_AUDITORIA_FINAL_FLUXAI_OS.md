# PLANO MESTRE: AUDITORIA FINAL FLUXAI OS

Este documento rastreia a evolução, testes e liberação para produção dos módulos do ecossistema FluxAI OS.

## Status Global
**Produção Parcialmente Bloqueada:** Cenários legados isolados para evitar danos à nova arquitetura de planilhas e evitar faturamento automático indevido.

---

## Marcos de Saneamento e Auditoria

### [x] PACOTE SEGURO 01 — Auditoria Cruzada Planilha x Make
*   **Ação:** Varredura *Read-Only* de todos os Blueprints JSON contra os schemas JSON reais da planilha no Google Sheets.
*   **Resultado:** Mapeamento completo. Confirmada a obsolescência de nomes de abas nos cenários 03 a 08 e identificado risco financeiro autônomo na Rota 10. Documento `AUDITORIA_CRUZADA_PLANILHA_MAKE_BLUEPRINTS.md` gerado.

### [x] PACOTE SEGURO 02 — Saneamento Documental e Preparação da Virada
*   **Ação:** Estruturação dos planos de mitigação e refinamento narrativo da UI sem quebras de código.
*   **Status:** Concluído. Checklists de virada criados. Textos de ativação mitigados para controle humano.

---

## Marcos Operacionais e Funcionalidades

### [x] Fase 2A.1 — Virada Onboarding Rascunho Seguro
*   **Dependências:** 
    *   Correção de UTF-8 no envio do payload.
    *   Rotação/Inserção do Webhook definitivo do cenário V6/V7 no Vercel/Supabase Secret.
*   **Status:** Concluído. Testes Canary executados, payload em UTF-8 forçado com sucesso e duplicidades bloqueadas. Produção controlada liberada.

### [x] PACOTE SEGURO 03 — Remapeamento dos Cenários 03 a 08
*   **Problema:** Estes cenários de monitoramento (Daily, Meta, Relatórios) usam os nomes antigos das abas (`CLIENTES_CONFIG`, `SERVICOS_CLIENTES`, `GA4_DIARIO`).
*   **Ação:** Refazer o mapping visual de cada aba nos módulos do Make.co.
*   **Status da Produção:** Concluído e homologado visualmente no Make. A execução real permanece bloqueada aguardando simulação com cliente interno FluxAI.

### [ ] ROTA 10/12 — Teste E2E pendente (Serviços Extras)
*   **Problema:** O botão atual do portal dispara para a `ROTA 01`. Além disso, a `ROTA 10` oficial no Make realiza escrita no Supabase e na aba Financeira.
*   **Ação:** Ajustar o `submitDemanda()` e realizar disparo de ponta a ponta garantindo que o faturamento autônomo e créditos não sejam inseridos antes da aprovação do administrador.
*   **Status da Produção:** Rota de serviço extra bloqueada.

---

*Última Atualização: Via Pacote Seguro 02.*
