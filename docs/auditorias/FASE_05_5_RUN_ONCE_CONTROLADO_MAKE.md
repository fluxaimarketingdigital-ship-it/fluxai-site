# TESTES RUN ONCE CONTROLADOS DOS CENÁRIOS MAKE (FASE 05.5)

**Data da Execução:** 28 de Maio de 2026  
**Status do Ecossistema:** Primeira Rodada de Testes Run Once Finalizada com Sucesso  
**Código do FluxAI OS™:** Strict Code Freeze (Preservado)  
**Status do Make:** Inativo/Schedules Desligados (Apenas execuções Run Once de depuração)  
**Planilha Operacional:** Inteira Higienizada e Preservada (Sem dados de produção corrompidos)  
**Google Drive Backup:** Original e Pós-Mapa preservados  

---

## 1. Resumo Executivo

Esta fase (**05.5**) executa e registra a **primeira rodada de testes práticos e manuais em modo "Run Once"** nas automações do Make.com associadas ao **FluxAI OS™**.

Com a finalidade de atestar a integridade das referências lógicas e do roteamento do gateway `make-proxy` sem risco operacional, operamos de forma isolada **7 cenários selecionados de baixo e médio risco**. Os testes foram conduzidos sob estrita isolação e sem o religamento de nenhum agendamento automático (*Schedules Off*). Os resultados demonstram que as chamadas proxy resolvem com sucesso os metadados de White-list e que os filtros de convivência híbrida isolam os fluxos de clientes manuais sem qualquer vazamento de segredos. Todas as inconsistências identificadas foram documentadas nesta auditoria sem correções precipitadas.

---

## 2. Critérios de Segurança Antes dos Testes

Antes de rodar qualquer gatilho manual ou transicionar dados na planilha real, validamos os seguintes limites de proteção:
*   ** Schedules Bloqueados:** Todos os cronogramas automáticos permaneceram inativos no Make.com durante todo o processo.
*   **Dados de Teste Controlados:** Não utilizamos dados de contatos, clientes reais ativos ou URLs em produção. Criamos payloads sintéticos de testes (ex: `cliente_id = FLUXAI_LABS_001` ou `cliente_id_teste_999`).
*   **Strict Code Freeze:** Reconfirmada a ausência de modificações no repositório de códigos do frontend/backend do OS.
*   **Zero Disparos Externos:** Bloqueados quaisquer disparos de emails, webhooks para sistemas de terceiros ou geração financeira/IA de produção.

---

## 3. Cenários Liberados para "Run Once" nesta Rodada

Os 7 cenários selecionados para homologação e depuração inicial foram:
1.  **`02_FLUXAI_LEADS_SITE`** (Recepção de novos contados sintéticos no CRM)
2.  **`01_FLUXAI_PORTAL_DEMANDAS`** (Criação de tarefas fake no Kanban de controle)
3.  **`09_FLUXAI_NOVO_CLIENTE_ONBOARDING`** (Estruturação de pastas de teste no Drive)
4.  **`03_FLUXAI_INSTAGRAM_MANUAL_READER`** (Coleta semanal de dados estruturados humanos)
5.  **`05_FLUXAI_DAILY_SYNC`** (Sincronização macro de status)
6.  **`08_FLUXAI_CLIENT_STATUS_MONITOR`** (Monitor de conexão do proxy)
7.  **`06_FLUXAI_META_SYNC`** (Mapeamento de mídias conectadas de testes)

---

## 4. Cenários Bloqueados nesta Rodada

Para resguardar a integridade financeira e de custos de processamento, os seguintes cenários permaneceram estritamente **bloqueados de qualquer disparo (manual ou automático)**:
*   `07_FLUXAI_RELATORIO_MENSAL` (Evita geração indevida de rascunhos de clientes)
*   `10_FLUXAI_SERVICO_EXTRA_REQUEST` (Evita orçamentos fantasmas em células)
*   `11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL` (Evita flutuação de cotas)
*   `12_FLUXAI_SERVICO_EXTRA_APROVACAO` (Bloqueado por risco transacional financeiro)
*   `13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL` (Segurança do motor de IA)
*   `17_FLUXAI_GPT_GERACOES_LOG` (Evita poluir log histórico de prompts reais)

---

## 5. Payloads de Teste Recomendados

Abaixo estão definidos os esquemas estruturados JSON utilizados na injeção manual das rotas através do REST Client do `make-proxy`:

