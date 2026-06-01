# 🏛️ FluxAI Labs - Documentação Operacional

Este documento serve como a "Fonte da Verdade" para a infraestrutura técnica e de inteligência do ecossistema FluxAI Labs.

---

## 1. Infraestrutura de Rastreamento (Inteligência de Dados)

*   **Meta Pixel ID:** `1235053088839431` (Ativo e validado).
*   **Google Analytics 4 (GA4):** `G-KGJRE4BJYQ` (Configurado com `debug_mode` para validação).
*   **Microsoft Clarity:** ID `n72q8vcl9y` (Rotacionado por segurança - P0).
*   **Meta CAPI (API de Conversão):** Ativo e Integrado via Webhook (Garante 100% de recepção de leads, contornando AdBlocks). Chave de acesso armazenada de forma segura.
*   **Eventos Mapeados:**
    *   `generate_lead`: Disparado no envio do formulário de diagnóstico.
    *   `contact_whatsapp`: Disparado no clique em links de WhatsApp.
    *   `click_social_proof`: Disparado ao clicar nos links de Instagram/LinkedIn/Facebook no site.

---

## 2. Captura e Fluxo de Leads (The Backbone)

*   **Formulário:** Localizado na seção `#diagnostico`.
*   **Webhook (Make.com):** `https://hook.us2.make.com/bnm7xedyxhxdlvh417gone7gy5m4e8me`
*   **Destino CRM:** Google Sheets (FluxAI_CRM).
*   **Fluxo de Encerramento:** Após o envio, o lead é redirecionado para o WhatsApp `+5571981114694` com os dados pré-preenchidos.

---

## 3. Redirecionamentos Soberanos (Links de Bio)

Configurados via `vercel.json` para manter a estética de elite e o rastreamento preciso:

| Destino | Link Curto (Bio) | Função |
| :--- | :--- | :--- |
| **Instagram** | `fluxaidigital.com.br/ig` | Bio do Instagram (UTM Tracked) |
| **LinkedIn** | `fluxaidigital.com.br/in` | Bio do LinkedIn (UTM Tracked) |
| **Facebook** | `fluxaidigital.com.br/fb` | Link no Facebook (UTM Tracked) |
| **WhatsApp Profile** | `fluxaidigital.com.br/wpp` | Link para o site no perfil do Zap |
| **WhatsApp Direct** | `fluxaidigital.com.br/zap` | Redirecionamento limpo para o seu WhatsApp |
| **Diagnóstico** | `fluxaidigital.com.br/diagnostico` | Link direto para o formulário no site |

---

## 4. Google Search & Indexação

*   **Status:** Verificado via Propriedade de Domínio.
*   **Sitemap:** `https://fluxaidigital.com.br/sitemap.xml` (Processado com sucesso).
*   **Páginas Encontradas:** 7 páginas oficiais.
*   **Performance:** Inicializada com CTR acima da média (9,6%).

---

## 5. Branding e Identidade

*   **Nome Oficial:** FluxAI Labs.
*   **Slogan:** Sistemas de Crescimento.
*   **Metodologia:** Protegida pelo símbolo **FluxAI OS™**.
*   **Redes Sociais:** Unificadas sob a identidade visual de elite.

---

## 6. Automações e Cenários Make.com

### Cenário: 03_FLUXAI_INSTAGRAM_MANUAL_READER

**Função:** Ler dados manuais de Instagram preenchidos nas abas da planilha e alimentar o consolidado semanal para leitura posterior em relatórios (não usa Webhook, não altera o site).

**Agendamento:** Semanalmente, toda Segunda-feira (Monday) às 08:00.
**Planilha:** `FluxAI_Intelligence_Base_Ecossistema_Make`

**Fluxo Configurado:**
1. **Google Sheets > Search Rows em SERVICOS_CLIENTES:**
   - Filtros: `servico = instagram`, `status_servico = ativo`, `modo_coleta = manual`, `relatorio_incluir = sim`
   - Limit: 100
2. **Google Sheets > Search Rows em CLIENTES_CONFIG:**
   - Filtros: `client_id = cliente_id` vindo do módulo anterior, `status = ativo`
   - Limit: 1
3. **Google Sheets > Search Rows em INSTAGRAM_MANUAL_DIARIO:**
   - Filtro: `cliente_id = cliente_id validado`
   - Limit: 100
4. **Google Sheets > Search Rows em INSTAGRAM_CONTEUDO_MANUAL:**
   - Filtro: `cliente_id = cliente_id validado`
   - Limit: 100
5. **Google Sheets > Search Rows em CONSOLIDADO_SEMANAL:**
   - Filtros: `client_id = cliente_id do fluxo`, `semana_inicio = 2026-05-18` (Variável de tempo)
   - Limit: 1
6. **Google Sheets > Add a Row em CONSOLIDADO_SEMANAL:**
   - Campos: `client_id`, `semana_inicio`, `semana_fim`, `instagram_reach_total`, `profile_views_total`, `website_clicks_total`, `resumo_semana`, `principal_ganho`, `principal_risco`, `acao_recomendada`

**Regras e Restrições Importantes:**
- A chave lógica do consolidado deve ser sempre `client_id` + `semana_inicio` (nunca buscar apenas por `client_id`).
- Este cenário opera em Batch (Lote) apenas via Schedule (não deve rodar diariamente, nem escutar Webhooks).

**Próximas Evoluções (Roadmap):**
- Criar **Router** final com: (A) Se encontrar linha -> *Update Row*; (B) Se não encontrar -> *Add Row*.
- Agregação avançada somando múltiplos conteúdos para alimentar a aba `ANALISE_MENSAL_CLIENTE`.

**Estado Atual:** Validado estruturalmente. Criou/processou os clientes oficiais perfeitamente e está pronto para ativação semanal.

---
*Documento atualizado em 22/05/2026. Este é um ativo estratégico da FluxAI Labs.*
