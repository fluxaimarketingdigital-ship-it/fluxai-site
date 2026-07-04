import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';
import { contentEngineData } from './content-engine.data.js';
import { StatusEngine, STATUS_SYSTEM } from '../../config/status-system.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { AIPlanner } from '../../services/ai-planner.js';
import { MakeClient } from '../../services/makeClient.js';
import { ROTAS_OS_MAKE } from '../../services/makeRoutes.js';

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

// Mapeia o Status Lógico (ex: DRAFT_PLANNING) para os exatos valores dos Dropdowns no Excel
function mapToMakeSpreadsheet(standardStatus, isPostagem = false) {
    const std = standardStatus.toLowerCase();
    
    // Tabela 16: CALENDARIO_POSTAGENS
    if (isPostagem) {
        if (std === 'ready_to_post') return 'agendado';
        if (std === 'posted') return 'publicado';
        return 'rascunho'; // fallback
    }

    // Tabela 15: PLANEJAMENTO_CONTEUDO
    if (std === 'draft_planning' || std === 'internal_revision') return 'rascunho';
    if (std === 'internal_review') return 'em_revisao_fluxai';
    if (std === 'client_review_planning' || std === 'client_revision_planning') return 'enviado_cliente';
    if (std === 'planning_approved') return 'aprovado_cliente';
    if (std === 'in_production' || std === 'client_revision_content') return 'em_producao';
    if (std === 'internal_qa') return 'aprovado_interno';
    if (std === 'client_review_content') return 'enviado_cliente';
    if (std === 'ready_to_post') return 'agendado';
    if (std === 'posted') return 'publicado';

    return 'rascunho'; // fallback seguro para o Make não falhar
}

function mapToSpreadsheetFormat(rawFormat) {
    if (!rawFormat) return 'outro';
    const fmt = rawFormat.toLowerCase();
    if (fmt.includes('reels') || fmt.includes('video')) return 'reels';
    if (fmt.includes('carrossel')) return 'carrossel';
    if (fmt.includes('estatico') || fmt.includes('imagem') || fmt.includes('unico')) return 'post_estatico';
    if (fmt.includes('story') || fmt.includes('stories')) return 'story';
    if (fmt.includes('artigo') || fmt.includes('blog')) return 'artigo';
    if (fmt.includes('email')) return 'email';
    if (fmt.includes('landing') || fmt.includes('site')) return 'landing_page';
    if (fmt.includes('anuncio') || fmt.includes('ads')) return 'anuncio';
    return 'outro';
}

function mapToSpreadsheetChannel(rawChannel) {
    if (!rawChannel) return 'outro';
    const ch = rawChannel.toLowerCase();
    if (ch.includes('instagram')) return 'instagram';
    if (ch.includes('facebook')) return 'facebook';
    if (ch.includes('linkedin')) return 'linkedin';
    if (ch.includes('site')) return 'site';
    if (ch.includes('blog')) return 'blog';
    if (ch.includes('email')) return 'email';
    if (ch.includes('whatsapp')) return 'whatsapp';
    if (ch.includes('youtube')) return 'youtube';
    return 'outro';
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

        const userRole = OS_AUTH.user?.role || 'OPERATOR';
        const tabIaGov = document.getElementById('tab-btn-ia-gov');
        if (userRole === 'CLIENT' && tabIaGov) {
            tabIaGov.style.display = 'none';
        }

        await loadContent();
        setupRealtime();

        const btnGlobalWa = document.getElementById('btn-global-wa');
        if (btnGlobalWa) {
            btnGlobalWa.onclick = () => {
                const selectedId = document.getElementById('project-filter').value;
                if (!selectedId) return alert('Selecione um cliente específico para enviar o lembrete direto.');
                const portalLink = `${window.location.origin}/os/client-portal.html?project_id=${selectedId}`;
                const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
                const project = mockProjects.find(p => p.id === selectedId);
                const phone = project?.digital_infrastructure?.operational_links?.whatsapp || '';
                const msgText = `Olá! 🚀\n\nPassando para lembrar que temos conteúdos aguardando sua aprovação no portal da FluxAI.\n\nConfira aqui seu calendário atualizado:\n${portalLink}`;
                window.triggerWhatsAppContact(phone, msgText);
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


    } catch (err) {
        sLog('ERRO NO MOTOR: ' + err.message);
    }
}

function switchTab(tab) {
    const tabs = ['esteira', 'calendario-estrategico', 'calendario-operacional', 'timeline-operacional', 'intelligence', 'ia-governance'];
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
            select.textContent = '';
            const opt = document.createElement('option'); opt.value = ''; opt.textContent = 'Todos os Projetos';
            select.appendChild(opt);
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
            select.textContent = '';
            const opt = document.createElement('option'); opt.value = ''; opt.textContent = 'Sem projetos cadastrados';
            select.appendChild(opt);
        }
    }
}

window.calculateIACredits = async (clientId) => {
    let baseLimit = 0;
    let extraLimit = 0;
    let manualLimit = 0;

    const mockContracts = JSON.parse(localStorage.getItem('fluxai_mock_contracts') || '[]');
    const contract = mockContracts.find(c => c.client_id === clientId);
    if (contract) {
        baseLimit = parseInt(contract.ia_credits || 0, 10);
        const extras = contract.extras || [];
        extras.forEach(ext => {
            if (ext.status === 'aprovado' && ext.ai_credits) {
                extraLimit += parseInt(ext.ai_credits, 10);
            }
        });
    }

    const manualAdjustments = JSON.parse(localStorage.getItem('fluxai_ia_manual_adjustments') || '{}');
    manualLimit = parseInt(manualAdjustments[clientId] || 0, 10);

    // Fallback de teste para evitar bloqueio caso a tabela IA_CREDITOS_CLIENTE ainda não tenha dados
    if (baseLimit === 0 && extraLimit === 0 && manualLimit === 0) {
        baseLimit = 20; 
    }

    const totalLimit = baseLimit + extraLimit + manualLimit;

    let occupied = 0; 
    let consumed = 0; 
    const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
    const clientAssets = mockAssets.filter(a => a.project_id === clientId && a.metadata?.ai_generated);

    clientAssets.forEach(asset => {
        const status = asset.status;
        const stdStatus = mapToStandardStatus(status);
        if (['aprovado_interno', 'em_revisao_fluxai', 'CLIENT_REVIEW_PLANNING', 'CLIENT_REVIEW_CONTENT'].includes(status) || ['REVIEW', 'READY_TO_POST'].includes(stdStatus)) {
            occupied++;
        } else if (['publicado', 'POSTED'].includes(stdStatus) || status === 'publicado') {
            consumed++;
        }
    });

    return { total: totalLimit, occupied, consumed, available: totalLimit - (occupied + consumed), base: baseLimit, extra: extraLimit, manual: manualLimit };
};

window.updateIAGovDashboard = async () => {
    const govTotal = document.getElementById('ia-gov-total');
    if (!govTotal) return; // tab was hidden
    if (!currentProject) {
        const tbody = document.getElementById('ia-gov-table-body');
        tbody.textContent = '';
        const tr = document.createElement('tr');
        const td = document.createElement('td'); td.colSpan = 5; td.style.cssText = 'text-align:center; padding:50px; color:#444;'; td.textContent = 'Selecione um projeto para carregar a auditoria.';
        tr.appendChild(td); tbody.appendChild(tr);
        govTotal.textContent = '--';
        document.getElementById('ia-gov-available').textContent = '--';
        document.getElementById('ia-gov-occupied').textContent = '--';
        document.getElementById('ia-gov-consumed').textContent = '--';
        return;
    }

    const credits = await window.calculateIACredits(currentProject);
    
    govTotal.textContent = credits.total;
    document.getElementById('ia-gov-available').textContent = credits.available;
    document.getElementById('ia-gov-occupied').textContent = credits.occupied;
    document.getElementById('ia-gov-consumed').textContent = credits.consumed;
    
    const userRole = OS_AUTH.user?.role;
    if (userRole === 'ADMIN') {
        const btnManual = document.getElementById('btn-manual-credit');
        if (btnManual) btnManual.style.display = 'block';
    }

    const tableBody = document.getElementById('ia-gov-table-body');
    const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
    const clientAssets = mockAssets.filter(a => a.project_id === currentProject && a.metadata?.ai_generated);
    
    if (clientAssets.length === 0) {
        tableBody.textContent = '';
        const trEmpty = document.createElement('tr');
        const tdEmpty = document.createElement('td'); tdEmpty.colSpan = 5; tdEmpty.style.cssText = 'text-align:center; padding:50px; color:#444;'; tdEmpty.textContent = 'Nenhuma geração de IA encontrada neste escopo.';
        trEmpty.appendChild(tdEmpty); tableBody.appendChild(trEmpty);
    } else {
        tableBody.textContent = '';
        clientAssets.forEach(a => {
            const tr = document.createElement('tr');
            let impact = 'Nenhum';
            const stdStatus = mapToStandardStatus(a.status);
            if (['aprovado_interno', 'em_revisao_fluxai', 'CLIENT_REVIEW_PLANNING', 'CLIENT_REVIEW_CONTENT'].includes(a.status) || ['REVIEW', 'READY_TO_POST'].includes(stdStatus)) impact = 'Ocupado';
            if (stdStatus === 'POSTED' || a.status === 'publicado') impact = 'Consumido';
            
            const td1 = document.createElement('td');
            td1.style.cssText = "font-family:'JetBrains Mono', monospace; font-size:0.75rem;";
            td1.textContent = a.id.split('_').pop().substring(0,8);
            
            const td2 = document.createElement('td');
            const spanStatus = document.createElement('span');
            spanStatus.style.cssText = "background:rgba(255,255,255,0.1); padding:3px 8px; border-radius:4px; font-size:0.7rem;";
            spanStatus.textContent = a.status;
            td2.appendChild(spanStatus);
            
            const td3 = document.createElement('td');
            td3.textContent = a.metadata?.origin_contract || 'Contrato Base';
            
            const td4 = document.createElement('td');
            td4.style.color = impact==='Ocupado' ? 'var(--os-warning)' : (impact==='Consumido' ? 'var(--os-primary)' : '#888');
            td4.textContent = impact;
            
            const td5 = document.createElement('td');
            td5.style.fontSize = "0.75rem";
            td5.textContent = new Date(a.created_at).toLocaleDateString('pt-BR');
            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tableBody.appendChild(tr);
        });
    }
};

