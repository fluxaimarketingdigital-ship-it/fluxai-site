# FLUXAI OS™ — DIRETRIZES DE COPY E LINGUAGEM
**Versão:** 2.1.0 | **Arquivo:** `FLUXAI_OS_COPY_GUIDELINES.md`

---

## Tom de Voz do Sistema

O FluxAI OS™ fala como um sistema profissional, não como uma pessoa.

| Atributo | Descrição |
|----------|-----------|
| **Direto** | Sem rodeios. Dado → ação → resultado. |
| **Técnico mas legível** | Termos técnicos existem, mas sempre com contexto. |
| **Sem hype** | Nenhuma exclamação, nenhum emoji, nenhum "incrível!" |
| **Sem IA explícita** | O sistema usa IA mas não grita isso o tempo todo. |
| **Institucional** | A linguagem do OS é da FluxAI, não do cliente. |

---

## Regras de Escrita

### ✅ Certo
- "Dados sincronizados."
- "Relatório aprovado internamente."
- "Nenhum lead encontrado."
- "Chave de acesso inválida."
- "Serviço extra registrado."

### ❌ Errado
- "Uau! Dados sincronizados com sucesso! 🎉"
- "IA gerou um conteúdo incrível para você!"
- "Ops! Algo deu errado 😢"
- "Parabéns! Cliente ativado!"
- "Nossa IA está trabalhando para você..."

---

## Termos Internos (Operador/Admin) — Usar sem tradução

Esses termos são corretos para o contexto interno:

| Termo técnico | Contexto |
|---------------|---------|
| Onboarding | Setup inicial do cliente |
| Lead | Contato comercial ainda não convertido |
| DNA Estratégico | Perfil profundo do cliente para a IA |
| Crédito de IA | Unidade de consumo da Camada GPT |
| Rota | Cenário automatizado no Make |
| Token | Chave de acesso de API de terceiros |
| Webhook | Endpoint de comunicação entre sistemas |
| CPL | Custo por Lead (Custo por Contato Gerado) |
| ROAS | Retorno sobre investimento em mídia |
| CTR | Taxa de cliques |

---

## Termos no Portal do Cliente — Traduzir

Quando um termo aparecer no portal visível ao cliente, usar a versão humanizada:

| Termo interno | Versão para o cliente |
|---------------|-----------------------|
| Lead | Contato Comercial |
| Pipeline | Esteira Comercial |
| CRM | Gestão de Relacionamento |
| ROAS | Retorno sobre Investimento em Mídia |
| CPL | Custo por Contato Gerado |
| CTR | Taxa de Cliques |
| Score | Pontuação |
| Webhook | — (nunca exibir) |
| Token | Acesso Conectado / Não Configurado |
| Insight | Leitura Estratégica |
| Onboarding | Configuração Inicial |
| Crédito de IA | — (nunca exibir) |
| Rota | — (nunca exibir) |

---

## Status — Exibição Oficial

Nunca exibir a chave raw do status (ex: `em_revisao`).
Sempre usar o label do `STATUS_CONFIG`:

| Chave raw | Label exibido |
|-----------|---------------|
| `onboarding` | Em Onboarding |
| `ativo` | Ativo |
| `pausado` | Pausado |
| `inativo` | Inativo |
| `novo` | Novo |
| `em_negociacao` | Em Negociação |
| `convertido` | Convertido |
| `perdido` | Perdido |
| `aberta` | Aberta |
| `em_andamento` | Em Andamento |
| `entregue` | Entregue |
| `cancelada` | Cancelada |
| `solicitado` | Solicitado |
| `em_orcamento` | Em Orçamento |
| `orcamento_enviado` | Orçamento Enviado |
| `aprovado` | Aprovado |
| `em_producao` | Em Produção |
| `rascunho` | Rascunho |
| `em_revisao` | Em Revisão |
| `aprovado_internamente` | Aprovado Internamente |
| `enviado_ao_cliente` | Enviado ao Cliente |

---

## Mensagens de Estado

### Loading
> "Sincronizando..."
> "Carregando..."

Não usar: "Aguarde, estamos buscando seus dados..." — verboso demais.

### Empty State
> "Nenhum registro encontrado."
> "Sem demandas abertas."
> "Nenhum lead no período."

Não usar: "Parece que está tudo limpo por aqui! 🎉"

### Erro
> "Erro ao carregar dados. Tente novamente."
> "Falha de conexão."
> "Chave de acesso inválida."

Não usar: "Ops! Algo deu muito errado... 😥"

### Sucesso
> "Salvo com sucesso."
> "Enviado."
> "Cliente ativado."

Não usar: "Perfeito! Tudo certo! ✅"

---

## Títulos de Página — Padrão

| Página | Título H1 |
|--------|-----------|
| Centro de Comando | "Centro de Comando" |
| Clientes | "Clientes" |
| Demandas | "Demandas" |
| Leads | "Oportunidades Comerciais" |
| Métricas | "Métricas Consolidadas" |
| Relatório Mensal | "Relatórios Mensais" |
| Onboarding | "Onboarding Operacional" |
| Portal do Cliente | "Painel Operacional" |

---

## Subtítulos de Página — Padrão

Subtítulos devem descrever a **função operacional**, não a stack técnica.

### ✅ Correto
> "Status operacional e serviços conectados."
> "Oportunidades recebidas e em qualificação."
> "Rascunhos consolidados aguardando revisão interna."

### ❌ Errado
> "Leads processados pelos Webhooks do Make."
> "Dados sincronizados via Google Sheets."
> "Integração com Make + Google Sheets + FluxAI GPT."
