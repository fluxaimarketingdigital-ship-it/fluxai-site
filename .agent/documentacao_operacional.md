# 🏛️ FluxAI Labs - Documentação Operacional

Este documento serve como a "Fonte da Verdade" para a infraestrutura técnica e de inteligência do ecossistema FluxAI Labs.

---

## 1. Infraestrutura de Rastreamento (Inteligência de Dados)

*   **Meta Pixel ID:** `1235053088839431` (Ativo e validado).
*   **Google Analytics 4 (GA4):** `G-KGJRE4BJYQ` (Configurado com `debug_mode` para validação).
*   **Microsoft Clarity:** ID `wonrxc0xrb` (Ativo para Heatmaps e Sessões).
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
*Documento atualizado em 09/05/2026. Este é um ativo estratégico da FluxAI Labs.*
