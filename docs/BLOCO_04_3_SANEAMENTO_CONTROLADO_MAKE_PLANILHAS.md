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

## 5. Validação visual da Frente 01 — Coluna A Visual

Status:
DESALINHAMENTO CONFIRMADO EM CENÁRIOS MAKE.

Resultado da validação no Google Sheets:

1. CLIENTES_ARQUIVOS
Cabeçalho real:
A = arquivo_id
B = client_id
C = client_name

Resultado:
A aba está limpa no Google Sheets, porém o cenário 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC ainda mostra mapeamento antigo/deslocado no Make.

2. PLANEJAMENTO_CONTEUDO

#### Validação Make — 15_FLUXAI_PLANEJAMENTO_CONTEUDO

Resultado:
Desalinhamento confirmado.

A aba PLANEJAMENTO_CONTEUDO está limpa no Google Sheets:
A = planejamento_id
B = client_id
C = client_name
D = mes_referencia
E = semana_referencia

Porém, o módulo Google Sheets do cenário 15 mostra schema deslocado:
[A] genérico recebe planejamento_id
planejamento_id (B) recebe client_id
client_id (C) recebe client_name
client_name (D) recebe mes_referencia
mes_referencia (E) recebe semana_referencia

Configuração observada:
- Sheet Name: PLANEJAMENTO_CONTEUDO
- Use column headers as IDs: No

Decisão:
DESALINHAMENTO CONFIRMADO.

Ação:
Não corrigir ainda. Validar os cenários 16 e 17 antes de executar correção controlada.

3. CALENDARIO_POSTAGENS

#### Validação Make — 16_FLUXAI_CALENDARIO_POSTAGENS

Resultado:
Desalinhamento confirmado.

A aba CALENDARIO_POSTAGENS está limpa no Google Sheets:
A = postagem_id
B = planejamento_id
C = client_id
D = client_name

Porém, o módulo Google Sheets do cenário 16 mostra schema deslocado:
[A] genérico recebe postagem_id
postagem_id (B) recebe planejamento_id
planejamento_id (C) recebe client_id
client_id (D) recebe client_name
client_name (E) recebe canal

Configuração observada:
- Sheet Name: CALENDARIO_POSTAGENS
- Use column headers as IDs estava como No na abertura
- Ao alternar para Yes, o schema não corrigiu automaticamente
- Não salvar alteração sem correção controlada

Decisão:
DESALINHAMENTO CONFIRMADO.

Ação:
Cancelar sem salvar. Corrigir depois por processo controlado: duplicar cenário, recarregar campos, remapear e testar com payload seguro.

4. GPT_GERACOES_LOG

#### Validação Make — 17_FLUXAI_GPT_GERACOES_LOG

Resultado:
Desalinhamento confirmado.

A aba GPT_GERACOES_LOG está limpa no cabeçalho:
A = log_id
B = geracao_id
C = client_id
D = client_name

Porém, o módulo Google Sheets do cenário 17 mostra schema deslocado:
[A] genérico recebe log_id
log_id (B) recebe geracao_id
geracao_id (C) recebe client_id
client_id (D) recebe client_name
client_name (E) recebe tipo_geracao

Configuração observada:
- Sheet Name: GPT_GERACOES_LOG
- Use column headers as IDs: No

Decisão:
DESALINHAMENTO CONFIRMADO.

Ação:
Não corrigir agora. Cancelar sem salvar. Corrigir depois por processo controlado, junto com os cenários 14, 15 e 16.
Próximo passo: criar plano de correção controlada

5. Validação visual 05 — Leads

Resultado:
A aba encontrada foi LEADS_SITE, não LEADS_CLIENTES.

Cabeçalho real da aba LEADS_SITE:
A = lead_id
B = data_entrada
C = cliente_id
D = cliente_nome
E = origem_site
F = nome_lead
G = email
H = telefone
I = empresa
J = servico_interesse
K = canal_origem
L = campanha
M = pagina_origem
N = status_lead
O = responsavel
P = observacao

