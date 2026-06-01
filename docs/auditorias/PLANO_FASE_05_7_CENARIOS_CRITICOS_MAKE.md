# PLANO DE IMPLEMENTAÇÃO E GO-LIVE CONTROLADO — FASE 05.7
## ESTRATÉGIA DE RELIGAMENTO DE CENÁRIOS CRÍTICOS & GOVERNANÇA DE IA / FINANCEIRO

**Fase Operacional:** FASE 05.7 (Religamento & Homologação de Cenários Críticos)  
**Status do Plano:** PLANEJADO / **AGUARDANDO APROVAÇÃO EXECUTIVA**  
**Código do FluxAI OS™:** Strict Code Freeze (100% Preservado e Inviolado)  
**Status de Schedules Make:** **TODOS EM DORMÊNCIA** (Active = Off)  
**Janela Mínima Exigida para Testes:** 72 Horas de Observação em Sandbox  

---

## 1. Resumo Executivo

Este documento estabelece o **Plano de Implementação Seguro e Controlado para a Fase 05.7** do ecossistema de automações Make.com associado ao **FluxAI OS™**. 

Após a conclusão e validação bem-sucedida da Fase 05.6A — que higienizou as planilhas operacionais e estabilizou as conexões síncronas de baixo e médio risco —, este plano desenha a arquitetura de ativação da camada de **Serviços Extras, Governança Financeira e Controle Operacional de IA**. 

Para blindar a FluxAI Labs contra vulnerabilidades e garantir total isolamento de custos, **nenhum cenário será reativado de imediato**. Os cronogramas e schedules permanecem desligados. A homologação desta fase ocorrerá por meio de mapeamentos técnicos, simulações controladas em sandbox e testes unitários fechados, respeitando o rígido **Code Freeze** transversal do núcleo do sistema.

---

## 2. Termo de Segurança de Elite & Alerta Crítico (Clarity Token)

> [!CAUTION]
> **REMOÇÃO E ROTAÇÃO OBRIGATÓRIA DE SEGREDO (CLARITY TOKEN)**  
> Foi identificado um risco de segurança histórico referente à presença do **Clarity Project ID/Token** de rastreamento exposto em blueprints ou metadados de exportação de cenários do Make.  
> 
> **Diretriz de Segurança Mandatória:**  
> Antes de realizar qualquer exportação técnica, importação de novos blueprints (`.json`) ou execução de cargas síncronas de testes, o operador técnico é obrigado a:
> 1. Remover o Clarity Token de qualquer payload ou arquivo estático de configuração a ser exportado para o repositório.
> 2. Rotacionar a credencial nas planilhas e no cofre do Supabase de forma nativa e isolada.
> 3. Utilizar o mascaramento dinâmico no `make-proxy` para que o token trafegue unicamente sob cabeçalhos encriptados, nunca expostos em logs do monitor técnico (`STATUS_MONITOR_DIARIO`).

---

## 3. Matriz Geral de Governança das Abas Críticas

As automações desta fase interagem diretamente com dados sensíveis de faturamento e cotas de processamento. A tabela abaixo resume as regras de acesso e mitigação de escrita:

| Aba do Google Sheets | Tipo de Dado | Classificação de Risco | Política de Acesso e Escrita |
|---|---|---|---|
| `SERVICOS_EXTRAS_CLIENTES` | Financeiro / Upsell | **Risco Crítico** | Permissão de escrita exclusiva de webhooks autenticados via proxy. Proibida edição direta manual de status por operadores não autorizados. |
| `IA_CREDITOS_CLIENTE` | Limites de Cota de IA | **Alto Risco** | Atualizações atômicas. Valores incrementados apenas via aprovação financeira física e decrementados síncronamente na geração de pautas. |
| `GPT_GERACOES_LOG` | Telemetria / IA | **Médio Risco** | Append-Only. Proibida gravação do texto completo de prompts/respostas. Registra apenas referências do Google Drive para evitar sobrecarga e vazamento. |
| `RELATORIO_OPERACIONAL_FLUXAI` | Camada Executiva | **Alto Risco** | Registra metadados e caminhos de relatórios. Nunca envia notificações automáticas sem curadoria estratégica. |
| `CLIENTES_ARQUIVOS` | Arquivos Físicos | **Baixo Risco** | Escreve atalhos seguros das pastas do Google Drive para acesso direto no OS. |

