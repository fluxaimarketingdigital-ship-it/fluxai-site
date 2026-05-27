# OWASP_P0_MAKE_PROXY_IMPLEMENTACAO_FASE_03_1D

Data: 27/05/2026
Projeto: FluxAI OS™
Fase: Implementação Estrutural do Proxy Edge Supabase (Fase 03.1D)

## 1. Status da Implementação
A Fase A do plano de arquitetura segura foi concluída com sucesso. 
O esqueleto da Supabase Edge Function `make-proxy` foi criado em `supabase/functions/make-proxy/index.ts`.

Neste momento, a infraestrutura se encontra em modo estático/dorminhoco. **O frontend (`os-config.js`) permanece absolutamente intocado**, preservando o runtime atual do FluxAI OS™ enquanto a retaguarda é preparada. A variável genérica `WEBHOOK_CONFIG` ainda existe em produção.

## 2. Estrutura do Código (Edge Function)
A função atua como um gateway Deno/TypeScript blindado.

**Validações Mapeadas:**
- **CORS e OPTIONS:** Retorna instantaneamente HTTP 204 nas consultas de preflight, blindando a origem estritamente para `https://fluxaidigital.com.br`. Negação total para `Access-Control-Allow-Origin: *`.
- **Método HTTP:** Bloqueia sumariamente métodos que não sejam `POST` com HTTP 405.
- **Tipagem (Content-Type):** Bloqueia sumariamente requisições sem `application/json` com HTTP 415.
- **Payload Sanitizado:** O payload precisa de `route`, `source` e `payload`. Falhas resultam em HTTP 400.
- **Source Hardcoded:** O proxy obriga que `source === "fluxai_os"`, do contrário retorna HTTP 403.
- **Dicionário de Rotas (Allowlist):** O motor valida a chave recebida contra o `ROUTE_ENV_MAP`. Se não estiver nas 11 rotas da Allowlist, retorna HTTP 403.

## 3. Rotas Permitidas e Autenticação
O `ROUTE_ENV_MAP` amarrou todas as 11 rotas às respectivas Variáveis de Ambiente esperadas.

**Categorização (Públicas vs. Autenticadas):**
- A constante `PUBLIC_ROUTES` foi definida isolando a rota `LEAD_CAPTURE` (onde clientes não logados interagem no site).
- Todas as demais rotas foram submetidas ao portão de autenticação.
- O código engatilha validação de presença do header `Authorization: Bearer <token>`. Ausência gera HTTP 401. A inspeção criptográfica do JWT via Supabase Client está em pauta como TODO para a Fase 03.1E/03.1F (pós testes de rede).

## 4. Ocultação Operacional (Anti-Leak)
Em caso de falta da Variável de Ambiente configurada (Webhook não cadastrado no Dashboard do Supabase), a função cospe um `HTTP 500: Webhook route is not configured`. Ela **NUNCA** divulga o nome da variável de ambiente procurada ou as URLs no log client-side. Da mesma forma, se o Make retornar Timeout ou 500, a Edge devolve apenas um `502: Upstream webhook failed`.

## 5. Próximos Passos
O proxy está desenhado. Como ditam os critérios restritivos desta fase, o projeto não fará o Deploy automático agora. 

**Sequência Lógica Subsequente:**
1. Criar formalmente os Secrets (Env Vars) no Supabase UI com as URLs regeneradas do Make.
2. Regenerar webhooks no Make (Invalidar o legado afetado).
3. Atualizar o frontend (Classe OS_CONFIG/WEBHOOK_CONFIG) para parar de enviar as strings mágicas e simplesmente despachar o POST para `/functions/v1/make-proxy`.
4. Remover as URLs textuais públicas do `os-config.js`.
5. Rodar bateria de Teste cruzado (OWASP e CodeQL).
