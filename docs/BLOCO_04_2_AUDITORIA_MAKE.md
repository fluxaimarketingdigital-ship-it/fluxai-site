# Bloco 4.2 — Auditoria Make (FluxAI OS)

**Objetivo:** Auditar todos os cenários Make relacionados ao ecossistema FluxAI OS para identificar dependências reais com as abas da planilha `FluxAI_Intelligence_Base_Ecossistema_Make`.

> [!CAUTION]
> **Regras Restritas de Auditoria:**
> - Não alterar cenários.
> - Não apagar módulos.
> - Não desativar nada.
> - Não alterar webhooks.
> - Não alterar planilhas.
> - Não alterar Supabase.
> - **Apenas inventariar e documentar.**

---

## 1. Contexto e Ponto de Partida (Herdado do Bloco 4.1)

Status da Auditoria de Planilhas: **HOMOLOGADO COMO INVENTÁRIO PRELIMINAR**

- **22 abas** classificadas como `MANTER`
- **15 abas** classificadas como `REVISAR_NO_BLOCO_4_2`
- **6 abas** classificadas como `OCULTAR_DEPOIS`
- **1 aba** (`CONFIG`) classificada como `REVISAR`
- **0 abas** autorizadas para exclusão.

*Critério Final:* Nenhuma aba será excluída, ocultada ou reorganizada definitivamente antes da conclusão desta Auditoria Make (4.2).

---

## 2. Inventário de Cenários Esperados

*(Os dados abaixo serão preenchidos progressivamente conforme a inspeção visual na plataforma Make.com)*

## 01_FLUXAI_PORTAL_DEMANDAS

Status: MANTER COM RESSALVA OPERACIONAL

Tipo de gatilho: Webhook

Webhook associado:
Custom Webhook — 01_FLUXAI_PROXY_DEMAND_SUBMISSION_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Search/Filter Rows
3. Google Sheets — Add Row

Abas Google Sheets lidas:
- CLIENTES_CONFIG

Abas Google Sheets escritas:
- DEMANDAS_CLIENTES

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Possível. As demandas podem ser usadas em acompanhamento operacional e camada executiva.

Dependência com Cockpit:
Indireta. O cenário grava demanda em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal do Cliente:
Sim. O cenário recebe submissões vindas do portal/fluxo de demandas.

Risco de duplicidade:
Médio. O demanda_id é gerado com data/hora até minuto. Se duas demandas forem enviadas no mesmo minuto, pode haver duplicidade.

Risco de quebra se a aba for removida:
Alto. As abas CLIENTES_CONFIG e DEMANDAS_CLIENTES não podem ser removidas.

Ressalvas:
- Validar se o Make ainda reconhece corretamente as abas após a organização com prefixos numéricos.
- O payload usa cliente_id, não client_id.
- O cenário grava somente em Google Sheets.
- Se o Cockpit depender apenas do Supabase, novas demandas podem não aparecer sem sincronização posterior.
- Responsável está fixo como FluxAI.

Decisão preliminar:
MANTER COM RESSALVA OPERACIONAL.

Ação recomendada:
Não alterar agora. Registrar pendências para etapa futura de correção controlada, após conclusão da Auditoria Make 4.2.

## 02_FLUXAI_LEADS_SITE

Status: MANTER COM RESSALVA OPERACIONAL

Tipo de gatilho:
Webhook

Webhook associado:
Custom Webhook — FLUXAI_PROXY_LEAD_CAPTURE_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Search/Filter Rows em CLIENTES_CONFIG
3. Google Sheets — Search/Filter Rows em SERVICOS_CLIENTES
4. Google Sheets — Add Row em LEADS_SITE

Abas Google Sheets lidas:
- CLIENTES_CONFIG
- SERVICOS_CLIENTES

Abas Google Sheets escritas:
- LEADS_SITE

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Possível. Leads podem ser usados em análise comercial, CRM, demanda e camada executiva.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal/Site:
Sim. O cenário recebe leads capturados pelo site/formulário/webhook.

Risco de duplicidade:
Baixo/Médio. O lead_id usa data/hora até segundos, o que reduz risco de duplicidade, mas não elimina em alto volume.

Risco de quebra se a aba for removida:
Alto. As abas CLIENTES_CONFIG, SERVICOS_CLIENTES e LEADS_SITE não podem ser removidas.

