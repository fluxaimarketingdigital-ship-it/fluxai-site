# CHECKPOINT: PRÉ-VIRADA DA FASE 2A.1 (ONBOARDING SEGURO)

**Data:** 12 de Junho de 2026
**Status:** Início da Execução do Pacote Isolado 2A.1

## Caminho Real Identificado da ROTA 09:
1. O formulário em `os/onboarding.html` é processado por `os/js/onboarding.js`.
2. A função JavaScript invoca `MakeClient.sendPost(ROTAS_OS_MAKE['ROTA_OS_09_ONBOARDING'], payload)`.
3. `makeClient.js` envia um POST internamente para `/api/make-proxy` (Vercel API Route).
4. O arquivo `api/make-proxy.js` intercepta o request, valida contra sua Allowlist interna e dispara para o Webhook final apontado em variável de ambiente.

**Conclusão da Malha:** A Rota 09 utiliza a **Malha Legada (Vercel)** e não utiliza a Edge Function moderna (`webhook-dispatcher.js`). Portanto, a intervenção ocorrerá apenas em `makeClient.js` (para UTF-8) e `api/make-proxy.js` (para Allowlist).

## Arquivos e Variáveis Afetados:
- **`os/services/makeClient.js`**: Adição de `charset=utf-8` nos Headers. Nenhuma lógica alterada.
- **`api/make-proxy.js`**: Adição de `'ROTA_OS_09_ONBOARDING': process.env.MAKE_WEBHOOK_ROTA_OS_09_ONBOARDING` na Allowlist para não barrar a requisição (HTTP 403). Nenhuma lógica alterada.
- **`.env` local**: Adição da secret do webhook `MAKE_WEBHOOK_ROTA_OS_09_ONBOARDING`. (Valor não versionado).
- **Sem exposição**: O webhook real não será inserido em nenhum arquivo `*.js` e nenhum arquivo `*.html`. O código fonte passará limpo pela auditoria estática final.
