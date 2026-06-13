# ATUALIZAÇÃO ESTRUTURAL — 03_SERVICOS_CLIENTES (Governança API x Manual)

A aba `03_SERVICOS_CLIENTES` recebeu 4 novas colunas obrigatórias para suportar a arquitetura híbrida de clientes que podem possuir o mesmo serviço (Ex: Instagram) operando tanto via API (oficial) quanto Manual (teste ou contingência), sem colidir em relatórios ou gerar duplicidade de dados.

## Novas Colunas (Dicionário de Dados)

| Coluna | Tipo | Validação (Dropdown) | Obrigatório | Descrição (Finalidade) |
| :--- | :--- | :--- | :--- | :--- |
| `prioridade_fonte` | Enum | `primaria`, `secundaria` | Sim | Define qual fonte tem peso na consolidação de dados. (Ex: API = primária). |
| `uso_operacional` | Enum | `producao`, `teste`, `contingencia` | Sim | Impede que cenários em produção puxem registros de teste. |
| `permite_fallback` | Enum | `sim`, `nao` | Sim | Indica se o sistema pode buscar na fonte secundária se a primária falhar. |
| `status_validacao` | Enum | `homologado`, `em_teste`, `aguardando_homologacao`, `bloqueado` | Sim | Status técnico da integração (diferente do status comercial). |

---

## 🔒 Regras de Arquitetura & Governança (FluxAI Labs 001)

A coexistência foi implementada sob rigorosa trava de segurança para o cliente de homologação:

**1. Registro API (Produção Oficial):**
*   `modo_coleta` = `api`
*   `status_servico` = `ativo`
*   `relatorio_incluir` = `sim`
*   `prioridade_fonte` = `primaria`
*   `uso_operacional` = `producao`
*   `status_validacao` = `homologado`

**2. Registro Manual (Teste Isolado - Cenário 03):**
*   `modo_coleta` = `manual`
*   `status_servico` = `teste_bloqueado`
*   `relatorio_incluir` = `nao`
*   `prioridade_fonte` = `secundaria`
*   `uso_operacional` = `teste`
*   `status_validacao` = `aguardando_homologacao`

## 🛡️ Impacto nos Cenários do Make (Pacote Seguro 04)

1.  **Cenário 06 (Meta Sync API):** Mantém a coleta blindada pela leitura da fonte em produção (`uso_operacional = producao` AND `modo_coleta = api`).
2.  **Cenário 07 (Relatório Mensal):** O filtro `relatorio_incluir = nao` da linha manual bloqueia severamente qualquer alucinação/duplicação de relatório (Aba 29). Não haverá soma de métricas entre API e Manual para o mesmo mês.
3.  **Cenário 03 (Manual Reader):** Poderá ser desenterrado no futuro e homologado pontualmente mudando a linha manual temporariamente para `status_servico = ativo_teste`.
4.  **Cenário 08 (Status Monitor):** O monitor diário poderá captar a linha manual como `teste_bloqueado`, sem que isso soe como um alarme crítico, mas sim um log operacional da estrutura.

*Nenhuma alteração estrutural foi enviada para a aba `29_ANALISE_MENSAL_CLIENTE` conforme ordem expressa do payload.*
