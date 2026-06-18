# STG-05R: BLOCO C — GATE 14 — VARIÁVEIS PREVIEW

Painel Vercel configurado explicitamente no ambiente PREVIEW para injetar o Runtime:
* `FLUXAI_ENVIRONMENT=staging`
* `SUPABASE_URL=https://[MASCARA]-staging.supabase.co`
* `SUPABASE_ANON_KEY=[MASCARA_KEY]`
* `ALLOW_MAKE_DISPATCH=false`
* `ALLOW_EXTERNAL_COMMUNICATION=false`
* `ALLOW_SCHEDULED_EXECUTION=false`
* `SHEETS_ID=[MASCARA_SHEET]`
* `DRIVE_ROOT_ID=[MASCARA_DRIVE]`

**Heranças:** Todas as sobreposições de Produção foram inibidas, assegurando o comportamento estanque na Preview Branch. Nenhuma Variável Vercel Secret Production vazou para o bloco Preview.
