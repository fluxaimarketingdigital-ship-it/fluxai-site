# INVENTÁRIO DE AUTENTICAÇÃO E AUTORIZAÇÃO (PROXY)

## Análise do Backend (`api/make-proxy.js`)

**Quem pode acessar cada rota?**
Qualquer cliente HTTP da internet (Anônimos, Bots, Atacantes, Usuários).

**Como ocorre a autenticação?**
Não ocorre. A Vercel API Route atual aceita todo POST sem checar Header `Authorization`.

**Existe validação JWT?**
Não. Embora a arquitetura preveja um middleware `verifyJWT`, ele está **ausente** no código-fonte em execução (`api/make-proxy.js`). O backend não valida a assinatura do Supabase.

**Existe validação de sessão?**
Não existe checagem de estado de sessão do Supabase no lado do Node.js/Vercel.

**Existe bypass possível?**
Sim. Bypass crítico confirmado. Uma ferramenta como cURL ou Postman enviando um payload json `{ "routeId": "ROTA_OS_09_ONBOARDING", "payload": { "nome": "Hacked" } }` para `https://fluxaidigital.com.br/api/make-proxy` disparará o cenário no Make com sucesso, custando créditos na plataforma de automação e corrompendo os dados operacionais (caso o payload mimetize o schema real).
