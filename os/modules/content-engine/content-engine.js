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
    const supabase = getSupabase();
    console.log('[DEBUG] Gerando conteúdo de teste para:', projectId);

    const samples = [
        {
            project_id: projectId,
            title: 'Post 01: Nutrição Real vs Fake',
            status: 'APROVAÇÃO',
            priority: 'ALTA',
            platform: 'INSTAGRAM',
            caption: 'Chega de perfeccionismo artificial! 🍎 No perfil da Maria, a gente foca na vida real. \n\n#NutriçãoHumanizada #BrandingInteligente',
            media_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'
        },
        {
            project_id: projectId,
            title: 'Reels: Bastidores do Consultório',
            status: 'PRODUÇÃO',
            priority: 'MÉDIA',
            platform: 'REELS',
            caption: 'Um dia na vida de uma nutricionista que entende a sua rotina. 🩺✨',
            media_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800'
        }
    ];

    const { error } = await supabase.from('content_assets').insert(samples);
    if (error) alert('Erro ao gerar: ' + error.message);
    else {
        alert('Planejamento IA Gerado! 🚀 2 novos conteúdos adicionados.');
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

    const { data: contents, error } = await query.order('created_at', { ascending: false });

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
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px;">Nenhum conteúdo encontrado para este filtro.</td></tr>`;
        return;
    }

    body.innerHTML = contents.map(c => `
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
            <td>
                ${c.status === 'APROVAÇÃO' || c.status === 'AJUSTE' ? `
                    <button class="btn-mini" style="background:#6b7a45; color:white" title="Gerar Link de Aprovação" onclick="window.generateApprovalLink('${c.id}')">
                        <i class="fa-solid fa-link"></i> LINK
                    </button>
                ` : `<span style="font-size: 0.7rem; opacity: 0.5;">${c.status === 'PRONTO' ? '✔ APROVADO' : '---'}</span>`}
            </td>
            <td>
                <div class="action-btns" style="display:flex; gap:5px;">
                    <button class="btn-mini" onclick="window.openPublicationBridge('${c.id}')" title="Publicar">
                        <i class="fa-solid fa-rocket"></i>
                    </button>
                    <button class="btn-mini" onclick="window.deleteAsset('${c.id}')" title="Excluir" style="border-color:#ff4444; color:#ff4444;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

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

init();