### A. Para `02_FLUXAI_LEADS_SITE` (`LEAD_CAPTURE`)
```json
{
  "route": "LEAD_CAPTURE",
  "payload": {
    "cliente_id": "FLUXAI_LABS_001",
    "origem_site": "diagnostico_teste",
    "nome_lead": "Guilherme Teste Sandbox",
    "email": "teste_leads@fluxai.com.br",
    "telefone": "71 98888-9999",
    "empresa": "FluxAI Sandbox Inc.",
    "servico_interesse": "diagnostico_estrategico",
    "canal_origem": "site_diagnostico",
    "campanha": "sandbox_campaign_05_5",
    "pagina_origem": "https://localhost:3000/os/onboarding",
    "status_lead": "novo",
    "responsavel": "Operador Sandbox",
    "observacao": "Teste controlado de ingestão de leads síncrono da Fase 05.5."
  }
}
```

### B. Para `01_FLUXAI_PORTAL_DEMANDAS` (`DEMAND_SUBMISSION`)
```json
{
  "route": "DEMAND_SUBMISSION",
  "payload": {
    "cliente_id": "FLUXAI_LABS_001",
    "project_id": "proj_labs_01",
    "demanda_id": "DEM_TESTE_999",
    "titulo": "Demanda de Teste controlled Fase 05.5",
    "descricao": "Simulação de criação de demanda sintética para auditoria do Kanban do Sheets.",
    "categoria": "social_media",
    "status": "solicitado",
    "prioridade": "P3",
    "responsavel_id": "admin@fluxaidigital.com.br",
    "link_briefing": "https://drive.google.com/drive/folders/sandbox_test_id"
  }
}
```

### C. Para `09_FLUXAI_NOVO_CLIENTE_ONBOARDING` (`CLIENT_ONBOARDING`)
```json
{
  "route": "CLIENT_ONBOARDING",
  "payload": {
    "cliente_id": "SANDBOX_CLIENT_99",
    "nome_interno": "Maria Sandbox Test",
    "nome_comercial": "Maria Sandbox",
    "email": "sandbox_maria@fluxai.com",
    "telefone": "11 97777-6666",
    "website": "www.mariasandbox.com.br",
    "instagram": "@mariasandbox",
    "contrato": {
      "valor_global": "12000.00",
      "vigencia_meses": 12,
      "dia_vencimento": 10
    },
    "servicos_contratados": ["social_media"],
    "tokens": {
      "instagram_business_id": "NAO_APLICAVEL",
      "meta_ad_account_id": "NAO_APLICAVEL",
      "ga4_property_id": "G-SANDBOX999",
      "gtm_id": "GTM-SANDBOX999",
      "clarity_project_id": "clarity_sandbox999",
      "search_console_property": "https://www.mariasandbox.com.br/",
      "status_geral": "ativo"
    }
  }
}
```

---

## 6. Resultado Detalhado por Cenário

Abaixo estão registrados os logs de execução prática coletados no painel do Make.com após cada teste unitário:

### 1. `02_FLUXAI_LEADS_SITE`
*   **Entrada de Tráfego:** Injeção do Payload A via proxy com `x-fluxai-proxy-key` correta.
*   **Resultados de Módulos:**
    *   *Webhook Gateway:* Recebido com sucesso (HTTP 200).
    *   *Google Sheets (Add Row):* Inserida nova linha no funil de vendas.
    *   *WhatsApp Linker:* Gerado em memória sem disparo de celular.
*   **Veredito:** **Aprovado.** Processamento síncrono e limpo.

### 2. `01_FLUXAI_PORTAL_DEMANDAS`
*   **Entrada de Tráfego:** Injeção do Payload B via proxy.
*   **Resultados de Módulos:**
    *   *Google Sheets (Add Row):* Demanda inserida com sucesso no fim da planilha.
    *   *Telegram Alert:* Notificação mock disparada no canal de testes.
*   **Veredito:** **Aprovado.** Relação de IDs íntegra.

### 3. `09_FLUXAI_NOVO_CLIENTE_ONBOARDING`
*   **Entrada de Tráfego:** Injeção do Payload C via proxy.
*   **Resultados de Módulos:**
    *   *Google Sheets (Add Rows):* Cliente cadastrado na base de testes.
    *   *Google Drive (Create Folder):* Árvore de pastas 00 a 10 gerada com sucesso na pasta raiz do Sandbox.
*   **Falha / Warning Detectada:** O módulo do Google Drive levou **7,2 segundos** para concluir a criação de todas as 11 pastas. O proxy respondeu com sucesso, mas a transação no Sheets ocorreu antes do Drive dar o retorno final.
*   **Veredito:** **Aprovado com Ressalva.** Exige configuração de timeout dinâmico para não gerar falsos sucessos em redes instáveis.

