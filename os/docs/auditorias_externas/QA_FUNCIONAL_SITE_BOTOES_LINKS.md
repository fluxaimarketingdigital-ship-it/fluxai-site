# Relatório QA Funcional: Site Institucional, Botões e Links Pós-CodeQL

**Data:** 27/05/2026
**Módulo Avaliado:** Operacional Administrativo, Financeiro, Governança, Landing Page Institucional.
**Resultado Global:** APROVADO COM ÊXITO

## Resumo Executivo
Após profunda reestruturação DOM nos arquivos internos para mitigar os alertas *High* do CodeQL, detectou-se perda incidental da rastreabilidade de eventos de clique nos componentes refatorados. Esta auditoria validou a reinserção correta dos eventos.

## Componentes Avaliados

### 1. Financeiro (contracts-finance.js)
- `renderContracts`: As funções ausentes (e botões de edição/pdf/portal) foram reconstruídas. Todos utilizam o método direto `btn.onclick = () => window.metodo(id);`.
- `renderContractHealth`: Recriada com status, risco e botões indicativos. Testado isolamento funcional.
- **Status:** **OK**. Funções restauradas. 

### 2. Governança e Usuários (governance-users.html)
- Ações de redefinição de senha (`resetUserPassword`), deleção e alteração de contrato foram mantidas com `btn.addEventListener`.
- Teste lógico de expansão do card (`classList.toggle`) ratificado sem necessidade de reajustes.
- **Status:** **OK**. Todos os botões preservam o acesso restrito a funções sensíveis da aba.

### 3. Executive Center (executive-center.js)
- Tabelas operacionais mantêm coesão de dados e badges indicativos calculados dinamicamente via DOM. Não houve perda de botões acionáveis nesta tela.
- **Status:** **OK**.

### 4. Site Institucional e Performance
- Não foram identificadas remoções não autorizadas de eventos de rastreio GTM, analytics ou lazy-loading da landing page pública externa. O site segue aprovado nas métricas PageSpeed, Lighthouse e conversão.

## Conclusão da Mesa Auditora
O sistema recuperou todas as suas funcionalidades de controle e manipulação de interface, eliminando falhas visuais sem comprometer a política de *zero-trust DOM* recém introduzida pelas exigências da CyberSegurança (Snyk e GitHub CodeQL).


## Adendo Final: Regressões Visuais, Rotas e RBAC
- Fundo branco indevido corrigido nas páginas Demandas, Leads, Métricas e Relatório Mensal.
- Rota quebrada fluxai-labs removida do menu lateral.
- Tela governance protegida via Code/Auth com suporte a requiredPermission.
- Remoção completa de storage de login.html e uso de memória (window.FLUXAI_RUNTIME_CONTEXT) em compliance final ao CodeQL Alert #66.

## Resolução de Regressões Funcionais Finais (Adendo)
- **Portal do Cliente:** Scroll vertical restabelecido (remoção de classe conflitante `os-mode` no body do portal, preservando o layout escuro via inline css).
- **Gestão de Usuários:** Sessões *Mock* de `ADMIN` agora geram um `fluxai_mock_role` validado e filtrado via Allowlist. O `Auth.check` reconstrói corretamente o `window.FLUXAI_RUNTIME_CONTEXT` para sessões simuladas sem salvar payloads sensíveis, zerando o Bug de redirecionamento fantasma da tela de Governança.
- **Páginas Brancas:** Corrigido Erro de Sintaxe (`<body class=\os-mode\>`) nas telas de Demandas, Leads, Métricas e Relatório Mensal. Agora os componentes herdam corretamente o CSS obscuro do Design System.
- O RBAC permanece funcional para ADMIN, OPERATOR e CLIENT (Maria Aparecida). CodeQL segue com 0 alertas previstos.
