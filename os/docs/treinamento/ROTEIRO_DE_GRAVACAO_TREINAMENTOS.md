# ROTEIRO DE GRAVAÇÃO — VÍDEOS DE TREINAMENTO FluxAI OS™

**Versão:** 1.0  
**Data:** 26 de Maio de 2026  
**Base:** Documentação Oficial FluxAI OS™ v2.0  
**Público:** Equipe Interna FluxAI (Trilha 1) e Clientes (Trilha 2)

> **Regras gerais de gravação:**  
> Use sempre o cliente interno **FluxAI Labs** como exemplo.  
> Nunca mostre dados reais de clientes externos, tokens, webhooks reais ou planilhas com informações sensíveis.  
> Tom: profissional, direto e amigável. Sem termos excessivamente técnicos.

---

# TRILHA INTERNA — EQUIPE FLUXAI

---

## 📹 VÍDEO 01 — Visão Geral e Navegação do OS

**Nome oficial:** Visão Geral e Navegação do FluxAI OS™  
**Público-alvo:** Toda a equipe interna (novos e antigos colaboradores)  
**Objetivo:** Apresentar o sistema, sua lógica de navegação, os perfis de acesso e os três centros principais.  
**Duração sugerida:** 4 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_INTERNO_01_VISAO_GERAL.mp4`

---

### Telas que devem aparecer
- `login.html` — tela de login
- `command-center.html` — painel principal ADMIN
- `operations-center.html` — painel operacional
- `executive-center.html` — painel executivo (ADMIN)
- Sidebar com grupos de menu
- Topbar com seletor de contexto (Master / Labs)
- `access-denied.html` — demonstração rápida de bloqueio

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:30)**  
> "Olá! Neste vídeo você vai conhecer o FluxAI OS™ — o sistema operacional interno da FluxAI. Aqui é onde toda a operação da agência acontece: gestão de clientes, produção de conteúdo, relatórios e controle financeiro. Vamos começar."

**[BLOCO 2 — LOGIN] (0:30–1:00)**  
> "O acesso começa aqui, na tela de login. Você vai usar o e-mail e senha cadastrados pelo administrador. Dependendo do seu perfil — Admin, Operador ou Cliente — você vai ver partes diferentes do sistema. Cada um acessa só o que precisa para o seu trabalho."

**[BLOCO 3 — SIDEBAR E CONTEXTOS] (1:00–2:00)**  
> "Depois de entrar, você vê a barra lateral à esquerda. Ela organiza os módulos em grupos: Núcleo Estratégico, Operação de Clientes, Produção e Governança. O Admin tem acesso a todos. O operador vê apenas a parte operacional. O cliente vê somente o Portal."  
> *(Mostre o seletor de contexto na topbar)*  
> "No topo, o Admin pode alternar entre o contexto Master — visão global — e o contexto Labs, que é o workspace interno da própria FluxAI."

**[BLOCO 4 — OS TRÊS CENTROS] (2:00–3:20)**  
> "O sistema tem três centros principais. O Command Center é o cockpit do dia a dia: alertas, status dos clientes e resumo das ações mais urgentes."  
> *(Navegue para Operations Center)*  
> "O Operations Center é mais técnico. Aqui você acompanha cotas de IA, erros de integração e o barômetro geral da operação."  
> *(Navegue para Executive Center)*  
> "O Executive Center é exclusivo do Admin. Aqui ficam as métricas financeiras, contratos, MRR e indicadores estratégicos. Operadores não têm acesso a esta tela."

**[BLOCO 5 — ACESSO NEGADO] (3:20–3:40)**  
> "Se um usuário tentar acessar uma tela sem permissão, o sistema bloqueia automaticamente e exibe a tela de acesso negado. Isso garante que cada perfil veja apenas o que é seu."

**[BLOCO 6 — ENCERRAMENTO] (3:40–4:00)**  
> "Agora você já conhece a estrutura geral do FluxAI OS™. No próximo vídeo, vamos ver como funciona o fluxo de vendas, cadastro e onboarding de um novo cliente."

---

### Ações demonstradas na tela
1. Fazer login com perfil ADMIN (dados mockados do FluxAI Labs)
2. Mostrar a sidebar completa com todos os grupos
3. Clicar em cada um dos três centros
4. Trocar o contexto entre Master e Labs na topbar
5. Demonstrar a tela de acesso negado brevemente

### Pontos de atenção
- Mostrar o seletor de contexto claramente — muita gente não percebe essa funcionalidade
- Destacar que CLIENT não vê a sidebar completa

### O que NÃO fazer
- Não mostrar dados financeiros reais
- Não exibir e-mails ou senhas reais
- Não abrir o Executive Center com dados de cliente externo

---

---

## 📹 VÍDEO 02 — Fluxo de Vendas, Cadastro e Onboarding

**Nome oficial:** Fluxo de Vendas, Cadastro e Onboarding de Cliente  
**Público-alvo:** Admin e Operadores sênior  
**Objetivo:** Demonstrar o ciclo completo desde a captura de um lead até o início da operação ativa do cliente.  
**Duração sugerida:** 5 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_INTERNO_02_CADASTRO_ONBOARDING.mp4`

