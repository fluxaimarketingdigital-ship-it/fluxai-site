# LAUDO_OWASP_TRILHA1_TRILHA2_BLOCO1

Data: 27/05/2026
Responsável: FluxAI OS™ Security — Auditoria Automatizada
Fases cobertas: 03.2, 03.5 (Trilha 1) e Bloco 1 (Trilha 2)

---

## TRILHA 1 — Hardening Externo

### Fase 03.2 — Security Headers (vercel.json)

Todos os headers de segurança foram inseridos na configuração `"source": "/(.*)"` do `vercel.json`, aplicando-se a todas as rotas do projeto:

| Header | Valor aplicado |
| :--- | :--- |
| `X-Frame-Options` | `DENY` (bloqueia Clickjacking) |
| `X-Content-Type-Options` | `nosniff` (bloqueia MIME sniffing) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Câmera, microfone, geolocalização e pagamento desativados |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (HSTS 2 anos) |
| `X-XSS-Protection` | `1; mode=block` |
| `Content-Security-Policy` | Política conservadora com whitelist de CDNs usados (jsDelivr, Google Fonts, Cloudflare, Facebook SDK, Google Analytics, Elfsight) |

> [!IMPORTANT]
> O header `Content-Security-Policy` foi configurado com `'unsafe-inline'` apenas para `script-src` e `style-src`, pois o projeto usa scripts inline em suas páginas HTML. Para versões futuras, recomenda-se adotar `nonce-based CSP` para eliminar `unsafe-inline`.

### Fase 03.5 — Sanitização de Parâmetros GET (Anti-XSS)

**Novo arquivo criado:** `os/services/sanitizer.js`
- Exporta `sanitizeText(value)`: escapa HTML de qualquer string
- Exporta `getUrlParam(key, fallback, options)`: lê parâmetros de URL com validação de comprimento máximo, padrão regex e rejeição de protocolos perigosos (`javascript:`, `data:`, `vbscript:`)
- Exporta `getUrlParams(keys)`: helper para leitura em lote

**Arquivo modificado:** `os/services/capture.js`
- `utm_source` e `utm_campaign` passam por `getUrlParam()` com `allowPattern: /^[a-zA-Z0-9_\\-\\s]{0,100}$/`

**Arquivo modificado:** `src/scripts/script.js`
- Adicionada função inline `safeUtmParam()` com mesma lógica (inline pois este arquivo não tem acesso ao ESM do OS)
- `utmSource`, `utmMedium` e `utmCampaign` passam pela função antes de entrar no payload

---

## TRILHA 2 — Auditoria Interna (Bloco 1 Crítico)

### os/js/os-core.js — RBAC e Auth Session

**Melhorias aplicadas:**

1. **CLIENT Allowlist Ampliada (`_applyRBAC`):**
   - Adicionados `approval` e `contract-view` à lista de rotas permitidas para CLIENT.
   - Uso de `window.location.replace()` em vez de `href` para impedir que a página protegida apareça no histórico do navegador.

2. **Auth State Guard (onAuthStateChange):**
   - Registrado listener `supabase.auth.onAuthStateChange` no load do módulo.
   - Ao detectar `SIGNED_OUT` ou refresh sem sessão: limpa `window.FLUXAI_RUNTIME_CONTEXT` e `localStorage` e redireciona para login — prevenindo que sessões expiradas em outras abas continuem ativas.

### os/login.html — Auditoria

- ✅ Usa `OS_AUTH.normalizeRole()` — sem injeção de role arbitrária
- ✅ Rota pós-login determinada por `safeRole` (CLIENT → portal, outros → command-center)
- ✅ `safeProjectId` passa por `encodeURIComponent` antes de entrar na URL
- ✅ Nenhuma injeção de dados externos no DOM durante o login
- ✅ Sem open redirect vulnerabilities
- **Status: APROVADO — nenhuma alteração necessária**

---

## Varredura Final

| Termo | Resultado |
| :--- | :--- |
| `hook.us` | **0** |
| `innerHTML` com dados de URL | **0** (URLSearchParams não cai mais em innerHTML) |
| `URLSearchParams.get` sem validação | **0** nos arquivos críticos (capture.js, script.js) |
| Rota protegida acessível por CLIENT | **0** (allowlist ampliada + location.replace) |

---

## Status Geral

- [x] **Fase 03.2** — Security Headers: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy
- [x] **Fase 03.5** — Sanitização Anti-XSS de URLSearchParams
- [x] **Trilha 2 Bloco 1** — RBAC hardening, onAuthStateChange guard, login.html auditado
- [ ] **Fase 03.3** — Nova rodada OWASP ZAP após deploy dos headers *(aguarda deploy em produção)*
- [ ] **Fase 03.4** — SRI para CDN scripts *(próxima tarefa)*
- [ ] **Trilha 2 Bloco 2** — Botões, eventos, governance-users, módulos *(próxima fase)*
