import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

let currentProject = null;

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
⏱️ TEMPO ESTIMADO: 60 segundos
📅 DATA SUGERIDA: Terça • 19h

🪝 HOOK (GANCHO): "A maioria das pessoas não perde o controle por falta de disciplina alimentar."
⏸️ PAUSA: [Silêncio de 2s] "Elas perdem porque vivem alternando entre restrição extrema e culpa."
📝 DESENVOLVIMENTO: Explicar como o cérebro reage ao radicalismo. Citar comportamento alimentar e saciedade.
👁️ DIREÇÃO DE CENA: Ambiente clínico/minimalista. Iluminação natural. Olhar direto para a lente. 
🎬 RITMO: Dinâmico, com cortes secos em frases de impacto.
🖼️ APOIO VISUAL: Inserir texto: "Restrição extrema gera descontrole."
✨ CTA: "Nutrição eficiente precisa funcionar na vida real."
📝 LEGENDA: [IA gerando narrativa de autoridade clínica para ${p.company_name}...]
        `
    },
    'CARROSSEL': { 
        name: 'Estrutura Narrativa de Carrossel', 
        clientPrefix: 'CARROSSEL', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
🎯 OBJETIVO: ${obj}
🎬 FORMATO: Carrossel (1080x1350)
📅 DATA SUGERIDA: Quinta • 18h

🖼️ ESTRUTURA NARRATIVA (Slide a Slide):
- Slide 01: [Hook/Tensão] "Você provavelmente está dificultando sua alimentação sem perceber."
- Slide 02: [Conceito] Explicar o perigo do excesso de radicalismo.
- Slide 03: [Quebra de Objeção] Por que "comer pouco" nem sempre emagrece.
- Slide 04: [Aprofundamento] A lógica da constância vs. intensidade.
- Slide 05: [Metodologia] Como a FluxAI e ${p.company_name} resolvem isso.
- Slide 06: [CTA] Direcionamento para Conversa Estratégica.
📝 LEGENDA: Narrativa focada em retenção e autoridade técnica.
        `
    },
    'CARD': { 
        name: 'Direção Estratégica Visual', 
        clientPrefix: 'POST', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
🎯 OBJETIVO: ${obj}
💡 HEADLINE: "Consistência vale mais que perfeição."
🎨 CONCEITO VISUAL: Ambiente clean e humano. Silêncio visual.
📐 HIERARQUIA: Foco total na autoridade da frase central.
✨ CTA: Estratégia alimentar sustentável.
        `
    },
    'SITE': { 
        name: 'Arquitetura Estratégica Digital', 
        clientPrefix: 'SITE', 
        platform: 'WEB',
        generate: (p, obj) => `
🎯 OBJETIVO: Autoridade e Conversão
🌐 ARQUITETURA UX: Foco em Jornada de Confiança

🏗️ SEÇÕES ESTRATÉGICAS:
- HOME: Headline de impacto + Problema Crítico.
- SEÇÃO 01: Diagnóstico de Mercado e Diferenciais de ${p.company_name}.
- SEÇÃO 02: Estrutura Institucional e Atendimento.
- SEÇÃO 03: Provas Sociais e Resultados Auditados.
- CTA: Arquitetura de conversão direta para agendamento.
🚀 SEO: Estruturação de palavras-chave para descoberta orgânica.
        `
    },
    'STORIES': { 
        name: 'Fluxo Estratégico de Stories', 
        clientPrefix: 'STORIES', 
        platform: 'INSTAGRAM',
        generate: (p, obj) => `
🎯 SEQUÊNCIA DE RETENÇÃO (5 Stories):
- S01: Enquete provocativa sobre dor comum do ICP.
- S02: Exposição técnica de um erro recorrente.
- S03: Quebra de crença limitante.
- S04: Bastidor operacional ou Prova de Valor.
- S05: CTA com Caixa de Perguntas ou Link Direto.
        `
    },
    'BRANDING': { 
        name: 'Arquitetura de Posicionamento', 
        clientPrefix: 'BRANDING', 
        platform: 'BRAND',
        generate: (p, obj) => `
💎 PERCEPÇÃO DESEJADA: Autoridade de Elite e Confiança Técnica.
📝 NARRATIVA: Posicionar ${p.company_name} como a solução para quem busca performance real.
🎨 COMPORTAMENTO VISUAL: Minimalismo executivo. Uso de tipografia imponente.
        `
    },
    'TRAFEGO': { name: 'Estratégia de Aquisição', clientPrefix: 'AQUISIÇÃO', platform: 'ADS' },
    'CRM': { name: 'Estrutura de Relacionamento', clientPrefix: 'CRM', platform: 'CRM' },
    'AUTOMACAO': { name: 'Arquitetura Operacional', clientPrefix: 'AUTOMAÇÃO', platform: 'SYSTEM' },
    'CONSULTORIA': { name: 'Diagnóstico Estratégico', clientPrefix: 'DIAGNÓSTICO', platform: 'CONSULTING' }
};

export async function init() {
    sLog('Iniciando Motor de Conteúdo...');
    try {
        await loadProjects();
        await loadContent();
        sLog('Carga Inicial: OK');

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

async function loadProjects() {
    try {
        const supabase = getSupabase();
        const { data: projects, error } = await supabase.from('projects').select('id, company_name').eq('status', 'ATIVO');
        if (error) throw error;

        const select = document.getElementById('project-filter');
        if (select && projects) {
            select.innerHTML = '<option value="">Todos os Projetos</option>';
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        sLog('Erro Projetos: ' + e.message);
    }
}

export async function init() {
    sLog('Iniciando Motor de Conteúdo v7.0...');
    try {
        // Expor funções globais para a UI
        window.switchTab = switchTab;
        
        await loadProjects();
        await loadContent();
        sLog('Carga Inicial: OK');

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
    const tabs = ['esteira', 'calendario'];
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).style.display = t === tab ? 'block' : 'none';
        const btn = document.querySelector(`.os-tab-btn[onclick*="${t}"]`);
        if (btn) btn.classList.toggle('active', t === tab);
    });
}

async function loadProjects() {
    try {
        const supabase = getSupabase();
        const { data: projects, error } = await supabase.from('projects').select('id, company_name').eq('status', 'ATIVO');
        if (error) throw error;

        const select = document.getElementById('project-filter');
        if (select && projects) {
            select.innerHTML = '<option value="">Todos os Projetos</option>';
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        sLog('Erro Projetos: ' + e.message);
    }
}

async function loadContent() {
    try {
        const supabase = getSupabase();
        let query = supabase.from('content_assets').select('*');
        if (currentProject) query = query.eq('project_id', currentProject);

        const { data: contents, error } = await query.order('scheduled_at', { ascending: true });
        if (error) throw error;

        const safeContents = contents || [];
        renderMetrics(safeContents);
        renderContentTable(safeContents);
        renderCalendar(safeContents);
        
    } catch (e) {
        sLog('Erro Conteúdo: ' + e.message);
    }
}

function renderMetrics(contents) {
    const metrics = {
        total: contents.length,
        approval: contents.filter(c => c.status === 'APROVAÇÃO' || c.status === 'PAUTA').length,
        production: contents.filter(c => c.status === 'PRODUÇÃO' || c.status === 'DESIGN').length,
        ready: contents.filter(c => c.status === 'PRONTO').length
    };

    OS_UI.renderMetric('metric-assets', { label: 'Ativos Totais', value: metrics.total, trend: 'v1.0', meta: 'Escopo' });
    OS_UI.renderMetric('metric-approval', { label: 'Em Aprovação', value: metrics.approval, trend: '!', meta: 'Atenção' });
    OS_UI.renderMetric('metric-production', { label: 'Em Produção', value: metrics.production, trend: 'stable', meta: 'Designer' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos', value: metrics.ready, trend: '✔', meta: 'Publicação' });
}

function renderContentTable(contents) {
    const body = document.getElementById('pipeline-table-body');
    if (!contents || contents.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px;">Nenhum conteúdo.</td></tr>`;
        return;
    }

    body.innerHTML = contents.map(c => `
        <tr onclick="window.openApproval('${c.id}')" style="cursor:pointer;">
            <td>
                <div style="font-weight: 700;">${c.title}</div>
                <div style="font-size: 0.7rem; color: var(--os-text-muted);">${c.internal_notes || 'V1'}</div>
            </td>
            <td><span class="status-badge" style="background:${getStatusBg(c.status)}; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.6rem;">${c.status}</span></td>
            <td>${c.priority}</td>
            <td>${c.platform}</td>
            <td>
                <div style="display:flex; gap:4px;">
                    <div style="width:8px; height:8px; border-radius:50%; background:#10b981;"></div>
                    <div style="width:8px; height:8px; border-radius:50%; background:#444;"></div>
                </div>
            </td>
            <td>
                <button class="btn-mini" onclick="event.stopPropagation(); window.deleteAsset('${c.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderCalendar(contents) {
    const container = document.getElementById('calendar-body');
    if (!container) return;
    container.innerHTML = '';
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        container.innerHTML += `<div class="calendar-day" style="opacity:0.2;"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayContents = contents.filter(c => c.scheduled_at && c.scheduled_at.startsWith(dayStr));
        
        let eventsHtml = dayContents.map(c => `
            <div class="calendar-event" onclick="window.openApproval('${c.id}')" title="${c.title}">
                ${c.title.substring(0, 20)}...
            </div>
        `).join('');

        container.innerHTML += `
            <div class="calendar-day">
                <div class="day-number">${day}</div>
                ${eventsHtml}
            </div>
        `;
    }
}

