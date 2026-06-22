# STG-08: GATE 4 — BUSINESS_ID

Para a Rota de `onboarding_cliente`, o `business_id` estipulado é o CNPJ (Normalizado: removidos pontos e barras).
* Isso significa que se uma transação falhar (Timeout/Unknown), os logs permitirão encontrar a transação "Presa" agrupando a busca pelo Business_ID e pelo Client_ID, desfazendo amarras na auditoria.
* **Validação:** Não substitui Autenticação. É apenas uma chave relacional na Tabela Mestra de Transações.
