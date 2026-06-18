# STG-04B: GATE 4 — MANIFESTO DO COMMIT

Este manifesto blinda a entrada do `git commit`, permitindo estritamente os artefatos a seguir:

### Código Executável (STG-04 Core)
* `os/config/os-config.js`
* `os/services/makeClient.js`

### Banco Local (DDLs)
* `supabase/migrations/20260618000001_base_schema.sql`
* `supabase/migrations/20260618000002_rls_patch.sql`
* `supabase/migrations/20260618000003_seeds.sql`
* `supabase/migrations/20260618999999_teardown.sql`

### Documentação Staging
* Todos os `docs/staging/*.md` produzidos no PACOTE STG-01, STG-02, STG-03, STG-04, STG-05 e STG-04B.

### Exclusões Intencionais
* Modificações antigas na raiz `docs/*.md` que flutuavam sujas no repo.
* Scripts irrelevantes em `scripts/`.
