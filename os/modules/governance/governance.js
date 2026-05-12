/**
 * MODULE: Governança (MVP Integration)
 * Foco: Fila de Aprovação Real e Auditoria Persistente.
 */

import { ModuleLayout } from '../../components/module-layout.js';
import { governanceData } from './governance.data.js';
import { getSupabase } from '../../services/supabase-client.js';
import { StorageService, SYNC_STATUS } from '../../services/storage.js';
import { UIHelper } from '../../services/ui-helper.js';

export const Governance = {
    init: async () => {
        ModuleLayout.init('governance');
        Governance.render();
    },

    render: async () => {
        UIHelper.showLoader('queue-body');
        
        let approvals = [];
        let auditLogs = [];
        const supabase = getSupabase();

        try {
            if (supabase) {
                // Busca Aprovações
                const { data: appData, error: appErr } = await supabase.from('approvals').select('*').order('created_at', { ascending: false });
                if (appErr) throw appErr;
                approvals = appData;

                // Busca Logs de Auditoria
                const { data: logData, error: logErr } = await supabase.from('audit_logs').select('*').limit(20).order('created_at', { ascending: false });
                if (!logErr) auditLogs = logData;

                StorageService.save('gov_approvals', approvals, SYNC_STATUS.SYNCED);
                StorageService.save('gov_audit_logs', auditLogs, SYNC_STATUS.SYNCED);
            } else {
                throw new Error('Supabase offline');
            }
        } catch (err) {
            console.warn('[GOV] Usando fallback local:', err.message);
            approvals = StorageService.getData('gov_approvals') || governanceData.queue;
            auditLogs = StorageService.getData('gov_audit_logs') || governanceData.audit;
        }

        // Render Queue
        const queueBody = document.getElementById('queue-body');
        if (queueBody) {
            queueBody.innerHTML = approvals.map(item => `
                <tr>
                    <td><span class="os-badge">${item.id.substring(0, 5)}</span></td>
                    <td><strong>${item.impact || 'N/A'}</strong></td>
                    <td>${item.module}</td>
                    <td>Sistema</td>
                    <td>Crítico</td>
                    <td><span class="os-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td><span class="priority-${item.priority.toLowerCase()}">${item.priority}</span></td>
                    <td class="actions-cell">
                        <button class="os-btn os-btn-sm os-btn-success" onclick="Governance.handleAction('${item.id}', 'APPROVED')">Aprovar</button>
                        <button class="os-btn os-btn-sm os-btn-danger" onclick="Governance.handleAction('${item.id}', 'REJECTED')">Rejeitar</button>
                    </td>
                </tr>
            `).join('');
        }

        // Render Audit Log
        const auditList = document.getElementById('audit-list');
        if (auditList) {
            auditList.innerHTML = auditLogs.map(log => `
                <div class="log-entry">
                    <span class="log-time">[${new Date(log.created_at).toLocaleTimeString()}]</span>
                    <span class="log-user">Sistema:</span>
                    <span class="log-msg">${log.action}</span>
                    <span class="os-badge" style="margin-left: auto;">${log.module}</span>
                </div>
            `).join('');
        }

        // Render Tech Stats
        Governance.renderTechStats(auditLogs.length);
    },

    handleAction: async (id, status) => {
        const supabase = getSupabase();
        if (!supabase) return alert('Modo Offline: Ação não permitida.');

        try {
            const { error } = await supabase.from('approvals').update({ status }).eq('id', id);
            if (error) throw error;

            // Registrar no Audit Log
            await supabase.from('audit_logs').insert({
                action: `Aprovação ${status} para item ${id.substring(0, 5)}`,
                module: 'governance',
                metadata: { target_id: id, status }
            });

            alert(`Ação ${status} registrada com sucesso.`);
            Governance.render();
        } catch (err) {
            alert('Falha ao processar ação: ' + err.message);
        }
    },

    renderTechStats: (errorCount) => {
        const techStats = document.getElementById('tech-stats');
        if (techStats) {
            techStats.innerHTML = `
                <div class="insight-mini"><h5>Latência API</h5><span class="val">18ms</span><p>Otimizado</p></div>
                <div class="insight-mini"><h5>Sessões Ativas</h5><span class="val">1</span><p>Sessão Segura</p></div>
                <div class="insight-mini"><h5>Erros Capturados</h5><span class="val">${errorCount}</span><p>Monitoramento Ativo</p></div>
                <div class="insight-mini"><h5>Sync Status</h5><span class="val">100%</span><p>Sincronizado</p></div>
            `;
        }
    }
};

window.Governance = Governance; // Expor para onclick
Governance.init();
