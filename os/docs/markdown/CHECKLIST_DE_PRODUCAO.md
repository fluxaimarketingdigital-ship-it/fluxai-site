# CHECKLIST DE PRODUCAO (GO-LIVE) — FluxAI OS™
## Guia de Homologação Final e Liberação para Uso Real Contínuo

---

## 1. Objetivo
Este documento serve como a validação final que o **ADMIN** do sistema deve executar antes de declarar o **FluxAI OS™** como ativo e operacional no ambiente de produção. Nenhuma etapa deve ser pulada.

---

## 2. Checklist de Infraestrutura e Credenciais

### [ ] 1. Configurações do Supabase (Produção)
*   [ ] Banco de dados do Supabase configurado com tabelas de usuários e perfis reais.
*   [ ] Políticas RLS (Row-Level Security) ativas na tabela `profiles`.
*   [ ] Chaves de produção `SUPABASE_URL` e `SUPABASE_ANON_KEY` conectadas no arquivo de ambiente (ou `os-config.js`).
*   [ ] Verificado que as senhas e tokens dos e-mails reais estão configurados (sem mocks ativos).

### [ ] 2. Configurações do Google Sheets
*   [ ] Planilha oficial `FluxAI_Intelligence_Base_Ecossistema_Make` criada no Drive institucional.
*   [ ] Verificado que todas as 10 abas operacionais estão criadas com os nomes exatos.
*   [ ] Planilha compartilhada com o e-mail de serviço do Make.com com permissão de "Editor".
*   [ ] Fórmulas de cálculo de créditos de IA travadas contra escrita acidental.

### [ ] 3. Configurações do Google Drive
*   [ ] Pasta raiz `/FluxAI OS - CLIENTES` criada.
*   [ ] Template de pastas configurado no Make para criar as 7 subpastas de cliente no onboarding.
*   [ ] Permissões padrão de compartilhamento institucional validadas.

### [ ] 4. Cenários no Make.com e Webhooks
*   [ ] Todos os 6 cenários de webhooks de produção ativos no Make.com.
*   [ ] Links HTTPS de produção do Make colados na configuração `WEBHOOK_CONFIG` em `os-config.js`.
*   [ ] O whitelist `enabledRealWebhooks` atualizado para conter as chaves dos webhooks ativados.
*   [ ] Flag `sendRealWebhooks` configurada conforme a política de segurança da agência.

---

## 3. Checklist de Fluxos Operacionais e Transacionais

### [ ] 5. Fluxo de Captura de Leads (`LEAD_CAPTURE`)
*   [ ] Formulário do site preenchido com dados reais.
*   [ ] Validado que o lead foi gravado na aba `LEADS_SITE` em menos de 5 segundos.
*   [ ] Validado que o log `LEAD_CAPTURED` foi emitido na tela de logs com status `SUCCESS`.

### [ ] 6. Fluxo de Onboarding e Contratos (`CLIENT_ONBOARDING`)
*   [ ] Cadastro de um cliente de teste realizado.
*   [ ] Validado o disparo do webhook e a criação de sua pasta no Drive.
*   [ ] Validada a persistência nas tabelas de clientes e serviços no Sheets.
*   [ ] Contrato cadastrado no painel com link para o Drive e valor de mensalidade (MRR).

### [ ] 7. Fluxo de Geração e Governança de IA
*   [ ] Geração de conteúdo realizada na tela `content-engine.html`.
*   [ ] Confirmado que posts gerados como `rascunho_ia` não ocupam limite operacional de IA do cliente.
*   [ ] Post de teste movido para `aprovado_interno`. Validado que a cota foi reservada temporariamente.
*   [ ] Descarte do post antes da aprovação final realizado, validando o estorno da cota.

### [ ] 8. Publicação Assistida e Confirmação
*   [ ] Tela de Publicação Assistida aberta para o post aprovado.
*   [ ] Botão de copiar legenda testado (texto correto copiado para o clipboard).
*   [ ] Pasta de criativos do Drive aberta pelo atalho e download da mídia executado.
*   [ ] Publicação manual feita e botão "Confirmar Publicação Manual" clicado.
*   [ ] Verificado que a cota foi deduzida de forma definitiva no Sheets (`IA_CREDITOS_CLIENTE`) e o log `POST_PUBLISHED` foi emitido.

### [ ] 9. Solicitação e Aprovação de Serviços Extras
*   [ ] Solicitação de serviço extra cadastrada via Portal do Cliente.
*   [ ] Orçamento precificado pelo ADMIN no cockpit.
*   [ ] Orçamento aprovado pelo cliente no portal.
*   [ ] Verificado que o webhook disparou, atualizou o status para `aprovado` no Sheets e que o log foi gravado.
*   [ ] Teste de falha de webhook realizado (forçar erro HTTP no Make), validando que a transação fez rollback completo (status voltou para `orcamento_enviado`, limites anteriores restaurados e log `WEBHOOK_REAL_FAILED` gravado).

---

## 4. Checklist de Segurança e Monitoramento

### [ ] 10. Controle de Acesso (RBAC)
*   [ ] Testado login com conta `CLIENT` (verificado que o acesso é redirecionado para `client-portal.html` e bloqueado nas outras telas).
*   [ ] Testado login com conta `OPERATOR` (verificado acesso à rotina diária e bloqueio total nas telas `executive-center.html` e `governance.html`).
*   [ ] Testada tentativa de burlar URL direta, validando o redirecionamento e o disparo do log `SECURITY_ACCESS_DENIED`.

### [ ] 11. Validação de Cobrança e WhatsApp Manual
*   [ ] Botão de cobrança financeira assistida testado.
*   [ ] Mensagem preenchida gerada no clipboard e contato no WhatsApp Web aberto pelo link `wa.me`.
*   [ ] Log de intenção de contato `CONTACT_INTENTION_LOGGED` gerado na base de logs.

### [ ] 12. Logs de Auditoria
*   [ ] Verificado que a tela `logs.html` exibe os filtros por criticidade (CRITICAL, WARNING, INFO) e tipo.
*   [ ] Verificado que payloads de erro podem ser inspecionados para diagnóstico rápido.
