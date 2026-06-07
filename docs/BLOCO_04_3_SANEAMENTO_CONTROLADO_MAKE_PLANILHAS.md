# Bloco 4.3 — Saneamento Controlado Make + Planilhas

Status: EM PLANEJAMENTO  
Origem: Bloco 4.1 — Auditoria Planilhas + Bloco 4.2 — Auditoria Make  
Data de abertura: 07/06/2026

## 1. Objetivo

Consolidar um plano seguro de correção e organização entre Make, Google Sheets, Supabase e FluxAI OS™, sem executar mudanças imediatas.

Este bloco existe para transformar as ressalvas P1 identificadas na auditoria em um plano de ação ordenado, evitando correções impulsivas que possam quebrar automações, dados ou fluxos já homologados.

## 2. Regra central

NÃO executar mudanças técnicas ainda.

Não alterar:
- Cenários Make ativos
- Webhooks
- Conexões
- Tokens
- RLS
- Supabase
- Estrutura de abas
- Nomes de abas
- Mapeamentos de produção
- Código do FluxAI OS™

Este bloco é apenas de saneamento estratégico, decisão e preparação.

## 3. Contexto herdado

### Bloco 4.1 — Planilhas

A planilha FluxAI_Intelligence_Base_Ecossistema_Make foi auditada e classificada.

Resultado:
- 22 abas Core classificadas como MANTER
- 15 abas auxiliares classificadas como REVISAR_NO_BLOCO_4_2
- 6 abas documentais classificadas como OCULTAR_DEPOIS
- 1 aba CONFIG classificada como REVISAR
- 0 abas autorizadas para exclusão

Nenhuma aba deve ser excluída sem validação cruzada com Make.

### Bloco 4.2 — Make

Foram auditados cenários operacionais principais e complementares.

Resultado:
- Diversas abas antes classificadas como revisão passaram para MANTER por dependência real do Make.
- Foram identificados cenários que gravam apenas Google Sheets.
- Foram identificadas possíveis duplicidades por reenvio de webhook.
- Foram identificados riscos de desalinhamento de coluna A visual.
- Foram encontrados cenários backup/legado na pasta 99_ARQUIVO_BACKUPS_ANTIGOS.

## 4. Decisão estratégica deste bloco

O saneamento será dividido em 7 frentes.

1. Validação de desalinhamento da coluna A visual.
2. Definição de quais fluxos precisam sincronizar também com Supabase.
3. Padronização dos nomes oficiais dos cenários Make.
4. Separação entre cenários ativos, complementares, legados e backups.
5. Prevenção de duplicidade por ID operacional.
6. Revisão da sobreposição entre cenário 10 e cenário 12.
7. Plano de rotação de tokens sensíveis.

## 5. Frente 01 — Desalinhamento da coluna A visual

### Problema

Em alguns cenários, a auditoria identificou o seguinte padrão:

- Metadata da planilha mostra coluna A como “▌”
- Mapper do Make grava o ID principal no índice 0

Isso pode causar deslocamento de dados, campos fora da coluna correta e inconsistência visual na planilha.

### Cenários impactados

- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG
- 18_FLUXAI_LEADS_CLIENTES

### Abas impactadas

- CLIENTES_ARQUIVOS
- PLANEJAMENTO_CONTEUDO
- CALENDARIO_POSTAGENS
- GPT_GERACOES_LOG
- LEADS_CLIENTES

### Ação planejada

Antes de qualquer correção:
1. Abrir cada aba no Google Sheets.
2. Verificar se a coluna A está realmente vazia, simbólica ou estrutural.
3. Confirmar se os dados atuais estão deslocados.
4. Registrar evidência visual.
5. Só depois decidir entre:
   - manter como está;
   - remover coluna vazia;
   - ajustar mapper no Make;
   - recriar cabeçalho limpo.

### Decisão atual

Status: PENDENTE DE VALIDAÇÃO VISUAL  
Ação: NÃO CORRIGIR AINDA

## 6. Frente 02 — Sincronização Supabase

### Problema

Muitos cenários gravam apenas no Google Sheets.

Isso é aceitável para histórico operacional, mas insuficiente se o Cockpit, Portal do Cliente ou camada executiva precisarem consultar esses dados em tempo real.

### Cenários que gravam apenas Sheets e podem precisar de Supabase

- 01_FLUXAI_PORTAL_DEMANDAS
- 02_FLUXAI_LEADS_SITE
- 05_FLUXAI_DAILY_SYNC
- 06_FLUXAI_META_SYNC
- 07_FLUXAI_RELATORIO_MENSAL
- 08_FLUXAI_CLIENT_STATUS_MONITOR
- 09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO
- 11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL
- 12_FLUXAI_SERVICO_EXTRA_APROVACAO
- 13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG
- 18_FLUXAI_LEADS_CLIENTES

### Critério de decisão

Nem tudo precisa ir para Supabase.

Enviar para Supabase apenas quando o dado precisar ser lido por:
- Cockpit
- Portal do Cliente
- Dashboard interno
- Camada executiva
- API GPT
- Governança de IA
- Relatórios dinâmicos

Manter somente no Sheets quando o dado for:
- histórico bruto
- log de apoio
- dado manual
- backup operacional
- base de consulta eventual

