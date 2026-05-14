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

export async function initEngine() {
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
    const dashboard = document.querySelector('main');
    const projectFilter = document.getElementById('project-filter');
    
    if (!currentProject) {
        if (dashboard) {
            let placeholder = document.getElementById('project-placeholder');
            if (!placeholder) {
                placeholder = document.createElement('div');
                placeholder.id = 'project-placeholder';
                placeholder.innerHTML = `
                    <div style="text-align:center; padding:60px; background:rgba(255,255,255,0.01); border:1px dashed #222; border-radius:12px; margin-top:20px;">
                        <i class="fa-solid fa-hand-pointer" style="font-size:2rem; color:var(--os-primary); margin-bottom:15px; opacity:0.3;"></i>
                        <h2 style="color:#666; font-size: 1rem;">Selecione um Projeto</h2>
                        <p style="color:var(--os-text-muted); font-size: 0.7rem;">Escolha um cliente no menu superior para visualizar os ativos.</p>
                    </div>
                `;
                dashboard.appendChild(placeholder);
            }
            
            // NÃO ocultar métricas e abas, apenas zerar dados
            const sections = dashboard.querySelectorAll('.os-metric-grid, .os-tabs');
            sections.forEach(s => s.style.display = 'flex');
            placeholder.style.display = 'block';

            renderMetrics([]);
            renderContentTable([]);
            return;
        }
    }

    // Se tem projeto, mostrar tudo
    const placeholder = document.getElementById('project-placeholder');
    if (placeholder) placeholder.style.display = 'none';
    
    const copyBtn = document.getElementById('btn-copy-portal');
    if (copyBtn) copyBtn.style.display = 'flex';
    
    const sendBtn = document.getElementById('btn-send-approval');
    if (sendBtn) sendBtn.style.display = 'flex';

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

    body.innerHTML = contents.map(c => {
        const scheduled = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Escala Pendente';
        const isAwaitingApproval = c.status === 'APROVAÇÃO' || c.status === 'PAUTA';
        const revCount = c.metadata?.adjustment_count || 0;
        const versionLabel = revCount > 0 ? `R${revCount + 1}` : 'V1';

        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-weight: 700; color: #fff;">${c.title}</div>
                        <span style="font-size: 0.55rem; background: ${revCount > 0 ? 'var(--os-danger)' : '#333'}; color: #fff; padding: 2px 6px; border-radius: 2px; font-weight: 800;">${versionLabel}</span>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--os-primary); font-weight: 800; margin-top: 2px;">
                        <i class="fa-solid fa-calendar-day" style="font-size: 0.6rem; margin-right: 4px;"></i> ${scheduled}
                    </div>
                </td>
                <td><span class="status-badge" style="background:${getStatusBg(c.status)}; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.6rem; font-weight: 800;">${c.status}</span></td>
                <td style="font-size: 0.7rem; font-weight: 800; color: ${c.priority === 'ALTA' ? 'var(--os-danger)' : 'var(--os-text-muted)'};">${c.priority}</td>
                <td style="font-size: 0.75rem; font-weight: 600;">${c.platform}</td>
                <td>
                    <div style="display:flex; gap:4px;">
                        <div style="width:8px; height:8px; border-radius:50%; background:${isAwaitingApproval ? '#f59e0b' : '#10b981'};"></div>
                        <div style="width:8px; height:8px; border-radius:50%; background:#444;"></div>
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        ${c.status === 'PRONTO' ? `
                            <button class="btn-mini" title="Ponte de Publicação" onclick="window.openPublishBridge('${c.id}')" style="background: var(--os-primary); color: #000; border: none;">
                                <i class="fa-solid fa-rocket"></i>
                            </button>
                        ` : ''}
                        ${c.metadata?.final_asset_url ? `
                            <a href="${c.metadata.final_asset_url}" target="_blank" class="btn-mini" title="Ver Arte Final" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa; border-color: #8b5cf6;">
                                <i class="fa-solid fa-file-image"></i>
                            </a>
                        ` : ''}
                        ${c.metadata?.reference_url ? `
                            <a href="${c.metadata.reference_url}" target="_blank" class="btn-mini" title="Ver Referência (Produção)" style="background: rgba(255,255,255,0.05); color: var(--os-primary);">
                                <i class="fa-solid fa-link"></i>
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
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
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
            if (isStrategic && !['PAUTA', 'APROVAÇÃO', 'AJUSTE', 'PRODUÇÃO'].includes(c.status)) return '';
            if (!isStrategic && !['PRODUÇÃO', 'PRONTO', 'PUBLICADO'].includes(c.status)) return '';

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
    if (status === 'PAUTA') return '#6366f1'; // Azul
    if (status === 'APROVAÇÃO') return '#f59e0b'; // Laranja
    if (status === 'AJUSTE') return '#ef4444'; // Vermelho
    if (status === 'PRODUÇÃO') return '#06b6d4'; // Ciano
    if (status === 'VALIDAÇÃO') return '#8b5cf6'; // Roxo (Nova Etapa)
    if (status === 'PRONTO') return '#10b981'; // Verde
    if (status === 'PUBLICADO') return '#059669'; // Verde Escuro
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

    try {
        const title = document.getElementById('edit-asset-title').value;
        const caption = document.getElementById('edit-asset-caption').value;
        const ref = document.getElementById('edit-asset-ref').value;
        const artFinal = document.getElementById('edit-asset-art-final')?.value;

        const supabase = getSupabase();
        const { data: currentAsset } = await supabase.from('content_assets').select('status, metadata').eq('id', editingAssetId).single();
        
        const newMetadata = currentAsset.metadata || {};
        newMetadata.reference_url = ref;
        newMetadata.final_asset_url = artFinal;

        let updatePayload = {
            title,
            caption,
            metadata: newMetadata
        };

        // LÓGICA DE TRANSIÇÃO DE STATUS
        if (currentAsset.status === 'AJUSTE') {
            updatePayload.status = 'PAUTA';
        } else if (currentAsset.status === 'PRODUÇÃO' && artFinal) {
            // Se o designer colocou a arte final, move para validação do cliente
            if (confirm('Link de Arte Final detectado. Enviar este ativo para VALIDAÇÃO FINAL do cliente?')) {
                updatePayload.status = 'VALIDAÇÃO';
            }
        }

        const { error } = await supabase.from('content_assets').update(updatePayload).eq('id', editingAssetId);
        if (error) throw error;

        sLog('Ativo Sincronizado.');
        closeEditModal();
        loadContent();
    } catch (e) {
        alert('Erro ao salvar: ' + e.message);
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
        .in('status', ['PAUTA', 'AJUSTE']);

    if (!pendentes || pendentes.length === 0) {
        return alert('Nenhuma pauta pendente para enviar.');
    }

    if (confirm(`Enviar ${pendentes.length} pautas para aprovação do cliente?`)) {
        const { error } = await supabase.from('content_assets')
            .update({ status: 'APROVAÇÃO' })
            .eq('project_id', currentProject)
            .in('status', ['PAUTA', 'AJUSTE']);

        if (error) alert('Erro: ' + error.message);
        else {
            sLog('Pautas enviadas para aprovação.');
            loadContent();
            alert('Sucesso! As pautas agora estão visíveis para o cliente no portal.');
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
        const serviceType = document.getElementById('ai-planner-service')?.value || 'ALL';
        const { AIPlanner } = await import('../../services/ai-planner.js');
        const contents = await AIPlanner.generatePlan(selectedId, serviceType);
        
        const toInsert = contents.slice(0, remaining);

        if (confirm(`Gerar Planejamento (${toInsert.length} ativos - Tipo: ${serviceType})?`)) {
            const { error } = await supabase.from('content_assets').insert(toInsert);
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

initEngine();
