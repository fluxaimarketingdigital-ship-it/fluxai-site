# INVENTÁRIO DE ROTAS (PROXY TRANSACIONAL)

## Endpoints Ativos (Allowlist Rígida Vercel)
O sistema atual centralizou as chamadas na Serverless Function da Vercel localizada em `api/make-proxy.js`. As rotas permitidas para encaminhamento são:

1. **`ROTA_OS_01_PORTAL_DEMANDAS`**
   - **Método HTTP:** POST
   - **Origem:** Frontend (os/services/makeClient.js)
   - **Destino:** Webhook Make.com (via `process.env.MAKE_WEBHOOK_ROTA_OS_01_PORTAL_DEMANDAS`)
   - **Finalidade:** Criação e registro de novas demandas de clientes.

2. **`ROTA_OS_02_LEADS_SITE`**
   - **Método HTTP:** POST
   - **Origem:** Frontend (Formulário Landing Pages)
   - **Destino:** Webhook Make.com
   - **Finalidade:** Captação de novos leads.

3. **`ROTA_OS_09_ONBOARDING`**
   - **Método HTTP:** POST
   - **Origem:** Frontend (Portal Admin/Onboarding)
   - **Destino:** Webhook Make.com
   - **Finalidade:** Fluxo seguro de ativação de clientes, criação de PDF e registros.

4. **`ROTA_OS_14_ARQUIVOS`**
   - **Método HTTP:** POST
   - **Origem:** Frontend
   - **Destino:** Webhook Make.com
   - **Finalidade:** Sincronização de arquivos e assets.

## Rotas Mapeadas mas Desativadas/Inativas no Proxy
As rotas 10, 11, 13, 15, 16 estão configuradas no frontend (`makeRoutes.js`), mas o tráfego não passará pelo proxy atual, pois não constam na allowlist da Serverless Function.

## Resumo Arquitetural
- O frontend faz chamada unificada para `/api/make-proxy`.
- O backend atua apenas como "Forwarder" HTTP para o Make.
