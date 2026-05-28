# FASE 05.2 — BACKUP E MAPA DE GOVERNANÇA DAS ABAS

## 1. Resumo Executivo
Esta fase (05.2) prepara o terreno tático para a correção controlada das planilhas operacionais do ecossistema FluxAI. O foco exclusivo deste documento é estabelecer a obrigatoriedade de um backup físico integral e criar a estrutura do **Mapa de Governança das Abas**. Nenhuma alteração real no sistema, Make ou dados será realizada antes do aceite formal deste protocolo.

## 2. Backup Obrigatório
Antes de qualquer ajuste, migração ou higienização, **deve existir uma cópia completa (espelho)** da planilha original `FluxAI_Intelligence_Base_Ecossistema_Make`.

**Nome Oficial Sugerido:**
`BACKUP_ORIGINAL_FluxAI_Intelligence_Base_Ecossistema_Make_2026_05_28`

**Regras de Manuseio do Backup:**
- Criar o backup fisicamente no Google Drive *antes* de editar 1 única célula da base de produção.
- **Não editar o backup** sob nenhuma circunstância.
- Manter o backup totalmente fora das conexões do Make.
- Não conectar a aba/planilha de backup ao FluxAI OS™.
- Não usar a planilha de backup como fonte para extrair dados diários de relatórios.
- O backup serve estritamente para **recuperação de desastres (Disaster Recovery)**.

---

## 3. Estrutura da Aba MAPA_GOVERNANCA_ABAS
Para governar as 55 abas mapeadas na auditoria, criaremos uma primeira aba (Index) na planilha matriz. Essa aba de governança controlará os níveis de acesso e o status de cada aba subsequente.

**Colunas obrigatórias da nova aba:**
- `aba`
- `nivel_governanca`
- `tipo_aba`
- `status_operacional`
- `fonte_verdade`
- `make_pode_ler`
- `os_pode_ler`
- `relatorio_pode_ler`
- `modo_coleta`
- `contem_dado_sensivel`
- `tipo_dado_sensivel`
- `risco`
- `acao_recomendada`
- `prioridade`
- `observacao`

---

## 4. Dicionário de Valores Permitidos

### `nivel_governanca`
*   `A_FONTE_DE_VERDADE`
*   `B_OPERACIONAL`
*   `C_METRICA_RAW_API`
*   `D_MANUAL`
*   `E_CONSOLIDADA`
*   `F_LEGADO`
*   `G_BACKUP`
*   `H_DOCUMENTACAO`
*   `I_FUTURA`

### `tipo_aba`
`cadastro_base`, `controle_make`, `controle_operacional`, `governanca_ia`, `log`, `metrica_api`, `metrica_manual`, `metrica_consolidada`, `relatorio`, `apoio`, `backup`, `documentacao`, `legado`.

### `status_operacional`
`ativa`, `pausada`, `em_revisao`, `legado`, `arquivo`, `futura`, `nao_operacional`.

### Controle de Acessos (`make_pode_ler` / `os_pode_ler`)
`sim`, `nao`, `somente_teste`.

### `relatorio_pode_ler`
`sim`, `nao`, `somente_consolidado`.

### Outros Campos Restritos
*   **`modo_coleta`**: `manual`, `api`, `hibrido`, `nao_aplicavel`.
*   **`contem_dado_sensivel`**: `sim`, `nao`.
*   **`risco`**: `baixo`, `medio`, `alto`, `critico`.
*   **`prioridade`**: `P0`, `P1`, `P2`, `P3`.

---

## 5. Classificação Inicial Obrigatória

**A_FONTE_DE_VERDADE:**
- CLIENTES_CONFIG
- SERVICOS_CLIENTES
- ROTAS_AUTOMACOES
- MAKE_WORKFLOWS
- CLIENTES_ESTRATEGIA
- CONTRATOS_CLIENTES
- DNA_CLIENTE_GPT
- SERVICOS_EXTRAS_CLIENTES
- IA_CREDITOS_CLIENTE
- IA_GERACOES_CONTROLE
- CLIENTES_ARQUIVOS
- DEMANDAS_CLIENTES
- LEADS_CLIENTES
- LEADS_SITE

**B_OPERACIONAL:**
- PLANEJAMENTO_CONTEUDO
- CALENDARIO_POSTAGENS
- STATUS_MONITOR_DIARIO
- MELHORES_HORARIOS_POSTAGEM
- CONTRATOS_METRICAS

