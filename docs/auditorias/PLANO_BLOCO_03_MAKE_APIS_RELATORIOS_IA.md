# PLANO DE IMPLEMENTAÇÃO: BLOCO 3 (Make, APIs e Relatórios de IA)

**Fase Atual:** Transição e Início Operacional Back-End
**Status:** [A Iniciar]

## Escopo do Bloco 3
Este bloco trata exclusivamente da fundação de automações de máquina, conectividade e governança de dados fora do frontend público. A espinha dorsal abrange:

1. **Make (Integromat)** - Orquestração de automações (sem bypass do atual sem aprovação).
2. **APIs Externas** - Integrações com serviços de terceiros e Webhooks.
3. **Google Sheets** - Planilhamento de controle (ex: Base LEADS_SITE / EVENTOS_SITE).
4. **Google Drive** - Gestão de ativos e relatórios em PDF/Doc.
5. **Relatórios Mensais** - Estruturação do disparo dos KPIs gerenciais.
6. **IA Planner / Governança GPT** - Custos de tokens, promts e limites operacionais da IA integrada.
7. **FluxAI OS** - Painel interno finalmente consumindo esses dados processados (mock to real).

## 🛑 Regras de Ouro e Compliance (Imutáveis)
- **Zero Novos Cenários Make:** É expressamente proibido construir novos fluxos no Make sem a aprovação explícita e direta do diagnóstico arquitetural prévio.
- **Manutenção de Cenários:** Nenhum módulo ou router existente no Make deve ser desmembrado ou modificado sem checklist de impacto.
- **Gestão de Chaves e Tokens:** Nenhuma API Key do OpenAI ou Proxy Keys do Supabase serão movidas sem autorização.
- **Disparos Automáticos Desativados:** O envio automático de aprovações para clientes ou disparo de relatórios está em HOLD. A automação será tratada internamente antes de ganhar acesso à caixa de entrada do cliente.
- **Site Público Lacrado:** Fim de ciclo de design. Alterações no Front-End público (Bloco 2) ocorrerão unicamente para mitigar bugs destrutivos/severos.
- **Supabase Intocável:** Políticas de segurança (RLS) e uth do FluxAI OS não sofrerão mutações durante integrações com APIs externas.

## Critério de Liberação Preenchido
- [x] Auditoria rápida pós-mudança aprovada.
- [x] Site público congelado no repositório.
- [x] FluxAI OS livre de erros críticos em Front.
- [x] Academy estável, limpo e sem quebra de navegação.

*O Repositório está pronto para o recebimento das lógicas de Back-End do Bloco 3.*
