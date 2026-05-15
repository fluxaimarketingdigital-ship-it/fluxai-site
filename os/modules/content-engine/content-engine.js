import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

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

// MATRIZ DE OPERAÃƒâ€¡Ãƒâ€¢ES ESTRATÃƒâ€°GICAS FLUXAI v7.0 (FLUXO MESTRE)
const STRATEGIC_MATRIX = {
    'REELS': { 
        name: 'DireÃƒÂ§ÃƒÂ£o Operacional Audiovisual', 
        clientPrefix: 'REELS', 
        platform: 'REELS',
        generate: (p, obj) => `
Ã°Å¸Å½Â¯ OBJETIVO: ${obj}
Ã°Å¸Å½Â¬ FORMATO: Reels (Vertical 9:16)
Ã¢ï¿½Â±Ã¯Â¸ï¿½ TEMPO ESTIMADO: 45-60 segundos

Ã°Å¸Âªï¿½ HOOK: "A maioria das empresas nÃƒÂ£o falha por falta de produto, mas por excesso de ruÃƒÂ­do operacional."
Ã¢ï¿½Â¸Ã¯Â¸ï¿½ PAUSA ESTRATÃƒâ€°GICA: [SilÃƒÂªncio de 1.5s para ÃƒÂªnfase visual]
Ã°Å¸â€œï¿½ DESENVOLVIMENTO: Discorrer sobre a diferenÃƒÂ§a entre 'movimento' e 'progresso real'. Utilizar tom de voz Soberano e TÃƒÂ©cnico.
Ã°Å¸â€˜ï¿½Ã¯Â¸ï¿½ DIREÃƒâ€¡ÃƒÆ’O DE CENA: Enquadramento em plano mÃƒÂ©dio. Fundo neutro/escritÃƒÂ³rio. IluminaÃƒÂ§ÃƒÂ£o de alto contraste.
Ã¢Å“Â¨ CTA: "Comente ESTRUTURA para acessar o diagnÃƒÂ³stico de eficiÃƒÂªncia da FluxAI."
Ã°Å¸â€œï¿½ LEGENDA: Narrativa focada em autoridade executiva e diferenciaÃƒÂ§ÃƒÂ£o de mercado.
        `
    },
    'CARROSSEL': { 
        name: 'Estrutura Narrativa de Carrossel', 
        clientPrefix: 'CARROSSEL', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
Ã°Å¸Å½Â¯ OBJETIVO: ${obj}
Ã°Å¸Å½Â¬ FORMATO: Carrossel EstratÃƒÂ©gico (10 slides)

Ã°Å¸â€“Â¼Ã¯Â¸ï¿½ ESTRUTURA NARRATIVA:
- Slide 01: [Gancho de AtenÃƒÂ§ÃƒÂ£o] "O custo invisÃƒÂ­vel da desorganizaÃƒÂ§ÃƒÂ£o estratÃƒÂ©gica."
- Slide 02: [TensÃƒÂ£o] Por que processos manuais estÃƒÂ£o drenando sua margem de lucro.
- Slide 03: [Conceito] A lÃƒÂ³gica da Engenharia de Processos aplicada ao marketing.
- Slide 04: [DiferenciaÃƒÂ§ÃƒÂ£o] FluxAI OS vs. GestÃƒÂ£o Tradicional.
- Slide 05: [Metodologia] Os 4 pilares da escala sustentÃƒÂ¡vel.
- Slide 06: [VisualizaÃƒÂ§ÃƒÂ£o] GrÃƒÂ¡fico de eficiÃƒÂªncia operacional.
- Slide 10: [CTA] Direcionamento para a Central de InteligÃƒÂªncia.
        `
    },
    'CARD': { 
        name: 'DireÃƒÂ§ÃƒÂ£o EstratÃƒÂ©gica Visual', 
        clientPrefix: 'POST', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
Ã°Å¸Å½Â¯ OBJETIVO: ${obj}
Ã°Å¸â€™Â¡ CONCEITO: AfirmaÃƒÂ§ÃƒÂ£o de Autoridade Absoluta.
Ã°Å¸Å½Â¨ DESIGN: Tipografia imponente, alto espaÃƒÂ§o negativo (silÃƒÂªncio visual).
Ã°Å¸â€œï¿½ HEADLINE: "Escala nÃƒÂ£o ÃƒÂ© sobre intensidade, ÃƒÂ© sobre arquitetura."
Ã¢Å“Â¨ CTA: "Toque no link da Bio para entender a Engenharia por trÃƒÂ¡s da FluxAI."
        `
    },
    'SITE': { 
        name: 'Arquitetura EstratÃƒÂ©gica Digital', 
        clientPrefix: 'SITE', 
        platform: 'WEB',
        generate: (p, obj) => `
Ã°Å¸Å½Â¯ OBJETIVO: ConversÃƒÂ£o de Alta Autoridade (High-Ticket)
Ã°Å¸Å’ï¿½ ESTRUTURA UX: Foco em Jornada de DecisÃƒÂ£o Executiva

Ã°Å¸ï¿½â€”Ã¯Â¸ï¿½ SEÃƒâ€¡Ãƒâ€¢ES:
1. HERO: Proposta de valor inquestionÃƒÂ¡vel + Visual Cinematic.
2. DIAGNÃƒâ€œSTICO: ExposiÃƒÂ§ÃƒÂ£o das dores do ICP e soluÃƒÂ§ÃƒÂ£o tÃƒÂ©cnica.
3. ECOSSISTEMA: Detalhamento dos mÃƒÂ³dulos operacionais.
4. PROVA DE VALOR: Resultados tangÃƒÂ­veis e depoimentos selecionados.
Ã°Å¸Å¡â‚¬ SEO: OtimizaÃƒÂ§ÃƒÂ£o para palavras-chave de intenÃƒÂ§ÃƒÂ£o comercial institucional.
        `
    },
    'BRANDING': { 
        name: 'Arquitetura de Posicionamento', 
        clientPrefix: 'BRANDING', 
        platform: 'BRAND',
        generate: (p, obj) => `
Ã°Å¸â€™Å½ PERCEPÃƒâ€¡ÃƒÆ’O: Posicionamento de Elite e Exclusividade TÃƒÂ©cnica.
Ã°Å¸â€œï¿½ NARRATIVA: Construir a imagem de ${p.company_name} como autoridade mÃƒÂ¡xima no setor.
Ã°Å¸Å½Â¨ VISUAL: Paleta sÃƒÂ³bria, contrastes elegantes e iconografia proprietÃƒÂ¡ria.
        `
    },
    'TRAFEGO': { 
        name: 'EstratÃƒÂ©gia de AquisiÃƒÂ§ÃƒÂ£o', 
        clientPrefix: 'AQUISIÃƒâ€¡ÃƒÆ’O', 
        platform: 'ADS',
        generate: (p, obj) => `
Ã°Å¸Å½Â¯ OBJETIVO: AtraÃƒÂ§ÃƒÂ£o de Leads Qualificados (ICP High-Ticket)
Ã°Å¸â€œÂ¡ CANAIS: Meta Ads + LinkedIn Ads
Ã°Å¸â€œï¿½ CRIATIVOS: Foco em dor latente e prova de autoridade.
Ã°Å¸â€™Â° ESTRATÃƒâ€°GIA: Funil de conscientizaÃƒÂ§ÃƒÂ£o progressiva com foco em LTV.
        `
    },
    'CRM': { 
        name: 'Estrutura de Relacionamento', 
        clientPrefix: 'CRM', 
        platform: 'CRM',
        generate: (p, obj) => `
Ã°Å¸â€œÅ  GESTÃƒÆ’O: InteligÃƒÂªncia de Dados aplicada ao Funil de Vendas.
Ã°Å¸â€â€ž AUTOMAÃƒâ€¡ÃƒÆ’O: RÃƒÂ©guas de relacionamento baseadas no comportamento do lead.
Ã°Å¸â€œË† MÃƒâ€°TRICA: Foco em Health Score e Taxa de RetenÃƒÂ§ÃƒÂ£o.
        `
    },
    'AUTOMACAO': { 
        name: 'Arquitetura Operacional', 
        clientPrefix: 'AUTOMAÃƒâ€¡ÃƒÆ’O', 
        platform: 'SYSTEM',
        generate: (p, obj) => `
Ã¢Å¡â„¢Ã¯Â¸ï¿½ FLUXO: AutomaÃƒÂ§ÃƒÂ£o de processos repetitivos para ganho de eficiÃƒÂªncia.
Ã°Å¸â€â€” INTEGRAÃƒâ€¡ÃƒÆ’O: SincronizaÃƒÂ§ÃƒÂ£o em tempo real entre vendas e operaÃƒÂ§ÃƒÂ£o.
Ã°Å¸â€ºÂ¡Ã¯Â¸ï¿½ GOVERNANÃƒâ€¡A: SeguranÃƒÂ§a de dados e rastreabilidade total das aÃƒÂ§ÃƒÂµes.
        `
    },
    'CONSULTORIA': { 
        name: 'DiagnÃƒÂ³stico EstratÃƒÂ©gico', 
        clientPrefix: 'DIAGNÃƒâ€œSTICO', 
        platform: 'CONSULTING',
        generate: (p, obj) => `
Ã°Å¸â€œâ€¹ ESCOPO: AnÃƒÂ¡lise 360Ã‚Âº da infraestrutura digital e operacional.
Ã°Å¸â€œâ€˜ ENTREGA: RelatÃƒÂ³rio tÃƒÂ©cnico com pontos de atrito e oportunidades de escala.
Ã°Å¸Å¡â‚¬ IMPACTO: DefiniÃƒÂ§ÃƒÂ£o do roadmap estratÃƒÂ©gico para os prÃƒÂ³ximos 12 meses.
        `
    }
};