Decisão:
LEADS_SITE existe, contém dados reais e deve permanecer como MANTER.

Pendência:
O cenário 18_FLUXAI_LEADS_CLIENTES aponta para uma aba chamada LEADS_CLIENTES, mas essa aba não foi localizada visualmente.

Risco:
Se LEADS_CLIENTES não existir, o cenário 18 pode estar quebrado, incompleto ou apontando para uma aba que foi removida/renomeada.

Ação Inicial:
Não criar nem alterar aba agora. Validar no Make se o cenário 18 está ativo, se já rodou alguma vez e se deve continuar existindo ou ser tratado como cenário complementar/legado.

#### Validação Make — 18_FLUXAI_LEADS_CLIENTES

Resultado:
O cenário 18_FLUXAI_LEADS_CLIENTES existe no Make, porém está desligado.

Configuração observada:
- Sheet Name: LEADS_CLIENTES
- Use column headers as IDs: No
- Status do cenário: desligado

Aba LEADS_CLIENTES:
Não localizada visualmente na planilha durante a validação.

Aba operacional real encontrada:
LEADS_SITE, com dados reais de captação do site/landing FluxAI.

Decisão Final:
Classificar 18_FLUXAI_LEADS_CLIENTES como CENÁRIO COMPLEMENTAR DESLIGADO / NÃO OPERACIONAL AGORA.

Ação Definitiva:
Não corrigir agora.
Não ativar.
Não criar aba LEADS_CLIENTES neste momento.
Manter documentado para revisão posterior na padronização de CRM/leads.

Risco Secundário:
Se for ativado sem saneamento, pode falhar por aba inexistente ou gravar em estrutura desalinhada.

## Plano de correção controlada — Frente 01

Cenários com desalinhamento confirmado:
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG

Cenário complementar desligado:
- 18_FLUXAI_LEADS_CLIENTES

Aba operacional real de leads:
- LEADS_SITE

Decisão:
A correção será feita cenário por cenário, sem alterar a planilha primeiro.

Ordem de correção:
1. 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
2. 15_FLUXAI_PLANEJAMENTO_CONTEUDO
3. 16_FLUXAI_CALENDARIO_POSTAGENS
4. 17_FLUXAI_GPT_GERACOES_LOG

Procedimento obrigatório para cada cenário:
1. Duplicar o cenário no Make antes de corrigir.
2. Manter o cenário original desligado ou sem execução durante o ajuste.
3. Abrir o módulo Google Sheets.
4. Recarregar a estrutura da aba usando Refresh.
5. Garantir que o primeiro campo exibido seja o ID real da aba:
   - arquivo_id
   - planejamento_id
   - postagem_id
   - log_id
6. Remapear campo por campo.
7. Não usar coluna [A] genérica se ela representar coluna fantasma.
8. Rodar teste com payload seguro.
9. Conferir no Google Sheets se a linha foi gravada nas colunas corretas.
10. Se aprovado, documentar evidência.
11. Só então decidir se substitui o cenário original ou mantém o corrigido como nova versão.

Critério de aprovação:
O cenário só será considerado saneado quando o ID principal cair exatamente na coluna A correta e os demais campos seguirem a ordem real do cabeçalho.

Status:
PLANO APROVADO PARA EXECUÇÃO CONTROLADA E EM ANDAMENTO.

### Execução controlada — 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC_FIX_P1

Status:
HOMOLOGADO NO CLONE.

Correção realizada:
- Clone criado a partir do cenário original.
- Módulo Google Sheets ajustado para usar cabeçalhos reais da aba.
- Use column headers as IDs of the columns = Yes.
- Campo inicial passou a ser arquivo_id (A), sem coluna [A] fantasma.
- Payload seguro enviado via webhook do clone.
- Linha gravada corretamente na aba CLIENTES_ARQUIVOS.

