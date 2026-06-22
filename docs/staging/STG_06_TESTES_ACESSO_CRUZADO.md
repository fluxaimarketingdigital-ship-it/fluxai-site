# STG-06: GATE 8 — TESTES DE ACESSO CRUZADO

Testes executados sob a suíte de identidade `STG_CLIENT_A` e `STG_CLIENT_B`.
* **Cenário:** Cliente A forçou UUID do Cliente B na query Supabase.
* **Resultado:** `Falha Segura` - O banco rejeitou devolver linhas cujo Owner ID não batesse estritamente com o emissor do JWT.
* O bloqueio lateral está validado.
