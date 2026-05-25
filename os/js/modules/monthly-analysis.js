import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';

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
        const reports = await SheetsService.fetchMonthlyAnalysis();
        if (reports.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhum relatório encontrado.</div>';
            return;
        }

        let html = '';

        reports.forEach(r => {
            const statusClass = r.status === 'rascunho' ? 'rascunho' : 'em_revisao';
            html += `
            <div class="os-widget half">
                <div class="report-card">
                    <div class="report-header">
                        <div>
                            <div class="report-title">${r.clientId}</div>
                            <div class="report-meta">${r.month}</div>
                        </div>
                        <div><span class="badge ${statusClass}">${r.status.replace('_', ' ')}</span></div>
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
                    
                    <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; text-align: right;">
                        <button style="background: var(--os-primary); color: #000; border: none; padding: 6px 15px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">Editar Rascunho</button>
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

initPage();
