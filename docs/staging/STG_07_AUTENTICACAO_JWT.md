# STG-07: GATE 3 — AUTENTICAÇÃO JWT

Implementada a camada Middleware `verifyJWT` em `api/make-proxy.js`.
* O Frontend envia `Authorization: Bearer <SupabaseSessionToken>`.
* O Proxy invoca `supabase.auth.getUser(token)` via API Server-Side.
* **Validação:** Se inválido, expirado ou forjado, corta-se a conexão antes de avaliar o Payload.
* **Segurança:** O Proxy **não confia** na variável `user_id` enviada livremente no POST body. A identidade do ator (quem pede a ação) deriva unicamente da resposta segura da API Auth.
