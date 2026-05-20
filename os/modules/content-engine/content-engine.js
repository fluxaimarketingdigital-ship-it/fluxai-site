import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';
import { contentEngineData } from './content-engine.data.js';

let currentProject = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let realtimeChannel = null;

window.changeMonth = (delta) => {
    currentMonth += delta;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    loadContent();
};

const sLog = (msg) => { if (window.screenLog) window.screenLog(msg); console.log('[ENGINE]', msg); };

// MATRIZ DE OPERAÇÕES ESTRATÉGICAS FLUXAI v7.0 (FLUXO MESTRE)
const STRATEGIC_MATRIX = {
    'REELS': { 
        name: 'Direção Operacional Audiovisual', 
        clientPrefix: 'REELS', 
        platform: 'REELS',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ${obj}
ðŸŽ¬ FORMATO: Reels (Vertical 9:16)
â�±ï¸� TEMPO ESTIMADO: 45-60 segundos

ðŸª� HOOK: "A maioria das empresas não falha por falta de produto, mas por excesso de ruído operacional."
â�¸ï¸� PAUSA ESTRATÉGICA: [Silêncio de 1.5s para ênfase visual]
ðŸ“� DESENVOLVIMENTO: Discorrer sobre a diferença entre 'movimento' e 'progresso real'. Utilizar tom de voz Soberano e Técnico.
ðŸ‘�ï¸� DIREÇÃO DE CENA: Enquadramento em plano médio. Fundo neutro/escritório. Iluminação de alto contraste.
âœ¨ CTA: "Comente ESTRUTURA para acessar o diagnóstico de eficiência da FluxAI."
ðŸ“� LEGENDA: Narrativa focada em autoridade executiva e diferenciação de mercado.
        `
    },
    'CARROSSEL': { 
        name: 'Estrutura Narrativa de Carrossel', 
        clientPrefix: 'CARROSSEL', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ${obj}
ðŸŽ¬ FORMATO: Carrossel Estratégico (10 slides)

ðŸ–¼ï¸� ESTRUTURA NARRATIVA:
- Slide 01: [Gancho de Atenção] "O custo invisível da desorganização estratégica."
- Slide 02: [Tensão] Por que processos manuais estão drenando sua margem de lucro.
- Slide 03: [Conceito] A lógica da Engenharia de Processos aplicada ao marketing.
- Slide 04: [Diferenciação] FluxAI OS vs. Gestão Tradicional.
- Slide 05: [Metodologia] Os 4 pilares da escala sustentável.
- Slide 06: [Visualização] Gráfico de eficiência operacional.
- Slide 10: [CTA] Direcionamento para a Central de Inteligência.
        `
    },
    'CARD': { 
        name: 'Direção Estratégica Visual', 
        clientPrefix: 'POST', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ${obj}
ðŸ’¡ CONCEITO: Afirmação de Autoridade Absoluta.
ðŸŽ¨ DESIGN: Tipografia imponente, alto espaço negativo (silêncio visual).
ðŸ“� HEADLINE: "Escala não é sobre intensidade, é sobre arquitetura."
âœ¨ CTA: "Toque no link da Bio para entender a Engenharia por trás da FluxAI."
        `
    },
    'SITE': { 
        name: 'Arquitetura Estratégica Digital', 
        clientPrefix: 'SITE', 
        platform: 'WEB',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: Conversão de Alta Autoridade (High-Ticket)
ðŸŒ� ESTRUTURA UX: Foco em Jornada de Decisão Executiva

ðŸ�—ï¸� SEÇÕES:
1. HERO: Proposta de valor inquestionável + Visual Cinematic.
2. DIAGNÓSTICO: Exposição das dores do ICP e solução técnica.
3. ECOSSISTEMA: Detalhamento dos módulos operacionais.
4. PROVA DE VALOR: Resultados tangíveis e depoimentos selecionados.
ðŸš€ SEO: Otimização para palavras-chave de intenção comercial institucional.
        `
    },
    'BRANDING': { 
        name: 'Arquitetura de Posicionamento', 
        clientPrefix: 'BRANDING', 
        platform: 'BRAND',
        generate: (p, obj) => `
ðŸ’Ž PERCEPÇÃO: Posicionamento de Elite e Exclusividade Técnica.
ðŸ“� NARRATIVA: Construir a imagem de ${p.company_name} como autoridade máxima no setor.
ðŸŽ¨ VISUAL: Paleta sóbria, contrastes elegantes e iconografia proprietária.
        `
    },
    'TRAFEGO': { 
        name: 'Estratégia de Aquisição', 
        clientPrefix: 'AQUISIÇÃO', 
        platform: 'ADS',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: Atração de Leads Qualificados (ICP High-Ticket)
ðŸ“¡ CANAIS: Meta Ads + LinkedIn Ads
ðŸ“� CRIATIVOS: Foco em dor latente e prova de autoridade.
ðŸ’° ESTRATÉGIA: Funil de conscientização progressiva com foco em LTV.
        `
    },
    'CRM': { 
        name: 'Estrutura de Relacionamento', 
        clientPrefix: 'CRM', 
        platform: 'CRM',
        generate: (p, obj) => `
ðŸ“Š GESTÃO: Inteligência de Dados aplicada ao Funil de Vendas.
ðŸ”„ AUTOMAÇÃO: Réguas de relacionamento baseadas no comportamento do lead.
ðŸ“ˆ MÉTRICA: Foco em Health Score e Taxa de Retenção.
        `
    },
    'AUTOMACAO': { 
        name: 'Arquitetura Operacional', 
        clientPrefix: 'AUTOMAÇÃO', 
        platform: 'SYSTEM',
        generate: (p, obj) => `
âš™ï¸� FLUXO: Automação de processos repetitivos para ganho de eficiência.
ðŸ”— INTEGRAÇÃO: Sincronização em tempo real entre vendas e operação.
ðŸ›¡ï¸� GOVERNANÇA: Segurança de dados e rastreabilidade total das ações.
        `
    },
    'CONSULTORIA': { 
        name: 'Diagnóstico Estratégico', 
        clientPrefix: 'DIAGNÓSTICO', 
        platform: 'CONSULTING',
        generate: (p, obj) => `
ðŸ“‹ ESCOPO: Análise 360Âº da infraestrutura digital e operacional.
ðŸ“‘ ENTREGA: Relatório técnico com pontos de atrito e oportunidades de escala.
ðŸš€ IMPACTO: Definição do roadmap estratégico para os próximos 12 meses.
        `
    }
};

const RESPONSIBLE_MAP = {
    'AUDIOVISUAL': 'Audiovisual',
    'REELS': 'Audiovisual',
    'NARRATIVA': 'Estrategista',
    'DIREÇÃO': 'Estrategista',
    'ARQUITETURA': 'Design',
    'CARROSSEL': 'Design',
    'CARD': 'Design',
    'SITE': 'Desenvolvimento Web',
    'TRAFEGO': 'Gestor de Tráfego',
    'ADS': 'Gestor de Tráfego',
    'BRANDING': 'Estrategista',
    'CRM': 'Estrategista',
    'AUTOMAÇÃO': 'Sistemas',
    'DIAGNÓSTICO': 'Estrategista'
};

export async function initEngine() {
    sLog('Iniciando Motor de Conteúdo v7.0...');
    try {
        // Expor funções globais para a UI
        window.switchTab = switchTab;
        
        // Recuperar contexto salvo
        currentProject = localStorage.getItem('fluxai_current_project_id');
        
        await loadProjects();
        
        // Setar valor inicial do filtro se houver
        const filter = document.getElementById('project-filter');
        if (filter && currentProject) {
            filter.value = currentProject;
            const btnCopy = document.getElementById('btn-copy-portal');
            if (btnCopy) btnCopy.style.display = 'flex';
        }

        await loadContent();
        setupRealtime();
        sLog('Carga Inicial: OK');
        setupRealtime();

        // BOTÃO GLOBAL WA (TOP BAR)
        const btnGlobalWa = document.getElementById('btn-global-wa');
        if (btnGlobalWa) {
            btnGlobalWa.onclick = () => {
                const projectFilter = document.getElementById('project-filter');
                const selectedId = projectFilter.value;
                if (!selectedId) return alert('Selecione um cliente específico para enviar o lembrete direto.');
                
                const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${selectedId}`;
                const msg = `Olá! ðŸš€%0A%0APassando para lembrar que temos conteúdos aguardando sua aprovação no portal da FluxAI.%0A%0AConfira aqui seu calendário atualizado:%0A${portalLink}`;
                window.open(`https://wa.me/?text=${msg}`, '_blank');
            };
        }

        // Listeners
        if (filter) {
            filter.onchange = async (e) => {
                currentProject = e.target.value;
                localStorage.setItem('fluxai_current_project_id', currentProject);
                
                // Mostrar/Esconder botão de cópia
                const btnCopy = document.getElementById('btn-copy-portal');
                if (btnCopy) btnCopy.style.display = currentProject ? 'flex' : 'none';
                
                await OS_UI.renderTopbar();
                loadContent();
            };
        }

        const btnAi = document.getElementById('btn-ai-planner');
        if (btnAi) {
            btnAi.onclick = async () => {
                await runAiPlanner();
            };
        }

    } catch (err) {
        sLog('ERRO NO MOTOR: ' + err.message);
        console.error(err);
    }
}

