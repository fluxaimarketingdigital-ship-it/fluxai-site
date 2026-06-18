# STG-A: INFRAESTRUTURA ATUAL

## 4.1 Estrutura do Projeto Relevante

```text
/
|-- api/
|   |-- make-proxy.js
|-- os/
|   |-- services/
|   |   |-- makeClient.js
|   |   |-- makeRoutes.js
|   |   |-- os-config.js
|   |-- supabase_schema.sql
|-- supabase/
|   |-- migrations/
|   |   |-- 20260607_rls_homologacao.sql
|-- docs/
|   |-- staging/ (Este diretório)
|   |-- CHECKPOINT_MATRIZ_MESTRA_CENARIOS_MAKE.md
|-- vercel.json
|-- package.json (assumido se houver build process)
```

## 4.2 Configuração de Deployment

* **vercel.json**: Presente na raiz. Define redirects agressivos de páginas antigas (ex: `/ig` -> `/?utm_...`).
* **Headers de Segurança:** CSP rígido aplicado. `connect-src` libera chamadas para `https://mufgwetfhfhhmhowbhjj.supabase.co`, `wss://mufgwetfhfhhmhowbhjj.supabase.co`, `graph.facebook.com`, etc.
* **Endpoints de API:** Vercel usa Edge/Serverless functions. O arquivo `api/make-proxy.js` atende a `/api/make-proxy`.
* **Domínios Mencionados:** `www.fluxaidigital.com.br`, `fluxaidigital.com.br`.
* **Supabase Project URL:** `https://mufgwetfhfhhmhowbhjj.supabase.co`.
* **Referências ao Make:** O proxy atual encaminha requisições baseando-se em chaves de Allowlist (ex: `ROTA_OS_01_PORTAL_DEMANDAS`).

## 4.3 Inventário de Variáveis (Ambiente Vercel / Client)

* `MAKE_WEBHOOK_ROTA_OS_01_PORTAL_DEMANDAS` (Proxy Vercel - Privada)
* `MAKE_WEBHOOK_ROTA_OS_02_LEADS_SITE` (Proxy Vercel - Privada)
* `MAKE_WEBHOOK_ROTA_OS_09_ONBOARDING` (Proxy Vercel - Privada)
* `MAKE_WEBHOOK_ROTA_OS_14_ARQUIVOS` (Proxy Vercel - Privada)
* `SUPABASE_URL` (Client OS - Pública)
* `SUPABASE_ANON_KEY` (Client OS - Pública)

*Risco de Exposição:* O proxy na Vercel injeta as URLs via `.env`, mantendo-as privadas do client side. Contudo, variáveis estáticas ou hardcoded no `makeClient.js` expõem o risco de chamadas diretas (bypass). Se o ambiente for copiado para staging sem substituição, o frontend de STG chamará os webhooks de PROD.