const RESPONSIBLE_MAP = {
    'AUDIOVISUAL': 'Audiovisual',
    'REELS': 'Audiovisual',
    'NARRATIVA': 'Estrategista',
    'DIREÃƒâ€¡ÃƒÆ’O': 'Estrategista',
    'ARQUITETURA': 'Design',
    'CARROSSEL': 'Design',
    'CARD': 'Design',
    'SITE': 'Desenvolvimento Web',
    'TRAFEGO': 'Gestor de TrÃƒÂ¡fego',
    'ADS': 'Gestor de TrÃƒÂ¡fego',
    'BRANDING': 'Estrategista',
    'CRM': 'Estrategista',
    'AUTOMAÃƒâ€¡ÃƒÆ’O': 'Sistemas',
    'DIAGNÃƒâ€œSTICO': 'Estrategista'
};

export async function initEngine() {
export async function initEngine() {
    sLog('Iniciando Motor de ConteÃºdo v7.0...');
    try {
        // Expor funÃ§Ãµes globais para a UI
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
        sLog('Carga Inicial: OK');
        setupRealtime();

        // BOTÃƒÆ’O GLOBAL WA (TOP BAR)
        const btnGlobalWa = document.getElementById('btn-global-wa');
        if (btnGlobalWa) {
            btnGlobalWa.onclick = () => {
                const projectFilter = document.getElementById('project-filter');
                const selectedId = projectFilter.value;
                if (!selectedId) return alert('Selecione um cliente especÃƒÂ­fico para enviar o lembrete direto.');
                
                const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${selectedId}`;
                const msg = `OlÃƒÂ¡! Ã°Å¸Å¡â‚¬%0A%0APassando para lembrar que temos conteÃƒÂºdos aguardando sua aprovaÃƒÂ§ÃƒÂ£o no portal da FluxAI.%0A%0AConfira aqui seu calendÃƒÂ¡rio atualizado:%0A${portalLink}`;
                window.open(`https://wa.me/?text=${msg}`, '_blank');
            };
        }

        // Listeners
        if (filter) {
            filter.onchange = (e) => {
                currentProject = e.target.value;
                localStorage.setItem('fluxai_current_project_id', currentProject);
                
                // Mostrar/Esconder botÃ£o de cÃ³pia
                const btnCopy = document.getElementById('btn-copy-portal');
                if (btnCopy) btnCopy.style.display = currentProject ? 'flex' : 'none';
                
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

        // Armazenar projetos globalmente para consulta rÃƒÂ¡pida
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
        sLog('Falha CrÃƒÂ­tica na Carga de Clientes: ' + e.message);
        console.error(e);
    }
}

async function loadContent() {
    const dashboard = document.querySelector('main');
    const projectFilter = document.getElementById('project-filter');
    
    // DEFESA DE INTERFACE: Garantir que elementos bÃƒÂ¡sicos existam
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
            // Tenta buscar o dia em diferentes possÃƒÂ­veis colunas do banco
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

        // RESTAURAR BOTÃƒâ€¢ES DE AÃƒâ€¡ÃƒÆ’O
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
        
        // Renderizar CalendÃƒÂ¡rios
        renderCalendar('calendar-strategic-body', safeContents, 'STRATEGIC');
        renderCalendar('calendar-operational-body', safeContents, 'OPERATIONAL');
        
        // NOVO: Verificar Alerta de Ciclo
        checkLogisticsCycle();
        checkPublishingAlerts(contents);
        
    } catch (e) {
        sLog('Erro ConteÃƒÂºdo: ' + e.message);
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
    } catch (e) { console.error('[LOGÃƒï¿½STICA] Erro ao verificar ciclo:', e); }
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
        sLog(`Ã°Å¸â€œÂ¢ ALERTA: VocÃƒÂª tem ${todayPosts.length} conteÃƒÂºdos para publicar HOJE!`);
        // Opcional: Mostrar uma notificaÃƒÂ§ÃƒÂ£o visual mais agressiva ou banner
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
        approval: contents.filter(c => c.status.includes('APROVAÃƒâ€¡ÃƒÆ’O')).length,
        atrasado: contents.filter(c => {
            if (c.status === 'PUBLICADO' || c.status === 'PRONTO') return false;
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            const scheduled = new Date(c.scheduled_at);
            // Atraso se passou do prazo de aprovaÃƒÂ§ÃƒÂ£o OU se estÃƒÂ¡ em produÃƒÂ§ÃƒÂ£o e passou da data de postagem
            return (deadline && deadline < now) || (c.status === 'PRODUÃƒâ€¡ÃƒÆ’O' && scheduled < now);
        }).length,
        ready: contents.filter(c => c.status === 'PRONTO').length
    };

    OS_UI.renderMetric('metric-assets', { label: 'LogÃƒÂ­stica Total', value: metrics.total, trend: 'v1.0', meta: 'Escopo' });
    OS_UI.renderMetric('metric-approval', { label: 'Aguardando Cliente', value: metrics.approval, trend: '!', meta: 'AtenÃƒÂ§ÃƒÂ£o' });
    OS_UI.renderMetric('metric-production', { label: 'Atraso Operacional', value: metrics.atrasado, trend: 'down', meta: 'CrÃƒÂ­tico' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos para Postar', value: metrics.ready, trend: 'Ã¢Å“â€', meta: 'PublicaÃƒÂ§ÃƒÂ£o' });

    // Atualizar status para ATRASADO via cÃƒÂ³digo se necessÃƒÂ¡rio (LÃƒÂ³gica em tempo real)
    contents.forEach(async c => {
        if (c.status !== 'ATRASADO' && c.status !== 'PUBLICADO' && c.status !== 'PRONTO') {
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            if (deadline && deadline < now) {
                // Sincronizar com DB (Opcional - pode ser apenas visual no dashboard)
                console.warn(`[LOGÃƒï¿½STICA] Ativo ${c.title} estÃƒÂ¡ ATRASADO por prazo de aprovaÃƒÂ§ÃƒÂ£o.`);
            }
        }
    });
}

function renderContentTable(contents) {
    const body = document.getElementById('pipeline-table-body');
    if (!contents || contents.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px;">Nenhum conteÃƒÂºdo.</td></tr>`;
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
                        ${isHighRisk ? '<i class="fa-solid fa-triangle-exclamation" title="Risco Operacional: Ciclo de ajustes alto ou atraso crÃƒÂ­tico" style="color:var(--os-danger); font-size:0.7rem; animation: pulse 2s infinite;"></i>' : ''}
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
                            <button class="btn-mini" title="Ponte de PublicaÃƒÂ§ÃƒÂ£o" onclick="window.openPublishBridge('${c.id}')" style="background: var(--os-primary); color: #000; border: none;">
                                <i class="fa-solid fa-rocket"></i>
                            </button>
                        ` : `
                            ${c.status !== 'PLANEJAMENTO' ? `
                                <button class="btn-mini" title="ForÃƒÂ§ar ConclusÃƒÂ£o (Pular AprovaÃƒÂ§ÃƒÂ£o)" onclick="window.forceReady('${c.id}')" style="background: rgba(16, 185, 129, 0.1); border-color: var(--os-success); color: var(--os-success);">
                                    <i class="fa-solid fa-circle-check"></i>
                                </button>
                            ` : ''}
                        `}
                        ${c.metadata?.reference_url ? `
                            <a href="${c.metadata.reference_url}" target="_blank" class="btn-mini" title="Ver ReferÃƒÂªncia" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-color: #3b82f6;">
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
    
    // Atualizar Label do MÃƒÂªs
    const monthNames = ["Janeiro", "Fevereiro", "MarÃƒÂ§o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
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
            if (!isStrategic && !['PRODUÃƒâ€¡ÃƒÆ’O', 'REVISÃƒÆ’O INTERNA FINAL', 'APROVAÃƒâ€¡ÃƒÆ’O FINAL', 'PRONTO', 'PUBLICADO'].includes(c.status)) return '';

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
    if (status === 'REVISÃƒÆ’O GESTÃƒÆ’O') return '#8b5cf6'; // Roxo
    if (status === 'APROVAÃƒâ€¡ÃƒÆ’O PLANEJAMENTO') return '#3b82f6'; // Azul
    if (status === 'APROVAÃƒâ€¡ÃƒÆ’O ESTRATÃƒâ€°GICA') return '#3b82f6'; // Azul
    if (status === 'AJUSTE') return '#ef4444'; // Vermelho
    if (status === 'PRODUÃƒâ€¡ÃƒÆ’O') return '#f59e0b'; // Amarelo/Laranja
    if (status === 'AJUSTE DE PRODUÃƒâ€¡ÃƒÆ’O') return '#ec4899'; // Rosa (Refinamento tÃƒÂ©cnico)
    if (status === 'REVISÃƒÆ’O INTERNA FINAL') return '#ec4899';
    if (status === 'APROVAÃƒâ€¡ÃƒÆ’O FINAL') return '#3b82f6'; // Azul
    if (status === 'PRONTO') return '#10b981'; // Verde
    if (status === 'PUBLICADO') return '#059669'; // Verde Escuro
    if (status === 'ATRASADO') return '#7f1d1d'; // Marrom/Vermelho Escuro
    return '#444';
}

window.openApproval = (id) => {
    window.open(`/os/approval.html?id=${id}`, '_blank');
};

let editingAssetId = null;
window.openEditModal = async (id) => {
    editingAssetId = id;
    const supabase = getSupabase();
    const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
    if (c) {
        const isPlanning = c.status === 'PLANEJAMENTO' || c.status === 'APROVAÃƒâ€¡ÃƒÆ’O ESTRATÃƒâ€°GICA' || c.status === 'REVISÃƒÆ’O GESTÃƒÆ’O';
        const isDirector = localStorage.getItem('os_role') === 'DIRETOR';
        
        // Mapear campos do HTML (Somente os que sÃƒÂ£o fixos)
        document.getElementById('edit-asset-title').value = c.title;
        document.getElementById('edit-asset-ref').value = c.metadata?.reference_url || '';
        document.getElementById('edit-asset-art-final').value = c.metadata?.final_asset_url || '';
        
        // Injetar campos de metadados no container especÃƒÂ­fico
        const metaGrid = document.getElementById('edit-asset-meta-fields');
        if (metaGrid) {
        // Renderizar Roteiro e HistÃƒÂ³rico
        const history = c.metadata?.history || [];
        const historyHtml = history.length > 0 ? history.map(h => `
            <div style="padding:10px; border-bottom:1px solid #222; font-size:0.7rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <b style="color:${h.type === 'CLIENT' ? '#60a5fa' : '#8b5cf6'}">${h.type === 'CLIENT' ? 'Ã°Å¸â€œÅ’ AJUSTE CLIENTE' : 'Ã°Å¸â€ºÂ¡Ã¯Â¸ï¿½ AJUSTE ESTRATÃƒâ€°GICO'}</b>
                    <span style="opacity:0.5;">${new Date(h.date).toLocaleString('pt-BR')}</span>
                </div>
                <div style="color:#eee; line-height:1.4;">${h.note}</div>
                <div style="font-size:0.6rem; opacity:0.4; margin-top:3px;">Por: ${h.author}</div>
            </div>
        `).join('') : '<div style="padding:40px; text-align:center; opacity:0.3; font-size:0.7rem;">Sem histÃƒÂ³rico de ajustes atÃƒÂ© o momento.</div>';

        document.getElementById('edit-asset-roadmap-container').innerHTML = `
            <div class="edit-modal-grid">
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">ROTEIRO ESTRATÃƒâ€°GICO (PAUTA)</label>
                    <textarea id="edit-asset-caption" style="width:100%; height:320px; background:#0a0a0a; border:1px solid #222; color:#fff; padding:15px; border-radius:8px; font-family:inherit; font-size:0.9rem; line-height:1.6; outline:none; transition: border 0.3s;"></textarea>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">HISTÃƒâ€œRICO DE AJUSTES</label>
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
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">RESPONSÃƒï¿½VEL</label>
                    <select id="edit-asset-responsible" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="Design">Design</option>
                        <option value="Audiovisual">Audiovisual</option>
                        <option value="Estrategista">Estrategista</option>
                        <option value="Gestor de TrÃƒÂ¡fego">Gestor de TrÃƒÂ¡fego</option>
                        <option value="Social Media">Social Media</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">CICLO DE AJUSTE</label>
                    <select id="edit-asset-version" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="V1">V1 - Inicial</option>
                        <option value="V2">V2 - Ajuste 1</option>
                        <option value="V3">V3 - Ajuste 2 (CRÃƒï¿½TICO)</option>
                        <option value="FINAL">FINAL - Pronto para Postar</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">PRAZO DE APROVAÃƒâ€¡ÃƒÆ’O</label>
                    <input type="datetime-local" id="edit-asset-deadline" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                </div>
                
                <div style="grid-column: span 3; display:flex; gap:30px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); margin-top:5px;">
                     <div style="display:flex; align-items:center; gap:10px; opacity: ${isLocked ? '0.5' : '1'};">
                        <input type="checkbox" id="edit-asset-strategic-req" style="width:16px; height:16px; cursor:pointer;" ${c.metadata?.strategic_approval_required ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
                        <label for="edit-asset-strategic-req" style="font-size:0.65rem; color:#3b82f6; font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">EXIGIR APROVAÃƒâ€¡ÃƒÆ’O ESTRATÃƒâ€°GICA?</label>
                     </div>
                     <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="edit-asset-risk" style="width:16px; height:16px; cursor:pointer;" ${c.metadata?.risk ? 'checked' : ''}>
                        <label for="edit-asset-risk" style="font-size:0.65rem; color:var(--os-danger); font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">RISCO OPERACIONAL</label>
                     </div>
                </div>
            `;
            
            // Setar valores apÃƒÂ³s injeÃƒÂ§ÃƒÂ£o
            document.getElementById('edit-asset-responsible').value = c.metadata?.responsible || 'Design';
            document.getElementById('edit-asset-version').value = c.metadata?.version || 'V1';
            
            // GovernanÃƒÂ§a de EdiÃƒÂ§ÃƒÂ£o: Campos automÃƒÂ¡ticos ficam desabilitados
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



        // Atualizar BotÃƒÂµes DinÃƒÂ¢micos
        const footerActions = document.getElementById('edit-asset-footer-actions');
        if (footerActions) {
            const hasStrategic = c.metadata?.strategic_approval_required;
            
            footerActions.innerHTML = `
                ${(c.status === 'PRODUÃƒâ€¡ÃƒÆ’O' || c.status === 'AJUSTE DE PRODUÃƒâ€¡ÃƒÆ’O') ? `
                    <button class="btn-mini" onclick="window.sendToStrategicOrFinal('${c.id}')" style="padding:10px 20px; background:#8b5cf6; color:#fff; font-weight:800; border:none; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                        <i class="fa-solid fa-paper-plane"></i> ${hasStrategic ? 'Finalizar e Enviar p/ AprovaÃƒÂ§ÃƒÂ£o EstratÃƒÂ©gica' : 'Finalizar e Enviar'}
                    </button>
                ` : ''}
                ${c.status === 'APROVAÃƒâ€¡ÃƒÆ’O ESTRATÃƒâ€°GICA' ? `
                    <button class="btn-mini" onclick="window.strategicInternalAction('${c.id}', 'REJECT')" style="padding:10px 20px; background:var(--os-danger); color:#fff; font-weight:800; border:none;">Solicitar Ajuste (ProduÃƒÂ§ÃƒÂ£o)</button>
                    <button class="btn-mini" onclick="window.strategicInternalAction('${c.id}', 'APPROVE')" style="padding:10px 20px; background:var(--os-success); color:#fff; font-weight:800; border:none;">Aprovar p/ Cliente</button>
                ` : ''}
                <button class="btn-mini" onclick="window.saveAssetEdit()" style="padding:10px 20px; background:var(--os-primary); color:#000; font-weight:800;">Salvar AlteraÃƒÂ§ÃƒÂµes</button>
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

        // LÃƒâ€œGICA DE TRANSIÃƒâ€¡ÃƒÆ’O DE STATUS INTELIGENTE
        if (currentAsset.status === 'AJUSTE') {
            updatePayload.status = 'PLANEJAMENTO';
        } else if (currentAsset.status === 'AJUSTE DE PRODUÃƒâ€¡ÃƒÆ’O') {
            updatePayload.status = 'PRODUÃƒâ€¡ÃƒÆ’O'; 
        }
        const { error } = await supabase.from('content_assets').update(updatePayload).eq('id', editingAssetId);
        if (error) throw error;

        sLog('AlteraÃƒÂ§ÃƒÂµes salvas com sucesso.');
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
        const nextStatus = hasStrategic ? 'APROVAÃƒâ€¡ÃƒÆ’O ESTRATÃƒâ€°GICA' : 'APROVAÃƒâ€¡ÃƒÆ’O FINAL';
        
        if (!confirm(`Confirmar envio para ${hasStrategic ? 'AprovaÃƒÂ§ÃƒÂ£o EstratÃƒÂ©gica (Interna)' : 'AprovaÃƒÂ§ÃƒÂ£o Final (Cliente)'}?`)) return;

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
        
        let nextStatus = action === 'APPROVE' ? 'APROVAÃƒâ€¡ÃƒÆ’O FINAL' : 'PRODUÃƒâ€¡ÃƒÆ’O';
        let newHistory = c.metadata?.history || [];
        
        if (action === 'REJECT') {
            const note = prompt('Qual ajuste deve ser feito na produÃƒÂ§ÃƒÂ£o?');
            if (!note) return;
            
            newHistory.push({
                date: new Date().toISOString(),
                type: 'STRATEGIC',
                author: user?.name || 'GestÃƒÂ£o FluxAI',
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
    if (!modal) return alert('Modal de PublicaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrado no HTML.');

    // Preencher dados
    const scheduled = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data nÃƒÂ£o definida';
    document.getElementById('pub-scheduled-time').innerText = scheduled;
    document.getElementById('pub-caption-preview').value = c.caption || '';
    
    // Configurar botÃƒÂµes
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
        else alert('Nenhum arquivo final encontrado para este conteÃƒÂºdo.');
    };

    document.getElementById('btn-open-account').onclick = () => {
        // Direcionar para o Creator Studio / Business Suite conforme plataforma
        if (c.platform === 'INSTAGRAM') window.open('https://business.facebook.com/latest/composer', '_blank');
        else if (c.platform === 'WEB') window.open('/os/site-editor', '_blank'); // Exemplo
        else window.open('https://google.com', '_blank');
    };

    document.getElementById('btn-confirm-pub').onclick = async () => {
        if (confirm('Deseja confirmar a publicaÃƒÂ§ÃƒÂ£o deste conteÃƒÂºdo agora? O status serÃƒÂ¡ alterado para PUBLICADO.')) {
            const { error } = await supabase.from('content_assets').update({ status: 'PUBLICADO' }).eq('id', id);
            if (error) return alert('Erro ao atualizar: ' + error.message);
            
            modal.style.display = 'none';
            sLog('ConteÃƒÂºdo marcado como PUBLICADO.');
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
    sLog('Copiado para a ÃƒÂ¡rea de transferÃƒÂªncia.');
};

window.approvePendingAssets = async () => {
    if (!currentProject) return alert('Selecione um projeto!');
    if (!confirm('Deseja enviar todas as pautas de PLANEJAMENTO para a aprovaÃƒÂ§ÃƒÂ£o do cliente?')) return;

    try {
        const supabase = getSupabase();
        
        // 1. Atualizar status no banco
        const { error } = await supabase.from('content_assets')
            .update({ status: 'APROVAÃƒâ€¡ÃƒÆ’O PLANEJAMENTO' })
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
            .eq('status', 'APROVAÃƒâ€¡ÃƒÆ’O PLANEJAMENTO')
            .limit(10);

        let waText = `Ã°Å¸Å¡â‚¬ *NOVO PLANEJAMENTO DISPONÃƒï¿½VEL - ${proj?.name || 'Projeto'}*\n\nOlÃƒÂ¡! Acabamos de liberar o novo fluxo estratÃƒÂ©gico de conteÃƒÂºdo. \n\nAcesse agora para validar roteiros e prazos:\nÃ°Å¸â€â€” ${portalUrl}\n\n*Resumo do Lote:*\n`;
        if (assets && assets.length > 0) {
            assets.forEach(a => { waText += `Ã¢â‚¬Â¢ ${a.title}\n`; });
        }
        waText += `\n#FluxAI #EstratÃƒÂ©giaDigital #HighTicket`;
        
        const waTextEl = document.getElementById('share-whatsapp-text');
        if (waTextEl) waTextEl.value = waText;

        const modal = document.getElementById('modal-share-assets');
        if (modal) modal.style.display = 'flex';

        sLog('Pautas enviadas para AprovaÃƒÂ§ÃƒÂ£o.');
        loadContent();
    } catch (e) {
        console.error('Erro ao enviar pautas:', e);
        alert('Erro ao enviar pautas: ' + e.message);
    }
};

window.runAiPlanner = async () => {
    const user = await OS_AUTH.check();
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') return alert('Acesso negado.');

    const filter = document.getElementById('project-filter');
    const selectedId = filter.value || currentProject;
    if (!selectedId) return alert('Selecione um projeto para gerar planejamento estratÃƒÂ©gico!');

    const supabase = getSupabase();
    
    // VERIFICAÃƒâ€¡ÃƒÆ’O DE COTA (CONTRATO)
    const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', selectedId).single();
    const { count } = await supabase.from('content_assets').select('*', { count: 'exact', head: true }).eq('project_id', selectedId);
    
    // Tentar extrair nÃƒÂºmero da cota do 'content_scope' (Ex: "12 Ativos/mÃƒÂªs")
    const quotaMatch = project.content_scope ? project.content_scope.match(/\d+/) : null;
    const quota = quotaMatch ? parseInt(quotaMatch[0]) : 12;

    const remaining = quota - count;

    if (remaining <= 0) {
        return alert(`Limite de Cota Atingido (${count}/${quota}).\n\nApague ativos para liberar espaÃƒÂ§o ou solicite upgrade de contrato.`);
    }

    sLog(`Iniciando Motor EstratÃƒÂ©gico (Cota: ${count}/${quota} | DisponÃƒÂ­vel: ${remaining})`);
    
    try {
        const { AIPlanner } = await import('../../services/ai-planner.js');
        const type = document.getElementById('ai-planner-service').value;
        
        if (confirm(`Gerar ${type === 'ALL' ? 'novo planejamento' : 'ativos de ' + type} para preencher os ${remaining} slots disponÃƒÂ­veis no contrato?`)) {
            const newAssets = await AIPlanner.generatePlan(currentProject, type, remaining);
            
            if (newAssets && newAssets.length > 0) {
                // APLICAR INTELIGÃƒÅ NCIA DE PRAZO E RESPONSÃƒï¿½VEL
                const processedAssets = newAssets.map(asset => {
                    const titleUpper = asset.title.toUpperCase();
                    const type = Object.keys(RESPONSIBLE_MAP).find(k => titleUpper.includes(k)) || 'CARD';
                    
                    const scheduledDate = new Date(asset.scheduled_at);
                    const now = new Date();
                    
                    // LÃƒÂ³gica Pub-2 para Planejamento/ProduÃƒÂ§ÃƒÂ£o Inicial
                    let deadline = new Date(scheduledDate.getTime() - 48 * 60 * 60 * 1000);
                    if (deadline < now) deadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                    
                    // LÃƒÂ³gica de Prioridade: Apenas itens crÃƒÂ­ticos de TraÃƒÂ§ÃƒÂ£o e Marca sÃƒÂ£o ALTA por padrÃƒÂ£o
                    const priority = (titleUpper.includes('TRAFEGO') || titleUpper.includes('ADS') || titleUpper.includes('BRANDING')) ? 'ALTA' : 'MÃƒâ€°DIA';

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
                sLog(`${processedAssets.length} Ativos de LogÃƒÂ­stica Gerados.`);
                loadContent();
            }
        }
    } catch (err) {
        alert('Erro ao gerar plano: ' + err.message);
    }
};

window.forceReady = async (id) => {
    if (!confirm('Deseja pular as etapas de aprovaÃƒÂ§ÃƒÂ£o e marcar este ativo como PRONTO para publicaÃƒÂ§ÃƒÂ£o?')) return;
    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('content_assets').update({ status: 'PRONTO' }).eq('id', id);
        if (error) throw error;
        sLog('Ativo forÃƒÂ§ado para o status PRONTO.');
        loadContent();
    } catch (e) {
        alert('Erro ao forÃƒÂ§ar conclusÃƒÂ£o: ' + e.message);
    }
};



window.deleteAsset = async (id) => {
    if (!confirm('Deseja excluir este ativo da esteira?')) return;
    const supabase = getSupabase();
    await supabase.from('content_assets').delete().eq('id', id);
    loadContent();
};

initEngine();
async function setupRealtime() { const supabase = getSupabase(); if (realtimeChannel) { supabase.removeChannel(realtimeChannel); } realtimeChannel = supabase.channel('content-updates').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content_assets' }, (payload) => { sLog('SincronizaÃ§Ã£o Realtime: AlteraÃ§Ã£o detectada.'); loadContent(); }).subscribe(); }
