# CHECKLIST DIÁRIO DE OPERAÇÃO — FLUXAI OS™ + MAKE.COM
## PROTOCOLO DIÁRIO DE GOVERNANÇA E CONTROLE DE ESTADOS

**Data de Execução:** ____/____/________  
**Operador Responsável:** ___________________________  
**Líder Técnico de Turno:** ___________________________  

---

## 1. Verificação de Schedules e Status de Cenários (Make.com)

Verifique no painel do Make.com se cada cenário está com a chave *Active* no estado correto. Marque `[x]` para confirmado:

### 1.1. Cenários de Baixo Risco (Devem estar ATIVOS $\rightarrow$ Active = ON)
*   [ ] **Cenário 01** (`01_FLUXAI_DAILY_SYNC_META`): Sincronia de Ads OK.
*   [ ] **Cenário 02** (`02_FLUXAI_DAILY_SYNC_GA4`): Sincronia GA4 OK.
*   [ ] **Cenário 03** (`03_FLUXAI_DEMANDA_NORMAL_INBOUND`): Gatilho de demandas OK.
*   [ ] **Cenário 04** (`04_FLUXAI_DAILY_MESA_EDITORIAL`): Calendário editorial OK.
*   [ ] **Cenário 05** (`05_FLUXAI_DAILY_SYNC`): Sincronia geral (com Clarity parametrizado) OK.
*   [ ] **Cenário 06** (`06_FLUXAI_DAILY_INSTAGRAM_SYNC`): Sincronia Instagram oficial OK.

### 1.2. Cenários Críticos (Devem estar DESATIVADOS $\rightarrow$ Active = OFF)
*   [ ] **Cenário 07** (`07_FLUXAI_RELATORIO_MENSAL`): Fechamento desabilitado OK.
*   [ ] **Cenário 10** (`10_FLUXAI_SERVICO_EXTRA_REQUEST`): Inbound comercial desabilitado OK.
*   [ ] **Cenário 11** (`11_FLUXAI_IA_CREDITOS_CONTROLE`): Sincronia síncrona desabilitada OK.
*   [ ] **Cenário 12** (`12_FLUXAI_SERVICO_EXTRA_APROVACAO`): Liberação de cotas desabilitada OK.
*   [ ] **Cenário 13** (`13_FLUXAI_IA_GUARDRAIL_OPERACIONAL`): Filtro de saldo síncrono desabilitado OK.
*   [ ] **Cenário 17** (`17_FLUXAI_GPT_GERACOES_LOG`): Auditoria de IA desabilitada OK.

---

## 2. Monitoramento de Logs de Transação (FluxAI OS™)

Acesse a tela administrativa de logs em `/os/logs.html` e verifique as ocorrências das últimas 24 horas:

*   [ ] **Varredura de `WEBHOOK_REAL_FAILED`:**
    *   *Resultado:* [ ] Zero erros | [ ] Ocorrências detectadas (detalhar no item 4).
*   [ ] **Varredura de `SECURITY_WARNING`:**
    *   *Resultado:* [ ] Zero alertas | [ ] Ocorrências detectadas (detalhar no item 4).
*   [ ] **Varredura de `GOVERNANCE_ABORTED`:**
    *   *Resultado:* [ ] Zero abortos | [ ] Transações revertidas via Rollback (detalhar no item 4).

---

## 3. Integridade e Consistência de Dados (Google Sheets)

Abra a planilha matriz e confira os registros gerados nas últimas 24 horas:

*   [ ] **Aba `LEADS_SITE`:** Verificado que não existem cadastros duplicados (mesmo e-mail/timestamp).
*   [ ] **Aba `DEMANDAS_CLIENTES`:** Verificado que todas as demandas possuem UUIDs exclusivos (`dem_xxxxxxxxx`).
*   [ ] **Aba `SERVICOS_EXTRAS_CLIENTES`:** Confirmado que novos serviços solicitados possuem status inicial `solicitado` e sem redundâncias.
*   [ ] **Aba `RELATORIO_OPERACIONAL_FLUXAI`:** Confirmado que novos relatórios possuem status **`rascunho_fluxai`** (Regra de Ouro) e que nenhum link foi exposto indevidamente como `liberado_cliente` de forma automática.
*   [ ] **Aba `IA_GERACOES_CONTROLE`:** Confirmado que não há prompts longos colados nas células da planilha (uso obrigatório do link `.txt` em `payload_ref`).

---

## 4. Registro de Ocorrências e Incidentes Técnicos

Descreva no campo abaixo qualquer evento atípico detectado no Make, Sheets ou OS, erros de rate limit de APIs ou intervenções manuais em Run Once:

*   **Descrição do Evento:**
    __________________________________________________________________________________
    __________________________________________________________________________________
    __________________________________________________________________________________
*   **Ações de Contenção Realizadas (Rollback/Estorno):**
    __________________________________________________________________________________
    __________________________________________________________________________________
    __________________________________________________________________________________

---

## 5. Chancelas de Fechamento de Turno

Certificamos que as validações acima foram conduzidas em conformidade absoluta com os manuais de governança operacional e que os schedules de alto risco permanecem desativados em ambiente de produção:

*   **Assinatura do Operador:** __________________________________________
*   **Visto do Líder Técnico:** __________________________________________

---

*Checklist de uso diário de governança da FluxAI Labs.*
