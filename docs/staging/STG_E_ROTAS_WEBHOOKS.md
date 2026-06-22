# STG-E: ROTAS E WEBHOOKS

## 8.1 Rotas Front -> Proxy

| Nome Lógico / Alias | Declaração | Método | Autenticação | Escopo Role | Payload | Resposta HTTP Front | Risco |
|---|---|---|---|---|---|---|---|
| ROTA_OS_01_PORTAL_DEMANDAS | `makeRoutes.js` | POST | Nenhuma | Indistinta | `{titulo, desc}` | 200 "Accepted" (Assíncrono) | CRÍTICO |
| ROTA_OS_02_LEADS_SITE | `makeRoutes.js` | POST | Nenhuma | Pública | `{nome_lead...}` | 200 "Accepted" | MÉDIO |
| ROTA_OS_09_ONBOARDING | `makeRoutes.js` | POST | Nenhuma | Indistinta | Dados Cliente | 200 "Accepted" | CRÍTICO |
| ROTA_OS_10_SERVICO_EXTRA | `makeRoutes.js` | POST | Nenhuma | Indistinta | Dados Financeiros | 200 JSON Síncrono (Teste) | CRÍTICO (Bypass) |
| ROTA_OS_14_ARQUIVOS | `makeRoutes.js` | POST | Nenhuma | Indistinta | Metadados | 200 "Accepted" | MÉDIO |

## 8.2 Webhooks (Make Inbound)

| Identificador (Mascarado) | Nome Lógico | Ambiente | Status / Classificação | Autenticação Make | Proteção |
|---|---|---|---|---|---|
| `hook.us2.../gixobc...` | ROTA_OS_01 | PROD | OFICIAL | Nenhuma (Header Genérico) | PROTEGIDO POR PROXY |
| `hook.us2.../gixobc...` | ROTA_OS_02 | PROD | OFICIAL | Nenhuma | PROTEGIDO POR PROXY |
| `hook.us2.../gixobc...` | ROTA_OS_09 | PROD | OFICIAL | Nenhuma | PROTEGIDO POR PROXY |
| `hook.us2.../gixobc...` | ROTA_OS_10 | PROD | OFICIAL | Nenhuma | EXPOSTO DIRETAMENTE |
| `hook.us2.../gixobc...` | SANDBOX_10 | SANDBOX | SANDBOX ENCERRADO | Nenhuma | EXPOSTO DIRETAMENTE |

*Nota: URLs reais foram suprimidas em conformidade com as regras.*
