# STG-08: GATE 13 — FRONTEND TRANSACIONAL

(Ver documento consolidado `STG_08_CONTRATO_RESPOSTA.md` para os vetores de UX que desmantelam o "Spinner Verde Mentiroso").
O Frontend depende ativamente de WebSockets (futuros) ou Polling na rota `/api/transactions/:id` para habilitar sinetas de notificação de conclusão real (Status = `completed`).
