# AUDITORIA DE PRIVACIDADE, COOKIES E PRONTIDÃO DE PUBLICAÇÃO (F2-SITE-03B)

Executada em ambiente **Read-Only**. Nenhum arquivo foi modificado, salvo ou injetado.

## 1. Localização dos Elementos de Privacidade
- **Política de Privacidade:** Implementada como Modal dinâmico (`#privacy-modal`) dentro do arquivo `index.html` e `giaas.html`. Existe também uma página estática arquivada em `os/termos-de-uso.html`.
- **Política de Cookies:** Não existe documento ou página exclusiva. Apenas uma breve menção agregada à Política de Privacidade.
- **Termos de Uso:** Arquivo estático presente em `os/termos-de-uso.html`.
- **Banner de Consentimento:** Componente fixo no rodapé (`lgpd-cookie-banner`).
- **Links no Rodapé:** Há um link explícito ("Política de Privacidade") que dispara o modal sem recarregar a página.
- **Scripts Analíticos:** Scripts customizados `trackEvent` para disparo de eventos no `window.dataLayer`, indicando preparação para o Google Analytics 4 (GA4) e GTM.

## 2. Análise do Banner de Cookies (`lgpd-banner`)
- **Botão "Aceitar":** Sim (`Aceitar e Prosseguir`). Grava a flag `lgpd_consent_2026` no LocalStorage.
- **Botão "Rejeitar":** Não.
- **Área de Preferências:** Não.
- **Clareza da finalidade:** Texto genérico ("otimizar o desempenho e analisar o tráfego").
- **Bloqueio prévio:** O código não possui lógica de bloqueio condicional de tags. As tags de `trackEvent` disparam eventos para o `dataLayer` mesmo se o usuário ainda não tiver clicado em "Aceitar".
- **Reabertura de preferências:** Ausente.

## 3 e 4. Inventário de Ferramentas de Rastreamento (Identificadas no Source Code)
- **Google Tag Manager / GA4:** 
  - *Status:* Parcialmente implementado. O código usa `dataLayer.push` extensamente via função utilitária `trackEvent` nos cliques de botões sociais, menu e formulário. No entanto, o snippet root de instalação do GTM/GA `<script src="https://www.googletagmanager...` está **ausente** da `<head>` no `index.html`.
  - *Finalidade:* Tracking de conversão e outbound clicks.
- **Elfsight (Widgets):**
  - *Status:* O Javascript contém um script de limpeza para apagar links com `elfsight.com`.
- **Supabase JS:**
  - *Status:* Carregado em páginas secundárias (ex: `os/client-portal.html`, `os/demandas.html`, `os/metricas.html`) via CDN. Em `index.html`, o script do proxy Make é carregado como módulo local.
  - *Finalidade:* Backend as a Service e Auth.
- **Microsoft Clarity / Meta Pixel:** Não localizados fisicamente no código renderizado (salvo se injetados por um GTM futuro).

## 5. Auditoria da Política Pública (Modal `privacy-modal`)
- **Identidade do Controlador:** Ausente (CNPJ não informado no Modal, apenas a marca "FluxAI Labs™").
- **Tipos de dados coletados:** Claros (Nome, Empresa, WhatsApp, Instagram, Segmento).
- **Finalidade:** Clara (Triagem comercial, agendamento de diagnóstico).
- **Compartilhamento com terceiros:** Declarado explicitamente ("Nenhum dado é compartilhado com terceiros").
- **Segurança:** Declarada (Proxy Supabase HTTPS, base protegida).
- **Direitos do Titular:** Declarados (Confirmação, acesso, retificação, exclusão).
- **Canal de Solicitações:** Menciona "nossos canais de governança", mas não fornece o e-mail exato ou formulário direto (ex: dpo@fluxai.com.br).
- **Data de atualização:** Presente ("Junho de 2026").

## 6. Formulário de Diagnóstico (Avaliação Documental)
- O componente possui proximidade temática com captura de dados (WhatsApp, Nome, Empresa).
- **Aviso de Privacidade no Form:** Ausente no corpo físico do formulário HTML da home (a menção à privacidade fica restrita ao Footer/Banner).
- **Consentimento Explícito (Checkbox):** Ausente. Não há um checkbox obrigatório *"Li e aceito os termos"*.

---

## 7. MATRIZ DE RISCO E CONFORMIDADE

| Item Auditado | Situação Atual | Evidência | Severidade | Risco | Recomendação | Responsável |
|---|---|---|---|---|---|---|
| **Banner de Cookies** | Parcialmente Conforme | Ausência de botão "Recusar" e "Preferências" | Alta | Processos Administrativos (ANPD) | Implementar plataforma de CMP certificada ou refatorar o componente HTML com opt-out real. | Frente 2 |
| **Bloqueio Prévio de Scripts** | Ausente | `dataLayer.push` executa independente do click no Banner | Alta | Coleta de dados de rastreamento sem consentimento | Condicionar a execução do `trackEvent` ao status de `lgpd_consent_2026` true. | Frente 2 |
| **Política de Privacidade (Modal)** | Parcialmente Conforme | Ausência de e-mail DPO e CNPJ do Controlador | Média | Falta de clareza institucional LGPD | Adicionar CNPJ e e-mail de DPO no final do Modal. | Frente 2 |
| **Formulário de Captação** | Parcialmente Conforme | Sem checkbox de opt-in de privacidade | Média | Leads questionarem prova de consentimento | Inserir Checkbox genérico "Aceito a Política de Privacidade" antes do envio. | Frente 2 |
| **Instalação do GTM / Pixel** | Ausente / Incompleto | `<head>` do `index.html` não possui tag GTM, tornando as tags de conversão cegas. | Baixa (Técnica) | Perda de dados de campanhas. | Inserir Container do GTM. | Frente 2 / Marketing |

---

## 8. CLASSIFICAÇÃO GERAL
**Decisão:** `APTO COM RESSALVAS`.

O site não expõe dados, não envia informações para terceiros inseguros de maneira declarada, e possui textos de governança avançados que geram percepção premium. No entanto, do ponto de vista de *Compliance Estrutural* (LGPD nível exigente), falta controle real de recusa no Banner de Cookies e o opt-in no Formulário Comercial. Para publicação (Go-Live) de tráfego pago inicial e validação, o risco é tolerável, assumindo o compromisso de correção nas próximas sprints.

---

## 9. CONFIRMAÇÕES ABSOLUTAS DE SEGURANÇA
- **Confirmo expressamente** que absolutamente **NENHUM** arquivo (.html, .css, .js) foi modificado.
- **Confirmo expressamente** que nenhum deploy foi realizado na Vercel (Produção).
- **Confirmo expressamente** que nenhum comando git commit ou git push foi rodado.
- **Confirmo expressamente** que nenhuma correção de código da pendência SRI reportada anteriormente ocorreu. O repositório permanece inviolado.
