# 🚀 Guia de Ativação Final (Make.com e Matriz Mestra)

Este é o seu manual definitivo de voo para ligar a operação da FluxAI Labs no automático. Siga exatamente estas configurações para que a sua inteligência de dados opere sem falhas.

---

## 1. Horários e Frequência dos Cenários (Schedules)

A regra de ouro da inteligência de tráfego é o **D-1** (ler os dados do dia anterior). O Google e a Meta demoram para consolidar as métricas, então seus robôs devem rodar de madrugada, quando a internet "dorme".

### 🌙 Módulo Diário (Sincronização de Madrugada)
*Devem rodar todos os dias (Every Day). Ajuste os minutos para que eles não rodem ao mesmo tempo (efeito cascata).*

*   **`03_FLUXAI_INSTAGRAM_MANUAL_READER`**
    *   **Schedule:** 03:00 AM
    *   *Objetivo:* Puxar os dados de ontem logo no início da madrugada.
*   **`06_FLUXAI_META_SYNC`**
    *   **Schedule:** 03:30 AM
    *   *Objetivo:* Puxar Ads e Insights via API (D-1).
*   **`04_FLUXAI_CONTENT_INTELLIGENCE`**
    *   **Schedule:** 03:45 AM (Ou logo após o 06)
    *   *Objetivo:* Avaliar os conteúdos puxados.
*   **`05_FLUXAI_DAILY_SYNC`** (GA4, Search Console, Clarity)
    *   **Schedule:** 04:00 AM
    *   *Objetivo:* O GA4 já fechou os dados do dia anterior. Hora de plugar e salvar.
*   **`08_FLUXAI_CLIENT_STATUS_MONITOR`**
    *   **Schedule:** 04:30 AM
    *   *Objetivo:* Verificar quem está ativo ou inativo.
*   **`19_FLUXAI_CONSOLIDADO_DIARIO`**
    *   **Schedule:** 05:00 AM
    *   *Objetivo:* Consolida tudo que os robôs acima puxaram nas últimas 2 horas.

### 📅 Módulo Mensal
*   **`07_FLUXAI_RELATORIO_MENSAL`**
    *   **Schedule:** Dia 1º de cada mês (ex: 06:00 AM)
    *   *Objetivo:* Compila os 30/31 dias consolidados do mês anterior.

### ⚡ Módulo de Reação Imediata (Webhooks)
*Não dependem de horário, são engatilhados no momento em que a ação acontece.*

*   **`10_FLUXAI_SERVICO_EXTRA_REQUEST` (Cenário Oficial)**
    *   **Schedule:** `Immediately` (Imediatamente).
*   **Cenários de Captura de Leads (Cenários 01, 02, etc)**
    *   **Schedule:** `Immediately` (Imediatamente).

---

## 2. Regras de Cadastro (A Planilha Mestra)

A aba `02_CLIENTES_ATIVOS` e a aba `03_SERVICOS_CLIENTES` são o cérebro da operação. O Make é burro, ele só obedece o que está escrito ali.

### 🏢 A sua agência (FluxAI Labs)
Para monitorar as próprias métricas da FluxAI:
1.  **ID Padrão:** Use sempre o `client_id` como `FLUXAI_LABS_001`.
2.  **Aba 02:** Cadastre o status como `Ativo`.
3.  **Aba 03:** Marque com "SIM" (ou coloque o token correspondente) os serviços que você vai puxar de si mesma (ex: `instagram_api`, `ga4_api`). Se você não roda Meta Ads, deixe vazio ou "NÃO".

### 🤝 Novos Clientes
Quando fechar um novo contrato, o procedimento na Matriz Mestra é:
1.  **Criar o ID:** Gere um ID único sem espaços (ex: `EMPRESA_X_001`).
2.  **Cadastro Inicial (Aba 02):** Coloque nome, email do cliente, data de início e defina status como `Ativo`.
3.  **Liberação de Módulos (Aba 03):** 
    *   Ligue os serviços que ele contratou. O cenário `05` só vai puxar o GA4 dele se a coluna do GA4 estiver liberada.
    *   **Muito Importante:** Preencha a coluna `modo_coleta` (ex: `api` ou `manual`). O sistema de Inteligência Base usa isso para decidir que rota seguir.

### O "Fail-Safe"
O sistema que construímos é à prova de erros. Se você esquecer de preencher um dado, o robô vai abortar a operação para aquele cliente e tentar o próximo, sem quebrar o ecossistema.
