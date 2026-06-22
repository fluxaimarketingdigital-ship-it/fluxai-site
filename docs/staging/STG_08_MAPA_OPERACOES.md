# STG-08: GATE 1 — MAPA DE OPERAÇÕES TRANSACIONAIS

| Rota | Natureza | Criticidade | Idempotência Exigida | Business_ID | Status Esperado | Timeout Esperado |
|---|---|---|---|---|---|---|
| `onboarding_cliente` | Criação Mutável | CRÍTICA | SIM (Bloqueia duplicatas) | ID_CNPJ / E-mail | `completed` ou `failed` | `unknown` se > 15s |
| `gerar_leads` | Mutável | MÉDIA | SIM | Batch_ID | `partially_completed` ou `completed` | Reprocessável |
| `consulta_financeiro` | Consulta (Read-Only) | MÉDIA | NÃO (Safe) | N/A | `completed` instantâneo | `failed` |

O mapeamento define as chaves de idempotência necessárias que impedirão a clonagem acidental de transações por "double-click" na UI.
