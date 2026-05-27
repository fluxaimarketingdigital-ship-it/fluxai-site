import { OS_UI, OS_AUTH } from '../os-core.js';
import { getSupabase } from '../../services/supabase-client.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('operations-center', user.role);
    await OS_UI.renderTopbar();

    await loadOperationsCenter();

    document.getElementById('btn-sync-operations')?.addEventListener('click', async () => { 
        const btn = document.getElementById('btn-sync-operations'); 
        const originalTextContent = [...btn.childNodes];
        btn.replaceChildren();
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-spinner fa-spin';
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Sincronizando...'));
        btn.disabled = true; 
        
        // Simular sync e recarregar 
        setTimeout(async () => { 
            await loadOperationsCenter(); 
            btn.replaceChildren(...originalTextContent); 
            btn.disabled = false; 
        }, 800); 
    });
}

function safeParseJSON(value, fallback = null) {
    if (value == null) return fallback;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return fallback;
    try {
        return JSON.parse(trimmed);
    } catch (error) {
        // console.warn('[SAFE_JSON_PARSE]', error.message);
        return fallback;
    }
}

async function loadOperationsCenter() {
    try {
        // 1. Carregar Coleções Locais
        const clientConfigs = safeParseJSON(localStorage.getItem('fluxai_client_configs'), {});
        const mockProjects = safeParseJSON(localStorage.getItem('fluxai_mock_projects'), []);
        const mockAssets = safeParseJSON(localStorage.getItem('fluxai_mock_assets'), []);
        const mockDemands = safeParseJSON(localStorage.getItem('fluxai_mock_demands'), []);
        const mockReports = safeParseJSON(localStorage.getItem('fluxai_mock_reports'), []);
        const allLogs = safeParseJSON(localStorage.getItem('fluxai_logs_all'), []);

        // 2. Carregar Aprovações do Supabase se disponível
        let pendingApprovals = [];
        const supabase = getSupabase();
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('external_approvals')
                    .select('*, projects(company_name)')
                    .eq('status', 'PENDENTE');
                if (!error && data) {
                    pendingApprovals = data;
                }
            } catch (err) {
                console.warn('[OPERATIONS CENTER] Supabase offline ou falha de conexão. Usando fallback de aprovações.');
            }
        }

        // --- CÁLCULO DE MÉTRICAS KPI ---
        // Clientes Críticos: status inativo/pausado ou iaBlocked ou automationsPaused
        let criticalClientsCount = 0;
        mockProjects.forEach(p => {
            const cfg = clientConfigs[p.id] || {};
            if (cfg.status === 'pausado' || cfg.status === 'inativo' || cfg.iaBlocked || cfg.automationsPaused) {
                criticalClientsCount++;
            }
        });

        // Fila de IA: aguardando_publicacao ou aprovado
        const iaQueueCount = mockAssets.filter(a => a.status === 'aguardando_publicacao' || a.status === 'aprovado').length;

        // Aprovações Externas Pendentes
        const approvalsCount = pendingApprovals.length;

        // Automações / Falhas de Webhook
        const criticalErrors = allLogs.filter(l => l.severity === 'critical' || l.action_type === 'WEBHOOK_REAL_FAILED');
        const automationErrorsCount = criticalErrors.length;

        // Preencher KPIs na Tela
        document.getElementById('kpi-critical-clients').innerText = criticalClientsCount;
        document.getElementById('kpi-ia-queue').innerText = iaQueueCount;
        document.getElementById('kpi-pending-approvals').innerText = approvalsCount;
        document.getElementById('kpi-automation-errors').innerText = automationErrorsCount;

        // --- RENDERIZAR TABELA 1: RISCO DOS CLIENTES ---
        const tableRiskBody = document.querySelector('#table-clients-risk tbody');
        if (tableRiskBody) {
            const activeProjects = mockProjects;
            tableRiskBody.replaceChildren();
            if (activeProjects.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="5" style="text-align:center; padding: 20px; opacity:0.5;">Nenhum cliente ativo mapeado para automação IA.</td>';
                tableRiskBody.appendChild(tr);
            } else {
                activeProjects.forEach(p => {
                    const cfg = clientConfigs[p.id] || { iaLimit: 10, iaBlocked: false, automationsPaused: false };
                    
                    let iaBadge = cfg.iaBlocked 
                        ? '<span class="os-badge os-badge-danger">Bloqueada</span>' 
                        : '<span class="os-badge os-badge-success">Liberada</span>';

                    let autoBadge = cfg.automationsPaused 
                        ? '<span class="os-badge os-badge-warning">Pausadas</span>' 
                        : '<span class="os-badge os-badge-success">Ativas</span>';

                    const clientAssets = mockAssets.filter(a => a.project_id === p.id || a.projectId === p.id);
                    const occupied = clientAssets.filter(a => ['aprovado', 'aguardando_publicacao', 'publicado'].includes(a.status)).length;
                    const limitWarning = occupied >= cfg.iaLimit ? 'color: var(--os-danger); font-weight:700;' : '';

                    let tokenStatusBadge = '<span class="os-badge os-badge-success">OK</span>';
                    if (p.tokenStatus === 'expirado') tokenStatusBadge = '<span class="os-badge os-badge-danger">Expirado</span>';
                    else if (p.tokenStatus === 'ausente') tokenStatusBadge = '<span class="os-badge os-badge-neutral">Ausente</span>';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="cell-primary safe-name"></td>
                        <td style="${limitWarning}">${occupied} / ${cfg.iaLimit}</td>
                        <td>${iaBadge}</td>
                        <td>${autoBadge}</td>
                        <td>${tokenStatusBadge}</td>
                    `;
                    tr.querySelector('.safe-name').textContent = p.company_name || p.name;
                    tableRiskBody.appendChild(tr);
                });
            }
        }

        // --- RENDERIZAR TABELA 2: BACKLOG DE CONTEÚDO & RELATÓRIOS ---
        const tableContentBody = document.querySelector('#table-content-backlog tbody');
        if (tableContentBody) {
            let html = '';
            const backlogItems = [];

            // Adicionar ativos IA pendentes
            mockAssets.filter(a => ['em_revisao', 'aprovado', 'aguardando_publicacao'].includes(a.status)).forEach(a => {
                let action = 'Revisar Conteúdo';
                if (a.status === 'aprovado') action = 'Aprovar e Agendar';
                else if (a.status === 'aguardando_publicacao') action = 'Publicar Post';

                backlogItems.push({
                    id: a.id,
                    ref: a.title || a.title_pauta || 'Conteúdo Sem Título',
                    type: 'Mesa Editorial IA',
                    status: a.status,
                    action: action,
                    link: 'content-engine.html'
                });
            });

            // Adicionar relatórios pendentes
            mockReports.filter(r => ['rascunho', 'em_revisao', 'aprovado_internamente'].includes(r.status)).forEach(r => {
                let action = 'Revisar Análise';
                if (r.status === 'aprovado_internamente') action = 'Liberar para Cliente';

                backlogItems.push({
                    id: r.id || r.clientId,
                    ref: `${r.clientId} - ${r.month}`,
                    type: 'Relatório Mensal',
                    status: r.status,
                    action: action,
                    link: 'relatorio-mensal.html'
                });
            });

            tableContentBody.replaceChildren();
            if (backlogItems.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4" style="text-align:center; padding: 20px; opacity:0.5;">Nenhum conteúdo ou relatório pendente.</td>';
                tableContentBody.appendChild(tr);
            } else {
                backlogItems.slice(0, 8).forEach(item => {
                    let statusBadge = '<span class="os-badge os-badge-neutral">' + item.status + '</span>';
                    if (item.status === 'em_revisao') statusBadge = '<span class="os-badge os-badge-info">Em Revisão</span>';
                    else if (item.status === 'aprovado' || item.status === 'aprovado_internamente') statusBadge = '<span class="os-badge os-badge-warning">Aprovado Interno</span>';
                    else if (item.status === 'aguardando_publicacao') statusBadge = '<span class="os-badge os-badge-warning">Aguardando Pub</span>';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="cell-primary"><a class="safe-ref" style="color:#fff; text-decoration:none; border-bottom: 1px dotted var(--os-primary-dim);"></a></td>
                        <td>${item.type}</td>
                        <td>${statusBadge}</td>
                        <td><span style="font-size:0.75rem; font-weight:700; color:var(--os-primary);">${item.action}</span></td>
                    `;
                    const a = tr.querySelector('.safe-ref');
                    a.href = item.link;
                    a.textContent = item.ref;
                    tableContentBody.appendChild(tr);
                });
            }
        }

        // --- RENDERIZAR TABELA 3: APROVAÇÕES E DEMANDAS ---
        const tableApprovalsBody = document.querySelector('#table-approvals-demands tbody');
        if (tableApprovalsBody) {
            let html = '';
            const list = [];

            // Demanda
            mockDemands.filter(d => ['aberta', 'em_andamento', 'aguardando'].includes(d.status)).forEach(d => {
                list.push({
                    origem: 'Portal Cliente',
                    ref: `Demanda: ${d.title}`,
                    status: d.status,
                    action: 'Produzir Entrega',
                    link: 'demandas.html'
                });
            });

            // Aprovações Supabase
            pendingApprovals.forEach(a => {
                list.push({
                    origem: 'Aprovação Externa',
                    ref: `${a.projects?.company_name || 'Cliente'} - ${a.type === 'PLANNING' ? 'Planejamento' : 'Arte/Conteúdo'}`,
                    status: 'pendente_cliente',
                    action: 'Aguardar Cliente',
                    link: `approval.html?token=${a.token}`
                });
            });

            tableApprovalsBody.replaceChildren();
            if (list.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4" style="text-align:center; padding: 20px; opacity:0.5;">Nenhuma demanda ou aprovação externa pendente.</td>';
                tableApprovalsBody.appendChild(tr);
            } else {
                list.slice(0, 8).forEach(item => {
                    let badge = '<span class="os-badge os-badge-neutral">' + item.status + '</span>';
                    if (item.status === 'aberta') badge = '<span class="os-badge os-badge-info">Aberta</span>';
                    else if (item.status === 'em_andamento') badge = '<span class="os-badge os-badge-warning">Em Produção</span>';
                    else if (item.status === 'aguardando') badge = '<span class="os-badge os-badge-neutral">Pendente Equipe</span>';
                    else if (item.status === 'pendente_cliente') badge = '<span class="os-badge os-badge-warning">Com Cliente</span>';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${item.origem}</td>
                        <td class="cell-primary"><a class="safe-ref" style="color:#fff; text-decoration:none; border-bottom: 1px dotted var(--os-primary-dim);"></a></td>
                        <td>${badge}</td>
                        <td><span style="font-size:0.75rem; font-weight:700; color:var(--os-primary);">${item.action}</span></td>
                    `;
                    const a = tr.querySelector('.safe-ref');
                    a.href = item.link;
                    a.textContent = item.ref;
                    tableApprovalsBody.appendChild(tr);
                });
            }
        }

        // --- RENDERIZAR TABELA 4: WEBHOOK ERRORS & ERRORS ---
        const tableWebhookErrorsBody = document.querySelector('#table-webhook-errors tbody');
        if (tableWebhookErrorsBody) {
            
            // Filtrar logs de erro operacionais reais ou simulados
            const errorLogs = allLogs.filter(l => l.severity === 'critical' || l.severity === 'warning' || l.action_type === 'WEBHOOK_REAL_FAILED' || l.action_type === 'SYSTEM_ERROR');

            tableWebhookErrorsBody.replaceChildren();
            if (errorLogs.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4" style="text-align:center; padding: 20px; opacity:0.5; color: var(--os-success);">Nenhum erro de conexão ou webhook registrado. Sistema estável.</td>';
                tableWebhookErrorsBody.appendChild(tr);
            } else {
                errorLogs.slice(0, 8).forEach(log => {
                    const time = log.timestamp ? log.timestamp.split('T')[1].substring(0, 5) : 'N/A';
                    
                    let sevBadge = '<span class="os-badge os-badge-neutral">' + log.severity + '</span>';
                    if (log.severity === 'critical') sevBadge = '<span class="os-badge os-badge-danger">Crítico</span>';
                    else if (log.severity === 'warning') sevBadge = '<span class="os-badge os-badge-warning">Aviso</span>';

                    let errorMsg = log.payload?.error || log.payload?.reason || JSON.stringify(log.payload || '');
                    if (typeof errorMsg === 'object') errorMsg = JSON.stringify(errorMsg);
                    if (errorMsg.length > 50) errorMsg = errorMsg.substring(0, 50) + '...';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="cell-mono">${time}</td>
                        <td class="cell-primary" style="font-size:0.75rem;">${log.action_type}</td>
                        <td>${sevBadge}</td>
                        <td class="safe-error-msg" style="font-size:0.7rem; font-family: var(--os-font-mono); color: var(--os-danger);"></td>
                    `;
                    tr.querySelector('.safe-error-msg').textContent = errorMsg;
                    tableWebhookErrorsBody.appendChild(tr);
                });
            }
        }

    } catch (e) {
        console.error('[OPERATIONS CENTER] Erro geral ao renderizar os dados do painel.', e);
    }
}

initPage();
