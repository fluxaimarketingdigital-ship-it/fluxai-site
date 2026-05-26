# FLUXAI OS™ — MAPA DE WEBHOOKS
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_WEBHOOK_MAP.md`

---

## Princípio

O FluxAI OS™ **não escreve diretamente** no Google Sheets.
Toda escrita de dados operacionais passa pelo Make.com via webhook.

O Make é o orquestrador. O OS é a interface de comando.

---

## Mapa Completo de Webhooks

### Webhooks de SAÍDA (OS → Make)

| Chave em `WEBHOOK_CONFIG` | Evento Disparador | Aba de Destino no Sheets | Status |
|--------------------------|-------------------|--------------------------|--------|
| `LEAD_CAPTURE` | Formulário de lead no site | `LEADS_SITE` | ✅ Configurado |
| `CLIENT_ONBOARDING` | Ativar cliente no onboarding | `CLIENTES_CONFIG`, `SERVICOS_CLIENTES`, `DNA_CLIENTE_GPT`, `CONTRATOS_CLIENTES` | ⏳ A configurar |
| `SERVICE_EXTRA_REQUEST` | Cliente solicita serviço extra no portal | `SERVICOS_EXTRAS_CLIENTES` | ⏳ A configurar |
| `SERVICE_EXTRA_INTERNAL` | Operador adiciona serviço extra manualmente | `SERVICOS_EXTRAS_CLIENTES` | ⏳ A configurar |
| `DEMAND_STATUS_UPDATE` | Operador atualiza status de demanda | `DEMANDAS_CLIENTES` | ⏳ A configurar |
| `REPORT_STATUS_UPDATE` | Operador muda status do relatório | `ANALISE_MENSAL_CLIENTE` | ⏳ A configurar |

### Webhooks de ENTRADA (Make → OS) — Fase 2

| Evento | Descrição |
|--------|-----------|
| Sync de métricas diárias | Make envia resumo ao OS após coletar APIs externas |
| Novo lead processado | Make confirma que lead foi gravado no Sheets |
| Status de rota atualizado | Make notifica o OS de falha ou sucesso em automação |

---

## Payload Padrão — Lead Capture

```json
{
    "cliente_id": "FLUXAI_LABS_001",
    "origem_site": "site_fluxai",
    "nome_lead": "Nome do Contato",
    "email": "email@dominio.com",
    "telefone": "71 99999-0000",
    "empresa": "Nome da Empresa",
    "servico_interesse": "diagnostico_estrategico",
    "canal_origem": "site",
    "campanha": "utm_campaign_value",
    "pagina_origem": "https://www.fluxaidigital.com.br/",
    "status_lead": "novo",
    "responsavel": "FluxAI",
    "observacao": ""
}
```

---

## Payload Padrão — Client Onboarding

```json
{
    "evento": "client_onboarding",
    "timestamp": "2026-05-25T22:00:00Z",
    "operador_id": "user_id_do_operador",
    "dados_principais": {
        "cliente_id": "CLI_XXXX_001",
        "nome_interno": "...",
        "nome_comercial": "...",
        "email": "...",
        "telefone": "...",
        "website": "...",
        "instagram": "@...",
        "status": "onboarding",
        "data_inicio": "2026-05-25"
    },
    "contrato": {
        "drive_url": "https://drive.google.com/...",
        "valor_global": "...",
        "vigencia_meses": 12,
        "dia_vencimento": 5
    },
    "servicos_contratados": ["social_media", "trafego_pago"],
    "servicos_extras": [],
    "drive": {
        "pasta_cliente": "...",
        "identidade_visual": "...",
        "contrato": "...",
        "logo_principal": "...",
        "logo_secundaria": "...",
        "referencias": "...",
        "entregas": "..."
    },
    "dna": {
        "objetivo_principal": "...",
        "publico_alvo": "...",
        "oferta_principal": "...",
        "dor_mais_forte": "...",
        "diferencial_real": "...",
        "tom_de_voz": "...",
        "palavras_proibidas": "...",
        "formatacao_exigida": "..."
    },
    "tokens": {
        "instagram_business_id": "...",
        "meta_ad_account_id": "...",
        "ga4_property_id": "...",
        "gtm_id": "...",
        "clarity_project_id": "...",
        "search_console_property": "...",
        "status_geral": "aguardando_autorizacao"
    },
    "planejamento_inicial": {
        "briefing_mes_1": "...",
        "alinhamento_kickoff": "..."
    }
}
```

---

## Payload Padrão — Serviço Extra (Cliente via Portal)

```json
{
    "evento": "service_extra_request",
    "timestamp": "2026-05-25T22:00:00Z",
    "cliente_id": "CLI_XXXX_001",
    "project_id": "proj_...",
    "servico_id": "SRV_EXTRA_001",
    "nome_servico": "Pack de Reels Premium",
    "descricao": "...",
    "briefing": "...",
    "status": "solicitado",
    "origem": "portal_cliente"
}
```

---

## Boas Práticas

1. **Todo webhook deve ter timeout de 10s** — Use `Promise.race` com um AbortController.
2. **Erros de webhook não devem travar a UI** — O OS continua funcionando mesmo se o Make falhar.
3. **Sempre logar o resultado** — Sucesso e erro devem aparecer no log operacional.
4. **Nunca reenviar automaticamente** — Se o Make falhar, o operador decide se reenvia.
5. **Payload sempre com `timestamp` e `evento`** — Facilita o filtro no Make.
