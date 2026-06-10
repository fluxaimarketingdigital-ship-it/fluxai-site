# Auditoria Operacional do FluxAI OS™ (Bloco 4)

## 1. Objetivo do Bloco 4
Garantir que a infraestrutura completa do FluxAI OS™ esteja preparada para uso real com clientes, operando de forma previsível e sem intervenções técnicas não mapeadas. A auditoria avaliará não apenas a integridade técnica do sistema (já consolidada no Bloco 03), mas sua **aderência aos processos de negócio e fluxos de trabalho reais**, transformando a infraestrutura técnica em uma plataforma comercializável e sustentável no modelo GaaS.

## 2. Escopo Permitido
Durante este bloco, a atuação deverá ser **estritamente avaliativa e analítica**. É permitido:
*   Mapear e documentar o estado atual das planilhas, banco de dados (Supabase) e processos (Make).
*   Testar leitura e consistência entre Google Sheets, Make e Supabase sem alterar os dados.
*   Conferir organização e padronização do Google Drive.
*   Documentar lacunas, gargalos operacionais e fluxos manuais remanescentes.
*   Criar o Manual Operacional (draft).
*   Elaborar relatórios de diagnóstico das integrações.

## 3. Escopo Proibido
Está expressamente proibido, a fim de preservar a estabilidade da homologação do Bloco 03:
*   Alterar código da aplicação (front-end, scripts, APIs).
*   Modificar schemas, tabelas ou policies de RLS (Role-Level Security) no Supabase.
*   Adicionar, remover ou modificar módulos, fluxos, rotas e filtros nos cenários do Make.
*   Alterar a estrutura ou realizar movimentação massiva de dados nas planilhas do Google Sheets.
*   Acionar a automação de onboarding para clientes novos sem autorização expressa.

## 4. Checklist de Auditoria das Planilhas (Google Sheets)
Avaliação da fonte da verdade operacional. O que verificar:
- [ ] Todas as abas estruturais existem e estão ativas.
- [ ] As colunas obrigatórias estão presentes sem erros de formatação que quebrem os fluxos.
- [ ] Inexistência de duplicidades ou dados fantasmas conflitantes (client_ids inconsistentes).
- [ ] Mapeamento claro das colunas preenchidas via API (Make/Webhook) vs. colunas manuais.
- [ ] Cadastro correto dos clientes ativos e seus respectivos serviços contratados.
- [ ] Configuração válida das rotas autorizadas.
- [ ] Relatórios e métricas de desempenho corretamente refletidas.
- [ ] Monitoramento fiel dos limites de Créditos IA (base contratual vs extra).
- [ ] Histórico de serviços extras consistentes.
- [ ] Status operacional dos clientes (ativo/pausado/inativo) refletindo a realidade.

## 5. Checklist de Auditoria dos Cenários (Make)
Verificação lógica e coesão das pontes automatizadas:
- [ ] **01 Demandas Portal:** Fluxo de recebimento operando adequadamente.
- [ ] **02 Leads Site:** Captação de novos negócios sem gargalos.
- [ ] **05 Daily Sync:** Rotina de atualizações diárias funcional.
- [ ] **06 Meta Sync:** Sincronização de métricas pagas consistente.
- [ ] **07 Relatório Mensal:** Geração estruturada ativa.
- [ ] **08 Status Monitor:** Monitoramento de uptime e resiliência operando.
- [ ] **09 Onboarding:** Recebimento e setup de cliente novo pronto.
- [ ] **10 Serviços Extras:** Solicitação validada (homologada no Bloco 03).
- [ ] **11 IA Créditos:** Atualização de saldo IA operando.
- [ ] **12 IA Entregas:** Processo de aprovação de pautas validado.
- [ ] **13 Guardrail:** Filtros de contenção de erros ativos e responsivos.
- [ ] **14 Atualização Demandas:** Mudança de status da demanda validada.

## 6. Checklist de Auditoria do Supabase
Conferência da persistência e segurança final:
- [ ] Presença exata das tabelas reais documentadas.
- [ ] Consistência de dados base do cliente.
- [ ] Consistência de dados operacionais (financeiro, comunicações).
- [ ] Funcionamento restritivo da RLS temporária na homologação (validação que a política não quebrou leitura).
- [ ] Mapeamento claro das policies futuras definitivas (Bloco 3.5).
- [ ] Separação clara entre ambiente de produção e homologação/desenvolvimento.
- [ ] Identificação dos dados de teste (002/004) como isolados na análise.
- [ ] Mapeamento preciso de quais tabelas abastecem o front-end do Cockpit.

## 7. Checklist de Auditoria do Google Drive
Organização da infraestrutura de armazenamento e links (Digital Asset Management):
- [ ] Pasta-mãe operacional devidamente estruturada.
- [ ] Divisão padronizada: pasta da FluxAI (interna) e pasta dos clientes.
- [ ] Todas as pastas de clientes possuem subpastas padronizadas (Identidade visual, Assets, Relatórios, etc.).
- [ ] Padronização no armazenamento e nomenclatura de contratos.
- [ ] Padronização para briefs de criação e materiais de apoio.
- [ ] Links gerados na estrutura correspondem aos links carregados no Cockpit do sistema OS.

## 8. Checklist do Manual Operacional
Elaboração do guia definitivo de operação FluxAI OS™:
- [ ] Procedimento: Como cadastrar um novo cliente no sistema.
- [ ] Procedimento: Onde inserir dados comerciais e operacionais (Sheets/Cockpit).
- [ ] Limites da automação: O que o onboarding cria automaticamente e o que deve ser preenchido.
- [ ] Procedimento: Solicitação, tramitação e aprovação de serviço extra.
- [ ] Mapeamento Humano vs. Máquina (O que é inserção manual e o que é automação Make).
- [ ] Procedimento: Como revisar e aprovar o Relatório Mensal de Performance.
- [ ] Procedimento: Como retroalimentar manualmente métricas orgânicas/Instagram se a API não possuir cobertura.
- [ ] Procedimento: Controle e manuseio de Crédito de IA (aprovações, deduções manuais/automáticas).
- [ ] Procedimento: Navegação e uso gerencial do painel Cockpit.

## 9. Critérios de Homologação
O Bloco 4 será considerado fechado com sucesso caso as seguintes condições se confirmem:
1.  Todo o ecossistema estiver mapeado documentado e auditado sem erros críticos silenciosos.
2.  Ausência de falhas arquiteturais na interação Planilhas <-> Make <-> Banco de Dados que comprometam a escala.
3.  O "Manual Operacional" estiver pronto para entrega a novos colaboradores ou operadores.
4.  O sistema se mostrar pronto para alocação do primeiro cliente em produção oficial (Maria Aparecida / Executa).

## 10. Backlog Futuro (A ser implementado no Bloco 5+)
- Implementação da Governança de RLS Definitiva no Supabase.
- Limpeza sistemática e arquivamento dos registros de teste técnico 001/002/004.
- Iniciar a operação diária com cliente real (Maria Aparecida).
- Realizar a Auditoria 360° em todo o Ecossistema da FluxAI.
- Processo de comercialização ativa da plataforma no modelo GaaS.
