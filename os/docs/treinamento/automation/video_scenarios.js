/**
 * VIDEO_SCENARIOS.JS - Cenários de gravação automática FluxAI OS™ (Academy)
 * Inclui os textos de fala (speech) para o TTS.
 */

const MOCK_SESSIONS = {
    ADMIN: {
        id: 'mock-admin-001', role: 'ADMIN',
        name: 'Admin FluxAI', email: 'admin@fluxaidigital.com.br',
        project_id: null, permissions: []
    },
    OPERATOR: {
        id: 'mock-op-001', role: 'OPERATOR',
        name: 'João Silva', email: 'operador@fluxaidigital.com.br',
        project_id: null, permissions: []
    },
    CLIENT: {
        id: 'mock-cli-001', role: 'CLIENT',
        name: 'FluxAI Labs', email: 'contato@fluxailabs.com.br',
        project_id: 'proj_fluxai_labs_master', permissions: []
    }
};

const SCENARIOS = [
    {
        id: '01',
        title: 'Visão Geral do FluxAI OS™',
        filename: 'FLUXAI_ACADEMY_01_VISAO_GERAL',
        role: 'ADMIN',
        steps: [
            { page: '/os/login.html', caption: '📺 VÍDEO 01 - Visão Geral', speech: 'Olá, seja muito bem-vindo ao FluxAI OS. O nosso Sistema Operacional de Crescimento, construído do zero para governar toda a sua operação de Marketing Digital de ponta a ponta. Assim que você entra no sistema, a barra superior e o menu lateral se adaptam inteligentemente ao seu nível de acesso.', duration: 25 },
            { page: '/os/command-center.html', caption: '🔘 Troca de Contextos', speech: 'Se você é um gestor interno, notará o nosso poderoso Seletor de Contextos na barra superior. Com um único clique, você alterna entre a visão Global da Agência, o Workspace Interno da FluxAI, ou isola totalmente o ambiente para focar em um único cliente.', duration: 20, highlight: '.os-topbar' },
            { page: '/os/command-center.html', caption: '🔘 A Barra Lateral e Módulos', speech: 'No menu lateral, toda a sua estrutura de produção está categorizada em Núcleos: desde o Estratégico, passando pela Operação de Clientes, até o Motor de Produção com IA.', duration: 15, highlight: '.os-sidebar' },
            { page: '/os/fluxai-academy.html', caption: '🔘 FluxAI Academy', speech: 'Nesta Academia, preparamos treinamentos curtos e diretos para cada tela do sistema. Explore a playlist ao lado e domine o seu FluxAI OS. Vamos em frente.', duration: 15 }
        ]
    },
    {
        id: '02',
        title: 'Portal do Cliente e Aprovação de Demandas',
        filename: 'FLUXAI_ACADEMY_02_PORTAL_CLIENTE',
        role: 'CLIENT',
        steps: [
            { page: '/os/client-portal.html', caption: '📺 VÍDEO 02 - A Visão do Cliente', speech: 'Bem-vindo ao Portal do Cliente. Projetamos este ambiente para ser a sua única fonte de verdade. Sem dezenas de grupos de WhatsApp, sem links perdidos de Drive. Tudo o que você precisa está centralizado aqui.', duration: 20 },
            { page: '/os/client-portal.html', caption: '🔘 Demandas Pendentes', speech: 'Quando nossa equipe produzir uma nova peça de conteúdo, roteiro ou campanha para você, ela aparecerá imediatamente no quadro de aprovações. Você pode revisar as artes, ler os textos e, com apenas um clique, aprovar ou solicitar refações diretamente pela plataforma.', duration: 22, highlight: '.client-dashboard-grid' },
            { page: '/os/relatorio-mensal.html', caption: '🔘 Relatórios', speech: 'A transparência é o nosso núcleo. Na aba de Relatórios Mensais, você tem acesso em tempo real ao consolidado de resultados, sem precisar esperar o fechamento do mês para saber como estão suas campanhas.', duration: 18 }
        ]
    },
    {
        id: '03',
        title: 'Command Center & Gestão de Demandas (Kanban)',
        filename: 'FLUXAI_ACADEMY_03_COMMAND_CENTER_DEMANDAS',
        role: 'OPERATOR',
        steps: [
            { page: '/os/command-center.html', caption: '📺 VÍDEO 03 - Command Center', speech: 'Operadores, este é o seu cérebro digital: o Command Center. Aqui, validamos se o FluxAI OS está perfeitamente sincronizado com nossas automações externas, como o Make e o Supabase.', duration: 18 },
            { page: '/os/demandas.html', caption: '🔘 O Kanban de Demandas', speech: 'Na tela de Demandas, orquestramos o fluxo de trabalho da agência. Ao clicar em Nova Demanda, você cadastra o que precisa ser feito, atrela ao projeto de um cliente e define a prioridade.', duration: 20 },
            { page: '/os/demandas.html', caption: '🔘 Avançando Status', speech: 'O motor de inteligência do OS atualiza instantaneamente as fases operacionais. Além disso, nosso sistema guarda logs detalhados de cada alteração de status para garantir cem por cento de governança na operação.', duration: 20, highlight: '.btn-action' }
        ]
    },
    {
        id: '04',
        title: 'Contratos e Serviços Extras (Financeiro)',
        filename: 'FLUXAI_ACADEMY_04_CONTRATOS_FINANCEIRO',
        role: 'ADMIN',
        steps: [
            { page: '/os/contracts-finance.html', caption: '📺 VÍDEO 04 - Contratos & Financeiro', speech: 'Bem-vindo ao módulo de gestão contratual. Este módulo é blindado apenas para perfis Administradores.', duration: 10 },
            { page: '/os/contracts-finance.html', caption: '🔘 Lançamento de Serviços Extras', speech: 'Criamos uma ferramenta nativa de Upsell. Se um cliente fechar um escopo extra, como uma Landing Page ou Ensaio Audiovisual, basta selecionar o serviço no catálogo. O valor base é auto-preenchido, poupando tempo.', duration: 22 },
            { page: '/os/contracts-finance.html', caption: '🔘 Gerando o Recibo', speech: 'E para fechar com maestria, basta um clique em Gerar Recibo e o FluxAI OS entrega um documento formal, detalhando o escopo fixo e os serviços avulsos, pronto para ser enviado ao financeiro do cliente.', duration: 20, highlight: '.btn-sm' }
        ]
    }
];

module.exports = { SCENARIOS, MOCK_SESSIONS };
