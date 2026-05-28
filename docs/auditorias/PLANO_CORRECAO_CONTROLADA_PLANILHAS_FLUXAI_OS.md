# PLANO DE CORREÇÃO CONTROLADA DAS PLANILHAS OPERACIONAIS DO FLUXAI OS™

## 1. Resumo executivo
A base de dados operacional (`FluxAI_Intelligence_Base_Ecossistema_Make`) já foi auditada, mapeando 55 abas e múltiplas integrações com Meta, GA4, GTM, Clarity, GPT, Make e Drive. O presente documento estabelece um plano seguro para realizar a **correção controlada** das fragilidades e dívidas técnicas mapeadas na auditoria, preparando a fundação antes de religarmos e expandirmos as novas automações. **O sistema e o código permanecem em Code Freeze.**

## 2. Riscos críticos identificados
Para avançarmos com segurança, os seguintes riscos operacionais e de segurança devem ser mitigados:
- Exposição de `meta_access_token` em plain-text nas células;
- Exposição de `url_webhook` e `nome_webhook` diretamente nas planilhas;
- Exposição de `token_necessario` sem criptografia;
- Inconsistência de chave primária entre `cliente_id` e `client_id`;
- Risco do Make ler abas de backup ou legadas, engatilhando erros em cadeia;
- Risco de duplicação de bundles no Make devido à falta de filtros de fonte;
- Risco de relatórios misturarem dados Manuais e de API sem regra clara.

## 3. Segurança de credenciais
**Modelo Seguro:** As planilhas **nunca** devem guardar um token real, webhook real, secret ou key sensível. A planilha guardará apenas status, referência e observações. Tokens devem habitar o cofre de variáveis de ambiente (Make Connections, Supabase Secrets, Vercel Env Vars). Webhooks diretos não devem aparecer em abas visíveis, mantendo o `make-proxy` como camada obrigatória entre OS e Make.

| Campo sensível | Aba atual | Risco | Ação recomendada | Prioridade |
| :--- | :--- | :--- | :--- | :--- |
| `meta_access_token` | CLIENTES_CONFIG | Extremo | Remover token real, substituir por `status_token: OK/FALHA` | P0 |
| Token de sistema Meta | CLIENTES_CONFIG | Extremo | Migrar para cofre (Make/Supabase) | P0 |
| `url_webhook` | MAKE_WORKFLOWS | Alto | Usar apenas ID interno referenciado via make-proxy | P0 |
| `nome_webhook` | MAKE_WORKFLOWS | Médio | Padronizar nomenclatura técnica | P1 |
| `token_necessario` | ROTAS_AUTOMACOES | Alto | Alterar para Booleano (TRUE/FALSE) | P0 |

## 4. Padronização de chave do cliente
O padrão oficial e irrevogável de chave primária será: **`client_id`** (formato técnico em inglês).

*O uso de `cliente_id` (em português) é aceito temporariamente como legado, mas o padrão técnico do ecossistema inteiro deve migrar para `client_id`.*

**Mapeamento de Impacto:**
- **Abas com `client_id`:** CLIENTES_CONFIG, CLIENTES_ESTRATEGIA, CONTRATOS_CLIENTES, DNA_CLIENTE_GPT, SERVICOS_EXTRAS_CLIENTES, IA_CREDITOS_CLIENTE, IA_GERACOES_CONTROLE, GPT_GERACOES_LOG, CLIENTES_ARQUIVOS, PLANEJAMENTO_CONTEUDO, CALENDARIO_POSTAGENS, LEADS_CLIENTES, ALERTAS, ALERTAS_SITE, CONSOLIDADO_DIARIO, CONSOLIDADO_SEMANAL, CONTRATOS_METRICAS, GA4_DIARIO, GA4_EVENTOS, INSIGHTS_CONTEUDO, INSTAGRAM_DIARIO, INSTAGRAM_POSTS_RAW, LEADS, META_ADS_DIARIO, RESUMO_SEMANAL, RESUMO_SITE, SEARCH_CONSOLE_CONSULTAS, SEARCH_CONSOLE_DIARIO, STATUS_INTEGRACOES, UTMS, CLARITY_DIARIO.
- **Abas com `cliente_id`:** SERVICOS_CLIENTES, ROTAS_AUTOMACOES, DEMANDAS_CLIENTES, ANALISE_MENSAL_CLIENTE, INSTAGRAM_AUDIENCIA, INSTAGRAM_CONTEUDO_MANUAL, INSTAGRAM_CONTEUDO_RAW, INSTAGRAM_CRESCIMENTO, INSTAGRAM_INSIGHTS_CONTEUDO, INSTAGRAM_MANUAL_DIARIO, INSTAGRAM_PERFIL_DIARIO, INSTAGRAM_STORIES_RAW, LEADS_SITE, MELHORES_HORARIOS_POSTAGEM, ROTAS_MAKE_FUTURAS, STATUS_MONITOR_DIARIO.
- **Risco de Quebra:** Procs/VLookups, queries internas e filtros no Make podem parar de funcionar se a coluna for renomeada abruptamente.
- **Proposta (Migração Gradual):** Não renomear automaticamente. Criar a coluna `client_id` ao lado de `cliente_id` nas abas afetadas, preencher, apontar o Make para a nova coluna, e depois descontinuar a antiga.

