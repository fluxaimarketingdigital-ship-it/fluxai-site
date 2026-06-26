# INVENTÁRIO DE CORRELAÇÃO E TRACE

**Existe correlation_id?**
Não no lado do Proxy Vercel. O payload cru é retransmitido. Se o frontend não enviar um identificador nativo, a Vercel não assinala um ID transversal da sessão.

**Existe request_id?**
O framework Next.js/Vercel cria um `x-vercel-id` nativo na rede, mas ele não é lido no código `api/make-proxy.js` e não é anexado ao corpo da requisição que viaja para o Make.

**Existe trace_id?**
Inexistente.

**Propagação entre sistemas:**
O trace morre na fronteira Vercel -> Make. O Supabase, quando atingido pelo Make, recebe requisições oriundas dos IPs do Make e sem nenhum cabeçalho HTTP de correlação atrelado à intenção original do navegador do cliente. O único elo atual é se o payload JSON contiver um ID de entidade (ex: `demanda_id`).
