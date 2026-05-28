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

    window.addEventListener('fluxai_project_changed', () => {
        loadReports();
    });

    await loadReports();
}

async function loadReports() {
    const container = document.getElementById('reports-grid');
    const emptyState = document.getElementById('empty-state-reports');
    const curProj = window.FLUXAI_RUNTIME_CONTEXT?.project_id;

    if (!curProj) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    } else {
        container.style.display = 'flex';
        emptyState.style.display = 'none';
    }

    try {
        let reportsRaw = JSON.parse(localStorage.getItem('fluxai_mock_reports') || '[]');
        if (reportsRaw.length === 0) {
            reportsRaw = await SheetsService.fetchMonthlyAnalysis();
            // Disparar log de sync na criação
            OS_LOGS_ENGINE.userAction('REPORT_DATA_SYNCED', 'monthly-analysis', { count: reportsRaw.length }, 'SYSTEM', curProj, false);
            localStorage.setItem('fluxai_mock_reports', JSON.stringify(reportsRaw));
        }

        const reports = reportsRaw.filter(r => r.clientId === curProj || r.project_id === curProj);

        if (reports.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5; width: 100%; text-align: center;">Nenhum relatório encontrado para este cliente. <button class="os-btn os-btn-primary" onclick="window.createDraft()">GERAR RASCUNHO</button></div>';
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
                        <h4>O que Aconteceu?</h4>
                        <p>${r.whatHappened || 'Resumo executivo do mês não preenchido...'}</p>
                        
                        <h4>Por que Aconteceu? (Diagnóstico Executivo)</h4>
                        <p>${r.executiveDiagnostic}</p>

                        <h4>Impacto & Riscos</h4>
                        <p>${r.risks || 'Análise de risco não preenchida...'}</p>
                        
                        <h4>Oportunidades & Decisão Próximo Mês</h4>
                        <p>${r.nextMonthDecision}</p>
                        
                        <h4>Próximos Passos</h4>
                        <p>${r.priorities}</p>
                    </div>
                    
                    <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; text-align: right; display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <span style="font-size: 0.65rem; color: var(--os-text-muted); margin-right: auto;">Ações de Estado:</span>
                        ${buttonsHtml}
                        <button style="background: rgba(255,255,255,0.05); border: 1px solid var(--os-border); color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.65rem; text-transform: uppercase;">Editar Rascunho</button>
                        ${(r.status === 'aprovado_internamente' || r.status === 'liberado_cliente' || r.status === 'enviado_cliente') ? `<button onclick="window.printReport('${r.id || r.clientId}')" style="background: var(--os-primary); border: none; color: #000; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.65rem; text-transform: uppercase;"><i class="fa-solid fa-print"></i> Imprimir/Exportar</button>` : ''}
                    </div>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        OS_LOGS_ENGINE.userAction('REPORT_DATA_FAILED', 'monthly-analysis', { error: e.message }, 'SYSTEM', curProj || 'unknown', true);
        container.innerHTML = '<div style="color: var(--os-danger); width: 100%; text-align: center; padding: 20px;">Falha de API/Conexão: Dados Pendentes / Fonte Indisponível.</div>';
    }
}

window.createDraft = async () => {
    const curProj = window.FLUXAI_RUNTIME_CONTEXT?.project_id;
    if(!curProj) return;
    
    let reportsRaw = JSON.parse(localStorage.getItem('fluxai_mock_reports') || '[]');
    reportsRaw.push({
        id: 'REP_' + Math.floor(Math.random()*10000),
        clientId: curProj,
        month: new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        status: 'rascunho_fluxai',
        reach: 0, followers: 0, contentPublished: 0,
        executiveDiagnostic: 'Aguardando diagnóstico',
        nextMonthDecision: 'Aguardando decisão',
        priorities: 'Aguardando prioridades'
    });
    localStorage.setItem('fluxai_mock_reports', JSON.stringify(reportsRaw));
    
    OS_LOGS_ENGINE.userAction('REPORT_DRAFT_CREATED', 'monthly-analysis', {}, window.FLUXAI_RUNTIME_CONTEXT?.role || 'OPERATOR', curProj, false);
    await loadReports();
};

window.printReport = async (reportId) => {
    alert("Exportação em desenvolvimento (Visualização Simples / Print HTML). A impressão pelo browser pode ser acionada pressionando CTRL+P após isolar o componente.");
};

window.transitionReport = async (reportId, currentStatus, targetStatus) => {
    try {
        const uiContext = window.FLUXAI_RUNTIME_CONTEXT || {};
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
        if (targetStatus === 'em_revisao_estrategica') logEvent = 'REPORT_REVIEW_STARTED';
        else if (targetStatus === 'aprovado_interno') logEvent = 'REPORT_APPROVED_INTERNAL';
        else if (targetStatus === 'enviado_cliente') logEvent = 'REPORT_SENT_CLIENT';

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
