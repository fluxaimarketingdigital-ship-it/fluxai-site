# AUDITORIA DAS PLANILHAS OPERACIONAIS DO FLUXAI OS™

**Data da auditoria:** 28 de Maio de 2026  
**Modo:** Somente leitura (Nenhuma aba operacional, arquivo ou pasta foi alterado).  
**Planilha auditada:** `FluxAI_Intelligence_Base_Ecossistema_Make`

---

## 1. Resumo executivo
A Fase 04 homologou o sistema. Agora, na Fase 05, auditamos a base de dados operacionais que alimenta a arquitetura. Foram auditadas 55 abas, totalizando ~876 colunas e ~1185 linhas preenchidas. O ecossistema está altamente ramificado com integrações ativas (Meta, GA4, Clarity, GPT, Make e Drive). O foco imediato é a higienização de segurança, padronização de chaves e governança das fontes de verdade, garantindo estabilidade antes de religar automações pesadas no Make.

## 2. Estado atual da planilha
- **Total de abas auditadas:** 55
- **Integrações ativas:** Meta/Instagram/Facebook, GA4, GTM, Clarity, GPT/IA, Make, Google Drive.
- **Ecossistema no Drive:** `FLUXAI_LABS_OPERACIONAL` com 265 pastas e apenas 1 Google Sheets centralizador.
- Várias abas possuem alto risco de segurança por conterem `tokens` de sistema e de Meta diretamente expostos nas colunas.
- Muitas abas estão vazias ou operam apenas como protótipos de cabeçalho.

## 3. Classificação das abas
As 55 abas foram divididas em 4 graus de maturidade e finalidade:
*   **A) Fontes de verdade:** Críticas. Base do sistema.
*   **B) Operacionais a manter:** Úteis, mas precisam de auditoria final antes de conectar ao Make.
*   **C) Preparadas (Semiativas):** Planejadas, estruturadas, mas vazias ou com uso baixíssimo.
*   **D) Candidatas a arquivar:** Legados, rascunhos e backups sujos que prejudicam a performance geral.

---

## 4. Abas Fonte de Verdade (Nível A)
Estas abas são inegociáveis. Elas ditam as regras do OS, o escopo, autorização do Make e o direcionamento da IA. **Preservar como base primária. Evitar edição sem critério.**
*   `CLIENTES_CONFIG` (Contém tokens)
*   `SERVICOS_CLIENTES`
*   `ROTAS_AUTOMACOES` (Contém chaves Make)
*   `MAKE_WORKFLOWS` (Contém Webhooks)
*   `CLIENTES_ESTRATEGIA`
*   `CONTRATOS_CLIENTES`
*   `DNA_CLIENTE_GPT`
*   `SERVICOS_EXTRAS_CLIENTES`
*   `IA_CREDITOS_CLIENTE`
*   `IA_GERACOES_CONTROLE`
*   `CLIENTES_ARQUIVOS`
*   `DEMANDAS_CLIENTES`
*   `LEADS_CLIENTES`
*   `LEADS_SITE`

## 5. Abas Operacionais (Nível B)
Manter ativas, mas realizar limpeza antes de religar fluxos bidirecionais no Make.
*   `PLANEJAMENTO_CONTEUDO`
*   `CALENDARIO_POSTAGENS`
*   `GPT_GERACOES_LOG`
*   `ANALISE_MENSAL_CLIENTE`
*   `KPI_EXECUTIVO`
*   `STATUS_MONITOR_DIARIO`
*   `MELHORES_HORARIOS_POSTAGEM`
*   `CONTRATOS_METRICAS`

## 6. Abas de Logs
Devem ser usadas estritamente como *append-only* (apenas inserção no final da planilha). Não permitir que humanos nem o Make editem ou apaguem linhas do passado.
*   `GPT_GERACOES_LOG`
*   `CATALOGO_SERVICOS_FLUXAI` (Atualmente atuando em formato de registro de catálogo)