---

### Telas que devem aparecer
- `leads.html`
- `clientes.html`
- `onboarding.html`
- `cliente-detalhe.html` (aba de contrato e Drive)

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:30)**  
> "Neste vídeo você vai ver como um lead vira cliente dentro do FluxAI OS™. Do primeiro contato até o início da operação real. Vamos acompanhar o processo completo."

**[BLOCO 2 — MÓDULO DE LEADS] (0:30–1:30)**  
> "Tudo começa aqui, no módulo de Leads. Quando alguém preenche o formulário do site institucional, ele aparece automaticamente nesta lista com data, origem e status."  
> *(Mostre um lead com status 'novo')*  
> "O comercial qualifica o lead aqui mesmo. Quando o negócio avança, o status muda para 'em negociação' e depois para 'convertido'."

**[BLOCO 3 — CADASTRO DO CLIENTE] (1:30–2:30)**  
> "Depois de convertido, o cliente é cadastrado no módulo Clientes. Preenchemos nome da empresa, segmento, responsável, dados de contato e o link da pasta no Google Drive — que é onde todos os arquivos pesados ficam guardados."  
> *(Mostre o formulário de cadastro com dados do FluxAI Labs)*  
> "O client_id é gerado automaticamente. Ele é a chave que conecta este cliente a todos os outros módulos do sistema."

**[BLOCO 4 — ONBOARDING ESTRATÉGICO] (2:30–4:00)**  
> "Com o cliente cadastrado, abrimos o Onboarding Estratégico. Aqui preenchemos o DNA de marca do cliente: tom de voz, padrões desejados, anti-padrões, objetivos e restrições."  
> *(Preencha os campos com dados do FluxAI Labs)*  
> "Essas informações são usadas pelo Motor de IA na hora de gerar conteúdo. Quanto mais completo o DNA, mais preciso o resultado."  
> "Também vinculamos o contrato — valor mensal, data de início, limite de gerações de IA contratadas e os links das pastas do Drive organizados por cliente."

**[BLOCO 5 — INÍCIO DA OPERAÇÃO] (4:00–4:40)**  
> "Depois do onboarding preenchido, o cliente já aparece no cockpit de projetos. A operação pode começar. O próximo vídeo mostra exatamente como funciona esse cockpit dia a dia."

**[BLOCO 6 — ENCERRAMENTO] (4:40–5:00)**  
> "Esses são os três passos fundamentais: Lead → Cadastro → Onboarding. Simples, rápido e tudo dentro do sistema."

---

### Ações demonstradas na tela
1. Abrir o módulo Leads e mostrar um lead mockado
2. Alterar status de 'novo' para 'convertido'
3. Navegar para Clientes e abrir o formulário de cadastro
4. Preencher um novo cliente com dados do FluxAI Labs
5. Abrir o Onboarding e preencher os campos de DNA
6. Mostrar o cliente já visível no cockpit

### Pontos de atenção
- Reforçar que o link do Drive é obrigatório — sem ele, a publicação assistida não funciona
- Mostrar que o DNA afeta diretamente a qualidade da IA

### O que NÃO fazer
- Não usar dados de clientes externos reais
- Não mostrar colunas sensíveis da planilha Sheets aberta em outra aba

---

---

## 📹 VÍDEO 03 — Cockpit de Projetos e Gestão de Demandas

