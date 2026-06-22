# STG-04: GATE 5 E 6 — REFERÊNCIAS REMOVIDAS E BYPASS BLOQUEADO

## Ações no `os/services/makeClient.js`
* **Remoção de Bypass (Gate 6):** As linhas 58 a 65, que permitiam o `fetch` direto (fallback para Make sem proxy) foram substituídas por um `throw new Error` de segurança.
* **Teste:** Se uma configuração antiga ainda apontar `use_proxy: false`, a operação falha localmente no frontend, exigindo correção de arquitetura (Fail-Closed).

## Ações no `os/config/os-config.js`
* A URL fixa `mufgwetfhfhhmhowbhjj` foi desvinculada, passando a ler do objeto `window.FLUXAI_ENV` (que é gerado estaticamente em build ou inserido via proxy HTML).
* O comportamento transacional preservou a aceitação do objeto de resposta JSON atual (para manter os 24 cenários funcionando localmente na branch de STG), porém limitando a exposição da base de Produção.

*Nota:* Conforme regras, ocorrências de IDs reais em documentação histórica ou backups não foram mascaradas para não quebrar hashes antigos. Apenas código ativo foi isolado.