## 5. Arquitetura Instagram Manual vs API
Formalizamos que o sistema de Instagram terá dois modos oficiais de coleta:
*   `modo_coleta=manual`
*   `modo_coleta=api`
*   *(Opcional futuro: `modo_coleta=hibrido`)*

**Regras do Modelo Híbrido:**
- Clientes com Instagram manual continuam totalmente ativos. Não se deve desativar o serviço manual apenas para evitar duplicação;
- O Make deve possuir filtros inteligentes roteando (Router) com base na coluna `modo_coleta`;
- Se cliente não possui Meta autorizada, usará abas manuais;
- Se cliente possui Meta conectada (API), usará as abas RAW/API automatizadas;
- A consolidação e o relatório (se `relatorio_incluir=sim`) vão extrair o dado final (Manual ou API) sem expor a origem como um problema de arquitetura.

**Classificação e Mapeamento Oficial das Abas de Instagram:**
- **Manuais:** `INSTAGRAM_MANUAL_DIARIO`, `INSTAGRAM_CONTEUDO_MANUAL`
- **API/RAW:** `INSTAGRAM_CONTEUDO_RAW`, `INSTAGRAM_PERFIL_DIARIO`, `INSTAGRAM_POSTS_RAW`, `INSTAGRAM_STORIES_RAW`, `INSTAGRAM_INSIGHTS_CONTEUDO`
- **Consolidadas (Output):** `INSTAGRAM_DIARIO`, `INSTAGRAM_AUDIENCIA`, `INSTAGRAM_CRESCIMENTO`

## 6. Fontes de Verdade Blindadas (Nível A)

| Aba (Nível A) | Finalidade | Make Lê? | OS Lê? | Relatório Lê? | Sensível? | Status da Proteção |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CLIENTES_CONFIG** | Base central de chaves, tokens e contatos. | Sim | Sim (Proxy) | Sim | Sim (Tokens) | Vulnerável |
| **SERVICOS_CLIENTES** | Mapeamento de escopo contratado. | Sim | Sim | Sim | Não | Aberto |
| **ROTAS_AUTOMACOES** | Autorização (White-list) de fluxos de automação. | Sim | Sim (Proxy) | Não | Sim | Aberto |
| **MAKE_WORKFLOWS** | Dicionário de conexões dos cenários. | Sim | Sim (Proxy) | Não | Sim (Webhooks) | Vulnerável |
| **CLIENTES_ESTRATEGIA** | Planejamento e prioridade tática. | Sim (IA) | Sim | Sim | Não | Aberto |
| **CONTRATOS_CLIENTES** | Gestão financeira e base de cobrança. | Não | Sim | Não | Não | Aberto |
| **DNA_CLIENTE_GPT** | Diretrizes para prompts estruturados do Content Engine. | Sim (IA) | Sim | Não | Não | Aberto |
| **SERVICOS_EXTRAS_CLIENTES** | Upsell e fluxo de escopos adicionais. | Sim (L/E)| Sim | Sim | Não | Aberto |
| **IA_CREDITOS_CLIENTE** | Governança (limite operacional). | Sim (L/E)| Sim | Não | Não | Aberto |
| **IA_GERACOES_CONTROLE** | Registro da saída consumida da IA. | Sim (L/E)| Sim | Não | Não | Aberto |
| **CLIENTES_ARQUIVOS** | Repositório lógico (Drive). | Sim | Sim | Sim | Não | Aberto |
| **DEMANDAS_CLIENTES** | Kanban operacional. | Sim (L/E)| Sim | Sim | Não | Aberto |
| **LEADS_CLIENTES** | Leads captados para clientes. | Sim (L/E)| Não | Sim | Dados Pessoais | Aberto |
| **LEADS_SITE** | Leads captados para a própria agência. | Sim (L/E)| Não | Sim | Dados Pessoais | Aberto |