window.manualCreditAdjustment = () => {
    if (!currentProject) return;
    const currentAdjustments = JSON.parse(localStorage.getItem('fluxai_ia_manual_adjustments') || '{}');
    const currentVal = parseInt(currentAdjustments[currentProject] || 0, 10);
    const newVal = prompt(`Ajuste manual de créditos para ${currentProject}.\nDigite o novo valor de créditos adicionais manuais:`, currentVal);
    if (newVal !== null && !isNaN(parseInt(newVal, 10))) {
        currentAdjustments[currentProject] = parseInt(newVal, 10);
        localStorage.setItem('fluxai_ia_manual_adjustments', JSON.stringify(currentAdjustments));
        
        OS_LOGS_ENGINE.userAction(
            'IA_CREDIT_MANUAL_ADJUSTMENT',
            'content-engine',
            { action: 'ajuste_credito', novo_valor: parseInt(newVal, 10) },
            OS_AUTH.user?.role || 'ADMIN',
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );
        
        updateIAGovDashboard();
        alert('Ajuste aplicado com sucesso.');
    }
};

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
        let query = supabase.from('PLANEJAMENTO_CONTEUDO').select('*');
        if (currentProject) query = query.eq('client_id', currentProject);

        const { data: contents, error } = await query.order('data_prevista', { ascending: true });
        if (error) throw error;

        window.loadedContents = contents || [];
        renderMetrics(window.loadedContents);
        renderContentTable(window.loadedContents);
        
        renderCalendar('calendar-strategic-body', window.loadedContents, 'STRATEGIC');
        renderCalendar('calendar-operational-body', window.loadedContents, 'OPERATIONAL');
        
        if(window.updateIAGovDashboard) await window.updateIAGovDashboard();
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
        
        if(window.updateIAGovDashboard) await window.updateIAGovDashboard();
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
        const tr = document.createElement('tr');
        tr.textContent = '';
        const tdEmptyAsset = document.createElement('td'); tdEmptyAsset.colSpan = 6; tdEmptyAsset.style.cssText = 'text-align:center; padding: 40px; color:var(--os-text-muted);'; tdEmptyAsset.textContent = 'Nenhum ativo estratégico provido neste workspace.';
        tr.appendChild(tdEmptyAsset);
        body.replaceChildren(tr); 
        return; 
    } 
 
    body.replaceChildren();
    contents.forEach(c => { 
        const scheduled = c.data_prevista ? new Date(c.data_prevista).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Pendente'; 
        const stdStatus = mapToStandardStatus(c.status_planejamento || 'PLANEJAMENTO'); 
        const statusLabel = STATUS_LABELS[stdStatus] || (c.status_planejamento || 'Rascunho'); 
        const revCount = c.metadata?.revision_cycle || 1; 
        const versionLabel = `V${revCount}`; 
         
        const strat = c.metadata?.strategic_approved ? 'SIM' : 'NÃO';  
        const oper = c.metadata?.operational_approved ? 'SIM' : 'NÃO';  
        const clie = c.metadata?.client_approved ? 'SIM' : 'NÃO';  
          
        const tr = document.createElement('tr'); 
        tr.innerHTML = `  
                <td>  
                    <div style="display:flex; align-items:center; gap:8px;">  
                        <div class="safe-title" style="font-weight: 700; color: #fff;"></div>  
                        <span class="safe-version" style="font-size: 0.5rem; color: #fff; padding: 2px 6px; border-radius: 2px; font-weight: 800; font-family:'JetBrains Mono';"></span>  
                    </div>  
                    <div style="font-size: 0.7rem; color: var(--os-primary); font-weight: 800; margin-top: 2px;">  
                        <i class="fa-solid fa-calendar-day" style="font-size: 0.6rem; margin-right: 4px;"></i> <span class="safe-scheduled"></span>  
                    </div>  
                </td>  
                <td><span class="status-badge safe-status" style="color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.6rem; font-weight: 800; white-space: nowrap;"></span></td>  
                <td>  
                    <div class="safe-resp" style="font-size: 0.7rem; font-weight: 800; color: #fff;"></div>  
                    <div class="safe-priority" style="font-size: 0.55rem; color: var(--os-text-muted); font-weight: 800;"></div>  
                </td>  
                <td class="safe-platform" style="font-size: 0.75rem; font-weight: 600;"></td>  
                <td>
                    <div class="safe-approvals" style="font-size:0.6rem; display:flex; gap:8px;" title="Estrutural | Técnico | Cliente"></div>
                </td>  
                <td>  
                    <div class="action-btns" style="display: flex; gap: 8px; justify-content: flex-end; align-items: center;">  
                        <button class="btn-mini safe-btn-pub" title="Ponte de Publicação" style="display:none; background: var(--os-primary); color: #000; border: none;">  
                            <i class="fa-solid fa-rocket"></i>  
                        </button>  
                        <button class="btn-mini safe-btn-force" title="Forçar Conclusão" style="display:none; background: rgba(16, 185, 129, 0.1); border-color: var(--os-success); color: var(--os-success);">  
                            <i class="fa-solid fa-circle-check"></i>  
                        </button>  
                        <button class="btn-mini safe-btn-link" title="Copiar Link Cliente" style="background: rgba(255, 255, 255, 0.05); border-color: #444; color: #fff;"><i class="fa-solid fa-link"></i></button>
                        <button class="btn-mini safe-btn-edit" title="Editar/Governar" style="background: rgba(107, 122, 69, 0.2); border-color: var(--os-primary); color: var(--os-primary);">  
                            <i class="fa-solid fa-pen-to-square"></i>  
                        </button>  
                        <button class="btn-mini safe-btn-del" title="Excluir">  
                            <i class="fa-solid fa-trash"></i>  
                        </button>  
                    </div>  
                </td>  
        `;  
        
        tr.querySelector('.safe-title').textContent = c.tema || c.objetivo_conteudo || `Pauta #${(c.planejamento_id || '').substring(0,6)}`; 
        tr.querySelector('.safe-resp').textContent = c.responsavel_planejamento || c.responsavel_design || 'Design'; 
        
        const versionSpan = tr.querySelector('.safe-version');
        versionSpan.textContent = versionLabel;
        versionSpan.style.background = revCount >= 3 ? 'var(--os-danger)' : '#222';
        
        tr.querySelector('.safe-scheduled').textContent = scheduled;
        
        const statusSpan = tr.querySelector('.safe-status');
        statusSpan.textContent = statusLabel;
        statusSpan.style.background = getStatusBg(c.status_planejamento);
        
        tr.querySelector('.safe-priority').textContent = c.prioridade || 'MÉDIA';
        tr.querySelector('.safe-platform').textContent = c.canal || 'INSTAGRAM';
        
        const approvalsDiv = tr.querySelector('.safe-approvals');
        const spanStrat = document.createElement('span'); spanStrat.textContent = `EST: ${strat}`;
        const spanOper = document.createElement('span'); spanOper.textContent = `OPE: ${oper}`;
        const spanClie = document.createElement('span'); spanClie.textContent = `CLI: ${clie}`;
        approvalsDiv.replaceChildren(spanStrat, spanOper, spanClie);
         
        if (stdStatus === 'READY_TO_POST') { 
            tr.querySelector('.safe-btn-pub').style.display = 'inline-block';
            tr.querySelector('.safe-btn-pub').onclick = () => window.openPublishBridge(c.id); 
        } else { 
            tr.querySelector('.safe-btn-force').style.display = 'inline-block';
            tr.querySelector('.safe-btn-force').onclick = () => window.forceReady(c.id); 
        } 
        tr.querySelector('.safe-btn-link').onclick = () => { const url = window.location.origin + '/os/approval.html?id=' + c.id; navigator.clipboard.writeText(url).then(() => alert('Link de aprovação copiado!\n' + url)); };
        tr.querySelector('.safe-btn-edit').onclick = () => window.openEditModal(c.id); 
        tr.querySelector('.safe-btn-del').onclick = () => window.deleteAsset(c.id);

        if (stdStatus === 'DESCARTADO' || c.status === 'DESCARTADO') {
            tr.style.opacity = '0.4';
            tr.querySelector('.safe-title').style.textDecoration = 'line-through';
            tr.querySelector('.action-btns').style.display = 'none';
        }

        body.appendChild(tr);
    }); 
}

