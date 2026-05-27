import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;

    OS_UI.renderSidebar('metricas', user.role);
    await OS_UI.renderTopbar();

    await loadMetrics();
}

async function loadMetrics() {
    const container = document.getElementById('metrics-grid');

    try {
        const metrics = await SheetsService.fetchMetrics();
        if (!metrics || Object.keys(metrics).length === 0) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhuma métrica encontrada.</div>';
            return;
        }

        let html = '';

        // Instagram
        if (metrics.instagram) {
            html += `<div class="os-widget half">
                <span class="os-widget-label">Instagram Diário</span>
                <div class="os-table-wrapper" style="margin-top: 15px;">
                    <table class="os-table">
                        <thead><tr><th>Cliente</th><th>Seguidores Novos</th><th>Alcance</th></tr></thead>
                        <tbody>
                            ${metrics.instagram.map(m => `<tr><td class="cell-primary">${m.cliente_id}</td><td class="cell-mono">${m.seguidores_novos}</td><td class="cell-mono">${m.alcance}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }
        
        // Meta Ads
        if (metrics.metaAds) {
            html += `<div class="os-widget half">
                <span class="os-widget-label">Meta Ads</span>
                <div class="os-table-wrapper" style="margin-top: 15px;">
                    <table class="os-table">
                        <thead><tr><th>Cliente</th><th>Investimento</th><th>CPL</th></tr></thead>
                        <tbody>
                            ${metrics.metaAds.map(m => `<tr><td class="cell-primary">${m.cliente_id}</td><td class="cell-mono">R$ ${m.investimento}</td><td class="cell-mono">R$ ${m.cpl}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        // GA4
        if (metrics.ga4) {
            html += `<div class="os-widget half">
                <span class="os-widget-label">Google Analytics 4</span>
                <div class="os-table-wrapper" style="margin-top: 15px;">
                    <table class="os-table">
                        <thead><tr><th>Cliente</th><th>Sessões</th><th>Conversões</th></tr></thead>
                        <tbody>
                            ${metrics.ga4.map(m => `<tr><td class="cell-primary">${m.cliente_id}</td><td class="cell-mono">${m.sessoes}</td><td class="cell-mono">${m.conversoes}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        // Search Console
        if (metrics.searchConsole) {
            html += `<div class="os-widget half">
                <span class="os-widget-label">Google Search Console</span>
                <div class="os-table-wrapper" style="margin-top: 15px;">
                    <table class="os-table">
                        <thead><tr><th>Cliente</th><th>Impressões</th><th>Cliques</th></tr></thead>
                        <tbody>
                            ${metrics.searchConsole.map(m => `<tr><td class="cell-primary">${m.cliente_id}</td><td class="cell-mono">${m.impressoes_organicas}</td><td class="cell-mono">${m.cliques_organicos}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        container.innerHTML = html;
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color: var(--os-danger);">Erro ao carregar métricas.</div>';
    }
}

initPage();
