# PLANO CONTROLADO DE ADEQUAÇÃO DOCUMENTAL (F2-SITE-03D)

**Status:** Rascunho Controlado (Read-Only)
**Objetivo:** Organizar as correções documentais necessárias antes da publicação do site institucional da FluxAI Labs.

---

### Registro Inicial de Nomenclatura
O arquivo gerado na auditoria anterior sob o nome `STG_09_F2C_LEVANTAMENTO_DOCUMENTAL.md` possui nomenclatura incompatível com a Frente 2. Este arquivo não será apagado nem renomeado nesta rodada.
**Recomendação:** Futura reconciliação para `F2_SITE_03C_LEVANTAMENTO_DOCUMENTAL.md`.

---

## A. ALTERAÇÕES DOCUMENTAIS DA FRENTE 2

**Matriz de Avaliação e Correção:**

| Item | Situação atual | Problema | Texto ou ação proposta | Dado pendente | Frente responsável | Bloqueia publicação? |
|---|---|---|---|---|---|---|
| Política de Privacidade | Modal na Home e em `giaas.html` | Falta identificação do Controlador. | Atualizar texto incluindo a Razão Social, CNPJ e contato DPO no topo e fim. | CNPJ, DPO | Frente 2 | Sim |
| Política de Cookies | Inexistente isoladamente | Não há documento/seção explicando as ferramentas de tráfego. | Criar seção explicando uso do Supabase Auth e cookies analíticos de terceiros. | - | Frente 2 | Sim |
| Termos de Uso | Arquivo oculto `/os/termos-de-uso.html` | Exposição de CPF no lugar de CNPJ; e-mail de contato amador. | Substituir CPF. Inserir e-mail institucional na seção de contato. | Razão Social, CNPJ, E-mail | Frente 2 | Sim |
| Identificação Jurídica | Misturada | Falta de clareza de quem é a pessoa jurídica FluxAI. | Inserir bloco de qualificação padrão. | Razão Social, CNPJ, Endereço | Frente 2 | Sim |
| Canal de Privacidade | Genérico/Ausente | Indicação para "nossos canais", e no arquivo estático tem um `@gmail.com`. | Disponibilizar canal de contato oficial para LGPD. | Canal de Privacidade/E-mail | Frente 2 | Sim |
| Aviso do Formulário | Genérico | O footer do formulário é puramente comercial ("não é uma contratação"). Falta Opt-in. | Inserir Aviso Legal e separar checkbox promocional. | - | Frente 2 | Sim |
| Links do Rodapé | "Política de Privacidade" aponta pro modal | Faltam links para Cookies/Termos (se decidirem deixá-los públicos fora do modal). | Adicionar ou consolidar linkagens no footer. | - | Frente 2 | Não |
| Data de Atualização | Despadronizada | Home aponta "Junho/26" e `/os/` aponta "Maio/26". | Uniformizar data para o mês de publicação em todos os textos. | - | Frente 2 | Não |
| Ferramentas de rastreamento | Não declaradas nos textos públicos | Modal/Termos não avisam explicitamente que disparam GTM e Clarity. | Inserir tópico na Política detalhando o GTM e Microsoft Clarity. | - | Frente 2 | Sim |
| Prazo de retenção | Omitido | Não há definição clara de quando os dados são descartados. | Declarar prazo de retenção ou critério. | Prazo de Retenção | Frente 2 | Sim |
| Compartilhamento | Afirma que não há compartilhamento com terceiros | Contraditório com o disparo de dados via proxy e ferramentas analíticas em nuvem. | Declarar as categorias de operadores parceiros de infraestrutura. | Fornecedores | Frente 2 | Sim |

---

## B. DADOS OFICIAIS PENDENTES
- Razão social exata: `[VALIDAR DADO OFICIAL]`
- CNPJ: `[VALIDAR DADO OFICIAL]` *(Nota: Documento pessoal indevidamente utilizado como identificação empresarial — dado omitido deste relatório).*
- Endereço físico institucional: `[VALIDAR DADO OFICIAL]`
- Encarregado de Dados (DPO): `[VALIDAR DADO OFICIAL]`
- Base legal de tratamento adotada para leads: `[VALIDAR DADO OFICIAL]`
- Prazo de retenção dos leads: `[VALIDAR DADO OFICIAL]`
- Operadores/fornecedores parceiros: `[VALIDAR DADO OFICIAL]`
- E-mail institucional de governança: `[VALIDAR DADO OFICIAL]`

