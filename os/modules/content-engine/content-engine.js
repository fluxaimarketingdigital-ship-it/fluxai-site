import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';
import { contentEngineData } from './content-engine.data.js';
import { StatusEngine } from '../../config/status-system.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { AIPlanner } from '../../services/ai-planner.js';

let currentProject = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let realtimeChannel = null;

// Estados operacionais unificados v2.0
const STATUS_LABELS = {
    'DRAFT_PLANNING': 'Pauta Rascunho',
    'INTERNAL_REVIEW': 'Revisão Gestão',
    'INTERNAL_REVISION': 'Ajuste Gestão',
    'CLIENT_REVIEW_PLANNING': 'Pauta Cliente',
    'CLIENT_REVISION_PLANNING': 'Ajuste Pauta Cliente',
    'PLANNING_APPROVED': 'Pauta Aprovada',
    'PRODUCTION_QUEUE': 'Fila de Produção',
    'IN_PRODUCTION': 'Em Produção',
    'INTERNAL_QA': 'Validação Interna',
    'CLIENT_REVIEW_CONTENT': 'Arte Cliente',
    'CLIENT_REVISION_CONTENT': 'Ajuste Arte Cliente',
    'CONTENT_APPROVED': 'Conteúdo Aprovado',
    'READY_TO_POST': 'Pronto para Postar',
    'POSTED': 'Publicado'
};

function mapToStandardStatus(status) {
    const upper = status.toUpperCase();
    if (upper === 'PLANEJAMENTO') return 'DRAFT_PLANNING';
    if (upper === 'REVISÃO GESTÃO') return 'INTERNAL_REVIEW';
    if (upper === 'APROVAÇÃO PLANEJAMENTO') return 'CLIENT_REVIEW_PLANNING';
    if (upper === 'AJUSTE') return 'CLIENT_REVISION_PLANNING';
    if (upper === 'PRODUÇÃO') return 'IN_PRODUCTION';
    if (upper === 'AJUSTE DE PRODUÇÃO') return 'CLIENT_REVISION_CONTENT';
    if (upper === 'REVISÃO INTERNA FINAL') return 'INTERNAL_QA';
    if (upper === 'APROVAÇÃO FINAL') return 'CLIENT_REVIEW_CONTENT';
    if (upper === 'PRONTO') return 'READY_TO_POST';
    if (upper === 'PUBLICADO') return 'POSTED';
    return upper;
}

window.changeMonth = (delta) => {
    currentMonth += delta;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    loadContent();
};

const sLog = (msg) => { if (window.screenLog) window.screenLog(msg); console.log('[ENGINE]', msg); };

const STRATEGIC_MATRIX = {
    'REELS': { 
        name: 'Direção Operacional Audiovisual', 
        clientPrefix: 'REELS', 
        platform: 'REELS',
        generate: (p, obj) => `
🎯 OBJETIVO: ${obj}
🎬 FORMATO: Reels (Vertical 9:16)
⏱️ TEMPO ESTIMADO: 45-60 segundos

🍿 HOOK: "A maioria das empresas não falha por falta de produto, mas por excesso de ruído operacional."
⏸️ PAUSA ESTRATÉGICA: [Silêncio de 1.5s para ênfase visual]
📝 DESENVOLVIMENTO: Discorrer sobre a diferença entre 'movimento' e 'progresso real'. Utilizar tom de voz Soberano e Técnico.
🎬 DIREÇÃO DE CENA: Enquadramento em plano médio. Fundo neutro/escritório. Iluminação de alto contraste.
✨ CTA: "Comente ESTRUTURA para acessar o diagnóstico de eficiência da FluxAI."
✍️ LEGENDA: Narrativa focada em autoridade executiva e diferenciação de mercado.
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
    'ADS': 'Gestor de Tráfego'
};

export async function initEngine() {
    sLog('Iniciando Motor de Conteúdo v7.0 Governed...');
    try {
        window.switchTab = switchTab;
        
        currentProject = localStorage.getItem('fluxai_current_project_id');
        await loadProjects();
        
        const filter = document.getElementById('project-filter');
        if (filter && currentProject) {
            filter.value = currentProject;
            const btnCopy = document.getElementById('btn-copy-portal');
            if (btnCopy) btnCopy.style.display = 'flex';
        }

        await loadContent();
        setupRealtime();

        const btnGlobalWa = document.getElementById('btn-global-wa');
        if (btnGlobalWa) {
            btnGlobalWa.onclick = () => {
                const selectedId = document.getElementById('project-filter').value;
                if (!selectedId) return alert('Selecione um cliente específico para enviar o lembrete direto.');
                const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${selectedId}`;
                const msg = `Olá! 🚀%0A%0APassando para lembrar que temos conteúdos aguardando sua aprovação no portal da FluxAI.%0A%0AConfira aqui seu calendário atualizado:%0A${portalLink}`;
                window.open(`https://wa.me/?text=${msg}`, '_blank');
            };
        }

        if (filter) {
            filter.onchange = async (e) => {
                currentProject = e.target.value;
                localStorage.setItem('fluxai_current_project_id', currentProject);
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

        const btnConfigOpenai = document.getElementById('btn-config-openai');
        if (btnConfigOpenai) {
            btnConfigOpenai.onclick = () => {
                const currentKey = localStorage.getItem('openai_api_key') || '';
                const newKey = prompt('Insira sua Chave de API da OpenAI (sk-...):', currentKey);
                if (newKey !== null) {
                    if (newKey.trim() === '') {
                        localStorage.removeItem('openai_api_key');
                        alert('Chave OpenAI removida.');
                    } else {
                        localStorage.setItem('openai_api_key', newKey.trim());
                        alert('Chave OpenAI salva com sucesso!');
                    }
                }
            };
        }

    } catch (err) {
        sLog('ERRO NO MOTOR: ' + err.message);
    }
}

