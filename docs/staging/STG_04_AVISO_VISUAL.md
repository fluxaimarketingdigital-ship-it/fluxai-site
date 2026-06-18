# STG-04: GATE 12 — AVISO VISUAL DE STAGING

Foi incluído no núcleo de configuração (`os/config/os-config.js`) um bloco DOM estático que insere um Badge visual (`STG — AMBIENTE DE STAGING`) na página web. 
* Ele só é acionado se a variável de ambiente detectar `STAGING`. 
* Trata-se de injeção em `<div style="position:fixed;top:0;left:0;width:100%;background:red;...>` e não depende de CSS externo nem corre risco de ser suprimido silenciosamente.