**C_METRICA_RAW_API:**
- INSTAGRAM_CONTEUDO_RAW
- INSTAGRAM_PERFIL_DIARIO
- INSTAGRAM_POSTS_RAW
- INSTAGRAM_STORIES_RAW
- INSTAGRAM_INSIGHTS_CONTEUDO
- GA4_DIARIO
- GA4_EVENTOS
- CLARITY_DIARIO
- SEARCH_CONSOLE_DIARIO
- SEARCH_CONSOLE_CONSULTAS
- META_ADS_DIARIO

**D_MANUAL:**
- INSTAGRAM_MANUAL_DIARIO
- INSTAGRAM_CONTEUDO_MANUAL

**E_CONSOLIDADA:**
- INSTAGRAM_DIARIO
- INSTAGRAM_AUDIENCIA
- INSTAGRAM_CRESCIMENTO
- ANALISE_MENSAL_CLIENTE
- KPI_EXECUTIVO
- CONSOLIDADO_DIARIO
- CONSOLIDADO_SEMANAL

**F_LEGADO / APOIO / ARQUIVO:**
- BACKUP_LIMPEZA_[TELEFONE_REMOVIDO]_033858
- INVENTARIO_ABAS
- LISTAS_VALIDACAO
- README_ECOSSISTEMA
- ROTAS_MAKE_FUTURAS
- LEADS
- ALERTAS
- ALERTAS_SITE
- RESUMO_SEMANAL
- RESUMO_SITE
- INSIGHTS_CONTEUDO

---

## 6. Regras Críticas de Governança
> [!CAUTION]
> As regras abaixo são as leis fundamentais de roteamento para as automações (Make) e para o ecossistema OS.

1. `BACKUP_LIMPEZA` **não** pode ser lido por nenhum módulo do Make.
2. `ROTAS_MAKE_FUTURAS` **não** pode autorizar nenhuma rota ativa.
3. `CLIENTES_CONFIG` contém dados hiper sensíveis e precisa de proteção (vaulting).
4. `MAKE_WORKFLOWS` contém endpoints de webhooks (risco de exploit) e precisa ser mitigado.
5. `ROTAS_AUTOMACOES` apenas autoriza a rota; não dispara automações de forma indiscriminada/ampla.
6. `SERVICOS_CLIENTES` é quem dita o serviço ativo, o `modo_coleta` e o `relatorio_incluir`.
7. **Instagram Manual é um modo oficial de coleta**. Clientes manuais nunca devem ser desativados no escopo só porque o Make duplica bundles (O Make quem deve aprender a filtrar).
8. **Relatórios** devem consumir de abas de Nível `E_CONSOLIDADA` e não podem consumir diretamente de `C_METRICA_RAW_API` sem pré-processamento.
9. **Make** só pode acessar abas classificadas onde `make_pode_ler = sim` E que possuam filtro específico validando a origem autorizada.

---

## 7. Checklist antes de executar a correção real
- [ ] Backup completo ("Espelho") criado no Google Drive.
- [ ] Arquivo de backup mantido fisicamente isolado das conexões do Make e do OS.
- [ ] A nova aba `MAPA_GOVERNANCA_ABAS` foi criada na planilha base.
- [ ] Todas as 55 abas foram classificadas dentro do Mapa.
- [ ] Abas com `dado_sensivel` devidamente marcadas.
- [ ] Status booleano do `make_pode_ler` preenchido em 100% das linhas.
- [ ] Abas legadas e sujas (`nao`) isoladas/bloqueadas.
- [ ] Separação clara entre Mapeamento Manual e API (`modo_coleta`).
- [ ] A chave `client_id` chancelada como padrão de evolução arquitetural.
- [ ] A chave legada `cliente_id` perfeitamente mapeada para a migração suave.
- [ ] Prioridades Críticas (`P0`) levantadas e identificadas.
- [ ] NENHUMA automação ou webhook reativado durante este setup.

---

## 8. Próximo Passo
A execução deste checklist abre a porta oficial para a **FASE 05.3 — Correção P0 de Segurança**:
*   Neutralizar tokens reais (Access Tokens e Keys) de dentro das planilhas.
*   Remover URLs absolutas de webhooks reais de abas que operadores e scripts possuem leitura.
*   Substituir dados diretos por `status` ou ID de referência.
*   Validar se o vaulting (Make Connections, Supabase Secrets, Vercel Env) suportará o peso da arquitetura de forma segura.
*   Preservar a existência contínua do `make-proxy`.
