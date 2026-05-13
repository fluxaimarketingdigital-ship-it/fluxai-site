import { OS_UI, OS_AUTH } from '/os/js/os-core.js';
import { getSupabase } from '/os/services/supabase-client.js';

let currentProject = null;

async function init() {
    console.log('[CONTENT ENGINE] Iniciando sistema...');
    
    try {
        // 1. Forçar UI Imediata (para o menu não sumir)
        OS_UI.renderSidebar('content-engine', 'ADMIN'); // Default para admin para garantir
        OS_UI.renderTopbar();
        console.log('[CONTENT ENGINE] UI Renderizada.');

        // 2. Verificar Autenticação
        const user = await OS_AUTH.check();
        if (!user) {
            console.error('[CONTENT ENGINE] Usuário não autenticado.');
            return;
        }

        // 3. Carregar Dados
        await loadProjects();
        await loadContent();
        console.log('[CONTENT ENGINE] Dados carregados com sucesso.');

        // 4. Listeners
        document.getElementById('project-filter').addEventListener('change', (e) => {
            currentProject = e.target.value;
            loadContent();
        });

        document.getElementById('btn-ai-planner').onclick = async () => {
            if (!currentProject) return alert('Selecione um projeto primeiro!');
            await generateSampleContent(currentProject);
        };
        document.getElementById('btn-new-content').onclick = () => alert('Abrindo editor de pauta...');

    } catch (err) {
        console.error('[CONTENT ENGINE] Erro crítico no INIT:', err);
    }
}

async function generateSampleContent(projectId) {
    const briefing = prompt("O que o cliente quer abordar este mês? (Ex: Promoção de Maio, Inauguração, Dicas de Nutrição)");
    if (!briefing) return;

    const supabase = getSupabase();
    console.log('[DEBUG] Gerando Planejamento Mensal Estratégico para:', projectId);

    const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', projectId).single();
    if (!project) return alert('Projeto não encontrado!');

    const postsPerMonth = 12; // Padrão High-Ticket
    const samples = [];
    
    // Calcular Início do Próximo Mês
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    for (let i = 0; i < postsPerMonth; i++) {
        const scheduledDate = new Date(nextMonth);
        scheduledDate.setDate(nextMonth.getDate() + (i * 2.5)); // Distribuir no mês
        scheduledDate.setHours(18, 0, 0);

        samples.push({
            project_id: projectId,
            title: `[ESTRATÉGIA] ${briefing} #${i+1}`,
            status: 'PAUTA',
            priority: 'MÉDIA',
            platform: i % 3 === 0 ? 'REELS' : 'INSTAGRAM',
            caption: `Baseado no briefing: ${briefing}. \n\nDesenvolver narrativa de autoridade focada em conversão.`,
            scheduled_at: scheduledDate.toISOString(),
            media_url: null // Sem imagem na fase de pauta
        });
    }

    const { error } = await supabase.from('content_assets').insert(samples);
    if (error) alert('Erro ao gerar: ' + error.message);
    else {
        alert(`Planejamento Mensal para o PRÓXIMO MÊS Gerado! 🚀 Enviar para o cliente até o dia 28.`);
        loadContent();
    }
}

async function loadProjects() {
    const supabase = getSupabase();
    const { data: projects } = await supabase.from('projects').select('id, company_name').eq('status', 'ATIVO');
    
    if (projects) {
        const select = document.getElementById('project-filter');
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = p.company_name;
            select.appendChild(opt);
        });
    }
}

async function loadContent() {
    const supabase = getSupabase();
    let query = supabase.from('content_assets').select('*, projects(company_name, links)');
    
    if (currentProject) {
        query = query.eq('project_id', currentProject);
    }

    const { data: contents, error } = await query.order('scheduled_at', { ascending: true });

    if (error) {
        console.error('Erro ao carregar conteúdos:', error);
        return;
    }

    renderContentTable(contents);
    renderMetrics(contents);
}