## 7. Abas de Métricas
Coletam dados das plataformas externas. Estão na classificação (C).
*   `INSTAGRAM_AUDIENCIA`, `INSTAGRAM_CRESCIMENTO`, `INSTAGRAM_INSIGHTS_CONTEUDO`
*   `GA4_DIARIO`, `GA4_EVENTOS`
*   `CLARITY_DIARIO`
*   `SEARCH_CONSOLE_DIARIO`, `SEARCH_CONSOLE_CONSULTAS`
*   `META_ADS_DIARIO`

## 8. Abas de IA/GPT
Exigem que limite operacional, origem, consumo e status da geração sejam separados claramente.
*   `IA_CREDITOS_CLIENTE`
*   `IA_GERACOES_CONTROLE`
*   `GPT_GERACOES_LOG`
*   Métricas cruzadas em `INSTAGRAM_DIARIO`, `GA4_DIARIO`, `CLARITY_DIARIO`.

## 9. Abas de Instagram/Meta
Altamente ramificadas, atualmente vazias ou em excesso. (C)
*   `INSTAGRAM_CONTEUDO_MANUAL`, `INSTAGRAM_CONTEUDO_RAW`, `INSTAGRAM_POSTS_RAW`, `INSTAGRAM_STORIES_RAW`, `INSTAGRAM_MANUAL_DIARIO`, `INSTAGRAM_PERFIL_DIARIO`

## 10. Abas de GA4/GSC/Clarity
Atualmente estruturadas e vazias. Prontas para automação, mas necessitam revisão de finalidade.
*   `GA4_DIARIO`, `GA4_EVENTOS`, `CLARITY_DIARIO`, `SEARCH_CONSOLE_DIARIO`, `SEARCH_CONSOLE_CONSULTAS`.

## 11. Abas vazias ou apenas com cabeçalho
*   `ALERTAS`, `ALERTAS_SITE`, `ANALISE_MENSAL_CLIENTE`, `CATALOGO_SERVICOS_FLUXAI`, `CONSOLIDADO_DIARIO`, `CONSOLIDADO_SEMANAL`, `GA4_EVENTOS`, `INSIGHTS_CONTEUDO`, `INSTAGRAM_AUDIENCIA`, `INSTAGRAM_CONTEUDO_MANUAL`, `INSTAGRAM_CONTEUDO_RAW`, `INSTAGRAM_CRESCIMENTO`, `INSTAGRAM_INSIGHTS_CONTEUDO`, `INSTAGRAM_MANUAL_DIARIO`, `INSTAGRAM_PERFIL_DIARIO`, `INSTAGRAM_POSTS_RAW`, `INSTAGRAM_STORIES_RAW`, `KPI_EXECUTIVO`, `LEADS`, `RESUMO_SEMANAL`, `RESUMO_SITE`, `SEARCH_CONSOLE_CONSULTAS`, `SEARCH_CONSOLE_DIARIO`, `UTMS`.

## 12. Abas candidatas a arquivamento (Nível D)
Revisar finalidade. A maioria deve ser arquivada, fundida ou deixada offline apenas como histórico/apoio.
*   `ALERTAS`, `ALERTAS_SITE`, `LEADS`, `RESUMO_SEMANAL`, `RESUMO_SITE`, `INSIGHTS_CONTEUDO`, `CONSOLIDADO_DIARIO`, `CONSOLIDADO_SEMANAL`, `INVENTARIO_ABAS`, `LISTAS_VALIDACAO`, `README_ECOSSISTEMA`, `ROTAS_MAKE_FUTURAS`
*   `BACKUP_LIMPEZA_[TELEFONE_REMOVIDO]_033858` (Contém mais de 795 linhas aleatórias, alto risco de sujeira).

---

## 13. Campos sensíveis encontrados
> [!CAUTION]
> **Alto Risco Detectado!** A planilha contém segredos em texto claro (plain-text).