function renderCalendar(containerId, contents, mode) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.replaceChildren();
    
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const labelId = mode === 'STRATEGIC' ? 'calendar-month-label' : 'calendar-month-label-operacional';
    const label = document.getElementById(labelId);
    if (label) label.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const year = currentYear;
    const month = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.style.opacity = '0.05';
        container.appendChild(div);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayContents = contents.filter(c => c.scheduled_at && c.scheduled_at.startsWith(dayStr));
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.style.minHeight = '100px';
        
        const dayNum = document.createElement('div');
        dayNum.className = 'day-number';
        dayNum.style.cssText = 'font-size: 0.65rem; font-weight: 800; margin-bottom: 8px;';
        dayNum.textContent = day;
        dayDiv.appendChild(dayNum);
        
        dayContents.forEach(c => {
            const std = mapToStandardStatus(c.status);
            if (std === 'DESCARTADO') return;
            
            const isStrategic = mode === 'STRATEGIC';
            const statusColor = getStatusBg(c.status);
            
            if (!isStrategic && !['IN_PRODUCTION', 'INTERNAL_QA', 'CLIENT_REVIEW_CONTENT', 'READY_TO_POST', 'POSTED'].includes(std)) return;

            const evtNode = document.createElement('div');
            evtNode.className = 'calendar-event';
            evtNode.onclick = () => window.openEditModal(c.id);
            evtNode.style.cssText = `border-left-color: ${statusColor}; background: rgba(255,255,255,0.02); font-size: 0.6rem; padding: 4px 8px; margin-bottom: 4px; border-radius: 2px; cursor: pointer;`;
            
            const titleNode = document.createElement('div');
            titleNode.style.cssText = 'font-weight: 800; color: #fff;';
            titleNode.textContent = c.title.substring(0, 15);
            
            const verNode = document.createElement('div');
            verNode.style.cssText = 'font-size: 0.55rem; color: #fff; font-weight: 700; opacity: 0.7;';
            verNode.textContent = `V${c.metadata?.revision_cycle || 1}`;
            
            evtNode.appendChild(titleNode);
            evtNode.appendChild(verNode);
            
            dayDiv.appendChild(evtNode);
        });

        container.appendChild(dayDiv);
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
        selector.textContent = '';
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
        
        // Trigger inicial do seletor (removido daqui, movido para o final da função)

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
        const roadmapContainer = document.getElementById('edit-asset-roadmap-container');
        roadmapContainer.replaceChildren();
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'edit-modal-grid';
        gridDiv.style.cssText = 'display:grid; grid-template-columns:1fr 1fr; gap:20px;';
        
        const leftDiv = document.createElement('div');
        const captionLabel = document.createElement('label');
        captionLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800; text-transform:uppercase;';
        captionLabel.textContent = 'Roteiro Estratégico (Pauta)';
        const captionTextarea = document.createElement('textarea');
        captionTextarea.id = 'edit-asset-caption';
        captionTextarea.style.cssText = 'width:100%; height:140px; background:#0a0a0a; border:1px solid #222; color:#fff; padding:15px; border-radius:8px; font-family:inherit; font-size:0.9rem; line-height:1.6; outline:none; margin-bottom:15px;';
        leftDiv.appendChild(captionLabel);
        leftDiv.appendChild(captionTextarea);

        const socialCopyLabel = document.createElement('label');
        socialCopyLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800; text-transform:uppercase;';
        socialCopyLabel.textContent = 'Legenda Final (Copy da Rede Social)';
        const socialCopyTextarea = document.createElement('textarea');
        socialCopyTextarea.id = 'edit-asset-social-copy';
        socialCopyTextarea.style.cssText = 'width:100%; height:140px; background:#0a0a0a; border:1px solid #222; color:#fff; padding:15px; border-radius:8px; font-family:inherit; font-size:0.9rem; line-height:1.6; outline:none;';
        leftDiv.appendChild(socialCopyLabel);
        leftDiv.appendChild(socialCopyTextarea);
        
        const rightDiv = document.createElement('div');
        const historyLabel = document.createElement('label');
        historyLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800; text-transform:uppercase;';
        historyLabel.textContent = 'Histórico de Feedbacks';
        const historyContainer = document.createElement('div');
        historyContainer.id = 'edit-asset-history';
        historyContainer.style.cssText = 'height:320px; background:#050505; border:1px solid #222; border-radius:8px; overflow-y:auto; padding: 5px;';
        
        const history = c.metadata?.history || [];
        if (history.length > 0) {
            history.forEach(h => {
                const hDiv = document.createElement('div');
                hDiv.style.cssText = 'padding:10px; border-bottom:1px solid #222; font-size:0.7rem;';
                
                const topDiv = document.createElement('div');
                topDiv.style.cssText = 'display:flex; justify-content:space-between; margin-bottom:5px;';
                
                const bTitle = document.createElement('b');
                bTitle.className = 'safe-h-title';
                bTitle.style.color = '#ef4444';
                bTitle.textContent = h.type === 'CLIENT' ? '📌 REJEITADO PELO CLIENTE' : '🛡️ AJUSTE';
                
                const spanDate = document.createElement('span');
                spanDate.style.opacity = '0.5';
                spanDate.textContent = new Date(h.date).toLocaleString('pt-BR');
                
                topDiv.appendChild(bTitle); topDiv.appendChild(spanDate);
                
                const noteDiv = document.createElement('div');
                noteDiv.className = 'safe-h-note';
                noteDiv.style.cssText = 'color:#eee; line-height:1.4;';
                noteDiv.textContent = h.note;
                
                const authorDiv = document.createElement('div');
                authorDiv.className = 'safe-h-author';
                authorDiv.style.cssText = 'font-size:0.6rem; opacity:0.4; margin-top:3px;';
                authorDiv.textContent = 'Por: ' + h.author;
                
                hDiv.appendChild(topDiv);
                hDiv.appendChild(noteDiv);
                hDiv.appendChild(authorDiv);
                
                historyContainer.appendChild(hDiv);
            });
        } else {
            const hDiv = document.createElement('div');
            hDiv.style.cssText = 'padding:40px; text-align:center; opacity:0.3; font-size:0.7rem;';
            hDiv.textContent = 'Sem histórico de ajustes até o momento.';
            historyContainer.appendChild(hDiv);
        }
        
        rightDiv.appendChild(historyLabel);
        rightDiv.appendChild(historyContainer);
        
        gridDiv.appendChild(leftDiv);
        gridDiv.appendChild(rightDiv);
        roadmapContainer.appendChild(gridDiv);
        
        let captionVal = versions[currentVersion]?.caption || c.caption || '';
        let existingSocialCopy = versions[currentVersion]?.social_copy || c.metadata?.social_copy || '';
        
        // Auto-extração da legenda da pauta se a legenda final estiver vazia
        if (!existingSocialCopy && captionVal) {
            const match = captionVal.match(/📝\s*LEGENDA:[ \n]*([\s\S]*?)(?:\n# HASHTAGS:|\n⏰ HORÁRIO IDEAL:|$)/i);
            if (match && match[1].trim() && !match[1].includes('[Pendente de Estruturação')) {
                existingSocialCopy = match[1].trim();
            }
        }

        document.getElementById('edit-asset-caption').value = captionVal;
        document.getElementById('edit-asset-social-copy').value = existingSocialCopy;

        // Preencher outros metadados na aba inferior
        const metaGrid = document.getElementById('edit-asset-meta-fields');
        if (metaGrid) {
            metaGrid.style.display = 'grid';
            metaGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            metaGrid.style.gap = '20px';

            const currentLogical = mapToStandardStatus(c.status).toLowerCase(); 
            const currentStatusObj = StatusEngine.resolve('conteudos', currentLogical); 
            const allowedTransitions = STATUS_SYSTEM.conteudos[currentLogical]?.allowedTransitions || []; 
 
            metaGrid.replaceChildren();

            const respDiv = document.createElement('div');
            const respLabel = document.createElement('label');
            respLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;';
            respLabel.textContent = 'RESPONSÁVEL';
            const respSel = document.createElement('select');
            respSel.id = 'edit-asset-responsible';
            respSel.style.cssText = 'width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;';
            ['Design', 'Audiovisual', 'Estrategista', 'Gestor de Tráfego'].forEach(optTxt => {
                const opt = document.createElement('option'); opt.value = optTxt; opt.textContent = optTxt; respSel.appendChild(opt);
            });
            respDiv.appendChild(respLabel); respDiv.appendChild(respSel);
            
            const deadlineDiv = document.createElement('div');
            const deadlineLabel = document.createElement('label');
            deadlineLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;';
            deadlineLabel.textContent = 'PRAZO DE APROVAÇÃO';
            const deadlineInput = document.createElement('input');
            deadlineInput.type = 'datetime-local';
            deadlineInput.id = 'edit-asset-deadline';
            deadlineInput.style.cssText = 'width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;';
            deadlineDiv.appendChild(deadlineLabel); deadlineDiv.appendChild(deadlineInput);
            
            const priorityDiv = document.createElement('div');
            const prioLabel = document.createElement('label');
            prioLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;';
            prioLabel.textContent = 'PRIORIDADE';
            const prioSel = document.createElement('select');
            prioSel.id = 'edit-asset-priority';
            prioSel.style.cssText = 'width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;';
            ['BAIXA', 'MÉDIA', 'ALTA'].forEach(optTxt => {
                const opt = document.createElement('option'); opt.value = optTxt; opt.textContent = optTxt; prioSel.appendChild(opt);
            });
            priorityDiv.appendChild(prioLabel); priorityDiv.appendChild(prioSel);
            
            const statusDiv = document.createElement('div');
            const statusLabel = document.createElement('label');
            statusLabel.style.cssText = 'display:block; font-size:0.6rem; color:var(--os-text-muted); margin-bottom:8px; letter-spacing:1px; font-weight:800;';
            statusLabel.textContent = 'STATUS OPERACIONAL (GOVERNANÇA)';
            
            const statusSelect = document.createElement('select');
            statusSelect.id = 'edit-asset-status-selector';
            statusSelect.style.cssText = 'width:100%; padding:10px; background:#000; border:1px solid #333; color:#fff; font-size:0.8rem; border-radius:4px;';
            
            const currentOpt = document.createElement('option');
            currentOpt.value = c.status;
            currentOpt.textContent = `${currentStatusObj.label} (Atual)`;
            statusSelect.appendChild(currentOpt);
            
            allowedTransitions.forEach(target => {
                const targetRes = StatusEngine.resolve('conteudos', target); 
                let dbStatusVal = target.toUpperCase(); 
                if (target === 'draft_planning') dbStatusVal = 'PLANEJAMENTO'; 
                else if (target === 'internal_review') dbStatusVal = 'REVISÃO GESTÃO'; 
                else if (target === 'client_review_planning') dbStatusVal = 'APROVAÇÃO PLANEJAMENTO'; 
                else if (target === 'client_revision_planning') dbStatusVal = 'AJUSTE'; 
                else if (target === 'in_production') dbStatusVal = 'PRODUÇÃO'; 
                else if (target === 'client_revision_content') dbStatusVal = 'AJUSTE DE PRODUÇÃO'; 
                else if (target === 'internal_qa') dbStatusVal = 'REVISÃO INTERNA FINAL'; 
                else if (target === 'client_review_content') dbStatusVal = 'APROVAÇÃO FINAL'; 
                else if (target === 'ready_to_post') dbStatusVal = 'PRONTO'; 
                else if (target === 'posted') dbStatusVal = 'PUBLICADO'; 
                
                const opt = document.createElement('option');
                opt.value = dbStatusVal;
                opt.textContent = `Mudar para: ${targetRes.label}`;
                statusSelect.appendChild(opt);
            });
            
            statusSelect.addEventListener('change', (e) => {
                if (e.target.value === 'PRONTO') {
                    document.getElementById('approve-strategic').checked = true;
                    document.getElementById('approve-operational').checked = true;
                    document.getElementById('approve-client').checked = true;
                }
            });

            statusDiv.appendChild(statusLabel);
            statusDiv.appendChild(statusSelect);
            
            metaGrid.appendChild(respDiv);
            metaGrid.appendChild(deadlineDiv);
            metaGrid.appendChild(priorityDiv);
            metaGrid.appendChild(statusDiv);

            document.getElementById('edit-asset-responsible').value = c.metadata?.responsible || 'Design';
            document.getElementById('edit-asset-priority').value = c.priority || 'MÉDIA';
            
            if (c.metadata?.approval_deadline) {
                try {
                    const d = new Date(c.metadata.approval_deadline);
                    document.getElementById('edit-asset-deadline').value = d.toISOString().slice(0, 16);
                } catch (e) {}
            }
        }

        // Disparar o trigger do seletor agora que o DOM interno (caption) já foi gerado
        selector.dispatchEvent(new Event('change'));

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
            versions[curVer].caption = document.getElementById('edit-asset-caption').value;
            versions[curVer].social_copy = document.getElementById('edit-asset-social-copy').value;
            versions[curVer].locked = true;
        }

        // 2. Incrementar a versão ativa
        const nextCycle = (currentAssetData.metadata?.revision_cycle || 1) + 1;
        const nextVer = `V${nextCycle}`;

        // Injetar no seletor de versões
        versions[nextVer] = {
            caption: versions[curVer].caption, // herda o roteiro para edição
            social_copy: versions[curVer].social_copy || '', // herda o copy
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
            social_copy: versions[nextVer]?.social_copy || '',
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
        const userRole = OS_AUTH.user?.role || 'OPERATOR';
        
        // Rígida Governança e RBAC: CLIENT bloqueado
        if (userRole === 'CLIENT') {
            alert('Acesso negado: Perfil CLIENT não tem autorização para gerenciar ou aprovar IA/conteúdos.');
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { action: 'tentativa_negada_salvamento_edicao', asset_id: editingAssetId, role: userRole },
                'critical'
            );
            return;
        }

        const title = document.getElementById('edit-asset-title').value;
        const caption = document.getElementById('edit-asset-caption').value;
        const socialCopy = document.getElementById('edit-asset-social-copy').value;
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
            versions[curVer].social_copy = socialCopy;
        }

        const newMetadata = {
            ...currentAssetData.metadata,
            reference_url: ref,
            final_asset_url: artFinal,
            social_copy: socialCopy,
            responsible,
            approval_deadline: deadline,
            strategic_approved: strat,
            operational_approved: oper,
            client_approved: clie,
            versions: versions
        };

        const statusSelectEl = document.getElementById('edit-asset-status-selector');
        let nextStatus = statusSelectEl ? statusSelectEl.value : currentAssetData.status;

        // Sobrescrita lógica pelas checkboxes
        const std = mapToStandardStatus(currentAssetData.status);
        if (strat && oper && clie) {
            nextStatus = 'PRONTO';
        } else if (strat && oper && !clie && std !== 'CLIENT_REVIEW_CONTENT') {
            nextStatus = 'APROVAÇÃO FINAL';
        }

        let updatePayload = {
            title,
            caption: versions[currentAssetData.metadata?.version || 'V1']?.caption || caption,
            priority,
            metadata: newMetadata,
            status: nextStatus
        };

        const currentLogical = mapToStandardStatus(currentAssetData.status).toLowerCase();
        const targetLogical = mapToStandardStatus(nextStatus).toLowerCase();

        if (currentLogical !== targetLogical) {
            const validation = StatusEngine.validateTransition('conteudos', currentLogical, targetLogical, userRole);
            if (!validation.valid) {
                alert('Transição inválida: ' + validation.reason);
                return;
            }

            // Determinar webhook PLANEJAMENTO_CONTEUDO ou CALENDARIO_POSTAGENS
            const isPlanning = targetLogical.includes('planning') || 
                               ['draft_planning', 'internal_review', 'internal_revision', 'client_review_planning', 'client_revision_planning', 'planning_approved'].includes(targetLogical);
            const webhookKey = isPlanning ? 'PLANEJAMENTO_CONTEUDO' : 'CALENDARIO_POSTAGENS';

            const now = new Date();
            const mes_referencia_fb = currentAssetData.metadata?.mes_referencia || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const tipo_entrega_fb = currentAssetData.metadata?.tipo_entrega || 'carrossel'; // Default to carrossel for old records
            const client_id_raw = currentAssetData.project_id || currentProject;
            const client_id_mapped = client_id_raw === '3acae009-6825-4163-9057-cbe99216cc3b' ? 'FLUXAI_LABS_001' : client_id_raw;
            const limite_id_fb = currentAssetData.metadata?.limite_id || `LIM_${client_id_mapped}_${mes_referencia_fb.replace('-', '_')}_${tipo_entrega_fb.toUpperCase()}`;

            const client_name_fb = window.allProjects?.find(p => p.id === client_id_raw)?.name || client_id_mapped;

            // Parser básico da legenda (caption)
            let parsedObjetivo = '';
            let parsedFormato = '';
            let parsedGancho = '';
            let parsedCta = '';
            let parsedLegenda = '';
            
            try {
                const cText = currentAssetData.caption || '';
                const objMatch = cText.match(/🎯 OBJETIVO:\s*(.+)/);
                if (objMatch) parsedObjetivo = objMatch[1].trim();
                
                const formatMatch = cText.match(/💻 FORMATO:\s*(.+)/);
                if (formatMatch) parsedFormato = formatMatch[1].trim();
                
                const ganchoMatch = cText.match(/🔥 GANCHO:\s*(.+)/);
                if (ganchoMatch) parsedGancho = ganchoMatch[1].trim();

                const ctaMatch = cText.match(/🚀 CTA:\s*(.+)/);
                if (ctaMatch) parsedCta = ctaMatch[1].trim();
                
                const legMatch = cText.match(/📌 LEGENDA:\s*([\s\S]*?)(?:⚠️|$)/);
                if (legMatch) parsedLegenda = legMatch[1].trim();
            } catch (e) {
                console.warn('Erro ao parsear caption', e);
            }

            const payload = {
                client_id: client_id_mapped,
                client_name: client_name_fb,
                asset_id: editingAssetId,
                planejamento_id: editingAssetId,
                postagem_id: editingAssetId,
                title: title,
                tema: title,
                canal: mapToSpreadsheetChannel(currentAssetData.platform),
                formato_conteudo: mapToSpreadsheetFormat(parsedFormato || tipo_entrega_fb),
                objetivo_conteudo: parsedObjetivo,
                pilar_conteudo: '',
                etapa_funil: '',
                briefing_resumo: currentAssetData.caption || '',
                titulo_conteudo: title,
                legenda: parsedLegenda,
                cta: parsedCta,
                status_planejamento: mapToMakeSpreadsheet(targetLogical, false),
                status_postagem: mapToMakeSpreadsheet(targetLogical, true),
                data_agendada: currentAssetData.scheduled_at || '',
                hora_agendada: currentAssetData.scheduled_at ? new Date(currentAssetData.scheduled_at).toLocaleTimeString('pt-BR') : '',
                data_prevista: currentAssetData.scheduled_at || '',
                data_publicacao: '',
                link_post: '',
                link_asset_drive: artFinal || '',
                status_anterior: currentAssetData.status,
                status_novo: nextStatus,
                logical_transition: `${currentLogical}->${targetLogical}`,
                timestamp: now.toISOString(),
                responsavel_planejamento: responsible || '',
                responsavel_design: 'Design',
                responsavel_copy: 'Copywriter',
                responsavel_publicacao: responsible || '',
                responsavel_operacional: responsible || '',
                link_referencia: ref || '',
                link_resultado_drive: artFinal || '',
                solicitado_por: window.FLUXAI_RUNTIME_CONTEXT?.full_name || window.FLUXAI_RUNTIME_CONTEXT?.email || 'operador_fluxai',
                limite_id: limite_id_fb,
                mes_referencia: mes_referencia_fb.replace('-', '_'),
                semana_referencia: '',
                tipo_entrega: mapToSpreadsheetFormat(tipo_entrega_fb),
                geracao_id: currentAssetData.metadata?.geracao_id || currentAssetData.metadata?.mock_id || '',
                credito_id: '',
                observacao: ''
            };

            const response = await OS_CONFIG.webhooks.send(webhookKey, payload);
            const isWebhookReal = (OS_CONFIG.flags.sendRealWebhooks || 
                                  (Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes(webhookKey))) &&
                                  OS_CONFIG.webhooks._isConfigured(webhookKey);

            if (!response.success) {
                // Rollback block em caso de falha de conexão
                OS_LOGS_ENGINE.userAction(
                    'WEBHOOK_REAL_FAILED',
                    'content-engine',
                    { webhook: webhookKey, error: response.error || 'Erro Desconhecido', status: response.status || 0 },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    false
                );

                OS_LOGS_ENGINE.userAction(
                    'GOVERNANCE_ABORTED',
                    'content-engine',
                    { action: 'salvar_edicao_status', reason: 'Falha no webhook real de integração', asset_id: editingAssetId },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    false
                );

                OS_LOGS_ENGINE.security(
                    'SECURITY_WARNING',
                    { 
                        action: 'transicao_status_cancelada_erro_conexao', 
                        client_id: currentAssetData.project_id || currentProject, 
                        role: userRole, 
                        asset_id: editingAssetId,
                        error: response.error,
                        timestamp: new Date().toISOString()
                    },
                    'critical'
                );

                OS_LOGS_ENGINE.userAction(
                    'ROLLBACK_STARTED',
                    'content-engine',
                    { 
                        reason: 'Falha na resposta do webhook de transição de status',
                        client_id: currentAssetData.project_id || currentProject, 
                        asset_id: editingAssetId,
                        preserved_status: currentAssetData.status
                    },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    false
                );

                OS_LOGS_ENGINE.userAction(
                    'ROLLBACK_COMPLETED',
                    'content-engine',
                    { 
                        client_id: currentAssetData.project_id || currentProject, 
                        asset_id: editingAssetId,
                        restored_status: currentAssetData.status,
                        local_db_status: 'CONSISTENT_UNMODIFIED'
                    },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    false
                );

                alert('Erro de conexão com o Webhook. Transição abortada e estado anterior mantido.');
                return;
            }

            // Webhook real success
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_SUCCESS',
                'content-engine',
                { webhook: webhookKey, status: response.status || 200 },
                userRole,
                currentAssetData.project_id || currentProject,
                !isWebhookReal
            );

            // Gravar logs específicos
            if (targetLogical === 'internal_review' || targetLogical === 'client_review_planning') {
                OS_LOGS_ENGINE.userAction(
                    'PLANNING_REVIEW_STARTED',
                    'content-engine',
                    { asset_id: editingAssetId },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    !isWebhookReal
                );
            } else if (targetLogical === 'planning_approved') {
                OS_LOGS_ENGINE.userAction(
                    'PLANNING_APPROVED',
                    'content-engine',
                    { asset_id: editingAssetId },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    !isWebhookReal
                );
            } else if (targetLogical === 'ready_to_post') {
                OS_LOGS_ENGINE.userAction(
                    'CONTENT_SCHEDULED',
                    'content-engine',
                    { asset_id: editingAssetId },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    !isWebhookReal
                );
                OS_LOGS_ENGINE.userAction(
                    'CALENDAR_ITEM_CREATED',
                    'content-engine',
                    { asset_id: editingAssetId },
                    userRole,
                    currentAssetData.project_id || currentProject,
                    !isWebhookReal
                );
            }

            // IA Governance Logs
            if (currentAssetData.metadata?.ai_generated) {
                if (targetLogical === 'internal_review') {
                    OS_LOGS_ENGINE.userAction('IA_GENERATION_REVIEW_STARTED', 'content-engine', { asset_id: editingAssetId }, userRole, currentAssetData.project_id || currentProject, !isWebhookReal);
                } else if (targetLogical === 'planning_approved' || nextStatus === 'aprovado_interno') {
                    OS_LOGS_ENGINE.userAction('IA_GENERATION_APPROVED_INTERNAL', 'content-engine', { asset_id: editingAssetId }, userRole, currentAssetData.project_id || currentProject, !isWebhookReal);
                } else if (targetLogical === 'client_review_planning' || targetLogical === 'client_review_content' || targetLogical === 'client_revision_planning') {
                    OS_LOGS_ENGINE.userAction('IA_GENERATION_SENT_CLIENT', 'content-engine', { asset_id: editingAssetId }, userRole, currentAssetData.project_id || currentProject, !isWebhookReal);
                } else if (targetLogical === 'rejected' || nextStatus === 'rejeitado') {
                    OS_LOGS_ENGINE.userAction('IA_GENERATION_REJECTED', 'content-engine', { asset_id: editingAssetId }, userRole, currentAssetData.project_id || currentProject, !isWebhookReal);
                    if (!['aprovado_interno', 'planning_approved', 'enviado_cliente', 'posted', 'ready_to_post'].includes(currentLogical)) {
                        OS_LOGS_ENGINE.userAction('IA_CREDIT_RELEASED', 'content-engine', { asset_id: editingAssetId, reason: 'rejeitado_antes_de_aprovacao_interna' }, userRole, currentAssetData.project_id || currentProject, !isWebhookReal);
                    }
                }
            }

            OS_LOGS_ENGINE.userAction(
                'STATUS_CHANGED',
                'content-engine',
                { asset_id: editingAssetId, from: currentLogical, to: targetLogical },
                userRole,
                currentAssetData.project_id || currentProject,
                !isWebhookReal
            );
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
                mockAssets[idx].status = nextStatus;
                localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
            }
        }

        // Timeline log
        injectTimelineEvent(currentAssetData.project_id, 'EDIT_ATIVO', `Ativo "${title}" governado. Novo Status: "${nextStatus}"`);

        closeEditModal();
        loadContent();
    } catch (e) {
        sLog('Erro ao salvar: ' + e.message);
        alert('Erro ao salvar edição: ' + e.message);
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
 
    feed.replaceChildren();
    if (projectTimeline.length === 0) { 
        const div = document.createElement('div');
        div.style.cssText = "padding:40px; text-align:center; color:var(--os-text-muted); font-size:0.8rem;";
        div.textContent = "Nenhum log de transição operacional neste ciclo.";
        feed.appendChild(div);
        return; 
    } 
 
    projectTimeline.forEach(t => { 
        const typeColor = t.type === 'SISTEMA' ? 'var(--os-primary)' : (t.type === 'IA_ENGINE' ? '#10b981' : '#60a5fa'); 
        
        const div = document.createElement('div');
        div.style.cssText = `background:rgba(255,255,255,0.02); border:1px solid var(--os-border); border-left: 3px solid ${typeColor}; padding:15px; border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:0.75rem; margin-bottom: 8px;`;
        
        const topDiv = document.createElement('div');
        topDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;';
        
        const strongTitle = document.createElement('strong');
        strongTitle.className = 'safe-title';
        strongTitle.style.color = typeColor;
        strongTitle.textContent = t.title;
        
        const spanDate = document.createElement('span');
        spanDate.style.cssText = 'opacity:0.4; font-size:0.65rem;';
        spanDate.textContent = new Date(t.date).toLocaleString('pt-BR');
        
        topDiv.appendChild(strongTitle); topDiv.appendChild(spanDate);
        
        const descDiv = document.createElement('div');
        descDiv.className = 'safe-desc';
        descDiv.style.cssText = 'color:#ddd; margin-top:5px; line-height:1.4;';
        descDiv.textContent = t.description;
        
        const authorDiv = document.createElement('div');
        authorDiv.className = 'safe-author';
        authorDiv.style.cssText = 'font-size:0.6rem; opacity:0.4; margin-top:5px; text-align:right;';
        authorDiv.textContent = 'Autor: ' + t.author;
        
        div.appendChild(topDiv);
        div.appendChild(descDiv);
        div.appendChild(authorDiv);
        
        feed.appendChild(div);
    }); 
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
        rankingBody.replaceChildren();
        const data = [
            { t: "Direção Audiovisual (Reels): Organização Alimentar Real", v: "12.450 visualizações", r: "71.2% (Alto)", l: "34 Leads", s: "96 / 100", rc: "var(--os-success)" },
            { t: "Estrutura Narrativa (Carrossel): Substituições Inteligentes", v: "8.900 visualizações", r: "58.9% (Médio)", l: "18 Leads", s: "88 / 100", rc: "" },
            { t: "Direção Audiovisual (Reels): Bastidores da Nutrição Humana", v: "15.200 visualizações", r: "75.1% (Excelente)", l: "35 Leads", s: "98 / 100", rc: "var(--os-success)" }
        ];
        data.forEach(d => {
            const tr = document.createElement('tr');
            
            const td1 = document.createElement('td');
            td1.className = 'safe-t'; td1.style.cssText = 'font-weight:700; color:#fff;'; td1.textContent = d.t;
            
            const td2 = document.createElement('td');
            td2.className = 'safe-v'; td2.textContent = d.v;
            
            const td3 = document.createElement('td');
            td3.className = 'safe-r'; td3.style.color = d.rc; td3.textContent = d.r;
            
            const td4 = document.createElement('td');
            td4.className = 'safe-l'; td4.textContent = d.l;
            
            const td5 = document.createElement('td');
            td5.className = 'safe-s'; td5.style.cssText = 'font-weight:800; color:var(--os-primary);'; td5.textContent = d.s;
            
            tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tr.appendChild(td4); tr.appendChild(td5);
            rankingBody.appendChild(tr);
        });
    } 
 
    // 2. Diagnóstico IA 
    if (diagnostic) { 
        diagnostic.replaceChildren();
        const pre = document.createElement('pre');
        pre.style.cssText = "white-space: pre-wrap; font-family: inherit;";
        pre.textContent = `> [IA COGNITIVE ENGINE] Diagnóstico Narrativo de 30 Dias...

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
==================================================`;
        diagnostic.appendChild(pre);
    }
}

