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
        const uiContext = JSON.parse(sessionStorage.getItem('fluxai_ui_context') || '{}');
        const role = uiContext.role || 'OPERATOR';
        
        const transResult = await StatusEngine.transition('relatorios', reportId, currentStatus, targetStatus, { role });
        if (!transResult.success) {
            alert(`Erro de Governança: Transição inválida.\nMotivo: ${transResult.error}`);
            return;
        }

        const isReal = OS_CONFIG.flags.sendRealWebhooks || 
                       (Array.isArray(OS_CONFIG.flags.enabledRealWebhooks) && OS_CONFIG.flags.enabledRealWebhooks.includes('REPORT_STATUS_UPDATE'));

        // Disparar webhook de integração real ANTES de qualquer persistência local
        const webhookResponse = await OS_CONFIG.webhooks.send('REPORT_STATUS_UPDATE', {
            event: 'report_status_updated',
            timestamp: new Date().toISOString(),
            data: { id: reportId, current: currentStatus, target: targetStatus }
        });

        // Se o webhook real falhar, executamos o Rollback Block e cancelamos a transição
        if (!webhookResponse.success && isReal) {
            console.error('[REPORT_STATUS_UPDATE] Falha no webhook real. Abortando transição.', webhookResponse.error);

            // 1. WEBHOOK_REAL_FAILED
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_FAILED',
                'monthly-analysis',
                { webhook: 'REPORT_STATUS_UPDATE', error: webhookResponse.error || 'Erro Desconhecido', status: webhookResponse.status || 0 },
                role,
                reportId,
                false
            );

            // 2. GOVERNANCE_ABORTED
            OS_LOGS_ENGINE.userAction(
                'GOVERNANCE_ABORTED',
                'monthly-analysis',
                { action: 'transicao_relatorio_mensal', reason: 'Falha no webhook real de integração', report: reportId },
                role,
                reportId,
                false
            );

            // 3. SECURITY_WARNING
            OS_LOGS_ENGINE.security(
                'SECURITY_WARNING',
                { 
                    action: 'transicao_relatorio_cancelada_erro_conexao', 
                    client_id: reportId, 
                    role: role, 
                    error: webhookResponse.error,
                    timestamp: new Date().toISOString()
                },
                'critical'
            );

            // 4. ROLLBACK_STARTED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_STARTED',
                'monthly-analysis',
                { reason: 'Falha na resposta do webhook de relatório', client_id: reportId, preserved_status: currentStatus },
                role,
                reportId,
                false
            );

            // 5. ROLLBACK_COMPLETED
            OS_LOGS_ENGINE.userAction(
                'ROLLBACK_COMPLETED',
                'monthly-analysis',
                { client_id: reportId, restored_status: currentStatus, local_db_status: 'CONSISTENT_UNMODIFIED' },
                role,
                reportId,
                false
            );

            alert(`Falha Crítica de Conexão com o Webhook de Integração:\n\n${webhookResponse.error || 'O servidor retornou erro.'}\n\nOperação abortada e revertida com sucesso (Rollback). Nenhum dado foi gravado no banco.`);
            return;
        }

        // Se sucesso, persite localmente
        let mockReports = JSON.parse(localStorage.getItem('fluxai_mock_reports') || '[]');
        const idx = mockReports.findIndex(r => r.clientId === reportId || r.id === reportId);
        if (idx > -1) {
            mockReports[idx].status = targetStatus;
            localStorage.setItem('fluxai_mock_reports', JSON.stringify(mockReports));
        }

        // Registrar logs de transição com base no novo status
        let logEvent = 'REPORT_STATUS_UPDATED';
        if (targetStatus === 'em_revisao') logEvent = 'REPORT_REVIEW_STARTED';
        else if (targetStatus === 'aprovado_internamente') logEvent = 'REPORT_APPROVED';
        else if (targetStatus === 'enviado_ao_cliente') logEvent = 'REPORT_RELEASED';

        OS_LOGS_ENGINE.userAction(
            logEvent,
            'monthly-analysis',
            { id: reportId, current: currentStatus, target: targetStatus },
            role,
            reportId,
            !webhookResponse.success || webhookResponse.simulated
        );

        if (isReal && webhookResponse.success) {
            OS_LOGS_ENGINE.userAction(
                'WEBHOOK_REAL_SUCCESS',
                'monthly-analysis',
                { webhook: 'REPORT_STATUS_UPDATE', response_status: webhookResponse.status || 200 },
                role,
                reportId,
                false
            );
        }

        alert('Status do relatório atualizado com sucesso!');
        await loadReports();
    } catch (e) {
        console.error(e);
        alert('Erro ao transicionar relatório.');
    }
};

initPage();
