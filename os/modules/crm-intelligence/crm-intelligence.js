/**
 * MODULE: CRM Intelligence (MVP Integration)
 * Foco: Persistência Real via Supabase com Fallback Local.
 */

import { ModuleLayout } from '../../components/module-layout.js';
import { crmIntelligenceData } from './crm-intelligence.data.js';
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
            leads = StorageService.getData('crm_leads') || crmIntelligenceData.leads;
        }

        const tableBody = document.getElementById('leads-table-body');
        if (tableBody) {
            if (leads.length === 0) {
                UIHelper.showEmptyState('leads-table-body', 'Nenhuma conta estratégica identificada.');
                return;
            }

            tableBody.innerHTML = leads.map(lead => {
                const companyName = lead.company || lead.name || 'Empresa N/A';
                const contactName = lead.contact || (lead.company ? lead.name : 'Contato N/A');
                const temperature = lead.status || lead.temperature || 'Morna';
                const healthVal = lead.healthScore !== undefined ? lead.healthScore : (lead.health === 'OPTIMAL' ? 95 : 60);
                const healthClass = healthVal > 80 ? 'var(--os-success)' : 'var(--os-warning)';

                return `
                    <tr>
                        <td><span class="os-badge">${lead.id.substring(0, 5)}</span></td>
                        <td><strong>${companyName}</strong></td>
                        <td>${contactName}</td>
                        <td><span class="temp-${temperature === 'PROPOSAL' || temperature === 'Quente' || temperature === 'QUENTE' ? 'quente' : 'morna'}">${temperature}</span></td>
                        <td>
                            <div class="health-bar-bg">
                                <div class="health-bar-fill" style="width: ${healthVal}%; background: ${healthClass}"></div>
                            </div>
                        </td>
                        <td><button class="os-btn os-btn-sm os-btn-outline">Ver Detalhes</button></td>
                    </tr>
                `;
            }).join('');
        }

        // Render Metrics
        CRMIntelligence.renderMetrics(crmIntelligenceData.metrics);
    },

    renderMetrics: (metrics) => {
        metrics.forEach(metric => {
            const el = document.getElementById(metric.id);
            if (el) {
                el.innerHTML = `
                    <div class="os-widget-header"><span class="os-widget-label">${metric.label}</span></div>
                    <div class="os-metric">
                        <div class="os-metric-value">${metric.value}</div>
                        <div class="os-metric-meta">
                            <span class="trend-up"><i class="fa-solid fa-arrow-up"></i> ${metric.trend}</span>
                            <span>vs mês anterior</span>
                        </div>
                    </div>
                `;
            }
        });
    }
};

CRMIntelligence.init();