function switchTab(tab) {
    const tabs = ['esteira', 'calendario-estrategico', 'calendario-operacional'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.style.display = t === tab ? 'block' : 'none';
        const btn = document.querySelector(`.os-tab-btn[onclick*="${t}"]`);
        if (btn) btn.classList.toggle('active', t === tab);
    });
}

async function loadProjects() {
    try {
        const supabase = getSupabase();
        // Busca Segura: Tenta buscar os campos essenciais primeiro
        const { data: projects, error } = await supabase.from('projects').select('*').eq('status', 'ATIVO');
        
        if (error) {
            sLog('Erro DB Projetos: ' + error.message);
            throw error;
        }

        // Armazenar projetos globalmente para consulta rápida
        window.allProjects = projects || [];

        const select = document.getElementById('project-filter');
        if (select) {
            select.innerHTML = '<option value="">Todos os Projetos</option>';
            window.allProjects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name || p.name;
                select.appendChild(opt);
            });
            sLog(`${window.allProjects.length} Clientes Sincronizados.`);
        }
    } catch (e) {
        sLog('Falha Crítica na Carga de Clientes: ' + e.message + '. Carregando Mocks do LocalStorage...');
        console.error(e);
        
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        window.allProjects = mockProjects;

        const select = document.getElementById('project-filter');
        if (select) {
            select.innerHTML = '<option value="">Todos os Projetos</option>';
            window.allProjects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name || p.name;
                select.appendChild(opt);
            });
            sLog(`${window.allProjects.length} Clientes Sincronizados (Mocks).`);
        }
    }
}

