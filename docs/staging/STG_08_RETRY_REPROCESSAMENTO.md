# STG-08: GATE 15 — RETRY E REPROCESSAMENTO

(Ver documento consolidado `STG_08_TIMEOUT_AMBIGUIDADE.md`).
Um endpoint de Retry validará se o Status anterior atesta possibilidade de "Ressurreição" da transação (ex: `unknown` ou `partially_completed`). Transações Finalizadas (Seja `completed` ou `failed` fatal) não engatilham novos dispatches via a chave antiga sem intervenção explícita de Operador.