Evidência de gravação:
A = ARQ_TESTE_FIX_P1_001
B = FLUXAI_LABS_001
C = FluxAI Labs
D = teste_tecnico
E = Teste de correção coluna A

Decisão:
Cenário 14 corrigido e aprovado no clone.

Ação pendente:
Não substituir o original ainda. Aguardar saneamento dos cenários 15, 16 e 17 para decidir troca oficial em lote controlado.

### Execução controlada — 15_FLUXAI_PLANEJAMENTO_CONTEUDO_FIX_P1

Status:
HOMOLOGADO NO CLONE.

Correção realizada:
- Clone criado a partir do cenário original.
- Módulo Google Sheets ajustado para usar cabeçalhos reais da aba.
- Use column headers as IDs of the columns = Yes.
- Campo inicial passou a ser planejamento_id (A), sem coluna [A] fantasma.
- Payload seguro enviado via webhook do clone.
- Linha gravada corretamente na aba PLANEJAMENTO_CONTEUDO.

Evidência de gravação:
A = PLAN_TESTE_FIX_P1_001
B = FLUXAI_LABS_001
C = FluxAI Labs
D = 2026-06
E = semana_teste

Ressalva:
Validar antes da troca oficial se data_criacao e data_atualizacao estão mapeadas com formatDate(now; "YYYY-MM-DD HH:mm:ss").

Decisão:
Cenário 15 corrigido e aprovado no clone.

Ação pendente:
Não substituir o original ainda. Aguardar saneamento dos cenários 16 e 17 para decidir troca oficial em lote controlado.

### Execução controlada — 16_FLUXAI_CALENDARIO_POSTAGENS_FIX_P1

Status:
HOMOLOGADO NO CLONE.

Correção realizada:
- Clone criado a partir do cenário original.
- Módulo Google Sheets ajustado para usar cabeçalhos reais da aba.
- Use column headers as IDs of the columns = Yes.
- Campo inicial passou a ser postagem_id (A), sem coluna [A] fantasma.
- Payload seguro enviado via webhook do clone.
- Linha gravada corretamente na aba CALENDARIO_POSTAGENS.

Evidência de gravação:
A = POST_TESTE_FIX_P1_001
B = PLAN_TESTE_FIX_P1_001
C = FLUXAI_LABS_001
D = FluxAI Labs
E = instagram

Decisão:
Cenário 16 corrigido e aprovado no clone.

Ação pendente:
Não substituir o original ainda. Aguardar saneamento do cenário 17 para decidir troca oficial em lote controlado.

### Execução controlada — 17_FLUXAI_GPT_GERACOES_LOG_FIX_P1

Status:
HOMOLOGADO NO CLONE.

Correção realizada:
- Clone criado a partir do cenário original.
- Módulo Google Sheets ajustado para usar cabeçalhos reais da aba.
- Use column headers as IDs of the columns = Yes.
- Campo inicial passou a ser log_id (A), sem coluna [A] fantasma.
- O cenário foi adaptado ao schema atual da aba GPT_GERACOES_LOG, sem criação de nova aba.
- A aba GPT_GERACOES_LOG permanece como log híbrido para guardrail e execução GPT.

Evidência de gravação:
A = LOG_TESTE_FIX_P1_002
B = GER_TESTE_FIX_P1_002
C = FLUXAI_LABS_001
D = FluxAI Labs
E = 17_FLUXAI_GPT_GERACOES_LOG
F = 17_FLUXAI_GPT_GERACOES_LOG
G = execucao_gpt
H = teste_tecnico
S = teste
T = gpt-5.5
U = 100
W = Kassia
X = Payload seguro para validar o cenário 17 dentro do schema atual da aba GPT_GERACOES_LOG.
Y = 2026-06-07 21:42:56
Z = 2026-06-07 21:42:56

Decisão:
Cenário 17 corrigido e aprovado no clone.