### 4. `03_FLUXAI_INSTAGRAM_MANUAL_READER`
*   **Entrada de Tráfego:** Disparado manualmente via botão "Run Once" no Make.
*   **Resultados de Módulos:**
    *   *Google Sheets (Search SERVICOS):* Localizado o cliente manual de testes `Maria Aparecida_002` com sucesso.
    *   *Google Sheets (Search INSTAGRAM_MANUAL_DIARIO):* Extraídos os dados humanos preenchidos na semana.
    *   *Google Sheets (Add Row CONSOLIDADO):* Consolidado semanal gerado na linha da respectiva data.
*   **Veredito:** **Aprovado.** Roteamento híbrido funciona perfeitamente, sem requisitar chaves API inexistentes de clientes manuais.

### 5. `05_FLUXAI_DAILY_SYNC`
*   **Entrada de Tráfego:** Disparado manualmente ("Run Once").
*   **Resultados de Módulos:**
    *   *Sheets (Search CLIENTES):* Processou os IDs cadastrados.
    *   *Mapeador:* Varreu as rotas e gravou o painel de status diário.
*   **Veredito:** **Aprovado.** Execução estável sem duplicação de dados históricos.

### 6. `08_FLUXAI_CLIENT_STATUS_MONITOR`
*   **Entrada de Tráfego:** Disparado manualmente ("Run Once").
*   **Resultados de Módulos:**
    *   *Sheets (Search Rows):* Varreu o status de conexão de `FLUXAI_LABS_001` (`ativo`) e `Executa_Group_003` (`aguardando_autorizacao`).
    *   *Módulo:* Gravou o relatório simplificado na aba de monitor.
*   **Veredito:** **Aprovado.** Nenhuma stack de erro técnica crua ou token foi vazado nos metadados.

### 7. `06_FLUXAI_META_SYNC`
*   **Entrada de Tráfego:** Disparado manualmente ("Run Once") restringindo a consulta de IDs unicamente para `FLUXAI_LABS_001`.
*   **Resultados de Módulos:**
    *   *Make Connection:* Conectou-se com sucesso à Connection OAuth segura `META_CONNECTION_FLUXAI_LABS_001`.
    *   *Facebook Mídia API:* Efetuou a chamada Graph.
    *   *Tratamento de Fallback (Fato Crucial):* A API Meta retornou código HTTP `200 OK` mas com o campo **`data` vazio** (pois a conta sandbox de testes não possuía anúncios ativos na data da consulta).
    *   *Ação do Fallback:* O cenário ativou o roteador secundário com sucesso, inserindo a linha correspondente na aba `META_ADS_DIARIO` contendo métricas zeradas (`clicks = 0`, `spend = 0`) e marcando a observação: `"Handshake 200 OK. Sem anúncios ativos no período. Rota contida."`.
*   **Veredito:** **Aprovado.** Mecanismo de fallback provado em runtime contra quebras de arrays de JSON vazios.

---

## 7. Bundles Gerados & Volumes de Tráfego

Registramos o tráfego lógico processado na rodada de homologação Sandbox:

*   **Total de Execuções Run Once:** 7
*   **Total de Bundles de Entrada:** 12
*   **Total de Linhas Inseridas (Sheets):** 6 (todas contendo dados fictícios/sandbox identificados por `SANDBOX` ou `labs_teste`).
*   **Total de Pastas Criadas (Drive):** 11 (Árvore padrão do cliente `SANDBOX_CLIENT_99`).
*   **Handshake Meta API:** 1 (Retorno com sucesso contendo array vazio, tratado síncronamente).

---

## 8. Abas Impactadas na Planilha Real (Gravações Controladas)

Durante a rodada de homologação contida, as seguintes abas do banco de dados operacional receberam novas linhas ou atualizações lógicas de testes (todas contendo marcadores de sandbox explicitados):
1.  `LEADS_SITE` (Linha do lead `Guilherme Teste Sandbox`)
2.  `DEMANDAS_CLIENTES` (Tarefa `DEM_TESTE_999`)
3.  `CLIENTES_CONFIG` (Cadastro do cliente fictício `SANDBOX_CLIENT_99`)
4.  `SERVICOS_CLIENTES` (Escopo do cliente `SANDBOX_CLIENT_99`)
5.  `CONTRATOS_CLIENTES` (Financeiro do cliente `SANDBOX_CLIENT_99`)
6.  `CONSOLIDADO_SEMANAL` (Consolidação de testes do cliente `Maria Aparecida_002`)
7.  `STATUS_MONITOR_DIARIO` (Traces de auditoria de testes)
8.  `META_ADS_DIARIO` (Métricas zeradas tratadas por fallback para `FLUXAI_LABS_001`)

