# MANUAL OPERACIONAL DO FLUXAI OS™

## 1. O que é o FluxAI OS™
O FluxAI OS™ é a infraestrutura operacional interna da FluxAI Labs para organizar crescimento, clientes, conteúdo, demandas, dados, relatórios, IA, serviços extras e decisões.
*Este sistema não é um software genérico de mercado (SaaS) nem se apresenta como "agência".* Ele está posicionado estrategicamente como o nosso **Sistema Operacional de Crescimento e Gestão Estratégica**.

## 2. Como chamar o sistema
**Nome oficial:** FluxAI OS™
**Forma de explicar:** Sistema Operacional de Crescimento da FluxAI Labs.
**Uso comercial:** Infraestrutura proprietária da FluxAI para organizar estratégia, conteúdo, dados, automação, operação e tomada de decisão.
**Pronúncia:** FluxAI Ó-És.

## 3. Quem usa o FluxAI OS™

| Perfil | Nível de Acesso | Responsabilidades Principais |
| :--- | :--- | :--- |
| **ADMIN** | Máximo (Master) | Controla sistema, usuários, logs, contratos, financeiro, relatórios, IA, visão global e governança. |
| **OPERATOR** | Intermediário | Opera conteúdo, demandas, clientes, planejamento e rotina operacional, conforme permissão específica. |
| **CLIENT** | Restrito | Acessa apenas o portal do cliente, demandas, briefing, solicitações e aprovações liberadas. |

## 4. O que o CLIENT pode fazer
- Acessar o Client Portal;
- Enviar demandas;
- Enviar briefings;
- Solicitar serviço extra;
- Acompanhar status quando liberado;
- Aprovar/reprovar entrega quando disponibilizada;
- Visualizar relatórios liberados.

## 5. O que o CLIENT NÃO pode fazer
- Não acessa áreas internas;
- Não acessa logs globais;
- Não gera IA;
- Não libera crédito IA;
- Não vê prompts internos;
- Não vê webhooks;
- Não vê dados de outros clientes;
- Não altera contrato;
- Não altera escopo;
- Não acessa visão global interna.

## 6. Módulos homologados

**1. Login / Acesso / Redirecionamento**
*   **Função:** Ponto de entrada, autenticação e roteamento inteligente (RBAC).
*   **Quem usa:** ADMIN, OPERATOR, CLIENT.
*   **Dados:** Email, Senha, Sessão Supabase.
*   **Cuidado operacional:** Proteção rigorosa do Token. Fallback para Client Portal.
*   **Status pós-Fase 04:** Homologado e funcional.

**2. Command Center**
*   **Função:** Visão panorâmica técnica da agência e conexões (Webhooks/Supabase).
*   **Quem usa:** ADMIN, OPERATOR.
*   **Dados:** Status de conexão, Logs macro, Atalhos rápidos.
*   **Cuidado operacional:** Não exibir logs sensíveis sem redação.
*   **Status pós-Fase 04:** Homologado e funcional.

**3. Client Portal**
*   **Função:** Interface unificada e limpa para o cliente interagir com a FluxAI.
*   **Quem usa:** CLIENT (e ADMIN para preview).
*   **Dados:** Entregas pendentes, botão de aprovação, atalhos de relatórios.
*   **Cuidado operacional:** Prevenção de IDOR (cliente X não pode ver dados do Y).
*   **Status pós-Fase 04:** Homologado com segurança reforçada.

**4. Onboarding**
*   **Função:** Cadastramento de novos clientes e configuração inicial.
*   **Quem usa:** ADMIN, OPERATOR.
*   **Dados:** Nome, Empresa, Contatos, Setup Técnico.
*   **Cuidado operacional:** Evitar falso sucesso de webhooks não registrados.
*   **Status pós-Fase 04:** Homologado e consistente.

**5. Content Engine**
*   **Função:** Geração e gestão de conteúdo operado por Inteligência Artificial.
*   **Quem usa:** ADMIN, OPERATOR.
*   **Dados:** Prompts, Rascunhos, DNA da Marca.
*   **Cuidado operacional:** Apenas o fluxo aprovado consome recursos permanentemente.
*   **Status pós-Fase 04:** Homologado e blindado.