**Nome oficial:** Cockpit de Projetos e Gestão de Demandas  
**Público-alvo:** Operadores  
**Objetivo:** Mostrar como acompanhar o status de um projeto, registrar demandas e atualizar o histórico operacional.  
**Duração sugerida:** 4 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_INTERNO_03_COCKPIT_DEMANDAS.mp4`

---

### Telas que devem aparecer
- `clientes.html`
- `cliente-detalhe.html` (abas: Visão Geral, Demandas, Histórico)
- `demandas.html`

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:20)**  
> "Neste vídeo você vai ver como funciona o cockpit de um projeto e como gerenciar as demandas do dia a dia."

**[BLOCO 2 — LISTAGEM DE CLIENTES] (0:20–1:00)**  
> "Na tela de Clientes você tem uma visão rápida de todos os projetos ativos: status, plano contratado, cotas disponíveis e alertas pendentes."  
> *(Mostre o card do FluxAI Labs)*  
> "Um ícone vermelho ou amarelo indica que há algo para resolver — pode ser uma aprovação pendente, uma cota quase esgotada, ou uma cobrança em atraso."

**[BLOCO 3 — COCKPIT DO CLIENTE] (1:00–2:30)**  
> "Clicando no cliente, abrimos o cockpit completo do projeto."  
> *(Mostre as abas)*  
> "Na aba Visão Geral, vemos o resumo: contratos, DNA, links do Drive e cotas restantes. Na aba Demandas, registramos e acompanhamos cada pauta."  
> *(Abra a aba Demandas)*  
> "Cada demanda tem título, tipo, prazo e status. Os status seguem uma lógica de fluxo: solicitado → em produção → aguardando aprovação → aprovado → publicado."

**[BLOCO 4 — GESTÃO DE DEMANDAS CENTRALIZADA] (2:30–3:30)**  
> "Para uma visão global de todas as pautas de todos os clientes ao mesmo tempo, usamos o módulo Demandas."  
> *(Navegue para demandas.html)*  
> "Aqui o operador vê o backlog completo, pode filtrar por cliente, por status ou por data, e atualiza o andamento sem precisar entrar em cada projeto separadamente."

**[BLOCO 5 — ENCERRAMENTO] (3:30–4:00)**  
> "Esse é o fluxo de gestão de demandas. Tudo registrado, tudo rastreável, tudo dentro do sistema. No próximo vídeo, vamos ver como o Motor de IA gera conteúdo a partir dessas pautas."

---

### Ações demonstradas na tela
1. Mostrar listagem de clientes com indicadores de status
2. Clicar em FluxAI Labs e navegar pelas abas do cockpit
3. Criar uma nova demanda mockada com dados de pauta
4. Alterar o status de uma demanda
5. Navegar para o módulo Demandas e mostrar o backlog global

### Pontos de atenção
- Enfatizar que o status da demanda avança manualmente — o operador é responsável por atualizar
- Mostrar que demandas do cliente também aparecem quando ele envia pelo Portal

### O que NÃO fazer
- Não mostrar demandas com nomes de clientes reais externos

---

---

## 📹 VÍDEO 04 — Motor de IA e Limite Operacional

**Nome oficial:** Motor de Criação de IA e Controle de Limite Operacional  
**Público-alvo:** Operadores  
**Objetivo:** Demonstrar como gerar conteúdo com IA, revisar o rascunho, aprovar internamente e monitorar as cotas contratadas.  
**Duração sugerida:** 5 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_INTERNO_04_IA_LIMITE_OPERACIONAL.mp4`

---

### Telas que devem aparecer
- `content-engine.html`
- Painel de status de cotas no cockpit do cliente
- `logs.html` (filtro por ação de IA)

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:20)**  
> "O Motor de Criação de IA é uma das ferramentas mais poderosas do FluxAI OS™. Neste vídeo você vai aprender a gerar, revisar e aprovar conteúdo com responsabilidade."

**[BLOCO 2 — ACESSANDO O MOTOR] (0:20–1:30)**  
> "No módulo Motor de Conteúdo, selecione o cliente para carregar automaticamente o DNA de marca dele."  
> *(Selecione FluxAI Labs)*  
> "Com o cliente selecionado, defina o tipo de conteúdo — legenda de feed, roteiro de Reels, texto para Stories — e clique em Gerar."  
> "O sistema monta o prompt internamente usando as diretrizes do DNA e solicita a geração. O resultado aparece como rascunho."

