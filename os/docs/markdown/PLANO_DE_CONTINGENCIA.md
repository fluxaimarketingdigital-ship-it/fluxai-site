# PLANO DE CONTINGENCIA — FluxAI OS™
## Procedimentos de Suporte e Mitigação de Falhas Operacionais

---

## 1. Introdução e Filosofia de Resiliência
O **FluxAI OS™** foi projetado sob o princípio de **Desacoplamento de Falhas**. A indisponibilidade de um serviço externo (como Make, Sheets ou APIs de redes sociais) não deve inviabilizar o funcionamento total do sistema, nem causar perda ou corrupção de dados históricos.
Este documento reúne as ações que o ADMIN e a equipe de suporte devem executar em caso de incidentes operacionais.

---

## 2. Diagnóstico e Ações por Cenário de Falha

### Cenário A: O Orquestrador Make.com está Fora do Ar ou com Lentidão
*   **Sintoma:** O OS exibe alertas na tela de que a conexão falhou e os logs registram a chave `WEBHOOK_REAL_FAILED` com status `CRITICAL`.
*   **Procedimento Imediato (Operador):**
    1.  O sistema automaticamente realiza rollback transacional local (reverte status, limites e mantém integridade visual).
    2.  Não tente repetir a ação imediatamente. Acesse o status do Make (`status.make.com`) para checar se há instabilidade global.
*   **Procedimento de Mitigação (ADMIN):**
    1.  Se o Make estiver inativo por mais de 2 horas e a demanda for urgente, faça o lançamento direto na planilha operacional Google Sheets.
    2.  Ao retornar o Make, registre a alteração manual nos logs locais (`logs.html`) para manter a rastreabilidade.

### Cenário B: O Google Sheets está Bloqueado ou Inacessível
*   **Sintoma:** Tabelas não carregam na interface do OS e o Make retorna erros de leitura/escrita.
*   **Causa Comum:** Excesso de conexões simultâneas, estouro de cota de API do Google Cloud, ou mudança acidental de proprietário/permissão da planilha.
*   **Procedimento de Mitigação (ADMIN):**
    1.  Verifique se a planilha oficial não foi renomeada ou movida no Google Drive.
    2.  Acesse o console do Google Cloud e monitore a cota de uso da *Google Sheets API*. Se a cota diária estourou, configure um segundo projeto do GCP no Make para alternar as credenciais.
    3.  Caso a planilha tenha sido corrompida, use o histórico de versões do Google Drive para restaurar o backup de segurança das últimas 12 horas.

### Cenário C: O Supabase está Inoperante (Auth/Session Falhou)
*   **Sintoma:** Usuários não conseguem realizar login ou são redirecionados incorretamente para `access-denied.html`.
*   **Procedimento de Mitigação (ADMIN):**
    1.  Verifique o painel do Supabase (`supabase.com`) para conferir se o projeto gratuito foi pausado por inatividade. Caso sim, clique em "Restore Project".
    2.  Se o Supabase estiver enfrentando falha global de infraestrutura, ative temporariamente o **Fallback de Sessão Local** alterando a configuração de login para ler as credenciais dos usuários mocks salvas em `fluxai_mock_users` no `localStorage`.

### Cenário D: O Token de API da Meta (Instagram/Ads) Expirou
*   **Sintoma:** O dashboard de métricas exibe erro na coleta ou deixa de atualizar os gráficos de ads/alcance diário.
*   **Causa Comum:** Mudança de senha da conta do Facebook do cliente, ou expiração natural do token de longa duração (geralmente dura 60 dias).
*   **Procedimento de Mitigação (Operador):**
    1.  Notifique o cliente. Solicite que ele acesse a central de segurança da agência ou realize o fluxo de login social na Meta novamente.
    2.  Gere um novo Token de Acesso do Usuário do Sistema na Meta Business Suite e cole nas configurações do Cockpit do Cliente no OS.

### Cenário E: O Google Drive não Abre ou Arquivos Desapareceram
*   **Sintoma:** O atalho de entregas ou contrato retorna "Erro 404 - Pasta não encontrada".
*   **Procedimento de Mitigação (Operador):**
    1.  Verifique na lixeira do Google Drive do proprietário se a pasta não foi excluída acidentalmente por um colaborador ou pelo próprio cliente.
    2.  Restaure a pasta. Se a pasta foi excluída permanentemente, o Make.com precisará recriá-la. Utilize o cenário `02 - Onboarding Cliente` selecionando apenas o módulo do Drive para recriar as pastas e remapear os links no Sheets.

### Cenário F: O Operador executou uma Ação Incorreta (Exclusão/Aprovação Indevida)
*   **Sintoma:** Um post foi aprovado por engano ou uma demanda excluída.
*   **Procedimento de Mitigação (ADMIN / Operador):**
    1.  **Recuperação de Demanda:** Como a exclusão local no OS não deleta fisicamente o registro no Sheets antes do webhook rodar, recupere o registro direto no histórico de revisões da planilha.
    2.  **Estorno de IA:** Se um post foi marcado como publicado indevidamente, o ADMIN deve entrar no cockpit do cliente e utilizar a ferramenta de ajuste de cota na aba `IA_CREDITOS_CLIENTE` para adicionar créditos de compensação manuais.

### Cenário G: Duplicação Acidental de Registros no Google Sheets
*   **Sintoma:** A interface do OS exibe o mesmo post ou lead repetido várias vezes.
*   **Causa Comum:** Disparos repetidos do mesmo webhook devido a instabilidade de rede (falha na confirmação de recebimento HTTP pelo OS).
*   **Procedimento de Mitigação (ADMIN):**
    1.  Abra a planilha operacional, localize a aba correspondente e use o recurso nativo "Remover Duplicados" com base na coluna de ID exclusivo (ex: `id_demanda` ou `id_lead`).
    2.  Ajuste o timeout do webhook no OS para evitar disparos duplicados em conexões lentas.
