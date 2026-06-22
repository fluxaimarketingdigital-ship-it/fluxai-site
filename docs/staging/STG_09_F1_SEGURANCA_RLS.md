# SEGURANÇA E RLS - STG-09

As policies de observabilidade seguirão um padrão `FAIL-CLOSED`.

## Políticas de RLS
- **system_logs:** Bloqueio de DELETE e UPDATE. Permissão de INSERT estritamente concedida via functions autorizadas ou Roles server-side do Proxy. Leitura autorizada apenas para roles `admin` ou `service_role`.
- **operational_incidents:** UPDATE permitido apenas para transição de estados (`status`) e por usuários de governança.
- O Frontend não terá acesso de leitura às tabelas de auditoria (evitando exposição de logs e erros sistêmicos).
- Ficam explicitamente banidas regras como `USING (true)` e concessões amplas a `authenticated`.
