import { OS_UI, OS_AUTH } from '../../js/os-core.js';
import { getSupabase } from '../../services/supabase-client.js';

function screenLog(msg) {
    const logBox = document.getElementById('debug-log-box') || (() => {
        const div = document.createElement('div');
        div.id = 'debug-log-box';
        div.style = 'position:fixed; top:10px; right:10px; background:rgba(0,0,0,0.9); color:#0f0; padding:10px; font-family:monospace; font-size:10px; z-index:9999; border:1px solid #0f0; max-width:300px;';
        document.body.appendChild(div);
        return div;
    })();
    logBox.innerHTML += `<div>> ${msg}</div>`;
}

let currentProject = null;

async function init() {
    screenLog('Iniciando Init...');
    
    try {
        await loadProjects();
        screenLog('Projetos carregados.');
        await loadContent();
        screenLog('Conteúdo carregado.');

        OS_UI.renderSidebar('content-engine', 'ADMIN');
        OS_UI.renderTopbar();
        screenLog('UI Renderizada.');

        const user = await OS_AUTH.check();
        screenLog('Auth OK: ' + (user?.email || 'Nenhum'));
        
        if (!user) {
            alert('Erro: Sessão expirada. Faça login novamente.');
            return;
        }

        console.log('[DEBUG] 6. Sistema Pronto.');

        // Listeners
        document.getElementById('project-filter').onchange = (e) => {
            currentProject = e.target.value;
            loadContent();
        };

        document.getElementById('btn-ai-planner').onclick = async () => {
            await runAiPlanner();
        };

    } catch (err) {
        screenLog('ERRO CRÍTICO: ' + err.message);
        console.error('[DEBUG] ERRO CRÍTICO NO INIT:', err);
        alert('ERRO DE INICIALIZAÇÃO: ' + err.message);
    }
}

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

async function generateSampleContent(projectId, count = 12) {
    const supabase = getSupabase();
    const { data: project } = await supabase.from('projects').select('*, contracts(*)').eq('id', projectId).single();
    if (!project) return alert('Projeto não encontrado!');

    const activeSystems = project.active_systems || ['REELS', 'CARROSSEL', 'CARD', 'SITE', 'STORIES'];
    const objectives = ['AUTORIDADE', 'PERCEPÇÃO PREMIUM', 'CONVERSÃO', 'DIAGNÓSTICO', 'POSICIONAMENTO'];
    
    const samples = [];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    for (let i = 0; i < count; i++) {
        const sysKey = activeSystems[i % activeSystems.length];
        const sys = STRATEGIC_MATRIX[sysKey] || STRATEGIC_MATRIX['CARD'];
        const obj = objectives[i % objectives.length];
        
        const internalTitle = `${sys.name}: ${obj}`;
        const body = sys.generate ? sys.generate(project, obj) : `🎯 OBJETIVO: ${obj}\n[Direção Estratégica Completa para ${sys.name}]`;

        samples.push({
            project_id: projectId,
            title: internalTitle, 
            status: 'PAUTA', // Nasce como PAUTA no fluxo mestre
            priority: 'ALTA',
            platform: sys.platform,
            caption: body,
            internal_notes: 'V1',
            scheduled_at: new Date(nextMonth.getTime() + (i * 2 * 24 * 60 * 60 * 1000)).toISOString()
        });
    }

    const { error } = await supabase.from('content_assets').insert(samples);
    if (error) alert('Erro: ' + error.message);
    else {
        alert(`Planejamento Estratégico Gerado! 🚀 ${count} Ativos em V1 (Status: PAUTA).`);
        loadContent();
    }
}

async function loadProjects() {
    console.log('[DEBUG] -> Iniciando loadProjects');
    try {
        const supabase = getSupabase();
        const { data: projects, error } = await supabase.from('projects').select('id, company_name').eq('status', 'ATIVO');
        
        if (error) throw error;

        if (projects) {
            const select = document.getElementById('project-filter');
            select.innerHTML = '<option value="">Todos os Projetos</option>'; // Limpa duplicatas
            
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = p.company_name;
                select.appendChild(opt);
            });
        }
        console.log('[DEBUG] <- loadProjects Finalizado');
    } catch (e) {
        console.error('[DEBUG] Erro em loadProjects:', e);
        alert('Erro ao carregar projetos: ' + e.message);
    }
}

async function loadContent() {
    console.log('[DEBUG] -> Iniciando loadContent');
    try {
        const supabase = getSupabase();
        // Query simplificada para isolar o problema
        let query = supabase.from('content_assets').select('*');
        
        if (currentProject) {
            query = query.eq('project_id', currentProject);
        }

        const { data: contents, error } = await query.order('scheduled_at', { ascending: true });

        if (error) throw error;

        const safeContents = contents || [];
        console.log('[DEBUG] Conteúdos baixados:', safeContents.length);

        renderMetrics(safeContents);

        if (!currentProject) {
            renderMacroSummary(safeContents);
        } else {
            renderContentTable(safeContents);
        }
        console.log('[DEBUG] <- loadContent Finalizado');
    } catch (e) {
        console.error('[DEBUG] Erro em loadContent:', e);
        alert('Erro ao carregar conteúdos: ' + e.message);
    }
}