Ressalvas:
- Validar se o Make ainda reconhece corretamente as abas após a organização com prefixos numéricos.
- O payload usa cliente_id e cliente_nome, não client_id e client_name.
- O cenário grava somente em Google Sheets.
- Se o Cockpit/CRM depender apenas de Supabase, os novos leads podem não aparecer sem sincronização posterior.
- O serviço precisa estar ativo em SERVICOS_CLIENTES com servico = leads_site.

Decisão preliminar:
MANTER COM RESSALVA OPERACIONAL.

Ação recomendada:
Não alterar agora. Registrar LEADS_SITE como aba operacional ativa e retirar de qualquer lista de possível exclusão.

## 05_FLUXAI_DAILY_SYNC

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
A confirmar no painel Make. O blueprint mostra placeholder, não webhook.

Módulos usados:
1. Placeholder / gatilho interno
2. Google Sheets — Search/Filter Rows em SERVICOS_CLIENTES
3. Google Sheets — Search/Filter Rows em CLIENTES_CONFIG
4. Google Sheets — Add Row em CONSOLIDADO_DIARIO
5. HTTP — Microsoft Clarity API
6. Google Sheets — Add Row em CLARITY_DIARIO
7. Google Analytics 4 — Generate Analytics Report
8. Google Sheets — Add Row em GA4_DIARIO
9. Google Search Console — Search Analytics
10. Google Sheets — Add Row em SEARCH_CONSOLE_DIARIO

Abas Google Sheets lidas:
- SERVICOS_CLIENTES
- CLIENTES_CONFIG

Abas Google Sheets escritas:
- CONSOLIDADO_DIARIO
- CLARITY_DIARIO
- GA4_DIARIO
- SEARCH_CONSOLE_DIARIO

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Alta. O cenário alimenta métricas diárias usadas em relatório, dashboard e acompanhamento operacional.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal do Cliente:
Indireta. Pode alimentar dados posteriormente exibidos em relatórios ou visão executiva.

Risco de duplicidade:
Médio. O cenário adiciona nova linha diária, mas precisa garantir que não gere mais de uma linha por cliente/data em múltiplas execuções.

Risco de quebra se a aba for removida:
Alto. As abas SERVICOS_CLIENTES, CLIENTES_CONFIG, CONSOLIDADO_DIARIO, CLARITY_DIARIO, GA4_DIARIO e SEARCH_CONSOLE_DIARIO não podem ser removidas.

Ressalvas:
- Confirmar se o cenário está agendado, ativo ou manual.
- Validar se o Make ainda reconhece corretamente as abas após a organização com prefixos numéricos.
- O cenário grava somente em Google Sheets.
- Não há escrita Supabase.
- O módulo Clarity contém token sensível no blueprint. Rotacionar token após a auditoria e evitar token hardcoded.
- O Clarity grava fallback com observação clarity_status_200_sem_parse, indicando que o parse dos dados ainda precisa ser melhorado.
- O CONSOLIDADO_DIARIO recebe valores zerados para alguns campos e parece funcionar como consolidação base, não fechamento final completo.

Decisão preliminar:
MANTER COM RESSALVA P1.

Ação recomendada:
Não alterar agora. Registrar como cenário essencial de métricas diárias. Após a conclusão do Bloco 4.2, abrir correção controlada para segurança do token Clarity, validação de schedule, prevenção de duplicidade por cliente/data e melhoria do parse do Clarity.

## 06_FLUXAI_META_SYNC

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
A confirmar no painel Make. O blueprint mostra placeholder, não webhook.

Módulos usados:
1. Placeholder / gatilho interno
2. Google Sheets — Search/Filter Rows em ROTAS_AUTOMACOES
3. Google Sheets — Search/Filter Rows em CLIENTES_CONFIG
4. Google Sheets — Search/Filter Rows em SERVICOS_CLIENTES
5. Router de rotas Meta
6. HTTP — Meta Graph API / Instagram Profile
7. Google Sheets — Add Row em INSTAGRAM_DIARIO
8. HTTP — Meta Ads Insights
9. Router Meta Ads com dados / sem dados
10. Google Sheets — Add Row em META_ADS_DIARIO
11. HTTP — Instagram Insights
12. Google Sheets — Add Row em INSTAGRAM_DIARIO

Abas Google Sheets lidas:
- ROTAS_AUTOMACOES
- CLIENTES_CONFIG
- SERVICOS_CLIENTES

Abas Google Sheets escritas:
- INSTAGRAM_DIARIO
- META_ADS_DIARIO

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Alta. O cenário alimenta dados de Instagram API e Meta Ads usados em acompanhamento diário, consolidado e relatório mensal.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal do Cliente:
Indireta. Pode alimentar visão executiva e relatórios internos revisados pela FluxAI.

