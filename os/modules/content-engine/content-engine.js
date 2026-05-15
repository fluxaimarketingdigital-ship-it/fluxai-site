import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

let currentProject = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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
🎯 OBJETIVO: ${obj}
🎬 FORMATO: Reels (Vertical 9:16)
⏱️ TEMPO ESTIMADO: 45-60 segundos

🪝 HOOK: "A maioria das empresas não falha por falta de produto, mas por excesso de ruído operacional."
⏸️ PAUSA ESTRATÉGICA: [Silêncio de 1.5s para ênfase visual]
📝 DESENVOLVIMENTO: Discorrer sobre a diferença entre 'movimento' e 'progresso real'. Utilizar tom de voz Soberano e Técnico.
👁️ DIREÇÃO DE CENA: Enquadramento em plano médio. Fundo neutro/escritório. Iluminação de alto contraste.
✨ CTA: "Comente ESTRUTURA para acessar o diagnóstico de eficiência da FluxAI."
📝 LEGENDA: Narrativa focada em autoridade executiva e diferenciação de mercado.
        `
    },
    'CARROSSEL': { 
        name: 'Estrutura Narrativa de Carrossel', 
        clientPrefix: 'CARROSSEL', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
🎯 OBJETIVO: ${obj}
🎬 FORMATO: Carrossel Estratégico (10 slides)

🖼️ ESTRUTURA NARRATIVA:
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
🎯 OBJETIVO: ${obj}
💡 CONCEITO: Afirmação de Autoridade Absoluta.
🎨 DESIGN: Tipografia imponente, alto espaço negativo (silêncio visual).
📝 HEADLINE: "Escala não é sobre intensidade, é sobre arquitetura."
✨ CTA: "Toque no link da Bio para entender a Engenharia por trás da FluxAI."
        `
    },
    'SITE': { 
        name: 'Arquitetura Estratégica Digital', 
        clientPrefix: 'SITE', 
        platform: 'WEB',
        generate: (p, obj) => `
🎯 OBJETIVO: Conversão de Alta Autoridade (High-Ticket)
🌐 ESTRUTURA UX: Foco em Jornada de Decisão Executiva

🏗️ SEÇÕES:
1. HERO: Proposta de valor inquestionável + Visual Cinematic.
2. DIAGNÓSTICO: Exposição das dores do ICP e solução técnica.
3. ECOSSISTEMA: Detalhamento dos módulos operacionais.
4. PROVA DE VALOR: Resultados tangíveis e depoimentos selecionados.
🚀 SEO: Otimização para palavras-chave de intenção comercial institucional.
        `
    },
    'BRANDING': { 
        name: 'Arquitetura de Posicionamento', 
        clientPrefix: 'BRANDING', 
        platform: 'BRAND',
        generate: (p, obj) => `
💎 PERCEPÇÃO: Posicionamento de Elite e Exclusividade Técnica.
📝 NARRATIVA: Construir a imagem de ${p.company_name} como autoridade máxima no setor.
🎨 VISUAL: Paleta sóbria, contrastes elegantes e iconografia proprietária.
        `
    },
    'TRAFEGO': { 
        name: 'Estratégia de Aquisição', 
        clientPrefix: 'AQUISIÇÃO', 
        platform: 'ADS',
        generate: (p, obj) => `
🎯 OBJETIVO: Atração de Leads Qualificados (ICP High-Ticket)
📡 CANAIS: Meta Ads + LinkedIn Ads
📝 CRIATIVOS: Foco em dor latente e prova de autoridade.
💰 ESTRATÉGIA: Funil de conscientização progressiva com foco em LTV.
        `
    },
    'CRM': { 
        name: 'Estrutura de Relacionamento', 
        clientPrefix: 'CRM', 
        platform: 'CRM',
        generate: (p, obj) => `
📊 GESTÃO: Inteligência de Dados aplicada ao Funil de Vendas.
🔄 AUTOMAÇÃO: Réguas de relacionamento baseadas no comportamento do lead.
📈 MÉTRICA: Foco em Health Score e Taxa de Retenção.
        `
    },
    'AUTOMACAO': { 
        name: 'Arquitetura Operacional', 
        clientPrefix: 'AUTOMAÇÃO', 
        platform: 'SYSTEM',
        generate: (p, obj) => `
⚙️ FLUXO: Automação de processos repetitivos para ganho de eficiência.
🔗 INTEGRAÇÃO: Sincronização em tempo real entre vendas e operação.
🛡️ GOVERNANÇA: Segurança de dados e rastreabilidade total das ações.
        `
    },
    'CONSULTORIA': { 
        name: 'Diagnóstico Estratégico', 
        clientPrefix: 'DIAGNÓSTICO', 
        platform: 'CONSULTING',
        generate: (p, obj) => `
📋 ESCOPO: Análise 360º da infraestrutura digital e operacional.
📑 ENTREGA: Relatório técnico com pontos de atrito e oportunidades de escala.
🚀 IMPACTO: Definição do roadmap estratégico para os próximos 12 meses.
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
        
        await loadProjects();
        await loadContent();
        sLog('Carga Inicial: OK');

        // BOTÃO GLOBAL WA (TOP BAR)
        const btnGlobalWa = document.getElementById('btn-global-wa');
        if (btnGlobalWa) {
            btnGlobalWa.onclick = () => {
                const projectFilter = document.getElementById('project-filter');
                const selectedId = projectFilter.value;
                if (!selectedId) return alert('Selecione um cliente específico para enviar o lembrete direto.');
                
                const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${selectedId}`;
                const msg = `Olá! 🚀%0A%0APassando para lembrar que temos conteúdos aguardando sua aprovação no portal da FluxAI.%0A%0AConfira aqui seu calendário atualizado:%0A${portalLink}`;
                window.open(`https://wa.me/?text=${msg}`, '_blank');
            };
        }

        // Listeners
        const filter = document.getElementById('project-filter');
        if (filter) {
            filter.onchange = (e) => {
                currentProject = e.target.value;
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
        sLog('Falha Crítica na Carga de Clientes: ' + e.message);
        console.error(e);
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
        
    } catch (e) {
        sLog('Erro Conteúdo: ' + e.message);
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
    } catch (e) { console.error('[LOGÍSTICA] Erro ao verificar ciclo:', e); }
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
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos para Postar', value: metrics.ready, trend: '✔', meta: 'Publicação' });

    // Atualizar status para ATRASADO via código se necessário (Lógica em tempo real)
    contents.forEach(async c => {
        if (c.status !== 'ATRASADO' && c.status !== 'PUBLICADO' && c.status !== 'PRONTO') {
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            if (deadline && deadline < now) {
                // Sincronizar com DB (Opcional - pode ser apenas visual no dashboard)
                console.warn(`[LOGÍSTICA] Ativo ${c.title} está ATRASADO por prazo de aprovação.`);
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
                        ${c.status === 'PLANEJAMENTO' ? `
                            <button class="btn-mini" title="Validar Estratégia (Enviar p/ Cliente)" onclick="window.approveManager('${c.id}')" style="background: #8b5cf6; color: #fff; border: none;">
                                <i class="fa-solid fa-shield-check"></i>
                            </button>
                        ` : ''}
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
            if (isStrategic && !['PLANEJAMENTO', 'APROVAÇÃO ESTRATÉGICA', 'AJUSTE', 'PRODUÇÃO'].includes(c.status)) return '';
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
    if (status === 'PLANEJAMENTO') return '#6366f1'; 
    if (status === 'REVISÃO GESTÃO') return '#8b5cf6'; // Roxo (Aprovação da Gestão)
    if (status === 'APROVAÇÃO ESTRATÉGICA') return '#f59e0b'; 
    if (status === 'AJUSTE') return '#ef4444'; 
    if (status === 'PRODUÇÃO') return '#f59e0b'; 
    if (status === 'AJUSTE DE PRODUÇÃO') return '#ec4899'; // Rosa (Ajuste técnico de arte)
    if (status === 'REVISÃO INTERNA FINAL') return '#ec4899';
    if (status === 'APROVAÇÃO FINAL') return '#8b5cf6'; 
    if (status === 'PRONTO') return '#10b981'; 
    if (status === 'PUBLICADO') return '#059669'; 
    if (status === 'ATRASADO') return '#7f1d1d'; 
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
        document.getElementById('edit-asset-title').value = c.title;
        document.getElementById('edit-asset-caption').value = c.caption;
        document.getElementById('edit-asset-ref').value = c.metadata?.reference_url || '';
        
        // NOVO CAMPO: ARTE FINAL
        let artField = document.getElementById('edit-asset-art-final');
        if (!artField) {
            const container = document.getElementById('edit-asset-ref').parentElement;
            const newField = document.createElement('div');
            newField.style = "margin-top: 15px;";
            newField.innerHTML = `
                <label style="display:block; font-size:0.7rem; color:var(--os-primary); margin-bottom:5px; font-weight:800;">LINK DA ARTE FINAL (PARA VALIDAÇÃO)</label>
                <input type="url" id="edit-asset-art-final" placeholder="Link do Canva / Drive / Vídeo..." style="width:100%; padding:10px; background:#000; border:1px solid var(--os-primary); color:#fff; border-radius:4px; font-size:0.8rem;">
            `;
            container.after(newField);
            artField = document.getElementById('edit-asset-art-final');
        }
        artField.value = c.metadata?.final_asset_url || '';
        
        document.getElementById('edit-asset-art-final').value = c.metadata?.final_asset_url || '';
        
        // NOVOS CAMPOS: RESPONSÁVEL, PRAZO, VERSÃO, RISCO
        let metaFields = document.getElementById('edit-asset-meta-group');
        if (!metaFields) {
            metaFields = document.createElement('div');
            metaFields.id = 'edit-asset-meta-group';
            metaFields.style = "display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 4px; border: 1px solid #222;";
            metaFields.innerHTML = `
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:5px;">RESPONSÁVEL</label>
                    <select id="edit-asset-responsible" style="width:100%; padding:8px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem;">
                        <option value="Design">Design</option>
                        <option value="Audiovisual">Audiovisual</option>
                        <option value="Estrategista">Estrategista</option>
                        <option value="Gestor de Tráfego">Gestor de Tráfego</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                        <option value="Sistemas">Sistemas</option>
                        <option value="Copywriter">Copywriter</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:5px;">CICLO DE AJUSTE</label>
                    <select id="edit-asset-version" style="width:100%; padding:8px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem;">
                        <option value="V1">V1 - Inicial</option>
                        <option value="V2">V2 - Ajuste 1</option>
                        <option value="V3">V3 - Ajuste 2 (CRÍTICO)</option>
                        <option value="FINAL">FINAL - Pronto para Postar</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:5px;">PRAZO DE APROVAÇÃO</label>
                    <input type="datetime-local" id="edit-asset-deadline" style="width:100%; padding:8px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem;">
                </div>
                <div style="display:flex; align-items:center; gap:10px; margin-top:20px;">
                    <input type="checkbox" id="edit-asset-risk">
                    <label style="font-size:0.7rem; color:var(--os-danger); font-weight:800;">RISCO OPERACIONAL</label>
                </div>
            `;
            document.getElementById('edit-asset-art-final').parentElement.after(metaFields);
        }
        
        document.getElementById('edit-asset-responsible').value = c.metadata?.responsible || (c.status === 'PRODUÇÃO' ? 'Design' : 'Social Media');
        document.getElementById('edit-asset-version').value = c.metadata?.version || 'V1';
        
        // Atualizar Ações do Rodapé
        const footerActions = document.getElementById('edit-asset-footer-actions');
        if (footerActions) {
            footerActions.innerHTML = `
                ${c.status === 'PRODUÇÃO' ? `
                    <button class="btn-mini" onclick="window.finalizeProduction('${c.id}')" style="padding:10px 20px; background:#8b5cf6; color:#fff; font-weight:800; border:none; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                        <i class="fa-solid fa-paper-plane"></i> Finalizar e Enviar
                    </button>
                ` : ''}
                <button class="btn-mini" onclick="window.saveAssetEdit()" style="padding:10px 20px; background:var(--os-primary); color:#000; font-weight:800;">Salvar Alterações</button>
            `;
        }
        // Formatar data para o input datetime-local (exige YYYY-MM-DDTHH:MM)
        let formattedDeadline = '';
        if (c.metadata?.approval_deadline) {
            try {
                const d = new Date(c.metadata.approval_deadline);
                formattedDeadline = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            } catch (e) { console.error('Erro formatar data:', e); }
        }
        document.getElementById('edit-asset-deadline').value = formattedDeadline;
        document.getElementById('edit-asset-risk').checked = c.metadata?.risk || false;
        
        // TRAVA DE GOVERNANÇA: Bloquear campos técnicos durante o Planejamento
        const isPlanning = c.status === 'PLANEJAMENTO' || c.status === 'APROVAÇÃO ESTRATÉGICA';
        
        // Bloquear PRAZO para todos, exceto se for "DIRETOR" (Simulado por flag no localStorage por enquanto)
        const isDirector = localStorage.getItem('os_role') === 'DIRETOR';
        
        const fieldsToLock = ['edit-asset-responsible', 'edit-asset-version', 'edit-asset-deadline'];
        
        fieldsToLock.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // Responsável e Versão bloqueados no planejamento
                // Prazo SEMPRE bloqueado para operadores
                const shouldLock = (isPlanning && id !== 'edit-asset-deadline') || (id === 'edit-asset-deadline' && !isDirector);
                
                el.disabled = shouldLock;
                el.style.opacity = shouldLock ? '0.5' : '1';
                el.style.cursor = shouldLock ? 'not-allowed' : 'default';
            }
        });

        // MOSTRAR FEEDBACK SE HOUVER AJUSTE
        const feedbackContainer = document.getElementById('edit-asset-feedback-container');
        if (c.status === 'AJUSTE' && c.internal_notes) {
            document.getElementById('edit-asset-feedback').innerText = c.internal_notes;
            feedbackContainer.style.display = 'block';
        } else {
            feedbackContainer.style.display = 'none';
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
        const responsible = document.getElementById('edit-asset-responsible')?.value;
        const version = document.getElementById('edit-asset-version')?.value;
        const deadline = document.getElementById('edit-asset-deadline')?.value;
        const risk = document.getElementById('edit-asset-risk')?.checked;

        const supabase = getSupabase();
        const { data: currentAsset } = await supabase.from('content_assets').select('status, metadata').eq('id', editingAssetId).single();
        
        const newMetadata = currentAsset.metadata || {};
        newMetadata.reference_url = ref;
        newMetadata.final_asset_url = artFinal;
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
            updatePayload.status = 'PRODUÇÃO'; // Volta para a produção, não para o planejamento
        } else if (currentAsset.status === 'PRODUÇÃO' && artFinal) {
            if (confirm('Enviar para REVISÃO INTERNA FINAL antes do cliente?')) {
                updatePayload.status = 'REVISÃO INTERNA FINAL';
            } else if (confirm('Pular revisão e enviar direto para APROVAÇÃO FINAL do cliente?')) {
                updatePayload.status = 'APROVAÇÃO FINAL';
            }
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

window.finalizeProduction = async (id) => {
    const artLink = document.getElementById('edit-asset-art-final').value;
    if (!artLink) return alert('Por favor, insira o link da arte final antes de enviar!');
    
    if (!confirm('Deseja finalizar a produção e enviar para aprovação do cliente agora?')) return;

    try {
        const supabase = getSupabase();
        const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
        
        const scheduledDate = new Date(c.scheduled_at);
        const now = new Date();
        
        // Lógica Pub-1: Prazo de aprovação do cliente é 1 dia antes da postagem
        let deadline = new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000);
        if (deadline < now) deadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);

        const updatePayload = {
            metadata: {
                ...c.metadata,
                final_asset_url: artLink,
                responsible: document.getElementById('edit-asset-responsible').value,
                version: 'FINAL',
                approval_deadline: deadline.toISOString()
            }
        };

        if (confirm('Enviar para APROVAÇÃO FINAL do cliente?\n\n(Cancele para marcar como PRONTO e pular aprovação)')) {
            updatePayload.status = 'APROVAÇÃO FINAL';
            sLog('Produção finalizada e enviada ao cliente.');
        } else {
            updatePayload.status = 'PRONTO';
            sLog('Produção finalizada e marcada como PRONTO (Aprovação Pulada).');
        }

        const { error } = await supabase.from('content_assets').update(updatePayload).eq('id', id);
        if (error) throw error;

        closeEditModal();
        loadContent();
    } catch (e) {
        sLog('Erro ao finalizar: ' + e.message);
    }
};

window.openPublishBridge = async (id) => {
    const supabase = getSupabase();
    const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
    if (!c) return;

    const modal = document.getElementById('pub-modal-overlay');
    if (!modal) return alert('Modal de Publicação não encontrado no HTML.');

    document.getElementById('pub-caption-preview').value = c.caption;
    
    // Configurar botões
    document.getElementById('btn-copy-caption').onclick = () => {
        navigator.clipboard.writeText(c.caption);
        alert('Legenda copiada para a área de transferência!');
    };

    document.getElementById('btn-open-assets').onclick = () => {
        if (c.metadata?.final_asset_url) window.open(c.metadata.final_asset_url, '_blank');
        else alert('Nenhum arquivo final encontrado.');
    };

    document.getElementById('btn-open-account').onclick = () => {
        window.open('https://business.facebook.com/latest/composer', '_blank');
    };

    // BOTÃO WHATSAPP REMINDER
    const btnWa = document.getElementById('btn-wa-reminder');
    if (btnWa) {
        btnWa.onclick = () => {
            const project = document.getElementById('project-filter').options[document.getElementById('project-filter').selectedIndex]?.text || 'Cliente';
            const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${c.project_id}`;
            const msg = `Olá! 🚀%0A%0APassando para lembrar que temos conteúdos aguardando sua aprovação no portal da FluxAI.%0A%0ASeu prazo expira em breve! Confira aqui o calendário:%0A${portalLink}`;
            window.open(`https://wa.me/?text=${msg}`, '_blank');
        };
    }

    document.getElementById('btn-confirm-pub').onclick = async () => {
        if (confirm('Confirmar que este conteúdo foi publicado com sucesso?')) {
            await supabase.from('content_assets').update({ status: 'PUBLICADO' }).eq('id', id);
            modal.style.display = 'none';
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

window.approvePendingAssets = async () => {
    if (!currentProject) return alert('Selecione um projeto!');
    
    const supabase = getSupabase();
    const { data: pendentes } = await supabase.from('content_assets')
        .select('id')
        .eq('project_id', currentProject)
        .in('status', ['PLANEJAMENTO', 'REVISÃO INTERNA', 'AJUSTE']);

    if (!pendentes || pendentes.length === 0) {
        return alert('Nenhuma pauta pronta para envio estratégico.');
    }

    if (confirm(`Enviar ${pendentes.length} pautas para APROVAÇÃO ESTRATÉGICA do cliente?`)) {
        const { error } = await supabase.from('content_assets')
            .update({ status: 'APROVAÇÃO ESTRATÉGICA' })
            .eq('project_id', currentProject)
            .in('status', ['PLANEJAMENTO', 'REVISÃO INTERNA', 'AJUSTE']);

        if (error) alert('Erro: ' + error.message);
        else {
            sLog('Pautas enviadas para aprovação estratégica.');
            loadContent();
            alert('Sucesso! O cliente já pode revisar as estratégias no portal.');
        }
    }
};

window.runAiPlanner = async () => {
    const user = await OS_AUTH.check();
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') return alert('Acesso negado.');

    const filter = document.getElementById('project-filter');
    const selectedId = filter.value || currentProject;
    if (!selectedId) return alert('Selecione um projeto para gerar planejamento estratégico!');

    const supabase = getSupabase();
    
    // VERIFICAÇÃO DE COTA (CONTRATO)
    const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', selectedId).single();
    const { count } = await supabase.from('content_assets').select('*', { count: 'exact', head: true }).eq('project_id', selectedId);
    
    // Tentar extrair número da cota do 'content_scope' ou default 12
    const quotaMatch = project.content_scope ? project.content_scope.match(/\d+/) : null;
    const quota = quotaMatch ? parseInt(quotaMatch[0]) : 12;

    if (count >= quota) {
        return alert(`Limite de Cota Atingido (${count}/${quota}).\n\nApague ativos antigos ou solicite upgrade de contrato para gerar novos planejamentos.`);
    }

    sLog(`Iniciando Motor Estratégico (Cota: ${count}/${quota})`);
    
    try {
        const { AIPlanner } = await import('../../services/ai-planner.js');
        if (confirm(`Gerar novo planejamento estratégico para o projeto?`)) {
            const type = document.getElementById('ai-planner-service').value;
            const newAssets = await AIPlanner.generatePlan(currentProject, type);
            
            if (newAssets && newAssets.length > 0) {
                // APLICAR INTELIGÊNCIA DE PRAZO (48H) E RESPONSÁVEL
                const processedAssets = newAssets.map(asset => {
                    const titleUpper = asset.title.toUpperCase();
                    const type = Object.keys(RESPONSIBLE_MAP).find(k => titleUpper.includes(k)) || 'CARD';
                    
                    const scheduledDate = new Date(asset.scheduled_at);
                    const now = new Date();
                    
                    // Lógica Pub-2 para Planejamento/Produção Inicial
                    let deadline = new Date(scheduledDate.getTime() - 48 * 60 * 60 * 1000);
                    if (deadline < now) deadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
                    
                    const priority = (titleUpper.includes('TRAFEGO') || titleUpper.includes('ADS') || titleUpper.includes('ESTRATÉGICO')) ? 'ALTA' : 'MÉDIA';

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

window.approveManager = async (id) => {
    const choice = confirm('Enviar esta pauta para APROVAÇÃO do cliente?\n\n(Cancele para enviar DIRETO PARA PRODUÇÃO)');
    try {
        const supabase = getSupabase();
        const nextStatus = choice ? 'APROVAÇÃO ESTRATÉGICA' : 'PRODUÇÃO';
        
        const { error } = await supabase.from('content_assets').update({ status: nextStatus }).eq('id', id);
        if (error) throw error;
        
        sLog(choice ? 'Pauta enviada ao cliente.' : 'Pauta aprovada internamente e enviada para PRODUÇÃO.');
        loadContent();
    } catch (e) {
        alert('Erro ao validar pauta: ' + e.message);
    }
};

window.deleteAsset = async (id) => {
    if (!confirm('Deseja excluir este ativo da esteira?')) return;
    const supabase = getSupabase();
    await supabase.from('content_assets').delete().eq('id', id);
    loadContent();
};

initEngine();
