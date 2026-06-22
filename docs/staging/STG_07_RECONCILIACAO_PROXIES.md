# STG-07: GATE 1 — RECONCILIAÇÃO DOS PROXIES

A auditoria arquitetural levantou a existência histórica de potenciais múltiplas vias (Vercel Serverless `api/make-proxy.js` e funções de banco Supabase).
* **Decisão Arquitetural:** O Vercel Serverless Function (`api/make-proxy.js`) foi eleito como **Proxy Principal Único** para despachos originados da UI rumo a serviços de automação (Make).
* Edge Functions ou outras vias foram desabilitadas no painel Supabase Staging.
* Isso garante que os "Secrets" da automação e os Tokens de Bypass vivam apenas no cofre de variáveis de ambiente do Node.js, e não soltos no Frontend.
