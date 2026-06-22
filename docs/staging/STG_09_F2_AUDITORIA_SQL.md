# AUDITORIA SQL (FASE 2)

## Constraints e Variáveis Sensíveis
A auditoria atesta que nas migrations geradas (`007`, `008`, `009`):
- **Não há `USING (true)`** ou `WITH CHECK (true)` em nenhuma política.
- **Não há concessão genérica de permissões** a `public` ou `anon`. Pelo contrário, comandos de `REVOKE ALL` explícitos foram lançados para garantir bloqueio base.
- **Nenhum Segredo, Token ou JWT** transitam nos esquemas base.
- **Sem deleções autônomas**: A Event Store e tabelas de incidentes não permitem `DELETE` por usuários via RLS (apenas false).