**6. CRM / Leads / Demandas**
*   **Função:** Recepção de leads do site e kanban de tarefas internas/clientes.
*   **Quem usa:** ADMIN, OPERATOR (CLIENT envia via webhook/forms).
*   **Dados:** Contatos de Leads, Escopo da Demanda, Prioridades.
*   **Cuidado operacional:** Organização de status rigorosa para não travar o fluxo.
*   **Status pós-Fase 04:** Homologado (IDs corrigidos e duplicação resolvida).

**7. Logs / Auditoria**
*   **Função:** Rastreabilidade completa de "quem fez o quê, e quando".
*   **Quem usa:** Somente ADMIN.
*   **Dados:** Telemetria de cliques, trocas de status, falhas de sistema, edição de perfil.
*   **Cuidado operacional:** Payload sensível (senhas/tokens) é automaticamente redigido.
*   **Status pós-Fase 04:** Homologado, protegido com try/catch para corrupção de JSON.

**8. Serviços Extras / Contratos & Financeiro**
*   **Função:** Governança financeira, lançamento de upsells e escopos adicionais.
*   **Quem usa:** Somente ADMIN.
*   **Dados:** Valores, Escopo, Histórico de faturamento extra.
*   **Cuidado operacional:** Renderização HTML rigorosamente segura (sem innerHTML dinâmico).
*   **Status pós-Fase 04:** Homologado e blindado (CodeQL aprovado).

**9. IA Créditos / Governança GPT**
*   **Função:** Monitoramento do limite operacional contratado e consumo de processamento.
*   **Quem usa:** ADMIN.
*   **Dados:** Créditos totais, consumidos e disponíveis por projeto.
*   **Cuidado operacional:** Não tratar como "moedinhas", mas como governança de escopo.
*   **Status pós-Fase 04:** Homologado.

**10. Relatórios / Camada Executiva**
*   **Função:** Visualização gerencial, diagnósticos mensais e tomada de decisão estratégica.
*   **Quem usa:** ADMIN (e CLIENT apenas na visão final de leitura).
*   **Dados:** Alcance, Leads, Diagnóstico, Próximos Passos.
*   **Cuidado operacional:** Rascunhos nunca são liberados automaticamente sem revisão humana.
*   **Status pós-Fase 04:** Homologado e estabilizado (Modulo Bias resolvido).

## 7. Como cadastrar o primeiro cliente
**Passo a Passo:**
1. Criar `client_id` e `project_id`.
2. Preencher na planilha `CLIENTES_CONFIG`.
3. Preencher na planilha `SERVICOS_CLIENTES`.
4. Criar ou confirmar contrato na planilha `CONTRATOS_CLIENTES`.
5. Registrar DNA estratégico nas planilhas `CLIENTES_ESTRATEGIA` / `DNA_CLIENTE_GPT`.
6. Criar estrutura do cliente no Google Drive.
7. Vincular links criados na planilha `CLIENTES_ARQUIVOS`.
8. Definir o modo de coleta: **manual** ou **API**.
9. Configurar rotas autorizadas na planilha `ROTAS_AUTOMACOES`.
10. Ativar cliente no OS.

## 8. Dados obrigatórios por cliente (Checklist)
- [ ] `client_id`
- [ ] `project_id`
- [ ] Nome do cliente
- [ ] Responsável
- [ ] E-mail
- [ ] WhatsApp
- [ ] Site
- [ ] Instagram
- [ ] Facebook/Page ID (se houver)
- [ ] Instagram Business ID (se houver)
- [ ] Meta Ad Account ID (se houver)
- [ ] GA4 Property ID (se houver)
- [ ] GTM ID (se houver)
- [ ] Clarity Project ID (se houver)
- [ ] Search Console Property (se houver)
- [ ] Status do cliente
- [ ] Status do token
- [ ] Serviços contratados
- [ ] Modo de coleta
- [ ] Relatório incluir: sim/não

## 9. Google Drive
O Google Drive funciona como o repositório físico, guardando arquivos, documentos, contratos, identidade visual, assets, entregas pesadas e relatórios.

