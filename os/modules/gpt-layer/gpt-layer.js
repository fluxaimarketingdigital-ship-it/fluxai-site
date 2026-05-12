import { ModuleLayout } from '../../components/module-layout.js';
import { gptLayerData } from './gpt-layer.data.js';
import { NotificationService } from '../../services/notifications.js';

export const GPTLayer = {
    init: () => {
        ModuleLayout.init('gpt-layer');
        GPTLayer.render();
    },

    render: () => {
        // 1. Active Context Bar
        const contextBar = document.getElementById('context-injection-bar');
        if (contextBar) {
            contextBar.innerHTML = gptLayerData.activeContext.map(ctx => `
                <div class="context-pill">
                    <span class="pulse"></span>
                    <span class="ctx-module">${ctx.module}:</span>
                    <span class="ctx-focus">${ctx.focus}</span>
                </div>
            `).join('');
        }

        // 2. Operational Insights
        const insightsGrid = document.getElementById('insights-grid');
        if (insightsGrid) {
            insightsGrid.innerHTML = gptLayerData.operationalInsights.map(ins => `
                <div class="os-insight-card">
                    <div class="insight-header">
                        <span class="insight-type">${ins.type}</span>
                        <span class="insight-ctx">${ins.context}</span>
                    </div>
                    <p class="insight-text">${ins.insight}</p>
                    <button class="os-btn os-btn-primary os-btn-sm action-btn" data-action="${ins.action}">${ins.action}</button>
                </div>
            `).join('');
        }

        // 3. Assisted Workflows
        const workflowContainer = document.getElementById('workflow-container');
        if (workflowContainer) {
            workflowContainer.innerHTML = gptLayerData.assistedWorkflows.map(wf => `
                <div class="workflow-item">
                    <div class="wf-info">
                        <h4>${wf.title}</h4>
                        <p>${wf.description}</p>
                    </div>
                    <div class="wf-draft">
                        <span class="draft-label">Sugestão de Contexto:</span>
                        <div class="draft-content">${wf.suggestedDraft}</div>
                    </div>
                    <div class="wf-actions">
                        <button class="os-btn os-btn-outline os-btn-sm apply-btn">Aplicar ao Módulo</button>
                    </div>
                </div>
            `).join('');
        }

        // 4. Engine Status
        const statusContainer = document.getElementById('engine-status');
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="status-stat"><span>Engine:</span> <strong>${gptLayerData.status.engine}</strong></div>
                <div class="status-stat"><span>Latência:</span> <strong>${gptLayerData.status.latency}</strong></div>
                <div class="status-stat"><span>Profundidade:</span> <strong>${gptLayerData.status.contextDepth}</strong></div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => GPTLayer.init());

// Handle button clicks for simulation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('action-btn') || e.target.classList.contains('apply-btn')) {
        NotificationService.notify('Operação Assistida', 'Ação integrada ao fluxo operacional com sucesso.', 'info');
    }
});
