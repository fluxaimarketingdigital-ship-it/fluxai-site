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

// MATRIZ DE OPERAÃ‡Ã•ES ESTRATÃ‰GICAS FLUXAI v7.0 (FLUXO MESTRE)
const STRATEGIC_MATRIX = {
    'REELS': { 
        name: 'DireÃ§Ã£o Operacional Audiovisual', 
        clientPrefix: 'REELS', 
        platform: 'REELS',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ${obj}
ðŸŽ¬ FORMATO: Reels (Vertical 9:16)
â�±ï¸� TEMPO ESTIMADO: 45-60 segundos

ðŸª� HOOK: "A maioria das empresas nÃ£o falha por falta de produto, mas por excesso de ruÃ­do operacional."
â�¸ï¸� PAUSA ESTRATÃ‰GICA: [SilÃªncio de 1.5s para Ãªnfase visual]
ðŸ“� DESENVOLVIMENTO: Discorrer sobre a diferenÃ§a entre 'movimento' e 'progresso real'. Utilizar tom de voz Soberano e TÃ©cnico.
ðŸ‘�ï¸� DIREÃ‡ÃƒO DE CENA: Enquadramento em plano mÃ©dio. Fundo neutro/escritÃ³rio. IluminaÃ§Ã£o de alto contraste.
âœ¨ CTA: "Comente ESTRUTURA para acessar o diagnÃ³stico de eficiÃªncia da FluxAI."
ðŸ“� LEGENDA: Narrativa focada em autoridade executiva e diferenciaÃ§Ã£o de mercado.
        `
    },
    'CARROSSEL': { 
        name: 'Estrutura Narrativa de Carrossel', 
        clientPrefix: 'CARROSSEL', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ${obj}
ðŸŽ¬ FORMATO: Carrossel EstratÃ©gico (10 slides)

ðŸ–¼ï¸� ESTRUTURA NARRATIVA:
- Slide 01: [Gancho de AtenÃ§Ã£o] "O custo invisÃ­vel da desorganizaÃ§Ã£o estratÃ©gica."
- Slide 02: [TensÃ£o] Por que processos manuais estÃ£o drenando sua margem de lucro.
- Slide 03: [Conceito] A lÃ³gica da Engenharia de Processos aplicada ao marketing.
- Slide 04: [DiferenciaÃ§Ã£o] FluxAI OS vs. GestÃ£o Tradicional.
- Slide 05: [Metodologia] Os 4 pilares da escala sustentÃ¡vel.
- Slide 06: [VisualizaÃ§Ã£o] GrÃ¡fico de eficiÃªncia operacional.
- Slide 10: [CTA] Direcionamento para a Central de InteligÃªncia.
        `
    },
    'CARD': { 
        name: 'DireÃ§Ã£o EstratÃ©gica Visual', 
        clientPrefix: 'POST', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ${obj}
ðŸ’¡ CONCEITO: AfirmaÃ§Ã£o de Autoridade Absoluta.
ðŸŽ¨ DESIGN: Tipografia imponente, alto espaÃ§o negativo (silÃªncio visual).
ðŸ“� HEADLINE: "Escala nÃ£o Ã© sobre intensidade, Ã© sobre arquitetura."
âœ¨ CTA: "Toque no link da Bio para entender a Engenharia por trÃ¡s da FluxAI."
        `
    },
    'SITE': { 
        name: 'Arquitetura EstratÃ©gica Digital', 
        clientPrefix: 'SITE', 
        platform: 'WEB',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: ConversÃ£o de Alta Autoridade (High-Ticket)
ðŸŒ� ESTRUTURA UX: Foco em Jornada de DecisÃ£o Executiva

ðŸ�—ï¸� SEÃ‡Ã•ES:
1. HERO: Proposta de valor inquestionÃ¡vel + Visual Cinematic.
2. DIAGNÃ“STICO: ExposiÃ§Ã£o das dores do ICP e soluÃ§Ã£o tÃ©cnica.
3. ECOSSISTEMA: Detalhamento dos mÃ³dulos operacionais.
4. PROVA DE VALOR: Resultados tangÃ­veis e depoimentos selecionados.
ðŸš€ SEO: OtimizaÃ§Ã£o para palavras-chave de intenÃ§Ã£o comercial institucional.
        `
    },
    'BRANDING': { 
        name: 'Arquitetura de Posicionamento', 
        clientPrefix: 'BRANDING', 
        platform: 'BRAND',
        generate: (p, obj) => `
ðŸ’Ž PERCEPÃ‡ÃƒO: Posicionamento de Elite e Exclusividade TÃ©cnica.
ðŸ“� NARRATIVA: Construir a imagem de ${p.company_name} como autoridade mÃ¡xima no setor.
ðŸŽ¨ VISUAL: Paleta sÃ³bria, contrastes elegantes e iconografia proprietÃ¡ria.
        `
    },
    'TRAFEGO': { 
        name: 'EstratÃ©gia de AquisiÃ§Ã£o', 
        clientPrefix: 'AQUISIÃ‡ÃƒO', 
        platform: 'ADS',
        generate: (p, obj) => `
ðŸŽ¯ OBJETIVO: AtraÃ§Ã£o de Leads Qualificados (ICP High-Ticket)
ðŸ“¡ CANAIS: Meta Ads + LinkedIn Ads
ðŸ“� CRIATIVOS: Foco em dor latente e prova de autoridade.
ðŸ’° ESTRATÃ‰GIA: Funil de conscientizaÃ§Ã£o progressiva com foco em LTV.
        `
    },
    'CRM': { 
        name: 'Estrutura de Relacionamento', 
        clientPrefix: 'CRM', 
        platform: 'CRM',
        generate: (p, obj) => `
ðŸ“Š GESTÃƒO: InteligÃªncia de Dados aplicada ao Funil de Vendas.
ðŸ”„ AUTOMAÃ‡ÃƒO: RÃ©guas de relacionamento baseadas no comportamento do lead.
ðŸ“ˆ MÃ‰TRICA: Foco em Health Score e Taxa de RetenÃ§Ã£o.
        `
    },
    'AUTOMACAO': { 
        name: 'Arquitetura Operacional', 
        clientPrefix: 'AUTOMAÃ‡ÃƒO', 
        platform: 'SYSTEM',
        generate: (p, obj) => `
âš™ï¸� FLUXO: AutomaÃ§Ã£o de processos repetitivos para ganho de eficiÃªncia.
ðŸ”— INTEGRAÃ‡ÃƒO: SincronizaÃ§Ã£o em tempo real entre vendas e operaÃ§Ã£o.
ðŸ›¡ï¸� GOVERNANÃ‡A: SeguranÃ§a de dados e rastreabilidade total das aÃ§Ãµes.
        `
    },
    'CONSULTORIA': { 
        name: 'DiagnÃ³stico EstratÃ©gico', 
        clientPrefix: 'DIAGNÃ“STICO', 
        platform: 'CONSULTING',
        generate: (p, obj) => `
ðŸ“‹ ESCOPO: AnÃ¡lise 360Âº da infraestrutura digital e operacional.
ðŸ“‘ ENTREGA: RelatÃ³rio tÃ©cnico com pontos de atrito e oportunidades de escala.
ðŸš€ IMPACTO: DefiniÃ§Ã£o do roadmap estratÃ©gico para os prÃ³ximos 12 meses.
        `
    }
};

