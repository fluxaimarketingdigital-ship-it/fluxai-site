# STG-03: REFERÊNCIAS À PRODUÇÃO

## Gate 2 — Varredura Global

| Arquivo | Linha | Valor Mascarado | Tipo | Ambiente Aparente | Consumidor | Risco | Ação Futura | Bloqueia? | Congelado? |
|---|---|---|---|---|---|---|---|---|---|
| `os/services/makeClient.js` | 59 | `!routeConfig.use_proxy` | Booleano Bypass | Produção (Frontend) | Bypass Make | Crítico | Remover Bypass / Forçar Proxy | SIM | Não |
| `os/services/makeRoutes.js` | 11 | `use_proxy: proxyMode...` | Flag Lógica | Produção | Roteador | Médio | Deprecar propriedade | SIM | Não |
| `vercel.json` | N/A | `https://mufgwetf...` | CSP Domain | Produção | Segurança | Médio | Adicionar ref de STG | Não | Não |
| `*.html` | Múltiplas | `https://mufgwetf...` | API URL (Supabase) | Produção | Native Client | Crítico | Usar Variável de Ambiente | SIM | Não |
| Código / UI | N/A | Nomes de Clientes/IDs | Texto Visual | Produção | Frontend | Baixo | Substituir por dados mock | Não | Não |

*Nota: Não foram feitas alterações no código. A varredura comprovou que o frontend ainda depende nativamente (hardcoded em inicializações CDN/HTML) da URL de Produção do Supabase, o que bloqueia o isolamento completo até ser substituído.*
