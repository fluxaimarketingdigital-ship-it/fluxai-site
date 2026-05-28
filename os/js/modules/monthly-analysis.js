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
            container.textContent = '';
            const emptyDiv = document.createElement('div');
            emptyDiv.style.cssText = 'opacity: 0.5; width: 100%; text-align: center;';
            emptyDiv.textContent = 'Nenhum relatório encontrado para este cliente. ';
            const btnDraft = document.createElement('button');
            btnDraft.className = 'os-btn os-btn-primary';
            btnDraft.textContent = 'GERAR RASCUNHO';
            btnDraft.onclick = () => window.createDraft();
            emptyDiv.appendChild(btnDraft);
            container.appendChild(emptyDiv);
            return;
        }

        container.textContent = '';
        reports.forEach(r => {
            const statusConfig = StatusEngine.resolve('relatorios', r.status);
            
            const widget = document.createElement('div');
            widget.className = 'os-widget half';
            
            const card = document.createElement('div');
            card.className = 'report-card';
            
            const header = document.createElement('div');
            header.className = 'report-header';
            
            const headerLeft = document.createElement('div');
            const title = document.createElement('div');
            title.className = 'report-title';
            title.textContent = r.clientId;
            const meta = document.createElement('div');
            meta.className = 'report-meta';
            meta.textContent = r.month;
            headerLeft.appendChild(title);
            headerLeft.appendChild(meta);
            
            const headerRight = document.createElement('div');
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'os-badge os-badge-' + (statusConfig.color || 'neutral');
            badgeSpan.textContent = statusConfig.label || r.status;
            headerRight.appendChild(badgeSpan);
            
            header.appendChild(headerLeft);
            header.appendChild(headerRight);
            
            const stats = document.createElement('div');
            stats.className = 'report-stats';
            
            const stat1 = document.createElement('div'); stat1.className = 'stat-box';
            const val1 = document.createElement('div'); val1.className = 'stat-value'; val1.textContent = (r.reach / 1000).toFixed(1) + 'k';
            const lbl1 = document.createElement('div'); lbl1.className = 'stat-label'; lbl1.textContent = 'Alcance';
            stat1.appendChild(val1); stat1.appendChild(lbl1);
            
            const stat2 = document.createElement('div'); stat2.className = 'stat-box';
            const val2 = document.createElement('div'); val2.className = 'stat-value'; val2.textContent = r.followers;
            const lbl2 = document.createElement('div'); lbl2.className = 'stat-label'; lbl2.textContent = 'Seguidores';
            stat2.appendChild(val2); stat2.appendChild(lbl2);
            
            const stat3 = document.createElement('div'); stat3.className = 'stat-box';
            const val3 = document.createElement('div'); val3.className = 'stat-value'; val3.textContent = r.contentPublished;
            const lbl3 = document.createElement('div'); lbl3.className = 'stat-label'; lbl3.textContent = 'Posts';
            stat3.appendChild(val3); stat3.appendChild(lbl3);
            
            stats.appendChild(stat1); stats.appendChild(stat2); stats.appendChild(stat3);
            
            const content = document.createElement('div');
            content.className = 'report-content';
            
            const h4_1 = document.createElement('h4'); h4_1.textContent = 'O que Aconteceu?';
            const p_1 = document.createElement('p'); p_1.textContent = r.whatHappened || 'Resumo executivo do mês não preenchido...';
            
            const h4_2 = document.createElement('h4'); h4_2.textContent = 'Por que Aconteceu? (Diagnóstico Executivo)';
            const p_2 = document.createElement('p'); p_2.textContent = r.executiveDiagnostic;
            
            const h4_3 = document.createElement('h4'); h4_3.textContent = 'Impacto & Riscos';
            const p_3 = document.createElement('p'); p_3.textContent = r.risks || 'Análise de risco não preenchida...';
            
            const h4_4 = document.createElement('h4'); h4_4.textContent = 'Oportunidades & Decisão Próximo Mês';
            const p_4 = document.createElement('p'); p_4.textContent = r.nextMonthDecision;
            
            const h4_5 = document.createElement('h4'); h4_5.textContent = 'Próximos Passos';
            const p_5 = document.createElement('p'); p_5.textContent = r.priorities;
            
            content.appendChild(h4_1); content.appendChild(p_1);
            content.appendChild(h4_2); content.appendChild(p_2);
            content.appendChild(h4_3); content.appendChild(p_3);
            content.appendChild(h4_4); content.appendChild(p_4);
            content.appendChild(h4_5); content.appendChild(p_5);
            
            const footer = document.createElement('div');
            footer.style.cssText = 'margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; text-align: right; display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: 8px;';
            
            const actionSpan = document.createElement('span');
            actionSpan.style.cssText = 'font-size: 0.65rem; color: var(--os-text-muted); margin-right: auto;';
            actionSpan.textContent = 'Ações de Estado:';
            footer.appendChild(actionSpan);
            
            const allowed = statusConfig.allowedTransitions || [];
            allowed.forEach(target => {
                const targetRes = StatusEngine.resolve('relatorios', target);
                const btnTransition = document.createElement('button');
                btnTransition.style.cssText = 'background: rgba(142, 158, 104, 0.1); border: 1px solid var(--os-primary); color: var(--os-primary); padding: 6px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 0.65rem; text-transform: uppercase; margin-left: 8px; transition: all 0.2s;';
                btnTransition.textContent = 'Mudar para: ' + targetRes.label;
                btnTransition.onclick = () => window.transitionReport(r.id || r.clientId, r.status, target);
                footer.appendChild(btnTransition);
            });
            
            const btnEdit = document.createElement('button');
            btnEdit.style.cssText = 'background: rgba(255,255,255,0.05); border: 1px solid var(--os-border); color: #fff; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.65rem; text-transform: uppercase;';
            btnEdit.textContent = 'Editar Rascunho';
            footer.appendChild(btnEdit);
            
            if (r.status === 'aprovado_internamente' || r.status === 'liberado_cliente' || r.status === 'enviado_cliente') {
                const btnPrint = document.createElement('button');
                btnPrint.style.cssText = 'background: var(--os-primary); border: none; color: #000; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.65rem; text-transform: uppercase;';
                
                const iconPrint = document.createElement('i');
                iconPrint.className = 'fa-solid fa-print';
                iconPrint.style.marginRight = '4px';
                
                btnPrint.appendChild(iconPrint);
                btnPrint.appendChild(document.createTextNode(' Imprimir/Exportar'));
                btnPrint.onclick = () => window.printReport(r.id || r.clientId);
                footer.appendChild(btnPrint);
            }
            
            card.appendChild(header);
            card.appendChild(stats);
            card.appendChild(content);
            card.appendChild(footer);
            widget.appendChild(card);
            
            container.appendChild(widget);
        });
    } catch (e) {
        console.error(e);
        OS_LOGS_ENGINE.userAction('REPORT_DATA_FAILED', 'monthly-analysis', { error: e.message }, 'SYSTEM', curProj || 'unknown', true);
        container.textContent = '';
        const errDiv = document.createElement('div');
        errDiv.style.cssText = 'color: var(--os-danger); width: 100%; text-align: center; padding: 20px;';
        errDiv.textContent = 'Falha de API/Conexão: Dados Pendentes / Fonte Indisponível.';
        container.appendChild(errDiv);
    }
}

window.createDraft = async () => {
    const curProj = window.FLUXAI_RUNTIME_CONTEXT?.project_id;
    if(!curProj) return;
    
    let reportsRaw = JSON.parse(localStorage.getItem('fluxai_mock_reports') || '[]');
    reportsRaw.push({
        id: 'REP_' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase(),
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
