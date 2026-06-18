# STG-03: MATRIZ FAIL-CLOSED

Controles estruturais mandatórios para evitar colapso cruzado (Staging atingindo Produção):

1. **Bloqueio Hardcoded (Preventivo Automatizável):** O frontend (client JS) terá um _Assertion_ no carregamento. Se a URL atual for `stg.fluxaidigital.com.br` e o `SUPABASE_URL` configurado for `https://mufgwetfhfhhmhowbhjj...`, a UI renderiza tela branca de erro fatal.
2. **Bloqueio Proxy JWT (Preventivo Automatizável):** `api/make-proxy` em Staging exigirá Auth Bearer do Supabase. Sem token de teste válido gerado no Supabase Staging, POST aborta em 401.
3. **Bloqueio de Use_Proxy (Preventivo Manual):** Variável `use_proxy=false` não existirá em rotas de STG. Tudo passará pela Vercel.
4. **Schedules OFF (Detectivo/Preventivo):** O Make em Staging operará sob regra rigorosa: ativadores atrelados unicamente a Webhooks (`Custom Webhook`), impedindo cron jobs erráticos.
5. **Marcação Visual (Preventivo):** Logo da Navbar em Staging recebe Badge Vermelha "STG".