function renderMacroSummary(contents) {
    const body = document.getElementById('pipeline-table-body');
    const stats = {
        'PAUTA': 0,
        'DESIGN': 0,
        'APROVAÇÃO': 0,
        'AJUSTE': 0,
        'PRONTO': 0,
        'PUBLICADO': 0
    };

    contents.forEach(c => { if (stats[c.status] !== undefined) stats[c.status]++; });

    body.innerHTML = `
        <tr>
            <td colspan="6" style="padding: 40px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid var(--os-border); text-align: center;">
                        <div style="font-size: 0.6rem; color: var(--os-text-muted); text-transform: uppercase;">Aguardando Aprovação</div>
                        <div style="font-size: 2rem; font-weight: 800; color: var(--os-primary);">${stats['APROVAÇÃO']}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid var(--os-border); text-align: center;">
                        <div style="font-size: 0.6rem; color: var(--os-text-muted); text-transform: uppercase;">Em Produção / Design</div>
                        <div style="font-size: 2rem; font-weight: 800; color: #fff;">${stats['DESIGN'] + stats['PAUTA']}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; border: 1px solid var(--os-border); text-align: center;">
                        <div style="font-size: 0.6rem; color: var(--os-text-muted); text-transform: uppercase;">Ajustes Solicitados</div>
                        <div style="font-size: 2rem; font-weight: 800; color: var(--os-danger);">${stats['AJUSTE']}</div>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 30px; font-size: 0.8rem; opacity: 0.5;">
                    <i class="fa-solid fa-circle-info"></i> Selecione um cliente específico para ver a esteira de posts detalhada.
                </p>
            </td>
        </tr>
    `;
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
    const user = await OS_AUTH.check();
    if (user?.role !== 'ADMIN') return alert('Apenas administradores podem excluir conteúdos.');
    
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
        ready: contents.filter(c => c.status === 'PRONTO').length,
        pauta: contents.filter(c => c.status === 'PAUTA').length
    };

    // Lógica de Conformidade de Contrato (Exemplo: 12 posts)
    const contractPosts = 12; 
    const diff = metrics.total - contractPosts;
    let complianceMsg = 'CONTRATO EM DIA';
    let complianceColor = '#10b981';

    if (diff < 0) {
        complianceMsg = `FALTAM ${Math.abs(diff)} POSTS`;
        complianceColor = '#f59e0b';
    } else if (diff > 0) {
        complianceMsg = `${diff} POSTS EXTRAS`;
        complianceColor = '#a855f7';
    }

    OS_UI.renderMetric('metric-assets', { label: 'Conformidade Contrato', value: complianceMsg, trend: 'v1.0', meta: 'Escopo Mensal', color: complianceColor });
    OS_UI.renderMetric('metric-approval', { label: 'Em Aprovação', value: metrics.approval, trend: '-2', meta: 'Atenção' });
    OS_UI.renderMetric('metric-production', { label: 'Em Produção', value: metrics.production, trend: 'stable', meta: 'Designer' });
    OS_UI.renderMetric('metric-schedule', { label: 'Prontos', value: metrics.ready, trend: '+5', meta: 'Publicação' });
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
    const user = await OS_AUTH.check();
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
        return alert('Acesso negado. Apenas a Diretoria ou Social Media podem gerar planejamentos.');
    }

    const filter = document.getElementById('project-filter');
    const selectedId = filter.value || currentProject;
    if (!selectedId) return alert('Selecione um projeto primeiro!');

    const supabase = getSupabase();
    
    // Contar TODOS os conteúdos existentes do projeto
    const { count: totalExisting } = await supabase.from('content_assets')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', selectedId);

    const contractLimit = 12;
    const needed = contractLimit - (totalExisting || 0);

    if (needed <= 0) {
        return alert(`Contrato Completo! Este cliente já possui ${totalExisting} conteúdos. \n\nExclua algum conteúdo se desejar gerar uma nova ideia para este lugar.`);
    }

    if (!confirm(`O cliente possui ${totalExisting} conteúdos. \n\nDeseja gerar ${needed} novos posts para completar o contrato de 12 posts mensais?`)) return;

    currentProject = selectedId;
    await generateSampleContent(selectedId, needed);
};

window.openNewContentEditor = () => {
    alert('Abrindo editor de pauta estrategica...');
};

window.openWorkspace = () => {
    const filter = document.getElementById('project-filter');
    const selectedId = filter.value || currentProject;
    
    if (!selectedId) return alert('Selecione um projeto primeiro para ver o calendário!');
    
    currentProject = selectedId;
    const cacheBuster = new Date().getTime();
    window.open(`/os/planejamento-estrategico.html?project=${selectedId}&cache=${cacheBuster}`, '_blank');
};

init();