function renderContentTable(contents) {
    const body = document.getElementById('pipeline-table-body');
    
    if (!contents || contents.length === 0) {
        body.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px;">Nenhum conteúdo encontrado para este filtro.</td></tr>`;
        return;
    }

    body.innerHTML = contents.map(c => {
        const dateStr = c.scheduled_at ? new Date(c.scheduled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '---';
        
        return `
        <tr>
            <td>
                <div style="font-weight: 700;">${c.title}</div>
                <div style="font-size: 0.7rem; color: var(--os-text-muted);">${c.projects?.company_name || 'N/A'}</div>
                ${c.status === 'AJUSTE' ? `
                    <div style="margin-top:8px; padding:10px; background:rgba(255,68,68,0.1); border-left:3px solid #ff4444; border-radius:4px; font-size:0.8rem; color:#ffbaba;">
                        <i class="fa-solid fa-comment-dots"></i> <strong>FEEDBACK CLIENTE:</strong> ${c.internal_notes || 'Verificar observações.'}
                    </div>
                ` : ''}
            </td>
            <td>
                <select class="os-select status-dropdown" onchange="window.updateStatus('${c.id}', this.value)" style="font-size:0.7rem; padding:4px 8px; border-color:${getStatusColor(c.status)}">
                    ${['PAUTA', 'DESIGN', 'REVISÃO', 'APROVAÇÃO', 'AJUSTE', 'PRONTO', 'PUBLICADO'].map(s => 
                        `<option value="${s}" ${c.status === s ? 'selected' : ''}>${s}</option>`
                    ).join('')}
                </select>
            </td>
            <td><span class="os-priority-${c.priority.toLowerCase()}">${c.priority}</span></td>
            <td><i class="fa-brands fa-${c.platform.toLowerCase()}"></i> ${c.platform}</td>
            <td style="font-family:'JetBrains Mono'; font-size:0.75rem; color:var(--os-primary)">${dateStr}</td>
            <td>
                ${c.status === 'APROVAÇÃO' || c.status === 'AJUSTE' ? `
                    <button class="btn-mini" style="background:#6b7a45; color:white" title="Gerar Link de Aprovação" onclick="window.generateApprovalLink('${c.id}')">
                        <i class="fa-solid fa-link"></i> LINK
                    </button>
                ` : `<span style="font-size: 0.7rem; opacity: 0.5;">${c.status === 'PRONTO' ? '✔ APROVADO' : '---'}</span>`}
            </td>
            <td>
                <div class="action-btns" style="display:flex; gap:5px;">
                    <button class="btn-mini" onclick="window.editAsset('${c.id}')" title="Editar Curadoria">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-mini" onclick="window.openPublicationBridge('${c.id}')" title="Publicar">
                        <i class="fa-solid fa-rocket"></i>
                    </button>
                    <button class="btn-mini" onclick="window.deleteAsset('${c.id}')" title="Excluir" style="border-color:#ff4444; color:#ff4444;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `}).join('');
}

window.editAsset = async (id) => {
    const supabase = getSupabase();
    const { data: c } = await supabase.from('content_assets').select('*').eq('id', id).single();
    
    if (c) {
        const newTitle = prompt("Título do Post:", c.title);
        const newCaption = prompt("Legenda / Estratégia:", c.caption);
        if (newTitle === null) return;

        await supabase.from('content_assets').update({ 
            title: newTitle, 
            caption: newCaption 
        }).eq('id', id);
        loadContent();
    }
};

function getStatusColor(status) {
    const colors = {
        'PAUTA': '#666',
        'DESIGN': '#3b82f6',
        'REVISÃO': '#f59e0b',
        'APROVAÇÃO': '#a855f7',
        'AJUSTE': '#ff4444',
        'PRONTO': '#10b981',
        'PUBLICADO': '#000'
    };
    return colors[status] || '#666';
}

window.updateStatus = async (id, newStatus) => {
    const supabase = getSupabase();
    const { error } = await supabase.from('content_assets').update({ status: newStatus }).eq('id', id);
    if (error) alert('Erro ao atualizar: ' + error.message);
    else {
        init(); // Recarrega tudo
    }
};

window.deleteAsset = async (id) => {
    if (!confirm('Deseja excluir este conteúdo permanentemente?')) return;
    const supabase = getSupabase();
    await supabase.from('content_assets').delete().eq('id', id);
    init();
};

function renderMetrics(contents) {
    const metrics = {
        total: contents.length,
        approval: contents.filter(c => c.status === 'APROVAÇÃO').length,
        production: contents.filter(c => c.status === 'PRODUÇÃO').length,
        ready: contents.filter(c => c.status === 'PRONTO').length
    };

    OS_UI.renderMetric('metric-assets', { label: 'Ativos Totais', value: metrics.total, trend: '+12%', meta: 'este mês' });
    OS_UI.renderMetric('metric-approval', { label: 'Em Aprovação', value: metrics.approval, trend: '-2', meta: 'crítico' });
    OS_UI.renderMetric('metric-production', { label: 'Em Produção', value: metrics.production, trend: 'stable', meta: 'equipe' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos / Agendados', value: metrics.ready, trend: '+5', meta: 'workflow' });
}

// JANELA DE PUBLICAÇÃO
window.openPublicationBridge = async (id) => {
    const supabase = getSupabase();
    const { data: c } = await supabase.from('content_assets').select('*, projects(*)').eq('id', id).single();
    
    if (c) {
        document.getElementById('pub-caption-preview').value = c.caption || '';
        document.getElementById('pub-modal-overlay').style.display = 'flex';
        
        // Configurar botões da ponte
        document.getElementById('btn-copy-caption').onclick = () => {
            navigator.clipboard.writeText(c.caption);
            alert('Legenda copiada!');
        };

        document.getElementById('btn-open-account').onclick = () => window.open(c.projects.links.social, '_blank');
        document.getElementById('btn-open-assets').onclick = () => window.open(c.projects.links.assets, '_blank');
        
        document.getElementById('btn-confirm-pub').onclick = async () => {
            await supabase.from('content_assets').update({ status: 'PUBLICADO' }).eq('id', id);
            document.getElementById('pub-modal-overlay').style.display = 'none';
            loadContent();
        };
    }
};

window.generateApprovalLink = (id) => {
    const token = btoa(id + Date.now()).substring(0, 12); // Token simples para MVP
    const link = `${window.location.origin}/os/approval.html?id=${id}&token=${token}`;
    navigator.clipboard.writeText(link);
    alert('Link de aprovação gerado e copiado para o clipboard!\n\nEnvie para o cliente pelo WhatsApp.');
};

document.getElementById('close-pub-modal').onclick = () => {
    document.getElementById('pub-modal-overlay').style.display = 'none';
};

window.runAiPlanner = async () => {
    if (!currentProject) return alert('Selecione um projeto primeiro!');
    await generateSampleContent(currentProject);
};

window.openNewContentEditor = () => {
    alert('Abrindo editor de pauta estrategica...');
};

window.openWorkspace = () => {
    if (!currentProject) return alert('Selecione um projeto primeiro para ver o calendário!');
    window.open(`/os/workspace.html?project=${currentProject}`, '_blank');
};

init();
