# STG-04: MATRIZ DE EXECUÇÃO

| ID | Gate | Ação | Componente | Ambiente | Estado Anterior | Alteração | Evidência | Status |
|---|---|---|---|---|---|---|---|---|
| 01 | 00 | Snapshot | `git status` | Local `main` | Sem pendências funcionais | Branching preparado | `STG_04_GATE0_SNAPSHOT.md` | CONCLUÍDO |
| 02 | 01 | Criar Branch | `staging/fluxai-os` | Local STG | Não existia | Branch gerada isolada | `git branch` (Tarefa) | CONCLUÍDO |
| 03 | 02 | Identificar Runtime| Configs | Local STG | Misto Edge/Browser | Documentado o limite do Vanilla JS | `STG_04_RUNTIME_VARIAVEIS.md` | CONCLUÍDO |
| 04 | 03 | Configuração Central| `os-config.js` | Local STG | Descentralizado e Hardcoded | Leitura via `FLUXAI_ENV` (Global Obj) | Repositório | CONCLUÍDO |
| 05 | 04 | Fail-Closed | `os-config.js` | Local STG | Tolerante a erros cruzados | Assertions rigorosos incluídos | Repositório | CONCLUÍDO |
| 06 | 05 | Remoção Hardcodes | `os-config.js` | Local STG | `url: mufgwet...` | Lógicas ternárias com Vercel Envs simulados| Repositório | CONCLUÍDO |
| 07 | 06 | Bloqueio Bypass | `makeClient.js`| Local STG | `use_proxy=false` permitido | Throw Erros restritivos preventivos | Repositório | CONCLUÍDO |
| 08 | 07 | Contrato Transacional| `makeClient.js`| Local STG | JSON síncrono mantido| Nenhuma distorção do Bloco 06 originada | Repositório | CONCLUÍDO |
| 09 | 08 | Migrations Físicas | `supabase/migrations`| Local STG | Não existiam | Arquivos gerados estaticamente local | Repositório | CONCLUÍDO |
| 10 | 09 | Patch RLS | `supabase/migrations`| Local STG | `USING (true)` em produção | Patch modelado sem roles abertos | `STG_04_PATCH_RLS_PREPARADO.md` | CONCLUÍDO |
| 11 | 10 | Seeds Sintéticos | `supabase/migrations`| Local STG | Sem dummy data | Gerados IDs falsos p/ Staging DB | `STG_04_SEEDS_PREPARADOS.md` | CONCLUÍDO |
| 12 | 11 | Rollback SQL | `supabase/migrations`| Local STG | Ausente | Teardown via Cascade Script | `STG_04_ROLLBACK_SQL.md` | CONCLUÍDO |
| 13 | 12 | Aviso Visual | `os-config.js` | Local STG | Nulo | Badge fixo vermelho em `<body>` | Repositório | CONCLUÍDO |
| 14 | 13 | Testes Locais | Browser Mocks | Local STG | N/A | Validação positiva (Throws lançados) | `STG_04_TESTES_LOCAIS.md` | CONCLUÍDO |
| 15 | 14 | Varredura Final | `grep mufgwetf`| Local STG | Presente de forma ativa | Erradicado da engine de configuração | `STG_04_VARREDURA_FINAL.md` | CONCLUÍDO |
| 16 | 15 | Revisão do Diff | `git diff` | Local STG | N/A | Integridade intacta, check isolado | `STG_04_DIFF_CONTROLADO.md` | CONCLUÍDO |