---

## 4. Mapeamento Detalhado por Cenário

Abaixo está a especificação técnica de cada um dos 6 cenários sob o escopo da Fase 05.7:

---

### A. 07_FLUXAI_RELATORIO_MENSAL
*   **Propósito:** Consolidação automática de performance (Meta Ads, GA4, KPIs) de cada cliente, gerando um rascunho de relatório (PDF e Google Slides) para apoiar o diagnóstico estratégico mensal.
*   **Gatilho:** Schedule mensal (Cron - 1º dia do mês às 06:00).
*   **Abas Lidas:** `INSTAGRAM_DIARIO`, `GA4_DIARIO`, `META_ADS_DIARIO`, `KPI_EXECUTIVO`, `ANALISE_MENSAL_CLIENTE`, `CLIENTES_CONFIG`, `SERVICOS_CLIENTES`.
*   **Abas Escritas:** `RELATORIO_OPERACIONAL_FLUXAI`, `CLIENTES_ARQUIVOS`.
*   **Dependências:** Google Slides API, Google Docs API, Google Drive (Upload de arquivos).
*   **Filtros Obrigatórios:**
    *   `status_servico = ativo`
    *   `relatorio_incluir = sim`
*   **Riscos Mapeados:**
    *   *Risco 1:* Envio direto ou liberação prematura do PDF para o portal do cliente sem curadoria humana, resultando em dados crus sem contexto.
    *   *Risco 2:* Consumo em lote excessivo da cota da Google Slides API por processamento repetido de clientes inativos.
*   **Estratégias de Mitigação:**
    *   O relatório é gerado unicamente com status `rascunho_fluxai` na pasta privativa `07_METRICAS_E_RELATORIOS` do Drive.
    *   O portal de clientes do OS bloqueia a exibição até que o administrador altere o status manualmente para `liberado_cliente` após revisão estratégica humana.
*   **Critérios de Validação em Sandbox (Sem Disparar Produção):**
    *   Utilizar um cliente fictício de testes (`FLUXAI_LABS_001`) com dados operacionais mockados reduzidos.
    *   Confirmar que o Slides API montou os slides nos templates homologados e o PDF foi salvo no Drive, sem enviar qualquer e-mail de notificação.

---

### B. 10_FLUXAI_SERVICO_EXTRA_REQUEST
*   **Propósito:** Receber pedidos de escopo adicional (upsell, criativos extras, páginas extras) preenchidos pelo cliente diretamente no portal do FluxAI OS™.
*   **Gatilho:** Webhook transacional `SERVICE_EXTRA_REQUEST` (via `make-proxy`).
*   **Abas Lidas:** `CLIENTES_CONFIG` (para validar remetente).
*   **Abas Escritas:** `SERVICOS_EXTRAS_CLIENTES`.
*   **Dependências:** Notificação instantânea via Telegram/Slack para a equipe comercial.
*   **Filtros Obrigatórios:**
    *   `status_cliente = ativo`
    *   Verificação de assinatura UUID (`requestId`) no proxy.
*   **Riscos Mapeados:**
    *   *Risco 1:* Ataques de spam ou injeção de dados por repetição contínua (Double Click) de solicitações pelo cliente, superlotando as planilhas.
    *   *Risco 2:* Falha na gravação impedindo o cliente de registrar a demanda, gerando atrito comercial.
*   **Estratégias de Mitigação:**
    *   A Edge Function do `make-proxy` implementa rate limiting rigoroso por IP/Client no endpoint comercial.
    *   Webhook configurado em modo *Custom Response* no Make.com, respondendo `HTTP 200` ao OS apenas após a inserção síncrona com sucesso da linha em `SERVICOS_EXTRAS_CLIENTES`.
*   **Critérios de Validação em Sandbox (Sem Disparar Produção):**
    *   Simular o disparo de carga de teste contendo payload de serviço extra para o `make-proxy`.
    *   Comprovar a gravação com status de entrada unificado: `solicitado`.

---

