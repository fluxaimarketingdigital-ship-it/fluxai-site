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

const renderMetricsTable = (container, title, headers, data, getRowValues) => {
    if (!data || !data.length) return;
    const w = document.createElement('div'); w.className = 'os-widget half';
    const l = document.createElement('span'); l.className = 'os-widget-label'; l.textContent = title;
    const wrap = document.createElement('div'); wrap.className = 'os-table-wrapper'; wrap.style.marginTop = '15px';
    const table = document.createElement('table'); table.className = 'os-table';
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    headers.forEach(t => { const th = document.createElement('th'); th.textContent = t; trHead.appendChild(th); });
    thead.appendChild(trHead);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    data.forEach(m => {
        const tr = document.createElement('tr');
        const vals = getRowValues(m);
        vals.forEach((v, idx) => {
            const td = document.createElement('td'); 
            td.className = idx === 0 ? 'cell-primary' : 'cell-mono'; 
            td.textContent = v;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    w.appendChild(l); w.appendChild(wrap);
    container.appendChild(w);
};

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
                container.textContent = '';
                const empty = document.createElement('div');
                empty.style.opacity = '0.5';
                empty.textContent = 'Nenhuma métrica encontrada.';
                container.appendChild(empty);
                return;
            }

        // Filtra cada array se não for visão global
        const metrics = {
            instagram: isGlobalView ? rawMetrics.instagram : (rawMetrics.instagram || []).filter(m => m.cliente_id === curProj),
            metaAds: isGlobalView ? rawMetrics.metaAds : (rawMetrics.metaAds || []).filter(m => m.cliente_id === curProj),
            ga4: isGlobalView ? rawMetrics.ga4 : (rawMetrics.ga4 || []).filter(m => m.cliente_id === curProj),
            searchConsole: isGlobalView ? rawMetrics.searchConsole : (rawMetrics.searchConsole || []).filter(m => m.cliente_id === curProj)
        };

        container.textContent = '';

        // Se após o filtro, todos os arrays estiverem vazios
        const isEmpty = !metrics.instagram?.length && !metrics.metaAds?.length && !metrics.ga4?.length && !metrics.searchConsole?.length;
        if (isEmpty) {
            const empty2 = document.createElement('div');
            empty2.style.opacity = '0.5';
            empty2.textContent = 'Nenhuma métrica encontrada para este projeto.';
            container.appendChild(empty2);
            return;
        }

        renderMetricsTable(container, 'Instagram Diário', ['Cliente', 'Seguidores Novos', 'Alcance'], metrics.instagram, m => [m.cliente_id, m.seguidores_novos, m.alcance]);
        renderMetricsTable(container, 'Meta Ads', ['Cliente', 'Investimento', 'CPL'], metrics.metaAds, m => [m.cliente_id, 'R$ ' + m.investimento, 'R$ ' + m.cpl]);
        renderMetricsTable(container, 'Google Analytics 4', ['Cliente', 'Sessões', 'Conversões'], metrics.ga4, m => [m.cliente_id, m.sessoes, m.conversoes]);
        renderMetricsTable(container, 'Google Search Console', ['Cliente', 'Impressões', 'Cliques'], metrics.searchConsole, m => [m.cliente_id, m.impressoes_organicas, m.cliques_organicos]);

    } catch (e) {
        console.error(e);
        container.textContent = '';
        const err = document.createElement('div');
        err.style.color = 'var(--os-danger)';
        err.textContent = 'Erro ao carregar métricas.';
        container.appendChild(err);
    }
}

initPage();
