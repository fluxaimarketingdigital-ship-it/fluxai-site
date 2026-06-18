# STG-02: CONVENÇÃO DE NOMENCLATURA

Para garantir a impossibilidade de confusão humana entre ambientes, os seguintes prefixos e sufixos são obrigatórios:

* **Vercel Branch:** `staging`
* **Vercel Domínio:** `stg.fluxaidigital.com.br` ou `staging.fluxaidigital.com.br`
* **Supabase Project Name:** `FluxAI_OS_Staging`
* **Supabase Client URL/Keys:** Pertencem unicamente a `FluxAI_OS_Staging`
* **Make Pasta Raiz:** `[STG] FluxAI OS`
* **Make Cenários:** Prefixo `[STG]` (Ex: `[STG] 01_PORTAL_DEMANDAS`)
* **Make Webhooks:** Sufixo `_stg` (Ex: `wh_demandas_stg`)
* **Google Sheets Arquivo:** `[STG] Base Operacional FluxAI OS`
* **Google Drive Pasta Raiz:** `[STG] Drive FluxAI OS`
* **Usuários/Clientes (Database):** IDs iniciados com `STG_` (Ex: `STG_FLUXAI_LABS_001`)

**Nota:** Nenhum recurso de produção deve ser renomeado. A convenção aplica-se estritamente aos novos artefatos clonados.