### C. 11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL
*   **Propósito:** Gerenciar, auditar e deduzir os créditos de governança de IA para controle rígido do motor do Content Engine contratado.
*   **Gatilho:** Webhook interno `IA_CREDITOS_CONTROLE` (via `make-proxy`).
*   **Abas Lidas:** `IA_CREDITOS_CLIENTE`.
*   **Abas Escritas:** `IA_CREDITOS_CLIENTE`.
*   **Dependências:** Nenhuma.
*   **Filtros Obrigatórios:**
    *   Chave secreta interna passada no cabeçalho do webhook para impedir acessos fraudulentos.
*   **Riscos Mapeados:**
    *   *Risco 1:* Concorrência de escrita física de limites no Sheets (múltiplas gerações síncronas de IA pelo mesmo cliente fazendo updates errados).
    *   *Risco 2:* Dedução de créditos que falham na persistência física, resultando em gerações gratuitas ilimitadas e prejuízo para a agência.
*   **Estratégias de Mitigação:**
    *   Executar o fluxo transacional de forma sequencial no Make (`Search Rows` > `Calculate` > `Update Row`).
    *   Em caso de concorrência com erro de tráfego, o webhook retorna erro no payload do Content Engine do OS, travando temporariamente a geração de conteúdo.
*   **Critérios de Validação em Sandbox (Sem Disparar Produção):**
    *   Simular uma dedução matemática de teste (ex: decremento de 1 crédito para `FLUXAI_LABS_001`).
    *   Validar que o novo saldo gravado em Sheets reflete exatamente a conta matemática.

---

### D. 12_FLUXAI_SERVICO_EXTRA_APROVACAO
*   **Propósito:** Processar a aprovação de orçamento de Serviços Extras feita pelo cliente ou administrador, disparando as rotinas comerciais e liberando cotas adicionais de IA se a flag `impacto_gpt = true` estiver habilitada.
*   **Gatilho:** Webhook transacional `SERVICE_EXTRA_APPROVAL` (via `make-proxy`).
*   **Abas Lidas:** `SERVICOS_EXTRAS_CLIENTES`, `IA_CREDITOS_CLIENTE`.
*   **Abas Escritas:** `SERVICOS_EXTRAS_CLIENTES`, `IA_CREDITOS_CLIENTE`.
*   **Dependências:** Gateway de notificação comercial da agência.
*   **Filtros Obrigatórios:**
    *   `status_cliente = ativo`
    *   Validação estrita no Make de que o status atual na aba `SERVICOS_EXTRAS_CLIENTES` é exatamente `orcamento_enviado` ou `solicitado`.
*   **Riscos Mapeados:**
    *   *Risco 1:* Tentativa de dupla aprovação de um mesmo orçamento por cliques repetidos ou requisições paralelas maliciosas, inflando indevidamente os créditos de IA do cliente de forma artificial.
    *   *Risco 2:* Alteração do valor acordado do orçamento durante a transação de aprovação.
*   **Estratégias de Mitigação:**
    *   O cenário no Make checa a flag da linha na aba `SERVICOS_EXTRAS_CLIENTES`. Se já constar como `aprovado`, aborta imediatamente com *Custom Response* indicando erro de repetição.
    *   O Make lê o valor de orçamento escrito originalmente na planilha e o compara com o payload do webhook; caso haja divergência, a aprovação é cancelada e reportada à segurança da FluxAI.
*   **Critérios de Validação em Sandbox (Sem Disparar Produção):**
    *   Testar a aprovação controlada de um extra pendente configurado para `FLUXAI_LABS_001`.
    *   Validar o bloqueio automático de uma segunda tentativa de envio da transação.

---

### E. 13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL
*   **Propósito:** Agir como o firewall de custos ativo, validando se o cliente possui cota disponível contratada em `IA_CREDITOS_CLIENTE` antes de despachar a pauta para a API do GPT no OS.
*   **Gatilho:** Webhook de verificação síncrona `IA_GUARDRAIL` (via `make-proxy`).
*   **Abas Lidas:** `IA_CREDITOS_CLIENTE`.
*   **Abas Escritas:** `STATUS_MONITOR_DIARIO` (somente em logs de segurança de bloqueio).
*   **Dependências:** Nenhuma.
*   **Filtros Obrigatórios:**
    *   `status_cliente = ativo`
