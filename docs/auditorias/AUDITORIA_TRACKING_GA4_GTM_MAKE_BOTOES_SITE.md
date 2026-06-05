# AUDITORIA TRACKING: GA4, GTM E MAKE BOTOES DO SITE FLUXAI

## 1. Visão Geral
Esta auditoria documenta o rastreamento implementado no site da FluxAI, de acordo com as regras estabelecidas para o fechamento do Bloco 2.5C.

## 2. Decisões Técnicas Aplicadas
- **GA4/GTM**: Todos os botões estratégicos disparam dataLayer.push através da função global 	rackEvent.
- **Make**: Formulários (Home e /giaas) continuam a enviar para os endpoints originais. Cliques não acionam webhooks do Make neste momento, sendo listados como P2 (Pendência 2) para ativação futura na aba EVENTOS_SITE.
- **Eventos Duplicados**: Lógica implementada garante que cliques e submissões ocorram uma única vez.
- **Formulários**: O evento orm_start aciona apenas no primeiro _focus_ e o lead_submit apenas em sucessos de envio (esponse.ok).

## 3. Tabela de Mapeamento

| Botão / Link | Página | Evento Disparado | Parâmetros | Status GA4/GTM | Status Make |
|--------------|--------|-----------------|------------|----------------|-------------|
| Garantir Diagnóstico (Hero) | Home (/) | diagnostic_cta_click | utton_text, cta_position: hero | Rastreado | Não Aplicável (P2) |
| Garantir meu diagnóstico... | Home (/) | diagnostic_cta_click | utton_text, cta_position: footer | Rastreado | Não Aplicável (P2) |
| Formulário Home (Foco) | Home (/) | orm_start | orm_id: diagnosticoForm | Rastreado | Não Aplicável |
| Formulário Home (Sucesso)| Home (/) | lead_submit | orm_id: diagnosticoForm | Rastreado | Ativo (LEADS_SITE) |
| Aplicar para Diagnóstico | /giaas.html | offer_click | utton_text, destination: /giaas | Rastreado | Não Aplicável (P2) |
| Formulário /giaas (Foco) | /giaas.html | orm_start | orm_id: giaas-app-form | Rastreado | Não Aplicável |
| Formulário /giaas (Sucesso)| /giaas.html | lead_submit | orm_id: giaas-app-form | Rastreado | Ativo (make-proxy) |
| Sistema de Crescimento | Rodapé (/) | offer_click | utton_text, destination: /giaas | Rastreado | Não Aplicável (P2) |
| Instagram | Rodapé/Topo | outbound_click | utton_text, destination: instagram | Rastreado | Não Aplicável |
| LinkedIn | Rodapé | outbound_click | utton_text, destination: linkedin | Rastreado | Não Aplicável |
| Portal do Cliente | Home (/) | portal_click | utton_text: Portal do Cliente | Rastreado | Não Aplicável |
| Explorar Arquitetura (Mód.)| Home (/) | module_page_click| utton_text, destination | Rastreado | Não Aplicável |
| Botões das Páginas Internas| /pages/*.html| module_page_click| utton_text, destination | Rastreado | Não Aplicável |
| Contato Direto / WhatsApp | Múltiplas | whatsapp_click | destination: whatsapp | Rastreado | Não Aplicável (P2) |
| Política de Privacidade | Rodapé | ooter_link_click | utton_text | Rastreado | Não Aplicável |
| Voltar ao Topo | Rodapé | ooter_link_click | utton_text | Rastreado | Não Aplicável |

## 4. Evidências Textuais (Debug DataLayer)
\\\javascript
// Exemplo de payload enviado ao window.dataLayer
{
  "event": "diagnostic_cta_click",
  "page_path": "/",
  "page_location": "https://fluxaidigital.com.br/",
  "timestamp": "2026-06-05T00:35:00.000Z",
  "button_text": "Garantir Diagnóstico",
  "cta_position": "hero"
}
\\\

## 5. Correções Aplicadas e Pendências
- **Correções**: Substituição global de códigos fragmentados antigos (gtag('event', ...)) pelo disparador padrão único, que não cria poluição visual no código e evita a perda de eventos caso a lib ainda não tenha carregado (window.dataLayer.push).
- **Pendência Não-Bloqueante (Make P2)**: A configuração no Make.com do Cenário "15_FLUXAI_SITE_EVENTS_TRACKING" para a Aba EVENTOS_SITE ficou em pausa técnica (decisão do cliente).

## 6. Critério de Aceite
- [x] 100% dos CTAs mapeados e com eventos dataLayer.
- [x] 100% dos formulários validando envio antes do Make.
- [x] 0 envio de "evento de clique" poluindo os Webhooks de LEAD atuais.
- [x] Nenhuma automação/proposta disparada indevidamente.
