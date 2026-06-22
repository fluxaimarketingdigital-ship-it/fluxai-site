# STG-C: PROXY, ROTAS E CONSUMIDORES FRONTEND

## 6.1 Componentes Identificados

* `api/make-proxy.js`: Edge Function na Vercel atuando como despachante de webhooks para o Make.
* `os/services/makeClient.js`: Cliente JavaScript frontend responsável por fazer o POST genérico e renderizar status na tela.

## 6.2 Chamadas e Rotas

* **Padrão Encontrado (`makeClient.js`):** 
```javascript
let targetUrl = '/api/make-proxy';
if (!routeConfig.use_proxy) { targetUrl = routeConfig.webhook_url; }
```
* Risco: O bloco `!routeConfig.use_proxy` permite bypass explícito da Vercel API, fazendo POST direto para as URLs `hook.us2.make.com`.

* **Tratamento de Sucesso Falso (`makeClient.js`):**
```javascript
try { responseData = JSON.parse(textRaw); }
catch (e) { responseData = { text: textRaw, ok: response.ok }; }
if (!response.ok) { return { success: false... }; }
return { success: true, data: responseData, status: response.status };
```
* Risco: Transforma `Accepted` (HTTP 200) do Make assíncrono em confirmação visual de negócio concluído, antes da execução das gravações.

## 6.3 Reconciliação de Proxy

* **Proxy Único Ativo:** Apenas Vercel Edge (`api/make-proxy.js`). A pasta `supabase/functions/make-proxy/` não demonstrou uso primário no client atual.
* **Autenticação:** O Vercel Proxy atual não valida o cabeçalho de autorização (`JWT`). Ele atua apenas como um despachante de roteamento baseado numa tabela fixa (`allowedRoutes`).
* **Allowlist Divergente:** Rotas críticas (como a Rota 10 - Serviço Extra Request) não constam na `allowedRoutes` do `make-proxy.js`, obrigando o fallback do frontend para chamadas diretas abertas no navegador.
