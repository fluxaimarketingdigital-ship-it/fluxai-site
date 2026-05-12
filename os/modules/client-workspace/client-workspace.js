import { ModuleLayout } from '../../components/module-layout.js';
import { clientWorkspaceData } from './client-workspace.data.js';
import { NotificationService } from '../../services/notifications.js';

export const ClientWorkspace = {
    init: () => {
        ModuleLayout.init('client-workspace');
        ClientWorkspace.render();
        ClientWorkspace.bindEvents();
    },

    render: () => {
        const { project, approvals, deliverables, timeline, insights, nextSteps } = clientWorkspaceData;

        // 1. Project Info
        const projectMeta = document.getElementById('project-meta');
        if (projectMeta) {
            projectMeta.innerHTML = `
                <h2>${project.name}</h2>
                <p>Ambiente Operacional Ativo | Prazo: ${project.deadline}</p>
            `;
        }

        const progressFill = document.querySelector('.progress-fill');
        const progressVal = document.getElementById('progress-val');
        if (progressFill && progressVal) {
            progressFill.style.width = `${project.progress}%`;
            progressVal.textContent = `${project.progress}%`;
        }

        // 2. Approvals
        const approvalsContainer = document.getElementById('approvals-container');
        if (approvalsContainer) {
            if (approvals.length === 0) {
                approvalsContainer.innerHTML = '<p style="font-size: 0.85rem; color: var(--os-text-muted);">Nenhuma aprovação pendente no momento.</p>';
            } else {
                approvalsContainer.innerHTML = approvals.map(app => `
                    <div class="approval-card" id="app-${app.id}">
                        <div class="approval-info">
                            <h4>${app.title}</h4>
                            <span>Prazo: ${app.deadline} | ${app.module}</span>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="os-btn os-btn-success client-approve" data-id="${app.id}">Aprovar</button>
                            <button class="os-btn os-btn-outline" data-id="${app.id}">Revisão</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 3. Insights
        const insightsContainer = document.getElementById('insights-container');
        if (insightsContainer) {
            insightsContainer.innerHTML = insights.map(ins => `
                <div class="insight-mini">
                    <h5>${ins.title}</h5>
                    <span class="val">${ins.value}</span>
                    <p>${ins.desc}</p>
                </div>
            `).join('');
        }

        // 4. Timeline
        const timelineContainer = document.getElementById('timeline-container');
        if (timelineContainer) {
            timelineContainer.innerHTML = timeline.map(tm => `
                <div class="timeline-item ${tm.status}">
                    <span class="time-label">${tm.time}</span>
                    <p class="time-msg">${tm.message}</p>
                </div>
            `).join('');
        }

        // 5. Deliverables
        const deliverableBody = document.getElementById('deliverable-body');
        if (deliverableBody) {
            deliverableBody.innerHTML = deliverables.map(del => `
                <tr>
                    <td><strong>${del.title}</strong></td>
                    <td><code style="font-size: 0.7rem;">${del.version}</code></td>
                    <td><span class="os-badge status-${del.status.toLowerCase().replace(' ', '-')}">${del.status}</span></td>
                    <td style="color: var(--os-text-muted);">${del.date}</td>
                </tr>
            `).join('');
        }

        // 6. Next Steps
        const stepsContainer = document.getElementById('steps-container');
        if (stepsContainer) {
            stepsContainer.innerHTML = nextSteps.map(step => `
                <div class="step-item">
                    <span>${step.task}</span>
                    <span class="step-date">${step.due}</span>
                </div>
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

        // Simulate approval
        clientWorkspaceData.approvals = clientWorkspaceData.approvals.filter(a => a.id !== id);
        
        // Add to timeline
        const now = new Date();
        const timeStr = `Hoje, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        clientWorkspaceData.timeline.unshift({
            time: timeStr,
            message: `Aprovado pelo cliente: ${app.title}`,
            status: 'concluído'
        });

        NotificationService.notify('Sucesso', 'Item aprovado e enviado para produção.', 'info');
        ClientWorkspace.render();
    }
};

document.addEventListener('DOMContentLoaded', () => ClientWorkspace.init());