**[BLOCO 3 — REVISÃO INTERNA] (1:30–2:30)**  
> "O rascunho nunca é publicado automaticamente. O operador lê, ajusta se necessário, e aprova internamente clicando em Aprovar para Revisão."  
> *(Demonstre a aprovação interna)*  
> "Após aprovado internamente, o conteúdo fica disponível no portal do cliente para aprovação final — que vamos ver no vídeo da trilha de clientes."

**[BLOCO 4 — CONTROLE DE COTAS] (2:30–3:45)**  
> "Cada cliente tem um limite de gerações de IA contratadas por mês. Esse limite fica visível no cockpit do projeto."  
> *(Navegue para o cockpit e mostre o indicador de cotas)*  
> "Quando a cota está verde, tudo certo. Quando fica amarela, estamos próximos do limite. Quando fica vermelha, o sistema bloqueia novas gerações automaticamente."  
> "Isso protege o custo da agência e deixa claro para o cliente o que está incluso no contrato."

**[BLOCO 5 — LOGS DE IA] (3:45–4:30)**  
> "Toda geração de IA fica registrada nos Logs Operacionais. Você pode filtrar por tipo de ação e ver exatamente quando foi gerado, por qual operador e com qual status."

**[BLOCO 6 — ENCERRAMENTO] (4:30–5:00)**  
> "Gerar com inteligência, revisar com atenção, publicar com controle. Esse é o ciclo do Motor de Conteúdo."

---

### Ações demonstradas na tela
1. Selecionar cliente FluxAI Labs no Content Engine
2. Gerar um rascunho de legenda mockado
3. Mostrar o resultado e aprovar internamente
4. Navegar para o cockpit e mostrar o indicador de cotas
5. Abrir os logs e filtrar por ação de IA

### Pontos de atenção
- Reforçar que o cliente não acessa o Motor de IA — só vê o resultado aprovado
- Mostrar claramente o que acontece quando a cota está esgotada

### O que NÃO fazer
- Não mostrar prompts internos completos em tela por tempo prolongado
- Não demonstrar geração com dados pessoais de clientes externos

---

---

## 📹 VÍDEO 05 — Publicação Assistida e Cobranças

**Nome oficial:** Publicação Assistida e Gestão de Cobranças  
**Público-alvo:** Operadores  
**Objetivo:** Demonstrar o processo completo de publicação manual assistida e como registrar cobranças e inadimplências via WhatsApp assistido.  
**Duração sugerida:** 4 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_INTERNO_05_PUBLICACAO_ASSISTIDA_COBRANCAS.mp4`

---

### Telas que devem aparecer
- `content-engine.html` (post com status "aprovado_cliente")
- Modal de publicação assistida
- Pasta do Drive (demonstração rápida)
- `contracts-finance.html` (lista de inadimplências — somente ADMIN)

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:20)**  
> "Neste vídeo você vai ver como funciona a publicação assistida — o processo pelo qual um conteúdo aprovado chega às redes sociais de forma controlada e documentada."

**[BLOCO 2 — CONTEÚDO APROVADO] (0:20–1:00)**  
> "Quando o cliente aprova um criativo pelo Portal, o status muda para 'aprovado pelo cliente'. O operador é notificado e acessa o Motor de Conteúdo para publicar."  
> *(Mostre um post com esse status)*

**[BLOCO 3 — MODAL DE PUBLICAÇÃO ASSISTIDA] (1:00–2:30)**  
> "Clicando em Publicar, abrimos o modal de publicação assistida."  
> *(Abra o modal)*  
> "Aqui temos tudo que precisamos: a legenda gerada, o botão de copiar, o link para a mídia no Drive e o link direto para a rede social."  
> "Primeiro: copiamos a legenda. Segundo: abrimos o Drive e baixamos a mídia. Terceiro: vamos ao Instagram, criamos a publicação e colamos a legenda. Depois de publicar, voltamos aqui e clicamos em Confirmar Publicação."  
> "Esse clique registra a publicação nos logs e consome uma cota de IA do cliente."

**[BLOCO 4 — COBRANÇA VIA WHATSAPP ASSISTIDO] (2:30–3:30)**  
> "Para cobranças de inadimplência, o processo é igualmente controlado."  
> *(Navegue para contracts-finance.html se for ADMIN)*  
> "O Admin visualiza os clientes em atraso e clica no botão de cobrança. O sistema monta uma mensagem profissional automaticamente e abre o WhatsApp Web já com o texto preenchido."  
> "O operador revisa a mensagem, ajusta se necessário, e envia manualmente. Nada é enviado automaticamente — tudo passa pelo olhar humano."

**[BLOCO 5 — ENCERRAMENTO] (3:30–4:00)**  
> "Publicar com responsabilidade, cobrar com profissionalismo. Esse é o padrão da FluxAI. Tudo documentado, nada automático onde não deve ser."

---

### Ações demonstradas na tela
1. Mostrar post com status "aprovado_cliente"
2. Abrir o modal de publicação assistida
3. Copiar a legenda e mostrar o link do Drive
4. Clicar em Confirmar Publicação
5. Mostrar o log gerado
6. Mostrar o botão de cobrança via WhatsApp (sem enviar de verdade)

### Pontos de atenção
- Reforçar que o CONFIRMAR é obrigatório — sem ele, a cota não é consumida e o log não é gerado
- Mencionar que o WhatsApp abre o Web, não envia automaticamente

### O que NÃO fazer
- Não mostrar número de telefone real de cliente
- Não abrir Instagram real durante a gravação se houver dados de cliente visível

---

---

## 📹 VÍDEO 06 — Diagnóstico de Erros, Webhooks e Rollbacks

**Nome oficial:** Diagnóstico de Erros, Webhooks e Plano de Contingência  
**Público-alvo:** Admin e Operadores avançados  
**Objetivo:** Mostrar como identificar erros nos logs, entender a diferença entre eventos reais e simulados, e acionar o plano de contingência.  
**Duração sugerida:** 5 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_INTERNO_06_LOGS_ERROS_ROLLBACKS.mp4`

