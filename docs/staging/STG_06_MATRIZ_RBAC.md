# STG-06: GATE 2 — MATRIZ DE ROLES E SCOPES

### Matriz Funcional Homologada

| Role | Escopo | Capacidades Permissivas | Trava de Segurança Opcional |
|---|---|---|---|
| `ADMIN` | Global | CRUD em toda a estrutura. Altera governança. | Não altera o próprio Role para prevenir auto-bloqueio. |
| `OPERATOR`| Operacional Global | Leitura e inserção em `crm_leads`. Não exclui nem aprova. | Não pode ler ou escrever em tabelas de `profiles` de terceiros. |
| `CLIENT` | Pessoal (Owner) | Acesso exclusivo aos registros atrelados ao seu `client_id`. | Bloqueio massivo à base inteira alheia. Impede mudança de ID no payload. |
| `[Nulo/Anon]`| Nulo | Nenhuma. | Default Deny. |
