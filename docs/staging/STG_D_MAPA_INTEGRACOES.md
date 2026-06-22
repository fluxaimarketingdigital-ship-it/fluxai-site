# STG-D: MAPA DAS INTEGRAÇÕES

## Fluxos Identificados

| Origem | Destino | Mecanismo / Rota | Autenticação / Segurança | Risco | Status Transacional / Rollback | Criticidade |
|---|---|---|---|---|---|---|
| Frontend (OS) | Supabase Auth | Native Supabase Client JS | Native JWT Session | Baixo | Nativo / Síncrono | CRÍTICO |
| Frontend (OS) | Vercel Proxy | `fetch('/api/make-proxy')` | **Nenhuma (Bypassável)** | Crítico (Anon) | HTTP 200 "Falso Sucesso" | CRÍTICO |
| Vercel Proxy | Make.com | HTTP POST `hook.us2.make.com` | Rota Ocultada em `.env` Vercel | Médio | Assíncrono sem Correlação | ALTO |
| Frontend (OS) | Make.com | HTTP POST Direto | Rota Exposta via `use_proxy=false` | Crítico (Leak) | Sem Idempotência Transversal | CRÍTICO |
| Make.com | Google Sheets | Google Sheets Connector | OAuth / Service Account | Baixo | Add/Update isolado, Rollback manual | MÉDIO |
| Make.com | Supabase API | HTTP REST `insert/update` | Service Role Key (Suposta) | Médio | Sem Transação Atômica com Sheets | ALTO |
| Make.com | Google Drive | Google Drive Connector | OAuth | Baixo | Gravação paralela, orfãos possíveis | MÉDIO |
