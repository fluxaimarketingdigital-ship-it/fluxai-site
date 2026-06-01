# CHECKLIST DE PUBLICAÇÃO CONTROLADA — LANDING PAGE GIaaS™
## INFRAESTRUTURA DE SEO, ROTEAMENTO NA VERCEL E BLINDAGEM DE SEGURANÇA COMERCIAL

**Fase Operacional:** FASE 06.4 (Plano Comercial de Retomada)  
**Versão:** 1.0.0 (Junho/2026)  
**Status do Repositório:** **CODE FREEZE CORE TOTALMENTE PRESERVADO**  
**Rota Pública Recomendada:** `/giaas`  
**Arquivo Fonte Local:** `giaas.html`  

---

## 1. Diretrizes de Roteamento Seguro (Vercel)

Para publicar de forma controlada a nova Landing Page comercial, estabelecemos o roteamento limpo de `/giaas` apontando diretamente para `giaas.html` na raiz do projeto.

### ⚠️ Regra de Ouro (Inviolabilidade do Core):
É **estritamente proibido** alterar ou criar rotas que colidam com as seções protegidas do **FluxAI OS™** (`/os`, painel administrativo, autenticação, RBAC, endpoints do Supabase ou proxy `make-proxy`). O mapeamento na Vercel deve ocorrer isoladamente.

### 📝 Exemplo de Configuração Segura em `vercel.json` (Draft de Revisão):
```json
{
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/giaas",
      "destination": "/giaas.html"
    }
  ]
}
```
*Nota: Este mapeamento deve ser inserido apenas no bloco de rewrites comercial secundário, sem alterar as configurações de segurança globais do cabeçalho CSP.*

---

## 2. Checklist Técnico de Publicação (Staging para Produção)

O operador técnico deverá validar e checar cada um dos itens abaixo antes de autorizar a submissão de publicação:

### 2.1. Otimização de SEO e Rastreamento (GA4, GTM e Clarity)
- [x] **Título Executivo (`<title>`):** Configurado exatamente como `"Growth Infrastructure as a Service (GIaaS™) | FluxAI Labs™"`.
- [x] **Meta Description:** Contendo copy Premium chancelada: `"Engenharia de Crescimento e Operações de Growth (Growth Ops) de alta performance chancelada pelo FluxAI OS™ e automações de IA proprietárias. Descubra a clareza e transparência síncrona real."`
- [x] **Inserção de Meta Tags Open Graph (Recomendado):**
  * `<meta property="og:title" content="GIaaS™ — Growth Infrastructure as a Service | FluxAI Labs™">`
  * `<meta property="og:description" content="Operações de crescimento de alta performance orientadas por dados, BI síncrono e software proprietário de comando de alta velocidade.">`
  * `<meta property="og:image" content="https://fluxaidigital.com.br/assets/images/og-image-giaas.png">`
  * `<meta property="og:type" content="website">`
- [x] **Estrutura Semântica H1:** Confirmada a existência de **um único `<h1>` por página**, localizado no topo da seção Hero, estabelecendo a hierarquia correta de títulos (H2 e H3 nas seções subsequentes).
- [x] **Scripts de Rastreamento (Containers whitelisted):** Verificar se os scripts whitelisted de GTM, pixel do GA4 e Clarity ID estão no `<head>` de `giaas.html` sem erros de console ou violações de Content Security Policy (CSP).

### 2.2. Validação Responsiva e Performance (Lighthouse)
- [x] **Desktop (> 1024px):** Grid de 3 colunas visualmente alinhado, mockup lateral do OS legível e margens simétricas de 60px.
- [x] **Tablet (768px a 1024px):** Layout fluindo adequadamente, sem transbordo horizontal e barras de navegação recolhidas com elegância.
- [x] **Mobile (< 768px):** Cards de diferenciais e tabela de planos colapsados em coluna única linear, com fontes e CTAs com toque confortável e botões com largura total de tela (100%).
- [x] **Core Web Vitals (FCP/LCP):** Auditar velocidade móvel no Chrome DevTools pós-deploy. O carregamento deve manter-se abaixo de 1.8 segundos para corroborar a percepção de "Plataforma proprietária de alta velocidade".

