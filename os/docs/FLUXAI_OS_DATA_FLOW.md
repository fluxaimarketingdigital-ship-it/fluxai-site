# FLUXAI OS™ — FLUXO DE DADOS
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_DATA_FLOW.md`

---

## Arquitetura de Dados

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FONTES EXTERNAS                              │
│  GA4  │  Meta Ads  │  Instagram  │  Search Console  │  Clarity      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ (coleta automática diária)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           MAKE.COM                                   │
│  • Orquestra webhooks de entrada (leads, demandas, solicitações)    │
│  • Coleta métricas de APIs externas                                 │
│  • Consolida relatórios mensais preliminares                        │
│  • Grava tudo no Google Sheets                                      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GOOGLE SHEETS                                   │
│                  (Banco Operacional Intermediário)                   │
│                                                                     │
│  CLIENTES_CONFIG       SERVICOS_CLIENTES    ROTAS_AUTOMACOES        │
│  DEMANDAS_CLIENTES     LEADS_SITE           LEADS_CLIENTES          │
│  GA4_DIARIO            CLARITY_DIARIO       SEARCH_CONSOLE_DIARIO   │
│  INSTAGRAM_DIARIO      META_ADS_DIARIO      STATUS_MONITOR_DIARIO   │
│  ANALISE_MENSAL_CLIENTE DNA_CLIENTE_GPT     PLANEJAMENTO_CONTEUDO   │
│  IA_CREDITOS_CLIENTE   IA_GERACOES_CONTROLE CATALOGO_SERVICOS       │
│  CONTRATOS_CLIENTES    SERVICOS_EXTRAS      CALENDARIO_POSTAGENS    │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ (leitura / via mock na fase 1)
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUXAI OS™                                  │
│                    (Plataforma Operacional)                          │
│                                                                     │
│  Centro de Comando  │  Clientes  │  Demandas  │  Leads  │  Métricas │
│  Onboarding         │  Relatório │  Aprovação │  GPT    │  Portal   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
              ┌─────────────┼──────────────┐
              ▼             ▼              ▼
        SUPABASE      GOOGLE DRIVE    API GPT
       (Auth +        (Arquivos,      (Geração
        Usuários)      Contratos,      de conteúdo
                       Identidade)     e planejamento)
```

---

## Fluxos por Evento

### Fluxo 1 — Lead do Site
```
Formulário (site)
    → capture.js coleta dados
    → POST para WEBHOOK_CONFIG.LEAD_CAPTURE
    → Make recebe, processa e grava em LEADS_SITE
    → FluxAI OS exibe lead em leads.html (via mock ou Sheets)
    → Operador qualifica e atualiza status
```

### Fluxo 2 — Onboarding de Novo Cliente
```
Operador preenche onboarding-cliente.html (12 blocos)
    → client-onboarding.js coleta e valida
    → Gera Pacote GPT (snapshot JSON)
    → POST para WEBHOOK_CONFIG.CLIENT_ONBOARDING
    → Make cria estrutura nas abas do Sheets
    → Make cria pasta no Google Drive
    → Operador ativa cliente no OS
    → Cliente recebe acesso ao portal
```

### Fluxo 3 — Solicitação de Serviço Extra (Cliente)
```
Cliente acessa client-portal.html
    → Seleciona serviço do catálogo
    → Preenche briefing
    → POST para WEBHOOK_CONFIG.SERVICE_EXTRA_REQUEST
    → Make grava em SERVICOS_EXTRAS_CLIENTES (status: solicitado)
    → Operador vê em clientes.html
    → Operador envia orçamento → status: orcamento_enviado
    → Cliente aprova no portal → status: aprovado
    → Operador executa → status: em_producao → entregue
```

### Fluxo 4 — Geração de Conteúdo com IA
```
Operador acessa content-engine.html
    → Seleciona cliente e escopo
    → OS monta contexto (DNA + Contrato + Extras + Métricas)
    → Envia para API GPT
    → Retorno = rascunho (sem crédito consumido)
    → Operador revisa → aprova internamente (1 crédito)
    → Publicado → crédito definitivo
    → OS atualiza IA_CREDITOS_CLIENTE
```

### Fluxo 5 — Relatório Mensal
```
Make consolida dados do mês em ANALISE_MENSAL_CLIENTE
    → Status inicial: rascunho
    → Operador vê em relatorio-mensal.html
    → Operador edita e aprova internamente → em_revisao → aprovado_internamente
    → Operador envia ao cliente → enviado_ao_cliente
    → Cliente vê no portal (somente leitura)
```

### Fluxo 6 — Sincronização de Métricas (Automático)
```
Make (agendado — ex: 00h diário)
    → Coleta GA4, Instagram, Meta Ads, Search Console, Clarity
    → Grava em abas _DIARIO correspondentes
    → FluxAI OS exibe em metricas.html via Sheets (fase 2) ou mock (fase 1)
```

---

## Camadas de Persistência

| Camada | Tecnologia | Tipo de Dado | Fase |
|--------|-----------|-------------|------|
| Auth e Usuários | Supabase | Sessões, profiles, roles | Atual |
| Dados Operacionais | Google Sheets | Clientes, métricas, leads | Atual |
| Arquivos e Mídia | Google Drive | PDFs, imagens, contratos | Atual |
| Logs de Geração IA | Google Sheets (GPT_LOG) | Histórico de gerações | Atual |
| Dados Relacionais | Supabase (futuro) | Projetos, permissões granulares | Fase 2 |

---

## IDs e Identificadores

| Entidade | ID Padrão | Exemplo |
|----------|-----------|---------|
| Cliente | `cliente_id` | `CLI_NUTRI_001` |
| Lead | `id_lead` | `LEAD_20260525_001` |
| Demanda | `id_demanda` | `DEM_CLI001_001` |
| Relatório | `id_relatorio` | `REL_CLI001_2026_05` |
| Rota Make | `id_rota` | `ROTA_IG_CLI001` |
| Serviço Extra | `id_extra` | `EXT_CLI001_001` |
| Geração IA | `id_geracao` | `GPT_CLI001_20260525_01` |