Risco de duplicidade:
Médio. O cenário pode adicionar novas linhas por execução. É necessário validar se há controle por cliente/data/rota para evitar duplicação em execuções repetidas.

Risco de quebra se a aba for removida:
Alto. As abas ROTAS_AUTOMACOES, CLIENTES_CONFIG, SERVICOS_CLIENTES, INSTAGRAM_DIARIO e META_ADS_DIARIO não podem ser removidas.

Ressalvas:
- Confirmar se o cenário está agendado, ativo ou manual.
- Validar se o Make ainda reconhece corretamente as abas após a organização com prefixos numéricos.
- O cenário usa ROTAS_AUTOMACOES corretamente como tabela de autorização.
- O cenário está limitado à FluxAI Labs, com filtro FLUXAI_LABS_001.
- O cenário grava somente em Google Sheets.
- Não há escrita Supabase.
- O blueprint contém token Meta sensível em módulos HTTP. Rotacionar token após a auditoria e remover token hardcoded.
- O módulo Meta Ads com dados precisa ser revisado, pois aparenta gravar apenas client_id e date.
- O fallback meta_ads_status_200_sem_dados existe, mas a lógica precisa distinguir data vazio de data existente.
- O mapeamento de Instagram Insights pode estar buscando índices inexistentes.

Decisão preliminar:
MANTER COM RESSALVA P1.

Ação recomendada:
Não alterar agora. Registrar como cenário essencial de Meta/Instagram. Após conclusão do Bloco 4.2, abrir correção controlada para token Meta, validação de schedule, prevenção de duplicidade, revisão do mapeamento Meta Ads e revisão do mapeamento Instagram Insights.

## 07_FLUXAI_RELATORIO_MENSAL

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
A confirmar no painel Make. O blueprint inicia com Google Sheets, sem webhook.

Módulos usados:
1. Google Sheets — Search/Filter Rows em CLIENTES_CONFIG
2. Google Sheets — Search/Filter Rows em SERVICOS_CLIENTES
3. Router de relatório mensal
4. Google Sheets — Search/Filter Rows em INSTAGRAM_DIARIO com tipo_coleta = profile
5. Google Sheets — Search/Filter Rows em INSTAGRAM_DIARIO com tipo_coleta = insights
6. Google Sheets — Add Row em ANALISE_MENSAL_CLIENTE

Abas Google Sheets lidas:
- CLIENTES_CONFIG
- SERVICOS_CLIENTES
- INSTAGRAM_DIARIO

Abas Google Sheets escritas:
- ANALISE_MENSAL_CLIENTE

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Alta. O cenário cria rascunho de análise mensal.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal do Cliente:
Indireta. O relatório gerado deve permanecer como rascunho interno para revisão estratégica antes de qualquer entrega ao cliente.

Risco de duplicidade:
Médio/Alto. O cenário adiciona nova linha mensal e precisa validar cliente_id + mes_referencia antes de gravar, para evitar duplicidade se rodar mais de uma vez.

Risco de quebra se a aba for removida:
Alto. As abas CLIENTES_CONFIG, SERVICOS_CLIENTES, INSTAGRAM_DIARIO e ANALISE_MENSAL_CLIENTE não podem ser removidas.

Ressalvas:
- Confirmar se o cenário está agendado para execução mensal.
- Validar se o Make ainda reconhece corretamente as abas após a organização com prefixos numéricos.
- O cenário grava somente em Google Sheets.
- Não há escrita Supabase.
- O cenário parece focado em Instagram da FluxAI Labs, com filtro FLUXAI_LABS_001.
- O cenário ainda não contempla claramente INSTAGRAM_MANUAL_DIARIO e INSTAGRAM_CONTEUDO_MANUAL.
- O conteúdo gerado é rascunho operacional, não relatório final de cliente.
- É necessário prevenir duplicidade por cliente_id + mes_referencia.

Decisão preliminar:
MANTER COM RESSALVA P1.

Ação recomendada:
Não alterar agora. Registrar como cenário essencial de rascunho mensal. Após conclusão do Bloco 4.2, abrir correção controlada para incluir coleta manual, prevenir duplicidade mensal, revisar leitura multi-cliente e manter relatório sem envio automático.

## 08_FLUXAI_CLIENT_STATUS_MONITOR

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
A confirmar no painel Make. O blueprint mostra placeholder, não webhook.

