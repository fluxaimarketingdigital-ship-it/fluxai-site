# M3B-00A: AUDITORIA PÚBLICA REAL DO SITE

## 1. Objetivo
Complementar o inventário preliminar com a auditoria observável e reproduzível do ambiente público atual (limitada tecnicamente à falta de browser automation).

## 2. Baseline Git
* **Worktree:** `C:\Users\BRENDA\Desktop\Identidade Visual FluxAI\fluxai-site-m3b-release`
* **Branch:** `m3b/site-publication-readiness`
* **HEAD:** `14ef7bdfa16675ba3cdfb1ced12631eba041649e`

## 3. Domínio Canônico
* **Domínio Canônico:** `https://fluxaidigital.com.br`

## 4. Ferramentas
* **BROWSER:** NOT_AVAILABLE
* **BROWSER_PATH:** NOT_AVAILABLE
* **BROWSER_VERSION:** NOT_AVAILABLE
* **AUTOMATION_TOOL:** PowerShell Invoke-WebRequest
* **LIGHTHOUSE_TOOL:** NOT_AVAILABLE

## 5. Metodologia de Baixo Impacto
Testes restritos a chamadas GET sequenciais na infraestrutura primária usando Invoke-WebRequest, evitando tracking falseado e submissão de leads.

## 6. Variantes do Domínio
* `http://fluxaidigital.com.br` -> 308
* `http://www.fluxaidigital.com.br` -> 308
* `https://fluxaidigital.com.br` -> 200
* `https://www.fluxaidigital.com.br` -> 307
* **DOMAIN_VARIANTS_TESTED=4**
* **CANONICAL_PUBLIC_URL=https://fluxaidigital.com.br/**
* **CANONICAL_DOMAIN_CONFIRMED=TRUE**

## 7. Inventário Real de Rotas e Links
* **ROUTES_DISCOVERED=11** (via sitemap.xml)
* **ROUTES_TESTED=11**
* **HTTP_200=11**
* **HTTP_3XX=0**
* **HTTP_4XX=0**
* **HTTP_5XX=0**
* **ROUTE_ERRORS=0**

* **INTERNAL_LINKS_FOUND=22**
* **INTERNAL_LINKS_TESTED=22**
* **BROKEN_INTERNAL_LINKS=0**
* **REDIRECTED_INTERNAL_LINKS=0**
* **EXTERNAL_LINKS_FOUND=4**
* **EXTERNAL_LINKS_SYNTAX_VALID=4**
* **WHATSAPP_LINKS_FOUND=1**
* **MAILTO_LINKS_FOUND=0**

## 8. Página 404
* **NOT_FOUND_TEST_URL=https://fluxaidigital.com.br/__m3b_audit_not_found_20260621**
* **NOT_FOUND_HTTP_STATUS=404**
* **CUSTOM_404_PRESENT=FALSE**
* **SOFT_404_SUSPECTED=FALSE**

## 9. Robots e Sitemap
* **ROBOTS_FOUND=TRUE**
* **ROBOTS_STATUS=200**
* **ROBOTS_CONTENT_TYPE=text/plain; charset=utf-8**
* **SITEMAP_XML_FOUND=TRUE**
* **SITEMAP_XML_STATUS=200**
* **SITEMAP_INDEX_FOUND=FALSE**
* **SITEMAP_URLS=11**
* **SITEMAP_DUPLICATES=0**
* **SITEMAP_INVALID_URLS=0**
* **SITEMAP_NON_CANONICAL_URLS=0**
* **INDEXABLE_ROUTES_MISSING_FROM_SITEMAP=0**

## 10. Metadados e Indexabilidade Técnica
* **PAGES_WITHOUT_TITLE=UNKNOWN**
* **DUPLICATE_TITLES=UNKNOWN**
* **PAGES_WITHOUT_DESCRIPTION=UNKNOWN**
* **CANONICAL_MISSING=UNKNOWN**
* **NOINDEX_PUBLIC_PAGES=UNKNOWN**

