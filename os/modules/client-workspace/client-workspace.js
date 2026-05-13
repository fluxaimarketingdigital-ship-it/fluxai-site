import { ModuleLayout } from '../../components/module-layout.js';
import { clientWorkspaceData } from './client-workspace.data.js';

export const ClientWorkspace = {
    init: () => {
        ModuleLayout.init('client-workspace');
        ClientWorkspace.render();
        ClientWorkspace.bindEvents();
    },

    render: () => {
        const { project, approvals, deliverables, timeline, insights, results } = clientWorkspaceData;

        // 1. Informações do Projeto
        const projectMeta = document.getElementById('project-meta');
        if (projectMeta) {
            projectMeta.innerHTML = `
                <h2>${project.name}</h2>
                <p>Status: <strong>${project.status}</strong> | Próximo Milestone: <strong>${project.nextMilestone}</strong></p>
            `;
        }

        const progressFill = document.querySelector('.progress-fill');
        const progressVal = document.getElementById('progress-val');
        if (progressFill && progressVal) {
            progressFill.style.width = `${project.progress}%`;
            progressVal.textContent = `${project.progress}%`;
        }

        // 2. Resultados Estratégicos (Métricas Executivas)
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = results.map(res => {
                const trendIcon = res.trend === 'up' ? 'fa-arrow-trend-up' : (res.trend === 'down' ? 'fa-arrow-trend-down' : 'fa-minus');
                const trendClass = res.trend === 'up' ? 'trend-up' : (res.trend === 'down' ? 'trend-down' : '');
                
                return `
                    <div class="os-widget" style="background: rgba(255,255,255,0.01); border: 1px solid var(--os-border); padding: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                            <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--os-text-muted); letter-spacing: 1px;">${res.title}</span>
                            <i class="fa-solid ${trendIcon} ${trendClass}" style="font-size: 0.8rem;"></i>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">${res.value}</div>
                        <p style="font-size: 0.75rem; color: var(--os-text-muted); margin: 0; line-height: 1.4;">${res.desc}</p>
                    </div>
                `;
            }).join('');
        }

        // 3. Aprovações
        const approvalsContainer = document.getElementById('approvals-container');
        if (approvalsContainer) {
            if (approvals.length === 0) {
                approvalsContainer.innerHTML = '<p style="font-size: 0.85rem; color: var(--os-text-muted); padding: 20px;">Nenhuma aprovação pendente no momento.</p>';
            } else {
                approvalsContainer.innerHTML = approvals.map(app => `
                    <div class="approval-card" style="margin-bottom: 12px; padding: 20px; border-radius: 4px;">
                        <div class="approval-info">
                            <span style="font-size: 0.6rem; text-transform: uppercase; color: var(--os-primary); font-weight: 700;">${app.type}</span>
                            <h4 style="margin: 5px 0;">${app.title}</h4>
                            <span style="font-size: 0.75rem; opacity: 0.7;">Prazo: ${app.deadline}</span>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="os-btn os-btn-success client-approve" data-id="${app.id}" style="padding: 10px 20px; font-size: 0.75rem;">APROVAR</button>
                            <button class="os-btn os-btn-outline" data-id="${app.id}" style="padding: 10px 20px; font-size: 0.75rem; opacity: 0.6;">REVISÃO</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 4. Insights Executivos
        const insightsContainer = document.getElementById('insights-container');
        if (insightsContainer) {
            insightsContainer.innerHTML = insights.map(ins => `
                <div class="insight-mini" style="margin-bottom: 15px; border-left: 3px solid var(--os-primary); padding-left: 15px;">
                    <h5 style="color: #fff; margin-bottom: 8px; font-size: 0.85rem;">${ins.title}</h5>
                    <p style="font-size: 0.8rem; line-height: 1.5; color: var(--os-text-muted);">${ins.desc}</p>
                </div>
            `).join('');
        }

        // 5. Timeline Executiva
        const timelineContainer = document.getElementById('timeline-container');
        if (timelineContainer) {
            timelineContainer.innerHTML = timeline.map(tm => `
                <div class="timeline-item ${tm.status}">
                    <span class="time-label" style="font-weight: 700; color: ${tm.status === 'concluído' ? 'var(--os-success)' : (tm.status === 'processando' ? 'var(--os-info)' : 'var(--os-text-muted)')}">${tm.time}</span>
                    <p class="time-msg" style="margin-top: 5px; font-weight: 500;">${tm.message}</p>
                </div>
            `).join('');
        }

        // 6. Entregas
        const deliverableBody = document.getElementById('deliverable-body');
        if (deliverableBody) {
            deliverableBody.innerHTML = deliverables.map(del => `
                <tr>
                    <td><strong style="color: #fff;">${del.title}</strong><br><span style="font-size: 0.7rem; color: var(--os-text-muted);">${del.type}</span></td>
                    <td><code style="font-family: var(--os-font-mono); font-size: 0.75rem; opacity: 0.8;">${del.version}</code></td>
                    <td><span class="os-badge" style="background: rgba(255,255,255,0.05); color: #fff; font-size: 0.65rem;">${del.status}</span></td>
                    <td style="color: var(--os-text-muted); font-size: 0.8rem;">${del.date}</td>
                </tr>
            `).join('');
        }
    },

    bindEvents: () => {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('client-approve')) {
                const id = e.target.dataset.id;
                ClientWorkspace.approve(id);
            }
        });
    },

    approve: (id) => {
        const app = clientWorkspaceData.approvals.find(a => a.id === id);
        if (!app) return;

        // Simular aprovação
        clientWorkspaceData.approvals = clientWorkspaceData.approvals.filter(a => a.id !== id);
        
        // Adicionar à timeline
        clientWorkspaceData.timeline.unshift({
            time: "AGORA",
            message: `Aprovado pelo cliente: ${app.title}`,
            status: 'concluído'
        });

        ClientWorkspace.render();
    }
};

document.addEventListener('DOMContentLoaded', () => ClientWorkspace.init());
