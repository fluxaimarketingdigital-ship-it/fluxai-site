# MAPA COMPLETO: FRONTEND, SITE, FLUXAI OS E PORTAL DO CLIENTE

Este documento mapeia de ponta a ponta todas as interações entre páginas, roteamentos e funções críticas do ecossistema FluxAI OS. O mapeamento foi extraído do código-fonte de produção em ambiente *Read-Only*. Nenhuma correção foi aplicada.

---

## 1. Arquivos HTML e Funções

### 1.1 Raiz (Site e LPs Comerciais)
*   `index.html`: Home page oficial da FluxAI. Foco em conversão e demonstração do Sistema de Crescimento. Captura leads (Modelo B) no rodapé.
*   `giaas.html`: Landing Page técnica do Growth as a Service. Captura leads (Modelo A) com perguntas avançadas de faturamento e gargalo.
*   `proposta-giaas-scale.html`: Página para envio de propostas comerciais de alto valor.
*   `deck.html`: Apresentação interativa de vendas.

### 1.2 Módulo Operacional (`/os/`)
*   `login.html`: Gateway de acesso ao OS. Integra via Supabase Auth.
*   `onboarding.html`: Wizard de 7 camadas para provisionar novos clientes no ecossistema (Estratégia, Infraestrutura, Escopo, Narrativa, Arquivos, Contrato, Ativação).
*   `client-portal.html`: Portal do cliente logado. Exibe métricas, calendário (mocked por enquanto), financeiro e permite solicitação de demandas/serviços extras.
*   `approval.html`: Portal de aprovação e revisão de entregáveis para clientes e operadores.
*   `contracts-finance.html`: Gestão interna de contratos, pagamentos mensais e faturas Pix.
*   `content-engine.html`: Workspace do operador/IA para planejamento e geração de postagens em lote.
*   `governance-users.html` / `governance.html`: Módulos de RBAC para operadores administrarem a base de clientes do Supabase.

---

## 2. Rotas, Chamadas e Proxies (Duality)

O mapeamento revelou que o Frontend possui **DUAS malhas de roteamento** rodando em paralelo, dependendo do arquivo JS que for invocado.

### 2.1 A Malha Legada (`makeClient.js` e `makeRoutes.js`)
*   **Proxy Alvo:** Vercel API Route (`/api/make-proxy.js`).
*   **Páginas que usam:** `onboarding.html` (via `MakeClient.sendPost`) e botões do `client-portal.html` (via `useMakeRoute.executeRoute`).
*   **Limitação:** O proxy da Vercel tem uma Allowlist cravada (`ROTA_OS_01`, `02` e `14`). O disparo do Onboarding só funciona caso o Vercel Serverless aceite a ROTA 09 ou a bloqueie silenciosamente. (Risco Operacional).

### 2.2 A Malha Moderna (`webhook-dispatcher.js` e `os-config.js`)
*   **Proxy Alvo:** Supabase Edge Function (`supabase/functions/make-proxy/index.ts`).
*   **Páginas que usam:** Módulos de gestão como `content-engine.js`, `approval.js` e `clients.js`.
*   **Vantagem:** Utiliza o `OS_CONFIG.webhooks.send(route, payload)` que chama `dispatchWebhook`. A Edge Function suporta as 11 rotas avançadas (IA, Serviços Extras, Guardrail).

---

## 3. Análise Focada: Onboarding (`onboarding.html`)

*   **Script Carregado:** `os/js/onboarding.js`
*   **Campos Chave:** Identidade Visual, Plataformas ativas, Contrato Financeiro (Módulo de Faturamento e Serviços de Setup).
*   **Payload e Rota:** A função monta o payload e chama `MakeClient.sendPost(ROTAS_OS_MAKE['ROTA_OS_09_ONBOARDING'], payload)`.
*   **Coerência Narrativa (Atenção):** O botão final exibe: `"GERAR ONBOARDING EM RASCUNHO"` com um overlay de *"ATIVANDO ECOSSISTEMA"*. A narrativa é agressiva, mas tecnicamente segura: o cliente nasce como `em_onboarding`, contrato em `rascunho` e `ia_bloqueada: true`.
*   **Riscos Estruturais:** Usa a malha legada (Vercel API) em vez do `webhook-dispatcher` (Edge Function).

---

## 4. Análise Focada: Portal do Cliente (`client-portal.html`)

*   **Verificação de Autenticação (IDOR Patch):** A página impede ativamente que um cliente tente ver os dados de outro alterando a URL, validando `session.project_id === projectId` (Linhas 612-631).
*   **Botão "Solicitar Serviço Extra" (CONFLITO GRAVE ENCONTRADO):**
    Apesar de existir a `ROTA_OS_10_SERVICO_EXTRA` mapeada nos arquivos de configuração, a função `submitDemanda()` no arquivo `client-portal.html` (linha 861) faz um *hardcode* chamando a ROTA 01 Clássica:
    `const result = await useMakeRoute.executeRoute('ROTA_OS_01_PORTAL_DEMANDAS', payload, { role: 'CLIENT' });`
    **Resultado:** Serviços extras estão sendo jogados na esteira de demandas mensais normais. A ROTA 10 de Serviços Extras (Fase 2D) está orfã no frontend.

---

## 5. Coerência Narrativa Global (UI / Textos)

Termos buscados em todo o ecossistema e seus resultados:
*   **agência**: Ausente na comunicação do OS. Presente apenas em discursos de contraste ("Aceleração de crescimento sem agências tradicionais").
*   **marketing digital / social media**: Tratados com jargão evoluído ("Estratégia Institucional", "Conteúdo").
*   **FluxAI OS / Sistema de Crescimento**: Usados massivamente como âncora de autoridade.
*   **ativação / infraestrutura**: Usados no onboarding. A conotação é de "provisionamento" seguro, sempre dependendo de validação da equipe interna da FluxAI.

---

## 6. Matriz Final: Risco e Recomendações

| Arquivo / Funcionalidade | Rota Usada (Código) | Malha de Proxy | Status do Roteamento | Recomendação (Pendência Técnica) |
| :--- | :--- | :--- | :--- | :--- |
| `client-portal.html` (Serviço Extra) | `ROTA_OS_01_PORTAL_DEMANDAS` | Vercel API / useMakeRoute | **CONFLITO** | **URGENTE**: Substituir hardcode de 'ROTA 01' para chamar a 'ROTA 10' no submitDemanda(). |
| `onboarding.html` (Formulário Final) | `ROTA_OS_09_ONBOARDING` | Vercel API / makeClient | **PENDENTE** | Migrar `makeClient.sendPost` para `dispatchWebhook` (Supabase Edge) para unificar a malha. |
| `makeRoutes.js` (Rotas IA e Extra) | `ROTA 10`, `11`, `13`, `15`, `16` | Marcadas `use_proxy: false` | **CONFLITO LEVE** | Ativar a flag `true` para uniformidade, ou desativar o arquivo em favor do `os-config.js`. |
| `api/make-proxy.js` (Vercel Allowlist) | 01, 02 e 14 | Vercel API Route | **OK** | Manter ativo temporariamente para não quebrar site/landing page até a unificação. |
| Patch IDOR (`client-portal.html`) | Validação via `project_id` | N/A | **OK** | Nenhuma ação requerida. Segurança efetiva. |
| Botões de Aprovação Financeira | `SERVICE_EXTRA_APPROVAL` (12) | Supabase Edge Function | **OK** | Fluxo protegido na nova malha. |
