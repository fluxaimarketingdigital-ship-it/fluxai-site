# MATRIZ DE CENÁRIOS — CLASSIFICAÇÃO E DIRETRIZES DE RELIGAMENTO
## GOVERNANÇA DE AUTOMACÕES MAKE.COM & SEGURANÇA OPERACIONAL

**Fase Operacional:** FASE 06 (Governança Operacional)  
**Versão:** 1.0.0 (Maio/2026)  
**Status do Repositório:** **CODE FREEZE ATIVO**  
**Diretriz Central:** Religamento estritamente supervisionado. **Proibido ON global**.  

---

## 1. Classificação das Categorias de Governança

Para garantir o controle orçamentário e mitigar riscos de transações duplicadas, rate limiting de APIs ou cobranças indevidas, todas as automações e cenários da FluxAI Labs estão classificados em três categorias rígidas de governança de infraestrutura:

### A. Cenários Automáticos (Ativos em Produção)
*   **Definição:** Cenários cujos gatilhos provêm de webhooks passivos imediatos de baixo risco ou agendamentos contínuos autorizados, que operam de forma síncrona/assíncrona sem impacto financeiro direto não-auditado ou consumo descontrolado de tokens de IA.
*   **Regra de Operação:** Podem rodar com schedule ativo (**Active = ON**).
*   **Monitoramento:** Telemetria de sucesso diária automática.

### B. Cenários Manuais / Supervisionados (Sob Curadoria)
*   **Definição:** Cenários de alto impacto que lidam com geração de relatórios de desempenho, integração síncrona de saldo operacional, liberação de limites ou orçamentos comerciais avulsos.
*   **Regra de Operação:** Devem permanecer com o agendamento produtivo desativado (**Active = OFF**). O processamento deve ser acionado exclusivamente sob demanda unitária de operadores autorizados no Make via modo **Run Once**, ou lotes estritamente monitorados.
*   **Monitoramento:** Validação humana obrigatória antes da liberação.

### C. Cenários Bloqueados / Congelados (Desativados)
*   **Definição:** Cenários em desenvolvimento, em fase de testes pré-sandbox, ou cujo escopo técnico foi depreciado devido à reestruturação de segurança ou incidente de credenciais expiradas.
*   **Regra de Operação:** Mantidos permanentemente desligados (**Active = OFF**). Qualquer tentativa de ativação sem auditoria prévia da Banca de Governança constitui violação de conformidade técnica.

---

## 2. Matriz Consolidada de Governança de Cenários (Make.com)

Abaixo está mapeada toda a base ativa de cenários da agência com suas respectivas categorias de governança, frequências, Regras de Ouro de segurança e status de reativação:

