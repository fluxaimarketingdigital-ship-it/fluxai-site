# Políticas de Segurança (RLS): FluxAI OS™

Segurança de dados implementada diretamente na camada de banco de dados do Supabase.

## Políticas por Tabela

### `leads`
- **ADMIN**: Acesso total (Read/Write).
- **OPERATOR**: Acesso total (Read/Write).
- **CLIENT**: `select` onde `metadata->>'client_id' = auth.uid()`.

### `approvals`
- **ADMIN**: Acesso total.
- **OPERATOR**: `select` e `insert`. `update` apenas se status não for 'APPROVED' (auditoria).
- **CLIENT**: Sem acesso.

### `audit_logs`
- **ADMIN**: `select`.
- **SYSTEM**: `insert` (Append-only).
- **OUTROS**: Sem acesso de leitura.
