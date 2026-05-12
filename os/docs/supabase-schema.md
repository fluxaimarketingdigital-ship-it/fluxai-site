# Schema do Banco de Dados: FluxAI OS™ (Supabase)

Este documento reflete a estrutura real das tabelas no Supabase para a Fase 3.

## Tabelas Principais

### `profiles`
Controle de identidade vinculado ao Supabase Auth.
- `id`: uuid (PK)
- `email`: text
- `full_name`: text
- `role`: enum ('ADMIN', 'OPERATOR', 'CLIENT')

### `leads`
Base operacional de oportunidades e contas.
- `id`: uuid (PK)
- `name`: text
- `company`: text
- `status`: text
- `health`: text
- `metadata`: jsonb

### `approvals`
Fila de governança.
- `id`: uuid (PK)
- `target_id`: uuid
- `status`: text
- `priority`: text

### `audit_logs`
Trilha de auditoria técnica e operacional.
- `id`: uuid (PK)
- `user_id`: uuid
- `action`: text
- `module`: text
- `metadata`: jsonb