function getStatusBg(status) {
    if (status === 'PAUTA') return '#6366f1';
    if (status === 'APROVAÇÃO') return '#f59e0b';
    if (status === 'PRONTO') return '#10b981';
    return '#444';
}

window.openApproval = (id) => {
    window.open(`/os/approval.html?id=${id}`, '_blank');
};

window.runAiPlanner = async () => {
    const user = await OS_AUTH.check();
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') return alert('Acesso negado.');

    const filter = document.getElementById('project-filter');
    const selectedId = filter.value || currentProject;
    if (!selectedId) return alert('Selecione um projeto para gerar planejamento estratégico!');

    sLog('Iniciando Motor Estratégico para Projeto: ' + selectedId);
    
    try {
        const { AIPlanner } = await import('../../services/ai-planner.js');
        const contents = await AIPlanner.generatePlan(selectedId);
        
        if (confirm(`Gerar Planejamento Estratégico (12 Ativos em PAUTA)?`)) {
            const supabase = getSupabase();
            const { error } = await supabase.from('content_assets').insert(contents);
            if (error) throw error;
            
            sLog('Planejamento Gerado com Sucesso.');
            loadContent();
        }
    } catch (err) {
        alert('Erro ao gerar plano: ' + err.message);
    }
};

window.deleteAsset = async (id) => {
    if (!confirm('Deseja excluir este ativo da esteira?')) return;
    const supabase = getSupabase();
    await supabase.from('content_assets').delete().eq('id', id);
    loadContent();
};

init();