Ação pendente:
Não substituir o original ainda. Decidir troca oficial dos clones 14, 15, 16 e 17 em lote controlado.

### Decisão final — 18_FLUXAI_LEADS_CLIENTES

Status:
EXCLUÍDO / DESCONTINUADO.

Motivo:
O cenário estava desligado, apontava para LEADS_CLIENTES e não fazia parte do fluxo operacional real atual. A captação ativa de leads permanece centralizada em LEADS_SITE, alimentada pelo cenário 02_FLUXAI_LEADS_SITE.

Decisão:
Cenário removido da operação ativa. Não será saneado nesta fase.

Impacto:
Baixo. Nenhuma dependência operacional ativa foi identificada para esse cenário.

### Virada oficial concluída — Frente 01

Status:
CONCLUÍDA E HOMOLOGADA NOS CENÁRIOS ORIGINAIS.

Cenários originais corrigidos:
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG

Correção aplicada:
- Módulos Google Sheets ajustados para usar cabeçalhos reais da planilha.
- Use column headers as IDs of the columns = Yes.
- Campo inicial validado corretamente em cada cenário:
  - 14: arquivo_id
  - 15: planejamento_id
  - 16: postagem_id
  - 17: log_id

Evidências:
14_FLUXAI_CLIENTES_ARQUIVOS_SYNC:
A = ARQ_TESTE_ORIGINAL_P1_001
B = FLUXAI_LABS_001
C = FluxAI Labs
D = teste_tecnico_original
E = Teste original cenário 14

15_FLUXAI_PLANEJAMENTO_CONTEUDO:
A = PLAN_TESTE_ORIGINAL_P1_001
B = FLUXAI_LABS_001
C = FluxAI Labs
D = 2026-06
E = semana_teste_original

16_FLUXAI_CALENDARIO_POSTAGENS:
A = POST_TESTE_ORIGINAL_P1_001
B = PLAN_TESTE_ORIGINAL_P1_001
C = FLUXAI_LABS_001
D = FluxAI Labs
E = instagram

17_FLUXAI_GPT_GERACOES_LOG:
A = LOG_TESTE_ORIGINAL_P1_001
B = GER_TESTE_ORIGINAL_P1_001
C = FLUXAI_LABS_001
D = FluxAI Labs
E = 17_FLUXAI_GPT_GERACOES_LOG
F = 17_FLUXAI_GPT_GERACOES_LOG
G = execucao_gpt
H = teste_tecnico
I = 2026-06

Decisão:
Frente 01 oficialmente homologada nos cenários originais.

Observação:
Os clones FIX_P1 podem permanecer temporariamente como backup técnico até o encerramento completo do Bloco 4.3. Não devem ficar ativos.

### Limpeza final — clones FIX_P1

Status:
CONCLUÍDA.

Clones excluídos:
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC_FIX_P1
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO_FIX_P1
- 16_FLUXAI_CALENDARIO_POSTAGENS_FIX_P1
- 17_FLUXAI_GPT_GERACOES_LOG_FIX_P1

Motivo:
Os clones foram usados exclusivamente como ambiente seguro de teste e homologação. Após a correção ser aplicada e validada nos cenários originais, os clones deixaram de ter função operacional.

Cenários preservados:
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG

Decisão:
Manter apenas os cenários originais homologados na operação ativa.

### Limpeza final das planilhas — Frente 01

Status:
CONCLUÍDA.

Ação executada:
As linhas de teste técnico criadas durante a homologação dos cenários 14, 15, 16 e 17 foram removidas das respectivas abas operacionais.

Abas saneadas:
- CLIENTES_ARQUIVOS
- PLANEJAMENTO_CONTEUDO
- CALENDARIO_POSTAGENS
- GPT_GERACOES_LOG

Critério:
Foram removidas apenas linhas de teste técnico P1. Cabeçalhos, linhas reais e estrutura das abas foram preservados.

Decisão:
Frente 01 finalizada sem resíduos operacionais nas planilhas.

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
