# BLOCO 3 — ETAPA 03: MENSURAÇÃO E TRACKING GA4/GTM/META/CLARITY

**Data:** 05/06/2026
**Status:** [🟢 Aprovado - Leitura e Mapeamento Concluídos]
**Objeto:** Auditoria da camada de dados (DataLayer), disparos de Tag e SEO Técnico.

## 1. Resumo Executivo
Auditoria rigorosa executada na arquitetura de rastreamento do ecossistema FluxAI Labs. O foco foi padronizar a taxonomia de eventos e garantir a blindagem do tráfego interno (FluxAI OS) contra envios de "sujeira" analítica, assegurando a pureza dos funis de conversão da Home e /giaas.

## 2. Mapa Geral de Tracking
- **GTM (Tag Manager):** Container mestre orquestrando GA4 e Meta Pixel.
- **GA4:** Recebedor primário de métricas de tráfego, eventos e sessões.
- **Clarity:** Mapa de calor ativado em Front-End Público.
- **Meta/Facebook:** Pixel configurado (A validar token/ID).
- **Make:** Recebe a conversão (LEADS_SITE), mas ignorado para eventos de clique (EVENTOS_SITE ausente/planejado).

## 3. Eventos Encontrados e 4. Faltantes
| Evento Oficial | Status Físico Identificado | Ação Sugerida |
|---|---|---|
| lead_form_start | ✅ Presente | Manter |
| lead_submit_success | ✅ Presente | Manter |
| diagnostic_cta_click | ✅ Presente | Manter |
| lead_submit_error | ❌ Faltante (Console Apenas)| Injetar no Catch da API |
| giaas_offer_click | ❌ Faltante / Genérico | Padronizar cliques da LP |
| whatsapp_click | ✅ Presente (Removido visual) | Manter log inativo |
| instagram_click | ✅ Presente | Manter |
| linkedin_click | ❌ Inexistente | Aguardando URL |

## 5. Parâmetros Encontrados e 6. Faltantes
- **Encontrados no DataLayer atual:** orm_id, page_path.
- **Faltantes (A Padronizar na Correção):** page_title, utton_text, event_area, offer_name, lead_source, lead_origin, campaign_source, campaign_medium, campaign_name, 	imestamp.

## 7. Auditoria GTM
- Dispara corretamente em index.html, /giaas.html e /pages/*.html.
- Risco Mapeado: Verificar se o GTM Container Snippet está acidentalmente vazando na pasta /os/ (Tráfego interno do Command Center pode poluir as sessões de usuário).

## 8. Auditoria GA4
- Recebendo page_view padrão.
- Evento de lead_submit_success isolado do erro. O false-positive foi extirpado na Etapa 2.5C (HTTP 200 dependente).

## 9. Auditoria Search Console
- **SEO Técnico:** Site publico 100% indexado (Validado no Google na etapa anterior).
- **Sitemap/Robots:** /giaas está corretamente aberta para Search Engine. O arquivo obots.txt precisa assegurar Disallow: /os/ para impedir que painéis internos e URLs de clientes virem cache no Google.

## 10. Auditoria Clarity
- Scripts inativos/limitados no /os/. **Recomendação Ouro:** O Clarity não deve rodar no FluxAI OS (Client Portal) para não gravar sessões ou vazar dados sensíveis, faturamento ou senhas imputadas (Regra de mascaramento do Clarity não confere 100% segurança).

## 11. Auditoria Meta/Facebook
- Sem erros de bq no console no carregamento.
- Link de Facebook desativado no rodapé. Racional: Sem página validada, esconder mantém a autoridade.

## 12. Auditoria Instagram e 13. LinkedIn
- Link IG https://www.instagram.com/fluxai.labs/ íntegro. Dispara instagram_click no DataLayer.
- LinkedIn Inexistente. Manter ícone oculto/inativo.

## 14. Auditoria Make
- LEADS_SITE consome apenas conversões reais.
- Eventos de clique (Scroll, CTA) devem ter um Webhook apartado (ex: para uma aba EVENTOS_SITE) no futuro, impedindo que logs de cliques matem a capacidade processual do Make para *Hot Leads*. (Status: Suspenso, sem novos webhooks).

## 15. Auditoria FluxAI OS como consumidor dos dados
- O CRM interno não enxerga a Taxonomia UTM (source, medium, campaign).
- Isso é um "Blind Spot" de Vendas. O OS precisa herdar esses parâmetros que o GTM lê na URL e salvar no localStorage para enviar no payload do Formulário.

## 16. Riscos de Inconsistência
- Inconsistência entre a Taxonomia de Origem (Ex: meta_ads vs acebook_cpc).
- Perda da origem primária do Lead caso ele troque de página antes de preencher o formulário (UTM Drop).

## 17. Recomendação de Padronização (Obrigatória)
Adoção estrita da nomenclatura documentada (Ex: Sistema de Crescimento FluxAI, landing_sistema_crescimento, etc). Nenhuma variável de *CamelCase* ou letras maiúsculas espaçadas nos IDs de tracking.

## 18. O que pode ser corrigido agora
1. Injeção da Taxonomia UTM no script.js (Captura nativa via URLSearchParams) persistindo no SessionStorage.
2. Expansão do DataLayer em /giaas e Home para enviar todos os 13 parâmetros exigidos.

## 19. O que depende de aprovação
- Criação e disparo da nova aba EVENTOS_SITE no Make.
- Adição da tag Disallow: /os/ no obots.txt.

## 20. Plano de Validação
- Acionar GTM Preview localmente (localhost).
- Realizar simulados de cliques nos CTAs.
- Interceptar o GA4 DebugView garantindo que lead_origin e lead_source subam como strings limpas.
