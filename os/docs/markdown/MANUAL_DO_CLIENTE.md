# MANUAL DO CLIENTE — FluxAI OS™
## Guia do Portal do Cliente e Relacionamento Operacional

---

## 1. Escopo de Atuação do Cliente (CLIENT)
O perfil **CLIENT** possui acesso exclusivo e restrito ao **Portal do Cliente** (`client-portal.html`). O objetivo desta interface é dar transparência à produção, facilitar a comunicação de novas demandas e simplificar o fluxo de aprovação de entregáveis, sem expor os bastidores operacionais da agência.

> [!IMPORTANT]
> **Restrições Estritas de Governança:**
> Para garantir a segurança dos processos internos e a integridade financeira da agência, o perfil de cliente **NÃO** tem acesso e **NÃO** controla:
> *   O motor de inteligência artificial (GPT, prompts e parametrizações).
> *   O controle de créditos ou limites operacionais de IA (calculados e governados internamente pela FluxAI).
> *   O painel financeiro geral, MRR da agência ou forecasts de faturamento.
> *   A tela de auditoria de logs e governança de usuários.
> *   Contratos internos e margens operacionais.

---

## 2. Acesso ao Portal do Cliente (`client-portal.html`)
O cliente acessa o sistema por meio de suas credenciais de segurança e é direcionado para a sua área exclusiva. A interface exibe:
*   **Nome e Marca Comercial:** Identificação clara da empresa.
*   **KPIs de Consumo (Visualização Simples):** Indica as demandas concluídas no mês e o status de sua cota geral.
*   **Tabela de Entregas Disponibilizadas:** Postagens e materiais criados pela equipe aguardando a revisão final do cliente.
*   **Histórico de Demandas:** Lista de solicitações de conteúdo enviadas e seus respectivos status.

---

## 3. Envio de Novas Demandas
Para registrar uma nova necessidade operacional (ex: postagem especial de evento, campanha pontual):
1.  No Portal do Cliente, localize a seção **Nova Demanda** ou clique em **Solicitar Demanda**.
2.  Preencha o formulário informando:
    *   **Título da Demanda:** Resumo claro (ex: "Post - Dia dos Namorados").
    *   **Descrição / Briefing:** Informações essenciais que a equipe de conteúdo ou a IA precisarão para produzir a peça.
    *   **Prioridade:** Classificação sugerida (alta, média, baixa).
3.  Clique em **Enviar**. A demanda será gravada na planilha Sheets de demandas (`DEMANDAS_CLIENTES`) e o time de operadores será notificado.

---

## 4. Solicitação de Serviços Extras
Serviços extras (aqueles que fogem do escopo original do contrato mensal, como reformulação de logo, pack de criativos adicionais ou landing pages) podem ser solicitados diretamente:
1.  Clique em **Solicitar Serviço Extra** no portal.
2.  Insira o nome do serviço desejado, descrição detalhada do briefing e clique em **Enviar**.
3.  O sistema gerará um log de requisição de serviço extra.
4.  O time de operadores analisará o briefing e o ADMIN enviará o orçamento. O cliente verá o status mudar para `orcamento_enviado` com o valor calculado.
5.  O cliente pode clicar em **Aprovar Orçamento** ou **Recusar Orçamento**. O trabalho só inicia após o cliente aprovar e o Make.com processar a transação.

---

## 5. Aprovação e Reprovação de Entregas
Todas as peças de conteúdo produzidas pela equipe da FluxAI e pré-aprovadas internamente ficam listadas na seção de entregas do portal:
*   **Aprovar Peça:** Se o criativo e a legenda estiverem corretos, clique em **Aprovar**. O status mudará para `aprovado_cliente` e a peça estará disponível para publicação manual assistida pelo operador.
*   **Reprovar Peça:** Se forem necessárias alterações, clique em **Reprovar** e escreva no campo de texto os ajustes solicitados. O status mudará para `reprovado_cliente` e o operador receberá a notificação de refação.

---

## 6. Acompanhamento de Relatórios Mensais
Ao término de cada ciclo mensal, a equipe de métricas compila o relatório de performance. Quando liberado pelo ADMIN, o relatório fica visível no portal:
*   O cliente pode visualizar os KPIs consolidados de alcance, engajamento e conversão de tráfego.
*   Pode ler o diagnóstico executivo escrito pela diretoria e as decisões estratégicas acordadas para o próximo ciclo de crescimento.
*   Pode baixar a versão PDF assinada ou o link dos relatórios consolidados do Google Drive.
