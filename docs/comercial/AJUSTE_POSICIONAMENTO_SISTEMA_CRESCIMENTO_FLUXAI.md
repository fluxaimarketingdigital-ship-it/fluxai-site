# AJUSTE DE POSICIONAMENTO PÚBLICO E COMERCIAL
## DE "GIaaS™" PARA "SISTEMA DE CRESCIMENTO FLUXAI™" E INTEGRAÇÃO DO WEBHOOK 02

**Fase Operacional:** FASE 06.4 (Pré-Produção Comercial / Publicação Controlada)  
**Data de Execução:** 2 de Junho de 2026  
**Status do Saneamento:** **EXECUTADO E HOMOLOGADO**  
**Status do Repositório:** **CODE FREEZE CORE TOTALMENTE PRESERVADO**

---

## 1. Justificativa Estratégica

O termo técnico **GIaaS™ (Growth Infrastructure as a Service)**, embora de excelente precisão metodológica e arquitetônica na governança de dados da FluxAI Labs™, apresentava barreiras cognitivas e complexidade excessiva para a atração imediata do público-alvo no ecossistema comercial brasileiro de alto padrão (High-Ticket).

### 🎯 A Solução
Substituímos o posicionamento público da Landing Page `/giaas` para **Sistema de Crescimento FluxAI™**. 
Esta nova nomenclatura expressa de forma limpa, direta e atraente que o cliente final não está contratando apenas um software isolado de IA (SaaS comum) nem uma agência de publicidade tradicional, mas sim uma **infraestrutura recorrente, completa e gerenciável de tráfego, CRM, automação de IA e relatórios consolidados diários.**

---

## 2. Escopo das Alterações Efetuadas (giaas.html)

As seguintes substituições de copy estratégico foram feitas no arquivo fonte comercial [`giaas.html`](file:///c:/Users/BRENDA/Desktop/Identidade%20Visual%20FluxAI/FLUXAI_SITE/giaas.html):

### 2.1. Título e Tags SEO
*   **Antes:** `Growth Infrastructure as a Service (GIaaS™) | FluxAI Labs™`
*   **Depois:** `Sistema de Crescimento FluxAI™ | FluxAI Labs™` (nas tags `<title>` e `og:title`).

### 2.2. Seções de Copy Público
*   **Introdução da Oferta:**
    *   *Antes:* `<h2>Conheça o GIaaS™</h2>` / `Growth Infrastructure as a Service: A fusão ideal entre inteligência humana e automação técnica.`
    *   *Depois:* `<h2>Conheça o Sistema de Crescimento FluxAI™</h2>` / `Uma estrutura mensal recorrente para empresas: a fusão perfeita entre tráfego qualificado, dados em tempo real e automações de Inteligência Artificial.`
*   **Grade de Investimento:**
    *   *Antes:* `<h2>Grade de Ofertas GIaaS™</h2>`
    *   *Depois:* `<h2>Grade do Sistema de Crescimento FluxAI™</h2>`

### 2.3. Renomeação de Planos & Revisão de Valores
Como parte da nova política de qualificação comercial para evitar o fechamento síncrono por preço fixo rígido que travaria a escala comercial estratégica de alta performance, atualizamos a tabela de investimento:
1.  **Essencial** (Antigo *ENTRY*):
    *   *Investimento:* Alterado o valor fixo rígido para a expressão de atração: `Planos a partir de R$ 5.000/mês`.
2.  **Estruturado** (Antigo *SCALE*):
    *   *Investimento:* Removemos totalmente a exposição pública agressiva da mensalidade fixa de **R$ 8.500/mês**. Agora, o valor é apresentado como **`Sob consulta`** com a legenda explicativa **`Investimento definido após diagnóstico estratégico`**.
3.  **Avançado** (Antigo *ENTERPRISE*):
    *   *Investimento:* Alterado de R$ 15.000 fixo para **`Sob medida`** com a legenda explicativa **`Investimento definido após diagnóstico estratégico`**.

---

## 3. Resolução e Achatamento de Payload (make-proxy)

Durante os testes de captação de leads da landing page, o cenário **02_FLUXAI_LEADS_SITE** falhava em gravar os leads na planilha Google Sheets pois o webhook espera um payload achatado, diretamente na raiz do body, sem objetos aninhados.

### 🛠️ Correção Efetuada no make-proxy
Modificamos a rota `LEAD_CAPTURE` no [supabase/functions/make-proxy/index.ts](file:///c:/Users/BRENDA/Desktop/Identidade%20Visual%20FluxAI/FLUXAI_SITE/supabase/functions/make-proxy/index.ts) para interceptar os dados estruturados do formulário frontend e transformá-los dinamicamente em um payload perfeitamente achatado, compatível com o cenário 02 do Make.

#### Mapeamento de Payload Aplicado:
*   `lead_id`: Código gerado dinamicamente com o prefixo `LEAD-` e um identificador forte `crypto.randomUUID()`.
*   `cliente_id`: Fixo como `"FLUXAI_LABS_001"` para vinculação de onboarding.
*   `cliente_nome`: Fixo como `"FluxAI Labs"`.
*   `origem_site`: Fixo como `"landing_sistema_crescimento"`.
*   `nome_lead`: Mapeado do campo `payload.name`.
*   `email`: Mapeado do campo `payload.email`.
*   `telefone`: Mapeado com fallback seguro: `payload.phone || payload.telefone || ""`.
*   `empresa`: Mapeado do campo `payload.company`.
*   `servico_interesse`: Fixo como `"Sistema de Crescimento FluxAI"`.
*   `canal_origem`: Fixo como `"site"`.
*   `campanha`: Fixo como `"landing_sistema_crescimento"`.
*   `pagina_origem`: Mapeado com fallback seguro: `payload.page_url || "/giaas"`.
*   `status_lead`: Definido como `"novo"` para controle de funil.
*   `responsavel`: Definido como `"FluxAI"`.
*   `observacao`: Concatenação limpa e estruturada no formato:  
    `"Faturamento: " + payload.revenue + " | Mídia: " + payload.spend + " | Gargalo: " + payload.gap + " | " + payload.description`

---

## 4. Preservação do Núcleo do Sistema (Code Freeze)

A auditoria física das modificações atesta:
*   **Preservação Estrutural:** O formulário de captura (`#giaas-app-form` e sua ação JS `submitLead(event)`) foi mantido intacto e preservado. Todos os campos de triagem obrigatórios e tags de rastreamento do Analytics permanecem síncronos e ativos.
*   **Inviolabilidade do Core:** Zero linhas das Edge Functions operacionais protegidas em `/os` ou regras de RBAC/auth foram tocadas nesta etapa.

---

*Ata de alteração e reposicionamento público chancelada pela Equipe de Engenharia e Governança Comercial de Elite da FluxAI Labs.*
