import { OS_UI, OS_AUTH } from '../os-core.js';
import { SheetsService } from '../../services/sheets-service.js';

let isGlobalView = false;
let currentUser = null;

async function initPage() {
    const user = await OS_AUTH.check('OPERATOR');
    if (!user) return;
    currentUser = user;

    OS_UI.renderSidebar('metricas', user.role);
    await OS_UI.renderTopbar();

    const btnGlobal = document.getElementById('btn-global-view');
    const globalBanner = document.getElementById('global-banner');
    
    // Apenas ADMIN pode ver a visão global de métricas brutas
    if (user.role === 'ADMIN' && btnGlobal) {
        btnGlobal.style.display = 'block';
        btnGlobal.onclick = () => {
            isGlobalView = !isGlobalView;
            if (isGlobalView) {
                btnGlobal.textContent = 'VOLTAR À VISÃO POR CLIENTE';
                if(globalBanner) globalBanner.style.display = 'block';
            } else {
                btnGlobal.textContent = 'VER VISÃO GLOBAL INTERNA (ADMIN)';
                if(globalBanner) globalBanner.style.display = 'none';
            }
            loadMetrics();
        };
    }

    window.addEventListener('fluxai_project_changed', () => {
        if (!isGlobalView) loadMetrics();
    });

    await loadMetrics();
}

async function loadMetrics() {
    const container = document.getElementById('metrics-grid');
    const emptyState = document.getElementById('empty-state-metrics');
    const curProj = window.FLUXAI_RUNTIME_CONTEXT?.project_id;

    if (!isGlobalView && !curProj) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    } else {
        container.style.display = 'grid';
        emptyState.style.display = 'none';
    }

        try {
            const rawMetrics = await SheetsService.fetchMetrics();
            if (!rawMetrics || Object.keys(rawMetrics).length === 0) {
                container.innerHTML = '<div style="opacity: 0.5;">Nenhuma métrica encontrada.</div>';
                return;
            }

        // Filtra cada array se não for visão global
        const metrics = {
            instagram: isGlobalView ? rawMetrics.instagram : (rawMetrics.instagram || []).filter(m => m.cliente_id === curProj),
            metaAds: isGlobalView ? rawMetrics.metaAds : (rawMetrics.metaAds || []).filter(m => m.cliente_id === curProj),
            ga4: isGlobalView ? rawMetrics.ga4 : (rawMetrics.ga4 || []).filter(m => m.cliente_id === curProj),
            searchConsole: isGlobalView ? rawMetrics.searchConsole : (rawMetrics.searchConsole || []).filter(m => m.cliente_id === curProj)
        };

        let html = '';

        // Se após o filtro, todos os arrays estiverem vazios
        const isEmpty = !metrics.instagram?.length && !metrics.metaAds?.length && !metrics.ga4?.length && !metrics.searchConsole?.length;
        if (isEmpty) {
            container.innerHTML = '<div style="opacity: 0.5;">Nenhuma métrica encontrada para este projeto.</div>';
            return;
        }

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
