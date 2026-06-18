# STG-04: GATE 10 — SEEDS SINTÉTICOS E GATE 11 — ROLLBACK

## 1. Seeds (Gate 10)
Foi preparado o arquivo `supabase/migrations/20260618000003_seeds.sql` contendo `STG_CLIENT_A`, `STG_USER_ADMIN` com UUIDs forjados (e não reais). Nenhum e-mail ou telefone real consta nestes seeds lógicos para povoar o DB Staging futuramente.

## 2. Rollback (Gate 11)
Para desfazer, foi criada a macro migration local `supabase/migrations/20260618999999_teardown.sql` que atua com a instrução de dropar o schema `public` com `CASCADE`, invalidando inteiramente os seeds e voltando o container B a zero.
