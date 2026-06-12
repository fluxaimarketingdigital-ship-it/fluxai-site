# Checkpoint Técnico da Fase 2A — Onboarding Seguro em Rascunho

## 1. Cenário Testado
`09_FLUXAI_NOVO_CLIENTE_ONBOARDING_FASE_2A_RASCUNHO`

## 2. Status
Homologado tecnicamente em ambiente de cópia.

## 3. Cliente Fake Usado
* **ID:** `BETA_ENTERPRISES_TESTE_2026_06_001`
* **Nome:** Beta Enterprises Teste

## 4. Abas Gravadas com Sucesso
- `01_CLIENTES_ESTRATEGIA`
- `04_CLIENTES_CONFIG`
- `03_SERVICOS_CLIENTES`
- `02_CONTRATOS_CLIENTES`
- `11_DNA_CLIENTE_GPT`
- `CLIENTES_ARQUIVOS`

## 5. Resultado da Verificação Automática
- `abas_verificadas`: 6
- `abas_com_registro`: 6
- `abas_sem_registro`: 0
- `abas_com_conflito`: 0
- `duplicidades_encontradas`: 0

## 6. Teste de Duplicidade
O mesmo `client_id` foi enviado novamente. O cenário caiu na esteira `RESPONSE_409_CLIENTE_DUPLICADO`. Os módulos "Add Row" não executaram. Nenhuma nova linha foi criada, atestando o funcionamento da trava de segurança.

## 7. Regras Confirmadas
- Cliente nasce como `em_onboarding`
- Contrato nasce como `rascunho`
- Serviço nasce como `inativo`
- DNA nasce como `pendente_revisao`
- IA permanece **bloqueada**
- Auth **não** é criado
- Supabase **não** é acionado
- Cliente duplicado **não** atualiza registro existente
- Cliente duplicado retorna **409**

## 8. Pendências antes da Produção Oficial
- Confirmar/corrigir encoding UTF-8 para acentos
- Rotacionar webhook antes de uso oficial, pois a URL atual apareceu em print e histórico
- Decidir troca da `ROTA_OS_09_ONBOARDING` para o webhook novo
- Manter cenário antigo como backup/rollback
- Remover ou manter linhas do cliente fake conforme decisão operacional

## 9. Decisão
**Fase 2A aprovada tecnicamente em cópia.**
Produção oficial ainda bloqueada até troca controlada da rota/proxy.
