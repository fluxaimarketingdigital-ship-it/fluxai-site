# MAPA TÉCNICO COMPLETO DO FLUXAI OS™

**Versão:** 1.0.0
**Status:** Oficial (Auditoria Pré-Refatoração)
**Data:** 09/07/2026

Este documento serve como mapa arquitetural e inventário estrutural da plataforma FluxAI OS™ antes da execução do Macrobloco 13. Nenhuma alteração foi realizada para a produção deste artefato.

---

## 1. MAPA DE MÓDULOS

### 1.1 Login / Autenticação
*   **Objetivo:** Gerenciar o acesso, validação e sessão de usuários na plataforma.
*   **Arquivos Principais:** `os/login.html`, `os/js/os-core.js`, `assets/js/modules/auth.js` (core legado)
*   **Tabelas Utilizadas:** `auth.users` (Supabase)
*   **Integrações:** Supabase Auth
*   **Status Atual:** 🟢 Estável

### 1.2 Portal do Cliente
*   **Objetivo:** Interface principal do cliente final para visão geral de seu ecossistema.
*   **Arquivos Principais:** `os/client-portal.html`, `os/js/os-core.js`
*   **Tabelas Utilizadas:** `CLIENTES` (via Identity Resolver)
*   **Integrações:** Supabase
*   **Status Atual:** 🟢 Estável

### 1.3 Motor de Aprovação
*   **Objetivo:** Permitir ao cliente revisar, comentar e aprovar conteúdos.
*   **Arquivos Principais:** `os/approval.html`, `os/js/approval.js`
*   **Tabelas Utilizadas:** `PLANEJAMENTO_CONTEUDO`
*   **Integrações:** Supabase, Make
*   **Status Atual:** 🟢 Estável

### 1.4 Motor de Conteúdo
*   **Objetivo:** Engine responsável por interpretar as mídias, copys e status.
*   **Arquivos Principais:** `os/modules/content-engine/content-engine.js`
*   **Tabelas Utilizadas:** `PLANEJAMENTO_CONTEUDO`
*   **Integrações:** Supabase
*   **Status Atual:** 🟢 Estável

### 1.5 Clientes
*   **Objetivo:** Listagem e gerenciamento de perfis de negócio.
*   **Arquivos Principais:** `os/js/modules/clients.js`
*   **Tabelas Utilizadas:** `CLIENTES`
*   **Integrações:** Supabase, Google Sheets (Espelho)
*   **Status Atual:** 🟡 Precisa otimização (Uso de Identity Resolver legado)

### 1.6 Demandas / Tickets
*   **Objetivo:** Acompanhamento de solicitações pontuais de design/suporte.
*   **Arquivos Principais:** `os/js/modules/demandas.js`
*   **Tabelas Utilizadas:** `DEMANDAS`
*   **Integrações:** Supabase
*   **Status Atual:** 🟡 Precisa otimização (SELECT *)

### 1.7 Financeiro & Contratos
*   **Objetivo:** Histórico de faturamento, links de pagamento e contratos ativos.
*   **Arquivos Principais:** `os/js/contracts-finance.js`
*   **Tabelas Utilizadas:** `CONTRATOS`, `FINANCEIRO`
*   **Integrações:** Supabase
*   **Status Atual:** 🟡 Precisa otimização

### 1.8 Workspace / Dashboard Interno
*   **Objetivo:** Centro de comando para a equipe interna gerir os dados gerais.
*   **Arquivos Principais:** `os/dashboard.html` (presumido)
*   **Tabelas Utilizadas:** Múltiplas
*   **Integrações:** Supabase, Make
*   **Status Atual:** 🔴 Precisa refatoração (Risco de uso de Mocks)

### 1.9 Planejamento & Calendário
*   **Objetivo:** Visão cronológica das pautas para aprovação ou publicação.
*   **Arquivos Principais:** `os/calendar.html`
*   **Tabelas Utilizadas:** `PLANEJAMENTO_CONTEUDO`
*   **Integrações:** Supabase
*   **Status Atual:** 🔴 Precisa refatoração

### 1.10 Máquina de Estados (Governança)
*   **Objetivo:** Dicionário oficial de status da plataforma.
*   **Arquivos Principais:** `os/config/status-system.js`
*   **Tabelas Utilizadas:** Agnóstico (Aplica-se às tabelas via update)
*   **Integrações:** Nenhuma
*   **Status Atual:** 🟢 Estável

---

## 2. MAPA DE TABELAS (SUPABASE)

