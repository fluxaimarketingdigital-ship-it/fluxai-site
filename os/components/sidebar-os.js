/**
 * COMPONENT: Sidebar OS (RBAC Aware)
 */

import { ROUTES } from '../config/routes.js';
import { OS_AUTH } from '../core/auth.js';

export const SidebarOS = {
    render: (activeModule) => {
        const session = OS_AUTH.getSession();
        const role = session ? session.role : null;

        let html = `
            <div class="os-sidebar-header">
                <div class="os-brand"><i class="fa-solid fa-cube"></i> FLUXAI <span>OS™</span></div>
            </div>
            <nav class="os-sidebar-nav">`;

        let currentGroup = "";
        
        // Filter routes by role
        const allowedRoutes = ROUTES.filter(route => !role || route.roles.includes(role));

        allowedRoutes.forEach(item => {
            if (item.group !== currentGroup) {
                currentGroup = item.group;
                html += `<span class="os-nav-label">${currentGroup}</span>`;
            }
            html += `
                <a href="${item.path}" class="os-nav-link ${activeModule === item.id ? 'active' : ''}">
                    <i class="fa-solid ${item.icon}"></i> ${item.label}
                </a>`;
        });

        html += `
            </nav>
            <div class="os-sidebar-footer">
                <a href="/index.html" class="os-nav-link"><i class="fa-solid fa-arrow-left"></i> Sair da Interface</a>
            </div>`;
        
        const container = document.querySelector('.os-sidebar');
        if (container) container.innerHTML = html;
    }
};
