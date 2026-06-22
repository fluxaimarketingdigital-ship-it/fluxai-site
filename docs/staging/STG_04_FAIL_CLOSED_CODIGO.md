# STG-04: GATE 4 — FAIL-CLOSED IMPLEMENTADO NO CÓDIGO

## Mecanismo de Assertions

Foi inserida uma barreira (Assertion Block) no momento da carga do `os/config/os-config.js` (ou logo antes de seu uso).

### Gatilhos de Interrupção
1. Ausência do objeto `window.FLUXAI_ENV`.
2. `SUPABASE_URL` igual a `https://mufgwetfhfhhmhowbhjj.supabase.co` ou contendo o ref `mufgwetfhfhhmhowbhjj` enquanto o ambiente for `staging`.
3. Variáveis chaves ausentes ou nulas.
4. `ALLOW_MAKE_DISPATCH` marcado como `true` no contexto de staging (preventivo).

### Comportamento (Ação)
* Se os gatilhos dispararem, a aplicação aborta a inicialização jogando um `Error` explícito e travando a renderização visual com um `document.body.innerHTML = '<h1>Falha de Segurança: Ambiente Inválido</h1>'` (ou similar) impedindo uso.
* Nenhuma requisição à rede será acionada até que estas validações preliminares ocorram com sucesso.
