# FLUXAI OS™ — ARQUITETURA DO GOOGLE SHEETS
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_SHEETS_ARCHITECTURE.md`

---

## Nome da Planilha Principal
`FluxAI_Intelligence_Base_Ecossistema_Make`

---

## Abas e Estrutura de Colunas

### CLIENTES_CONFIG
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `cliente_id` | ID | Identificador único (ex: CLI_XXXX_001) |
| `nome_interno` | Texto | Nome de uso interno |
| `nome_comercial` | Texto | Nome público / marca |
| `email` | Email | Contato principal |
| `telefone` | Texto | WhatsApp principal |
| `website` | URL | Site do cliente |
| `instagram_profile` | Texto | @handle do Instagram |
| `status_ativo` | Status | onboarding / ativo / pausado / inativo |
| `data_entrada` | Data | Data de início do contrato |
| `responsavel_cliente` | Texto | Nome do responsável no cliente |
| `token_auth_status` | Status | ativo / ausente / aguardando_autorizacao / expirado |

### SERVICOS_CLIENTES
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `cliente_id` | ID | Referência ao cliente |
| `servico` | Texto | Nome do serviço |
| `status_servico` | Status | ativo / pausado / encerrado |
| `modo_coleta` | Enum | automatico / manual |
| `data_inicio` | Data | |
| `observacao` | Texto | |

### SERVICOS_EXTRAS_CLIENTES
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id_extra` | ID | Identificador único |
| `cliente_id` | ID | Referência ao cliente |
| `servico_id` | ID | Referência ao catálogo |
| `nome_servico` | Texto | Nome do serviço extra |
| `descricao` | Texto | Detalhamento |
| `status` | Status | solicitado / em_orcamento / orcamento_enviado / aprovado / em_producao / entregue / cancelado / recusado |
| `valor_estimado` | Número | |
| `valor_aprovado` | Número | |
| `impacto_gpt` | Boolean | true / false |
| `creditos_extras` | Número | Créditos GPT adicionais |
| `data_solicitacao` | Data | |
| `data_entrega` | Data | |
| `observacao` | Texto | |

### DEMANDAS_CLIENTES
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id_demanda` | ID | |
| `cliente_id` | ID | |
| `titulo` | Texto | |
| `descricao` | Texto | |
| `prioridade` | Enum | alta / media / baixa |
| `status` | Status | aberta / em_andamento / aguardando / entregue / cancelada |
| `responsavel` | Texto | |
| `prazo` | Data | |
| `data_solicitacao` | Data | |

### LEADS_SITE
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id_lead` | ID | |
| `nome_lead` | Texto | |
| `empresa` | Texto | |
| `email` | Email | |
| `telefone` | Texto | |
| `servico_interesse` | Texto | |
| `canal_origem` | Texto | site / instagram / indicacao |
| `campanha` | Texto | UTM campaign |
| `pagina_origem` | URL | |
| `status` | Status | novo / contatado / em_negociacao / proposta_enviada / convertido / perdido |
| `responsavel` | Texto | |
| `data_entrada` | Data | |
| `observacao` | Texto | |

### GA4_DIARIO / CLARITY_DIARIO / SEARCH_CONSOLE_DIARIO
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `data` | Data | |
| `cliente_id` | ID | |
| `sessoes` | Número | GA4 |
| `usuarios` | Número | GA4 |
| `conversoes` | Número | GA4 |
| `taxa_rejeicao` | % | GA4 |
| `impressoes_organicas` | Número | Search Console |
| `cliques_organicos` | Número | Search Console |
| `ctr_organico` | % | Search Console |
| `posicao_media` | Número | Search Console |
| `sessoes_clarity` | Número | Clarity |
| `cliques_raiva` | Número | Clarity (rage clicks) |
| `scroll_profundidade` | % | Clarity |

### INSTAGRAM_DIARIO
| Coluna | Tipo |
|--------|------|
| `data` | Data |
| `cliente_id` | ID |
| `seguidores_novos` | Número |
| `seguidores_perdidos` | Número |
| `seguidores_total` | Número |
| `alcance` | Número |
| `impressoes` | Número |
| `engajamento_total` | Número |
| `taxa_engajamento` | % |
| `publicacoes` | Número |

### META_ADS_DIARIO
| Coluna | Tipo |
|--------|------|
| `data` | Data |
| `cliente_id` | ID |
| `investimento` | R$ |
| `impressoes` | Número |
| `cliques` | Número |
| `leads` | Número |
| `cpl` | R$ |
| `ctr` | % |
| `roas` | Número |

### ANALISE_MENSAL_CLIENTE
| Coluna | Tipo |
|--------|------|
| `id_relatorio` | ID |
| `mes_referencia` | Mês (YYYY-MM) |
| `cliente_id` | ID |
| `seguidores_fim_mes` | Número |
| `alcance` | Número |
| `visitas_perfil` | Número |
| `cliques` | Número |
| `conteudos_publicados` | Número |
| `diagnostico_executivo` | Texto |
| `decisao_proximo_mes` | Texto |
| `prioridades` | Texto |
| `status_relatorio` | Status |
| `aprovado_em` | Data |
| `enviado_em` | Data |

### DNA_CLIENTE_GPT
| Coluna | Tipo |
|--------|------|
| `cliente_id` | ID |
| `objetivo_principal` | Texto |
| `prioridade_comercial` | Texto |
| `publico_alvo` | Texto |
| `oferta_principal` | Texto |
| `dor_mais_forte` | Texto |
| `diferencial_real` | Texto |
| `risco_atual` | Texto |
| `oportunidade_estrategica` | Texto |
| `tom_de_voz` | Texto |
| `palavras_proibidas` | Texto |
| `formatacao_exigida` | Texto |

### IA_CREDITOS_CLIENTE
| Coluna | Tipo |
|--------|------|
| `cliente_id` | ID |
| `creditos_contrato` | Número |
| `creditos_extras` | Número |
| `creditos_consumidos` | Número |
| `creditos_disponiveis` | Número (calculado) |
| `mes_referencia` | Mês |

---

## Regras de Escrita

1. O Make é o único agente que escreve nas planilhas.
2. O OS nunca usa Google Sheets API diretamente para escrever (fase 1).
3. Em caso de conflito, o Sheets é a fonte de verdade.
4. IDs devem ser únicos, imutáveis e gerados no momento do primeiro registro.
