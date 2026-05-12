/**
 * MODULE: Analytics (MVP Integration)
 * Foco: Leitura de Snapshots Reais do Supabase.
 */

import { ModuleLayout } from '../../components/module-layout.js';
import { analyticsData } from './analytics.data.js';
import { getSupabase } from '../../services/supabase-client.js';
import { StorageService, SYNC_STATUS } from '../../services/storage.js';
import { UIHelper } from '../../services/ui-helper.js';

export const Analytics = {
    init: async () => {
        ModuleLayout.init('analytics');
        Analytics.render();
    },

    render: async () => {
        UIHelper.showLoader('insights-container');
        
        let snapshots = [];
        const supabase = getSupabase();

        try {
            if (supabase) {
                const { data, error } = await supabase.from('analytics_snapshots').select('*').order('timestamp', { ascending: false });
                if (error) throw error;
                snapshots = data;
                StorageService.save('analytics_snapshots', snapshots, SYNC_STATUS.SYNCED);
            } else {
                throw new Error('Supabase offline');
            }
        } catch (err) {
            console.warn('[ANALYTICS] Usando fallback local:', err.message);
            snapshots = StorageService.getData('analytics_snapshots') || [];
        }

        // Render Metrics
        Analytics.renderMetrics(analyticsData.metrics);
        
        // Render Insights
        Analytics.renderInsights(analyticsData.insights);

        // Se houver snapshots reais, poderíamos injetar aqui (Fase futura de gráficos reais)
    },

    renderMetrics: (metrics) => {
        const containers = {
            'metric-mrr': metrics.mrr,
            'metric-cac': metrics.cac,
            'metric-ltv': metrics.ltv,
            'metric-conversion': metrics.conversion
        };

        Object.entries(containers).forEach(([id, data]) => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = `
                    <div class="os-widget-header"><span class="os-widget-label">${data.label}</span></div>
                    <div class="os-metric">
                        <div class="os-metric-value">${data.value}</div>
                        <div class="os-metric-meta">
                            <span class="${data.trend.includes('+') ? 'trend-up' : 'trend-down'}">${data.trend}</span>
                            <span>vs período anterior</span>
                        </div>
                    </div>
                `;
            }
        });
    },

    renderInsights: (insights) => {
        const container = document.getElementById('insights-container');
        if (container) {
            container.innerHTML = insights.map(ins => `
                <div class="os-insight-card ${ins.type === 'ALERTA' ? 'os-border-warning' : 'os-border-success'}">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span class="os-widget-label">${ins.type}</span>
                        <span class="os-badge">${ins.module}</span>
                    </div>
                    <h4 style="margin: 0 0 10px 0; font-size: 0.95rem;">${ins.title}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: var(--os-text-muted); line-height: 1.5;">${ins.content}</p>
                </div>
            `).join('');
        }
    }
};

Analytics.init();