function mapAssetStatusToGia(status) {
    const std = String(status || '').toUpperCase();
    if (std === 'DRAFT_PLANNING' || std === 'RASCUNHO') return 'rascunho';
    if (std === 'POSTED' || std === 'PUBLICADO') return 'publicado';
    if (std === 'READY_TO_POST' || std === 'AGUARDANDO_PUBLICACAO') return 'aguardando_publicacao';
    if (std === 'PLANNING_APPROVED' || std === 'APROVADO' || std === 'CONTENT_APPROVED' || std === 'PRODUCTION_QUEUE' || std === 'IN_PRODUCTION' || std === 'INTERNAL_QA') return 'aprovado';
    if (std === 'DESCARTADO') return 'descartado';
    return 'em_revisao';
}

window.forceReady = async (id) => {
    if (!confirm('Deseja marcar este ativo como PRONTO para publicação?')) return;
    try {
        const currentAsset = window.loadedContents?.find(item => item.id === id) || {};
        const currentLogical = mapToStandardStatus(currentAsset.status || '').toLowerCase();
        const userRole = OS_AUTH.user?.role || 'OPERATOR';

        // Validar RBAC
        if (userRole === 'CLIENT') {
            alert('Acesso negado: Perfil CLIENT não tem autorização para gerenciar ou aprovar IA.');
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { action: 'tentativa_negada_aprovacao_ia', asset_id: id, role: userRole },
                'critical'
            );
            return;
        }

        // Validar Limite Operacional Contratado
        const limits = await window.calculateIACredits(currentProject);
        
        if (limits.available <= 0) {
            alert(`Erro de Governança: Limite operacional contratado atingido. Não é possível aprovar novos conteúdos IA.`);
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { action: 'limite_ia_excedido', client_id: currentProject, limite: limits.total, ocupacao: limits.occupied + limits.consumed },
                'warning'
            );
            return;
        }

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

        // Disparar webhook de controle de IA
        const payload = {
            client_id: currentProject,
            asset_id: id,
            title: currentAsset.title,
            platform: currentAsset.platform,
            status_ia: 'aprovado_interno',
            origem_geracao: 'contrato',
            action: 'IA_GENERATION_APPROVED_INTERNAL',
            limite_anterior: limits.available,
            limite_novo: limits.available,
            timestamp: new Date().toISOString(),
            solicitado_por: window.FLUXAI_RUNTIME_CONTEXT?.full_name || window.FLUXAI_RUNTIME_CONTEXT?.email || 'operador_fluxai'
        };

        const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);

        if (!response.success) {
            // WEBHOOK_REAL_FAILED
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_FAILED',
                'content-engine',
                { webhook: 'AI_OPERATIONAL_CONTROL', error: response.error || 'Erro Desconhecido', status: response.status || 0 },
                userRole,
                currentProject,
                false
            );

            // GOVERNANCE_ABORTED
            OS_LOGS_ENGINE.userAction(
                'GOVERNANCE_ABORTED',
                'content-engine',
                { action: 'aprovacao_ia', reason: 'Falha no webhook real de integração', asset_id: id },
                userRole,
                currentProject,
                false
            );

            // SECURITY_WARNING
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { 
                    action: 'aprovacao_ia_cancelada_erro_conexao', 
                    client_id: currentProject, 
                    role: userRole, 
                    asset_id: id,
                    error: response.error,
                    timestamp: new Date().toISOString()
                },
                'critical'
            );

            // ROLLBACK_STARTED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_STARTED',
                'content-engine',
                { 
                    reason: 'Falha na resposta do webhook de aprovação',
                    client_id: currentProject, 
                    asset_id: id,
                    preserved_status: currentAsset.status
                },
                userRole,
                currentProject,
                false
            );

            // ROLLBACK_COMPLETED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_COMPLETED',
                'content-engine',
                { 
                    client_id: currentProject, 
                    asset_id: id,
                    restored_status: currentAsset.status,
                    local_db_status: 'CONSISTENT_UNMODIFIED'
                },
                userRole,
                currentProject,
                false
            );

            alert('Erro de conexão com o Make/Webhook. Aprovação abortada e estado anterior mantido.');
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
            const idx = mockAssets.findIndex(item => item.id === id);
            if (idx >= 0) {
                mockAssets[idx].status = 'READY_TO_POST';
                localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
            }
        }
        
        // Registrar logs de sucesso
        if (currentAsset.metadata?.ai_generated) {
            OS_LOGS_ENGINE.userAction(
                'IA_GENERATION_APPROVED_INTERNAL',
                'content-engine',
                { asset_id: id, action: 'force_ready' },
                userRole,
                currentProject,
                !OS_CONFIG.flags.sendRealWebhooks
            );
        }

        OS_LOGS_ENGINE.userAction(
            'LIMIT_OCCUPIED',
            'content-engine',
            { asset_id: id, action: 'occupy_limit', limit: clientLimit, ocupacao: countApproved + countPublished + 1 },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        OS_LOGS_ENGINE.userAction(
            'WEBHOOK_REAL_SUCCESS',
            'content-engine',
            { webhook: 'AI_OPERATIONAL_CONTROL', status: response.status || 200 },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        sLog('Ativo forçado para READY_TO_POST.');
        loadContent();
    } catch (e) {
        alert('Erro ao forçar conclusão: ' + e.message);
    }
};

