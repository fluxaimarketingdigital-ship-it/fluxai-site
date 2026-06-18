# STG-04B: GATE 1 — CONCILIAÇÃO DO DIFF

| Caminho | Status Git | Finalidade | Origem | Ação Esperada? | Evidência | Pode Comitar? | Decisão |
|---|---|---|---|---|---|---|---|
| `os/config/os-config.js` | Modificado | Conf Central / Fail-Closed / Badge STG | STG-04 | SIM | Repositório | SIM | Incluir explícito |
| `os/services/makeClient.js` | Modificado | Bloqueio de Bypass Proxy | STG-04 | SIM | Repositório | SIM | Incluir explícito |
| `docs/staging/STG_*.md` | Untracked | Documentação de Staging | STG-01 a 05 | SIM | Repositório | SIM | Incluir via globo `docs/staging/*` |
| `supabase/migrations/*.sql` | Untracked | Migrations Físicas, RLS, Seeds | STG-04 | SIM | Repositório | SIM | Incluir via globo `supabase/migrations/*` |
| `docs/CHECKPOINT_CENARIO...md`| Untracked | Documentação Alheia | STG-01 | NÃO | Repositório | NÃO | Manter un-staged |
| `docs/PLANO_MESTRE...md` | Modificado | Alteração de escopo prévio | Audits | NÃO | Repositório | NÃO | Manter un-staged |

Não houve alterações estranhas que afetem a engine executável. Apenas lixo documental não comitado herdado de rodadas antigas. Decisão: Apenas as partes vitais entrarão no commit.
