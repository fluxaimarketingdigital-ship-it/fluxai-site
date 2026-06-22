# STG-07: GATE 9 — CONTRATO DE RESPOSTA TEMPORÁRIO

O Fake Success (aceitar tudo como "OK") foi dissolvido.
O Proxy agora mapeia a submissão com os seguintes status temporários (Até a implantação final de transacionalidade):
* `rejected`: Falha de Auth, Role ou Schema JSON.
* `blocked`: Timeout Proibido ou Bypass Attempted.
* `accepted`: O proxy enfileirou com sucesso para o Destino Mock.
* `failed`: O Mock Destino acusou Crash explícito no Repasse (Erro 500 Interno).

Em NENHUM MOMENTO o Proxy devolverá estado `completed` antes de ouvir a confirmação resoluta de final da fila, sanando a síndrome do "Spinner Verde com Tarefa Morta".
