# MAPA TÉCNICO COMPLETO DO FLUXAI OS™

**Versão:** 1.1.0
**Status:** Oficial (Inventário Factual Baseado em Evidências)
**Data:** 09/07/2026

Este documento mapeia factualmente a arquitetura atual do FluxAI OS™. Todas as informações aqui contidas foram auditadas diretamente do código-fonte, sem estimativas ou presunções.

---

## 1. MÓDULOS E PÁGINAS EXISTENTES (EVIDÊNCIA: PASTA `os/`)

As seguintes páginas/módulos existem factualmente no repositório:

*   `access-denied.html`
*   `ajuda.html`
*   `approval.html`
*   `client-portal.html`
*   `cliente-detalhe.html`
*   `clientes.html`
*   `command-center.html`
*   `content-engine.html`
*   `contract-view.html`
*   `contracts-finance.html`
*   `demandas.html`
*   `executive-center.html`
*   `flux-calendar.html`
*   `fluxai-academy.html`
*   `governance-users.html`
*   `governance.html`
*   `leads.html`
*   `login.html`
*   `logs.html`
*   `metricas.html`
*   `onboarding.html`
*   `operations-center.html`
*   `relatorio-mensal.html`
*   `termos-de-uso.html`

---

## 2. TABELAS FACTUAIS ENCONTRADAS NAS QUERIES (EVIDÊNCIA: `os/js/`)

Baseado em chamadas reais de `supabase.from(...)` no código:

| Tabela Utilizada | Arquivo(s) Comprovado(s) |
| :--- | :--- |
| `projects` | `os-knowledge-core.js`, `ui-helpers.js`, `clients.js` |
| `contracts` | `os-knowledge-core.js` |
| `extra_services_contracts` | `os-knowledge-core.js` |
| `CLIENTES_ESTRATEGIA` | `onboarding.js`, `cliente-detalhe.js`, `clients.js` |
| `CONTRATOS_CLIENTES` | `cliente-detalhe.js`, `clients.js`, `contracts-finance.js` |
| `IA_CREDITOS_CLIENTE` | `cliente-detalhe.js` |
| `PLANEJAMENTO_CONTEUDO` | `cliente-detalhe.js`, `approval.js` |
| `SERVICOS_EXTRAS_CLIENTES` | `cliente-detalhe.js`, `contracts-finance.js` |
| `FINANCEIRO_CLIENTES` | `cliente-detalhe.js`, `contracts-finance.js` |
| `DEMANDAS_CLIENTES` | `cliente-detalhe.js`, `demandas.js` |
| `COMUNICACOES_CLIENTE` | `cliente-detalhe.js` |
| `operational_events` | `os-integration.js`, `command-center.js` |
| `fluxai_bank_accounts` | `contracts-finance.js` |

---

## 3. INTEGRAÇÕES COMPROVADAS PELO CÓDIGO

*   **Supabase Database & Auth:** Evidenciado por múltiplas importações do `supabaseClient` global e requisições via `authedClient.from()`.

---

## 4. INVENTÁRIO DE DÍVIDA TÉCNICA (Baseado em Evidências)

### 4.1 Uso de `SELECT *` (Over-fetching)

*   `os/js/utils/ui-helpers.js`: Linha 64
*   `os/js/os-knowledge-core.js`: Linhas 97, 98, 99
*   `os/js/os-integration.js`: Linha 65
*   `os/js/onboarding.js`: Linha 290
*   `os/js/modules/cliente-detalhe.js`: Linhas 211, 217, 288, 295, 329, 345, 356, 366
*   `os/js/modules/demandas.js`: Linha 69
*   `os/js/modules/command-center.js`: Linha 35
*   `os/js/modules/clients.js`: Linhas 390, 393, 394
*   `os/js/contracts-finance.js`: Linhas 71, 72, 73, 871
*   `os/js/approval.js`: Linhas 90, 98

### 4.2 Hardcodes Mapeados

