import { OS_UI, OS_AUTH } from '../os-core.js';
import { OSState } from '../os-state.js';
import { getSupabase } from '../../services/supabase-client.js';

// ─── MULTI-CLIENT FILTER STATE ────────────────────────────────────────────────
let clientRegistry = []; // [{ id: UUID, company_name: string, workspace_type: string }]

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('command-center', user.role);
    await OS_UI.renderTopbar();

    await loadClientRegistry();
    renderClientFilter();
    await loadCommandCenter();

    // Re-render when active client changes globally
    OSState.subscribeActiveClient(() => {
        renderClientFilter();
        loadCommandCenter();
    });
}

// ─── FASE 0: PRE-WRITE REAL DATA GUARD ───────────────────────────────────────
// Carrega projetos reais do tipo CLIENT para popular o filtro.
// Nunca usa lista hardcoded — sempre derivado do Supabase.
async function loadClientRegistry() {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
        .from('CLIENTES_ESTRATEGIA')
        .select('*');

    if (error) {
        console.warn('[Command Center] Falha ao carregar registry de clientes:', error);
        return;
    }
    clientRegistry = (data || []).map(p => ({
        id: p.client_id,
        company_name: p.cliente_nome || p.client_id,
        workspace_type: 'CLIENT',
        status: p.status
    }));
    console.log(`[Command Center] Client registry: ${clientRegistry.length} clientes ativos.`);
}