*   **Riscos Mapeados:**
    *   *Risco 1:* Falha de conexão com a planilha matriz resultando em bypass lógico (liberar a geração mesmo com créditos zerados) ou em erro falso positivo (bloquear clientes ativos de gerar conteúdo legítimo).
    *   *Risco 2:* Latência de checagem (> 3 segundos) tornando a experiência do OS insustentável.
*   **Estratégias de Mitigação:**
    *   Tratamento rígido de Postura de Segurança: Em caso de falha de conexão (HTTP 503 Sheets), adotar postura **Fail-Safe** bloqueando a geração por segurança e reportando ao ADMIN.
    *   Processamento leve contido com resposta síncrona em < 1.5 segundos.
*   **Critérios de Validação em Sandbox (Sem Disparar Produção):**
    *   Definir manualmente os créditos de IA do cliente `FLUXAI_LABS_001` como `0` na planilha de testes.
    *   Tentar disparar uma requisição de conteúdo no OS e atestar o recebimento imediato de `HTTP 403 Forbidden` com a payload de bloqueio.

---

### F. 17_FLUXAI_GPT_GERACOES_LOG
*   **Propósito:** Rastreamento técnico e auditoria de conformidade de todas as cargas de prompts enviadas e payloads estruturados gerados pela IA no Content Engine do FluxAI OS™.
*   **Gatilho:** Webhook assíncrono `GPT_GERACOES_LOG` (via `make-proxy`).
*   **Abas Lidas:** Nenhuma.
*   **Abas Escritas:** `GPT_GERACOES_LOG` (Append-Only).
*   **Dependências:** Google Drive API (Criação de arquivos de logs isolados em `.txt`).
*   **Filtros Obrigatórios:**
    *   UUID de requisição unificado (`requestId`) vindo do OS.
*   **Riscos Mapeados:**
    *   *Risco 1:* Vazamento de prompts estratégicos confidenciais ou segredos intelectuais de clientes em traces e células abertas da planilha matriz.
    *   *Risco 2:* Estouro do limite físico de tamanho máximo de caracteres nas células do Google Sheets por persistir longos payloads textuais de rascunhos de posts, quebrando a planilha matriz.
*   **Estratégias de Mitigação:**
    *   O prompt bruto e o output textual da IA **nunca** são inseridos diretamente em células do Sheets.
    *   O cenário do Make.com cria um arquivo `.txt` privado na pasta correspondente do cliente no Google Drive (`05_CONTEUDO/LOGS_IA`) e persiste os textos.
    *   O Make grava na aba `GPT_GERACOES_LOG` apenas os metadados (timestamp, tokens consumidos, custos de API e a **URL direta de referência rápida do .txt no Drive**).
*   **Critérios de Validação em Sandbox (Sem Disparar Produção):**
    *   Simular o envio de um prompt e resposta gerados no ambiente de testes.
    *   Comprovar que a URL correspondente do arquivo do Drive foi persistida na tabela sem poluir as células com textos longos.

---

## 5. Ordem Cronológica Segura de Ativação (Go-Live Progressivo)

Para evitar conflitos lógicos ou sobreposição financeira, a futura ativação física dos cenários em produção deverá seguir estritamente os **3 Lotes de Ativação Segura**:

```mermaid
graph TD
    subgraph Lote_A [Lote A — Logs e Monitoramento (Risco Baixo)]
        Cenario17[17_FLUXAI_GPT_GERACOES_LOG]
        Cenario10[10_FLUXAI_SERVICO_EXTRA_REQUEST]
    end
    
    subgraph Lote_B [Lote B — Firewall e Cotas de IA (Risco Médio)]
        Cenario13[13_FLUXAI_IA_GUARDRAIL]
        Cenario11[11_FLUXAI_IA_CREDITOS_CONTROLE]
    end
    
    subgraph Lote_C [Lote C — Executivos e Financeiros (Risco Alto)]
        Cenario12[12_FLUXAI_SERVICO_EXTRA_APROVACAO]
        Cenario07[07_FLUXAI_RELATORIO_MENSAL]
    end

    Lote_A --> Lote_B
    Lote_B --> Lote_C
```

