/**
 * COMPONENT: Topbar OS
 */

import { OS_AUTH } from '../core/auth.js';

export const TopbarOS = {
    render: () => {
        const session = OS_AUTH.getSession();
        const userName = session ? session.name : 'Usuário';
        const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

        const html = `
            <div class="os-topbar-left">
                <button class="os-menu-toggle" id="menuToggle">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div class="os-status-indicator">
                    <span class="os-dot"></span>
                    SISTEMA OPERACIONAL ATIVO
                </div>
            </div>
            <div class="os-topbar-right">
                <div class="os-user-profile">
                    <div class="os-avatar">${userInitials}</div>
                    <span>${userName}</span>
                </div>
                <button class="os-btn os-btn-outline os-btn-sm" id="logoutBtn" style="padding: 6px 12px;">
                    <i class="fa-solid fa-power-off"></i>
                </button>
            </div>
        `;

        const container = document.querySelector('.os-topbar');
        if (container) {
            container.innerHTML = html;
            TopbarOS.bindEvents();
        }
    },

    bindEvents: () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => OS_AUTH.logout());
        }

        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.os-sidebar');
                if (sidebar) sidebar.classList.toggle('active');
            });
        }
    }
};
