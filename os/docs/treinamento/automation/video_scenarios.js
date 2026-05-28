/**
 * VIDEO_SCENARIOS.JS — Cenários de gravação automática FluxAI OS™
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
        title: 'Visão Geral e Navegação do OS',
        filename: 'FLUXAI_OS_TREINAMENTO_INTERNO_01_VISAO_GERAL',
        role: 'ADMIN',
        steps: [
            { page: '/os/login.html',             caption: '🎬 VÍDEO 01 — Visão Geral', speech: 'Olá! Neste vídeo você vai conhecer o FluxAI OS, o sistema operacional interno da FluxAI. Vamos começar.', duration: 8 },
            { page: '/os/login.html',             caption: '📍 Tela de Login', speech: 'O acesso começa na tela de login. Dependendo do seu perfil, seja Admin, Operador ou Cliente, você verá partes diferentes do sistema.', duration: 10, highlight: 'form', actions: [{type: 'type', selector: '#username', text: 'admin@fluxai.com', delay: 1000}, {type: 'type', selector: '#password', text: '********', delay: 500}] },
            { page: '/os/command-center.html',    caption: '✅ Command Center', speech: 'Após o login, você entra no Command Center, que é o cockpit do dia a dia.', duration: 7 },
            { page: '/os/command-center.html',    caption: '📌 Barra lateral esquerda', speech: 'A barra lateral esquerda organiza os módulos em grupos. O Admin tem acesso a todos, o Operador apenas aos operacionais.', duration: 10, highlight: '.os-sidebar' },
            { page: '/os/command-center.html',    caption: '🔝 Topbar e Contextos', speech: 'No topo, você tem a barra principal, onde pode alternar o contexto de trabalho entre a visão global e o workspace interno.', duration: 10, highlight: '.os-topbar' },
            { page: '/os/operations-center.html', caption: '📊 Operations Center', speech: 'O Operations Center é mais técnico. Aqui acompanhamos cotas de inteligência artificial e o barômetro da operação.', duration: 10 },
            { page: '/os/executive-center.html',  caption: '👑 Executive Center', speech: 'O Executive Center é exclusivo do Admin, com métricas financeiras e contratos.', duration: 8 },
            { page: '/os/access-denied.html',     caption: '🚫 Acesso Negado', speech: 'Se um usuário tentar acessar uma tela sem permissão, o sistema bloqueia automaticamente para garantir a segurança.', duration: 9 },
            { page: '/os/command-center.html',    caption: '🎯 Resumo', speech: 'Agora você já conhece a estrutura geral do FluxAI OS. No próximo vídeo, veremos o cadastro de clientes.', duration: 9 }
        ]
    },

    {
        id: '02',
        title: 'Fluxo de Vendas, Cadastro e Onboarding',
        filename: 'FLUXAI_OS_TREINAMENTO_INTERNO_02_CADASTRO_ONBOARDING',
        role: 'ADMIN',
        steps: [
            { page: '/os/leads.html',       caption: '🎬 VÍDEO 02 — Vendas e Onboarding', speech: 'Neste vídeo você vai ver como um lead vira cliente dentro do sistema. Tudo começa no módulo de Leads.', duration: 8 },
            { page: '/os/leads.html',       caption: '📋 Qualificação de Leads', speech: 'Quando alguém preenche o formulário do site, aparece aqui. O comercial qualifica o lead e avança o status até convertido.', duration: 10, highlight: '.os-table' },
            { page: '/os/clientes.html',    caption: '📍 Módulo Clientes', speech: 'Depois de convertido, o cliente é cadastrado no módulo Clientes com dados de contato e o link do Drive.', duration: 10, highlight: '.row-action-btn' },
            { page: '/os/clientes.html',    caption: '🔑 Chave do Cliente', speech: 'O client ID é gerado automaticamente, conectando este cliente a todos os módulos.', duration: 8 },
            { page: '/os/onboarding.html',  caption: '📍 Onboarding Estratégico', speech: 'Em seguida, abrimos o Onboarding Estratégico para preencher o DNA de marca do cliente, como tom de voz e padrões.', duration: 10, highlight: 'form' },
            { page: '/os/onboarding.html',  caption: '🤖 Motor de IA', speech: 'Essas informações alimentam o Motor de Inteligência Artificial. Quanto mais completo o DNA, mais preciso o resultado.', duration: 9 },
            { page: '/os/clientes.html',    caption: '🎯 Fluxo completo', speech: 'Com o onboarding preenchido, o projeto está pronto para a operação. Até o próximo vídeo.', duration: 8 }
        ]
    },

    {
        id: '03',
        title: 'Cockpit de Projetos e Gestão de Demandas',
        filename: 'FLUXAI_OS_TREINAMENTO_INTERNO_03_COCKPIT_DEMANDAS',
        role: 'OPERATOR',
        steps: [
            { page: '/os/clientes.html',         caption: '🎬 VÍDEO 03 — Gestão de Demandas', speech: 'Neste vídeo veremos como funciona o cockpit de um projeto e a gestão de demandas.', duration: 8 },
            { page: '/os/clientes.html',         caption: '🔴 Alertas', speech: 'Na lista de clientes, indicadores visuais mostram alertas, como cotas esgotadas ou aprovações pendentes.', duration: 9, highlight: '.os-table' },
            { page: '/os/cliente-detalhe.html',  caption: '📍 Cockpit do Projeto', speech: 'Clicando no cliente, abrimos o cockpit. A aba de visão geral resume os contratos e os links do Drive.', duration: 10, highlight: '.os-tabs' },
            { page: '/os/cliente-detalhe.html',  caption: '📋 Demandas', speech: 'Na aba de Demandas, registramos as pautas. Cada demanda avança manualmente através dos status de produção.', duration: 10 },
            { page: '/os/demandas.html',         caption: '📍 Backlog Global', speech: 'Para uma visão global de todas as pautas de todos os clientes, usamos o módulo Demandas.', duration: 9, highlight: '.os-filters' },
            { page: '/os/demandas.html',         caption: '🎯 Fim do Fluxo', speech: 'Tudo registrado e rastreável. No próximo vídeo, veremos como gerar conteúdo com a inteligência artificial.', duration: 9 }
        ]
    },

    {
        id: '04',
        title: 'Motor de IA e Limite Operacional',
        filename: 'FLUXAI_OS_TREINAMENTO_INTERNO_04_IA_LIMITE_OPERACIONAL',
        role: 'OPERATOR',
        steps: [
            { page: '/os/content-engine.html',   caption: '🎬 VÍDEO 04 — Motor de IA', speech: 'O Motor de Criação de IA é uma ferramenta poderosa. Vamos aprender a gerar e aprovar conteúdo.', duration: 9 },
            { page: '/os/content-engine.html',   caption: '📍 Configuração', speech: 'Selecione o cliente para carregar o DNA de marca e defina o tipo de conteúdo desejado.', duration: 9, highlight: '#project-filter', actions: [{type: 'click', selector: '#project-filter', delay: 2000}] },
            { page: '/os/content-engine.html',   caption: '🤖 Geração', speech: 'Clique em Gerar. O sistema usa o DNA para montar um prompt inteligente e traz o resultado como rascunho.', duration: 10, highlight: '#btn-ai-planner', actions: [{type: 'hover', selector: '#btn-ai-planner', delay: 1000}, {type: 'click', selector: '#btn-ai-planner', delay: 1000}] },
            { page: '/os/content-engine.html',   caption: '📝 Revisão Interna', speech: 'O operador lê o rascunho e aprova internamente. Nenhum texto é publicado de forma automática.', duration: 10 },
            { page: '/os/cliente-detalhe.html',  caption: '📊 Controle de Cotas', speech: 'Cada cliente tem um limite contratado. Se a cota esgotar, o sistema bloqueia novas gerações para proteger os custos.', duration: 11, highlight: '#ia-limit-total' },
            { page: '/os/logs.html',             caption: '📋 Logs', speech: 'Todas as gerações ficam registradas nos Logs Operacionais para transparência total.', duration: 8 },
            { page: '/os/content-engine.html',   caption: '✅ Fim do Fluxo', speech: 'Esse é o ciclo do Motor de Conteúdo. No próximo vídeo, veremos a publicação.', duration: 7 }
        ]
    },

    {
        id: '05',
        title: 'Publicação Assistida e Cobranças',
        filename: 'FLUXAI_OS_TREINAMENTO_INTERNO_05_PUBLICACAO_ASSISTIDA_COBRANCAS',
        role: 'OPERATOR',
        steps: [
            { page: '/os/content-engine.html',      caption: '🎬 VÍDEO 05 — Publicação Assistida', speech: 'Neste vídeo você vai aprender o processo de publicação assistida, enviando conteúdos para as redes sociais.', duration: 9 },
            { page: '/os/content-engine.html',      caption: '📍 Conteúdo Aprovado', speech: 'Quando o cliente aprova o criativo, o operador é notificado para realizar a publicação manual.', duration: 9 },
            { page: '/os/content-engine.html',      caption: '📋 Modal de Publicação', speech: 'Clicando em publicar, um modal exibe a legenda pronta e os atalhos para a mídia no Drive e para o Instagram.', duration: 11, highlight: '#btn-send-approval', actions: [{type: 'click', selector: '#btn-send-approval', delay: 1500}] },
            { page: '/os/content-engine.html',      caption: '1️⃣ Passo a Passo', speech: 'Você copia a legenda, baixa a mídia, publica no Instagram e, ao terminar, confirma a publicação no sistema.', duration: 11 },
            { page: '/os/logs.html',                caption: '📋 Confirmação', speech: 'Confirmar é obrigatório. Isso consome a cota do cliente e registra a ação de forma definitiva.', duration: 9 },
            { page: '/os/contracts-finance.html',   caption: '💬 Cobranças via WhatsApp', speech: 'Para inadimplências, o processo também é assistido. O sistema monta a mensagem de cobrança, mas o envio é manual.', duration: 11, highlight: 'button.btn-whatsapp' },
            { page: '/os/content-engine.html',      caption: '✅ Fim do Vídeo', speech: 'Tudo documentado e controlado. Até o próximo vídeo.', duration: 6 }
        ]
    },

    {
        id: '06',
        title: 'Diagnóstico de Erros, Webhooks e Rollbacks',
        filename: 'FLUXAI_OS_TREINAMENTO_INTERNO_06_LOGS_ERROS_ROLLBACKS',
        role: 'ADMIN',
        steps: [
            { page: '/os/logs.html',  caption: '🎬 VÍDEO 06 — Diagnóstico de Erros', speech: 'Este vídeo mostra como identificar e resolver erros operacionais de integração e webhooks através dos logs.', duration: 10 },
            { page: '/os/logs.html',  caption: '📍 Filtros de Severidade', speech: 'O módulo de Logs cataloga tudo. O nível Warning indica um alerta leve, enquanto Critical exige ação imediata.', duration: 11, highlight: '#chk-critical' },
            { page: '/os/logs.html',  caption: '🔄 Real vs Simulado', speech: 'Eventos Simulados são apenas testes internos, enquanto Eventos Reais geram efeito nas integrações automáticas.', duration: 11 },
            { page: '/os/logs.html',  caption: '📦 Leitura de Payload', speech: 'Clicando no log crítico, o payload JSON é exibido. Você verá a causa raiz do erro e o código de retorno, facilitando o conserto.', duration: 12, highlight: '.col-payload', actions: [{type: 'hover', selector: '.col-payload', delay: 1000}, {type: 'click', selector: '.col-payload', delay: 1000}] },
            { page: '/os/logs.html',  caption: '🔧 Rollback', speech: 'Para corrigir, você ajusta o dado na planilha e reenvia no sistema.', duration: 8 },
            { page: '/os/logs.html',  caption: '✅ Fim da Trilha', speech: 'Saber ler um log resolve a maioria dos problemas em minutos. Esta foi a Trilha Interna.', duration: 8 }
        ]
    },

    {
        id: '07',
        title: 'Portal do Cliente e Solicitação de Demandas',
        filename: 'FLUXAI_OS_TREINAMENTO_CLIENTE_01_PORTAL_DEMANDAS',
        role: 'CLIENT',
        steps: [
            { page: '/os/login.html',         caption: '🎬 VÍDEO 07 — Portal do Cliente', speech: 'Bem-vindo ao portal exclusivo da FluxAI. Neste vídeo você aprenderá a usar o seu espaço.', duration: 9 },
            { page: '/os/client-portal.html', caption: '✅ Visão Geral', speech: 'Aqui você acompanha tudo que estamos produzindo. A seção Aguardando Sua Aprovação é a mais importante.', duration: 10, highlight: '.calendar-grid' },
            { page: '/os/client-portal.html', caption: '📋 Acompanhamento', speech: 'Você também pode ver os conteúdos que estão em andamento pela equipe e os relatórios de resultados já liberados.', duration: 11 },
            { page: '/os/client-portal.html', caption: '➕ Nova Solicitação', speech: 'Para pedir uma nova pauta, clique em Nova Solicitação e preencha os detalhes da sua necessidade.', duration: 9, highlight: '.btn-nova-demanda', actions: [{type: 'click', selector: '.btn-nova-demanda', delay: 1000}] },
            { page: '/os/client-portal.html', caption: '✅ Encerramento', speech: 'É muito simples solicitar e acompanhar. No próximo vídeo, veremos como aprovar suas entregas.', duration: 9 }
        ]
    },

    {
        id: '08',
        title: 'Aprovação de Criativos, Relatórios e Serviços Extras',
        filename: 'FLUXAI_OS_TREINAMENTO_CLIENTE_02_APROVACOES_RELATORIOS_EXTRAS',
        role: 'CLIENT',
        steps: [
            { page: '/os/client-portal.html', caption: '🎬 VÍDEO 08 — Aprovações', speech: 'Neste último vídeo, vamos ver como você aprova entregas e acompanha os relatórios.', duration: 8 },
            { page: '/os/client-portal.html', caption: '📍 Aprovação', speech: 'Quando finalizamos um conteúdo, ele aparece para você aprovar. Você pode visualizar o texto e o link da arte visual.', duration: 11, highlight: '.calendar-grid' },
            { page: '/os/client-portal.html', caption: '✅ Aprovar ou ❌ Reprovar', speech: 'Clique em Aprovar para liberar a postagem. Ou clique em Reprovar e digite o que precisa ser ajustado.', duration: 10, highlight: '.btn-nova-demanda', actions: [{type: 'hover', selector: '.btn-nova-demanda', delay: 1500}, {type: 'click', selector: '.btn-nova-demanda', delay: 1000}] },
            { page: '/os/client-portal.html', caption: '📊 Relatório Mensal', speech: 'Todos os meses liberamos um relatório gerencial com os indicadores de performance. Clique para visualizar os resultados.', duration: 11 },
            { page: '/os/client-portal.html', caption: '➕ Serviço Extra', speech: 'Se precisar de um material avulso que não está no seu plano, use o botão Solicitar Serviço Extra.', duration: 9, highlight: '.btn-nova-demanda' },
            { page: '/os/client-portal.html', caption: '🎯 Fim', speech: 'Aprove, avalie e nós cuidamos de toda a operação. Muito obrigado e sucesso com a FluxAI!', duration: 9 }
        ]
    }
];

module.exports = { SCENARIOS, MOCK_SESSIONS };