### Lote A — Logs, Auditoria e Solicitações de Extras (Risco Baixo)
1.  **`17_FLUXAI_GPT_GERACOES_LOG`**: Permite auditar as requisições de IA sem interferir em limites.
2.  **`10_FLUXAI_SERVICO_EXTRA_REQUEST`**: Entrada inofensiva de pedidos de upsell com status de repouso `solicitado`.

### Lote B — Firewall e Cotas de IA (Risco Médio)
3.  **`13_FLUXAI_IA_GUARDRAIL_OPERACIONAL`**: Ativação do validador de créditos antes de permitir geração ativa.
4.  **`11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL`**: Permite debitar os saldos após gerações homologadas.

### Lote C — Transações Financeiras e Camada Executiva (Risco Alto)
5.  **`12_FLUXAI_SERVICO_EXTRA_APROVACAO`**: Atualização financeira e liberação de cotas após aceite de orçamentos.
6.  **`07_FLUXAI_RELATORIO_MENSAL`**: Geração em lote de PDFs mensais.

---

## 6. Plano de Rollback e Contingência Transacional

Caso ocorra alguma falha crítica em runtime após o religamento futuro dos schedules, os seguintes protocolos devem ser executados de forma imediata:

### A. Estouro de Cota ou Falha de API Externa (OpenAI / Meta)
*   **Cenário de Falha:** Erro HTTP `429 Too Many Requests` da OpenAI ou API indisponível.
*   **Ação:** O cenário `13_FLUXAI_IA_GUARDRAIL_OPERACIONAL` deve adotar imediatamente a postura **Fail-Safe**, impedindo novas solicitações e informando ao usuário de forma amigável no OS ("Serviço temporariamente indisponível para manutenção preventiva. Nenhuma cota de IA foi deduzida").

### B. Duplicação de Transações Financeiras ou Créditos Extras
*   **Cenário de Falha:** Cliente realiza cliques sucessivos e o webhook dispara duplamente a aprovação de Serviço Extra, incrementando créditos extras repetidamente.
*   **Ação:** O operador de rede desativa de imediato o schedule de `12_FLUXAI_SERVICO_EXTRA_APROVACAO`. A planilha `IA_CREDITOS_CLIENTE` deve ser inspecionada e corrigida de forma manual via edição de valor de célula, restaurando o saldo inicial e registrando o estorno na coluna observação.

### C. Indisponibilidade de Cotas do Google Slides/Docs (Relatórios Mensais)
*   **Cenário de Falha:** Geração em lote bloqueada por limite diário da API Google Drive/Slides.
*   **Ação:** O cenário `07_FLUXAI_RELATORIO_MENSAL` é desativado. O fechamento do mês correspondente dos clientes afetados passa temporariamente para o **modo manual alternativo** (a equipe comercial exporta os dados da aba `KPI_EXECUTIVO` e monta o PDF de diagnóstico localmente a partir do template espelho local, salvando na pasta 07 do Drive manual).

---

## 7. Checklist Geral de Prontidão (Pre-Go-Live Gate)

Antes de alterar a chave de qualquer cenário crítico no painel do Make para **Active (Schedule On)** nas próximas fases, o time técnico deve marcar com sucesso 100% dos seguintes itens:

- [ ] **1. Rotação de Credenciais Clarity**: Reconfirmado que o Clarity Token foi extraído de todos os blueprints exportados e rotacionado nas conexões.
- [ ] **2. Bateria Sandbox Concluída**: Todos os 6 cenários passaram pelos testes unitários fechados da Seção 4 contra o ID de testes `FLUXAI_LABS_001` sem incidentes.
- [ ] **3. Strict Code Freeze Intacto**: Reatestado por verificação git que o núcleo `/os` e as Edge Functions do proxy não sofreram nenhuma linha de alteração.
- [ ] **4. Postura Fail-Safe Validada**: Comprovado que a falha induzida de conexões com planilhas resulta em bloqueio preventivo seguro e zero vazamentos de tokens operacionais.

---

*Plano de Implementação desenhado e validado pela Equipe de Governança de Elite da FluxAI Labs.*
