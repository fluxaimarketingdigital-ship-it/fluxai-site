# CHECKPOINT FINAL: FASE 2A.1 (VIRADA ONBOARDING RASCUNHO SEGURO)

**Data:** 12 de Junho de 2026
**Status:** Concluído
**Tipo:** Virada Controlada com Canary Release

## 1. Arquivos Alterados e Protegidos
*   **`api/make-proxy.js`**: Adicionada a `ROTA_OS_09_ONBOARDING` na allowlist rígida.
*   **`os/services/makeClient.js`**: Implementado `charset=utf-8` no `Content-Type` do Fetch para garantir a chegada íntegra da acentuação estratégica ao backend.
*   **`.env` local**: Rotacionada a secret `MAKE_WEBHOOK_ROTA_OS_09_ONBOARDING` de forma segura.

## 2. Caminho Real da ROTA 09
Validado e isolado:
`os/onboarding.html` -> `os/js/onboarding.js` -> `MakeClient.sendPost` -> `api/make-proxy.js` -> Webhook Definitivo Make.co.
O `webhook-dispatcher.js` da Edge Function moderna **não** é utilizado neste fluxo.

## 3. Testes Executados e Resultados
*   **Canary Técnico / Mock Interface:** 
    *   Cliente: `CANARY_ONBOARDING_FASE2A1_2026_06_001`
    *   Script: `scratch/canary_onboarding.mjs`
    *   **Resultado:** HTTP 200 OK. Criação perfeita na planilha com status `em_onboarding`, contrato em `rascunho`, e serviços `inativos`. Os acentos de "Clínica estética premium" foram processados com integridade.
*   **Teste de Duplicidade:** 
    *   O Make.co recebeu o mesmo payload no segundo disparo. O HTTP retornou 200 OK (comportamento padrão do gateway customWebhook), mas o Make bloqueou internamente (caiu na rota 409) evitando criação de linhas duplicadas.

## 4. Segurança e Varredura
*   **Varredura do Hook:** Varredura global via grep/PS confirmou vazamento ZERO no source-code. A string `hook.us2.make.com` encontra-se apenas em planilhas markdown (`docs/`) ou scripts não rodados em prod (`scratch/`). 
*   **Risco Supabase/Auth/IA:** Não houve nenhum trigger a estes ecossistemas (conforme previsto pelo blueprint Fase 2A).

## 5. Limpeza de Base
**Pendência:** O Administrador deve executar a limpeza (exclusão das linhas nas 6 abas do Google Sheets) para o cliente `CANARY_ONBOARDING_FASE2A1_2026_06_001` (provavelmente via AuditoriaFluxAISheets.gs).

## 6. Parecer Final
A Fase 2A.1 está **liberada para operação assistida**. A Rota 09 foi migrada e protegida contra perda de caracteres UTF-8 e contra exposição de credencial na Vercel.