### 2.3. Funcionalidades, LGPD e Chaves (Produção vs. Sandbox)
- [x] **Fluxo de CTA:** Todos os botões e chamadas principais da Hero, Planos e Diferenciais saltam suavemente para a âncora `#aplicar` no formulário.
- [x] **Campos de Triagem Obrigatórios:** Todos os seletores de Faturamento (`low`, `mid`, `high`, `enterprise`) e investimento Ads exigem marcação ativa.
- [x] **Consentimento e Cookies Banner (LGPD):** Verificar se o rodapé possui o link funcional da Política de Privacidade e se um banner sutil de consentimento de cookies em tons musgo/cinza chumbo está ativo e responsivo.
- [x] **Chave do Inbound (Sandbox para Produção):** Para a decolagem oficial em produção, certificar-se de que a ação de `onsubmit` no formulário foi alterada do `alert()` simulado para a rota ativa de proxy/Make no cofre privado de dados, sem expor chaves cruas no DOM.
- [x] **Sem Ações Automáticas:** O cadastro de novos leads na base `LEADS_SITE` não dispara propostas PDF em relatórios automáticos. O processo respeita rigorosamente a curadoria humana sênior antes de qualquer faturamento.
- [x] **Blindagem do make-proxy (Backend):** Codificado e estruturado em `supabase/functions/make-proxy/index.ts` com validação de Origin (incluindo preview Vercel), isolamento rígido de escopo da chave pública (apenas para `LEAD_CAPTURE`), validação de campos obrigatórios/email e sanitização física do schema de dados.
- [ ] **Deploy Real do make-proxy:** Publicar a versão blindada atualizada na nuvem do Supabase via comando CLI (`supabase functions deploy make-proxy`).

### 2.4. Segurança e Auditoria Física de Credenciais (Sanitização)
- [x] **Sem Webhooks Reais:** Confirmada a ausência de webhooks de produção Make.com expostos no front.
- [x] **Sem API Tokens:** Verificado que a `anon_key` do Supabase ou chaves privadas do cofre não estão acessíveis em arquivos JS públicos carregados na página.
- [x] **Sem CNPJ Real:** Identificadores monetários e contatos em rodapés mascarados de forma segura como `[REDIGIDO]`.
- [x] **Conformidade SSL (Custom Domain):** Verificar se o domínio sob `/giaas` possui certificado SSL ativo (HTTPS) e se os redirecionamentos de `http://` para `https://` estão forçados nas configurações da Vercel.

---

## 3. Instruções de Publicação e Homologação (Staging) — [CONCLUÍDO]

O processo de deploy de homologação e validações avançadas foi concluído com sucesso:

1.  **[x] Integridade do Repositório:** Verificado com sucesso. Nenhuma alteração colidiu com o diretório `/os` congelado sob Code Freeze.
2.  **[x] Roteamento de Rota Comercial:** A Landing Page está apontada para a rota pública `/giaas` via clean URLs da Vercel e rewrite explícito no `vercel.json`.
3.  **[x] Deploy de Homologação (Staging):** O deploy de homologação na Vercel foi concluído com sucesso.
    *   **URL de Staging/Preview:** `https://fluxai-site-qw6axk0ky-fluxaimarketingdigital-6611s-projects.vercel.app`
    *   **Rota homologada:** `/giaas`
4.  **[x] Teste Final Responsivo:** Testado e aprovado com visualização limpa e grid de conversão fluido.
5.  **[ ] Promoção para Produção:** Promover para a URL definitiva oficial `/giaas` sob aprovação manual estratégica.

---

*Checklist de conformidade de publicação de Landing Page comercial chancelada pela Equipe de Governança da FluxAI Labs.*
