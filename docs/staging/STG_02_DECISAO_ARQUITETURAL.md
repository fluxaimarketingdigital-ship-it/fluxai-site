# STG-02: DECISÃO ARQUITETURAL OBRIGATÓRIA

## 5.1 Supabase
* **Opções Analisadas:** A) Projeto Independente. B) Schema Separado. C) Mesmas tabelas.
* **Evidências:** 18 policies abertas (`USING (true)`). Manipulação da tabela central `governance_users` e `auth.users` não pode ser testada em tabelas/schemas compartilhados sem contaminar chaves Auth em cache ou expor dados de clientes em queries imperfeitas.
* **Decisão Recomendada:** **Opção A — Projeto Supabase Independente**.
* **Condição:** Deploy via Migrations a partir de repositório limpo.

## 5.2 Vercel
* **Opções Analisadas:** Projeto Independente vs. Ambiente Preview (Branch).
* **Evidências:** Vercel suporta *Preview Environments* com total isolamento de Environment Variables (`.env.preview`).
* **Decisão Recomendada:** **Mesmo projeto com ambiente Preview e Branch dedicada (`staging`)**.
* **Condição:** Variáveis de staging NÃO podem ser acessíveis na branch `main`.

## 5.3 Make
* **Estrutura Recomendada:** Pasta dedicada `[STAGING] FluxAI OS`. Clonagem limpa (sem dados residuais) dos 24 cenários.
* **Conexões/Webhooks:** Conexões independentes para Sheets STG e Drive STG. Geração de URLs de webhook exclusivas para STG.
* **Condição:** **Schedules OFF** absolutos. Nunca clonar o 10 oficial sem renomeá-lo explicitamente com prefixo `STG_`.

## 5.4 Google Sheets e 5.5 Google Drive
* **Decisão:** **Nova Planilha Raiz de Staging e Nova Pasta Raiz de Staging**.
* **Condição:** Proibição de uso de IDs fixos de PROD. Scripts de Apps Script reescritos para ler apenas a aba local. Permissão restrita à equipe de engenharia/teste.

## 5.6 Proxy
* **Decisão:** Apenas um proxy atua como autoridade: **Vercel Edge Function (`api/make-proxy.js`)**.
* **Condição:** O proxy da branch staging lerá variáveis do Preview contendo os webhooks de STG do Make. Integração com validação nativa de JWT.

## 5.7 Frontend
* **Decisão:** Branch `staging` consumindo `SUPABASE_URL` do Projeto A (Staging) e apontando fetch calls sempre para `/api/make-proxy`.
* **Condição:** Implementação de ESLint Block para `hook.us2.make.com` no código fonte, eliminando chamadas diretas. Logotipo do OS contendo badge "STG" na Navbar.

## 5.8 Logs e Observabilidade
* **Decisão:** Tabela `audit_logs` no Supabase Staging para receber persistência transacional inicial (`environment=staging`, `correlation_id` via UUIDv4 do Edge Proxy).