Módulos usados:
1. Placeholder / gatilho interno
2. Google Sheets — Search/Filter Rows em SERVICOS_CLIENTES
3. Google Sheets — Search/Filter Rows em CLIENTES_CONFIG
4. Google Sheets — Search/Filter Rows em ROTAS_AUTOMACOES
5. Router de status operacional
6. Google Sheets — Add Row em STATUS_MONITOR_DIARIO para API OK
7. Google Sheets — Add Row em STATUS_MONITOR_DIARIO para Webhook ativo
8. Google Sheets — Add Row em STATUS_MONITOR_DIARIO para Manual ativo
9. Google Sheets — Add Row em STATUS_MONITOR_DIARIO para Aguardando Autorização
10. Google Sheets — Add Row em STATUS_MONITOR_DIARIO para Rota não encontrada

Abas Google Sheets lidas:
- SERVICOS_CLIENTES
- CLIENTES_CONFIG
- ROTAS_AUTOMACOES

Abas Google Sheets escritas:
- STATUS_MONITOR_DIARIO

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Alta. O cenário monitora quais serviços estão ativos, manuais, via API, via webhook ou aguardando autorização.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal do Cliente:
Indireta. Pode sustentar status operacional interno e decisões antes de relatórios ou entregas.

Risco de duplicidade:
Médio/Alto. O cenário adiciona novas linhas por execução e pode duplicar registros se rodar mais de uma vez no dia para o mesmo cliente/serviço.

Risco de quebra se a aba for removida:
Alto. As abas SERVICOS_CLIENTES, CLIENTES_CONFIG, ROTAS_AUTOMACOES e STATUS_MONITOR_DIARIO não podem ser removidas.

Ressalvas:
- Confirmar se o cenário está agendado, ativo ou manual.
- Validar se o Make ainda reconhece corretamente as abas após a organização com prefixos numéricos.
- O cenário grava somente em Google Sheets.
- Não há escrita Supabase.
- O filtro inicial em SERVICOS_CLIENTES usa relatorio_incluir = sim, mas não filtra status_servico = ativo logo na primeira etapa.
- O cenário reconhece serviço manual ativo, o que é positivo para clientes com coleta manual.
- É necessário prevenir duplicidade diária por cliente_id + servico + data.
- Validar se serviços manuais e webhook precisam obrigatoriamente ter rota em ROTAS_AUTOMACOES ou se devem ter regra própria.

Decisão preliminar:
MANTER COM RESSALVA P1.

Ação recomendada:
Não alterar agora. Registrar STATUS_MONITOR_DIARIO como aba operacional ativa. Após a conclusão do Bloco 4.2, abrir correção controlada para filtro inicial, prevenção de duplicidade e regra de rotas para serviços manuais/webhook.

## 09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO

Status: MANTER COM RESSALVA OPERACIONAL

Tipo de gatilho:
Webhook — FLUXAI_PROXY_CLIENT_ONBOARDING_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em CONTRATOS_CLIENTES
3. Google Sheets — Add Row em DNA_CLIENTE_GPT
4. Google Sheets — Add Row em IA_CREDITOS_CLIENTE

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- CONTRATOS_CLIENTES
- DNA_CLIENTE_GPT
- IA_CREDITOS_CLIENTE

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Alta. Contrato, escopo, DNA e crédito de IA alimentam relatórios, planejamento e governança.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Risco de duplicidade:
Médio/Alto. Pode duplicar contrato ou limite de IA se o mesmo onboarding for reenviado.

Risco de quebra se a aba for removida:
Alto. CONTRATOS_CLIENTES, DNA_CLIENTE_GPT e IA_CREDITOS_CLIENTE não podem ser removidas.

Ressalvas:
- Fluxo limitado à FluxAI Labs / FLUXAI_LABS_001.
- Não grava Supabase.
- Não grava CLIENTES_ESTRATEGIA.
- Antes de uso multi-cliente, precisa validação de duplicidade por client_id e contrato_id.

Decisão preliminar:
MANTER COM RESSALVA OPERACIONAL.

## 10_FLUXAI_SERVICO_EXTRA_REQUEST

Status: MANTER COM RESSALVA POSITIVA

