# MODELO DE LOGS - STG-09

A estrutura principal residirá na tabela `system_logs`.

## Padronização de Severidade
- `DEBUG`: Para fluxos internos do adapter e diagnóstico.
- `INFO`: Sucesso ou processamento sem impedimento.
- `WARNING`: Erros operacionais (timeout, rejeição estrutural) e acessos negados mas não destrutivos.
- `ERROR`: Falha no proxy, timeout grave ou recusa de persistência.
- `CRITICAL`: Acesso cruzado, RLS bypass tentativo ou corrupção de concorrência transacional.

## Regras de Imutabilidade
- Operação **append-only**. `UPDATE` e `DELETE` serão globalmente bloqueados por RLS.
- Nenhuma payload sensível será escrita integralmente. O campo `metadata_safe` será sanitizado na origem.