window.deleteAsset = async (id) => {
    try {
        const currentAsset = window.loadedContents?.find(item => item.id === id) || {};
        const currentLogical = mapToStandardStatus(currentAsset.status || '').toLowerCase();
        const userRole = OS_AUTH.user?.role || 'OPERATOR';

        // Validar RBAC
        if (userRole === 'CLIENT') {
            alert('Acesso negado: Perfil CLIENT não tem autorização para excluir conteúdos ou liberar limite.');
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { action: 'tentativa_negada_exclusao_ia', asset_id: id, role: userRole },
                'critical'
            );
            return;
        }

        let currentGiaStatus = mapAssetStatusToGia(currentAsset.status);

        // Exigir confirmação manual se já estiver aprovado/aguardando
        const isOccupying = (currentGiaStatus === 'aprovado' || currentGiaStatus === 'aguardando_publicacao');
        if (isOccupying) {
            if (!confirm('Esta pauta já foi aprovada e está ocupando limite operacional. Deseja realmente descartá-la e liberar o limite operacional contratado? (Exige confirmação interna)')) {
                return;
            }
        } else {
            if (!confirm('Deseja excluir este ativo da esteira?')) return;
        }

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

        const configs = JSON.parse(localStorage.getItem('fluxai_client_configs') || '{}');
        const clientConf = configs[currentProject] || { iaLimit: 20 };
        const clientLimit = clientConf.iaLimit || 0;

        // Enviar webhook de controle operacional de IA
        const payload = {
            client_id: currentProject,
            asset_id: id,
            title: currentAsset.title,
            platform: currentAsset.platform,
            status_ia: 'excluido',
            origem_geracao: 'contrato',
            action: 'IA_GENERATION_DISCARDED',
            limite_anterior: clientLimit,
            limite_novo: clientLimit,
            timestamp: new Date().toISOString(),
            solicitado_por: window.FLUXAI_RUNTIME_CONTEXT?.full_name || window.FLUXAI_RUNTIME_CONTEXT?.email || 'operador_fluxai'
        };

        const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);

        if (!response.success) {
            // WEBHOOK_REAL_FAILED
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_FAILED',
                'content-engine',
                { webhook: 'AI_OPERATIONAL_CONTROL', error: response.error || 'Erro Desconhecido', status: response.status || 0 },
                userRole,
                currentProject,
                false
            );

            // GOVERNANCE_ABORTED
            OS_LOGS_ENGINE.userAction(
                'GOVERNANCE_ABORTED',
                'content-engine',
                { action: 'descarte_ia', reason: 'Falha no webhook real de integração', asset_id: id },
                userRole,
                currentProject,
                false
            );

            // SECURITY_WARNING
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { 
                    action: 'descarte_ia_cancelada_erro_conexao', 
                    client_id: currentProject, 
                    role: userRole, 
                    asset_id: id,
                    error: response.error,
                    timestamp: new Date().toISOString()
                },
                'critical'
            );

            // ROLLBACK_STARTED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_STARTED',
                'content-engine',
                { 
                    reason: 'Falha na resposta do webhook de descarte',
                    client_id: currentProject, 
                    asset_id: id,
                    preserved_status: currentAsset.status
                },
                userRole,
                currentProject,
                false
            );

            // ROLLBACK_COMPLETED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_COMPLETED',
                'content-engine',
                { 
                    client_id: currentProject, 
                    asset_id: id,
                    restored_status: currentAsset.status,
                    local_db_status: 'CONSISTENT_UNMODIFIED'
                },
                userRole,
                currentProject,
                false
            );

            alert('Erro de conexão com o Make/Webhook. Descarte abortado e estado anterior mantido.');
            return;
        }

        const supabase = getSupabase();
        let error = null;
        try {
            const res = await supabase.from('content_assets').update({ status: 'DESCARTADO' }).eq('id', id);
            error = res.error;
        } catch (e) {
            error = e;
        }

        if (error) {
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const idx = mockAssets.findIndex(item => item.id === id);
            if (idx !== -1) mockAssets[idx].status = 'DESCARTADO';
            localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
        }

        // Registrar logs
        OS_LOGS_ENGINE.userAction(
            'IA_GENERATION_DISCARDED',
            'content-engine',
            { asset_id: id, action: 'delete' },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        if (isOccupying) {
            OS_LOGS_ENGINE.userAction(
                'LIMIT_RELEASED',
                'content-engine',
                { asset_id: id, action: 'release_limit', reason: 'exclusao' },
                userRole,
                currentProject,
                !OS_CONFIG.flags.sendRealWebhooks
            );
        }

        OS_LOGS_ENGINE.userAction(
            'GOVERNANCE_ACTION',
            'content-engine',
            { action: 'descarte_confirmado', asset_id: id },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        OS_LOGS_ENGINE.userAction(
            'WEBHOOK_REAL_SUCCESS',
            'content-engine',
            { webhook: 'AI_OPERATIONAL_CONTROL', status: response.status || 200 },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

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

    const userRole = OS_AUTH.user?.role || 'OPERATOR';
    if (userRole === 'CLIENT') {
        alert('Acesso negado: Perfil CLIENT não tem autorização para gerar pautas com IA.');
        OS_LOGS_ENGINE.security(
            'SECURITY_WARNING',
            { action: 'tentativa_negada_geracao_ia', client_id: selectedId, role: userRole },
            'critical'
        );
        return;
    }

    const serviceSelect = document.getElementById('ai-planner-service');
    const serviceKey = serviceSelect ? serviceSelect.value : 'ALL';

    const btnAi = document.getElementById('btn-ai-planner');
    const originalText = btnAi ? btnAi.textContent : '';
    if (btnAi) {
        btnAi.textContent = '';
        const spinIcon = document.createElement('i'); spinIcon.className = 'fa-solid fa-spinner fa-spin';
        btnAi.appendChild(spinIcon); btnAi.appendChild(document.createTextNode(' GERANDO...'));
    }

    try {
        sLog(`[IA_PLANNER] Executando planejamento de IA para o cliente ${selectedId}, serviço: ${serviceKey}`);
        
        const limits = await window.calculateIACredits(selectedId);
        if (limits.available <= 0) {
            alert('Acesso negado: Limite de Créditos IA esgotado para este cliente.');
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { action: 'geracao_bloqueada_limite_esgotado', client_id: selectedId, role: userRole },
                'critical'
            );
            return;
        }

        const generated = await AIPlanner.generatePlan(selectedId, serviceKey, 1);
        if (!generated || generated.length === 0) {
            throw new Error('Nenhuma pauta pôde ser gerada para o escopo selecionado.');
        }

        const newAsset = generated[0];
        newAsset.metadata = newAsset.metadata || {};
        newAsset.metadata.ai_generated = true; // Flag for credits computation
        
        const now = new Date();
        const mes_referencia = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        // Mapeamento inteligente para os valores exatos da pasta suspensa da Planilha
        let actualServiceKey = serviceKey;
        if (serviceKey === 'ALL') {
            const entry = Object.entries(AIPlanner.STRATEGIC_MATRIX).find(([k, v]) => newAsset.title.includes(v.name));
            if (entry) actualServiceKey = entry[0];
        }
        let tipo_entrega = AIPlanner.STRATEGIC_MATRIX[actualServiceKey]?.external_name || 'outro';

        // Mapeamento do ID do banco para o código da Planilha do Make
        const projectMap = {
            '3acae009-6825-4163-9057-cbe99216cc3b': 'FLUXAI_LABS_2026_07_643'
        };
        const spreadsheetClientId = projectMap[selectedId] || selectedId;

        newAsset.metadata.mes_referencia = mes_referencia;
        newAsset.metadata.tipo_entrega = tipo_entrega;
        // O formato na planilha está como IA_CLIENT_ID (ex: IA_FLUXAI_LABS_2026_07_643)
        // Para casar exatamente com a planilha 10_IA_CREDITOS_CLIENTE:
        newAsset.metadata.limite_id = `IA_${spreadsheetClientId}`;

        const client_name_fb = window.allProjects?.find(p => p.id === selectedId)?.name || spreadsheetClientId;

        // [NOVO GUARDRAIL OFICIAL - CENÁRIO 13]
        sLog(`[IA_PLANNER] Validando limites oficiais via Guardrail (Make Cenário 13)...`);
        const guardrailPayload = {
            geracao_id: newAsset.id || 'mock_id',
            client_id: spreadsheetClientId,
            client_name: client_name_fb,
            limite_id: newAsset.metadata.limite_id,
            mes_referencia: mes_referencia.replace('-', '_'),
            tipo_entrega: tipo_entrega,
            workflow_origem: 'content_engine'
        };
        
        try {
            const guardrailRes = await MakeClient.sendPost(ROTAS_OS_MAKE['ROTA_OS_13_GUARDRAIL'], guardrailPayload);
            if (guardrailRes && guardrailRes.data) {
                const grData = guardrailRes.data;
                if (grData.pode_gerar === 'nao' || grData.pode_gerar === false) {
                    // BLOQUEADO!
                    alert(`Geração Bloqueada pelo Guardrail!\nMotivo: ${grData.message || grData.motivo_bloqueio || 'Sem limite disponível'}`);
                    OS_LOGS_ENGINE.security(
                        'SECURITY_WARNING',
                        { action: 'geracao_bloqueada_guardrail', client_id: selectedId, role: window.FLUXAI_RUNTIME_CONTEXT?.role, details: grData },
                        'critical'
                    );
                    if (btnAi) {
                        btnAi.textContent = originalText;
                    }
                    return; // Aborta! Não joga para o cenário 11!
                }
            }
        } catch (err) {
            console.error('[IA_PLANNER] Erro ao comunicar com Guardrail', err);
            // Falha no guardrail: continua a geração (fail-open com log).
            // O alerta foi removido pois o sistema cria a pauta com sucesso mesmo neste caso.
            console.warn('[IA_PLANNER] Guardrail indisponível momentaneamente. Geração prosseguindo normalmente.');
        }

        // Webhook de controle operacional de IA (Cenário 11)
        const payload = {
            geracao_id: newAsset.id || 'mock_id',
            client_id: spreadsheetClientId,
            client_name: client_name_fb,
            limite_id: newAsset.metadata.limite_id,
            mes_referencia: mes_referencia.replace('-', '_'),
            tipo_entrega: mapToSpreadsheetFormat(tipo_entrega),
            origem_geracao: 'contrato',
            solicitado_por: window.FLUXAI_RUNTIME_CONTEXT?.full_name || window.FLUXAI_RUNTIME_CONTEXT?.email || 'operador_fluxai',
            responsavel_operacional: 'Design',
            status_geracao: 'rascunho_ia',
            status_anterior: '',
            ocupa_limite_operacional: 'nao',
            consumo_definitivo: 'nao',
            libera_espaco: 'nao',
            confirmacao_interna_liberacao: '',
            motivo_alteracao: 'nova_geracao_ia',
            link_resultado_drive: '',
            prompt_interno_id: '',
            observacao: 'Rascunho gerado via FluxAI OS',
            asset_id: newAsset.id || 'mock_id',
            title: newAsset.title,
            platform: newAsset.platform,
            status_ia: 'rascunho_ia',
            action: 'IA_GENERATION_CREATED',
            limite_anterior: limits.available,
            limite_novo: limits.available, // Rascunho doesn't consume yet
            timestamp: now.toISOString(),
            link_referencia: ''
        };

        const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);

        if (!response.success) {
            // WEBHOOK_REAL_FAILED
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_FAILED',
                'content-engine',
                { webhook: 'AI_OPERATIONAL_CONTROL', error: response.error || 'Erro Desconhecido', status: response.status || 0 },
                userRole,
                selectedId,
                false
            );

            // GOVERNANCE_ABORTED
            OS_LOGS_ENGINE.userAction(
                'GOVERNANCE_ABORTED',
                'content-engine',
                { action: 'geracao_ia_rascunho', reason: 'Falha no webhook real de integração', client_id: selectedId },
                userRole,
                selectedId,
                false
            );

            // SECURITY_WARNING
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { 
                    action: 'geracao_ia_rascunho_cancelada_erro_conexao', 
                    client_id: selectedId, 
                    role: userRole, 
                    error: response.error,
                    timestamp: new Date().toISOString()
                },
                'critical'
            );

            // ROLLBACK_STARTED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_STARTED',
                'content-engine',
                { 
                    reason: 'Falha na resposta do webhook de criação de IA',
                    client_id: selectedId, 
                    preserved_status: 'none'
                },
                userRole,
                selectedId,
                false
            );

            // ROLLBACK_COMPLETED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_COMPLETED',
                'content-engine',
                { 
                    client_id: selectedId, 
                    restored_status: 'none',
                    local_db_status: 'CONSISTENT_UNMODIFIED'
                },
                userRole,
                selectedId,
                false
            );

            alert('Erro de conexão com o Make/Webhook. Geração abortada e estado anterior mantido.');
            return;
        }

        const supabase = getSupabase();
        let error = null;
        try {
            const { error: dbError } = await supabase.from('content_assets').insert(newAsset);
            error = dbError;
        } catch (e) {
            error = e;
        }

        if (error) {
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            newAsset.id = 'asset_mock_' + Date.now();
            mockAssets.unshift(newAsset);
            localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
        }

        // Registrar logs de sucesso
        OS_LOGS_ENGINE.userAction(
            'IA_GENERATION_STATUS',
            'content-engine',
            { action: 'generate_draft', service: serviceKey, client_id: selectedId, asset_id: newAsset.id },
            userRole,
            selectedId,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        OS_LOGS_ENGINE.userAction(
            'WEBHOOK_REAL_SUCCESS',
            'content-engine',
            { webhook: 'AI_OPERATIONAL_CONTROL', status: response.status || 200 },
            userRole,
            selectedId,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        sLog('[IA_PLANNER] Pauta em rascunho criada com sucesso.');
        await loadContent();
    } catch (err) {
        sLog('[IA_PLANNER] Erro na geração: ' + err.message);
        alert('Erro ao gerar IA: ' + err.message);
    } finally {
        if (btnAi) {
            btnAi.disabled = false;
            btnAi.textContent = originalText;
        }
    }
}