Tipo de gatilho:
Webhook — fluxai_servico_extra_request

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em SERVICOS_EXTRAS_CLIENTES
3. Supabase — Upsert em SERVICOS_EXTRAS_CLIENTES
4. Google Sheets — Add Row em FINANCEIRO_CLIENTES
5. Supabase — Upsert em FINANCEIRO_CLIENTES
6. Google Sheets — Add Row em DEMANDAS_CLIENTES
7. Supabase — Upsert em DEMANDAS_CLIENTES
8. Google Sheets — Add Row em COMUNICACOES_CLIENTE
9. Supabase — Upsert em COMUNICACOES_CLIENTE
10. Google Sheets — Add Row em IA_CREDITOS_CLIENTE
11. Supabase — Upsert em IA_CREDITOS_CLIENTE
12. Error handlers com Resume nos módulos Supabase

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- SERVICOS_EXTRAS_CLIENTES
- FINANCEIRO_CLIENTES
- DEMANDAS_CLIENTES
- COMUNICACOES_CLIENTE
- IA_CREDITOS_CLIENTE

Tabelas Supabase usadas:
- SERVICOS_EXTRAS_CLIENTES
- FINANCEIRO_CLIENTES
- DEMANDAS_CLIENTES
- COMUNICACOES_CLIENTE
- IA_CREDITOS_CLIENTE

Dependência com relatórios:
Alta. Serviços extras podem impactar planejamento, financeiro, demandas, comunicação e crédito operacional de IA.

Dependência com Cockpit:
Alta. É um dos cenários que alimenta diretamente Supabase e permite leitura pelo Cockpit.

Risco de duplicidade:
Médio. Pode duplicar linhas no Google Sheets se o mesmo payload for reenviado, mesmo com Supabase usando upsert.

Risco de quebra se a aba for removida:
Alto. Nenhuma das abas envolvidas pode ser removida.

Ressalvas:
- Cenário maduro, com escrita dupla Sheets + Supabase.
- Filtro exige status_servico_extra = aprovado.
- Error handler Resume em Supabase está correto para não quebrar o fluxo Sheets.
- Validar futuramente prevenção de duplicidade no Sheets por servico_extra_id, financeiro_id, demanda_id, notificacao_id e limite_id.

Decisão preliminar:
MANTER COM RESSALVA POSITIVA.

## 11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — FLUXAI_PROXY_IA_CREDITOS_CONTROLE_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em IA_GERACOES_CONTROLE

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- IA_GERACOES_CONTROLE

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média/Alta. A aba registra governança de IA, ocupação de limite operacional, consumo definitivo e liberação de espaço.

Dependência com Cockpit:
Indireta. O cenário grava em Google Sheets, mas não grava diretamente no Supabase.

Dependência com Portal do Cliente:
Baixa. A governança de IA é interna da FluxAI; o cliente não deve operar crédito ou geração.

Risco de duplicidade:
Médio. Cada mudança de status gera nova linha. Isso é aceitável como log, desde que a leitura considere o último status por geracao_id.

Risco de quebra se a aba for removida:
Alto. IA_GERACOES_CONTROLE não pode ser removida.

Ressalvas:
- Validar sintaxe das fórmulas de condição no Make.
- O cenário não grava Supabase.
- O cenário registra eventos, mas não parece recalcular saldo consolidado em IA_CREDITOS_CLIENTE.
- A lógica está alinhada ao conceito correto: limite operacional, não moeda do cliente.
- Cliente não deve ter acesso direto a esse controle.

Decisão preliminar:
MANTER COM RESSALVA P1.

Ação recomendada:
Não alterar agora. Após conclusão do Bloco 4.2, abrir correção controlada para validar fórmulas, evitar leitura errada de ocupação/liberação e, se necessário, criar sincronização posterior com IA_CREDITOS_CLIENTE.

## 12_FLUXAI_SERVICO_EXTRA_APROVACAO

Status: MANTER COM RESSALVA OPERACIONAL

Tipo de gatilho:
Webhook — FLUXAI_PROXY_SERVICE_EXTRA_APPROVAL_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em IA_CREDITOS_CLIENTE
3. Google Sheets — Add Row em SERVICOS_EXTRAS_CLIENTES

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- IA_CREDITOS_CLIENTE
- SERVICOS_EXTRAS_CLIENTES

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Alta. Serviço extra aprovado pode alterar escopo, planejamento e limite operacional de IA.

Dependência com Cockpit:
Indireta. O cenário grava apenas em Google Sheets, sem Supabase.

Risco de duplicidade:
Médio/Alto. Pode duplicar crédito IA e registro de serviço extra se o mesmo payload for reenviado.

Risco de quebra se a aba for removida:
Alto. IA_CREDITOS_CLIENTE e SERVICOS_EXTRAS_CLIENTES não podem ser removidas.