**Estrutura padrão obrigatória por cliente:**
*   `00_ADMIN_CLIENTE` (Contratos e aditivos)
*   `01_ONBOARDING` (Questionários iniciais)
*   `02_CONTRATO_E_ESCOPO` (Definição detalhada)
*   `03_DNA_E_ESTRATEGIA` (Tom de voz e planejamento macro)
*   `04_IDENTIDADE_VISUAL` (Logos, fontes e cores)
*   `05_CONTEUDO` (Rascunhos, copys longas e textos aprovados)
*   `06_CAMPANHAS_E_TRAFEGO` (Assets de mídia paga)
*   `07_METRICAS_E_RELATORIOS` (PDFs finais gerados)
*   `08_ENTREGAS` (Pasta final para aprovação)
*   `09_ARQUIVOS_RECEBIDOS` (Materiais enviados pelo cliente)
*   `10_BACKUP`

## 10. Google Sheets
O Google Sheets funciona como banco de dados relacional e operacional leve da FluxAI.
*   `CLIENTES_CONFIG`: Dados cadastrais e IDs técnicos.
*   `SERVICOS_CLIENTES`: Mapeamento do escopo de serviço ativo.
*   `ROTAS_AUTOMACOES`: Autorização de webhooks (White-list).
*   `CLIENTES_ESTRATEGIA`: Planejamento tático.
*   `CLIENTES_ARQUIVOS`: Repositório de links do Drive.
*   `CONTRATOS_CLIENTES`: Histórico financeiro e recorrente.
*   `SERVICOS_EXTRAS_CLIENTES`: Upsells e orçamentos.
*   `DNA_CLIENTE_GPT`: Diretrizes de voz para o Content Engine.
*   `IA_CREDITOS_CLIENTE`: Governança de escopo.
*   `IA_GERACOES_CONTROLE`: Histórico de consumo do Motor.
*   `PLANEJAMENTO_CONTEUDO`: Base de pautas semanais.
*   `CALENDARIO_POSTAGENS`: Datas de go-live.
*   `GPT_GERACOES_LOG`: Auditoria técnica de prompts e respostas.
*   `LEADS_CLIENTES`: Funil de vendas dos clientes.
*   `LEADS_SITE`: Funil de vendas interno (Agência).
*   `DEMANDAS_CLIENTES`: Kanban consolidado.
*   `CATALOGO_SERVICOS_FLUXAI`: Tabela de preços e produtos padronizados.
*   `ANALISE_MENSAL_CLIENTE`: Resultados quantitativos e qualitativos.
*   `KPI_EXECUTIVO`: Dados para a Camada Executiva (Master).

## 11. Make e Automações
O Make **executa os fluxos e sincronizações, mas não decide sozinho**. O motor lógico e de decisão permanece na FluxAI e no OS.
*   Os relatórios mensais **nunca** são enviados automaticamente ao cliente.
*   Os dados automatizados entram no sistema como um **rascunho interno**.
*   A equipe da FluxAI sempre revisa antes de dar o aval de entrega.
*   A planilha `ROTAS_AUTOMACOES` atua como firewall de autorização; não é um disparador amplo.
*   Todos os webhooks passam obrigatoriamente pelo **make-proxy** por segurança.

**Cenários Ativos (Pipeline):**
*   01_FLUXAI_PORTAL_DEMANDAS
*   02_FLUXAI_LEADS_SITE
*   03_FLUXAI_INSTAGRAM_MANUAL_READER
*   04_FLUXAI_CONTENT_INTELLIGENCE
*   05_FLUXAI_DAILY_SYNC
*   06_FLUXAI_META_SYNC
*   07_FLUXAI_RELATORIO_MENSAL
*   08_FLUXAI_CLIENT_STATUS_MONITOR
*   09_FLUXAI_NOVO_CLIENTE_ONBOARDING
*   10_FLUXAI_SERVICO_EXTRA_REQUEST
*   11_FLUXAI_IA_CREDITOS_CONTROLE
*   12_FLUXAI_SERVICO_EXTRA_APROVACAO

## 12. Fluxo Manual vs Automático
A operação é um híbrido equilibrado entre automação robótica e curadoria humana.

**Responsabilidade Manual (Humana):**
*   Revisão estratégica;
*   Organização inicial do Drive;
*   Briefing;
*   Curadoria de dados e peças;
*   Aprovação interna de entregáveis;
*   Envio final de relatório ao cliente;
*   Coleta de métricas do Instagram de clientes sem integração de API;
*   Interpretação final e diagnóstico para o cliente.

