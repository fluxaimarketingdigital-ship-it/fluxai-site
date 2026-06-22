# STG-06: GATE 7, 8, 9, 10, E 11 — BATERIA MESTRA DE TESTES RLS/RBAC

## Testes por Identidade (Gate 7)
* Conta Sem Acesso tentou ler leads: FALHA (Access Denied).
* ADMIN tentou ler leads: SUCESSO.
* Operador tentou promover conta via Admin panel API: FALHA.

## Testes de Acesso Cruzado (Gate 8)
* CLIENT A tentou ler dados atrelados a CLIENT B: FALHA. (Restringido via User ID).
* Qualquer tentativa lateral foi ceifada antes do frontend renderizar o Payload.

## Testes de Payload (Gate 9)
* Token forjado enviando no body `{"role":"ADMIN"}` no Fetch Supabase foi solenemente ignorado pelo backend, visto que a função `current_user_role(auth.uid())` busca o Auth seguro.

## CRUD Legítimo (Gate 10)
* Admin Update Role: SUCESSO.

## Testes Frontend (Gate 11)
* As respostas "Accepted" falsas sumiram nos testes simulados de UI, porque o Request Backend falhou antecipadamente (Status 401/403 real do PostgreSQL Row Level).
