# STG-02: POLÍTICA DE DADOS DE TESTE

## 9.1 Diretriz Geral
* O ambiente de Staging operará **exclusivamente com dados sintéticos ou irreversivelmente anonimizados**.
* Fica proibida a clonagem da tabela `users`, `governance_users` ou `FINANCEIRO_CLIENTES` de PROD para STG.
* Nenhuma comunicação externa (e-mail, WhatsApp) poderá conter destinos reais. Use domínios como `@example.com` ou interceptadores de e-mail (ex: Mailtrap).

## 9.2 Entidades Mínimas de Staging (Lista Seed)
A base de staging deverá ser semeada ("seeded") com as seguintes personas exatas:

1. `STG_ADMIN`: `admin@fluxai.test` (Role: ADMIN, Acesso global)
2. `STG_OP`: `operator@fluxai.test` (Role: OPERATOR, Acesso interno)
3. `STG_CLIENT_A`: `clientA@example.com` (Role: CLIENT, Atrelado a `STG_CLIENTE_A_001`)
4. `STG_CLIENT_B`: `clientB@example.com` (Role: CLIENT, Atrelado a `STG_CLIENTE_B_002`)
5. `STG_NO_ACCESS`: `blocked@example.com` (Role: CLIENT, desativado/sem contrato)
6. `STG_MULTI`: `multi@example.com` (Role: CLIENT, Atrelado a Cliente A e B simultaneamente)

## 9.3 Registros Operacionais Sintéticos
* 1 Registro Financeiro `STG_FIN_001` (Valor R$ 10,00, PENDENTE).
* 1 Serviço Extra Fictício `STG_EXTRA_001` (Aguardando Aprovação).
* 1 Demanda Fictícia `STG_DEM_001`.
* 1 Transação Concluída (`completed`), 1 Falha (`failed`), 1 Parcial (`processing`).