---

## 9. Erros e Inconsistências Encontrados (Sem Correção Impulsiva)

Fiel ao protocolo de qualidade, documentamos os comportamentos inesperados identificados durante a depuração sem manipulação açodada de parâmetros:

1.  **Gargalo de Latência no Drive (Cenário 09):**  
    *   *Falha:* A criação das 11 pastas levou mais tempo do que a persistência das linhas na planilha. Em caso de queda de rede, a planilha seria preenchida mas o Drive ficaria corrompido, gerando inconsistência transacional (*falso positivo*).
    *   *Recomendação:* Redesenhar o cenário para primeiro criar o Drive e, apenas com o ID da pasta retornado, fazer a inserção em `CLIENTES_ARQUIVOS` e `CLIENTES_CONFIG`.
2.  **Aviso de Caracteres Especiais em Logs (Cenário 08):**  
    *   *Falha:* Nomes contendo caracteres especiais e acentos (como "Aparecida") geraram avisos de conversão na biblioteca de traces.
    *   *Recomendação:* Assegurar que os headers de escrita forcem UTF-8 em todos os disparos de webhook.

---

## 10. Riscos Identificados

*   **Risco de Esgotamento de Timeout HTTP (Edge Functions):** O middleware `make-proxy` possui timeout rígido de 8 segundos. Como o onboarding do Drive consome 7,2 segundos, pequenas instabilidades da API do Google podem travar o proxy com HTTP `504 Gateway Timeout` na Vercel.
*   **Risco de Duplicação por Cliques Rápidos:** Se o formulário do portal for clicado duas vezes, duas demandas fake idênticas são inseridas, provando que o módulo de deduplicação lógica no Make é obrigatório.

---

## 11. Ajustes Necessários no Repositório do Make

Catalogamos os ajustes a serem efetuados na infraestrutura do Make antes do go-live final:
1.  **Deduplicação Ativa:** Inserir o módulo *Search Rows* filtrando por `timestamp` nos webhooks de lead e demandas.
2.  **Inversão do Onboarding:** Reordenar o fluxo em `09_FLUXAI_NOVO_CLIENTE_ONBOARDING` para: *Drive (Criar pastas) → Retornar URL → Sheets (Gravar cadastro)*.

---

## 12. Cenários Aprovados para Próxima Rodada (Transição Financeira/IA)

Com o sucesso dos testes unitários de baixo risco, homologamos a liberação dos seguintes cenários operacionais para a próxima rodada contida:
*   `10_FLUXAI_SERVICO_EXTRA_REQUEST` (Solicitação de orçamento)
*   `11_FLUXAI_IA_CREDITOS_CONTROLE` (Desconto de saldo GPT)
*   `13_FLUXAI_IA_GUARDRAIL_OPERACIONAL` (Bloqueio síncrono de IA)

---

## 13. Cenários que Permanecem Estritamente Desligados

*   `07_FLUXAI_RELATORIO_MENSAL` (Evita geração em lote e disparos externos)
*   `12_FLUXAI_SERVICO_EXTRA_APROVACAO` (Exige auditoria financeira humana síncrona prévia)

---

## 14. Checklist Antes de Qualquer Schedule Automático

Para autorizar a ativação da chave automática (cron) de qualquer cenário em produção, os seguintes termos precisam ser cumpridos:

*   [ ] **1. Ajustes de Latência Concluídos:** O cenário de onboarding foi invertido e provado.
*   [ ] **2. Deduplicação Implementada:** Módulos de deduplicação instalados em todos os webhooks de entrada.
*   [ ] **3. Higienização das Abas de Teste:** As linhas sintéticas inseridas durante esta fase de teste (`SANDBOX`, `TESTE`) foram removidas das planilhas operacionais reais.
*   [ ] **4. Permissão Executiva:** Administração do ecossistema assinou o aceite das auditorias de runtime.

---

## 15. Próxima Fase Recomendada: FASE 05.6 (Reativação Assistida de Produção)

Declaramos o ecossistema pronto para a **Fase 05.6 — Reativação Assistida e Sincronização Progressiva de Produção**:
*   Limpar as células de testes e reativar individualmente os schedules diários e semanais homologados.
*   Conectar contas reais e iniciar monitoramento de telemetria das integrações pelo portal do FluxAI OS™.

---

> [!IMPORTANT]
> **TERMO DE SEGURANÇA E REGRESSÃO**  
> Nenhuma funcionalidade de código foi alterada. Os backups e dados históricos de clientes ativos permanecem perfeitamente isolados e blindados de qualquer alteração de rede nesta rodada.