Ressalvas:
- Não grava Supabase.
- Sobrepõe parcialmente o cenário 10_FLUXAI_SERVICO_EXTRA_REQUEST, que também grava serviço extra e crédito IA.
- Validar futuramente qual cenário é o fluxo oficial para aprovação de serviço extra.
- Prevenir duplicidade por credito_id e servico_extra_id.

Decisão preliminar:
MANTER COM RESSALVA OPERACIONAL.

## 13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — FLUXAI_PROXY_IA_GUARDRAIL_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em GPT_GERACOES_LOG

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- GPT_GERACOES_LOG

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média. O cenário registra bloqueios, liberações e riscos da camada IA.

Dependência com Cockpit:
Indireta. Grava apenas em Google Sheets.

Dependência com Portal do Cliente:
Baixa. Guardrail de IA é controle interno da FluxAI, não operação do cliente.

Risco de duplicidade:
Médio. Cada tentativa de geração cria um log. Isso é aceitável como trilha de auditoria, desde que o log seja tratado como histórico.

Risco de quebra se a aba for removida:
Alto. GPT_GERACOES_LOG não pode ser removida.

Ressalvas:
- Validar sintaxe das condições lógicas no Make.
- Não grava Supabase.
- Não executa GPT diretamente; apenas registra decisão do guardrail.
- Mantém alinhamento correto com limite operacional contratado, serviço extra aprovado e ajuste manual.
- Cliente não deve acessar ou operar essa camada.

Decisão preliminar:
MANTER COM RESSALVA P1.

## 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — fluxai_clientes_arquivos_sync

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em CLIENTES_ARQUIVOS

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- CLIENTES_ARQUIVOS

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média. Arquivos do cliente podem alimentar DNA, estratégia, entregas, planejamento e fonte GPT.

Dependência com Cockpit:
Indireta. Grava somente em Google Sheets, sem Supabase.

Dependência com Portal do Cliente:
Alta/indireta. Pode sustentar arquivos vinculados ao cliente, Drive e fonte de inteligência.

Risco de duplicidade:
Médio. Pode duplicar arquivo se o mesmo arquivo_id for reenviado.

Risco de quebra se a aba for removida:
Alto. CLIENTES_ARQUIVOS não pode ser removida.

Ressalvas:
- Não grava Supabase.
- Validar desalinhamento de colunas: metadata indica coluna A como ▌ e arquivo_id em B, enquanto o mapper grava arquivo_id no índice 0.
- Validar se CLIENTES_ARQUIVOS ainda possui primeira coluna visual/vazia.
- Prevenir duplicidade por arquivo_id.
- Se o Cockpit precisar exibir arquivos, será necessário Supabase ou sincronizador posterior.

Decisão preliminar:
MANTER COM RESSALVA P1.

## 15_FLUXAI_PLANEJAMENTO_CONTEUDO

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — FLUXAI_PROXY_PLANEJAMENTO_CONTEUDO_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em PLANEJAMENTO_CONTEUDO

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- PLANEJAMENTO_CONTEUDO

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média/Alta. A aba estrutura planejamento editorial, status de produção, entregas e vínculos com IA.

Dependência com Cockpit:
Indireta. O cenário grava apenas em Google Sheets.

Risco de duplicidade:
Médio. Pode duplicar planejamento_id se o mesmo payload for reenviado.

Risco de quebra se a aba for removida:
Alto. PLANEJAMENTO_CONTEUDO não pode ser removida.

Ressalvas:
- Não grava Supabase.
- Validar desalinhamento de colunas: metadata indica coluna A como ▌ e planejamento_id em B, enquanto o mapper grava planejamento_id no índice 0.
- Prevenir duplicidade por planejamento_id.
- Se o Cockpit precisar exibir planejamento, será necessário Supabase ou sincronizador posterior.

Decisão preliminar:
MANTER COM RESSALVA P1.

## 16_FLUXAI_CALENDARIO_POSTAGENS

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — FLUXAI_PROXY_CALENDARIO_POSTAGENS_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em CALENDARIO_POSTAGENS

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- CALENDARIO_POSTAGENS

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média. Calendário pode alimentar acompanhamento de produção, execução editorial e relatório operacional.

Dependência com Cockpit:
Indireta. Grava apenas em Google Sheets.

Risco de duplicidade:
Médio. Pode duplicar postagem_id se o mesmo payload for reenviado.

Risco de quebra se a aba for removida:
Alto. CALENDARIO_POSTAGENS não pode ser removida.

