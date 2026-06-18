# STG-03: MANIFESTO DE VARIÁVEIS

| Nome da Variável | Camada | Existência PROD | STG Necessário? | Tipo | Origem | Obrigatória? | Default PROD? | Risco Herança | Rotação |
|---|---|---|---|---|---|---|---|---|---|
| `SUPABASE_URL` | Frontend | Sim | Sim | Pública | Vercel Env | Sim | Não Permitido | CRÍTICO | Não |
| `SUPABASE_ANON_KEY`| Frontend | Sim | Sim | Pública | Vercel Env | Sim | Não Permitido | CRÍTICO | Sim |
| `MAKE_WEBHOOK_URL_01`| Edge Proxy| Sim (N/A config)| Sim | Privada | Vercel Env | Sim | Não Permitido | CRÍTICO | Sim |
| `STG_MODE_FLAG` | Frontend | Não | Sim | Pública | Vercel Env | Não | `false` | Médio | Não |
| `SUPABASE_SERVICE_ROLE`| Edge/Server| Não (Seguro)| Talvez| Privada | Vercel Env | Não | Não Permitido | CRÍTICO | Sim |

*Regra:* A inicialização da branch `staging` falhará se `SUPABASE_URL` conter a string `mufgwetfhfhhmhowbhjj` (ID de produção do projeto atual).