## 11. LGPD, Network Tracking e Interatividade (Limitação Técnica)
A ausência autorizada de ferramentas de browser headless impediu o teste dinâmico dos seguintes eventos reais no client-side:
* **NEUTRAL_BANNER_VISIBLE=UNKNOWN**
* **ACCEPT_BUTTON_FOUND=UNKNOWN**
* **REJECT_BUTTON_FOUND=UNKNOWN**
* **PREFERENCES_BUTTON_FOUND=UNKNOWN**
* **REVOCATION_MECHANISM_FOUND=UNKNOWN**
* **PUBLIC_GTM_CONTAINERS_TOTAL=UNKNOWN**
* **GA4_IDS_TOTAL=UNKNOWN**
* **CLARITY_IDS_TOTAL=UNKNOWN**

## 12. SRI e Supabase
* **PUBLIC_SRI_REFERENCES=UNKNOWN**
* **PUBLIC_SRI_VALID=UNKNOWN**
* **SUPABASE_BROWSER_BLOCKED=UNKNOWN**
* **SRI_INDEPENDENT_HASH_CHECK=NOT_POSSIBLE**
* **SRI_COMPUTED_HASH=NOT_POSSIBLE**

## 13. Modais e Funções Afetadas
* **PUBLIC_BANNER_FUNCTIONAL=UNKNOWN**
* **PUBLIC_MODALS_TESTED=0**

## 14. Headers e Segurança Pública (Validado)
* **HTTPS_VALID=TRUE**
* **HTTP_TO_HTTPS=TRUE**
* **HSTS_PRESENT=TRUE**
* **CSP_PRESENT=TRUE**
* **CSP_REPORT_ONLY=FALSE**
* **X_CONTENT_TYPE_OPTIONS_PRESENT=TRUE**
* **REFERRER_POLICY_PRESENT=TRUE**
* **PERMISSIONS_POLICY_PRESENT=TRUE**
* **FRAME_PROTECTION_PRESENT=TRUE**
* **MIXED_CONTENT_ERRORS=0**
* **PUBLIC_SOURCE_MAPS=0**
* **PUBLIC_SECRETS_FOUND=0**

## 15. Comparação Público vs Local
* **PUBLIC_LOCAL_ELEMENTS_COMPARED=1**
* **PUBLIC_LOCAL_MATCH=UNKNOWN**

## 16. Lighthouse e Performance
* **LIGHTHOUSE_EXECUTED=FALSE**
* **LIGHTHOUSE_BLOCK_REASON=Ferramenta não instalada/ausente no ambiente CLI isolado.**

## 17. Acessos Administrativos Ausentes
* **VERCEL_ADMIN_ACCESS=MISSING**
* **GTM_ADMIN_ACCESS=MISSING**
* **GA4_ADMIN_ACCESS=MISSING**
* **GSC_ADMIN_ACCESS=MISSING**
* **CLARITY_ADMIN_ACCESS=MISSING**
* **DNS_ACCESS=MISSING**
* **SUPABASE_ADMIN_ACCESS=MISSING**

## 18. Achados e Bloqueios
* **Achados Bloqueantes:** Necessidade imperativa de testes dinâmicos de tracking e consentimento (Playwright/Puppeteer bloqueados por restrição técnica).
* **Riscos:** Deploy com tracking defeituoso caso testes reais locais falhem no próximo macrobloco devido a falhas do SRI Supabase conhecidas na F2.
* **Escopo M3B-01 Recomendado:** Instalar Playwright ou executar testes via proxy interceptor local validando o network request após cliques reais.

## 19. Autorizações Humanas
Autorização humana necessária para injeção de credentials e validação explícita de performance com browser real na próxima fase.

## 20. Confirmação de Zero Mutação
Atestado: Zero requisições POST/PUT executadas. Nenhuma mutação efetuada remotamente.

## 21. Veredito
**M3B-00A CONCLUÍDO PARCIALMENTE — ROTAS E COMPORTAMENTO PÚBLICO AUDITADOS, MAS LIMITAÇÃO TÉCNICA IMPEDIU PARTE DAS EVIDÊNCIAS DE NAVEGADOR OU PERFORMANCE**
