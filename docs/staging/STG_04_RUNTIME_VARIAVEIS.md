# STG-04: GATE 2 — RUNTIME E VARIÁVEIS

## Identificação Técnica
* **Framework Frontend:** Vanilla JavaScript puro (ES Modules via import).
* **Bundler:** Inexistente (arquivos servidos estaticamente pelo Vercel).
* **Runtime Navegador:** Browser JS nativo (Chrome/Safari/Edge).
* **Runtime Serverless:** Vercel Edge Runtime (Node-like).
* **Mecanismo de Variáveis Server-side:** `process.env` no `make-proxy.js`.
* **Mecanismo de Variáveis Client-side:** Atualmente hardcoded em `os-config.js` e `.html` files.

## Regra de Injeção Frontend
Visto que não há Vite ou Webpack para substituir tokens `process.env` em tempo de build, a exposição de variáveis públicas no frontend deve ser feita via um arquivo estático externo (`env.js`) carregado pelo `<script>` no HTML, definindo o objeto global `window.FLUXAI_ENV`. Este arquivo será inserido no `.gitignore` e não fará commit dos valores reais.

## Classificação das Variáveis Essenciais
| Variável | Arquivo Consumidor | Runtime | Privacidade | Mecanismo | Risco | Decisão |
|---|---|---|---|---|---|---|
| `SUPABASE_URL` | `os-config.js`, `*.html` | Browser | Pública | `window.FLUXAI_ENV` | Baixo | Isolar no global `env.js` |
| `SUPABASE_ANON_KEY` | `os-config.js` | Browser | Pública | `window.FLUXAI_ENV` | Baixo | Isolar no global `env.js` |
| `MAKE_PROXY_URL` | Frontend `fetch` | Browser | Pública | Função Host | Baixo | Dinâmico local (`/api/make-proxy`) |
| `MAKE_WEBHOOK_URL_*` | `api/make-proxy.js` | Edge | Secreta | `process.env` | Crítico | Restringir via `.env` do Vercel |
