# MAPA DE WEBHOOKS MAKE.COM — FluxAI OS™
## Catálogo de Integrações e Fluxos de Automação

---

## 1. Princípios de Integração com o Make.com
O **FluxAI OS™** atua como painel de comando e governança, enquanto o **Make.com** orquestra os cenários que manipulam o **Google Sheets** (banco de dados operacional) e o **Google Drive** (arquivos pesados).
Toda ação de escrita no banco operacional é transacional e dispara um webhook.

> [!WARNING]
> **Consistência Transacional Obrigatória:**
> O FluxAI OS™ realiza atualizações na interface de usuário e persiste dados localmente **apenas após** receber o retorno HTTP 200/Accepted do webhook do Make. Se o webhook falhar, o OS cancelará a persistência, fará rollback dos limites/status e registrará um log de erro.

---

## 2. Catálogo Oficial de Webhooks

### 1. Captura de Leads (`LEAD_CAPTURE`)
*   **ID do Webhook (OS):** `LEAD_CAPTURE`
*   **Cenário Make:** `[FluxAI OS] 01 - Lead Capture Site`
*   **Aba do Sheets Alimentada:** `LEADS_SITE`
*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)
*   **Risco Operacional:** **Baixo**. Se falhar, o lead preenchido não é gravado na base de vendas imediatamente, mas os dados ficam preservados no log de erro local.

### 2. Onboarding de Cliente (`CLIENT_ONBOARDING`)
*   **ID do Webhook (OS):** `CLIENT_ONBOARDING`
*   **Cenário Make:** `[FluxAI OS] 02 - Onboarding Cliente`
*   **Abas do Sheets Alimentadas:** `CLIENTES_CONFIG`, `SERVICOS_CLIENTES`, `CONTRATOS_CLIENTES`, `DNA_CLIENTE_GPT`
*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)
*   **Risco Operacional:** **Médio**. Se falhar, o cliente não terá pastas criadas no Drive e seu cadastro ficará parcial. O operador deve disparar o onboarding novamente.

### 3. Solicitação de Serviço Extra pelo Cliente (`SERVICE_EXTRA_REQUEST`)
*   **ID do Webhook (OS):** `SERVICE_EXTRA_REQUEST`
*   **Cenário Make:** `[FluxAI OS] 03 - Solicitação de Servico Extra`
*   **Aba do Sheets Alimentada:** `SERVICOS_EXTRAS_CLIENTES`
*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)
*   **Risco Operacional:** **Médio**. Se falhar, a solicitação do cliente não constará na planilha operacional. O rollback garante que a interface do portal mostre o erro.

### 4. Aprovação de Orçamento de Serviço Extra (`SERVICE_EXTRA_APPROVAL`)
*   **ID do Webhook (OS):** `SERVICE_EXTRA_APPROVAL`
*   **Cenário Make:** `[FluxAI OS] 04 - Aprovação de Orçamento Extra`
*   **Aba do Sheets Alimentada:** `SERVICOS_EXTRAS_CLIENTES`, `IA_CREDITOS_CLIENTE` (se houver créditos adicionais)
*   **Status de Ativação:** **Real** (whitelisted em `enabledRealWebhooks`)
*   **Risco Operacional:** **Crítico**. Se falhar, o serviço extra aprovado pode começar a ser produzido sem estar faturado, ou os créditos adicionais de IA podem não ser liberados. O rollback reverte a aprovação instantaneamente.

### 5. Atualização de Status da Demanda (`DEMAND_STATUS_UPDATE`)
*   **ID do Webhook (OS):** `DEMAND_STATUS_UPDATE`
*   **Cenário Make:** `[FluxAI OS] 05 - Alterar Status Demanda`
*   **Aba do Sheets Alimentada:** `DEMANDAS_CLIENTES`
*   **Status de Ativação:** **Simulado / A configurar**
*   **Risco Operacional:** **Baixo**. Controla a transição de status das tarefas. Se simulado, persiste direto localmente e registra log de simulação.

### 6. Publicação Manual Assistida (`CONFIRM_MANUAL_POST`)
*   **ID do Webhook (OS):** `CONFIRM_MANUAL_POST`
*   **Cenário Make:** `[FluxAI OS] 06 - Confirmar Publicacao`
*   **Aba do Sheets Alimentada:** `IA_CREDITOS_CLIENTE` (consome limite definitivo)
*   **Status de Ativação:** **Simulado / A configurar**
*   **Risco Operacional:** **Alto**. Se falhar e não registrar o consumo de cota, o cliente poderá estourar o limite de posts contratados sem detecção do sistema.

---

## 3. Payload Esperado (Exemplo: `SERVICE_EXTRA_APPROVAL`)
O OS envia o payload estruturado contendo a auditoria do operador e os dados da transação:

```json
{
  "evento": "service_extra_approval",
  "timestamp": "2026-05-26T18:45:00-03:00",
  "cliente_id": "CLI_XXXX_001",
  "servico_id": "SRV_EXTRA_001",
  "valor_aprovado": 1200.00,
  "impacto_gpt": true,
  "creditos_extras": 5,
  "operador_auth": {
    "email": "kassia@fluxai.com",
    "role": "OPERATOR"
  }
}
```
Retorno esperado do Make.com:
*   **Sucesso:** HTTP 200/202 com JSON `{ "success": true, "message": "Transaction persisted in Sheets" }`
*   **Erro:** HTTP 500 ou timeout (10s) que dispara o rollback de transação.