## 7. Abas não conectáveis ao Make (Nível D / Legados)
As planilhas a seguir são obsoletas, puramente experimentais ou de backup, e **não devem** estar conectadas ao Make sob nenhuma hipótese para evitar gargalos de processamento.
*   `BACKUP_LIMPEZA_[TELEFONE_REMOVIDO]_033858` (Arquivo/Lixo Técnico)
*   `INVENTARIO_ABAS` (Legado/Apoio)
*   `LISTAS_VALIDACAO` (Apoio)
*   `README_ECOSSISTEMA` (Apoio Documental)
*   `ROTAS_MAKE_FUTURAS` (Futura/Rascunho)
*   `LEADS` (Legado/Substituído)
*   `ALERTAS` e `ALERTAS_SITE` (Legado)
*   `RESUMO_SEMANAL` e `RESUMO_SITE` (Legado)

## 8. Mapa de Correção por Prioridade

**Prioridade P0 (Risco de Invasão ou Paralisação):**
- [ ] Não expor token, webhook ou secret em células de planilha.
- [ ] Impedir que o Make leia a aba de backup e as abas legadas do Nível D.
- [ ] Preservar o `make-proxy` como barreira oficial.
- [ ] Impedir absolutamente o uso de URL de webhook direto no frontend.

**Prioridade P1 (Padronização Tecnológica):**
- [ ] Padronizar a chave primária `client_id` em toda a extensão da base.
- [ ] Mapear o legado temporário de `cliente_id` antes da exclusão.
- [ ] Separar de fato a coleta `Manual` da coleta `API` conforme regras.
- [ ] Revisar governança na aba `ROTAS_AUTOMACOES`.
- [ ] Revisar segurança na aba `MAKE_WORKFLOWS`.

**Prioridade P2 (Limpeza e Governança Final):**
- [ ] Organizar abas vazias.
- [ ] Criar a primeira aba (Index) como `MAPA_GOVERNANCA_ABAS`.
- [ ] Revisar fórmulas das abas consolidadas (`INSTAGRAM_DIARIO`, etc.).
- [ ] Preparar a documentação macro para o Manual Operacional.

## 9. Ordem segura de execução futura (O Protocolo)
1. Fazer backup completo (Cópia espelho) da planilha original antes de mexer.
2. Criar a primeira aba `MAPA_GOVERNANCA_ABAS` como índice mestre.
3. Classificar rigidamente cada aba do arquivo em Operacional, Apoio, Legado, Arquivo ou Futura.
4. Mapear campos sensíveis.
5. Executar o plano de remoção segura de tokens e webhooks.
6. Iniciar padronização para `client_id` no modo compatível (coluna paralela).
7. Ajustar a arquitetura Manual/API de ponta a ponta.
8. Validar fórmulas internas (Vlookups/Queries) que dependem das colunas antigas.
9. Validar o Make rodando cenários em modo de teste manual.
10. Apenas após a bateria de testes, reativar as automações em schedule.

## 10. Checklist de Aceite Final (Quality Gate)
- [ ] Tokens reais removidos ou neutralizados da interface.
- [ ] Webhooks reais removidos das colunas e protegidos em proxies.
- [ ] `client_id` estabelecido como o padrão principal (Master Key).
- [ ] `cliente_id` legado devidamente mapeado e com plano de fim de vida (EOL).
- [ ] Ecossistema Manual vs API 100% separado na captação.
- [ ] Filtro `modo_coleta` validado com sucesso.
- [ ] Filtro `relatorio_incluir` validado com sucesso.
- [ ] Campo `status_servico` governando ativamente os cenários.
- [ ] `ROTAS_AUTOMACOES` revisada e validada como white-list.
- [ ] `MAKE_WORKFLOWS` revisada sem exposição HTTP(S).
- [ ] Abas legadas desconectadas do Make definitivamente.
- [ ] Backup espelho criado e armazenado no Drive.
- [ ] Nenhuma automação ativada prematuramente antes de toda a validação.

---
## 11. Decisão Estratégica Final
**As planilhas operacionais não devem ser corrigidas no impulso.** A limpeza não é apenas deletar linhas, é uma reengenharia de dados. Esta correção deve obrigatoriamente ser feita através de um ciclo controlado: criação de backup prévio, documentação do mapa de governança, migração suave das chaves, refatoração dos apontamentos e, acima de tudo, **teste contido no Make antes de qualquer ativação em ambiente real.**