---

### Telas que devem aparecer
- `logs.html`
- Filtros por tipo (CRITICAL, WARNING, WEBHOOK)
- Exemplo de payload JSON mockado
- `PLANO_DE_CONTINGENCIA.pdf` aberto rapidamente

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:20)**  
> "Nenhum sistema é infalível. Este vídeo mostra como identificar e resolver erros rapidamente usando os Logs Operacionais do FluxAI OS™."

**[BLOCO 2 — MÓDULO DE LOGS] (0:20–1:30)**  
> "O módulo de Logs registra tudo: ações de usuário, eventos de webhook, erros de integração e alertas de segurança."  
> *(Abra logs.html)*  
> "Você pode filtrar por nível: INFO é informativo, WARNING é um aviso, CRITICAL é algo que precisa de atenção imediata."  
> *(Aplique o filtro CRITICAL)*  
> "Registros CRITICAL costumam indicar falha em webhook do Make, erro de conexão com o Supabase, ou tentativa de acesso não autorizado."

**[BLOCO 3 — EVENTOS REAIS VS SIMULADOS] (1:30–2:30)**  
> "Cada log mostra se o evento foi REAL ou SIMULADO. Eventos simulados são testes internos — aparecem sem efeito real na operação. Eventos reais foram disparados de verdade e têm impacto nas integrações."  
> *(Mostre um exemplo de cada tipo)*  
> "Essa distinção é importante para não confundir um erro de teste com um erro de produção."

**[BLOCO 4 — LENDO UM PAYLOAD DE ERRO] (2:30–3:30)**  
> "Quando um webhook falha, o log guarda o payload completo da tentativa."  
> *(Mostre um exemplo de payload JSON mockado — sem webhook real)*  
> "Leia o campo 'reason' primeiro: ele explica o motivo do erro. Depois verifique o campo 'status_code' — 500 é erro do servidor, 400 é dado inválido enviado."  
> "Com essa informação, você consegue resolver a maioria dos problemas sem precisar de suporte técnico."

**[BLOCO 5 — ROLLBACK E CONTINGÊNCIA] (3:30–4:30)**  
> "Se um webhook falhou e precisa ser reprocessado, o processo é simples: corrija o dado com problema no Sheets, reinicie o cenário no Make e monitore o próximo log."  
> "Para situações mais graves — como queda de uma API inteira — temos o Plano de Contingência documentado."  
> *(Mostre o PDF rapidamente)*  
> "Ele descreve o procedimento para cada tipo de incidente: Make offline, Supabase pausado, Sheets com erro, entre outros."