Ressalvas:
- Não grava Supabase.
- Validar desalinhamento de colunas: metadata indica coluna A como ▌ e postagem_id em B, enquanto o mapper grava postagem_id no índice 0.
- Prevenir duplicidade por postagem_id.
- Se o Cockpit precisar exibir calendário, será necessário Supabase ou sincronizador posterior.

Decisão preliminar:
MANTER COM RESSALVA P1.

## 17_FLUXAI_GPT_GERACOES_LOG

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — FLUXAI_PROXY_GPT_GERACOES_LOG_2026

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em GPT_GERACOES_LOG

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- GPT_GERACOES_LOG

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média. Registra uso técnico de GPT, status de execução, erro, tempo de resposta e link de resultado.

Dependência com Cockpit:
Indireta. Grava apenas em Google Sheets.

Risco de duplicidade:
Médio. Pode duplicar log_id se o mesmo payload for reenviado.

Risco de quebra se a aba for removida:
Alto. GPT_GERACOES_LOG não pode ser removida.

Ressalvas:
- Não grava Supabase.
- Compartilha a mesma aba GPT_GERACOES_LOG com o cenário 13, mas com finalidade diferente.
- Validar padronização de colunas entre logs de guardrail e logs de execução GPT.
- Validar desalinhamento de colunas: metadata indica coluna A como ▌ e log_id em B, enquanto o mapper grava log_id no índice 0.

Decisão preliminar:
MANTER COM RESSALVA P1.

## 18_FLUXAI_LEADS_CLIENTES

Status: MANTER COM RESSALVA P1

Tipo de gatilho:
Webhook — fluxai_leads_clientes

Módulos usados:
1. Custom Webhook
2. Google Sheets — Add Row em LEADS_CLIENTES

Abas Google Sheets lidas:
- Nenhuma identificada

Abas Google Sheets escritas:
- LEADS_CLIENTES

Tabelas Supabase usadas:
- Nenhuma

Dependência com relatórios:
Média/Alta. Leads de clientes podem alimentar CRM, funil comercial, temperatura, próximas ações e análise de aquisição.

Dependência com Cockpit:
Indireta. Grava apenas em Google Sheets.

Risco de duplicidade:
Médio. Pode duplicar lead_id se o mesmo payload for reenviado.

Risco de quebra se a aba for removida:
Alto. LEADS_CLIENTES não pode ser removida enquanto o cenário existir.

Ressalvas:
- Não estava na lista inicial de cenários esperados.
- Não grava Supabase.
- Validar se LEADS_CLIENTES é aba oficial, substituta ou complementar de LEADS_SITE.
- Validar desalinhamento de colunas: metadata indica coluna A como ▌ e lead_id em B, enquanto o mapper grava lead_id no índice 0.
- Prevenir duplicidade por lead_id.

Decisão preliminar:
MANTER COM RESSALVA P1.

### Cenários Não Mapeados (Testes/Legados/Duplicados)
*(Registrar aqui qualquer cenário encontrado que fuja da nomenclatura oficial)*

---

## 3. MATRIZ_DEPENDENCIA_MAKE_PLANILHAS

Esta matriz cruzará os dados da inspeção do Make com a planilha `91_AUDITORIA_DECISAO_ABAS`.

| cenario_make | status_cenario | tipo_gatilho | aba_lida | aba_escrita | tabela_supabase | dependencia_critica | pode_remover_aba | acao_recomendada | observacao |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| (Ex: 01_DEMANDAS) | Ativo | Webhook | `CLIENTES_CONFIG` | `DEMANDAS_CLIENTES` | `N/A` | Alta | NÃO | MANTER | Recebe POST do Cockpit |

---

# 4. Conclusão Consolidada do Bloco 4.2

Status geral:
BLOCO 4.2 — AUDITORIA MAKE CONCLUÍDA COMO INVENTÁRIO OPERACIONAL.

Foram auditados cenários operacionais principais, cenários complementares e cenários não previstos na lista inicial.

Resultado:
- Nenhum cenário deve ser excluído neste momento.
- Nenhuma aba deve ser excluída neste momento.
- Várias abas classificadas inicialmente como REVISAR_NO_BLOCO_4_2 passaram para MANTER por dependência real do Make.
- Existem ressalvas P1 que devem ser tratadas em etapa posterior, sem misturar auditoria com correção.