**Responsabilidade Automática / Semi-Automática:**
*   Entrada e roteamento de leads;
*   Envio e notificação de demandas;
*   Logs e auditorias de sistema;
*   Monitoramento de status de conexões;
*   Syncs diários de dados estruturados;
*   Coleta de métricas conectadas via API;
*   Consolidação do rascunho de relatório mensal;
*   Controle rígido de consumo de IA;
*   Atualização de status de serviços extras.

## 13. Motor de Conteúdo (Workflow)
O fluxo de produção de conteúdo deve seguir obrigatoriamente a ordem:
1.  Planejamento (Estratégia e Pauta).
2.  Geração / Rascunho (Content Engine IA / Redação).
3.  Revisão FluxAI (Curadoria e ajustes).
4.  Aprovação Interna (Qualidade).
5.  Envio ao Cliente (Se aplicável ao nível de serviço).
6.  Aprovação / Reprovação (Pelo Portal do Cliente).
7.  Agendamento no Calendário.
8.  Publicação.
9.  Registro de Performance (Logs/Métricas).

## 14. Governança de IA (O Motor)
A Inteligência Artificial é uma ferramenta **interna** de escala produtiva. O cliente final não "opera" ou comanda a IA.
*Evite os termos "moedinhas" ou "crédito livre do cliente". Utilize a linguagem oficial: "limite operacional contratado", "governança de escopo", e "controle interno de produção".*

**Regras de Consumo do Limite Operacional:**
*   `rascunho_ia`: Não consome limite definitivo.
*   `em_revisao_fluxai`: Não consome limite definitivo.
*   `aprovado_interno`: Ocupa o limite operacional do projeto.
*   `enviado_cliente`: Mantém o limite ocupado (reservado).
*   `publicado`: Consome o limite **definitivamente** naquele ciclo.
*   `rejeitado` (antes da aprovação interna): Não consome recursos definitivos.
*   `excluido` (antes da aprovação): Libera o espaço operacional imediatamente.
*   `excluido` (depois da aprovação): Só libera limite mediante confirmação de gestão interna (estorno manual).

## 15. Serviços Extras e Upsell
A funcionalidade de Serviços Extras blinda o escopo original contra demandas infinitas.
*   O cliente pode solicitar via Portal.
*   **Não é uma compra automática** (estilo carrinho de e-commerce).
*   A FluxAI avalia a viabilidade, levanta o esforço e envia o orçamento.
*   Se o cliente aprovar o orçamento, ele vira um "Serviço Extra" oficial.
*   Pode e deve impactar planejamento, calendário, prioridades de entrega e consumo de limite de IA.

**Pipeline de Status do Extra:**
`solicitado` > `em_analise` > `orcamento_enviado` > `aprovado` / `recusado` > `em_producao` > `entregue` / `cancelado`

## 16. Ciclo de Relatórios Mensais
O fechamento mensal demonstra o valor estratégico entregue.
*   O relatório nasce sempre como um **rascunho interno**.
*   **Não há envio automático ao cliente final**.
*   A equipe de estratégia revisa o rascunho.
*   **O relatório deve sempre conter:** O que aconteceu (dados), Diagnóstico (por que aconteceu), Impactos e Riscos, Oportunidades visualizadas, Decisões tomadas, Próximos passos operacionais.

**Pipeline de Relatório:**
`rascunho_fluxai` > `em_revisao_estrategica` > `aprovado_interno` > `liberado_cliente` > `enviado_cliente` > `arquivado`.

## 17. Logs e Auditoria do Sistema
A telemetria protege a agência e o cliente, garantindo visibilidade total de ações.
*   **Logs globais:** Acesso restrito a ADMIN.
*   **Operadores (OPERATOR):** Não acessam a telemetria global.
*   **Clientes (CLIENT):** Nunca acessam a tabela de logs do sistema.
*   Payloads sensíveis (tokens, senhas, chaves) são redigidos ou mascarados (`[REDACTED]`).
*   Serve primariamente para rastreabilidade, resolução de conflitos e governança tecnológica.