| ID | Nome do Cenário no Make.com | Categoria de Governança | Frequência / Gatilho | Regra de Ouro aplicável / Ação de Segurança | Status de Schedules |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **01** | `01_FLUXAI_DAILY_SYNC_META` | Automático / Ativo | Diário às 01:00 | Sincroniza métricas quantitativas de Ads sem processamento de IA. | **ON** |
| **02** | `02_FLUXAI_DAILY_SYNC_GA4` | Automático / Ativo | Diário às 01:30 | Sincroniza visualizações e sessões GA4. Baixo risco de cota. | **ON** |
| **03** | `03_FLUXAI_DEMANDA_NORMAL_INBOUND` | Automático / Ativo | Instantâneo (Webhook) | Registra chamadas regulares de clientes no portal. Sem faturamento. | **ON** |
| **04** | `04_FLUXAI_DAILY_MESA_EDITORIAL` | Automático / Ativo | Diário às 07:00 | Atualiza calendário da mesa editorial interno. Sem disparos. | **ON** |
| **05** | `05_FLUXAI_DAILY_SYNC` | Automático / Ativo | Diário às 00:00 | Sincroniza dados gerais. Contém a correção P0 do Clarity parametrizada. | **ON** |
| **06** | `06_FLUXAI_DAILY_INSTAGRAM_SYNC` | Automático / Ativo | Diário às 02:00 | Sincroniza métricas de engajamento do Instagram oficial. | **ON** |
| **07** | `07_FLUXAI_RELATORIO_MENSAL` | Manual / Supervisionado | Mensal (1º dia útil) | **Protocolo de Curadoria Híbrida**: Relatórios PDFs privados salvos no Drive sob status `rascunho_fluxai`, sem envio automático. | **OFF** |
| **10** | `10_FLUXAI_SERVICO_EXTRA_REQUEST` | Manual / Supervisionado | Instantâneo (Webhook) | Cadastra solicitações de serviços adicionais sob status inicial `solicitado`. | **OFF** |
| **11** | `11_FLUXAI_IA_CREDITOS_CONTROLE` | Manual / Supervisionado | Instantâneo (Webhook) | Sincronia de cotas com base em 5 regras de status. Webhook seguro rotacionado. | **OFF** |
| **12** | `12_FLUXAI_SERVICO_EXTRA_APROVACAO` | Manual / Supervisionado | Instantâneo (Webhook) | **Idempotência Restrita**: Impede dupla aprovação e faturamentos repetidos. | **OFF** |
| **13** | `13_FLUXAI_IA_GUARDRAIL_OPERACIONAL`| Manual / Supervisionado | Instantâneo (Webhook) | Interceptador síncrono. Retorna HTTP 403 se o cliente estiver sem saldo de créditos de IA. | **OFF** |
| **17** | `17_FLUXAI_GPT_GERACOES_LOG` | Manual / Supervisionado | Instantâneo (Webhook) | **Regra P3 de Desempenho**: Compacta prompts/outputs em `.txt` privados no Drive, gravando apenas metadados no Sheets. | **OFF** |
| **99** | `99_FLUXAI_PRE_ONBOARDING_TEST` | Bloqueado / Congelado | N/A | Cenário legado de testes. Desativado por substituição técnica de infraestrutura. | **OFF** |

---

## 3. Plano de Auditoria Periódica de Conformidade

Para certificar que a Matriz de Controle não sofra desvios e que nenhum cenário crítico seja ativado de forma negligente, institui-se o **Plano de Auditoria Periódica de Conformidade**:

### 3.1. Auditoria Semanal de schedules (Toda Segunda-feira às 08:30)
1.  O operador de governança deve logar no painel administrativo do Make.com da FluxAI.
2.  Comparar visualmente o status da chave *Active* de cada um dos cenários ativos na plataforma com os registros desta **Matriz Consolidada**.
3.  Caso qualquer cenário classificado como **Manual / Supervisionado** ou **Bloqueado / Congelados** esteja indevidamente marcado como **Active = ON** em produção, o operador deve:
    *   Desativá-lo imediatamente (**Active = OFF**).
    *   Investigar se houve disparos automatizados de e-mails, WhatsApp ou cobranças financeiras.
    *   Registrar ocorrência de quebra de governança na pasta `/docs/auditorias/` sob a nomenclatura `DESVIO_GOVERNANCA_MAKE_[DATA].md`, detalhando impactos e logs de estorno.

### 3.2. Auditoria de Blueprints e Segredos (Quinzenal)
1.  Analisar no histórico de commits do Git se houve exportação de blueprints `.json` contendo chaves, tokens ou credenciais expostas.
2.  Utilizar ferramentas de escaneamento local (ex: `node run_security_scan.js`) para certificar que nenhum segredo bruto tenha sido inserido de forma indevida em documentos explicativos.
3.  Mascarar imediatamente qualquer informação sensível utilizando a nomenclatura `[REDIGIDO]`.

---

## 4. Diretrizes de Transição de Categoria

Um cenário só pode mudar de categoria (ex: de *Manual / Supervisionado* para *Automático / Ativo*) após cumprir os seguintes critérios de validação técnica da banca:

1.  **Mínimo de 30 Dias** de operação estável sob o modo supervisionado em produção, registrando taxa de erro em fila inferior a **`0.1%`**.
2.  **Aprovação Unânime** da diretoria administrativa e da Banca de Governança de Elite.
3.  **Mapeamento de Rollback Completo** documentado e testado em sandbox síncrono.
4.  **Inexistência** de qualquer risco de rate limit ou estouros de cota de serviços de terceiros (Google, Meta).

---

*Matriz chancelada, chumbada e registrada no arcabouço de Governança Operacional da FluxAI Labs.*
