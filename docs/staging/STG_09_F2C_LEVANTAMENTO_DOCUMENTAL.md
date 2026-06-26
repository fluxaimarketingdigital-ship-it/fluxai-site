# LEVANTAMENTO DOCUMENTAL PRÉ-PUBLICAÇÃO (F2-SITE-03C)

Documento gerado em modo estritamente **Read-Only**. Nenhum arquivo fonte foi alterado.

## FRENTE 2 — CONTEÚDO PÚBLICO E JURÍDICO

### 1. Política de Privacidade
**Localização:** Modal `privacy-modal` em `index.html` e `giaas.html`.
**Visibilidade Pública:** Sim (via clique no link do rodapé).
**Aparência:** Atual (Junho de 2026), porém incompleta (ausência de CNPJ direto no texto).
**Texto Extraído Integralmente:**
> **Diretrizes de Privacidade e LGPD | FluxAI Labs™**
> Última atualização: Junho de 2026
> Nós da FluxAI Labs™ valorizamos a segurança e a governança dos seus dados. Esta Política de Privacidade descreve de forma transparente como coletamos, armazenamos e tratamos as informações fornecidas voluntariamente na página institucional.
> 1. Coleta de Dados Voluntária
> Coletamos informações exclusivas fornecidas voluntariamente por você ao submeter o formulário de aplicação comercial de triagem: Nome Completo ou Empresa, WhatsApp de contato e Instagram ou Site; Segmento de mercado, gargalo identificado e descrição opcional do desafio.
> 2. Finalidade e Utilização dos Dados
> Todos os dados de triagem comercial coletados destinam-se única e exclusivamente a: Avaliação prévia de qualificação comercial e viabilidade técnica de implantação do ecossistema FluxAI; Contato direto por nossa equipe de governança corporativa e sócios para agendamento de diagnóstico; Nenhum dado é compartilhado com terceiros ou utilizado para fins de spam comercial automatizado.
> 3. Segurança, Retenção e Não-Automatização
> Garantimos governança avançada de segurança: Os dados são trafegados via conexão criptografada (HTTPS) diretamente a um proxy Supabase seguro e inseridos na base protegida LEADS_SITE; Respeitamos o Protocolo de Curadoria Humana: novos cadastros não disparam propostas automáticas por e-mail ou ativações críticas de cenários de faturamento, assegurando total discrição antes da verificação estratégica; Nenhum token sensível ou chave de API do ecossistema é exposto publicamente no DOM ou no tráfego público do site.
> 4. Seus Direitos sob a LGPD
> Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/18), você possui plenos direitos de confirmar a existência de tratamento, solicitar o acesso, a retificação ou a exclusão total dos seus dados de nossa base de triagem a qualquer momento, mediante solicitação simples aos nossos canais de governança.

### 2. Política de Cookies (Banner)
**Localização:** Componente `lgpd-banner` em `index.html`.
**Visibilidade Pública:** Sim (aparece após 1 segundo caso não haja registro no LocalStorage).
**Aparência:** Atual, porém incompleta (sem botões de recusa ou preferências granulares).
**Texto Extraído Integralmente:**
> Nós utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência, otimizar o desempenho do site e analisar o tráfego de dados em total conformidade com a Lei Geral de Proteção de Dados (LGPD). Ao continuar navegando, você concorda com o uso destas tecnologias. Leia nossa Política de Privacidade.
> [Botão]: Aceitar e Prosseguir

### 3. Termos de Uso
**Localização:** Arquivo `/os/termos-de-uso.html`.
**Visibilidade:** Interno (Diretório protegido `os/`), porém acessível se a URL for conhecida.
**Aparência:** Atual (Maio de 2026), possui informações jurídicas (CNPJ e E-mail).
**Texto Extraído Integralmente (Principais Fragmentos):**
> **Política de Privacidade e Termos de Uso**
> Última atualização: Maio de 2026
> A FluxAI (inscrita sob o CPF 017.711.905-58) leva a sua privacidade a sério e zela pela segurança e proteção de dados de todos os seus clientes, parceiros, fornecedores e usuários, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)... Para exercer qualquer um de seus direitos sob a LGPD ou se tiver dúvidas sobre esta Política de Privacidade, entre em contato através do e-mail oficial: fluxai.marketingdigital@gmail.com.
*(Nota: O texto menciona CPF como CNPJ e o e-mail não é um @fluxai, gerando possível conflito de governança institucional).*

