# STG-04: GATE 11 — ROLLBACK SQL

Todas as DDLs possuem scripts associados de `.down.sql` ou blocos explícitos detalhando o reverso:
1. Para exclusão de RLS e Policies.
2. `DROP SCHEMA public CASCADE` para reset radical na etapa de criação do ambiente novo.
3. Não declara reversibilidade "soft" sem atestar o expurgo dos Seeds para não sujar o namespace.
