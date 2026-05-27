# OWASP_P0_MAKE_PROXY_DEPLOY_PREP_FASE_03_1F

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Preparação para Deploy Controlado do Proxy Edge Supabase (Fase 03.1F)

## 1. Confirmação de Infraestrutura de Secrets
Confirma-se que as 10 URLs de webhooks regeneradas e seguras foram cadastradas **manualmente** pelo Administrador diretamente no painel do Supabase Vault (Edge Functions Secrets). 
Nenhuma URL foi inserida ou colada no código fonte, repositório ou variáveis `.env` versionadas. 

A Edge Function `make-proxy` está programada e confirmada para usar `Deno.env.get()` para extrair de forma assíncrona as seguintes chaves em memória no momento do disparo:
- `MAKE_WEBHOOK_DEMAND_SUBMISSION`
- `MAKE_WEBHOOK_LEAD_CAPTURE`
- `MAKE_WEBHOOK_CLIENT_ONBOARDING`
- `MAKE_WEBHOOK_SERVICE_EXTRA_REQUEST`
- `MAKE_WEBHOOK_IA_CREDITOS_CONTROLE`
- `MAKE_WEBHOOK_SERVICE_EXTRA_APPROVAL`
- `MAKE_WEBHOOK_IA_GUARDRAIL`
- `MAKE_WEBHOOK_PLANEJAMENTO_CONTEUDO`
- `MAKE_WEBHOOK_CALENDARIO_POSTAGENS`
- `MAKE_WEBHOOK_GPT_GERACOES_LOG`

*Nota:* A chave `MAKE_WEBHOOK_AI_OPERATIONAL_CONTROL` está mapeada no código, mas se encontra pendente de configuração no painel do Supabase. Essa ausência isolada não bloqueia as demais rotas já cadastradas, uma vez que a *Edge Function* é modular e lidará lançando um erro pontual (`Webhook route is not configured`) apenas se a chave faltante for expressamente requisitada.

## 2. Garantia de Congelamento do Frontend
Para atestar auditoria:
- **Nenhum arquivo do frontend sofreu mutação.**
- A constante `WEBHOOK_CONFIG` original persiste temporariamente em `os/config/os-config.js` enquanto validamos a infraestrutura em background. Sua decapitação será a glória final na fase posterior de virada da chave.
- O escopo Funcional (Auth, RBAC, OS Core, Login, Client Portal, Estilos e Rotas limpas) continua 100% blindado contra regressões.

## 3. Próxima Ação (Deploy Controlado)
A *Edge Function* `make-proxy` atende a todos os critérios de isolamento e segurança requeridos. Está autorizada a ir ao ar na Cloud do Supabase via CLI (`supabase functions deploy make-proxy`).

## 4. Estratégia de Homologação (First Blood)
Ao concluirmos o Deploy para a Cloud, não mudaremos todo o painel de uma vez. Faremos o desvio (Frontend → Proxy) **apenas** para o cenário estático mais indolor:
**Rota de Teste: `LEAD_CAPTURE`**
- Motivo: É a rota pública mapeada em `PUBLIC_ROUTES` que não exige validação profunda de sessão Auth. Permitirá validar a passagem do CORS, a recepção do Body e o disparo subjacente pro Make garantindo que os IPs do Edge não sejam bloqueados pela nossa ponta de recebimento.
- Atingindo 200 OK sem expor headers internos, liberamos as portas para o resto.