### 4. Formulário Comercial (Avisos e Textos Próximos)
**Localização:** `index.html` (Seção `#diagnostico`).
**Visibilidade Pública:** Sim.
**Texto Extraído Integralmente (Rodapé do Form):**
> O preenchimento não representa contratação, reserva automática de agenda ou entrega de diagnóstico gratuito. Caso exista aderência, entraremos em contato para apresentar os próximos passos.

### 5. Identificação Jurídica e Contatos
- **Razão Social/Marca:** FluxAI Labs™
- **Registro:** "inscrita sob o CPF 017.711.905-58" (informação encontrada nos Termos de Uso. *Atenção: Informado como CPF, não CNPJ*).
- **Endereço Físico:** Salvador, BA / Global (Footer da Home).
- **Telefone:** 71 98111-4694 (Footer da Home).
- **E-mail:** `fluxai.marketingdigital@gmail.com` (Apenas nos Termos de Uso internos).

---

## FRENTE 1 — COMPORTAMENTO TÉCNICO E INVENTÁRIO

### 6. Campos do Formulário Comercial
- `nome` (name): Nome / Empresa | Texto | **Obrigatório** | Dado pessoal
- `whatsapp` (phone): WhatsApp (ex: 71 9999-9999) | Tel | **Obrigatório** | Dado pessoal sensível
- `instagram` (company): Instagram ou Site | Texto | **Obrigatório** | Dado público
- `segmento` (segmento): Selecione seu Segmento | Select | **Obrigatório** | Classificação B2B
- `gargalo` (pain_point): Qual é o maior gargalo hoje? | Select | **Obrigatório** | Inteligência de vendas
- `desafio` (internal_notes): Descreva brevemente seu cenário | Textarea | **Obrigatório** | Texto livre
- **Consentimento Técnico Próximo:** Ausente (não há input tipo checkbox `aceite_lgpd`).

### 7. Inventário de Ferramentas de Rastreamento
- **Google Tag Manager (GTM-WD2HLH3L):** Instalada e carregada. Injetada por um script local de carregamento assíncrono atrasado (Lazy Load via *interaction* ou fallback de 10s).
- **Microsoft Clarity (n72q8vcl9y):** Instalada e carregada. Injetada no mesmo script assíncrono do GTM.
- **Google Analytics:** Referenciada, mas não carregada fisicamente no DOM (provavelmente disparada via GTM).
- **Meta Pixel:** Não encontrada.
- **Supabase (CDN 2.106.2):** Instalada e carregada. Acionada por observador de intersecção (`IntersectionObserver`) ativado quando o usuário rola a página próximo ao formulário.
- **Vercel Analytics:** Não encontrada.
- **LocalStorage:** Instalada e carregada (Grava "theme" e "lgpd_consent_2026").
- **dataLayer:** Instalada e carregada (Alimentada pela função global `trackEvent` injetada em todos os CTAs).

---

## 8. TABELA FINAL DE RISCO DOCUMENTAL

| Documento ou item | Caminho | Situação atual | Público ou interno | Lacuna | Frente responsável |
|---|---|---|---|---|---|
| Identificação do Controlador (CNPJ) | `/os/termos-de-uso.html` | Erro Formal | Interno (OS) | Consta "inscrita sob o CPF" ao invés de CNPJ estruturado. Invisível no modal público. | Frente 2 |
| E-mail de Contato (DPO) | `/os/termos-de-uso.html` | Desconexão de Branding | Interno (OS) | Uso de e-mail `@gmail.com` em vez do domínio oficial corporativo. Invisível na home. | Frente 2 |
| Checkbox Consentimento Form | `index.html` | Ausente | Público | Formulário captura dados sem aceite explícito de LGPD (checkbox obrigatório). | Frente 1 e Frente 2 |
| Botão Recusar/Preferências Cookies | `index.html` (Banner) | Ausente | Público | Não oferece ao usuário o bloqueio real dos scripts GTM/Clarity antes do opt-in. | Frente 1 e Frente 2 |
| Bloqueio Técnico de Rastreio | `index.html` (Script) | Inexistente | Interno | O lazy loader (GTM/Clarity) dispara independentemente da ação no banner LGPD. | Frente 1 |

---

## CONFIRMAÇÕES GERAIS DE AUDITORIA
Confirmo expressamente para o escopo do STG-09 / F2-SITE-03C que:
- Nenhum arquivo foi alterado e nenhuma correção foi salva.
- Nenhuma modificação em HTML/CSS/JS foi realizada.
- Nenhum formulário foi enviado à base de dados.
- Nenhum deploy, push ou commit foi executado.
- Os ecossistemas FluxAI OS™, Make, Webhooks e Proxy permaneceram intactos em absoluto silêncio operacional.
