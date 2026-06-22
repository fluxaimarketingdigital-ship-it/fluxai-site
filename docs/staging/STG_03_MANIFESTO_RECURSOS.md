# STG-03: MANIFESTO DE RECURSOS (STAGING)

| Tipo | Nome Proposto | Ambiente | Provedor | Responsável | Compartilhado? | Risco Cruzamento | Prevenção | Rollback | Status Prontidão |
|---|---|---|---|---|---|---|---|---|---|
| Branch | `staging` | Vercel Preview | GitHub | Engenharia | Código-Fonte | Baixo | Proteção Branch | Git Delete | Aprovado |
| Supabase | `FluxAI_OS_Staging` | STG | Supabase | Engenharia | NÃO | Crítico | Chaves Dinâmicas | Deletar Projeto | Aprovado |
| Make Dir | `[STG] FluxAI OS` | STG | Make | Operações | Conta | Crítico | Webhooks STG | Deletar Pasta | Aprovado |
| DB Schema| N/A | STG | Supabase | Engenharia | NÃO | Alto | Script isolado | Drop Schema | Aprovado |
| Planilha | `[STG] Base Operacional`| STG | Google | Operações | NÃO | Crítico | Aba Exclusiva | Apagar File | Aprovado |
| Drive | `[STG] Drive OS` | STG | Google | Operações | NÃO | Médio | Share Desligado | Apagar Folder | Aprovado |

*Nota:* O recurso "Edge Function" (Proxy) compartilhará o repositório (`api/make-proxy.js`), mas rodará de forma instanciada pelo Preview Environment da Vercel.
