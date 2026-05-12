import { ModuleLayout } from '../../components/module-layout.js';
import { automationHubData } from './automation-hub.data.js';

export const AutomationHub = {
    init: () => {
        ModuleLayout.init('automation-hub');
        AutomationHub.render();
    },

    render: () => {
        // 1. Integrações
        const intContainer = document.getElementById('integrations-container');
        if (intContainer) {
            intContainer.innerHTML = automationHubData.integrations.map(int => `
                <div class="integration-card">
                    <i class="${int.icon}" style="font-size: 1.2rem; color: var(--os-text-muted);"></i>
                    <div style="flex-grow: 1;">
                        <div style="font-size: 0.85rem; font-weight: 600;">${int.label}</div>
                        <div style="font-size: 0.65rem; color: var(--os-text-muted); text-transform: uppercase;">${int.status}</div>
                    </div>
                    <div class="int-status status-${int.status.replace(' ', '-')}"></div>
                </div>
            `).join('');
        }

        // 2. Fluxos
        const flowsContainer = document.getElementById('flows-container');
        if (flowsContainer) {
            flowsContainer.innerHTML = automationHubData.flows.map(flow => `
                <div class="os-flow-item">
                    <div>
                        <div style="font-weight: 600; font-size: 0.9rem;">${flow.name}</div>
                        <div class="flow-path">
                            <span>${flow.trigger}</span>
                            <i class="fa-solid fa-chevron-right"></i>
                            <span>${flow.target}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span class="os-badge">${flow.impact}</span>
                        <div style="font-size: 0.7rem; color: var(--os-text-muted); margin-top: 5px;">Status: ${flow.status}</div>
                    </div>
                </div>
            `).join('');
        }

        // 3. Alertas
        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            alertsContainer.innerHTML = automationHubData.alerts.map(alert => `
                <div class="os-alert-card" style="border-left-color: ${alert.priority === 'crítica' ? 'var(--os-danger)' : 'var(--os-warning)'}">
                    <h4 style="color: ${alert.priority === 'crítica' ? 'var(--os-danger)' : 'var(--os-warning)'}">${alert.title}</h4>
                    <p>${alert.message}</p>
                </div>
            `).join('');
        }

        // 4. Fila
        const queueContainer = document.getElementById('queue-container');
        if (queueContainer) {
            queueContainer.innerHTML = automationHubData.queue.map(exe => `
                <div class="exec-row">
                    <code>${exe.id}</code>
                    <span>${exe.flow}</span>
                    <div><span class="status-pill pill-${exe.status}">${exe.status}</span></div>
                    <span style="color: var(--os-text-muted);">${exe.time}</span>
                </div>
            `).join('');
        }

        // 5. Logs
        const logsContainer = document.getElementById('logs-container');
        if (logsContainer) {
            logsContainer.innerHTML = automationHubData.logs.map(log => `
                <div class="log-entry" style="border-left: 2px solid var(--os-${log.type === 'error' ? 'danger' : (log.type === 'warning' ? 'warning' : 'success')}); padding-left: 10px;">
                    <span class="log-time">[${log.time}]</span>
                    <span class="log-msg">${log.message}</span>
                </div>
            `).join('');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => AutomationHub.init());