const RESPONSIBLE_MAP = {
    'AUDIOVISUAL': 'Audiovisual',
    'REELS': 'Audiovisual',
    'NARRATIVA': 'Estrategista',
    'DIREÃ‡ÃƒO': 'Estrategista',
    'ARQUITETURA': 'Design',
    'CARROSSEL': 'Design',
    'CARD': 'Design',
    'SITE': 'Desenvolvimento Web',
    'TRAFEGO': 'Gestor de TrÃ¡fego',
    'ADS': 'Gestor de TrÃ¡fego',
    'BRANDING': 'Estrategista',
    'CRM': 'Estrategista',
    'AUTOMAÃ‡ÃƒO': 'Sistemas',
    'DIAGNÃ“STICO': 'Estrategista'
};

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
        setupRealtime();
        sLog('Carga Inicial: OK');
        setupRealtime();

        // BOTÃƒO GLOBAL WA (TOP BAR)
        const btnGlobalWa = document.getElementById('btn-global-wa');
        if (btnGlobalWa) {
            btnGlobalWa.onclick = () => {
                const projectFilter = document.getElementById('project-filter');
                const selectedId = projectFilter.value;
                if (!selectedId) return alert('Selecione um cliente especÃ­fico para enviar o lembrete direto.');
                
                const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${selectedId}`;
                const msg = `OlÃ¡! ðŸš€%0A%0APassando para lembrar que temos conteÃºdos aguardando sua aprovaÃ§Ã£o no portal da FluxAI.%0A%0AConfira aqui seu calendÃ¡rio atualizado:%0A${portalLink}`;
                window.open(`https://wa.me/?text=${msg}`, '_blank');
            };
        }

        // Listeners
        if (filter) {
            filter.onchange = (e) => {
                currentProject = e.target.value;
                localStorage.setItem('fluxai_current_project_id', currentProject);
                
                // Mostrar/Esconder botão de cópia
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

        // Armazenar projetos globalmente para consulta rÃ¡pida
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
        sLog('Falha CrÃ­tica na Carga de Clientes: ' + e.message);
        console.error(e);
    }
}

