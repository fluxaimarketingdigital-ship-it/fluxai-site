# PLANO DE TESTE E2E: SERVIÇOS EXTRAS (ROTA 10 e 12)

**Contexto e Risco:**
O cenário `10_FLUXAI_SERVICO_EXTRA_REQUEST` inclui inserções de registro no Supabase (`upsertARecord`) e na aba financeira (`08_FINANCEIRO_CLIENTES`), além das demandas de serviços. Existe o risco real de o sistema automatizar faturamento e gerar cobranças (ou deduções de créditos de IA) antes de uma aprovação humana rigorosa (Rota 12). 

A interface atual do portal do cliente tem o botão "Solicitar Serviço Extra" apontando erroneamente para a `ROTA 01` (Demandas Normais). Isso mascara o problema, mas a Rota 10 real é de alto risco.

## Objetivos do Teste E2E:
1. Garantir que as solicitações feitas pelo Cliente (Rota 10) entrem com status `pendente_orcamento` ou `pendente_analise`.
2. Assegurar que nenhum crédito seja descontado ou fatura seja gerada automaticamente apenas na recepção da demanda.
3. Testar a Rota 12 (Aprovação), verificando se somente usuários RBAC autorizados conseguem ativar a demanda e disparar cobranças.

## Passos da Execução Futura:
1. **Correção do Frontend:** Alterar o `submitDemanda()` no arquivo `client-portal.html` de `ROTA_OS_01_PORTAL_DEMANDAS` para `ROTA_OS_10_SERVICO_EXTRA`.
2. **Payload Restrito:** Enviar um payload falso como cliente para a Rota 10 usando um `client_id` Fake isolado.
3. **Auditoria de Tabelas:** Analisar Supabase (`services_extra`) e Planilha (`06_SERVICOS_EXTRAS_CLIENTES`, `08_FINANCEIRO_CLIENTES`, `10_IA_CREDITOS_CLIENTE`). Assegurar inserção controlada.
4. **Trigger Approval:** Simular o clique de um Administrador FluxAI pela interface de governança para ativar a Rota 12, mapeando exatamente o que o Blueprint financeiro realiza.
5. **Homologação Final.**
