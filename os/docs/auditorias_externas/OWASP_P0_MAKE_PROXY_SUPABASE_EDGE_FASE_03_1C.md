# OWASP_P0_MAKE_PROXY_SUPABASE_EDGE_FASE_03_1C

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Plano de Remediação P0 (Proxy Backend Seguro)

## 1. Decisão Arquitetural
**Modelo Adotado:** Frontend FluxAI OS™ → Supabase Edge Function → Make Webhook Privado.
As URLs públicas diretas para o Make serão exterminadas do Frontend. Todas as requisições serão interceptadas e encapsuladas por um proxy seguro hospedado na infraestrutura Edge do Supabase.

## 2. Motivo da Escolha
Adoção do Supabase Edge Functions atende aos seguintes pilares críticos da aplicação:
- O módulo de Autenticação (Auth) e o RBAC já operam nativamente no Supabase, facilitando validações unificadas de JWT.
- A Edge Function permite isolar Variáveis de Ambiente (Secrets) longe do navegador público.
- Remove de forma definitiva os webhooks cruéis do Javascript público (os-config.js).
- Permite validação server-side rígida da Sessão do Usuário antes do disparo.
- Permite validação sanitizada e estrutural do Payload de entrada.
- Permite a inserção orgânica de Rate Limiting lógico (Prevenção contra DDoS/Spam/Abuso).
- Reduz drasticamente a superfície de exposição e zera os falsos positivos no DAST.

## 3. Novo Fluxo Lógico (Topologia Segura)
1. O Frontend dispara o payload JSON genérico endereçado ao endpoint centralizado da Edge Function.
2. A Edge Function recebe e valida a origem (*CORS/Origins*).
3. A Edge Function extrai e valida o token JWT/Session do usuário (quando a rota exigir credencial).
4. A Edge Function checa se a `route` informada consta na *Allowlist* interna.
5. A Edge Function resolve dinamicamente a URL secreta do Make puxando de Variáveis de Ambiente.
6. A Edge Function dispara um POST isolado de Backend para o Make e retorna um *Status Code* blindado.
7. O container do Make processa e confia, pois apenas recebe tráfego autenticado vindo do Proxy, invisível para o usuário final.

## 4. Rotas e Chaves Afetadas
As 11 chaves contidas no `WEBHOOK_CONFIG` que serão decapitadas do JS e envelopadas no backend:
- `DEMAND_SUBMISSION`
- `LEAD_CAPTURE`
- `CLIENT_ONBOARDING`
- `SERVICE_EXTRA_REQUEST`
- `IA_CREDITOS_CONTROLE`
- `AI_OPERATIONAL_CONTROL`
- `SERVICE_EXTRA_APPROVAL`
- `IA_GUARDRAIL`
- `PLANEJAMENTO_CONTEUDO`
- `CALENDARIO_POSTAGENS`
- `GPT_GERACOES_LOG`

## 5. Variáveis de Ambiente Sugeridas (Supabase Secrets)
*Os valores reais deverão ser provisionados exclusivamente pelo CLI/Dashboard do Supabase e mascarados do código.*
- `MAKE_WEBHOOK_DEMAND_SUBMISSION`
- `MAKE_WEBHOOK_LEAD_CAPTURE`
- `MAKE_WEBHOOK_CLIENT_ONBOARDING`
- `MAKE_WEBHOOK_SERVICE_EXTRA_REQUEST`
- `MAKE_WEBHOOK_IA_CREDITOS_CONTROLE`
- `MAKE_WEBHOOK_AI_OPERATIONAL_CONTROL`
- `MAKE_WEBHOOK_SERVICE_EXTRA_APPROVAL`
- `MAKE_WEBHOOK_IA_GUARDRAIL`
- `MAKE_WEBHOOK_PLANEJAMENTO_CONTEUDO`
- `MAKE_WEBHOOK_CALENDARIO_POSTAGENS`
- `MAKE_WEBHOOK_GPT_GERACOES_LOG`

## 6. Estrutura Sugerida da Edge Function
**Nome:** `make-proxy`
**Endpoint Oficial:** `POST /functions/v1/make-proxy`

