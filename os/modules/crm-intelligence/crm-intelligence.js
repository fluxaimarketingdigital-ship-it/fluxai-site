/**
 * MODULE: CRM Intelligence (MVP Integration)
 * Foco: Persistência Real via Supabase com Fallback Local.
 */

import { ModuleLayout } from '../../components/module-layout.js';
import { crmData } from './crm-intelligence.data.js';
import { getSupabase } from '../../services/supabase-client.js';
import { StorageService, SYNC_STATUS } from '../../services/storage.js';
import { UIHelper } from '../../services/ui-helper.js';

export const CRMIntelligence = {
    init: async () => {
        ModuleLayout.init('crm-intelligence');
        CRMIntelligence.render();
    },

    render: async () => {
        UIHelper.showLoader('leads-table-body');

        let leads = [];
        const supabase = getSupabase();

        try {
            if (supabase) {
                // Tenta buscar do Supabase
                const { data, error } = await supabase.from('leads').select('*').order('updated_at', { ascending: false });
                
                if (error) throw error;
                
                leads = data;
                // Salva no cache local como sincronizado
                StorageService.save('crm_leads', leads, SYNC_STATUS.SYNCED);
            } else {
                throw new Error('Supabase não configurado');
            }
        } catch (err) {
            console.warn('[CRM] Usando fallback local devido a:', err.message);
            // Fallback para cache local ou dados estáticos
            leads = StorageService.getData('crm_leads') || crmData.accounts;
        }

        const tableBody = document.getElementById('leads-table-body');
        if (tableBody) {
            if (leads.length === 0) {
                UIHelper.showEmptyState('leads-table-body', 'Nenhuma conta estratégica identificada.');
                return;
            }

            tableBody.innerHTML = leads.map(lead => `
                <tr>
                    <td><span class="os-badge">${lead.id.substring(0, 5)}</span></td>
                    <td><strong>${lead.company}</strong></td>
                    <td>${lead.name}</td>
                    <td><span class="temp-${lead.status === 'PROPOSAL' ? 'quente' : 'morna'}">${lead.status}</span></td>
                    <td>
                        <div class="health-bar-bg">
                            <div class="health-bar-fill" style="width: ${lead.health === 'OPTIMAL' ? '100' : '60'}%; background: ${lead.health === 'OPTIMAL' ? 'var(--os-success)' : 'var(--os-warning)'}"></div>
                        </div>
                    </td>
                    <td><button class="os-btn os-btn-sm os-btn-outline">Ver Detalhes</button></td>
                </tr>
            `).join('');
        }

        // Render Metrics (Ainda usando mock por enquanto para não explodir complexidade)
        CRMIntelligence.renderMetrics(crmData.metrics);
    },

    renderMetrics: (metrics) => {
        const containers = {
            'metric-opps': metrics.opps,
            'metric-cycle': metrics.cycle,
            'metric-retention': metrics.retention,
            'metric-value': metrics.value
        };

        Object.entries(containers).forEach(([id, data]) => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = `
                    <div class="os-widget-header"><span class="os-widget-label">${data.label}</span></div>
                    <div class="os-metric">
                        <div class="os-metric-value">${data.value}</div>
                        <div class="os-metric-meta">
                            <span class="trend-up"><i class="fa-solid fa-arrow-up"></i> ${data.trend}</span>
                            <span>vs mês anterior</span>
                        </div>
                    </div>
                `;
            }
        });
    }
};

CRMIntelligence.init();