### Decisão atual

Status: MAPEAR PRIORIDADE  
Ação: CLASSIFICAR CENÁRIO POR CENÁRIO

## 7. Frente 03 — Padronização de nomes dos cenários Make

### Problema

A auditoria encontrou divergência entre a nomenclatura esperada e os cenários reais.

Exemplos:
- 12_FLUXAI_IA_ENTREGAS não foi encontrado exatamente como previsto.
- 14_FLUXAI_PORTAL_DEMANDAS_ATUALIZA não foi encontrado exatamente como previsto.
- Foram encontrados cenários complementares com nomes diferentes, como arquivos, planejamento, calendário e leads clientes.

### Ação planejada

Criar uma tabela de nomenclatura oficial:

| Nome atual | Nome oficial proposto | Tipo | Status | Observação |
|---|---|---|---|---|
| A preencher | A preencher | Ativo/Complementar/Backup | A preencher | A preencher |

### Decisão atual

Status: PENDENTE  
Ação: NÃO RENOMEAR AINDA

## 8. Frente 04 — Separação de cenários ativos, complementares, legados e backups

### Classificação desejada

#### Ativo
Cenário operacional usado no fluxo atual.

#### Complementar
Cenário útil, mas não essencial ao fluxo primário.

#### Legado
Cenário antigo, substituído ou sem uso atual.

#### Backup
Cenário preservado apenas para histórico ou contingência.

### Pasta identificada

Foram encontrados cenários na pasta:

`99_ARQUIVO_BACKUPS_ANTIGOS`

### Decisão atual

Backups:
- Não ativar
- Não apagar
- Não usar como fonte principal
- Manter documentado até encerramento da auditoria

## 9. Frente 05 — Prevenção de duplicidade por ID operacional

### Problema

Vários cenários usam Google Sheets Add Row. Isso pode duplicar registros se o mesmo webhook for reenviado.

### Risco

Duplicidade em:
- demandas
- leads
- serviços extras
- créditos IA
- logs GPT
- calendário
- planejamento
- arquivos
- relatórios

### Ação futura

Definir estratégia por cenário:
1. Add Row simples
2. Search Row antes de Add Row
3. Update Row se ID já existir
4. Upsert no Supabase
5. Chave única por ID operacional

### Decisão atual

Status: PENDENTE  
Ação: MAPEAR CENÁRIO POR CENÁRIO

## 10. Frente 06 — Sobreposição entre cenário 10 e cenário 12

### Problema

Os cenários 10 e 12 parecem tocar temas próximos:

- serviço extra
- aprovação
- financeiro
- demanda
- comunicação
- crédito IA

### Cenários envolvidos

- 10_FLUXAI_SERVICO_EXTRA_REQUEST
- 12_FLUXAI_SERVICO_EXTRA_APROVACAO

### Risco

Dois cenários podem registrar dados parecidos ou gerar crédito IA duplicado, caso ambos sejam acionados em momentos próximos sem regra clara.

### Decisão a tomar

Definir um modelo oficial:

Opção A:
- Cenário 10 = fluxo completo de solicitação + aprovação
- Cenário 12 = descontinuar ou manter como legado

Opção B:
- Cenário 10 = solicitação inicial
- Cenário 12 = aprovação final

Opção C:
- Cenário 10 = fluxo interno
- Cenário 12 = fluxo vindo do portal do cliente

### Decisão atual

Status: PENDENTE  
Ação: VALIDAR PAYLOADS E MÓDULOS ANTES DE DECIDIR

## 11. Frente 07 — Tokens sensíveis

### Problema

A auditoria identificou risco de exposição ou hardcoding de tokens sensíveis em blueprints e integrações.

### Cenários impactados

- 05_FLUXAI_DAILY_SYNC
- 06_FLUXAI_META_SYNC

### Ação futura

Após a auditoria:
1. Rotacionar tokens sensíveis.
2. Substituir tokens diretos por conexões seguras no Make.
3. Validar se os tokens aparecem em blueprints exportados.
4. Remover qualquer cópia insegura de documentação.

### Decisão atual

Status: PENDENTE  
Ação: NÃO ROTACIONAR AGORA

## 12. Matriz de decisão do Bloco 4.3

| Frente | Status | Prioridade | Executar agora? |
|---|---|---|---|
| Coluna A visual | Pendente | P1 | Não |
| Supabase por cenário | Pendente | P1 | Não |
| Nomes oficiais Make | Pendente | P2 | Não |
| Ativos vs backups | Pendente | P1 | Não |
| Duplicidade por ID | Pendente | P1 | Não |
| Cenário 10 vs 12 | Pendente | P1 | Não |
| Tokens sensíveis | Pendente | P1 Segurança | Não |

## 13. Próxima ação operacional

Antes de executar qualquer mudança, a próxima etapa será criar uma tabela de saneamento cenário por cenário:

| Cenário | Aba principal | Problema encontrado | Correção recomendada | Risco | Prioridade | Pode executar? |
|---|---|---|---|---|---|---|

## 14. Decisão final de abertura

O Bloco 4.3 está aberto como plano de saneamento controlado.

Nenhuma correção está autorizada ainda.

A próxima etapa será preencher a matriz de saneamento e aprovar a ordem de execução.

Fim do documento.