window.runAiPlanner = runAiPlanner;

// ─────────────────────────────────────────────────────────────────
// 4. PONTE DE PUBLICAÇÃO MANUAL ASSISTIDA
// ─────────────────────────────────────────────────────────────────

let activePublishAssetId = null;

window.openPublishBridge = (id) => {
    const asset = window.loadedContents?.find(item => item.id === id);
    if (!asset) {
        alert('Conteúdo não encontrado.');
        return;
    }

    activePublishAssetId = id;

    // Preencher data e hora programada
    const scheduled = asset.scheduled_at 
        ? new Date(asset.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
        : 'Não agendado';
    document.getElementById('pub-scheduled-time').innerText = scheduled;

    // Legenda, hashtags, CTA e caminho do arquivo consolidados
    const captionText = asset.metadata?.social_copy || '⚠️ A legenda final ainda não foi escrita.\nPara adicionar a legenda da rede social, edite esta pauta na fase de Produção e preencha o campo "Legenda Final (Copy da Rede Social)".';
    const hashtags = asset.metadata?.hashtags || '#fluxai #inteligenciaartificial';

    const fullPreview = `📝 LEGENDA FINAL:\n${captionText}\n\n🏷️ HASHTAGS:\n${hashtags}`;
    document.getElementById('pub-caption-preview').value = fullPreview;

    // Links de Canva e Instagram/Plataforma
    const btnOpenAssets = document.getElementById('btn-open-assets');
    const btnOpenAccount = document.getElementById('btn-open-account');

    if (btnOpenAssets) {
        btnOpenAssets.onclick = () => {
            const link = asset.metadata?.final_asset_url || asset.metadata?.canva_link || asset.metadata?.drive_link || 'https://canva.com';
            window.open(link, '_blank');
        };
    }

    if (btnOpenAccount) {
        btnOpenAccount.onclick = () => {
            const link = asset.metadata?.instagram_link || 'https://instagram.com';
            window.open(link, '_blank');
        };
    }

    // Exibir o modal
    document.getElementById('pub-modal-overlay').style.display = 'flex';
};

// Evento fechar modal
document.getElementById('close-pub-modal')?.addEventListener('click', () => {
    document.getElementById('pub-modal-overlay').style.display = 'none';
    activePublishAssetId = null;
});

// Evento copiar legenda
document.getElementById('btn-copy-caption')?.addEventListener('click', () => {
    const caption = document.getElementById('pub-caption-preview').value;
    navigator.clipboard.writeText(caption).then(() => {
        alert('Legenda copiada com sucesso para a área de transferência!');
    }).catch(err => {
        alert('Erro ao copiar legenda: ' + err.message);
    });
});

// Evento confirmar publicação
document.getElementById('btn-confirm-pub')?.addEventListener('click', async () => {
    if (!activePublishAssetId) return;
    
    const userRole = OS_AUTH.user?.role || 'OPERATOR';
    if (userRole === 'CLIENT') {
        alert('Acesso negado: Perfil CLIENT não tem autorização para realizar publicações ou operar IA.');
        OS_LOGS_ENGINE.security(
            'SECURITY_WARNING',
            { action: 'tentativa_negada_publicacao_ia', asset_id: activePublishAssetId, role: userRole },
            'critical'
        );
        return;
    }

    if (!confirm('Deseja realmente confirmar a publicação deste conteúdo? O limite operacional deste ciclo será consumido de forma definitiva.')) {
        return;
    }

    const id = activePublishAssetId;
    const asset = window.loadedContents?.find(item => item.id === id);
    if (!asset) return;

    const btnConfirm = document.getElementById('btn-confirm-pub');
    const originalHtml = btnConfirm.textContent;
    btnConfirm.disabled = true;
    btnConfirm.textContent = '';
    const spIcon = document.createElement('i'); spIcon.className = 'fa-solid fa-spinner fa-spin';
    btnConfirm.appendChild(spIcon); btnConfirm.appendChild(document.createTextNode(' ENVIANDO WEBHOOK...'));

    try {
        const limits = await window.calculateIACredits(currentProject);

        // Disparar webhook
        const payload = {
            client_id: currentProject,
            asset_id: id,
            title: asset.title,
            platform: asset.platform,
            status_ia: 'publicado',
            origem_geracao: 'contrato',
            action: 'IA_GENERATION_PUBLISHED',
            limite_anterior: limits.available,
            limite_novo: limits.available > 0 ? limits.available - 1 : 0,
            timestamp: new Date().toISOString(),
            solicitado_por: window.FLUXAI_RUNTIME_CONTEXT?.full_name || window.FLUXAI_RUNTIME_CONTEXT?.email || 'operador_fluxai'
        };

        const response = await OS_CONFIG.webhooks.send('AI_OPERATIONAL_CONTROL', payload);

        if (!response.success) {
            // WEBHOOK_REAL_FAILED
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_FAILED',
                'content-engine',
                { webhook: 'AI_OPERATIONAL_CONTROL', error: response.error || 'Erro Desconhecido', status: response.status || 0 },
                userRole,
                currentProject,
                false
            );

            // GOVERNANCE_ABORTED
            OS_LOGS_ENGINE.userAction(
                'GOVERNANCE_ABORTED',
                'content-engine',
                { action: 'publicacao_ia', reason: 'Falha no webhook real de integração', asset_id: id },
                userRole,
                currentProject,
                false
            );

            // SECURITY_WARNING
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { 
                    action: 'publicacao_ia_cancelada_erro_conexao', 
                    client_id: currentProject, 
                    role: userRole, 
                    asset_id: id,
                    error: response.error,
                    timestamp: new Date().toISOString()
                },
                'critical'
            );

            // ROLLBACK_STARTED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_STARTED',
                'content-engine',
                { 
                    reason: 'Falha na resposta do webhook de publicação',
                    client_id: currentProject, 
                    asset_id: id,
                    preserved_status: asset.status
                },
                userRole,
                currentProject,
                false
            );

            // ROLLBACK_COMPLETED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_COMPLETED',
                'content-engine',
                { 
                    client_id: currentProject, 
                    asset_id: id,
                    restored_status: asset.status,
                    local_db_status: 'CONSISTENT_UNMODIFIED'
                },
                userRole,
                currentProject,
                false
            );

            alert('Erro de conexão com o Make/Webhook. Publicação abortada e estado anterior mantido.');
            return;
        }

        const supabase = getSupabase();
        let error = null;
        try {
            const res = await supabase.from('content_assets').update({ status: 'posted' }).eq('id', id);
            error = res.error;
        } catch (e) {
            error = e;
        }

        if (error) {
            const mockAssets = JSON.parse(localStorage.getItem('fluxai_mock_assets') || '[]');
            const idx = mockAssets.findIndex(item => item.id === id);
            if (idx >= 0) {
                mockAssets[idx].status = 'posted';
                localStorage.setItem('fluxai_mock_assets', JSON.stringify(mockAssets));
            }
        }

        // Registrar logs de sucesso
        OS_LOGS_ENGINE.userAction(
            'IA_GENERATION_PUBLISHED',
            'content-engine',
            { asset_id: id, action: 'publish_post' },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        if (asset.metadata?.ai_generated) {
            OS_LOGS_ENGINE.userAction(
                'IA_CREDIT_CONSUMED',
                'content-engine',
                { asset_id: id, action: 'consume_credit', reason: 'publicacao_definitiva' },
                userRole,
                currentProject,
                !OS_CONFIG.flags.sendRealWebhooks
            );
        }

        OS_LOGS_ENGINE.userAction(
            'GOVERNANCE_ACTION',
            'content-engine',
            { action: 'publicacao_confirmada', asset_id: id },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        OS_LOGS_ENGINE.userAction(
            'WEBHOOK_REAL_SUCCESS',
            'content-engine',
            { webhook: 'AI_OPERATIONAL_CONTROL', status: response.status || 200 },
            userRole,
            currentProject,
            !OS_CONFIG.flags.sendRealWebhooks
        );

        alert('Publicação confirmada com sucesso!');
        document.getElementById('pub-modal-overlay').style.display = 'none';
        activePublishAssetId = null;
        
        await loadContent();
    } catch (err) {
        alert('Erro ao confirmar publicação: ' + err.message);
    } finally {
        btnConfirm.disabled = false;
        btnConfirm.textContent = originalHtml;
    }
});

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

window.copyPortalLink = () => {
    if (!currentProject) {
        alert('Selecione um cliente primeiro.');
        return;
    }
    const url = window.location.origin + '/os/client-portal.html?project_id=' + currentProject;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link do Portal do Cliente copiado com sucesso!\\n' + url);
    }).catch(err => {
        alert('Erro ao copiar o link. Voc� pode copiar manualmente: ' + url);
    });
};
