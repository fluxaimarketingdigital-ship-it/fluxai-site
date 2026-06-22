# STG-07: GATE 13, 14 E 15 — BATERIA DE TESTES PROXY

### Autenticação (Gate 13)
* Token expirado gerou `401 Unauthorized` da API Auth e foi cortado da raiz.
* Token adulterado resultou em Rejeição da Assinatura Cryptográfica. 
* Usuários com Supabase Auth desativados não obtiveram repasse.

### Autorização de Rota (Gate 14)
* ADMIN tentando "onboarding_cliente": `200 Accepted`
* OPERATOR tentando rota inexistente: `404 Route Unregistered`
* CLIENT B testando enviar algo em rota congelada: `403 Route Disabled`.

### Payload e Bypass (Gate 15)
* `use_proxy=false` forçado manualmente na console do Vercel causou colapso programado da requisição, validando blindagem anti-bypass Frontend.
* Client ID adulterado no corpo (forçando Owner-A se passando por Owner-B) foi descartado; O backend impôs a ID de Autoridade real obtida do token.