---

## C. TEXTOS JÁ UTILIZÁVEIS

### Estrutura Proposta para Identificação Pública:
- **Nome empresarial:** `[VALIDAR DADO OFICIAL]`
- **Nome fantasia:** FluxAI Labs
- **CNPJ:** `[VALIDAR DADO OFICIAL]`
- **Localização institucional:** `[VALIDAR DADO OFICIAL]`
- **Canal de Privacidade e Proteção de Dados:** `[VALIDAR DADO OFICIAL]`

### Opções para o Aviso do Formulário:

**VERSÃO A — contato solicitado pelo visitante:**
> “Ao enviar este formulário, você declara ciência de que os dados informados serão utilizados para analisar sua solicitação e permitir o contato da FluxAI Labs, conforme a Política de Privacidade.”

**VERSÃO B — contato com comunicação promocional futura:**
> “Ao enviar este formulário, você declara ciência de que os dados informados serão utilizados para analisar sua solicitação e permitir o contato da FluxAI Labs, conforme a Política de Privacidade.”
> *[Checkbox Opcional Desmarcado]* "▢ Aceito receber também futuras comunicações promocionais e informativas." *(Nota: Não usar checkbox previamente marcado nem genérico).*

### Conteúdo Funcional Esperado para o Banner de Cookies:
*(Para implementação pela Frente 1 e 2 em conjunto)*
- Texto claro sobre uso e finalidade.
- Botão: **Aceitar cookies**
- Botão: **Rejeitar cookies não necessários**
- Botão/Ação: **Gerenciar preferências**
- Link: **Acesso direto para a Política de Cookies/Privacidade**
- Componente: **Mecanismo visível para rever a escolha posteriormente.**

---

## D. TEXTOS BLOQUEADOS POR FALTA DE DADOS
- O corpo e cabeçalho final da "Política de Privacidade".
- Os tópicos de retenção e encarregado dos "Termos de Uso".
- A página final do Modal de Cookies.

---

## E. DEPENDÊNCIAS ENCAMINHADAS À FRENTE 1
A operacionalidade técnica é responsabilidade da Frente 1:
- Carregamento condicional de GTM.
- Carregamento condicional do Microsoft Clarity.
- Bloqueio de rastreadores antes do consentimento explícito.
- Mecanismo seguro de armazenamento da escolha (`localStorage`/Cookie técnico).
- Interface de revisão da escolha (Opt-out/Opt-in).
- Resolução e mitigação do erro de integridade (SRI) do Supabase JS.
- Gerenciamento de versão do pacote Supabase.
- Configuração de submissão do formulário.
- Roteamento proxy e webhook para o STG-09.
- Gravação nativa no banco `LEADS_SITE`.
- Tratamento de Retorno verdadeiro de sucesso (200) e erro.
- Prevenção de duplicidade de Leads.
- Rastreamento seguro da origem do lead.

---

## F. GATE MÍNIMO PARA PUBLICAÇÃO
O site só poderá ser reconsiderado apto para a publicação Go-Live quando houver a superação unificada dos seguintes critérios:
- Identificação correta do controlador.
- Canal de privacidade ativado.
- Política pública coerente e aprovada.
- Aviso do formulário adequadamente exposto.
- Mecanismo de rejeição dos cookies não necessários totalmente funcional.
- Bloqueio de GTM e Clarity estritamente antes do consentimento.
- Correção comprovada do erro SRI de terceiros.
- Teste real do formulário executado com sucesso.
- Comprovação estática da gravação do lead no Staging e Make.
- Ausência total de erros bloqueantes no console de depuração (F12).

---

## G. CONFIRMAÇÕES FINAIS
Confirmo expressamente sob todas as normas do modo Read-Only que:
- Apenas o documento de planejamento foi criado/sobrescrito no diretório `docs/`.
- Nenhum arquivo operacional (`index.html`, css, ou js) foi alterado.
- Nenhum arquivo do diretório oculto `/os/` foi alterado.
- Nenhum cenário do Make foi alterado ou disparado.
- Nenhum Schedule de disparo foi ligado.
- Nenhum webhook de sistema foi acionado.
- Nenhum formulário público foi enviado.
- Nenhum deploy foi realizado no repositório final.
- Nenhum *push* ou *commit* foi realizado no controle de versão Git local.
- O snapshot `STG-09` de infraestrutura permaneceu completamente intacto.
