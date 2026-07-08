# 🔎 HOMOLOGAÇÃO FASE 10 — AUDITORIA DE CONTRATOS & FINANCEIRO

**Objetivo:** Validar se Contratos, Financeiro, Serviços, Limites e Pagamentos usam dados reais, Supabase como fonte da verdade e não exibem mocks ou informações fictícias. Não foram realizadas alterações no código.

---

## 1. Arquivos Envolvidos
- `os/js/contracts-finance.js` (Painel Admin de Finanças)
- `os/js/modules/cliente-detalhe.js` (Cockpit Operacional)
- `os/client-portal.html` (Portal do Cliente)
- `os/config/os-config.js` (Mapeamento de webhooks e status)
- Migrations (`20260606_operacao_fluxai_tabelas.sql`, `20260627000003_add_bank_accounts_and_baixa.sql`)

## 2. Telas Envolvidas
- **Financeiro / Contratos** (Visão Admin)
- **Detalhe do Cliente / Cockpit** (Visão Operador)
- **Portal do Cliente** (Visão Cliente)

## 3. Tabelas Lidas
- `contracts-finance.js`: `contracts`, `payments_ledger`, `SERVICOS_EXTRAS_CLIENTES`
- `cliente-detalhe.js`: `CONTRATOS_CLIENTES`, `FINANCEIRO_CLIENTES`, `SERVICOS_EXTRAS_CLIENTES`, `IA_CREDITOS_CLIENTE`
- Não há registro nas migrations de criação de `contracts` e `payments_ledger`, indicando que são tabelas legadas ou inexistentes.

## 4. Tabelas Gravadas
- `contracts-finance.js` tenta executar requisição `.update()` diretamente na tabela `contracts`.

## 5. Uso de localStorage, Mocks ou Dados Hardcoded
- **Mocks Altamente Ativos no Admin:** O arquivo `contracts-finance.js` **ainda utiliza fortemente mocks** no `localStorage` (`fluxai_mock_projects`, `fluxai_mock_contracts`, `fluxai_mock_payments`). Caso a query nas tabelas legadas (`contracts`/`payments_ledger`) falhe, o sistema renderiza dados fictícios (ex: *Alves Odonto Premium*, *Apex Educacional*) e salva/lê no localStorage.
- **Mocks no Cockpit:** O `cliente-detalhe.js` possui um fallback rígido (`CLIENT_COCKPIT_MOCKS`) que assume a tela caso o Supabase falhe ou para clientes específicos (Labs, Alpha).
- O Portal do Cliente (já tratado na Fase 9) não exibe mocks, pois força o estado "Em Implantação".

## 6. Qual Tabela é a Fonte da Verdade Hoje?
Existe um **cisma arquitetural** grave (desalinhamento):
- O **Banco de Dados Oficial** (visto pelas migrations `20260606`) usa a nomenclatura em português: `CONTRATOS_CLIENTES` e `FINANCEIRO_CLIENTES`.
- O **Admin (contracts-finance.js)** não respeita essa fonte e tenta ler as antigas `contracts` e `payments_ledger`, caindo em falha e renderizando mocks de fallback.
- O **Operador (cliente-detalhe.js)** respeita as tabelas em português e busca dados reais (`CONTRATOS_CLIENTES`, `IA_CREDITOS_CLIENTE`).

## 7. Duplicidade
- Sim, o código do frontend aponta para estruturas duplas:
  - `contracts` (Inglês, chamada pelo Admin) x `CONTRATOS_CLIENTES` (Português, chamada pelo Cockpit).
  - `payments_ledger` (Inglês, Admin) x `FINANCEIRO_CLIENTES` (Português, Cockpit).

## 8. Visibilidade por Perfil
- **Admin:** Vê faturamento simulado e dados contratuais fictícios injetados do `localStorage` (porque a query real de `contracts` falha).
- **Operador:** Vê os dados reais sincronizados do banco de dados oficial (Tabelas PT-BR) no Cockpit. Admin e Operador, portanto, veem realidades financeiras completamente distintas para o mesmo cliente.
- **Cliente:** Vê um aviso de que o financeiro está "Em Implantação" (Fase 9), sem dados fictícios.

## 9. Como Serviços Extras são Tratados
- São os únicos elementos híbridos. No Admin (`contracts-finance.js`), a query busca corretamente de `SERVICOS_EXTRAS_CLIENTES` e converte para pagamentos em tela.
- Quando criados ou aprovados, o Make participa através dos webhooks (`SERVICE_EXTRA_REQUEST` / `SERVICE_EXTRA_APPROVAL`), definidos no `os-config.js` rotas (10 e 12).

## 10. Limites Operacionais/IA
- O cálculo é feito corretamente no Cockpit, que soma os valores das colunas `limite_operacional_mensal`, `limite_ocupado`, `limite_disponivel_operacional` e `limite_published` da tabela `IA_CREDITOS_CLIENTE` referente ao mês atual.

## 11. Participação do Make.com
- O Make é acionado para gravação de intenções financeiras ou solicitações via rotas, como `SERVICE_EXTRA_REQUEST` (Rota 10) que capta as emissões do portal, e o Admin aciona `FINANCE_UPDATE`.

## 12. Riscos Críticos Identificados 🚨
1. **Cobrança fictícia:** Admin vendo contratos e recebíveis do localStorage pode aprovar ou cobrar erroneamente clientes baseando-se em mocks locais.
2. **Status divergente:** O que o Cockpit (Operação) vê de contrato/financeiro não é o que o Painel Financeiro (Admin) vê.
3. **Dados duplicados/fantasmas:** Update de contratos pelo painel financeiro aponta para a tabela errada (`contracts`), ignorando a tabela real.
4. **Financeiro sem origem confiável:** A gestão de `payments_ledger` não existe nas rotas migratórias padronizadas, que assumiram a `FINANCEIRO_CLIENTES`.

## 13. Correção Mínima Proposta para Funcionar Hoje
Para sanar a divergência crítica do faturamento:
1. **Refatorar** `os/js/contracts-finance.js` para buscar os dados EXCLUSIVAMENTE nas tabelas reais e oficiais do Supabase: `CONTRATOS_CLIENTES` e `FINANCEIRO_CLIENTES`.
2. **Deletar** o bloco de fallback (`mockContracts` e `mockPayments`) e a injeção do `localStorage` no script de finanças do Admin.
3. **Mapear** o DTO de colunas retornadas do `CONTRATOS_CLIENTES` (PT-BR) para renderizar a interface de finanças sem quebrar os `<tr>/<td>` que esperam variáveis em inglês, ou adaptar o JS para os nomes em PT-BR.
4. Garantir que o `update()` da modal do Admin aponte para `CONTRATOS_CLIENTES` e gere webhook real de atualização.
