# STG-08: GATE 14, 15 E 16 — FALHAS E TIMEOUTS

### Timeout e Ambiguidade (Gate 14)
* Se a internet cair ou o Mock Adapter silenciar, a transação repousa em `unknown`. O Frontend não autorizará resubmissão limpa. Ele fará um "Retry Técnico" mantendo a `idempotency_key`.

### Retry e Reprocessamento (Gate 15)
* Retrys carregam a mesma `idempotency_key` garantindo retorno idempotente do Backend (não gerará novos leads em duplicidade no Supabase).

### Falha Parcial (Gate 16)
* Etapas compostas (Ex: Gera Lead, mas Falha envio de Email). O Status persistirá como `partially_completed`. Retentativas processarão exclusivamente a perna do e-mail (Comportamento previsto, mas ainda dependente da abstração do Make e da refatoração de Make em si no Futuro Bloco STG-10).