// ─── RENDER FILTRO GLOBAL DE CLIENTE ─────────────────────────────────────────
function renderClientFilter() {
    // Encontra ou cria o container do filtro
    let filterBar = document.getElementById('cc-client-filter-bar');
    if (!filterBar) {
        const viewport = document.querySelector('.os-viewport');
        const pageTitle = viewport ? viewport.querySelector('.os-page-title') : null;
        filterBar = document.createElement('div');
        filterBar.id = 'cc-client-filter-bar';
        filterBar.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 0 4px 0;
            flex-wrap: wrap;
        `;
        if (pageTitle && pageTitle.nextSibling) {
            viewport.insertBefore(filterBar, pageTitle.nextSibling);
        } else if (pageTitle) {
            pageTitle.insertAdjacentElement('afterend', filterBar);
        }
    }

    const currentClient = OSState.getActiveClient();
    const options = [
        { id: 'ALL_CLIENTS', label: 'Todos os clientes' },
        ...clientRegistry.map(c => ({ id: c.id, label: c.company_name }))
    ];

    filterBar.innerHTML = `
        <span style="font-size:0.7rem; color:var(--os-text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-right:4px;">Filtro Cliente:</span>
        <select
            id="cc-client-select"
            onchange="window.__ccSelectClient(this.value)"
            style="
                padding: 6px 12px;
                border-radius: var(--os-radius-sm);
                border: 1px solid var(--os-border);
                background: rgba(255, 255, 255, 0.05);
                color: var(--os-text);
                font-family: inherit;
                font-size: 0.8rem;
                cursor: pointer;
                outline: none;
                min-width: 200px;
            "
        >
            ${options.map(opt => `
                <option value="${opt.id}" ${currentClient === opt.id ? 'selected' : ''}>
                    ${opt.label}
                </option>
            `).join('')}
        </select>
    `;

    // Contexto visível
    let contextBar = document.getElementById('cc-context-bar');
    if (!contextBar) {
        contextBar = document.createElement('div');
        contextBar.id = 'cc-context-bar';
        contextBar.style.cssText = 'font-size:0.68rem; color:var(--os-text-muted); padding: 2px 0 8px 0;';
        filterBar.insertAdjacentElement('afterend', contextBar);
    }
    const ctxLabel = (currentClient !== 'ALL_CLIENTS')
        ? (clientRegistry.find(c => c.id === currentClient)?.company_name || currentClient)
        : 'Todos os clientes';
    contextBar.textContent = `Contexto atual: ${ctxLabel}`;
}

// Exposto globalmente para ser chamado pelos onclick dos botões
window.__ccSelectClient = function(projectIdRaw) {
    OSState.setActiveClient(projectIdRaw);
    // Nota: renderClientFilter() e loadCommandCenter() serão disparados automaticamente pelo OSState.subscribeActiveClient()
};

// ─── LOAD COMMAND CENTER (COM FILTRO) ─────────────────────────────────────────
async function loadCommandCenter() {
    const supabase = getSupabase();
    if (!supabase) {
        document.getElementById('metrics-grid').innerHTML =
            '<div style="opacity: 0.5; padding: 20px; grid-column: span 12; color: var(--os-danger);">Falha de Conexão com Banco de Dados.</div>';
        return;
    }

    // Loading state with timeout fallback indicator
    const grid = document.getElementById('metrics-grid');
    grid.innerHTML =
        '<div style="opacity:0.3; padding:20px; grid-column:span 12; font-size:0.8rem;">Carregando...</div>';

    try {
        // ── CARDS GLOBAIS DE INFRAESTRUTURA ──────────────────────────────────
        // APIs, Webhooks, Coletas, Rotas — não são client-scoped no data model atual.
        // Permanecem globais (infraestrutura da agência).
        const apisOk = 0;
        const activeWebhooks = 0;
        const manualTasks = 0;
        const pausedRoutes = 0;

        // ── QUERIES CLIENT-SCOPED ─────────────────────────────────────────────
        const currentClient = OSState.getActiveClient();
        const isAllClients = currentClient === 'ALL_CLIENTS';

        const buildClientFilter = (query, field = 'project_id') => {
            return !isAllClients ? query.eq(field, currentClient) : query;
        };

        const queries = [
            // 0: Clientes Ativos — HYBRID: quando "Todos" mostra contagem total; quando cliente mostra 1 ou 0
            !isAllClients
                ? supabase.from('projects').select('id', { count: 'exact' })
                    .eq('status', 'ATIVO').in('workspace_type', ['CLIENT', 'INTERNAL_WORKSPACE', 'MASTER_ACCOUNT']).eq('id', currentClient)
                    .then(res => res.error ? { count: 0, error: res.error } : res)
                : supabase.from('projects').select('id', { count: 'exact' })
                    .eq('status', 'ATIVO').in('workspace_type', ['CLIENT', 'INTERNAL_WORKSPACE', 'MASTER_ACCOUNT'])
                    .then(res => res.error ? { count: 0, error: res.error } : res),

            // 1: Serviços Ativos (Contratos) — CLIENT_SCOPED
            buildClientFilter(
                supabase.from('contracts').select('id', { count: 'exact' }).eq('status', 'ATIVO')
            ).then(res => res.error ? { count: 0, error: res.error } : res),

            // 2: Auth Pendente (External Approvals) — CLIENT_SCOPED
            buildClientFilter(
                supabase.from('external_approvals').select('id', { count: 'exact' }).eq('status', 'PENDENTE')
            ).then(res => res.error ? { count: 0, error: res.error } : res),

            // 3: Relatórios Rascunho — CLIENT_SCOPED
            buildClientFilter(
                supabase.from('content_assets').select('id', { count: 'exact' }).eq('status', 'PLANEJAMENTO')
            ).then(res => res.error ? { count: 0, error: res.error } : res),

            // 4: Alertas Operacionais — GLOBAL (operational_events não tem project_id definido)
            supabase.from('operational_events').select('event_type, responsible, context, created_at')
                .order('created_at', { ascending: false }).limit(5)
                .then(res => res.error ? { data: [], error: res.error } : res),

            // 5: Client Health — HYBRID: filtra por projeto quando selecionado
            (() => {
                let q = supabase.from('operational_events')
                    .select('*, projects(company_name, id)')
                    .order('created_at', { ascending: false }).limit(10);
                if (!isAllClients) {
                    q = q.eq('project_id', currentClient);
                }
                return q.then(res => res.error ? { data: [], error: res.error } : res);
            })(),
        ];

        // Adiciona timeout para evitar loading infinito
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 10000));
        
        const queriesPromise = Promise.all(queries);
        const resultsRaw = await Promise.race([queriesPromise, timeoutPromise]);
        
        if (resultsRaw === 'TIMEOUT') {
            throw new Error('Timeout de 10s atingido ao buscar dados do Supabase.');
        }
        
        const results = resultsRaw;

        const activeClients = results[0].count ?? 0;
        const activeServices = results[1].count ?? 0;
        const pendingAuths = results[2].count ?? 0;
        const draftReports = results[3].count ?? 0;
        const alertsData = results[4].data || [];
        const healthData = results[5].data || [];

        // Log warnings silenciosos
        results.forEach((r, i) => {
            if (r.error) console.warn(`[Command Center] Query ${i} warning:`, r.error);
        });

        // ── RENDER CARDS ──────────────────────────────────────────────────────
        const isFiltered = !isAllClients;
        const filteredLabel = isFiltered
            ? `<span style="font-size:0.55rem; opacity:0.5; display:block; margin-top:2px;">escopo: cliente</span>`
            : `<span style="font-size:0.55rem; opacity:0.5; display:block; margin-top:2px;">todos os clientes</span>`;
        const globalLabel = `<span style="font-size:0.55rem; opacity:0.5; display:block; margin-top:2px;">infraestrutura global</span>`;

        const grid = document.getElementById('metrics-grid');
        grid.innerHTML = `
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Clientes Ativos</span><i class="fa-solid fa-users" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeClients}</div>${filteredLabel}</div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Serviços Ativos</span><i class="fa-solid fa-briefcase" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeServices}</div>${filteredLabel}</div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">APIs (Tokens OK)</span><i class="fa-solid fa-key" style="color:#10b981"></i></div>
                <div class="os-metric"><div class="os-metric-value">${apisOk}</div>${globalLabel}</div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Webhooks Ativos</span><i class="fa-solid fa-network-wired" style="color:#10b981"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeWebhooks}</div>${globalLabel}</div>
            </div>

            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Coletas Manuais</span><i class="fa-solid fa-hand" style="color:#f59e0b"></i></div>
                <div class="os-metric"><div class="os-metric-value">${manualTasks}</div>${globalLabel}</div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Rotas Pausadas</span><i class="fa-solid fa-pause" style="color:#ef4444"></i></div>
                <div class="os-metric"><div class="os-metric-value">${pausedRoutes}</div>${globalLabel}</div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Auth Pendente</span><i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i></div>
                <div class="os-metric"><div class="os-metric-value">${pendingAuths}</div>${filteredLabel}</div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Relatórios Rascunho</span><i class="fa-solid fa-file-signature" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${draftReports}</div>${filteredLabel}</div>
            </div>
        `;

        // ── RENDER ALERTAS (global) ───────────────────────────────────────────
        const alertsContainer = document.getElementById('alerts-container');
        let alertsHtml = '';
        alertsData.forEach(a => {
            const isError = a.event_type && (a.event_type.includes('FALHA') || a.event_type.includes('ERRO') || a.event_type.includes('REPROVADO'));
            const color = isError ? 'var(--os-danger)' : 'var(--os-warning)';
            const icon = isError ? 'fa-triangle-exclamation' : 'fa-hand-paper';
            alertsHtml += `
            <div class="os-alert-item" style="border-left: 3px solid ${color};">
                <div class="os-alert-icon" style="color: ${color};"><i class="fa-solid ${icon}"></i></div>
                <div class="os-alert-content">
                    <h4 style="font-size:0.7rem; margin:0; color:#fff; text-transform:uppercase;">${(a.event_type || 'ALERTA').replace('_', ' ')}</h4>
                    <p style="font-size:0.6rem; margin:2px 0 0; color:var(--os-text-muted);">${a.responsible || 'Sistema'} • ${a.context || 'Ação reportada'}</p>
                </div>
            </div>`;
        });
        alertsContainer.innerHTML = alertsHtml ||
            '<div style="opacity:0.3; text-align:center; padding:20px; font-size:0.7rem;">ESTADO OPERACIONAL ESTÁVEL</div>';

        // ── RENDER CLIENT HEALTH ──────────────────────────────────────────────
        const healthContainer = document.getElementById('health-table-container');
        if (healthData.length === 0) {
            healthContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px;">
                <i class="fa-solid fa-shield-halved" style="font-size: 2.5rem; color: var(--os-text-muted); margin-bottom: 15px; opacity: 0.3;"></i>
                <h3 style="margin: 0; font-size: 1rem; color: #fff;">Saúde Operacional Estável</h3>
                <p style="color: var(--os-text-muted); font-size: 0.8rem; margin-top: 5px;">Nenhum alerta ou inconsistência mapeada${isFiltered ? ' para este cliente' : ''}.</p>
            </div>`;
        } else {
            let healthHtml = `<div class="os-table-wrapper">
                <table class="os-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Status Operacional</th>
                        <th>Criticidade</th>
                        <th>Ação Recomendada</th>
                    </tr>
                </thead>
                <tbody>`;
            healthData.forEach(s => {
                const clientName = (s.projects && s.projects.company_name) ? s.projects.company_name : 'N/A';
                const isError = s.event_type && (s.event_type.includes('FALHA') || s.event_type.includes('ERRO'));
                const critText = isError ? 'ALTA' : 'BAIXA';
                const badgeStyle = isError
                    ? 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
                    : 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);';
                healthHtml += `<tr>
                    <td class="cell-primary">${clientName}</td>
                    <td>SISTEMA</td>
                    <td><span style="font-size:0.65rem; border:1px solid var(--os-border); padding:2px 6px; border-radius:4px;">${s.event_type || 'EVENTO'}</span></td>
                    <td><span class="os-badge" style="${badgeStyle}">${critText}</span></td>
                    <td style="color: var(--os-text-muted); font-size:0.75rem;">${s.context || '-'}</td>
                </tr>`;
            });
            healthHtml += `</tbody></table></div>`;
            healthContainer.innerHTML = healthHtml;
        }

    } catch (e) {
        console.error('[Command Center] Erro Crítico:', e);
        document.getElementById('metrics-grid').innerHTML =
            `<div style="padding: 20px; grid-column: span 12; border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                <h3 style="color: #ef4444; margin: 0 0 10px 0; font-size: 1rem;"><i class="fa-solid fa-triangle-exclamation"></i> Falha ao Carregar Dados</h3>
                <p style="color: var(--os-text-muted); font-size: 0.8rem; margin: 0;">Não foi possível hidratar as métricas no tempo esperado. Verifique o console ou tente recarregar.</p>
            </div>`;
    }
}

initPage();
