# MATRIZ DE RISCOS (PROXY TRANSACIONAL)

| Risco | Classificação | Impacto | Exploração |
| :--- | :---: | :--- | :--- |
| **Spoofing de Identidade** | Crítico | O proxy não exige Autenticação/JWT. Um usuário "A" pode enviar um payload contendo dados forjados do cliente "B", que serão processados pelo Make. | Alta. Endpoint `api/make-proxy` é público na Vercel e seus inputs não são sanitizados. |
| **Denial of Wallet (DoW)** | Crítico | Como não há limite de rate (Rate-Limit local é bypassável) e não há autenticação (JWT), atacantes anônimos podem submeter milhares de payloads válidos no proxy, esgotando os créditos contratados do Make.com da FluxAI em minutos. | Alta. Bot loop simples na Vercel. |
| **Falsos Positivos de UX** | Alto | O sistema garante à interface humana que "a demanda foi criada" apenas porque o Make recebeu o disparo. Se o Supabase rejeitar a criação por erro de banco/RLS lá na frente, o usuário não sabe. | Constante, inerente ao design assíncrono atual não tratado. |
| **Race Conditions (Replay)** | Médio/Alto | Falta de Idempotency Keys permite que cliques duplicados do usuário processem o mesmo contrato múltiplas vezes, podendo corromper fluxos financeiros e CRM (Criação duplicada de Leads/Demandas). | Moderada/Alta. Falhas em UI ou re-disparos manuais de clientes lentos. |
