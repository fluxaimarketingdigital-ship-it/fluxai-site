import { ModuleLayout } from '../../components/module-layout.js';
import { automationHubData } from './automation-hub.data.js';

export const AutomationHub = {
    init: () => {
        ModuleLayout.init('automation-hub');
        AutomationHub.render();
    },

    render: () => {
        // 1. Integrações (Cockpit de Conectividade)
        const intContainer = document.getElementById('integrations-container');
        if (intContainer) {
            intContainer.innerHTML = automationHubData.integrations.map(int => `
                <div class="integration-card">
                    <div class="int-icon-box">
                        <i class="${int.icon}"></i>
                    </div>
                    <div style="flex-grow: 1;">
                        <div style="font-size: 0.85rem; font-weight: 700; color:#fff;">${int.label}</div>
                        <div style="font-size: 0.6rem; color: var(--os-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${int.status}</div>
                    </div>
                    <div class="int-status status-${int.status.toLowerCase().replace(' ', '-') || 'estável'}"></div>
                </div>
            `).join('');
        }

        // 2. Fluxos Estratégicos
        const flowsContainer = document.getElementById('flows-container');
        if (flowsContainer) {
            flowsContainer.innerHTML = automationHubData.flows.map(flow => `
                <div class="os-flow-item">
                    <div>
                        <div style="font-weight: 700; font-size: 0.85rem; color:#fff; margin-bottom: 5px;">${flow.name}</div>
                        <div class="flow-path">
                            <span style="opacity: 0.7;">${flow.trigger}</span>
                            <i class="fa-solid fa-bolt-lightning" style="font-size: 0.6rem; opacity: 0.5;"></i>
                            <span style="color: var(--os-primary); font-weight: 600;">${flow.target}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.55rem; background: rgba(142, 158, 104, 0.1); color: var(--os-primary); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--os-border); font-weight: 800;">${flow.impact}</span>
                        <div style="font-size: 0.65rem; color: var(--os-text-muted); margin-top: 6px; font-weight: 500;">${flow.status.toUpperCase()}</div>
                    </div>
                </div>
            `).join('');
        }

        // 3. Alertas de Confiabilidade
        const alertsContainer = document.getElementById('alerts-container');
        if (alertsContainer) {
            alertsContainer.innerHTML = automationHubData.alerts.map(alert => {
                const isCritical = alert.priority.toLowerCase() === 'crítica';
                return `
                    <div class="os-alert-card" style="border-left-color: ${isCritical ? 'var(--os-danger)' : 'var(--os-warning)'}">
                        <h4 style="color: ${isCritical ? 'var(--os-danger)' : 'var(--os-warning)'}; text-transform: uppercase; letter-spacing: 0.5px;">${alert.title}</h4>
                        <p>${alert.message}</p>
                    </div>
                `;
            }).join('');
        }

        // 4. Fila de Execução em Tempo Real
        const queueContainer = document.getElementById('queue-container');
        if (queueContainer) {
            queueContainer.innerHTML = automationHubData.queue.map(exe => `
                <div class="exec-row">
                    <code style="color: var(--os-primary); opacity: 0.8;">#${exe.id}</code>
                    <span style="font-weight: 600; color: #fff;">${exe.flow}</span>
                    <div><span class="status-pill pill-${exe.status.toLowerCase()}">${exe.status}</span></div>
                    <span style="color: var(--os-text-muted); opacity: 0.7; text-align: right;">${exe.time}</span>
                </div>
            `).join('');
        }

        // 5. Eventos Operacionais Recentes
        const logsContainer = document.getElementById('logs-container');
        if (logsContainer) {
            logsContainer.innerHTML = automationHubData.logs.map(log => `
                <div class="log-entry">
                    <span class="log-time">[${log.time}]</span>
                    <span class="log-user" style="color: var(--os-${log.type === 'error' ? 'danger' : (log.type === 'warning' ? 'warning' : 'primary')});">
                        ${log.type.toUpperCase()}:
                    </span>
                    <span class="log-msg">${log.message}</span>
                </div>
            `).join('');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => AutomationHub.init());