**[BLOCO 6 — ENCERRAMENTO] (4:30–5:00)**  
> "Saber ler um log é uma habilidade fundamental. Com prática, você vai identificar e resolver a maioria dos problemas em menos de cinco minutos."

---

### Ações demonstradas na tela
1. Abrir o módulo Logs
2. Aplicar filtro CRITICAL e mostrar os resultados
3. Mostrar a diferença entre log REAL e SIMULADO
4. Clicar em um log e expandir o payload JSON mockado
5. Abrir rapidamente o Plano de Contingência em PDF

### Pontos de atenção
- Usar apenas payloads mockados — nunca mostrar webhook URL real
- Deixar claro que SIMULATED = sem efeito real na operação

### O que NÃO fazer
- Não mostrar URLs reais de webhook do Make em tela
- Não abrir a seção de configurações do Make durante a gravação

---
---

# TRILHA CLIENTE — PORTAL DO CLIENTE

---

## 📹 VÍDEO 07 — Portal do Cliente e Solicitação de Demandas

**Nome oficial:** Portal do Cliente — Primeiro Acesso e Solicitação de Demandas  
**Público-alvo:** Clientes da FluxAI  
**Objetivo:** Guiar o cliente no seu primeiro acesso ao portal, mostrar como acompanhar o trabalho e como enviar uma nova solicitação.  
**Duração sugerida:** 3 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_CLIENTE_01_PORTAL_DEMANDAS.mp4`

---

### Telas que devem aparecer
- `login.html` (perfil CLIENT)
- `client-portal.html`
- Modal de nova demanda
- Modal de serviço extra

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:20)**  
> "Bem-vindo ao portal exclusivo da FluxAI. Neste vídeo você vai aprender tudo que precisa saber para usar o seu espaço de cliente com facilidade."

**[BLOCO 2 — LOGIN DO CLIENTE] (0:20–0:50)**  
> "O acesso é feito com o e-mail e senha que a equipe da FluxAI enviou para você no onboarding."  
> *(Mostre o login com dados mockados)*  
> "Se precisar redefinir a senha, entre em contato com seu gestor de conta."

**[BLOCO 3 — VISÃO GERAL DO PORTAL] (0:50–1:40)**  
> "Dentro do portal, você vê tudo que a FluxAI está produzindo para você: conteúdos em andamento, itens aguardando sua aprovação, relatórios liberados e histórico de entregas."  
> *(Mostre o portal com dados do FluxAI Labs)*  
> "A parte mais importante é a seção 'Aguardando sua Aprovação'. Sempre que tiver algo lá, precisamos da sua resposta para continuar."

**[BLOCO 4 — NOVA DEMANDA] (1:40–2:30)**  
> "Para solicitar uma nova pauta ou conteúdo especial, clique em Nova Solicitação."  
> *(Abra o modal de nova demanda)*  
> "Preencha o tipo de conteúdo, descreva o que você precisa com detalhes e informe a data ideal. Quanto mais informação você der, mais rápido e preciso será o resultado."  
> "Depois de enviar, a solicitação aparece na lista com o status 'solicitado' e a equipe da FluxAI já recebe a notificação."

**[BLOCO 5 — ENCERRAMENTO] (2:30–3:00)**  
> "É simples assim. Tudo no mesmo lugar, com rastreamento completo. No próximo vídeo você vai aprender como aprovar entregas e relatórios."

---

### Ações demonstradas na tela
1. Login com perfil CLIENT usando FluxAI Labs como exemplo
2. Navegação pelo portal mostrando as seções principais
3. Abrir o modal de nova demanda e preencher um exemplo
4. Submeter e mostrar a demanda na lista com status "solicitado"

### Pontos de atenção
- Usar linguagem completamente não técnica neste vídeo
- Destacar a seção de "Aguardando Aprovação" com ênfase

### O que NÃO fazer
- Não mostrar nenhuma tela interna da agência (sidebar completa, módulos de operação)
- Não mencionar Make, Supabase, Sheets ou qualquer ferramenta técnica

---

---

## 📹 VÍDEO 08 — Aprovação de Criativos, Relatórios e Serviços Extras

**Nome oficial:** Como Aprovar Criativos, Relatórios e Serviços Extras  
**Público-alvo:** Clientes da FluxAI  
**Objetivo:** Mostrar como o cliente aprova ou reprova entregas, visualiza relatórios e solicita serviços avulsos.  
**Duração sugerida:** 4 minutos  
**Arquivo final:** `FLUXAI_OS_TREINAMENTO_CLIENTE_02_APROVACOES_RELATORIOS_EXTRAS.mp4`

---

### Telas que devem aparecer
- `client-portal.html`
- Card de criativo com botões Aprovar / Reprovar
- Modal de feedback de reprovação
- Seção de relatório mensal liberado
- Modal de serviço extra

---

### Script de Fala

**[BLOCO 1 — ABERTURA] (0:00–0:20)**  
> "A sua aprovação é essencial para que o trabalho avance. Neste vídeo você vai ver como aprovar criativos, dar feedback e visualizar os seus relatórios mensais."

**[BLOCO 2 — APROVAÇÃO DE CRIATIVO] (0:20–1:30)**  
> "Quando a equipe da FluxAI prepara um conteúdo e está pronto para você ver, ele aparece aqui, na seção de aprovações."  
> *(Mostre um card de criativo mockado)*  
> "Você pode ver o texto da publicação e o link para a mídia no Drive, caso haja imagem ou vídeo."  
> "Se estiver ótimo, clique em Aprovar. A equipe recebe a confirmação e segue com a publicação."  
> *(Demonstre o clique em Aprovar)*  
> "Se precisar de ajuste, clique em Reprovar e descreva o que quer mudar. Seja específico — isso agiliza a revisão."  
> *(Demonstre a reprovação com feedback mockado)*

**[BLOCO 3 — RELATÓRIO MENSAL] (1:30–2:30)**  
> "Todo mês, após a revisão interna, a FluxAI libera um relatório com os resultados do seu projeto."  
> *(Mostre a seção de relatórios)*  
> "Clique em Visualizar para abrir o relatório completo. Ele traz os principais indicadores do período, análise do que funcionou e as recomendações para o próximo mês."  
> "Se tiver dúvidas sobre os números, entre em contato com seu gestor de conta."

**[BLOCO 4 — SERVIÇO EXTRA] (2:30–3:20)**  
> "Às vezes você precisa de algo além do que está no plano contratado — uma apresentação especial, um post urgente, um vídeo institucional."  
> *(Abra o modal de serviço extra)*  
> "Use a opção Solicitar Serviço Extra para descrever o que precisa. A equipe vai avaliar, montar um orçamento e te enviar para aprovação antes de começar."

**[BLOCO 5 — O QUE O CLIENTE NÃO ACESSA] (3:20–3:40)**  
> "Uma observação importante: o portal do cliente é uma área exclusiva e simplificada. Você não acessa dados financeiros da agência, nem as configurações internas do sistema. Seu foco é só o que importa para o seu projeto."

**[BLOCO 6 — ENCERRAMENTO] (3:40–4:00)**  
> "Aprovar, dar feedback, acompanhar resultados. Simples e direto ao ponto. A FluxAI cuida de todo o resto para que você foque no seu negócio."

---

### Ações demonstradas na tela
1. Mostrar um card de criativo e clicar em Aprovar
2. Mostrar outro card e clicar em Reprovar com feedback
3. Navegar para a seção de relatórios e abrir um relatório mockado
4. Abrir o modal de serviço extra e preencher uma solicitação
5. Mostrar que o menu lateral do cliente é simplificado (sem acesso a módulos internos)

### Pontos de atenção
- Deixar claro que Aprovar = liberar para publicação
- Explicar com clareza o que é um Serviço Extra (cobrado separado)
- Reforçar que o cliente não vê dados financeiros da agência

### O que NÃO fazer
- Não mostrar a sidebar completa com todos os módulos durante a gravação do perfil cliente
- Não mencionar ferramentas internas como Make ou Sheets
- Não abrir abas internas do sistema durante o modo de gravação do Portal

---

*Documento gerado em 26 de Maio de 2026. Base: Documentação Oficial FluxAI OS™ v2.0.*
