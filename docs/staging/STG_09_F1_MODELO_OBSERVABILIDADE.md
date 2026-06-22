# MODELO DE OBSERVABILIDADE - STG-09

A observabilidade do FluxAI OS™ divide-se em 4 níveis hierárquicos e imutáveis.

## Nível 1 — Requisição
Monitora a fronteira de entrada (Frontend e Proxy):
- Entrada de rede.
- Autenticação e decodificação do JWT.
- Autorização (Allowlist/Rota).
- Validação estrutural de Payload.
- Aceite (HTTP 202) ou Rejeição (HTTP 4xx/5xx).

## Nível 2 — Transação
Monitora a mudança de estado na tabela `transactions`:
- Estado atual e transições via `transaction_events`.
- Quantidade de tentativas e retries seguros.
- Duração da persistência e do processamento.
- Desfechos de conclusão, bloqueio ou falha.

## Nível 3 — Etapas
Monitora a comunicação intrassistêmica:
- Sistema de origem (`source_system`).
- Sistema de destino (`target_system`, Ex: Make ou Mock).
- Duração da comunicação e timeout.
- Compensação em caso de interrupção ou falha em terceiros.

## Nível 4 — Sistema
Monitora a estabilidade operacional macro:
- Healthchecks cruzados.
- Latência do Proxy.
- Taxa de transações paradas (`unknown` ou timeout estendido).
- Divergências apontadas pelas `reconciliation_runs`.
