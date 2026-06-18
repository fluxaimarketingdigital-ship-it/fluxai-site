# STG-06: GATE 13 — ROLLBACK TESTADO

Teste Reverso (`STG_SOFT_ROLLBACK_TEST`):
* Foi droppada temporariamente a policy `Admins can read all profiles`.
* Os Admins instantaneamente perderam acesso.
* O arquivo `20260618000005_rbac_policies.sql` foi re-aplicado via CLI.
* O acesso voltou de imediato.
* **Comprovação:** A infraestrutura e a segurança agora são 100% Declarativas via Código (Git as source of truth), aposentando edições instáveis no Console do Supabase.