*   **CLIENTES_CONFIG:** `meta_access_token`, `token_status`, Token de sistema Meta conectado ao BM FluxAI Labs.
*   **ROTAS_AUTOMACOES:** `token_necessario`.
*   **MAKE_WORKFLOWS:** `nome_webhook`, `url_webhook`.
*   **GPT_GERACOES_LOG:** `tokens_estimados` (Impacto financeiro).
*   **ROTAS_MAKE_FUTURAS:** `token_necessario`.
*   **STATUS_MONITOR_DIARIO:** `token_status`.

## 14. Riscos Operacionais
*   Excesso de abas vazias ou experimentais fragmenta a operação.
*   Falta de padronização na chave primária (hora usa `cliente_id`, hora usa `client_id`).
*   Abas de backup cruzadas no meio do ecossistema de produção.

## 15. Riscos para Make
*   Ligar cenários em abas vazias pode engatilhar falhas na busca de arrays.
*   Se o Make consultar `CLIENTES_CONFIG` sem criptografia de ponta a ponta, ele armazenará *access tokens* nos logs de histórico de cenário do Make.
*   Execução direta não autorizada caso a aba `MAKE_WORKFLOWS` seja ignorada pelas rotinas do webhook.

## 16. Riscos para FluxAI OS™
*   O OS não deve conectar diretamente nessa planilha. O proxy Make ou a base Supabase devem ser a barreira de proteção.
*   A inconsistência entre `client_id` e `cliente_id` pode gerar bugs 404 (Not Found) ou falhas no Client Portal do FluxAI OS™.

## 17. Riscos para Relatórios
*   Se abas como `ANALISE_MENSAL_CLIENTE` forem preenchidas via automação sem revisão, o relatório chegará ao cliente cru, contendo erros de IA ou alucinações. *Regra: Todo relatório é rascunho até aprovação humana.*

## 18. Recomendações de Padronização
1.  **Chave Primária Única:** Renomear todos os campos `cliente_id` para a nomenclatura americana/programática `client_id`.
2.  **Segurança:** Retirar os *access tokens* (Meta, Make, APIs) das células expostas e movê-los para variáveis de ambiente na Vercel ou no cofre do Make. A planilha deve registrar apenas um Booleano (`status_token: OK/FALHA`).
3.  **Arquivamento:** Mover todas as planilhas Nível D para um arquivo Sheets isolado ("FluxAI_Legacy_Archive").
4.  **Consolidação Meta:** Agrupar as 9 abas de Instagram em apenas 3 (Auditoria, Conteúdo_Performance, Crescimento).

## 19. Ordem de correção
1.  **Segurança Máxima:** Ocultar/Extrair Access Tokens e Webhooks Sensíveis das abas base.
2.  **Limpeza Nível D:** Isolar as abas candidatas ao arquivamento para despoluir a visão.
3.  **Padronização de IDs:** Padronizar tudo para `client_id` de forma transversal nas abas que sobrarem.
4.  **Revisão do Nível B:** Auditar lógicas da área operacional de conteúdo antes de ligar IA.
5.  **Refatoração do Make:** Ajustar os módulos do Make para ler a planilha já estruturada.

## 20. Checklist Final (Bloqueios e Obrigações)
- [x] O Core do OS permanece em Code Freeze. Nenhuma alteração foi feita em `/os`.
- [x] Nenhuma aba foi excluída fisicamente nesta auditoria (Leitura).
- [x] Nenhuma automação foi acionada.
- [ ] A aba `BACKUP_LIMPEZA` foi ignorada como fonte operacional.
- [ ] `CLIENTES_CONFIG` classificada e ratificada como fonte primária ultra-sensível.
- [ ] IA confirmada como engine de uso interno (sem exposição ou controle de limite pelo cliente).
- [ ] Relatórios continuam com política de aprovação humana.
