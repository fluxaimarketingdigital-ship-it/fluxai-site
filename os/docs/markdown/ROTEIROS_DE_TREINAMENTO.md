# ROTEIROS DE TREINAMENTO — FluxAI OS™
## Estrutura de Vídeo-Aulas de Capacitação Técnica e Operacional

---

## 1. Visão Geral da Capacitação
Para garantir a adoção correta do **FluxAI OS™** e evitar falhas humanas de operação ou segurança, a agência utilizará uma trilha de treinamento em vídeo de curta duração (máximo 5 minutos por módulo).
Este documento descreve o roteiro estruturado para cada vídeo.

---

## 2. Trilha 1: Treinamento de Equipe (ADMIN e Operadores)

### Módulo 1: Visão Geral do Sistema (Tempo: 4min)
*   **Objetivo:** Apresentar a arquitetura, as 4 camadas do OS e o fluxo de dados unificado.
*   **Roteiro:**
    1.  *Introdução:* "Sejam bem-vindos ao FluxAI OS™. Este é o cérebro operacional da nossa agência..."
    2.  *Gravação da Tela:* Mostrar o menu lateral e explicar a divisão do Command, Operations e Executive Center.
    3.  *Conceito Chave:* Demonstrar o conceito de que o OS não salva dados localmente de forma direta, toda escrita passa pelo Make.com e validações de consistência.
    4.  *Encerramento:* "No próximo vídeo, veremos como cadastrar nosso primeiro cliente."

### Módulo 2: Cadastro de Cliente e Onboarding (Tempo: 5min)
*   **Objetivo:** Ensinar a cadastrar clientes, configurar contratos e iniciar o pipeline.
*   **Roteiro:**
    1.  *Passo a Passo:* Ir na tela de Onboarding (`onboarding.html`). Preencher os dados de contato do cliente, valores e prazos do contrato.
    2.  *Gatilho do Webhook:* Clicar em "Iniciar Onboarding".
    3.  *Demonstração Drive:* Abrir a conta do Google Drive e mostrar as 7 subpastas criadas automaticamente pelo Make.
    4.  *Verificação no Sheets:* Mostrar a planilha preenchida nas abas de configuração, contratos e serviços.
    5.  *Alerta:* Destacar a importância de copiar os IDs de Analytics e Ads corretamente.

### Módulo 3: Cockpit do Cliente e Demandas (Tempo: 4min)
*   **Objetivo:** Navegar na página de detalhes do cliente e gerenciar demandas diárias.
*   **Roteiro:**
    1.  *Filtro de Contexto:* Mostrar como mudar o seletor na topbar para visualizar o escopo de um cliente específico.
    2.  *Cockpit:* Navegar por `cliente-detalhe.html`, explicando o status do cliente, pendências e a tabela de entregas.
    3.  *Aba de Demandas:* Mostrar como criar demandas, priorizar e atribuir responsáveis no painel `demandas.html`.

### Módulo 4: Motor de IA e Limite Operacional (Tempo: 5min)
*   **Objetivo:** Explicar a governança de cota de IA baseada nos status de conteúdo.
*   **Roteiro:**
    1.  *Content Engine:* Abrir a tela do motor de IA. Explicar como o DNA do cliente serve de contexto.
    2.  *Estados do Post:* Explicar a régua: Rascunho IA (sem consumo) > Revisão (sem consumo) > Aprovado Interno (cota pré-reservada) > Publicado (cota consumida).
    3.  *Ação de Cancelamento:* Mostrar que excluir um post aprovado devolve o crédito imediatamente no cockpit.

### Módulo 5: Publicação Assistida e Ponte WhatsApp (Tempo: 4min)
*   **Objetivo:** Demonstrar o processo manual assistido (sem bots) para Instagram e WhatsApp.
*   **Roteiro:**
    1.  *Instagram:* Abrir o modal de publicação assistida. Mostrar os botões "Copiar Legenda" e "Baixar Mídia no Drive". Demonstrar a publicação rápida na aba do Instagram Web.
    2.  *WhatsApp:* Clicar em "Fazer Contato" em um alerta financeiro. Explicar que a mensagem institucional vai para o clipboard e abre a aba do `wa.me` para envio manual.
    3.  *Logs:* Mostrar que as duas ações registram logs instantaneamente.

### Módulo 6: Monitoramento de Erros e Logs (Tempo: 5min)
*   **Objetivo:** Ensinar a auditar a integridade sistêmica e diagnosticar falhas de webhook.
*   **Roteiro:**
    1.  *Tela de Logs:* Navegar por `logs.html`. Explicar as classificações (INFO, WARNING, CRITICAL).
    2.  *Filtro:* Filtrar por erros de webhook e logs de segurança.
    3.  *Auditoria de Payload:* Abrir a visualização detalhada de um payload JSON para identificar se a falha é no Sheets ou na Meta API.

---

## 3. Trilha 2: Treinamento de Clientes (Portal)

### Módulo 7: Conhecendo o Portal e Solicitando Demandas (Tempo: 3min)
*   **Objetivo:** Ensinar o cliente a acessar a plataforma, enviar briefs e acompanhar o status.
*   **Roteiro:**
    1.  *Primeiro Acesso:* Demonstrar a tela de login e a página inicial do Portal do Cliente (`client-portal.html`).
    2.  *Cadastrar Demanda:* Preencher o formulário simples de demandas com um briefing de exemplo.
    3.  *Status:* Explicar a legenda de status para que o cliente saiba quando a agência está produzindo.

### Módulo 8: Aprovando Entregas e Contratando Extras (Tempo: 4min)
*   **Objetivo:** Ensinar a revisar mídias, enviar refações e aprovar orçamentos extras.
*   **Roteiro:**
    1.  *Revisão:* Clicar em uma peça de conteúdo disponível na tabela de entregas.
    2.  *Aprovar/Reprovar:* Mostrar o botão de aprovar e a caixa de feedback de reprovação.
    3.  *Extra:* Solicitar um serviço extra no formulário. Mostrar como aceitar o orçamento quando o valor for precificado pela agência.
