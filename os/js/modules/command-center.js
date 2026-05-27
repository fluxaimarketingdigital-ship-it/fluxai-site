import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('command-center', user.role);
    await OS_UI.renderTopbar();

    await loadCommandCenter();
}

async function loadCommandCenter() {
    try {
        const [clients, services, routes, statusMonitor, reports] = await Promise.all([
            SheetsService.fetchClients(),
            SheetsService.fetchServices(),
            SheetsService.fetchRoutes(),
            SheetsService.fetchStatusMonitor(),
            SheetsService.fetchMonthlyAnalysis()
        ]);

        // Calcular Métricas
        const activeClients = clients.filter(c => c.status === 'ativo').length;
        const activeServices = services.filter(s => s.status === 'ativo').length;
        const manualTasks = services.filter(s => s.collectionMode === 'manual').length;
        
        const apisOk = clients.filter(c => c.tokenStatus === 'ok').length;
        const activeWebhooks = routes.filter(r => r.status === 'ativa').length;
        const pausedRoutes = routes.filter(r => r.status === 'pausada').length;
        const pendingAuths = routes.filter(r => r.status === 'aguardando_autorizacao').length;
        
        const draftReports = reports.filter(r => r.status === 'rascunho').length;

        // Render Cards
        const grid = document.getElementById('metrics-grid');
        grid.innerHTML = `
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Clientes Ativos</span><i class="fa-solid fa-users" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeClients}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Serviços Ativos</span><i class="fa-solid fa-briefcase" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeServices}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">APIs (Tokens OK)</span><i class="fa-solid fa-key" style="color:#10b981"></i></div>
                <div class="os-metric"><div class="os-metric-value">${apisOk}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Webhooks Ativos</span><i class="fa-solid fa-network-wired" style="color:#10b981"></i></div>
                <div class="os-metric"><div class="os-metric-value">${activeWebhooks}</div></div>
            </div>

            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Coletas Manuais</span><i class="fa-solid fa-hand" style="color:#f59e0b"></i></div>
                <div class="os-metric"><div class="os-metric-value">${manualTasks}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Rotas Pausadas</span><i class="fa-solid fa-pause" style="color:#ef4444"></i></div>
                <div class="os-metric"><div class="os-metric-value">${pausedRoutes}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Auth Pendente</span><i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i></div>
                <div class="os-metric"><div class="os-metric-value">${pendingAuths}</div></div>
            </div>
            <div class="os-widget" style="grid-column: span 3;">
                <div class="os-widget-header"><span class="os-widget-label">Relatórios Rascunho</span><i class="fa-solid fa-file-signature" style="color:var(--os-primary)"></i></div>
                <div class="os-metric"><div class="os-metric-value">${draftReports}</div></div>
            </div>
        `;

        // Render Alerts
        const alertsContainer = document.getElementById('alerts-container');
        let alertsHtml = '';
        statusMonitor.filter(s => s.criticidade === 'alta' || s.criticidade === 'media').forEach(a => {
            const color = a.criticidade === 'alta' ? 'var(--os-danger)' : 'var(--os-warning)';
            const icon = a.criticidade === 'alta' ? 'fa-triangle-exclamation' : 'fa-hand-paper';
            alertsHtml += `
            <div class="os-alert-item" style="border-left: 3px solid ${color};">
                <div class="os-alert-icon" style="color: ${color};"><i class="fa-solid ${icon}"></i></div>
                <div class="os-alert-content">
                    <h4 style="font-size:0.7rem; margin:0; color:#fff; text-transform:uppercase;">${a.status_operacional.replace('_', ' ')}</h4>
                    <p style="font-size:0.6rem; margin:2px 0 0; color:var(--os-text-muted);">${a.cliente_id} • ${a.acao_recomendada}</p>
                </div>
            </div>`;
        });
        alertsContainer.innerHTML = alertsHtml || '<div style="opacity:0.3; text-align:center; padding:20px; font-size:0.7rem;">ESTADO OPERACIONAL ESTÁVEL</div>';

        // Render Client Health Table
        const healthContainer = document.getElementById('health-table-container');
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
        
        statusMonitor.forEach(s => {
            const critClass = s.criticidade === 'alta' ? 'alta' : (s.criticidade === 'media' ? 'media' : 'baixa');
            let badgeStyle = '';
            if(s.criticidade === 'alta') badgeStyle = 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);';
            else if(s.criticidade === 'media') badgeStyle = 'background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);';
            else badgeStyle = 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);';

            healthHtml += `<tr>
                <td class="cell-primary">${s.cliente_id}</td>
                <td>${s.servico}</td>
                <td><span style="font-size:0.65rem; border:1px solid var(--os-border); padding:2px 6px; border-radius:4px;">${s.status_operacional.replace('_', ' ')}</span></td>
                <td><span class="os-badge" style="${badgeStyle}">${s.criticidade}</span></td>
                <td style="color: var(--os-text-muted); font-size:0.75rem;">${s.acao_recomendada}</td>
            </tr>`;
        });
        healthHtml += `</tbody></table></div>`;
        healthContainer.innerHTML = healthHtml;

    } catch (e) {
        console.error(e);
    }
}

initPage();
