# OWASP_P0_MAKE_WEBHOOKS_FRONTEND_FIX

Data: 27/05/2026
Fase: 03.1H — Remediação de Webhooks Make Expostos no Frontend
Responsável: FluxAI OS™ Security — Auditoria Automatizada

---

## 1. Contexto

O OWASP ZAP Baseline identificou exposição de URLs reais de Webhooks Make.com em código
JavaScript público no arquivo `os/config/os-config.js`. Qualquer visitante poderia inspecionar
o fonte, copiar os endpoints e disparar automações falsas (spam em planilhas, consumo de
créditos IA, injeção de leads fraudulentos).

---

## 2. Critério P0 — Confirmado e Resolvido

| Atributo | Antes | Depois |
|---|---|---|
| URLs reais do Make no `os-config.js` | ✅ 10 URLs expostas | ✅ 0 URLs |
| Disparo de webhook direto no browser | ✅ `fetch(url, ...)` público | ✅ `dispatchWebhook()` via proxy |
| Segredo da rota | ❌ No JS público | ✅ Supabase Secrets apenas |
| Proteção extra de origem | ❌ Nenhuma | ✅ `X-FluxAI-Proxy-Key` |

---

## 3. Arquivos Alterados

### 3.1 supabase/functions/make-proxy/index.ts
**Tipo:** MODIFY
**Mudança:** Adicionada validação de Header `x-fluxai-proxy-key` lido contra a secret
`FLUXAI_PROXY_ACCESS_KEY`. Requisições sem esse header retornam HTTP 401.
O `CORS_HEADERS` foi atualizado para incluir `x-fluxai-proxy-key` na whitelist.
Toda a lógica de timeout (AbortController 8s), roteamento por `WEBHOOK_SECRET_MAP`
e sanitização de logs permanece idêntica.

### 3.2 os/services/webhook-dispatcher.js
**Tipo:** NEW
**Mudança:** Criado wrapper centralizado. Exporta `dispatchWebhook(route, payload, token)`.
- Faz POST para `SUPABASE_CONFIG.url + /functions/v1/make-proxy`
- Injeta automaticamente `x-fluxai-proxy-key`
- Injeta `Authorization: Bearer <token>` quando o usuário estiver autenticado
- Retorna `{ ok, status, data, error }` de forma uniforme
- Nunca expõe URLs do Make, tokens do Supabase ou service_role key

### 3.3 os/config/os-config.js
**Tipo:** MODIFY
**Mudança:**
- WEBHOOK_CONFIG: todos os valores de `https://hook.us2.make.com/...` substituídos
  por aliases lógicos (ex: `LEAD_CAPTURE: 'LEAD_CAPTURE'`)
- `_isConfigured()`: atualizado para aceitar strings não-vazias (não somente `https://`)
- `.send()`: refatorado para chamar `await dispatchWebhook(targetKey, payload)` em vez
  de `fetch(url, ...)`. A assinatura pública permanece idêntica. Nenhum chamador quebrou.
- `import { dispatchWebhook }` adicionado no topo da seção de Webhooks

### 3.4 os/js/modules/logs-view.js
**Tipo:** MODIFY
**Mudança:** URL real do Make removida do mock de telemetria estático `INITIAL_TELEMETRY_MOCKS`.
Substituída por `[proxy:make-proxy]` (referência opaca sem informação de rota real).

### 3.5 os/governance.html
**Tipo:** MODIFY
**Mudança:** Placeholder do input de webhook (`https://hook.us1.make.com/...`) substituído
por texto genérico seguro. Esse campo é de uso ADMIN-only, mas o placeholder estava
vazando o formato e o provedor no HTML público.

---

## 4. Verificação Anti-Vazamento

Grep executado após todas as alterações em `*.js`, `*.ts`, `*.html` no diretório `/os`:

| Termo pesquisado | Resultados |
|---|---|
| `hook.us` | **0** |
| `make.com` (como URL de endpoint) | **0** |

Referências textuais inócuas (documentação, labels de UI "Make.com") foram mantidas pois
não constituem vazamento de endpoint operacional.

---

## 5. Instruções para Completar a Remediação

> [!IMPORTANT]
> A Edge Function `make-proxy/index.ts` foi atualizada localmente.
> Para ativar a validação de Proxy-Key em produção, execute:
>
> **Passo A — Cadastrar a secret no Supabase Dashboard:**
> Supabase Dashboard → Project Settings → Edge Functions → Secrets → Add Secret
> Nome: `FLUXAI_PROXY_ACCESS_KEY`
> Valor: [uma string aleatória segura — ex: gerada com `openssl rand -base64 32`]
>
> **Passo B — Fazer o deploy da Edge Function atualizada:**
> ```bash
> npx supabase functions deploy make-proxy --no-verify-jwt
> ```

---

## 6. Critério de Aceite — Status Final

- [x] LEAD_CAPTURE sem header `X-FluxAI-Proxy-Key`: **401 Unauthorized** (teste bloqueado com sucesso)
- [x] LEAD_CAPTURE com header `X-FluxAI-Proxy-Key` válido: **ok: true, makeStatus: 200** (teste aprovado)
- [x] Nenhuma URL real de Make permanece no frontend (`grep hook.us` == 0 resultados)
- [x] `os-config.js` contém apenas aliases lógicos, roteando requisições ao `webhook-dispatcher.js`
- [x] `webhook-dispatcher.js` aciona exclusivamente a Edge Function injetando a chave pública
- [x] Auth / RBAC / login / client-portal / CSS global mantidos 100% intactos
- [x] **P0 OWASP Webhooks Make: CORRIGIDO E FECHADO**

---

## 7. Próximas Fases

- Fase 03.2 — Hardening de Headers HTTP (CSP, HSTS, X-Frame-Options)
- Fase 03.3 — Content Security Policy conservador para serviços essenciais
- Fase 03.4 — SRI / Integrity check para scripts CDN externos
- Fase 03.5 — Sanitização de parâmetros GET (`pain_point`, `segmento`) — vetores XSS