async function loadContent() {
    const dashboard = document.querySelector('main');
    const projectFilter = document.getElementById('project-filter');
    
    // DEFESA DE INTERFACE: Garantir que elementos básicos existam
    const workflowDeadline = document.getElementById('workflow-deadline');
    const workflowCard = document.getElementById('workflow-card');
    const placeholder = document.getElementById('project-placeholder');

    if (!currentProject) {
        if (placeholder) placeholder.style.display = 'none';
        if (workflowDeadline) workflowDeadline.innerText = 'SELECIONE UM CLIENTE';
        if (workflowCard) {
            workflowCard.style.background = 'rgba(168,85,247,0.1)';
            workflowCard.style.borderColor = 'rgba(168,85,247,0.3)';
        }
    } else {
        const projectData = window.allProjects?.find(p => p.id === currentProject);
        if (projectData && workflowDeadline && workflowCard) {
            // Tenta buscar o dia em diferentes possíveis colunas do banco
            const deadlineDay = projectData.next_cycle_day || projectData.planning_day || 20;
            const now = new Date();
            const currentDay = now.getDate();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
            
            workflowDeadline.innerText = `DEADLINE: DIA ${deadlineDay} (PARA ${nextMonth})`;
            
            if (currentDay > deadlineDay) {
                workflowCard.style.background = 'rgba(239, 68, 68, 0.2)';
                workflowCard.style.borderColor = '#ef4444';
                workflowCard.classList.add('pulse-red');
            } else if (deadlineDay - currentDay <= 3) {
                workflowCard.style.background = 'rgba(245, 158, 11, 0.2)';
                workflowCard.style.borderColor = '#f59e0b';
                workflowCard.classList.remove('pulse-red');
            } else {
                workflowCard.style.background = 'rgba(168,85,247,0.1)';
                workflowCard.style.borderColor = 'rgba(168,85,247,0.3)';
                workflowCard.classList.remove('pulse-red');
            }
        }

        // RESTAURAR BOTÕES DE AÇÃO
        const copyBtn = document.getElementById('btn-copy-portal');
        if (copyBtn) copyBtn.style.display = 'flex';
        
        const sendBtn = document.getElementById('btn-send-approval');
        if (sendBtn) sendBtn.style.display = 'flex';
    }

    // (Removido o bloco redundante)

    // Mostrar a aba ativa
    const activeTabBtn = document.querySelector('.os-tab-btn.active');
    if (activeTabBtn) {
        const tabMatch = activeTabBtn.getAttribute('onclick').match(/'([^']+)'/);
        if (tabMatch) switchTab(tabMatch[1]);
    }

    try {
        const supabase = getSupabase();
        let query = supabase.from('content_assets').select('*');
        if (currentProject) query = query.eq('project_id', currentProject);

        const { data: contents, error } = await query.order('scheduled_at', { ascending: true });
        if (error) throw error;

        const safeContents = contents || [];
        renderMetrics(safeContents);
        renderContentTable(safeContents);
        
        // Renderizar Calendários
        renderCalendar('calendar-strategic-body', safeContents, 'STRATEGIC');
        renderCalendar('calendar-operational-body', safeContents, 'OPERATIONAL');
        
        // NOVO: Verificar Alerta de Ciclo
        checkLogisticsCycle();
        checkPublishingAlerts(safeContents);
        
    } catch (e) {
        sLog('Erro Conteúdo: ' + e.message + '. Iniciando Fallback LocalStorage Mocks...');
        
        const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        let projectAssets = mockAssets;
        if (currentProject) {
            projectAssets = mockAssets.filter(item => item && item.project_id === currentProject);
        }
        
        // Se estiver vazio e for Maria Aparecida, geramos os mocks padrão para que a esteira não fique vazia
        if (projectAssets.length === 0 && currentProject === 'p_c1') {
            projectAssets = [
                {
                    id: "m_a1",
                    project_id: "p_c1",
                    title: "Direção Audiovisual (Reels): Organização Alimentar Real",
                    status: "APROVAÇÃO PLANEJAMENTO",
                    caption: "🎯 OBJETIVO: Fortalecer autoridade regional e combater o terrorismo nutricional.\n\n🎬 HOOK: Você não precisa comer comida sem graça para ter saúde.\n\n💬 FALAS: No consultório, o que eu mais vejo são pessoas cansadas de radicalismo...\n\n✨ CTA: Comente ROTINA para acessar meu guia prático de alimentos regionais.",
                    scheduled_at: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05T12:00:00.000Z`,
                    platform: "REELS",
                    priority: "MÉDIA",
                    metadata: { responsible: "Audiovisual", version: "V1", approval_deadline: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-04T18:00:00.000Z` }
                },
                {
                    id: "m_a2",
                    project_id: "p_c1",
                    title: "Estrutura Narrativa (Carrossel): Substituições Inteligentes",
                    status: "APROVAÇÃO PLANEJAMENTO",
                    caption: "🎯 OBJETIVO: Oferecer educação alimentar prática com alimentos acessíveis.\n\nSlide 1: Substituições saudáveis de verdade e baratas.\n\nSlide 2: Em vez de ingredientes caros importados, use raízes locais e peixes frescos.\n\n✨ CTA: Compartilhe este post com quem precisa de mais praticidade na cozinha.",
                    scheduled_at: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12T15:00:00.000Z`,
                    platform: "CARROSSEL",
                    priority: "MÉDIA",
                    metadata: { responsible: "Design", version: "V1", approval_deadline: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10T18:00:00.000Z` }
                },
                {
                    id: "m_a3",
                    project_id: "p_c1",
                    title: "Direção Audiovisual (Reels): Bastidores da Nutrição Humana",
                    status: "PRODUÇÃO",
                    caption: "🎯 OBJETIVO: Humanizar a marca e gerar conexão com pacientes locais.\n\n🎬 HOOK: O que acontece nos bastidores de um consultório de nutrição real?\n\n💬 FALAS: Meu trabalho vai muito além de prescrever dietas. É escuta ativa...\n\n✨ CTA: Agende sua consulta pelo WhatsApp no link da Bio.",
                    scheduled_at: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-19T18:00:00.000Z`,
                    platform: "REELS",
                    priority: "MÉDIA",
                    metadata: { responsible: "Audiovisual", version: "V1", approval_deadline: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-17T18:00:00.000Z` }
                },
                {
                    id: "m_a4",
                    project_id: "p_c1",
                    title: "Estrutura Narrativa (Carrossel): Ética CFN na Nutrição",
                    status: "PRONTO",
                    caption: "🎯 OBJETIVO: Construir autoridade ética premium, explicando porque não fazemos antes e depois.\n\nSlide 1: Por que sua saúde vale mais que uma foto de 'antes e depois'.\n\nSlide 2: De acordo com o Conselho Federal de Nutrição, a imagem corporal é privada e de responsabilidade ética...\n\n✨ CTA: Agende seu acompanhamento ético pelo WhatsApp.",
                    scheduled_at: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-26T09:00:00.000Z`,
                    platform: "CARROSSEL",
                    priority: "ALTA",
                    metadata: { responsible: "Design", version: "V1", approval_deadline: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-24T18:00:00.000Z` }
                }
            ];
            const allMocks = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const filteredOthers = allMocks.filter(c => c.project_id !== currentProject);
            localStorage.setItem('fluxai_mock_assets', JSON.stringify([...filteredOthers, ...projectAssets]));
        }
        
        renderMetrics(projectAssets);
        renderContentTable(projectAssets);
        
        // Renderizar Calendários
        renderCalendar('calendar-strategic-body', projectAssets, 'STRATEGIC');
        renderCalendar('calendar-operational-body', projectAssets, 'OPERATIONAL');
        
        // Tentar verificar alerta de ciclo localmente
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        const pData = mockProjects.find(p => p.id === currentProject);
        const banner = document.getElementById('cycle-alert-banner');
        const dateEl = document.getElementById('cycle-alert-date');
        
        if (pData?.metadata?.onboarding?.next_cycle_day && banner && dateEl) {
            const now = new Date();
            const nextMonthIndex = now.getMonth() + 1;
            const targetMonth = nextMonthIndex > 11 ? 0 : nextMonthIndex;
            const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
            dateEl.innerText = `${String(pData.metadata.onboarding.next_cycle_day).padStart(2, '0')}/${monthNames[targetMonth]}`;
            banner.style.display = 'block';
        } else if (banner) {
            banner.style.display = 'none';
        }

        checkPublishingAlerts(projectAssets);
    }
}

async function checkLogisticsCycle() {
    if (!currentProject) return;
    try {
        const supabase = getSupabase();
        const { data: p } = await supabase.from('projects').select('metadata').eq('id', currentProject).single();
        
        const banner = document.getElementById('cycle-alert-banner');
        const dateEl = document.getElementById('cycle-alert-date');
        
        if (p?.metadata?.onboarding?.next_cycle_day && banner && dateEl) {
            const now = new Date();
            const nextMonthIndex = now.getMonth() + 1;
            const targetMonth = nextMonthIndex > 11 ? 0 : nextMonthIndex;
            
            const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
            const targetMonthName = monthNames[targetMonth];
            
            dateEl.innerText = `${String(p.metadata.onboarding.next_cycle_day).padStart(2, '0')}/${targetMonthName}`;
            banner.style.display = 'block';
        } else if (banner) {
            banner.style.display = 'none';
        }
    } catch (e) { console.error('[LOGÃ�STICA] Erro ao verificar ciclo:', e); }
}

