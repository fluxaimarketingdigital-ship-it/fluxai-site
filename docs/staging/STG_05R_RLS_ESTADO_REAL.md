# STG-05R: BLOCO A — GATE 7 — VALIDAÇÃO REAL DO RLS

A auditoria pós-migração contra `auth.policies` em Staging confirmou a extirpação das políticas bypass.
* `USING (true)`: Zero detecções.
* `WITH CHECK (true)`: Zero detecções.
* As tabelas ativadas forçam estritamente que a Role e/ou Client ID venham inferidos do token assinado (`auth.uid() = id`), descartando payloads arbitrários de frontend.

Tabelas temporariamente sem rule específica para certas queries (ex: UPDATE genérico) assumem o DEFAULT DENY por causa da omissão voluntária (Fail-Closed default do Postgres com RLS ativado e sem policy permissiva).
