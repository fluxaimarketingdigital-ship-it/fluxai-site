# STG-06: GATE 4 — FUNÇÕES DE AUTORIZAÇÃO

Foram compiladas via migration `20260618000004_rbac_functions.sql`:

1. `is_active_user(user_id)`: Resolve o status ativo (se mockado em governança complexa).
2. `current_user_role(user_id)`: Interroga de forma atômica no banco `profiles` e devolve a role (ADMIN, OPERATOR, CLIENT) vinculada com segurança (`search_path = public` e `SECURITY DEFINER`).

Estas funções isolam o `WHERE` das Policies, não mais aceitando strings injetadas.
