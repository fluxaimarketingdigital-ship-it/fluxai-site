# STG-06: GATE 5 — PROTEÇÃO DA GOVERNANÇA

* **Autoelevação:** Um usuário Client tentar emitir `UPDATE profiles SET role = 'ADMIN'` resultará no erro de permission denied proveniente do Postgres RLS, dado que a Policy de update em `profiles` exige previamente que `current_user_role() == 'ADMIN'`.
* **Proteção Cliente cruzado:** O escopo de visibilidade é travado horizontalmente (Staging não tem Múltiplos Clientes no momento, mas suporta estruturalmente a segregação).