function switchTab(tab) {
    const tabs = ['esteira', 'calendario-estrategico', 'calendario-operacional', 'timeline-operacional', 'intelligence'];
    tabs.forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.style.display = t === tab ? 'block' : 'none';
        const btn = document.querySelector(`.os-tab-btn[onclick*="${t}"]`);
        if (btn) btn.classList.toggle('active', t === tab);
    });

    if (tab === 'timeline-operacional') {
        renderTimelineTab();
    } else if (tab === 'intelligence') {
        renderIntelligenceTab();
    }
}

async function loadProjects() {
    try {
        const supabase = getSupabase();
        const { data: projects, error } = await supabase.from('projects').select('*').eq('status', 'ATIVO');
        if (error) throw error;

        window.allProjects = projects || [];
        localStorage.setItem('fluxai_supabase_projects', JSON.stringify(window.allProjects));

        const select = document.getElementById('project-filter');
        if (select) {
            select.innerHTML = '<option value="">Todos os Projetos</option>';
            window.allProjects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name || p.name;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        console.warn('Erro ao carregar projetos reais:', e);
        window.allProjects = [];
        const select = document.getElementById('project-filter');
        if (select) {
            select.innerHTML = '<option value="">Sem projetos cadastrados</option>';
        }
    }
}

async function loadContent() {
    const workflowDeadline = document.getElementById('workflow-deadline');
    const workflowCard = document.getElementById('workflow-card');

    if (!currentProject) {
        if (workflowDeadline) workflowDeadline.innerText = 'SELECIONE UM CLIENTE';
        if (workflowCard) {
            workflowCard.style.background = 'rgba(107,122,69,0.05)';
            workflowCard.style.borderColor = 'rgba(107,122,69,0.2)';
        }
    } else {
        const projectData = window.allProjects?.find(p => p.id === currentProject);
        if (projectData && workflowDeadline && workflowCard) {
            const deadlineDay = projectData.next_cycle_day || 20;
            const now = new Date();
            const currentDay = now.getDate();
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
            
            workflowDeadline.innerText = `DEADLINE: DIA ${deadlineDay} (PARA ${nextMonth})`;
            
            if (currentDay > deadlineDay) {
                workflowCard.style.background = 'rgba(239, 68, 68, 0.2)';
                workflowCard.style.borderColor = '#ef4444';
            } else {
                workflowCard.style.background = 'rgba(107,122,69,0.1)';
                workflowCard.style.borderColor = 'rgba(107,122,69,0.3)';
            }
        }
    }

    try {
        const supabase = getSupabase();
        let query = supabase.from('content_assets').select('*');
        if (currentProject) query = query.eq('project_id', currentProject);

        const { data: contents, error } = await query.order('scheduled_at', { ascending: true });
        if (error) throw error;

        window.loadedContents = contents || [];
        renderMetrics(window.loadedContents);
        renderContentTable(window.loadedContents);
        
        renderCalendar('calendar-strategic-body', window.loadedContents, 'STRATEGIC');
        renderCalendar('calendar-operational-body', window.loadedContents, 'OPERATIONAL');
    } catch (e) {
        const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        let projectAssets = mockAssets;
        if (currentProject) {
            projectAssets = mockAssets.filter(item => item && item.project_id === currentProject);
        }
        
        window.loadedContents = projectAssets;
        renderMetrics(projectAssets);
        renderContentTable(projectAssets);
        
        renderCalendar('calendar-strategic-body', projectAssets, 'STRATEGIC');
        renderCalendar('calendar-operational-body', projectAssets, 'OPERATIONAL');
    }
}

function renderMetrics(contents) {
    const now = new Date();
    const metrics = {
        total: contents.length,
        approval: contents.filter(c => mapToStandardStatus(c.status).includes('REVIEW')).length,
        atrasado: contents.filter(c => {
            const std = mapToStandardStatus(c.status);
            if (std === 'POSTED' || std === 'READY_TO_POST') return false;
            const deadline = c.metadata?.approval_deadline ? new Date(c.metadata.approval_deadline) : null;
            return deadline && deadline < now;
        }).length,
        ready: contents.filter(c => mapToStandardStatus(c.status) === 'READY_TO_POST').length
    };

    OS_UI.renderMetric('metric-assets', { label: 'Logística Total', value: metrics.total, trend: 'v2.0', meta: 'Escopo' });
    OS_UI.renderMetric('metric-approval', { label: 'Aguardando Aprovação', value: metrics.approval, trend: '!', meta: 'Trilateral' });
    OS_UI.renderMetric('metric-production', { label: 'Atraso Operacional', value: metrics.atrasado, trend: 'down', meta: 'Crítico' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos para Postar', value: metrics.ready, trend: '✔', meta: 'Publicação' });
}

function renderContentTable(contents) {
    const body = document.getElementById('pipeline-table-body');
    if (!contents || contents.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color:var(--os-text-muted);">Nenhum ativo estratégico provido neste workspace.</td></tr>`;
        return;
    }

    body.innerHTML = contents.map(c => {
        const scheduled = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Pendente';
        const stdStatus = mapToStandardStatus(c.status);
        const statusLabel = STATUS_LABELS[stdStatus] || c.status;
        const revCount = c.metadata?.revision_cycle || 1;
        const versionLabel = `V${revCount}`;
        
        // Renderizar Aprovações Trilaterais
        const strat = c.metadata?.strategic_approved ? '🟢' : '⚪';
        const oper = c.metadata?.operational_approved ? '🟢' : '⚪';
        const clie = c.metadata?.client_approved ? '🟢' : '⚪';
        
        const approvalsHtml = `
            <div style="font-size:0.6rem; display:flex; gap:8px;" title="Estrutural | Técnico | Cliente">
                <span>EST: ${strat}</span>
                <span>OPE: ${oper}</span>
                <span>CLI: ${clie}</span>
            </div>
        `;

        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-weight: 700; color: #fff;">${c.title}</div>
                        <span style="font-size: 0.5rem; background: ${revCount >= 3 ? 'var(--os-danger)' : '#222'}; color: #fff; padding: 2px 6px; border-radius: 2px; font-weight: 800; font-family:'JetBrains Mono';">${versionLabel}</span>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--os-primary); font-weight: 800; margin-top: 2px;">
                        <i class="fa-solid fa-calendar-day" style="font-size: 0.6rem; margin-right: 4px;"></i> ${scheduled}
                    </div>
                </td>
                <td><span class="status-badge" style="background:${getStatusBg(c.status)}; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.6rem; font-weight: 800; white-space: nowrap;">${statusLabel}</span></td>
                <td>
                    <div style="font-size: 0.7rem; font-weight: 800; color: #fff;">${c.metadata?.responsible || 'Design'}</div>
                    <div style="font-size: 0.55rem; color: var(--os-text-muted); font-weight: 800;">${c.priority || 'MÉDIA'}</div>
                </td>
                <td style="font-size: 0.75rem; font-weight: 600;">${c.platform}</td>
                <td>${approvalsHtml}</td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center;">
                        ${stdStatus === 'READY_TO_POST' ? `
                            <button class="btn-mini" title="Ponte de Publicação" onclick="window.openPublishBridge('${c.id}')" style="background: var(--os-primary); color: #000; border: none;">
                                <i class="fa-solid fa-rocket"></i>
                            </button>
                        ` : `
                            <button class="btn-mini" title="Forçar Conclusão" onclick="window.forceReady('${c.id}')" style="background: rgba(16, 185, 129, 0.1); border-color: var(--os-success); color: var(--os-success);">
                                <i class="fa-solid fa-circle-check"></i>
                            </button>
                        `}
                        <button class="btn-mini" title="Editar/Governar" onclick="window.openEditModal('${c.id}')" style="background: rgba(107, 122, 69, 0.2); border-color: var(--os-primary); color: var(--os-primary);">
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
            const std = mapToStandardStatus(c.status);
            const isStrategic = mode === 'STRATEGIC';
            const statusColor = getStatusBg(c.status);
            
            if (!isStrategic && !['IN_PRODUCTION', 'INTERNAL_QA', 'CLIENT_REVIEW_CONTENT', 'READY_TO_POST', 'POSTED'].includes(std)) return '';

            return `
                <div class="calendar-event" onclick="window.openApproval('${c.id}')" 
                     style="border-left-color: ${statusColor}; background: rgba(255,255,255,0.02); font-size: 0.6rem; padding: 4px 8px; margin-bottom: 4px; border-radius: 2px;">
                     <div style="font-weight: 800; color: #fff;">${c.title.substring(0, 15)}</div>
                     <div style="font-size: 0.55rem; color: #fff; font-weight: 700; opacity: 0.7;">V${c.metadata?.revision_cycle || 1}</div>
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
    const std = mapToStandardStatus(status);
    if (std.includes('PLANNING') || std.includes('REVIEW')) {
        if (std.includes('CLIENT')) return 'rgba(59, 130, 246, 0.4)';
        return 'rgba(139, 92, 246, 0.4)';
    }
    if (std.includes('PRODUCTION')) return 'rgba(245, 158, 11, 0.4)';
    if (std.includes('REVISION')) return 'rgba(239, 68, 68, 0.4)';
    if (std.includes('APPROVED') || std.includes('POST')) return 'rgba(16, 185, 129, 0.4)';
    return 'rgba(255, 255, 255, 0.15)';
}

window.openApproval = (id) => {
    window.open(`approval.html?id=${id}`, '_blank');
};

let editingAssetId = null;
let currentAssetData = null;

window.openEditModal = async (id) => {
    editingAssetId = id;
    const supabase = getSupabase();
    
    let c = null;
    try {
        const res = await supabase.from('content_assets').select('*').eq('id', id).single();
        c = res.data;
    } catch (e) {
        const local = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
        c = local.find(item => item.id === id);
    }

    if (c) {
        currentAssetData = c;
        const std = mapToStandardStatus(c.status);
        
        // 1. Configurar título
        document.getElementById('edit-asset-title').value = c.title;
        document.getElementById('edit-asset-ref').value = c.metadata?.reference_url || '';
        document.getElementById('edit-asset-art-final').value = c.metadata?.final_asset_url || '';
        
        // 2. Tratar Versões e Histórico
        const versions = c.metadata?.versions || {
            'V1': { caption: c.caption || '', locked: false }
        };
        
        const currentVersion = c.metadata?.version || 'V1';
        
        // Seletor de Versão
        const selector = document.getElementById('edit-asset-version-selector');
        selector.innerHTML = '';
        Object.keys(versions).forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.innerText = `${v} ${versions[v].locked ? '(CONGELADA)' : '(ATIVA)'}`;
            selector.appendChild(opt);
        });
        selector.value = currentVersion;
        
        // Listener do seletor
        selector.onchange = (e) => {
            const selectedVer = e.target.value;
            const verObj = versions[selectedVer];
            const captionArea = document.getElementById('edit-asset-caption');
            const lockBanner = document.getElementById('edit-asset-lock-banner');
            
            captionArea.value = verObj.caption || '';
            if (verObj.locked) {
                captionArea.disabled = true;
                lockBanner.style.display = 'block';
            } else {
                captionArea.disabled = false;
                lockBanner.style.display = 'none';
            }
        };
        
        // Trigger inicial do seletor
        selector.dispatchEvent(new Event('change'));

        // 3. Renderizar Aprovações Trilaterais checkboxes
        document.getElementById('approve-strategic').checked = c.metadata?.strategic_approved || false;
        document.getElementById('approve-operational').checked = c.metadata?.operational_approved || false;
        document.getElementById('approve-client').checked = c.metadata?.client_approved || false;

        // Mostrar ou esconder botão de Rejeição do Cliente
        const btnRejeitar = document.getElementById('btn-rejeitar-cliente');
        if (btnRejeitar) {
            if (['CLIENT_REVIEW_PLANNING', 'CLIENT_REVIEW_CONTENT'].includes(std)) {
                btnRejeitar.style.display = 'block';
                btnRejeitar.onclick = () => window.rejectAndFreezeVersion(id);
            } else {
                btnRejeitar.style.display = 'none';
            }
        }

        // Histórico
        const history = c.metadata?.history || [];
        const historyHtml = history.length > 0 ? history.map(h => `
            <div style="padding:10px; border-bottom:1px solid #222; font-size:0.7rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <b style="color:#ef4444">${h.type === 'CLIENT' ? '📌 REJEITADO PELO CLIENTE' : '🛡️ AJUSTE'}</b>
                    <span style="opacity:0.5;">${new Date(h.date).toLocaleString('pt-BR')}</span>
                </div>
                <div style="color:#eee; line-height:1.4;">${h.note}</div>
                <div style="font-size:0.6rem; opacity:0.4; margin-top:3px;">Por: ${h.author}</div>
            </div>
        `).join('') : '<div style="padding:40px; text-align:center; opacity:0.3; font-size:0.7rem;">Sem histórico de ajustes até o momento.</div>';

        document.getElementById('edit-asset-roadmap-container').innerHTML = `
            <div class="edit-modal-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800; text-transform:uppercase;">Roteiro Estratégico (Pauta)</label>
                    <textarea id="edit-asset-caption" style="width:100%; height:320px; background:#0a0a0a; border:1px solid #222; color:#fff; padding:15px; border-radius:8px; font-family:inherit; font-size:0.9rem; line-height:1.6; outline:none;"></textarea>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800; text-transform:uppercase;">Histórico de Feedbacks</label>
                    <div id="edit-asset-history" style="height:320px; background:#050505; border:1px solid #222; border-radius:8px; overflow-y:auto; padding: 5px;">
                        ${historyHtml}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('edit-asset-caption').value = versions[currentVersion]?.caption || c.caption || '';

        // Preencher outros metadados na aba inferior
        const metaGrid = document.getElementById('edit-asset-meta-fields');
        if (metaGrid) {
            metaGrid.style.display = 'grid';
            metaGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            metaGrid.style.gap = '20px';
            metaGrid.innerHTML = `
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">RESPONSÁVEL</label>
                    <select id="edit-asset-responsible" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="Design">Design</option>
                        <option value="Audiovisual">Audiovisual</option>
                        <option value="Estrategista">Estrategista</option>
                        <option value="Gestor de Tráfego">Gestor de Tráfego</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">PRAZO DE APROVAÇÃO</label>
                    <input type="datetime-local" id="edit-asset-deadline" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                </div>
                <div>
                    <label style="display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;">PRIORIDADE</label>
                    <select id="edit-asset-priority" style="width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;">
                        <option value="BAIXA">BAIXA</option>
                        <option value="MÉDIA">MÉDIA</option>
                        <option value="ALTA">ALTA</option>
                    </select>
                </div>
            `;

            document.getElementById('edit-asset-responsible').value = c.metadata?.responsible || 'Design';
            document.getElementById('edit-asset-priority').value = c.priority || 'MÉDIA';
            
            if (c.metadata?.approval_deadline) {
                try {
                    const d = new Date(c.metadata.approval_deadline);
                    document.getElementById('edit-asset-deadline').value = d.toISOString().slice(0, 16);
                } catch (e) {}
            }
        }

        document.getElementById('modal-edit-asset').style.display = 'flex';
    }
};

window.closeEditModal = () => {
    document.getElementById('modal-edit-asset').style.display = 'none';
};

window.rejectAndFreezeVersion = async (id) => {
    const feedback = prompt("Descreva o feedback/motivo de rejeição do Cliente:");
    if (!feedback) return;

    try {
        const curVer = currentAssetData.metadata?.version || 'V1';
        const versions = currentAssetData.metadata?.versions || {
            'V1': { caption: currentAssetData.caption || '', locked: false }
        };

        // 1. Travar a versão atual
        if (versions[curVer]) {
            versions[curVer].locked = true;
        }

        // 2. Incrementar a versão ativa
        const nextCycle = (currentAssetData.metadata?.revision_cycle || 1) + 1;
        const nextVer = `V${nextCycle}`;

        // Injetar no seletor de versões
        versions[nextVer] = {
            caption: versions[curVer].caption, // herda o roteiro para edição
            locked: false
        };

        // Adicionar histórico
        const history = currentAssetData.metadata?.history || [];
        history.push({
            date: new Date().toISOString(),
            type: 'CLIENT',
            author: 'Aprovador Cliente',
            note: feedback
        });

        // 3. Montar payload de atualização
        const std = mapToStandardStatus(currentAssetData.status);
        const nextStatus = std === 'CLIENT_REVIEW_PLANNING' ? 'CLIENT_REVISION_PLANNING' : 'CLIENT_REVISION_CONTENT';

        const updatedMetadata = {
            ...currentAssetData.metadata,
            version: nextVer,
            revision_cycle: nextCycle,
            versions: versions,
            history: history,
            client_approved: false
        };

        const updatePayload = {
            status: nextStatus,
            metadata: updatedMetadata
        };

        // 4. Salvar na Timeline
        injectTimelineEvent(currentAssetData.project_id, 'REJEIÇÃO_CLIENTE', `Versão ${curVer} rejeitada pelo cliente. Iniciado ciclo ${nextVer} de ajustes. Feedback: "${feedback}"`);

        const supabase = getSupabase();
        let error = null;
        try {
            const res = await supabase.from('content_assets').update(updatePayload).eq('id', id);
            error = res.error;
        } catch (e) {
            error = e;
        }

        if (error) {
            // Fallback mock
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const idx = mockAssets.findIndex(item => item.id === id);
            if (idx >= 0) {
                mockAssets[idx].status = nextStatus;
                mockAssets[idx].metadata = updatedMetadata;
                localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
            }
        }

        closeEditModal();
        loadContent();
    } catch (e) {
        alert("Erro ao rejeitar: " + e.message);
    }
};

window.saveAssetEdit = async () => {
    try {
        const title = document.getElementById('edit-asset-title').value;
        const caption = document.getElementById('edit-asset-caption').value;
        const ref = document.getElementById('edit-asset-ref').value;
        const artFinal = document.getElementById('edit-asset-art-final').value;
        
        const responsible = document.getElementById('edit-asset-responsible').value;
        const priority = document.getElementById('edit-asset-priority').value;
        const deadline = document.getElementById('edit-asset-deadline').value;

        // Carregar checkboxes de aprovação trilateral
        const strat = document.getElementById('approve-strategic').checked;
        const oper = document.getElementById('approve-operational').checked;
        const clie = document.getElementById('approve-client').checked;

        const curVer = document.getElementById('edit-asset-version-selector').value;
        const versions = currentAssetData.metadata?.versions || {
            'V1': { caption: currentAssetData.caption || '', locked: false }
        };

        // Atualizar roteiro na versão selecionada (se não estiver travada)
        if (versions[curVer] && !versions[curVer].locked) {
            versions[curVer].caption = caption;
        }

        const newMetadata = {
            ...currentAssetData.metadata,
            reference_url: ref,
            final_asset_url: artFinal,
            responsible,
            approval_deadline: deadline,
            strategic_approved: strat,
            operational_approved: oper,
            client_approved: clie,
            versions: versions
        };

        let updatePayload = {
            title,
            caption: versions[currentAssetData.metadata?.version || 'V1']?.caption || caption,
            priority,
            metadata: newMetadata
        };

        // Mapear status dinâmicos
        const std = mapToStandardStatus(currentAssetData.status);
        if (strat && oper && clie) {
            updatePayload.status = 'READY_TO_POST';
        } else if (strat && oper && !clie && std !== 'CLIENT_REVIEW_CONTENT') {
            updatePayload.status = 'CLIENT_REVIEW_CONTENT';
        }

        const supabase = getSupabase();
        let error = null;
        try {
            const res = await supabase.from('content_assets').update(updatePayload).eq('id', editingAssetId);
            error = res.error;
        } catch (e) {
            error = e;
        }

        if (error) {
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const idx = mockAssets.findIndex(item => item.id === editingAssetId);
            if (idx >= 0) {
                mockAssets[idx].title = title;
                mockAssets[idx].caption = updatePayload.caption;
                mockAssets[idx].priority = priority;
                mockAssets[idx].metadata = newMetadata;
                if (updatePayload.status) {
                    mockAssets[idx].status = updatePayload.status;
                }
                localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
            }
        }

        // Timeline log
        injectTimelineEvent(currentAssetData.project_id, 'EDIT_ATiVO', `Ativo "${title}" governado. Fases: Estratégico (${strat ? 'OK' : 'Pendente'}), Técnico (${oper ? 'OK' : 'Pendente'}), Cliente (${clie ? 'OK' : 'Pendente'})`);

        closeEditModal();
        loadContent();
    } catch (e) {
        sLog('Erro ao salvar: ' + e.message);
    }
};

function injectTimelineEvent(projId, type, desc) {
    try {
        const mockTimeline = JSON.parse(localStorage.getItem('fluxai_mock_timeline') || '[]');
        mockTimeline.unshift({
            id: "log_" + Date.now(),
            project_id: projId,
            type: 'OPERACIONAL',
            title: desc,
            description: `Transição automática governada pela mesa editorial FluxAI.`,
            date: new Date().toISOString(),
            author: 'Workflow Engine'
        });
        localStorage.setItem('fluxai_mock_timeline', JSON.stringify(mockTimeline));
    } catch (e) {}
}

function renderTimelineTab() {
    const feed = document.getElementById('timeline-operational-feed');
    if (!feed) return;

    const mockTimeline = JSON.parse(localStorage.getItem('fluxai_mock_timeline') || '[]');
    const projectTimeline = currentProject 
        ? mockTimeline.filter(t => t.project_id === currentProject)
        : mockTimeline;

    if (projectTimeline.length === 0) {
        feed.innerHTML = `<div style="padding:40px; text-align:center; color:var(--os-text-muted); font-size:0.8rem;">Nenhum log de transição operacional neste ciclo.</div>`;
        return;
    }

    feed.innerHTML = projectTimeline.map(t => {
        const typeColor = t.type === 'SISTEMA' ? 'var(--os-primary)' : (t.type === 'IA_ENGINE' ? '#10b981' : '#60a5fa');
        return `
            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--os-border); border-left: 3px solid ${typeColor}; padding:15px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:0.75rem;">
                <div style="display:flex; justify-content:between; align-items:center; margin-bottom:5px;">
                    <strong style="color:${typeColor}">${t.title}</strong>
                    <span style="margin-left:auto; opacity:0.4; font-size:0.65rem;">${new Date(t.date).toLocaleString('pt-BR')}</span>
                </div>
                <div style="color:#ddd; margin-top:5px; line-height:1.4;">${t.description}</div>
                <div style="font-size:0.6rem; opacity:0.4; margin-top:5px; text-align:right;">Autor: ${t.author}</div>
            </div>
        `;
    }).join('');
}

function renderIntelligenceTab() {
    const totalDMs = document.getElementById('intel-dms');
    const retention = document.getElementById('intel-retention');
    const fatigue = document.getElementById('intel-fatigue');
    const performance = document.getElementById('intel-performance');
    const rankingBody = document.getElementById('intel-ranking-body');
    const diagnostic = document.getElementById('intel-ai-diagnostic');

    // Mapear dados de performance simulados premium
    if (totalDMs) totalDMs.innerText = "87 DMs";
    if (retention) retention.innerText = "68.4%";
    if (fatigue) fatigue.innerText = "12.3%";
    if (performance) performance.innerText = "94/100 (A+)";

    // 1. Tabela de Performance
    if (rankingBody) {
        rankingBody.innerHTML = `
            <tr>
                <td style="font-weight:700; color:#fff;">Direção Audiovisual (Reels): Organização Alimentar Real</td>
                <td>12.450 visualizações</td>
                <td style="color:var(--os-success);">71.2% (Alto)</td>
                <td>34 Leads</td>
                <td style="font-weight:800; color:var(--os-primary);">96 / 100</td>
            </tr>
            <tr>
                <td style="font-weight:700; color:#fff;">Estrutura Narrativa (Carrossel): Substituições Inteligentes</td>
                <td>8.900 visualizações</td>
                <td>58.9% (Médio)</td>
                <td>18 Leads</td>
                <td style="font-weight:800; color:var(--os-primary);">88 / 100</td>
            </tr>
            <tr>
                <td style="font-weight:700; color:#fff;">Direção Audiovisual (Reels): Bastidores da Nutrição Humana</td>
                <td>15.200 visualizações</td>
                <td style="color:var(--os-success);">75.1% (Excelente)</td>
                <td>35 Leads</td>
                <td style="font-weight:800; color:var(--os-primary);">98 / 100</td>
            </tr>
        `;
    }

    // 2. Diagnóstico IA
    if (diagnostic) {
        diagnostic.innerHTML = `
> [IA COGNITIVE ENGINE] Diagnóstico Narrativo de 30 Dias...

==================================================
1. ANÁLISE DE FADIGA NARRATIVA:
- Pilar 'Autoridade Técnica' está estável. 
- Pilar 'Terrorismo Nutricional' apresenta início de fadiga narrativa (Saturação de termos de combate a ultraprocessados).
- Recomendação: Mudar tom da próxima pauta para 'Casos Reais Clínicos'.

2. EFICIÊNCIA DE CTA:
- 'Comente ROTINA' obteve taxa de clique de 4.8% nas DMs.
- 'Agende pelo WhatsApp' obteve conversão direta de 1.2%.
- Recomendação: Continuar usando CTAs baseadas em automações de palavras-chave que facilitam a tração rápida de leads frios.

3. RETENÇÃO AUDIOVISUAL:
- Reels com ganchos falados na primeira pessoa (eu) retêm 14% mais nos primeiros 3 segundos do que ganchos institucionais.
==================================================
        `;
    }
}

window.forceReady = async (id) => {
    if (!confirm('Deseja marcar este ativo como PRONTO para publicação?')) return;
    try {
        const currentAsset = window.loadedContents?.find(item => item.id === id) || {};
        const currentLogical = mapToStandardStatus(currentAsset.status || '').toLowerCase();
        const userRole = OS_AUTH.user?.role || 'OPERATOR';

        const transitionResult = await StatusEngine.transition(
            'conteudos',
            id,
            currentLogical,
            'ready_to_post',
            { role: userRole }
        );

        if (!transitionResult.success) {
            alert('Erro de validação de transição: ' + transitionResult.error);
            return;
        }

        const supabase = getSupabase();
        let error = null;
        try {
            const res = await supabase.from('content_assets').update({ status: 'READY_TO_POST' }).eq('id', id);
            error = res.error;
        } catch (e) {
            error = e;
        }

        if (error) {
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const idx = mockAssets.findIndex(item => item.id === id);
            if (idx >= 0) {
                mockAssets[idx].status = 'READY_TO_POST';
                localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
            }
        }
        
        // Registrar log de governança
        OS_LOGS_ENGINE.userAction(
            'AI_GENERATION_APPROVED',
            'content-engine',
            { asset_id: id, action: 'force_ready' },
            userRole,
            currentProject
        );

        // Disparar webhook simulado se configurado
        if (transitionResult.webhook) {
            const payload = {
                asset_id: id,
                project_id: currentProject,
                status: 'READY_TO_POST',
                timestamp: new Date().toISOString()
            };
            await OS_CONFIG.webhooks.send(transitionResult.webhook, payload);
        }

        sLog('Ativo forçado para READY_TO_POST.');
        loadContent();
    } catch (e) {
        alert('Erro ao forçar conclusão: ' + e.message);
    }
};

window.deleteAsset = async (id) => {
    if (!confirm('Deseja excluir este ativo da esteira?')) return;
    try {
        const currentAsset = window.loadedContents?.find(item => item.id === id) || {};
        const currentLogical = mapToStandardStatus(currentAsset.status || '').toLowerCase();
        const userRole = OS_AUTH.user?.role || 'OPERATOR';

        let currentGiaStatus = 'rascunho';
        if (currentLogical === 'draft_planning' || currentLogical === 'rascunho') currentGiaStatus = 'rascunho';
        else if (currentLogical === 'internal_review' || currentLogical === 'em_revisao') currentGiaStatus = 'em_revisao';
        else if (currentLogical === 'planning_approved' || currentLogical === 'aprovado') currentGiaStatus = 'aprovado';
        else if (currentLogical === 'posted' || currentLogical === 'publicado') currentGiaStatus = 'publicado';

        const transitionResult = await StatusEngine.transition(
            'geracao_ia',
            id,
            currentGiaStatus,
            'descartado',
            { role: userRole }
        );

        if (!transitionResult.success) {
            alert('Erro de validação de transição: ' + transitionResult.error);
            return;
        }

        const supabase = getSupabase();
        let error = null;
        try {
            const res = await supabase.from('content_assets').delete().eq('id', id);
            error = res.error;
        } catch (e) {
            error = e;
        }

        if (error) {
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const filtered = mockAssets.filter(item => item.id !== id);
            localStorage.setItem('fluxai_mock_assets', JSON.stringify(filtered));
        }

        // Registrar log de governança
        OS_LOGS_ENGINE.userAction(
            'AI_GENERATION_DELETED',
            'content-engine',
            { asset_id: id, action: 'delete' },
            userRole,
            currentProject
        );

        // Disparar webhook simulado se configurado
        if (transitionResult.webhook) {
            const payload = {
                asset_id: id,
                project_id: currentProject,
                status: 'descartado',
                timestamp: new Date().toISOString()
            };
            await OS_CONFIG.webhooks.send(transitionResult.webhook, payload);
        }

        loadContent();
    } catch (e) {
        alert('Erro ao excluir ativo: ' + e.message);
    }
};

async function runAiPlanner() {
    const selectedId = document.getElementById('project-filter').value;
    if (!selectedId) {
        alert('Selecione um cliente específico para gerar pautas com IA.');
        return;
    }

    const serviceSelect = document.getElementById('ai-planner-service');
    const serviceKey = serviceSelect ? serviceSelect.value : 'ALL';

    const btnAi = document.getElementById('btn-ai-planner');
    const originalText = btnAi ? btnAi.innerHTML : '';
    if (btnAi) {
        btnAi.disabled = true;
        btnAi.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GERANDO...';
    }

    try {
        sLog(`[IA_PLANNER] Executando planejamento de IA para o cliente ${selectedId}, serviço: ${serviceKey}`);
        
        // Chamar o gerador do planner
        const generated = await AIPlanner.generatePlan(selectedId, serviceKey, 1);
        if (!generated || generated.length === 0) {
            throw new Error('Nenhuma pauta pôde ser gerada para o escopo selecionado.');
        }

        const newAsset = generated[0];
        
        // Injetar rascunho de IA (rascunho inicial) no banco ou no mock
        const supabase = getSupabase();
        let error = null;
        try {
            const { error: dbError } = await supabase.from('content_assets').insert(newAsset);
            error = dbError;
        } catch (e) {
            error = e;
        }

        if (error) {
            // Fallback Mock LocalStorage
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            newAsset.id = 'asset_mock_' + Date.now();
            mockAssets.unshift(newAsset);
            localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
        }

        // Registrar log de criação de pauta em rascunho (não ocupa limite operacional)
        OS_LOGS_ENGINE.userAction(
            'AI_GENERATION_STATUS',
            'content-engine',
            { action: 'generate_draft', service: serviceKey, client_id: selectedId },
            OS_AUTH.user?.role || 'OPERATOR',
            selectedId,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        sLog('[IA_PLANNER] Pauta em rascunho criada com sucesso.');
        
        // Atualizar lista
        await loadContent();
    } catch (err) {
        sLog('[IA_PLANNER] Erro na geração: ' + err.message);
        alert('Erro ao gerar IA: ' + err.message);
    } finally {
        if (btnAi) {
            btnAi.disabled = false;
            btnAi.innerHTML = originalText;
        }
    }
}

window.runAiPlanner = runAiPlanner;

initEngine();
async function setupRealtime() { 
    const supabase = getSupabase(); 
    if (realtimeChannel) { 
        supabase.removeChannel(realtimeChannel); 
    } 
    realtimeChannel = supabase.channel('content-updates').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'content_assets' }, (payload) => { 
        sLog('Sincronização Realtime: Alteração detectada.'); 
        loadContent(); 
    }).subscribe(); 
}
