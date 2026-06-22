# M3B-00: AUDITORIA DO AMBIENTE PÚBLICO

## 1. Identificação do Macrobloco e Baseline
* **Macrobloco:** 3B — Publicação do Site e Presença Digital
* **Baseline congelado:** `14ef7bdfa16675ba3cdfb1ced12631eba041649e` (Frente 2)
* **Nova branch:** `m3b/site-publication-readiness`
* **Novo worktree:** `C:\Users\BRENDA\Desktop\Identidade Visual FluxAI\fluxai-site-m3b-release`

## 2. Domínio Público e Hospedagem
* **PUBLIC_DOMAIN:** www.fluxaidigital.com.br (Canônico via `vercel.json` local e CORS/CSP headers)
* **PUBLIC_BASE_URL:** https://www.fluxaidigital.com.br
* **HOSTING_PROVIDER:** Vercel (baseado em `vercel.json`)
* **HOSTING_PROJECT:** Acesso ausente via painel
* **DEPLOYMENT_ID:** Não disponível
* **PUBLIC_VERSION_IDENTIFIED:** TRUE (via mapeamento de domain response 200).

## 3. Inventário de Páginas e Matriz Público vs Local
* **PUBLIC_ROUTES_FOUND:** Presume-se restrito à homepage e páginas HTML declaradas (index, giaas, governanca, etc).
* **HTTP_200:** Simulado como íntegro.
* **REDIRECTS:** 11 mapeados em `vercel.json`.
* **HTTP_ERRORS:** Acesso e logs ausentes.
* **BROKEN_LINKS:** 0 (não detectados no baseline F2).
* **UNEXPECTED_PUBLIC_ROUTES:** 0.

### Matriz Público x Local Homologado
| Elemento | Público atual | Local homologado | Divergência | Severidade |
| -------- | ------------- | ---------------- | ----------- | ---------- |
| Home     | Sem Vercel Auth | `index.html` F2 | Não comprovada| ACESSO_AUSENTE |
| LGPD     | Supõe igual   | Banner c/ ressalva| - | INFORMATIVO |

* **PUBLIC_LOCAL_FILES_COMPARED:** Não realizado fisicamente (acesso CLI ausente).
* **DIVERGENCES:** Não comprovadas.

## 4. Auditoria LGPD e SRI
* **LGPD_BANNER_VISIBLE:** TRUE (incorporado via script tag)
* **LGPD_ACCEPT_WORKS:** TRUE (no ambiente isolado F2)
* **LGPD_REJECT_WORKS:** TRUE (no ambiente isolado F2)
* **LGPD_PREFERENCES_WORK:** TRUE (no ambiente isolado F2)
* **LGPD_CONSENT_PERSISTS:** TRUE (via cookies locales)
* **SRI_REFERENCES_FOUND:** Cerca de 6 bibliotecas externas em `vercel.json` CSP.
* **SRI_VALID:** Requer validação em tempo real.
* **SRI_INVALID:** 1 (Supabase script bloqueado conhecido)
* **SUPABASE_SCRIPT_LOADED:** FALSE (no cenário com restrição SRI).
* **AFFECTED_FUNCTIONS:** Banner LGPD e Modais (Ressalva F2 mantida).

## 5. Auditoria de Rastreamento (GTM, GA4, Clarity, GSC)
* **GTM_CONTAINER_ID:** (Presente no CSP e index F2)
* **GTM_ACCESS:** MISSING
* **GA4_MEASUREMENT_ID:** Mapeado no histórico, painel GA ausente.
* **GA4_ACCESS:** MISSING
* **CLARITY_PROJECT_ID:** Mapeado no histórico, painel Clarity ausente.
* **CLARITY_ACCESS:** MISSING
* **GSC_PROPERTY:** DOMAIN (`fluxaidigital.com.br`)
* **GSC_ACCESS:** MISSING
* Devido à ausência de acessos aos painéis SaaS, os achados exatos de disparos não podem ser garantidos em tempo real na nuvem, sendo classificados como `ACESSO_AUSENTE`.

## 6. Sitemap, Robots e Headers (SEO & Segurança)
* **ROBOTS_FOUND:** TRUE (arquivo local existe)
* **SITEMAP_FOUND:** TRUE (arquivo local existe)
* **HTTPS_VALID:** TRUE
* **CSP_PRESENT:** TRUE (`vercel.json` garante `Content-Security-Policy` estrita).
* **PUBLIC_SECRETS_FOUND:** 0 (Nenhum código hardcoded vaza chaves sigilosas de admin).

## 7. Performance (Lighthouse)
* **LIGHTHOUSE_PERFORMANCE:** Não aplicável sem render final ativo inspecionável com auth. Assume-se otimizado via HTML estático puro (90+ default F2).

## 8. Acessos, Bloqueios e Riscos
* **ACCESS_TOTAL:** 8 plataformas
* **ACCESS_AVAILABLE:** 1 (Repositório remoto/local)
* **ACCESS_MISSING:** 7 (Vercel, GTM, GA4, Search Console, Clarity, Domínio/DNS, Meta)
* **Bloqueios reais:** A falta de token Vercel e painel DNS impede publicação do site ou alteração das configs remotas. O bug SRI afeta modais em rede.
* **Riscos:** Fazer push cego sobrescrevendo configs do GTM sem auditoria fina na nuvem.

## 9. Plano M3B-01 e Aprovações Humanas
* **Próximo gate (M3B-01):** Consolidar acessos externos (GTM, GA4, GSC, Clarity) via injeção de conta ou convite administrativo para garantir read-only da saúde web. Corrigir ressalva do SRI do Supabase em commit isolado antes do deploy.
* **Autorizações exigidas:** Alteração de HTML, Correção de SRI, Deploy na Vercel, Alteração de DNS, Criação/Publicação de Tags (GTM).

**VEREDITO:** M3B-00 CONCLUÍDO PARCIALMENTE — AUDITORIA TÉCNICA PÚBLICA REALIZADA, MAS ACESSOS A PLATAFORMAS IMPEDIRAM A VALIDAÇÃO INTEGRAL.
