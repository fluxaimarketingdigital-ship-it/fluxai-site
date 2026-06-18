# STG-08: GATE 7 E 8 — MÁQUINA DE ESTADOS E RLS TRANSACIONAL

### Máquina de Estados (Gate 7)
Transições estritas validadas via Trigger PostgreSQL `transaction_events`:
* Um estado `failed` NUNCA pode se converter subitamente para `completed` sem uma repetição autorizada via transação filha ou reprocesso do Make. Se ocorrer tentativa manual via BD, a Trigger invalida a mudança de status.
* Rollback apenas em `partially_completed` (Se o Make acusar falha na perna 3 de 4).

### RLS Transacional (Gate 8)
* `STG_CLIENT_A` listando transações em `public.transactions` encontra apenas as referentes ao seu perfil.
* As interfaces do Frontend são fisicamente barradas de alterar a coluna `status`. A API Proxy é dona da autoridade de escrita via Service Key interna ou Roles definidos pelo Supabase Edge Functions.
