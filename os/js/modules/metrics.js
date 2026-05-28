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

        let html = '';

        // Se após o filtro, todos os arrays estiverem vazios
        const isEmpty = !metrics.instagram?.length && !metrics.metaAds?.length && !metrics.ga4?.length && !metrics.searchConsole?.length;
        if (isEmpty) {
            container.textContent = '';
            const empty2 = document.createElement('div');
            empty2.style.opacity = '0.5';
            empty2.textContent = 'Nenhuma métrica encontrada para este projeto.';
            container.appendChild(empty2);
            return;
        }

        // Instagram
        if (metrics.instagram) {
            html += `<div class="os-widget half">
                <span class="os-widget-label">Instagram Diário</span>
                <div class="os-table-wrapper" style="margin-top: 15px;">
                    <table class="os-table">
                        <thead><tr><th>Cliente</th><th>Seguidores Novos</th><th>Alcance</th></tr></thead>
            const w = document.createElement('div'); w.className = 'os-widget half';
            const l = document.createElement('span'); l.className = 'os-widget-label'; l.textContent = 'Instagram Diário';
            const wrap = document.createElement('div'); wrap.className = 'os-table-wrapper'; wrap.style.marginTop = '15px';
            const table = document.createElement('table'); table.className = 'os-table';
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            ['Cliente', 'Seguidores Novos', 'Alcance'].forEach(t => { const th = document.createElement('th'); th.textContent = t; trHead.appendChild(th); });
            thead.appendChild(trHead);
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            metrics.instagram.forEach(m => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td'); td1.className = 'cell-primary'; td1.textContent = m.cliente_id;
                const td2 = document.createElement('td'); td2.className = 'cell-mono'; td2.textContent = m.seguidores_novos;
                const td3 = document.createElement('td'); td3.className = 'cell-mono'; td3.textContent = m.alcance;
                tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            wrap.appendChild(table);
            w.appendChild(l); w.appendChild(wrap);
            container.appendChild(w);
        }
        
        if (metrics.metaAds) {
            const w = document.createElement('div'); w.className = 'os-widget half';
            const l = document.createElement('span'); l.className = 'os-widget-label'; l.textContent = 'Meta Ads';
            const wrap = document.createElement('div'); wrap.className = 'os-table-wrapper'; wrap.style.marginTop = '15px';
            const table = document.createElement('table'); table.className = 'os-table';
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            const th1 = document.createElement('th'); th1.textContent = 'Cliente';
            const th2 = document.createElement('th'); th2.textContent = 'Investimento';
            const th3 = document.createElement('th'); th3.textContent = 'CPL';
            trHead.appendChild(th1); trHead.appendChild(th2); trHead.appendChild(th3);
            thead.appendChild(trHead);
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            metrics.metaAds.forEach(m => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td'); td1.className = 'cell-primary'; td1.textContent = m.cliente_id;
                const td2 = document.createElement('td'); td2.className = 'cell-mono'; td2.textContent = 'R$ ' + m.investimento;
                const td3 = document.createElement('td'); td3.className = 'cell-mono'; td3.textContent = 'R$ ' + m.cpl;
                tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            wrap.appendChild(table);
            w.appendChild(l); w.appendChild(wrap);
            container.appendChild(w);
        }
        
        if (metrics.ga4) {
            const w = document.createElement('div'); w.className = 'os-widget half';
            const l = document.createElement('span'); l.className = 'os-widget-label'; l.textContent = 'Google Analytics 4';
            const wrap = document.createElement('div'); wrap.className = 'os-table-wrapper'; wrap.style.marginTop = '15px';
            const table = document.createElement('table'); table.className = 'os-table';
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            const th1 = document.createElement('th'); th1.textContent = 'Cliente';
            const th2 = document.createElement('th'); th2.textContent = 'Sessões';
            const th3 = document.createElement('th'); th3.textContent = 'Conversões';
            trHead.appendChild(th1); trHead.appendChild(th2); trHead.appendChild(th3);
            thead.appendChild(trHead);
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            metrics.ga4.forEach(m => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td'); td1.className = 'cell-primary'; td1.textContent = m.cliente_id;
                const td2 = document.createElement('td'); td2.className = 'cell-mono'; td2.textContent = m.sessoes;
                const td3 = document.createElement('td'); td3.className = 'cell-mono'; td3.textContent = m.conversoes;
                tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            wrap.appendChild(table);
            w.appendChild(l); w.appendChild(wrap);
            container.appendChild(w);
        }
        
        if (metrics.searchConsole) {
            const w = document.createElement('div'); w.className = 'os-widget half';
            const l = document.createElement('span'); l.className = 'os-widget-label'; l.textContent = 'Google Search Console';
            const wrap = document.createElement('div'); wrap.className = 'os-table-wrapper'; wrap.style.marginTop = '15px';
            const table = document.createElement('table'); table.className = 'os-table';
            const thead = document.createElement('thead');
            const trHead = document.createElement('tr');
            const th1 = document.createElement('th'); th1.textContent = 'Cliente';
            const th2 = document.createElement('th'); th2.textContent = 'Impressões';
            const th3 = document.createElement('th'); th3.textContent = 'Cliques';
            trHead.appendChild(th1); trHead.appendChild(th2); trHead.appendChild(th3);
            thead.appendChild(trHead);
            table.appendChild(thead);
            const tbody = document.createElement('tbody');
            metrics.searchConsole.forEach(m => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td'); td1.className = 'cell-primary'; td1.textContent = m.cliente_id;
                const td2 = document.createElement('td'); td2.className = 'cell-mono'; td2.textContent = m.impressoes_organicas;
                const td3 = document.createElement('td'); td3.className = 'cell-mono'; td3.textContent = m.cliques_organicos;
                tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            wrap.appendChild(table);
            w.appendChild(l); w.appendChild(wrap);
            container.appendChild(w);
        }
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