## 18. Rotina Semanal da Operação
- [ ] Verificar entrada de novas demandas (Kanban).
- [ ] Verificar inbound de novos leads (Site e Campanhas).
- [ ] Revisar conteúdo gerado em rascunho na semana.
- [ ] Atualizar status das tarefas em andamento.
- [ ] Conferir solicitações e status de serviços extras.
- [ ] Conferir métricas parciais de performance.
- [ ] Revisar logs críticos ou de falhas de automação (Admin).
- [ ] Atualizar o planejamento e pautas da próxima semana.
- [ ] Registrar gargalos ou pendências do cliente.
- [ ] Preparar decisões estratégicas da semana.

## 19. Rotina Mensal de Fechamento
- [ ] Consolidar métricas completas de todas as fontes.
- [ ] Rodar o comando/automação para gerar o rascunho do relatório.
- [ ] Revisar a direção estratégica com base nos números.
- [ ] Avaliar riscos de churn (cancelamento) ou insatisfação.
- [ ] Revisar integridade do contrato e cumprimento de escopo.
- [ ] Revisar faturamento de serviços extras do mês.
- [ ] Revisar o consumo de governança (Limites de IA).
- [ ] Aprovar o relatório final internamente.
- [ ] Liberar no Portal ou realizar o envio manual ao cliente.

## 20. Checklist de Abertura de Novo Cliente
- [ ] `client_id` e `project_id` validados e únicos.
- [ ] Drive criado e estruturado com pastas `00` a `10`.
- [ ] `CLIENTES_CONFIG` preenchida com dados e contatos corretos.
- [ ] `SERVICOS_CLIENTES` espelhando exatamente o contrato fechado.
- [ ] Links do Drive inseridos em `CLIENTES_ARQUIVOS`.
- [ ] Reunião de Onboarding agendada/realizada.
- [ ] `DNA_CLIENTE_GPT` alimentado com tom de voz e restrições da marca.
- [ ] Permissões de APIs e Contas de Anúncios cedidas para a FluxAI.
- [ ] Acesso ao FluxAI OS (Client Portal) testado via link Mágico ou Token seguro.
- [ ] Cliente sinalizado como `ATIVO` no sistema.

## 21. Checklist de Revisão (Antes de Liberar Entrega ao Cliente)
- [ ] Dados estão 100% conferidos e coerentes?
- [ ] As peças/artes pertencem ao cliente correto?
- [ ] A demanda foi alocada no projeto correto?
- [ ] Nenhum dado sensível (tokens, acesso) está exposto?
- [ ] Texto e imagens passaram por revisão anti-erros?
- [ ] O Call to Action (CTA) está claro e estratégico?
- [ ] O serviço está coberto pelo escopo ou foi aprovado como Extra?
- [ ] O status do Kanban foi atualizado corretamente?
- [ ] Os arquivos originais já estão salvos nas pastas corretas do Drive?
- [ ] O Console de Logs está livre de alertas críticos referentes a esta entrega?

## 22. CODE FREEZE (Bloqueio Estrutural)
O core do sistema permanece **congelado** por questões críticas de estabilidade e segurança técnica.
**Não é permitido alterar sem um checklist rigoroso de regressão:**
*   Arquitetura de Autenticação (`auth`)
*   Controle de Permissões Baseadas em Papéis (`RBAC`)
*   Proxy de Webhooks Seguros (`make-proxy`)
*   Funções Serverless Vercel (`Edge Functions`)
*   Política de Segurança de Conteúdo (`CSP`)
*   Arquivo de Configuração de Deploy (`vercel.json`)
*   Motor Core de Navegação (`os-core.js`)
*   Configurações Globais (`os-config.js`)
*   Tela de Entrada (`login.html`)
*   Framework Base e CSS Global.

## 23. Próximas Evoluções (Roadmap Técnico)
- Auditoria de planilhas operacionais (Limpeza de legados e padronização).
- Auditoria completa dos cenários Make e APIs de terceiros.
- Auditoria do Repositório Físico (Google Drive).
- Auditoria do Site Comercial e Redes Sociais da FluxAI.
- Processualização (Transformação da auditoria de Setup em Metodologia aplicável a novos clientes premium).
- Transformação das soluções tecnológicas internas em pacotes de ofertas vendáveis.

---

### Veredito Oficial
**FASE 04 ENCERRADA.**
FluxAI OS™ provado e aprovado para uso interno controlado e operação assistida como infraestrutura central da FluxAI Labs.
