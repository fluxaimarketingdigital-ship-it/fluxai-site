import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';
import { OS_CONFIG } from '../../config/os-config.js';
import { StatusEngine } from '../../config/status-system.js';
import { OS_LOGS_ENGINE } from '../../services/logs-engine.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('relatorio-mensal', user.role);
    await OS_UI.renderTopbar();

    await loadReports();
}

async function loadReports() {
    const container = document.getElementById('reports-grid');

    try {
        let reports = JSON.parse(localStorage.getItem('fluxai_mock_reports') || '[]');
        if (reports.length === 0) {
            reports = await SheetsService.fetchMonthlyAnalysis();
            localStorage.setItem('fluxai_mock_reports', JSON.stringify(reports));
        }

        if (reports.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhum relatório encontrado.</div>';
            return;
        }

        let html = '';

        reports.forEach(r => {
            const statusConfig = StatusEngine.resolve('relatorios', r.status);
            const statusBadge = StatusEngine.renderBadge('relatorios', r.status);

            let buttonsHtml = '';
            const allowed = statusConfig.allowedTransitions || [];
            
            allowed.forEach(target => {
                const targetRes = StatusEngine.resolve('relatorios', target);
                buttonsHtml += `
                    <button onclick="window.transitionReport('${r.id || r.clientId}', '${r.status}', '${target}')" 
                            style="background: rgba(142, 158, 104, 0.1); border: 1px solid var(--os-primary); color: var(--os-primary); padding: 6px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 0.65rem; text-transform: uppercase; margin-left: 8px; transition: all 0.2s;">
                        Mudar para: ${targetRes.label}
                    </button>
                `;
            });

            html += `
            <div class="os-widget half">
                <div class="report-card">
                    <div class="report-header">
                        <div>
                            <div class="report-title">${r.clientId}</div>
                            <div class="report-meta">${r.month}</div>
                        </div>
                        <div>${statusBadge}</div>
                    </div>
                    
                    <div class="report-stats">
                        <div class="stat-box">
                            <div class="stat-value">${(r.reach / 1000).toFixed(1)}k</div>
                            <div class="stat-label">Alcance</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${r.followers}</div>
                            <div class="stat-label">Seguidores</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${r.contentPublished}</div>
                            <div class="stat-label">Posts</div>
                        </div>
                    </div>

                    <div class="report-content">
                        <h4>Diagnóstico Executivo</h4>
                        <p>${r.executiveDiagnostic}</p>
                        
                        <h4>Decisão Próximo Mês</h4>
                        <p>${r.nextMonthDecision}</p>
                        
                        <h4>Prioridades</h4>
                        <p>${r.priorities}</p>
                    </div>
                    
                    <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; text-align: right; display: flex; justify-content: flex-end; align-items: center;">
                        <span style="font-size: 0.65rem; color: var(--os-text-muted); margin-right: auto;">Ações de Estado:</span>
                        ${buttonsHtml}
                        <button style="background: rgba(255,255,255,0.05); border: 1px solid var(--os-border); color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.65rem; text-transform: uppercase; margin-left: 8px;">Editar Rascunho</button>
                    </div>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar relatórios.</div>';
    }
}

window.transitionReport = async (reportId, currentStatus, targetStatus) => {
    try {
        const session = JSON.parse(localStorage.getItem('fluxai_session') || '{}');
        const role = session.role || 'OPERATOR';
        
        const transResult = await StatusEngine.transition('relatorios', reportId, currentStatus, targetStatus, { role });
        if (!transResult.success) {
            alert(`Erro na transição de status: ${transResult.error}`);
            return;
        }

        // Log da ação
        if (typeof OS_LOGS_ENGINE !== 'undefined') {
            OS_LOGS_ENGINE.userAction('REPORT_STATUS_UPDATED', { id: reportId, current: currentStatus, target: targetStatus }, !OS_CONFIG.flags.sendRealWebhooks);
        }

        // Webhook
        await OS_CONFIG.webhooks.send('REPORT_STATUS_UPDATE', {
            event: 'report_status_updated',
            timestamp: new Date().toISOString(),
            data: { id: reportId, current: currentStatus, target: targetStatus }
        });

        // Atualizar status localmente no mock
        let mockReports = JSON.parse(localStorage.getItem('fluxai_mock_reports') || '[]');
        const idx = mockReports.findIndex(r => r.clientId === reportId || r.id === reportId);
        if (idx > -1) {
            mockReports[idx].status = targetStatus;
            localStorage.setItem('fluxai_mock_reports', JSON.stringify(mockReports));
        }

        alert('Status do relatório atualizado com sucesso!');
        await loadReports();
    } catch (e) {
        console.error(e);
        alert('Erro ao transicionar relatório.');
    }
};

initPage();