O Identificador Legado `FLUXAI_LABS_001` encontra-se fixado (*hardcoded*) nos seguintes arquivos:
*   `os/js/os-core.js`: Linha 335
*   `os/js/onboarding.js`: Linhas 227, 387, 414, 668
*   `os/js/modules/cliente-detalhe.js`: Linhas 17, 105, 129, 133, 379, 637
*   `os/js/approval.js`: Linha 15 (usado como Identity Resolver explícito no fallback: `client_id_raw === '3acae009-6825-4163-9057-cbe99216cc3b' ? 'FLUXAI_LABS_001' : client_id_raw`)

### 4.3 Uso Intenso de `localStorage`

A persistência paralela ao Supabase foi encontrada de forma massiva. Chaves evidenciadas: `fluxai_mock_projects`, `fluxai_mock_contracts`, `fluxai_mock_extras`, `fluxai_mock_assets`, `fluxai_events`, `fluxai_current_project_id`, `fluxai_state_*`.
*   `os/js/utils/ui-helpers.js`: Linhas 19, 30, 34, 53, 60
*   `os/js/os-state.js`: Linhas 67, 69, 90, 97, 102, 111, 127, 131, 159
*   `os/js/os-knowledge-core.js`: Linhas 109, 113, 115, 117, 119, 121, 445, 446, 448
*   `os/js/os-integration.js`: Linhas 21, 50, 51, 53, 57, 74, 128, 129, 132, 186, 189, 227, 229, 312, 313
*   `os/js/os-core.js`: Linhas 138, 141, 213, 218, 219, 432, 537, 562
*   `os/js/onboarding.js`: Linhas 687, 709

### 4.4 Mocks Residuais

Mocks estáticos e retornos simulados presentes no código:
*   `os/js/modules/cliente-detalhe.js`: Linha 379 (Evidência do objeto estático `CLIENT_COCKPIT_MOCKS`).
*   Diversas chaves de fallback do `localStorage` com o prefixo `fluxai_mock_*` conforme auditado no bloco anterior (em `os-knowledge-core.js` e `os-integration.js`).

---

## 5. CLASSIFICAÇÃO FACTUAL DOS MÓDULOS

Para a classificação estrita, considerou-se a presença de `SELECT *`, Mocks ou `localStorage`/Hardcodes nos arquivos `.js` vinculados:

| Módulo/Arquivo JS Associado | Classificação | Justificativa Factual |
| :--- | :--- | :--- |
| **`os-core.js`** | 🔴 Precisa refatoração | Linhas 138 a 562 demonstram alta dependência de `localStorage` e presença do hardcode `FLUXAI_LABS_001` na linha 335. |
| **`cliente-detalhe.js`** | 🔴 Precisa refatoração | Constatação de 8 ocorrências de `SELECT *`, presença massiva do hardcode `FLUXAI_LABS_001` (6 linhas) e objeto estático `CLIENT_COCKPIT_MOCKS`. |
| **`onboarding.js`** | 🔴 Precisa refatoração | Uso de `SELECT *` (linha 290), `localStorage` e 4 instâncias de `FLUXAI_LABS_001` hardcoded. |
| **`os-knowledge-core.js` / `os-integration.js`** | 🔴 Precisa refatoração | Contêm massiva ocorrência de `fluxai_mock_*` no `localStorage` e usos de `SELECT *`. |
| **`approval.js`** | 🟡 Precisa otimização | Presença de 2 instâncias de `SELECT *` (linhas 90, 98) e 1 hardcode (`FLUXAI_LABS_001` na linha 15). |
| **`contracts-finance.js`** | 🟡 Precisa otimização | 4 usos de `SELECT *` constatados (linhas 71, 72, 73, 871). |
| **`clients.js`** | 🟡 Precisa otimização | 3 usos de `SELECT *` constatados (linhas 390, 393, 394). |
| **`demandas.js`** | 🟡 Precisa otimização | 1 uso de `SELECT *` constatado (linha 69). |
| **`command-center.js`** | 🟡 Precisa otimização | 1 uso de `SELECT *` constatado (linha 35). |
