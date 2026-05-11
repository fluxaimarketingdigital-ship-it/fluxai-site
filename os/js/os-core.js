/**
 * FLUXAI OS™ CORE ENGINE v1.0.0
 * Gestão de Componentes Operacionais e Estados Globais
 */

export const OS_CONFIG = {
    brand: "FLUXAI OS™",
    version: "v1.0.4_OPERATIONAL",
    status: "ESTÁVEL"
};

// COMPONENTES REUTILIZÁVEIS
export const OS_UI = {
    /**
     * Renderiza a Sidebar padrão da OS
     */
    renderSidebar: (activeModule) => {
        const navItems = [
            { id: 'command-center', label: 'Command Center', icon: 'fa-gauge-high', group: 'Núcleo Estratégico' },
            { id: 'content-engine', label: 'Content Engine', icon: 'fa-pen-nib', group: 'Módulos Operacionais' },
            { id: 'crm-intelligence', label: 'CRM Intelligence', icon: 'fa-users-gear', group: 'Módulos Operacionais' },
            { id: 'automation-hub', label: 'Automation Hub', icon: 'fa-robot', group: 'Módulos Operacionais' },
            { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line', group: 'Módulos Operacionais' },
            { id: 'govos', label: 'GovOS', icon: 'fa-shield-halved', group: 'Governança' }
        ];

        let html = `
            <div class="os-sidebar-header">
                <div class="os-brand"><i class="fa-solid fa-cube"></i> FLUXAI <span>OS™</span></div>
            </div>
            <nav class="os-sidebar-nav">`;

        let currentGroup = "";
        navItems.forEach(item => {
            if (item.group !== currentGroup) {
                currentGroup = item.group;
                html += `<span class="os-nav-label">${currentGroup}</span>`;
            }
            html += `
                <a href="${item.id}.html" class="os-nav-link ${activeModule === item.id ? 'active' : ''}">
                    <i class="fa-solid ${item.icon}"></i> ${item.label}
                </a>`;
        });

        html += `
            </nav>
            <div class="os-sidebar-footer">
                <a href="../pages/fluxai-os.html" class="os-nav-link"><i class="fa-solid fa-arrow-left"></i> Sair da Interface</a>
            </div>`;
        
        document.querySelector('.os-sidebar').innerHTML = html;
    },

    /**
     * Renderiza a Topbar padrão
     */
    renderTopbar: (moduleTitle) => {
        const html = `
            <div class="os-topbar-left">
                <div class="os-status-indicator">
                    <span class="os-dot"></span> ESTADO_OPERACIONAL: ${OS_CONFIG.status}
                </div>
            </div>
            <div class="os-topbar-right">
                <div class="os-user-profile">
                    <div class="os-avatar">FL</div>
                    <span>Admin FluxAI</span>
                </div>
            </div>`;
        document.querySelector('.os-topbar').innerHTML = html;
    },

    /**
     * Renderiza um Card de Métrica
     */
    renderMetric: (containerId, data) => {
        const trendClass = data.trend.startsWith('+') ? 'trend-up' : 'trend-down';
        const trendIcon = data.trend.startsWith('+') ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
        
        const html = `
            <div class="os-widget-header">
                <span class="os-widget-label">${data.label}</span>
                <i class="fa-solid ${trendIcon} ${trendClass}"></i>
            </div>
            <div class="os-metric">
                <div class="os-metric-value">${data.value}</div>
                <div class="os-metric-meta">
                    <span class="${trendClass}">${data.trend}</span> 
                    <span style="color: var(--os-text-muted);">${data.meta}</span>
                </div>
            </div>`;
        document.getElementById(containerId).innerHTML = html;
    }
};

// CONTROLE DE ACESSO
export const OS_AUTH = {
    check: () => {
        const session = localStorage.getItem('fluxai_session');
        if (!session) {
            window.location.href = 'login.html';
        }
    }
};
