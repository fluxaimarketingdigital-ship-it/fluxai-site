# STG-04: GATE 5 — REFERÊNCIAS REMOVIDAS DA BASE EXECUTÁVEL

A branch de Staging sofreu alterações estruturais ativas para blindar a infraestrutura remanescente do código em `os/config/os-config.js`.

| Arquivo Modificado | Elemento Removido / Parametrizado | Mecanismo Substituto | Teste (Efeito Staging) | Risco Residual |
|---|---|---|---|---|
| `os-config.js` | `url: 'https://mufgwetfhfh...'` | `window.FLUXAI_ENV.SUPABASE_URL` | Fail-Closed estático se `mufgwetfhfhhmhowbhjj` for carregado em Staging. | Múltiplos scripts HTML (`giaas.html`, `index.html`) ainda o invocam diretamente na tag `<script>` via URL crua. |
| `makeClient.js` | Bypass (`!routeConfig.use_proxy`) | Exception (Throw Error) | Requisições com `use_proxy=false` abortam localmente antes do Fetch. | Zero. Bloqueado de forma atômica no Adapter Central. |

## Resolução Parcial das URIs HTMLs
Nesta etapa, o proxy (Vercel) e as variáveis locais do `os-config.js` estão protegidos, no entanto as referências em componentes estáticos `HTML` continuam a exigir uma refatoração progressiva. Elas foram isoladas na documentação para não seccionar todo o site sem test-cases reais (conforme regras do STG).
