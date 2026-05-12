import { ModuleLayout } from '../../components/module-layout.js';
import { MetricCard } from '../../components/metric-card.js';
import { contentEngineData } from './content-engine.data.js';

export const ContentEngine = {
    init: () => {
        ModuleLayout.init('content-engine');
        ContentEngine.render();
    },

    render: () => {
        // Métricas
        contentEngineData.metrics.forEach(metric => {
            MetricCard.render(metric.id, metric);
        });

        // Tabela de Pipeline
        const tableBody = document.getElementById('pipeline-table-body');
        if (tableBody) {
            tableBody.innerHTML = contentEngineData.pipeline.map(item => `
                <tr>
                    <td><code>${item.id}</code></td>
                    <td><strong>${item.title}</strong></td>
                    <td><span class="os-badge">${item.stage}</span></td>
                    <td><span class="os-priority-${item.priority.toLowerCase()}">${item.priority}</span></td>
                    <td>${item.owner}</td>
                    <td>${item.deadline}</td>
                </tr>
            `).join('');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => ContentEngine.init());
