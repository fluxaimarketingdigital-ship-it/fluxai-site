# INVENTÁRIO DO STG-08

## Transações e Eventos
- `transactions`: Tabela principal homologada com estados restritos.
- `transaction_events`: Tabela de histórico em formato append-only.

## Identificadores
- `transaction_id`, `correlation_id`, `business_id` em propagação ativa pelo Proxy.

## Controle de Acesso e Proxy
- RLS do STG-08 configurado com base nas rotas.
- Endpoint de status operando sob autenticação.
- O Frontend não possui poder de ditar sucesso final (`completed`); este estado é privativo da matriz transacional e dependências lógicas.
