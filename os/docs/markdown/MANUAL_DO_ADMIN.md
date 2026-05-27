# MANUAL DO ADMINISTRADOR — FluxAI OS™
## Diretrizes de Governança Executiva e Controles Administrativos

---

## 1. Escopo de Atuação do Administrador (ADMIN)
O perfil **ADMIN** possui controle total e irrestrito sobre o ecossistema do **FluxAI OS™**. Suas responsabilidades cobrem a auditoria de logs críticos, parametrização de webhooks, gestão cadastral de usuários no Supabase, aprovação financeira de expansões de escopo e análise da saúde corporativa da FluxAI.

---

## 2. Acesso e Operação do Executive Center (`executive-center.html`)
O **Executive Center** é restrito ao ADMIN e fornece a saúde empresarial da agência em tempo real:

*   **Visão de MRR (Receita Recorrente Mensal):** Soma do valor fixo contratado de todos os clientes ativos. Utilizado para analisar o faturamento recorrente bruto, excluindo receitas pontuais de serviços extras.
*   **Contas a Receber e Inadimplência:** Consolida as mensalidades faturadas no mês atual. O ADMIN acompanha a soma recebida, o saldo em aberto e a taxa percentual de inadimplência (com base em cobranças atrasadas há mais de 5 dias).
*   **Gestão de Contratos:** Painel de controle detalhando o código do contrato, empresa, entregáveis acordados no escopo principal, data de vigência/renovação e atalho direto para o arquivo PDF assinado no Google Drive.
*   **Pipeline Comercial (CRM Leads):** Acompanha os leads capturados no site institucional da FluxAI, permitindo ao ADMIN visualizar a taxa de conversão comercial, propostas enviadas e negociações em andamento.
*   **Estatísticas de Carga Operacional:** Consolida a média de entregas pendentes, demandas abertas e filas de IA por cliente ativo para mensurar a capacidade de entrega e sobrecarga da equipe.

---

## 3. Gestão e Configuração de Webhooks e Feature Flags
Toda a orquestração do sistema está centralizada em [os-config.js](../../config/os-config.js):

*   **Ativação de Webhooks Reais:** Para colocar um fluxo em produção, o ADMIN deve inserir a chave do webhook no whitelist `FEATURE_FLAGS.enabledRealWebhooks` e verificar se a URL correta do cenário correspondente do Make está configurada no objeto `WEBHOOK_CONFIG`.
*   **Ativação Global de Produção:** A flag `FEATURE_FLAGS.sendRealWebhooks` pode ser alterada para `true` para forçar que todos os webhooks cadastrados disparem payloads reais. **Recomenda-se manter em false e utilizar o whitelist granular por razões de segurança.**

---

## 4. Auditoria de Logs e Segurança
O ADMIN deve realizar auditorias periódicas na tela de Logs (`logs.html`) para detectar e tratar riscos operacionais:

*   **Logs do Tipo `SECURITY`:** Registram tentativas negadas de login ou acessos de usuários sem permissões em rotas restritas. Se o log `SECURITY_ACCESS_DENIED` aparecer de forma repetida para o mesmo IP/User, indica possível tentativa de invasão.
*   **Logs do Tipo `WEBHOOK_REAL_FAILED`:** Indicam que um webhook real de produção falhou ao se conectar com o Make.com ou que o cenário retornou erro HTTP. Exige a verificação imediata dos logs de transações (rollbacks) e conferência da fila de execução no console do Make.
*   **Logs do Tipo `CONTACT_INTENTION_LOGGED`:** Permitem auditar a eficiência operacional do time de suporte comercial, registrando data, hora e destinatário das comunicações financeiras manuais assistidas.