**Exemplo de Payload Esperado:**
```json
{
  "route": "DEMAND_SUBMISSION",
  "client_id": "...",
  "source": "fluxai_os",
  "payload": {
    "title": "Demanda X",
    "description": "Detalhes..."
  }
}
```

**Malha de Validação da Edge Function:**
- A chave `route` precisa obrigatoriamente cruzar contra um Dictionary/Allowlist estrito. Rotas desconhecidas sofrem DROP instantâneo (HTTP 403).
- O objeto `payload` não pode ser *null* ou estar vazio.
- Se a *route* exigir credenciamento, a validação de `Authorization: Bearer <token>` será imperativa via Supabase Auth Client.
- Aplicação de limite básico por Origem IP/Client_id.
- **Sob nenhuma hipótese** a Edge Function retorna a URL do Make no log ou na *Response Body*. Retornar sempre Status (Ex: `200 OK`, `400 Bad Request`).

## 7. Alterações Futuras no Frontend (Caminho Crtítico)
Para não quebrar a engrenagem, haverá um desvio imperativo na arquitetura:
Substituir o modelo atual no arquivo `/os/config/os-config.js` onde temos: `const url = WEBHOOK_CONFIG[targetKey]; fetch(url, ...)`
Por chamadas envoltas que apontem estritamente para o Proxy:
Supabase Edge Function: `make-proxy` ou mediante uma camada utilitária central `window.FLUXAI_API.dispatchWebhook(route, payload)`.

## 8. Contenção Operacional no Make
Para blindar o pipeline existente antes da conversão:
- Pausar temporariamente todos os cenários Make afetados durante a janela de implantação.
- **Regenerar Webhooks:** Acionar a troca das chaves gerando URLs 100% novas. As antigas, já raspadas da web, perdem a validade de imediato.
- Inserir as novas rotas exclusivamente nos Secrets do Supabase. Nunca reaproveitar um Hook velho.
- **Opcional (Hardening 2.0):** Adicionar um módulo Router/Filtro logo no primeiro passo do Make verificando: `source = fluxai_os`, `route` esperada, e um token interno secreto que será disparado apenas pelo backend do Supabase.

## 9. Plano de Implementação por Etapas (Roadmap Seguro)
**Fase A:** Criar e debugar a Edge Function `make-proxy` isoladamente (sem pendurar na produção).
**Fase B:** Configurar todos os Segredos Oficiais no Console do Supabase atrelando aos webhooks regenerados.
**Fase C:** Refatorar a classe Webhook do Frontend para mirar o Proxy (Apagando as URLs literais).
**Fase D:** Desativar formalmente e desativar qualquer Hook antigo sobrevivente no Make.com.
**Fase E:** Teste unitário e dry-run em rota de baixa criticidade (Ex: Lead Capture passivo).
**Fase F:** Switch-over definitivo de toda a carteira e rotas restantes.
**Fase G:** Disparar nova esteira de CodeQL e OWASP ZAP (Auditoria cruzada) para certificar o sumiço do *Base64/URL Disclosure*.

## 10. Critério de Aprovação (Definição de Pronto)
- O arquivo `os-config.js` ou análogos não ostentam absolutamente nenhum rastro de domínio *make.com*.
- O frontend dispara unicamente para o domínio confiável da nossa arquitetura (/functions/v1/).
- O DAST não captura a assinatura de Hooks em Javascript Minificado.
- A comunicação é bem sucedida em toda a pipeline primária.
- As Edge Functions agem de forma opaca (Não expõem headers internos nas respostas).

## 11. Critério de Bloqueio (Rollback Imediato)
O commit **não sobe para produção**, acionando Freeze e Rollback, se:
- Restarem detritos de URL antigas flutuando na UI.
- Ocorrer vazamento acidental da `service_role` ou dos segredos injetados.
- O webhook Make aceitar um POST público cru burlando o Proxy.
- A refatoração causar falência catastrófica na submissão vital de Demandas do Cliente.
- O RBAC (Roles) for bypassado ao enviar webhooks administrativos por usuários não permitidos.