| Nome da Tabela | Chave Primária | Finalidade | Módulos | Leitura | Escrita | RLS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **auth.users** | `id` (UUID) | Controle nativo de credenciais | Login | Sim | Supabase Auth | Ativo nativo |
| **CLIENTES** | `id` / `client_id` | Perfil do tenant | Clientes, Portal | Sim | Limitada | Ativo (Mitigado) |
| **PLANEJAMENTO_CONTEUDO** | `id` | Pauta de publicações de mídia | Aprovação, Motor | Sim | Sim (Update) | Ativo |
| **DEMANDAS** | `id` | Solicitações e Tickets | Demandas | Sim | Sim | Ativo |
| **CONTRATOS** | `id` | Escopos de prestação de serviços | Financeiro | Sim | Não | Ativo |
| **FINANCEIRO** | `id` | Faturas e movimentações | Financeiro | Sim | Não | Ativo |

---

## 3. MAPA DE INTEGRAÇÕES

*   **Supabase:**
    *   **Finalidade:** Única fonte da verdade (DB), Auth e permissões (RLS).
    *   **Módulos:** Todos.
    *   **Dependências:** Rede pública, API Key.
*   **Make:**
    *   **Finalidade:** Executor assíncrono para side-effects (notificações, geração de PDFs, etc).
    *   **Módulos:** Aprovação, Demandas.
    *   **Dependências:** Webhooks ativos, Supabase.
*   **Google Sheets:**
    *   **Finalidade:** Espelho operacional downstream para a equipe interna de operação legada.
    *   **Módulos:** Indiretos (via Make).
    *   **Dependências:** Integração Make.

---

## 4. MAPA DE ROTAS (PÁGINAS HTML)

*   **`os/login.html`:** Login (Responsável: `auth.js`) - *Dependência:* API Supabase.
*   **`os/client-portal.html`:** Portal (Responsável: `os-core.js`) - *Dependência:* Sessão UUID válida.
*   **`os/approval.html`:** Aprovação (Responsável: `approval.js`) - *Dependência:* `content-engine.js`.
*   **`os/dashboard.html`:** Workspace Interno - *Dependência:* Acesso restrito.

---

## 5. MAPA DE DEPENDÊNCIAS ARQUITETURAIS

```text
[Portal do Cliente / HTML]
       │
       ▼
[Motores JS (Aprovação, Conteúdo, Core)]
       │
       ▼  (Identity Resolver & RLS Filters)
       │
[Supabase (Fonte da Verdade)]
       │
       ▼  (Database Webhooks / Polling)
       │
[Make (Executor de Automações)]
       │
       ▼  (Side Effects / Escrita Externa)
       │
[Google Sheets (Espelho Operacional)]
```

---

## 6. DÍVIDA TÉCNICA MAPEADA (AUDITORIA ESTRITA)

Durante a auditoria, foram identificados os seguintes débitos que não foram alterados neste commit:

*   **Mocks:** Arquivos `.json` legados ou variáveis em JS preenchidas com dados "fake" ainda persistem em módulos não-migrados (ex: Dashboard Interno, Calendário).
*   **`localStorage`:** Uso paralelo de chaves locais para ditar a renderização da interface quando o correto seria observar o stream de `auth.users`.
*   **`SELECT *`:** Consultas via `supabase-js` nos módulos `demandas.js`, `clients.js` puxando tabelas inteiras, causando over-fetching de dados.
*   **Código Duplicado:** Inicializações repetidas do cliente do Supabase e lógica de cache espalhada entre os módulos menores.
*   **Hardcodes:** Presença textual contínua de `FLUXAI_LABS_001` nos componentes forçando o Identity Resolver a trabalhar constantemente.
*   **Funções Obsoletas:** Métodos antigos que chamavam o n8n ou planilhas diretamente do front-end que foram ignorados mas ainda não deletados.

---

## 7. CLASSIFICAÇÃO GERAL DOS MÓDULOS

| Módulo | Classificação |
| :--- | :--- |
| **Login** | 🟢 Estável |
| **Portal do Cliente** | 🟢 Estável |
| **Motor de Aprovação** | 🟢 Estável |
| **Motor de Conteúdo** | 🟢 Estável |
| **Máquina de Estados** | 🟢 Estável |
| **Clientes** | 🟡 Precisa otimização |
| **Demandas** | 🟡 Precisa otimização |
| **Financeiro** | 🟡 Precisa otimização |
| **Workspace / Dashboard Interno** | 🔴 Precisa refatoração |
| **Calendário / Planejamento** | 🔴 Precisa refatoração |
| **Governança / Logs** | 🔴 Precisa refatoração |