Abas que passaram para MANTER por dependência Make:
- LEADS_SITE
- STATUS_MONITOR_DIARIO
- IA_GERACOES_CONTROLE
- GPT_GERACOES_LOG
- CLIENTES_ARQUIVOS
- PLANEJAMENTO_CONTEUDO
- CALENDARIO_POSTAGENS
- LEADS_CLIENTES

Cenários operacionais auditados:
- 01_FLUXAI_PORTAL_DEMANDAS
- 02_FLUXAI_LEADS_SITE
- 05_FLUXAI_DAILY_SYNC
- 06_FLUXAI_META_SYNC
- 07_FLUXAI_RELATORIO_MENSAL
- 08_FLUXAI_CLIENT_STATUS_MONITOR
- 09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO
- 10_FLUXAI_SERVICO_EXTRA_REQUEST
- 11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL
- 12_FLUXAI_SERVICO_EXTRA_APROVACAO
- 13_FLUXAI_IA_GUARDRAIL_LIMITE_OPERACIONAL
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG
- 18_FLUXAI_LEADS_CLIENTES

Cenários esperados não encontrados exatamente com a nomenclatura inicial:
- 12_FLUXAI_IA_ENTREGAS
- 14_FLUXAI_PORTAL_DEMANDAS_ATUALIZA

Observação:
Os fluxos atuais encontrados indicam que parte da arquitetura evoluiu para cenários complementares de serviço extra, arquivos, planejamento, calendário, GPT log e leads clientes. A nomenclatura oficial deverá ser revisada no Bloco 4.3 ou etapa de saneamento Make.

Cenários legados/backups:
Foram encontrados cenários dentro da pasta 99_ARQUIVO_BACKUPS_ANTIGOS. Eles devem permanecer desativados, documentados como backup/legado e não devem ser usados como fonte operacional principal.

Decisão final:
BLOCO 4.2 HOMOLOGADO COMO INVENTÁRIO MAKE, COM RESSALVAS P1 PARA CORREÇÃO POSTERIOR.

# 5. Pendências P1 Identificadas

## P1.1 — Tokens sensíveis em blueprints
Cenários impactados:
- 05_FLUXAI_DAILY_SYNC
- 06_FLUXAI_META_SYNC

Ação futura:
Rotacionar tokens sensíveis após encerramento da auditoria e substituir tokens hardcoded por variável/conexão segura no Make.

## P1.2 — Desalinhamento de coluna A visual
Cenários impactados:
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG
- 18_FLUXAI_LEADS_CLIENTES

Risco:
A planilha mostra coluna A como “▌”, enquanto o mapper grava o ID principal no índice 0. Isso pode deslocar os dados.

Ação futura:
Validar fisicamente se essas abas ainda possuem primeira coluna visual/vazia e corrigir mapeamento com backup.

## P1.3 — Duplicidade por reenvio de webhook
Cenários impactados:
- 01_FLUXAI_PORTAL_DEMANDAS
- 02_FLUXAI_LEADS_SITE
- 07_FLUXAI_RELATORIO_MENSAL
- 08_FLUXAI_CLIENT_STATUS_MONITOR
- 09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO
- 10_FLUXAI_SERVICO_EXTRA_REQUEST
- 11_FLUXAI_IA_CREDITOS_CONTROLE_LIMITE_OPERACIONAL
- 12_FLUXAI_SERVICO_EXTRA_APROVACAO
- 14_FLUXAI_CLIENTES_ARQUIVOS_SYNC
- 15_FLUXAI_PLANEJAMENTO_CONTEUDO
- 16_FLUXAI_CALENDARIO_POSTAGENS
- 17_FLUXAI_GPT_GERACOES_LOG
- 18_FLUXAI_LEADS_CLIENTES

Ação futura:
Criar estratégia de upsert, busca prévia ou chave única por ID operacional antes de inserir nova linha.

## P1.4 — Cenários que gravam somente Google Sheets
Cenários impactados:
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

Ação futura:
Definir quais dados precisam sincronizar com Supabase para leitura no Cockpit.

## P1.5 — Sobreposição entre cenário 10 e cenário 12
Cenários impactados:
- 10_FLUXAI_SERVICO_EXTRA_REQUEST
- 12_FLUXAI_SERVICO_EXTRA_APROVACAO

Risco:
Ambos podem registrar serviço extra e crédito IA.

Ação futura:
Definir fluxo oficial:
- 10 como fluxo completo aprovado;
- 12 como fluxo complementar/legado;
ou separar claramente solicitação, aprovação e execução.

*Fim do Documento Base - Aguardando início da inspeção.*
