import { ModuleLayout } from '../../components/module-layout.js';
import { intelligenceData } from './intelligence.data.js';

export const IntelligenceLayer = {
    init: () => {
        ModuleLayout.init('intelligence');
        IntelligenceLayer.render();
    },

    render: () => {
        // 1. Aprendizados Operacionais
        const learningsContainer = document.getElementById('learnings-container');
        if (learningsContainer) {
            learningsContainer.innerHTML = intelligenceData.learnings.map(lrn => `
                <div class="os-learning-card severity-${lrn.severity}">
                    <div class="card-header">
                        <span class="learning-id">${lrn.id}</span>
                        <div class="module-tags">
                            ${lrn.modules.map(m => `<span class="tag">${m}</span>`).join('')}
                        </div>
                    </div>
                    <h4>${lrn.title}</h4>
                    <p>${lrn.insight}</p>
                    <div class="card-footer">
                        <strong>Impacto:</strong> ${lrn.impact}
                    </div>
                </div>
            `).join('');
        }

        // 2. Insights Contextuais (Métricas de Cruzamento)
        const ctxContainer = document.getElementById('context-container');
        if (ctxContainer) {
            ctxContainer.innerHTML = intelligenceData.contextualInsights.map(ctx => `
                <div class="ctx-item">
                    <div class="ctx-info">
                        <span class="ctx-label">${ctx.label}</span>
                        <span class="ctx-context">${ctx.context}</span>
                    </div>
                    <div class="ctx-value-group">
                        <span class="ctx-value">${ctx.value}</span>
                        <span class="ctx-trend">${ctx.trend}</span>
                    </div>
                </div>
            `).join('');
        }

        // 3. Apoio à Decisão
        const decisionContainer = document.getElementById('decision-container');
        if (decisionContainer) {
            decisionContainer.innerHTML = intelligenceData.decisionSupport.map(ds => `
                <div class="os-decision-card severity-${ds.severity}">
                    <div class="decision-content">
                        <h4>${ds.title}</h4>
                        <p>${ds.desc}</p>
                    </div>
                    <button class="os-btn os-btn-outline">${ds.action}</button>
                </div>
            `).join('');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => IntelligenceLayer.init());
