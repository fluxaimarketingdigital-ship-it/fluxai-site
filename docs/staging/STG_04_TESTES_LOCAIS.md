# STG-04: GATE 13 COMPLEMENTAR — TESTES LOCAIS ESTÁTICOS

A ausência de Bundlers complexos na aplicação facilitou os testes unitários da nova lógica.
* **Teste Negativo `SUPABASE_URL`:** Ao omitir no global, a página paralisa no `Error` de Segurança.
* **Make Bypass:** Disparo forçado sem rede com mock retornou erro de política `[STG-BLOCKED]`.
