# STG-08: GATE 17, 18, 19, 20 E 21 — BATERIA DE TESTES TRANSACIONAIS

### Idempotência (Gate 17)
* Teste de "Clique Duplo": Segundo clique retorna Erro 409 `IDEMPOTENCY_CONFLICT` pelo Proxy, visto que a chave primária foi travada no microsegundo do primeiro insert. Nenhuma duplicata vaza para o adapter.

### Máquina de Estados (Gate 18)
* Update manual no Supabase de `rejected` para `completed`: FALHOU (Rejeitado por Trigger DB que valida lógicas da FSM).

### Endpoint Status (Gate 19)
* GET `/api/transactions/123`: SUCESSO (Retornou apenas meta-dados, blindando Payload Data Pessoal).

### Falso Sucesso (Gate 20)
* O Teste Crucial: O Adapter Mock retornou 200 OK mas respondeu json `{"status": "accepted"}`. O Frontend exibiu APENAS tela de processamento. A falsa segurança (Spinner que conclui sem garantir execução no Make) foi aniquilada. O React Component está vacinado.

### Segurança (Gate 21)
* Alteração de Payload Hash no meio do tráfego: Detectado na re-verificação antes do persist. Transação classificada como `rejected`. JWT de outro ambiente barrou a solicitação na porta.
