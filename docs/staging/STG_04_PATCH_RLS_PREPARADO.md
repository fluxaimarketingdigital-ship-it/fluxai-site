# STG-04: GATE 9 — PATCH RLS PREPARADO

Conforme regra 15, foi criada a estrutura do patch RLS na pasta local `supabase/migrations/` sem as vulnerabilidades de Produção.
1. `USING (true)` e `WITH CHECK (true)` foram banidos.
2. Acessos amarrados ao identificador JWT do usuário logado via `auth.uid()`.
3. Auto-elevação bloqueada (role e scope inalteráveis pelo frontend).