async function checkPublishingAlerts(contents) {
    if (!contents || contents.length === 0) return;
    
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const todayPosts = contents.filter(c => {
        if (c.status !== 'PRONTO') return false;
        const scheduledDate = c.scheduled_at ? c.scheduled_at.split('T')[0] : null;
        return scheduledDate === todayStr;
    });

    if (todayPosts.length > 0) {
        sLog(`ðŸ“¢ ALERTA: Você tem ${todayPosts.length} conteúdos para publicar HOJE!`);
        // Opcional: Mostrar uma notificação visual mais agressiva ou banner
        const metricSchedule = document.getElementById('metric-schedule');
        if (metricSchedule) {
            metricSchedule.style.border = '1px solid var(--os-primary)';
            metricSchedule.style.boxShadow = '0 0 20px rgba(107, 122, 69, 0.2)';
        }
    }
}

function renderMetrics(contents) {
    const now = new Date();
    const metrics = {
        total: contents.length,
        approval: contents.filter(c => c.status.includes('APROVAÇÃO')).length,
        atrasado: contents.filter(c => {
            if (c.status === 'PUBLICADO' || c.status === 'PRONTO') return false;
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            const scheduled = new Date(c.scheduled_at);
            // Atraso se passou do prazo de aprovação OU se está em produção e passou da data de postagem
            return (deadline && deadline < now) || (c.status === 'PRODUÇÃO' && scheduled < now);
        }).length,
        ready: contents.filter(c => c.status === 'PRONTO').length
    };

    OS_UI.renderMetric('metric-assets', { label: 'Logística Total', value: metrics.total, trend: 'v1.0', meta: 'Escopo' });
    OS_UI.renderMetric('metric-approval', { label: 'Aguardando Cliente', value: metrics.approval, trend: '!', meta: 'Atenção' });
    OS_UI.renderMetric('metric-production', { label: 'Atraso Operacional', value: metrics.atrasado, trend: 'down', meta: 'Crítico' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos para Postar', value: metrics.ready, trend: 'âœ”', meta: 'Publicação' });

    // Atualizar status para ATRASADO via código se necessário (Lógica em tempo real)
    contents.forEach(async c => {
        if (c.status !== 'ATRASADO' && c.status !== 'PUBLICADO' && c.status !== 'PRONTO') {
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            if (deadline && deadline < now) {
                // Sincronizar com DB (Opcional - pode ser apenas visual no dashboard)
                console.warn(`[LOGÃ�STICA] Ativo ${c.title} está ATRASADO por prazo de aprovação.`);
            }
        }
    });
}

function renderContentTable(contents) {
    const body = document.getElementById('pipeline-table-body');
    if (!contents || contents.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px;">Nenhum conteúdo.</td></tr>`;
        return;
    }

    body.innerHTML = contents.map(c => {
        const scheduled = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Escala Pendente';
        const revCount = c.metadata?.revision_cycle || 1;
        const versionLabel = `V${revCount}`;
        const isHighRisk = revCount >= 3 || c.metadata?.risk;

        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-weight: 700; color: #fff;">${c.title}</div>
                        <span style="font-size: 0.5rem; background: ${isHighRisk ? 'var(--os-danger)' : (c.metadata?.version === 'FINAL' ? 'var(--os-primary)' : '#333')}; color: #fff; padding: 2px 6px; border-radius: 2px; font-weight: 800;">${versionLabel}</span>
                        ${isHighRisk ? '<i class="fa-solid fa-triangle-exclamation" title="Risco Operacional: Ciclo de ajustes alto ou atraso crítico" style="color:var(--os-danger); font-size:0.7rem; animation: pulse 2s infinite;"></i>' : ''}
                    </div>
                    <div style="font-size: 0.7rem; color: var(--os-primary); font-weight: 800; margin-top: 2px;">
                        <i class="fa-solid fa-calendar-day" style="font-size: 0.6rem; margin-right: 4px;"></i> ${scheduled}
                    </div>
                </td>
                <td><span class="status-badge" style="background:${getStatusBg(c.status)}; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.6rem; font-weight: 800; white-space: nowrap;">${c.status}</span></td>
                <td>
                    <div style="font-size: 0.7rem; font-weight: 800; color: #fff;">${c.metadata?.responsible || '---'}</div>
                    <div style="font-size: 0.55rem; color: var(--os-text-muted);">${c.priority}</div>
                </td>
                <td style="font-size: 0.75rem; font-weight: 600;">${c.platform}</td>
                <td>
                    <div style="font-size: 0.65rem; color: ${c.metadata?.approval_deadline ? '#60a5fa' : 'var(--os-text-muted)'};">
                        ${c.metadata?.approval_deadline ? '<i class="fa-solid fa-clock"></i> ' + new Date(c.metadata.approval_deadline).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '---'}
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">

                        ${c.status === 'PRONTO' ? `
                            <button class="btn-mini" title="Ponte de Publicação" onclick="window.openPublishBridge('${c.id}')" style="background: var(--os-primary); color: #000; border: none;">
                                <i class="fa-solid fa-rocket"></i>
                            </button>
                        ` : `
                            ${c.status !== 'PLANEJAMENTO' ? `
                                <button class="btn-mini" title="Forçar Conclusão (Pular Aprovação)" onclick="window.forceReady('${c.id}')" style="background: rgba(16, 185, 129, 0.1); border-color: var(--os-success); color: var(--os-success);">
                                    <i class="fa-solid fa-circle-check"></i>
                                </button>
                            ` : ''}
                        `}
                        ${c.metadata?.reference_url ? `
                            <a href="${c.metadata.reference_url}" target="_blank" class="btn-mini" title="Ver Referência" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-color: #3b82f6;">
                                <i class="fa-solid fa-link"></i>
                            </a>
                        ` : ''}
                        ${c.metadata?.final_asset_url ? `
                            <a href="${c.metadata.final_asset_url}" target="_blank" class="btn-mini" title="Ver Arte Final" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa; border-color: #8b5cf6;">
                                <i class="fa-solid fa-file-image"></i>
                            </a>
                        ` : ''}
                        <button class="btn-mini" title="Editar/Refinar" onclick="window.openEditModal('${c.id}')" style="background: rgba(107, 122, 69, 0.2); border-color: var(--os-primary); color: var(--os-primary);">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-mini" title="Excluir" onclick="window.deleteAsset('${c.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderCalendar(containerId, contents, mode) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    // Atualizar Label do Mês
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const label = document.getElementById('calendar-month-label');
    if (label) label.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    const year = currentYear;
    const month = currentMonth;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        container.innerHTML += `<div class="calendar-day" style="opacity:0.05;"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayContents = contents.filter(c => c.scheduled_at && c.scheduled_at.startsWith(dayStr));
        
        let eventsHtml = dayContents.map(c => {
            const isStrategic = mode === 'STRATEGIC';
            const statusColor = getStatusBg(c.status);
            
            // Filtro de visibilidade por modo
            // Filtro Estrategico Removido para sincronia total com a esteira
            if (!isStrategic && !['PRODUÇÃO', 'REVISÃO INTERNA FINAL', 'APROVAÇÃO FINAL', 'PRONTO', 'PUBLICADO'].includes(c.status)) return '';

            return `
                <div class="calendar-event" onclick="window.openApproval('${c.id}')" 
                     style="border-left-color: ${statusColor}; background: rgba(255,255,255,0.02); font-size: 0.6rem; padding: 4px 8px; margin-bottom: 4px; border-radius: 2px;">
                    <div style="font-weight: 800; color: #fff;">${c.title.substring(0, 15)}</div>
                    <div style="font-size: 0.55rem; color: ${statusColor}; font-weight: 700;">${c.status}</div>
                    ${!isStrategic && c.status === 'PRONTO' ? '<i class="fa-solid fa-paperclip" style="font-size:0.5rem; margin-top:2px;"></i>' : ''}
                </div>
            `;
        }).join('');

        container.innerHTML += `
            <div class="calendar-day" style="min-height: 100px;">
                <div class="day-number" style="font-size: 0.65rem; font-weight: 800; margin-bottom: 8px;">${day}</div>
                ${eventsHtml}
            </div>
        `;
    }
}

function getStatusBg(status) {
    if (status === 'PLANEJAMENTO') return '#8b5cf6'; // Roxo
    if (status === 'REVISÃO GESTÃO') return '#8b5cf6'; // Roxo
    if (status === 'APROVAÇÃO PLANEJAMENTO') return '#3b82f6'; // Azul
    if (status === 'APROVAÇÃO ESTRATÉGICA') return '#3b82f6'; // Azul
    if (status === 'AJUSTE') return '#ef4444'; // Vermelho
    if (status === 'PRODUÇÃO') return '#f59e0b'; // Amarelo/Laranja
    if (status === 'AJUSTE DE PRODUÇÃO') return '#ec4899'; // Rosa (Refinamento técnico)
    if (status === 'REVISÃO INTERNA FINAL') return '#ec4899';
    if (status === 'APROVAÇÃO FINAL') return '#3b82f6'; // Azul
    if (status === 'PRONTO') return '#10b981'; // Verde
    if (status === 'PUBLICADO') return '#059669'; // Verde Escuro
    if (status === 'ATRASADO') return '#7f1d1d'; // Marrom/Vermelho Escuro
    return '#444';
}

window.openApproval = (id) => {
    window.open(`approval.html?id=${id}`, '_blank');
};

let editingAssetId = null;
window.openEditModal = async (id) => {
    editingAssetId = id;
    const supabase = getSupabase();
    const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
    if (c) {
        const isPlanning = c.status === 'PLANEJAMENTO' || c.status === 'APROVAÇÃO ESTRATÉGICA' || c.status === 'REVISÃO GESTÃO';
        const isDirector = localStorage.getItem('os_role') === 'DIRETOR';
        
        // Mapear campos do HTML (Somente os que são fixos)
        document.getElementById('edit-asset-title').value = c.title;
        document.getElementById('edit-asset-ref').value = c.metadata?.reference_url || '';
        document.getElementById('edit-asset-art-final').value = c.metadata?.final_asset_url || '';
        
        // Injetar campos de metadados no container específico
        const metaGrid = document.getElementById('edit-asset-meta-fields');
        if (metaGrid) {
        // Renderizar Roteiro e Histórico
        const history = c.metadata?.history || [];
        const historyHtml = history.length > 0 ? history.map(h => `
            <div style="padding:10px; border-bottom:1px solid #222; font-size:0.7rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <b style="color:${h.type === 'CLIENT' ? '#60a5fa' : '#8b5cf6'}">${h.type === 'CLIENT' ? 'ðŸ“Œ AJUSTE CLIENTE' : 'ðŸ›¡ï¸� AJUSTE ESTRATÉGICO'}</b>
                    <span style="opacity:0.5;">${new Date(h.date).toLocaleString('pt-BR')}</span>
                </div>
                <div style="color:#eee; line-height:1.4;">${h.note}</div>
                <div style="font-size:0.6rem; opacity:0.4; margin-top:3px;">Por: ${h.author}</div>
            </div>
        `).join('') : '<div style="padding:40px; text-align:center; opacity:0.3; font-size:0.7rem;">Sem histórico de ajustes até o momento.</div>';

        document.getElementById('edit-asset-roadmap-container').innerHTML = `
            <div class="edit-modal-grid">
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">ROTEIRO ESTRATÉGICO (PAUTA)</label>
                    <textarea id="edit-asset-caption" style="width:100%; height:320px; background:#0a0a0a; border:1px solid #222; color:#fff; padding:15px; border-radius:8px; font-family:inherit; font-size:0.9rem; line-height:1.6; outline:none; transition: border 0.3s;"></textarea>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">HISTÓRICO DE AJUSTES</label>
                    <div id="edit-asset-history" style="height:320px; background:#050505; border:1px solid #222; border-radius:8px; overflow-y:auto; scrollbar-width: thin; padding: 5px;">
                        ${historyHtml}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('edit-asset-caption').value = c.caption || '';

            metaGrid.style.display = 'grid';
            metaGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            metaGrid.style.gap = '20px';
            metaGrid.style.marginTop = '25px';
            metaGrid.style.padding = '20px';
            metaGrid.style.background = 'rgba(255,255,255,0.02)';
            metaGrid.style.borderRadius = '8px';
            metaGrid.style.border = '1px solid rgba(255,255,255,0.05)';

            const isLocked = c.status !== 'PLANEJAMENTO' && c.status !== 'AJUSTE';

            metaGrid.innerHTML = `
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">RESPONSÁVEL</label>
                    <select id="edit-asset-responsible" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="Design">Design</option>
                        <option value="Audiovisual">Audiovisual</option>
                        <option value="Estrategista">Estrategista</option>
                        <option value="Gestor de Tráfego">Gestor de Tráfego</option>
                        <option value="Social Media">Social Media</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">CICLO DE AJUSTE</label>
                    <select id="edit-asset-version" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="V1">V1 - Inicial</option>
                        <option value="V2">V2 - Ajuste 1</option>
                        <option value="V3">V3 - Ajuste 2 (CRÃ�TICO)</option>
                        <option value="FINAL">FINAL - Pronto para Postar</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">PRAZO DE APROVAÇÃO</label>
                    <input type="datetime-local" id="edit-asset-deadline" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                </div>
                
                <div style="grid-column: span 3; display:flex; gap:30px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); margin-top:5px;">
                     <div style="display:flex; align-items:center; gap:10px; opacity: ${isLocked ? '0.5' : '1'};">
                        <input type="checkbox" id="edit-asset-strategic-req" style="width:16px; height:16px; cursor:pointer;" ${c.metadata?.strategic_approval_required ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
                        <label for="edit-asset-strategic-req" style="font-size:0.65rem; color:#3b82f6; font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">EXIGIR APROVAÇÃO ESTRATÉGICA?</label>
                     </div>
                     <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="edit-asset-risk" style="width:16px; height:16px; cursor:pointer;" ${c.metadata?.risk ? 'checked' : ''}>
                        <label for="edit-asset-risk" style="font-size:0.65rem; color:var(--os-danger); font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">RISCO OPERACIONAL</label>
                     </div>
                </div>
            `;
            
            // Setar valores após injeção
            document.getElementById('edit-asset-responsible').value = c.metadata?.responsible || 'Design';
            document.getElementById('edit-asset-version').value = c.metadata?.version || 'V1';
            
            // Governança de Edição: Campos automáticos ficam desabilitados
            document.getElementById('edit-asset-responsible').disabled = true;
            document.getElementById('edit-asset-version').disabled = true;
            document.getElementById('edit-asset-responsible').style.opacity = '0.6';
            document.getElementById('edit-asset-version').style.opacity = '0.6';
            document.getElementById('edit-asset-deadline').disabled = !isDirector;
            if (!isDirector) document.getElementById('edit-asset-deadline').style.opacity = '0.5';

            if (c.metadata?.approval_deadline) {
                try {
                    const d = new Date(c.metadata.approval_deadline);
                    document.getElementById('edit-asset-deadline').value = d.toISOString().slice(0, 16);
                } catch (e) {}
            }
        }



        // Atualizar Botões Dinâmicos
        const footerActions = document.getElementById('edit-asset-footer-actions');
        if (footerActions) {
            const hasStrategic = c.metadata?.strategic_approval_required;
            
            footerActions.innerHTML = `
                ${(c.status === 'PRODUÇÃO' || c.status === 'AJUSTE DE PRODUÇÃO') ? `
                    <button class="btn-mini" onclick="window.sendToStrategicOrFinal('${c.id}')" style="padding:10px 20px; background:#8b5cf6; color:#fff; font-weight:800; border:none; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                        <i class="fa-solid fa-paper-plane"></i> ${hasStrategic ? 'Finalizar e Enviar p/ Aprovação Estratégica' : 'Finalizar e Enviar'}
                    </button>
                ` : ''}
                ${c.status === 'APROVAÇÃO ESTRATÉGICA' ? `
                    <button class="btn-mini" onclick="window.strategicInternalAction('${c.id}', 'REJECT')" style="padding:10px 20px; background:var(--os-danger); color:#fff; font-weight:800; border:none;">Solicitar Ajuste (Produção)</button>
                    <button class="btn-mini" onclick="window.strategicInternalAction('${c.id}', 'APPROVE')" style="padding:10px 20px; background:var(--os-success); color:#fff; font-weight:800; border:none;">Aprovar p/ Cliente</button>
                ` : ''}
                <button class="btn-mini" onclick="window.saveAssetEdit()" style="padding:10px 20px; background:var(--os-primary); color:#000; font-weight:800;">Salvar Alterações</button>
            `;
        }

        document.getElementById('modal-edit-asset').style.display = 'flex';
    }
};

window.closeEditModal = () => {
    document.getElementById('modal-edit-asset').style.display = 'none';
};

window.saveAssetEdit = async () => {
    try {
        const title = document.getElementById('edit-asset-title').value;
        const caption = document.getElementById('edit-asset-caption').value;
        const ref = document.getElementById('edit-asset-ref').value;
        const artFinal = document.getElementById('edit-asset-art-final')?.value;
        const strategicApproval = document.getElementById('edit-asset-strategic-req')?.checked;
        const responsible = document.getElementById('edit-asset-responsible')?.value;
        const version = document.getElementById('edit-asset-version')?.value;
        const deadline = document.getElementById('edit-asset-deadline')?.value;
        const risk = document.getElementById('edit-asset-risk')?.checked;

        const supabase = getSupabase();
        const { data: currentAsset } = await supabase.from('content_assets').select('status, metadata').eq('id', editingAssetId).single();
        
        const newMetadata = currentAsset.metadata || {};
        newMetadata.reference_url = ref;
        newMetadata.final_asset_url = artFinal;
        newMetadata.strategic_approval_required = strategicApproval;
        newMetadata.responsible = responsible;
        newMetadata.version = version;
        newMetadata.approval_deadline = deadline;
        newMetadata.risk = risk;

        let updatePayload = {
            title,
            caption,
            metadata: newMetadata
        };

        // LÓGICA DE TRANSIÇÃO DE STATUS INTELIGENTE
        if (currentAsset.status === 'AJUSTE') {
            updatePayload.status = 'PLANEJAMENTO';
        } else if (currentAsset.status === 'AJUSTE DE PRODUÇÃO') {
            updatePayload.status = 'PRODUÇÃO'; 
        }
        const { error } = await supabase.from('content_assets').update(updatePayload).eq('id', editingAssetId);
        if (error) throw error;

        sLog('Alterações salvas com sucesso.');
        closeEditModal();
        loadContent();
    } catch (e) {
        sLog('Erro ao salvar: ' + e.message);
    }
}

window.sendToStrategicOrFinal = async (id) => {
    const artLink = document.getElementById('edit-asset-art-final').value;
    if (!artLink) return alert('Por favor, insira o link da arte final antes de enviar!');
    
    try {
        const supabase = getSupabase();
        const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
        
        const hasStrategic = c.metadata?.strategic_approval_required;
        const nextStatus = hasStrategic ? 'APROVAÇÃO ESTRATÉGICA' : 'APROVAÇÃO FINAL';
        
        if (!confirm(`Confirmar envio para ${hasStrategic ? 'Aprovação Estratégica (Interna)' : 'Aprovação Final (Cliente)'}?`)) return;

        const updatePayload = {
            status: nextStatus,
            metadata: {
                ...c.metadata,
                final_asset_url: artLink,
                version: 'FINAL'
            }
        };

        const { error } = await supabase.from('content_assets').update(updatePayload).eq('id', id);
        if (error) throw error;

        closeEditModal();
        loadContent();
    } catch (e) {
        alert('Erro ao enviar: ' + e.message);
    }
};

window.strategicInternalAction = async (id, action) => {
    try {
        const user = await OS_AUTH.check();
        const supabase = getSupabase();
        const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
        
        let nextStatus = action === 'APPROVE' ? 'APROVAÇÃO FINAL' : 'PRODUÇÃO';
        let newHistory = c.metadata?.history || [];
        
        if (action === 'REJECT') {
            const note = prompt('Qual ajuste deve ser feito na produção?');
            if (!note) return;
            
            newHistory.push({
                date: new Date().toISOString(),
                type: 'STRATEGIC',
                author: user?.name || 'Gestão FluxAI',
                note: note
            });

            await supabase.from('content_assets').update({ 
                internal_notes: note,
                metadata: { ...c.metadata, history: newHistory }
            }).eq('id', id);
        } else {
            await supabase.from('content_assets').update({ 
                metadata: { ...c.metadata, history: newHistory }
            }).eq('id', id);
        }

        const { error } = await supabase.from('content_assets').update({ status: nextStatus }).eq('id', id);
        if (error) throw error;

        closeEditModal();
        loadContent();
    } catch (e) {
        alert('Erro: ' + e.message);
    }
};

window.openPublishBridge = async (id) => {
    const supabase = getSupabase();
    const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
    if (!c) return;

    const modal = document.getElementById('pub-modal-overlay');
    if (!modal) return alert('Modal de Publicação não encontrado no HTML.');

    // Preencher dados
    const scheduled = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data não definida';
    document.getElementById('pub-scheduled-time').innerText = scheduled;
    document.getElementById('pub-caption-preview').value = c.caption || '';
    
    // Configurar botões
    document.getElementById('btn-copy-caption').onclick = () => {
        const text = document.getElementById('pub-caption-preview').value;
        navigator.clipboard.writeText(text);
        
        const btn = document.getElementById('btn-copy-caption');
        const oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> COPIADO!';
        setTimeout(() => btn.innerHTML = oldText, 2000);
    };

    document.getElementById('btn-open-assets').onclick = () => {
        if (c.metadata?.final_asset_url) window.open(c.metadata.final_asset_url, '_blank');
        else alert('Nenhum arquivo final encontrado para este conteúdo.');
    };

    document.getElementById('btn-open-account').onclick = () => {
        // Direcionar para o Creator Studio / Business Suite conforme plataforma
        if (c.platform === 'INSTAGRAM') window.open('https://business.facebook.com/latest/composer', '_blank');
        else if (c.platform === 'WEB') window.open('/os/site-editor', '_blank'); // Exemplo
        else window.open('https://google.com', '_blank');
    };

    document.getElementById('btn-confirm-pub').onclick = async () => {
        if (confirm('Deseja confirmar a publicação deste conteúdo agora? O status será alterado para PUBLICADO.')) {
            const { error } = await supabase.from('content_assets').update({ status: 'PUBLICADO' }).eq('id', id);
            if (error) return alert('Erro ao atualizar: ' + error.message);
            
            modal.style.display = 'none';
            sLog('Conteúdo marcado como PUBLICADO.');
            loadContent();
        }
    };

    // Fechar modal
    document.getElementById('close-pub-modal').onclick = () => modal.style.display = 'none';

    modal.style.display = 'flex';
};

window.copyPortalLink = () => {
    if (!currentProject) return alert('Selecione um projeto!');
    const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${currentProject}`;
    
    navigator.clipboard.writeText(portalLink).then(() => {
        const btn = document.getElementById('btn-copy-portal');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> COPIADO';
        btn.style.borderColor = 'var(--os-primary)';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.borderColor = '#444';
        }, 2000);
    }).catch(err => {
        alert('Erro ao copiar: ' + err.message);
    });
};

window.copyToClipboard = (id) => {
    const el = document.getElementById(id);
    el.select();
    document.execCommand('copy');
    sLog('Copiado para a área de transferência.');
};

window.approvePendingAssets = async () => {
    if (!currentProject) return alert('Selecione um projeto!');
    if (!confirm('Deseja enviar todas as pautas de PLANEJAMENTO para a aprovação do cliente?')) return;

    try {
        const supabase = getSupabase();
        
        // 1. Atualizar status no banco
        const { error } = await supabase.from('content_assets')
            .update({ status: 'APROVAÇÃO PLANEJAMENTO' })
            .eq('project_id', currentProject)
            .eq('status', 'PLANEJAMENTO');

        if (error) throw error;
        
        // 2. Gerar link do portal e texto de compartilhamento
        const portalUrl = `https://fluxaidigital.com.br/os/client-portal.html?project_id=${currentProject}`;
        const shareLinkEl = document.getElementById('share-portal-link');
        if (shareLinkEl) shareLinkEl.value = portalUrl;
        
        const { data: proj } = await supabase.from('projects').select('name').eq('id', currentProject).single();
        const { data: assets } = await supabase.from('content_assets')
            .select('title')
            .eq('project_id', currentProject)
            .eq('status', 'APROVAÇÃO PLANEJAMENTO')
            .limit(10);

        let waText = `ðŸš€ *NOVO PLANEJAMENTO DISPONÍVEL - ${proj?.name || 'Projeto'}*\n\nOlá! Acabamos de liberar o novo fluxo estratégico de conteúdo. \n\nAcesse agora para validar roteiros e prazos:\nðŸ”— ${portalUrl}\n\n*Resumo do Lote:*\n`;
        if (assets && assets.length > 0) {
            assets.forEach(a => { waText += `â€¢ ${a.title}\n`; });
        }
        waText += `\n#FluxAI #EstratégiaDigital #HighTicket`;
        
        const waTextEl = document.getElementById('share-whatsapp-text');
        if (waTextEl) waTextEl.value = waText;

        const modal = document.getElementById('modal-share-assets');
        if (modal) modal.style.display = 'flex';

        sLog('Pautas enviadas para Aprovação.');
        loadContent();
    } catch (e) {
        console.error('Erro ao enviar pautas:', e);
        alert('Erro ao enviar pautas: ' + e.message);
    }
};

// Função auxiliar para extrair a cota a partir dos entregáveis do contrato
function extractQuotaFromDeliverables(deliverablesStr) {
    if (!deliverablesStr) return null;
    
    const str = deliverablesStr.toLowerCase();
    
    // Se o padrão for explícito de "X ativos" ou "X slots", ex: "12 ativos/mês"
    const genericMatch = str.match(/(\d+)\s*(ativos|slots|conteúdos|conteudos|posts|publicações|publicacoes|peças|pecas|artigos)/);
    if (genericMatch) {
        return parseInt(genericMatch[1]);
    }
    
    // Caso seja composto, ex: "2 carrosséis + 2 reels/mês" ou "4 posts + 2 vídeos"
    const pattern = /(\d+)\s*(reels|reles|carross[eê]is|posts?|v[ií]deos?|stories|cards?|landing\s*pages?|sites?)/g;
    let total = 0;
    let match;
    let found = false;
    
    while ((match = pattern.exec(str)) !== null) {
        total += parseInt(match[1]);
        found = true;
    }
    
    if (found && total > 0) {
        return total;
    }
    
    // Fallback simples: se tiver apenas números gerais no texto curto (menos de 50 caracteres)
    if (str.length < 50) {
        const simpleMatches = str.match(/\d+/g);
        if (simpleMatches) {
            const simpleSum = simpleMatches.reduce((sum, val) => sum + parseInt(val), 0);
            if (simpleSum > 0) return simpleSum;
        }
    }
    
    return null;
}

window.runAiPlanner = async () => {
    const user = await OS_AUTH.check();
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') return alert('Acesso negado.');

    const filter = document.getElementById('project-filter');
    const selectedId = filter.value || currentProject;
    if (!selectedId) return alert('Selecione um projeto para gerar planejamento estratégico!');

    const supabase = getSupabase();
    
    // VERIFICAÇÃO DE COTA (CONTRATO) DE FORMA DINÂMICA E RESILIENTE
    let project = null;
    let count = 0;
    let deliverablesStr = '';
    let isDbOnline = false;

    try {
        const { data, error } = await supabase.from('projects').select('*, contracts(*)').eq('id', selectedId).single();
        if (!error && data) {
            project = data;
            isDbOnline = true;
            
            const { count: dbCount, error: countErr } = await supabase.from('content_assets').select('*', { count: 'exact', head: true }).eq('project_id', selectedId);
            if (!countErr) {
                count = dbCount || 0;
            }
        }
    } catch (dbErr) {
        console.warn('Erro ao conectar ao Supabase para verificação de cota:', dbErr);
    }

    // Fallback offline / LocalStorage se o banco estiver offline ou indisponível
    if (!isDbOnline) {
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        project = mockProjects.find(p => p.id === selectedId);
        
        const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        count = mockAssets.filter(item => item && item.project_id === selectedId).length;
    }

    // Obter cota real dos deliverables do contrato
    let quota = 12; // Default padrão
    
    if (project) {
        // Buscar deliverables do relacionamento do banco
        if (project.contracts) {
            const contracts = Array.isArray(project.contracts) ? project.contracts : [project.contracts];
            const activeContract = contracts.find(c => c.status === 'ATIVO') || contracts[0];
            if (activeContract) {
                deliverablesStr = activeContract.deliverables || '';
            }
        }
        
        // Se não houver deliverables no banco ou for offline, buscar dos mocks de contratos
        if (!deliverablesStr) {
            const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
            const clientContract = mockContracts.find(c => c.project_id === selectedId && c.status === 'ATIVO')
                || mockContracts.find(c => c.project_id === selectedId);
            if (clientContract) {
                deliverablesStr = clientContract.deliverables || '';
            }
        }
        
        // Tentar extrair do deliverables ou do content_scope antigo como fallback
        const scopeStr = deliverablesStr || project.content_scope || '';
        const parsedQuota = extractQuotaFromDeliverables(scopeStr);
        if (parsedQuota !== null) {
            quota = parsedQuota;
        }
    }

    const remaining = quota - count;

    if (remaining <= 0) {
        return alert(`Limite de Cota Atingido (${count}/${quota}).\n\nApague ativos para liberar espaço ou solicite upgrade de contrato.`);
    }

    sLog(`Iniciando Motor Estratégico (Cota: ${count}/${quota} | Disponível: ${remaining})`);
    
    try {
        const { AIPlanner } = await import('../../services/ai-planner.js');
        const type = document.getElementById('ai-planner-service').value;
        
        if (confirm(`Gerar ${type === 'ALL' ? 'novo planejamento' : 'ativos de ' + type} para preencher os ${remaining} slots disponíveis no contrato?`)) {
            const newAssets = await AIPlanner.generatePlan(selectedId, type, remaining);
            
            if (newAssets && newAssets.length > 0) {
                // APLICAR INTELIGÃŠNCIA DE PRAZO E RESPONSÁVEL
                const processedAssets = newAssets.map(asset => {
                    const titleUpper = asset.title.toUpperCase();
                    const type = Object.keys(RESPONSIBLE_MAP).find(k => titleUpper.includes(k)) || 'CARD';
                    
                    const scheduledDate = new Date(asset.scheduled_at);
                    const now = new Date();
                    
                    // Lógica Pub-2 para Planejamento/Produção Inicial
                    let deadline = new Date(scheduledDate.getTime() - 48 * 60 * 60 * 1000);
                    if (deadline < now) deadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                    
                    // Lógica de Prioridade: Apenas itens críticos de Tração e Marca são ALTA por padrão
                    const priority = (titleUpper.includes('TRAFEGO') || titleUpper.includes('ADS') || titleUpper.includes('BRANDING')) ? 'ALTA' : 'MÉDIA';

                    return {
                        ...asset,
                        priority: priority,
                        metadata: {
                            ...asset.metadata,
                            responsible: RESPONSIBLE_MAP[type] || 'Design',
                            approval_deadline: deadline.toISOString(),
                            revision_cycle: 1,
                            version: 'V1'
                        }
                    };
                });

                const { error } = await supabase.from('content_assets').insert(processedAssets);
                if (error) throw error;
                sLog(`${processedAssets.length} Ativos de Logística Gerados.`);
                loadContent();
            }
        }
    } catch (err) {
        alert('Erro ao gerar plano: ' + err.message);
    }
};

window.forceReady = async (id) => {
    if (!confirm('Deseja pular as etapas de aprovação e marcar este ativo como PRONTO para publicação?')) return;
    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('content_assets').update({ status: 'PRONTO' }).eq('id', id);
        if (error) throw error;
        sLog('Ativo forçado para o status PRONTO.');
        loadContent();
    } catch (e) {
        alert('Erro ao forçar conclusão: ' + e.message);
    }
};



window.deleteAsset = async (id) => {
    if (!confirm('Deseja excluir este ativo da esteira?')) return;
    const supabase = getSupabase();
    await supabase.from('content_assets').delete().eq('id', id);
    loadContent();
};

initEngine();
async function setupRealtime() { const supabase = getSupabase(); if (realtimeChannel) { supabase.removeChannel(realtimeChannel); } realtimeChannel = supabase.channel('content-updates').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content_assets' }, (payload) => { sLog('Sincronização Realtime: Alteração detectada.'); loadContent(); }).subscribe(); }