async function loadContent() {
    const dashboard = document.querySelector('main');
    const projectFilter = document.getElementById('project-filter');
    
    // DEFESA DE INTERFACE: Garantir que elementos bÃ¡sicos existam
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
            // Tenta buscar o dia em diferentes possÃ­veis colunas do banco
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

        // RESTAURAR BOTÃ•ES DE AÃ‡ÃƒO
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
        
        // Renderizar CalendÃ¡rios
        renderCalendar('calendar-strategic-body', safeContents, 'STRATEGIC');
        renderCalendar('calendar-operational-body', safeContents, 'OPERATIONAL');
        
        // NOVO: Verificar Alerta de Ciclo
        checkLogisticsCycle();
        checkPublishingAlerts(contents);
        
    } catch (e) {
        sLog('Erro ConteÃºdo: ' + e.message);
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
        sLog(`ðŸ“¢ ALERTA: VocÃª tem ${todayPosts.length} conteÃºdos para publicar HOJE!`);
        // Opcional: Mostrar uma notificaÃ§Ã£o visual mais agressiva ou banner
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
        approval: contents.filter(c => c.status.includes('APROVAÃ‡ÃƒO')).length,
        atrasado: contents.filter(c => {
            if (c.status === 'PUBLICADO' || c.status === 'PRONTO') return false;
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            const scheduled = new Date(c.scheduled_at);
            // Atraso se passou do prazo de aprovaÃ§Ã£o OU se estÃ¡ em produÃ§Ã£o e passou da data de postagem
            return (deadline && deadline < now) || (c.status === 'PRODUÃ‡ÃƒO' && scheduled < now);
        }).length,
        ready: contents.filter(c => c.status === 'PRONTO').length
    };

    OS_UI.renderMetric('metric-assets', { label: 'LogÃ­stica Total', value: metrics.total, trend: 'v1.0', meta: 'Escopo' });
    OS_UI.renderMetric('metric-approval', { label: 'Aguardando Cliente', value: metrics.approval, trend: '!', meta: 'AtenÃ§Ã£o' });
    OS_UI.renderMetric('metric-production', { label: 'Atraso Operacional', value: metrics.atrasado, trend: 'down', meta: 'CrÃ­tico' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos para Postar', value: metrics.ready, trend: 'âœ”', meta: 'PublicaÃ§Ã£o' });

    // Atualizar status para ATRASADO via cÃ³digo se necessÃ¡rio (LÃ³gica em tempo real)
    contents.forEach(async c => {
        if (c.status !== 'ATRASADO' && c.status !== 'PUBLICADO' && c.status !== 'PRONTO') {
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            if (deadline && deadline < now) {
                // Sincronizar com DB (Opcional - pode ser apenas visual no dashboard)
                console.warn(`[LOGÃ�STICA] Ativo ${c.title} estÃ¡ ATRASADO por prazo de aprovaÃ§Ã£o.`);
            }
        }
    });
}

function renderContentTable(contents) {
    const body = document.getElementById('pipeline-table-body');
    if (!contents || contents.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px;">Nenhum conteÃºdo.</td></tr>`;
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
                        ${isHighRisk ? '<i class="fa-solid fa-triangle-exclamation" title="Risco Operacional: Ciclo de ajustes alto ou atraso crÃ­tico" style="color:var(--os-danger); font-size:0.7rem; animation: pulse 2s infinite;"></i>' : ''}
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
                            <button class="btn-mini" title="Ponte de PublicaÃ§Ã£o" onclick="window.openPublishBridge('${c.id}')" style="background: var(--os-primary); color: #000; border: none;">
                                <i class="fa-solid fa-rocket"></i>
                            </button>
                        ` : `
                            ${c.status !== 'PLANEJAMENTO' ? `
                                <button class="btn-mini" title="ForÃ§ar ConclusÃ£o (Pular AprovaÃ§Ã£o)" onclick="window.forceReady('${c.id}')" style="background: rgba(16, 185, 129, 0.1); border-color: var(--os-success); color: var(--os-success);">
                                    <i class="fa-solid fa-circle-check"></i>
                                </button>
                            ` : ''}
                        `}
                        ${c.metadata?.reference_url ? `
                            <a href="${c.metadata.reference_url}" target="_blank" class="btn-mini" title="Ver ReferÃªncia" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-color: #3b82f6;">
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
    
    // Atualizar Label do MÃªs
    const monthNames = ["Janeiro", "Fevereiro", "MarÃ§o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
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
            if (!isStrategic && !['PRODUÃ‡ÃƒO', 'REVISÃƒO INTERNA FINAL', 'APROVAÃ‡ÃƒO FINAL', 'PRONTO', 'PUBLICADO'].includes(c.status)) return '';

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
    if (status === 'REVISÃƒO GESTÃƒO') return '#8b5cf6'; // Roxo
    if (status === 'APROVAÃ‡ÃƒO PLANEJAMENTO') return '#3b82f6'; // Azul
    if (status === 'APROVAÃ‡ÃƒO ESTRATÃ‰GICA') return '#3b82f6'; // Azul
    if (status === 'AJUSTE') return '#ef4444'; // Vermelho
    if (status === 'PRODUÃ‡ÃƒO') return '#f59e0b'; // Amarelo/Laranja
    if (status === 'AJUSTE DE PRODUÃ‡ÃƒO') return '#ec4899'; // Rosa (Refinamento tÃ©cnico)
    if (status === 'REVISÃƒO INTERNA FINAL') return '#ec4899';
    if (status === 'APROVAÃ‡ÃƒO FINAL') return '#3b82f6'; // Azul
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
        const isPlanning = c.status === 'PLANEJAMENTO' || c.status === 'APROVAÃ‡ÃƒO ESTRATÃ‰GICA' || c.status === 'REVISÃƒO GESTÃƒO';
        const isDirector = localStorage.getItem('os_role') === 'DIRETOR';
        
        // Mapear campos do HTML (Somente os que sÃ£o fixos)
        document.getElementById('edit-asset-title').value = c.title;
        document.getElementById('edit-asset-ref').value = c.metadata?.reference_url || '';
        document.getElementById('edit-asset-art-final').value = c.metadata?.final_asset_url || '';
        
        // Injetar campos de metadados no container especÃ­fico
        const metaGrid = document.getElementById('edit-asset-meta-fields');
        if (metaGrid) {
        // Renderizar Roteiro e HistÃ³rico
        const history = c.metadata?.history || [];
        const historyHtml = history.length > 0 ? history.map(h => `
            <div style="padding:10px; border-bottom:1px solid #222; font-size:0.7rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <b style="color:${h.type === 'CLIENT' ? '#60a5fa' : '#8b5cf6'}">${h.type === 'CLIENT' ? 'ðŸ“Œ AJUSTE CLIENTE' : 'ðŸ›¡ï¸� AJUSTE ESTRATÃ‰GICO'}</b>
                    <span style="opacity:0.5;">${new Date(h.date).toLocaleString('pt-BR')}</span>
                </div>
                <div style="color:#eee; line-height:1.4;">${h.note}</div>
                <div style="font-size:0.6rem; opacity:0.4; margin-top:3px;">Por: ${h.author}</div>
            </div>
        `).join('') : '<div style="padding:40px; text-align:center; opacity:0.3; font-size:0.7rem;">Sem histÃ³rico de ajustes atÃ© o momento.</div>';

        document.getElementById('edit-asset-roadmap-container').innerHTML = `
            <div class="edit-modal-grid">
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">ROTEIRO ESTRATÃ‰GICO (PAUTA)</label>
                    <textarea id="edit-asset-caption" style="width:100%; height:320px; background:#0a0a0a; border:1px solid #222; color:#fff; padding:15px; border-radius:8px; font-family:inherit; font-size:0.9rem; line-height:1.6; outline:none; transition: border 0.3s;"></textarea>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">HISTÃ“RICO DE AJUSTES</label>
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
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">RESPONSÃ�VEL</label>
                    <select id="edit-asset-responsible" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="Design">Design</option>
                        <option value="Audiovisual">Audiovisual</option>
                        <option value="Estrategista">Estrategista</option>
                        <option value="Gestor de TrÃ¡fego">Gestor de TrÃ¡fego</option>
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
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">PRAZO DE APROVAÃ‡ÃƒO</label>
                    <input type="datetime-local" id="edit-asset-deadline" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                </div>
                
                <div style="grid-column: span 3; display:flex; gap:30px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); margin-top:5px;">
                     <div style="display:flex; align-items:center; gap:10px; opacity: ${isLocked ? '0.5' : '1'};">
                        <input type="checkbox" id="edit-asset-strategic-req" style="width:16px; height:16px; cursor:pointer;" ${c.metadata?.strategic_approval_required ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
                        <label for="edit-asset-strategic-req" style="font-size:0.65rem; color:#3b82f6; font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">EXIGIR APROVAÃ‡ÃƒO ESTRATÃ‰GICA?</label>
                     </div>
                     <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" id="edit-asset-risk" style="width:16px; height:16px; cursor:pointer;" ${c.metadata?.risk ? 'checked' : ''}>
                        <label for="edit-asset-risk" style="font-size:0.65rem; color:var(--os-danger); font-weight:800; cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">RISCO OPERACIONAL</label>
                     </div>
                </div>
            `;
            
            // Setar valores apÃ³s injeÃ§Ã£o
            document.getElementById('edit-asset-responsible').value = c.metadata?.responsible || 'Design';
            document.getElementById('edit-asset-version').value = c.metadata?.version || 'V1';
            
            // GovernanÃ§a de EdiÃ§Ã£o: Campos automÃ¡ticos ficam desabilitados
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



        // Atualizar BotÃµes DinÃ¢micos
        const footerActions = document.getElementById('edit-asset-footer-actions');
        if (footerActions) {
            const hasStrategic = c.metadata?.strategic_approval_required;
            
            footerActions.innerHTML = `
                ${(c.status === 'PRODUÃ‡ÃƒO' || c.status === 'AJUSTE DE PRODUÃ‡ÃƒO') ? `
                    <button class="btn-mini" onclick="window.sendToStrategicOrFinal('${c.id}')" style="padding:10px 20px; background:#8b5cf6; color:#fff; font-weight:800; border:none; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                        <i class="fa-solid fa-paper-plane"></i> ${hasStrategic ? 'Finalizar e Enviar p/ AprovaÃ§Ã£o EstratÃ©gica' : 'Finalizar e Enviar'}
                    </button>
                ` : ''}
                ${c.status === 'APROVAÃ‡ÃƒO ESTRATÃ‰GICA' ? `
                    <button class="btn-mini" onclick="window.strategicInternalAction('${c.id}', 'REJECT')" style="padding:10px 20px; background:var(--os-danger); color:#fff; font-weight:800; border:none;">Solicitar Ajuste (ProduÃ§Ã£o)</button>
                    <button class="btn-mini" onclick="window.strategicInternalAction('${c.id}', 'APPROVE')" style="padding:10px 20px; background:var(--os-success); color:#fff; font-weight:800; border:none;">Aprovar p/ Cliente</button>
                ` : ''}
                <button class="btn-mini" onclick="window.saveAssetEdit()" style="padding:10px 20px; background:var(--os-primary); color:#000; font-weight:800;">Salvar AlteraÃ§Ãµes</button>
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

        // LÃ“GICA DE TRANSIÃ‡ÃƒO DE STATUS INTELIGENTE
        if (currentAsset.status === 'AJUSTE') {
            updatePayload.status = 'PLANEJAMENTO';
        } else if (currentAsset.status === 'AJUSTE DE PRODUÃ‡ÃƒO') {
            updatePayload.status = 'PRODUÃ‡ÃƒO'; 
        }
        const { error } = await supabase.from('content_assets').update(updatePayload).eq('id', editingAssetId);
        if (error) throw error;

        sLog('AlteraÃ§Ãµes salvas com sucesso.');
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
        const nextStatus = hasStrategic ? 'APROVAÃ‡ÃƒO ESTRATÃ‰GICA' : 'APROVAÃ‡ÃƒO FINAL';
        
        if (!confirm(`Confirmar envio para ${hasStrategic ? 'AprovaÃ§Ã£o EstratÃ©gica (Interna)' : 'AprovaÃ§Ã£o Final (Cliente)'}?`)) return;

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
        
        let nextStatus = action === 'APPROVE' ? 'APROVAÃ‡ÃƒO FINAL' : 'PRODUÃ‡ÃƒO';
        let newHistory = c.metadata?.history || [];
        
        if (action === 'REJECT') {
            const note = prompt('Qual ajuste deve ser feito na produÃ§Ã£o?');
            if (!note) return;
            
            newHistory.push({
                date: new Date().toISOString(),
                type: 'STRATEGIC',
                author: user?.name || 'GestÃ£o FluxAI',
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
    if (!modal) return alert('Modal de PublicaÃ§Ã£o nÃ£o encontrado no HTML.');

    // Preencher dados
    const scheduled = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data nÃ£o definida';
    document.getElementById('pub-scheduled-time').innerText = scheduled;
    document.getElementById('pub-caption-preview').value = c.caption || '';
    
    // Configurar botÃµes
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
        else alert('Nenhum arquivo final encontrado para este conteÃºdo.');
    };

    document.getElementById('btn-open-account').onclick = () => {
        // Direcionar para o Creator Studio / Business Suite conforme plataforma
        if (c.platform === 'INSTAGRAM') window.open('https://business.facebook.com/latest/composer', '_blank');
        else if (c.platform === 'WEB') window.open('/os/site-editor', '_blank'); // Exemplo
        else window.open('https://google.com', '_blank');
    };

    document.getElementById('btn-confirm-pub').onclick = async () => {
        if (confirm('Deseja confirmar a publicaÃ§Ã£o deste conteÃºdo agora? O status serÃ¡ alterado para PUBLICADO.')) {
            const { error } = await supabase.from('content_assets').update({ status: 'PUBLICADO' }).eq('id', id);
            if (error) return alert('Erro ao atualizar: ' + error.message);
            
            modal.style.display = 'none';
            sLog('ConteÃºdo marcado como PUBLICADO.');
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
    sLog('Copiado para a Ã¡rea de transferÃªncia.');
};

window.approvePendingAssets = async () => {
    if (!currentProject) return alert('Selecione um projeto!');
    if (!confirm('Deseja enviar todas as pautas de PLANEJAMENTO para a aprovaÃ§Ã£o do cliente?')) return;

    try {
        const supabase = getSupabase();
        
        // 1. Atualizar status no banco
        const { error } = await supabase.from('content_assets')
            .update({ status: 'APROVAÃ‡ÃƒO PLANEJAMENTO' })
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
            .eq('status', 'APROVAÃ‡ÃƒO PLANEJAMENTO')
            .limit(10);

        let waText = `ðŸš€ *NOVO PLANEJAMENTO DISPONÃVEL - ${proj?.name || 'Projeto'}*\n\nOlÃ¡! Acabamos de liberar o novo fluxo estratÃ©gico de conteÃºdo. \n\nAcesse agora para validar roteiros e prazos:\nðŸ”— ${portalUrl}\n\n*Resumo do Lote:*\n`;
        if (assets && assets.length > 0) {
            assets.forEach(a => { waText += `â€¢ ${a.title}\n`; });
        }
        waText += `\n#FluxAI #EstratÃ©giaDigital #HighTicket`;
        
        const waTextEl = document.getElementById('share-whatsapp-text');
        if (waTextEl) waTextEl.value = waText;

        const modal = document.getElementById('modal-share-assets');
        if (modal) modal.style.display = 'flex';

        sLog('Pautas enviadas para AprovaÃ§Ã£o.');
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
    if (!selectedId) return alert('Selecione um projeto para gerar planejamento estrategico!');

    const supabase = getSupabase();
    
    // VERIFICACAO DE COTA DINAMICA (ONBOARDING SMART SCOPE)
    const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', selectedId).single();
    const { count } = await supabase.from('content_assets').select('*', { count: 'exact', head: true }).eq('project_id', selectedId);
    
    let quota = 12; // Fallback padrao
    const smartScope = project.operational_activation?.smart_scope?.conteudo
        || project.metadata?.operational_activation?.smart_scope?.conteudo
        || project.metadata?.onboarding?.module_details;
    
    if (smartScope) {
        const reelsQty = parseInt(smartScope.reels || smartScope.escopo_conteudo_reels_qty) || 0;
        const carrosselQty = parseInt(smartScope.carrossel || smartScope.escopo_conteudo_carrossel_qty) || 0;
        const totalSmart = reelsQty + carrosselQty;
        if (totalSmart > 0) quota = totalSmart;
    } else {
        const quotaMatch = project.content_scope ? project.content_scope.match(/\d+/) : null;
        if (quotaMatch) quota = parseInt(quotaMatch[0]);
    }

    const remaining = quota - count;

    if (remaining <= 0) {
        return alert('Limite de Cota Atingido (' + count + '/' + quota + ').\n\nApague ativos para liberar espaco ou solicite upgrade de contrato.');
    }

    sLog('Iniciando Motor Estrategico (Cota: ' + count + '/' + quota + ' | Disponivel: ' + remaining + ')');
    
    try {
        const { AIPlanner } = await import('../../services/ai-planner.js');
        const type = document.getElementById('ai-planner-service').value;
        
        if (confirm('Gerar ' + (type === 'ALL' ? 'novo planejamento' : 'ativos de ' + type) + ' para preencher os ' + remaining + ' slots disponiveis no contrato?')) {
            const newAssets = await AIPlanner.generatePlan(currentProject, type, remaining);
            
            if (newAssets && newAssets.length > 0) {
                // APLICAR INTELIGENCIA DE PRAZO E RESPONSAVEL
                const processedAssets = newAssets.map(asset => {
                    const titleUpper = asset.title.toUpperCase();
                    const assetType = Object.keys(RESPONSIBLE_MAP).find(k => titleUpper.includes(k)) || 'CARD';
                    
                    const scheduledDate = new Date(asset.scheduled_at);
                    const now = new Date();
                    
                    // Defesa Cronologica: prazo de aprovacao SEMPRE antes do horario de postagem
                    let deadline = new Date(scheduledDate.getTime() - 48 * 60 * 60 * 1000);
                    if (deadline < now) {
                        deadline = new Date(now.getTime() + (scheduledDate.getTime() - now.getTime()) / 2);
                        if (deadline.getTime() >= scheduledDate.getTime() || deadline.getTime() <= now.getTime()) {
                            deadline = new Date(scheduledDate.getTime() - 2 * 60 * 60 * 1000);
                        }
                    }
                    
                    // Logica de Prioridade Estrategica Premium
                    const priority = asset.priority || (
                        (titleUpper.includes('TRAFEGO') || titleUpper.includes('ADS') || titleUpper.includes('BRANDING') ||
                         titleUpper.includes('REELS') || titleUpper.includes('CARROSSEL') || titleUpper.includes('SITE') || titleUpper.includes('LP'))
                        ? 'ALTA' : 'MEDIA'
                    );

                    return {
                        ...asset,
                        priority: priority,
                        metadata: {
                            ...asset.metadata,
                            responsible: RESPONSIBLE_MAP[assetType] || 'Design',
                            approval_deadline: deadline.toISOString(),
                            revision_cycle: 1,
                            version: 'V1'
                        }
                    };
                });

                const { error } = await supabase.from('content_assets').insert(processedAssets);
                if (error) throw error;
                sLog(processedAssets.length + ' Ativos de Logistica Gerados.');
                loadContent();
            }
        }
    } catch (err) {
        alert('Erro ao gerar plano: ' + err.message);
    }
};

window.forceReady = async (id) => {
    if (!confirm('Deseja pular as etapas de aprovaÃ§Ã£o e marcar este ativo como PRONTO para publicaÃ§Ã£o?')) return;
    try {
        const supabase = getSupabase();
        const { error } = await supabase.from('content_assets').update({ status: 'PRONTO' }).eq('id', id);
        if (error) throw error;
        sLog('Ativo forÃ§ado para o status PRONTO.');
        loadContent();
    } catch (e) {
        alert('Erro ao forÃ§ar conclusÃ£o: ' + e.message);
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
