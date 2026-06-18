# STG-03: PLANO DE ROLLBACK DA MATERIALIZAÇÃO

Caso a materialização futura de Staging demande reversão por instabilidade ou cruzamento acidental:

1. **Vercel Preview:** Deletar a branch `staging` via CLI/GitHub (`git push origin --delete staging`). O Vercel imediatamente desativa o domínio Preview (`stg.fluxaidigital...`) e invalida os caches.
2. **Supabase B:** Deletar o projeto "FluxAI_OS_Staging" via painel/CLI da Supabase. Todos os dados sintéticos, tokens Auth em cache web, functions e policies de teste são obliterados sem traço residual na conta.
3. **Make (Staging Folder):** Apagar inteiramente a pasta `[STG] FluxAI OS` e deletar manualmente os webhooks `*_stg` na camada de Integrações da conta. Nenhum cenário legado ou os 24 originais sofrem interrupção.
4. **Google Workspace:** Deletar o arquivo `[STG] Base Operacional` e a pasta `[STG] Drive FluxAI OS`.
5. **Comunicação Frontend:** Não aplicável, a UI de Produção roda vinculada à branch `main` que não contém os commits do preview.
