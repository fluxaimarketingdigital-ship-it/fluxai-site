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
     * Renderiza a Sidebar filtrada por RBAC
     */
    renderSidebar: (activeModule, userRole = 'CLIENT') => {
        const navItems = [
            { id: 'command-center', label: 'Command Center', icon: 'fa-gauge-high', group: 'Núcleo Estratégico', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'content-engine', label: 'Content Engine', icon: 'fa-pen-nib', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR', 'CLIENT'] },
            { id: 'crm-intelligence', label: 'CRM Intelligence', icon: 'fa-users-gear', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'automation-hub', label: 'Automation Hub', icon: 'fa-robot', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR', 'CLIENT'] },
            { id: 'governance', label: 'Governança', icon: 'fa-user-shield', group: 'Governança', roles: ['ADMIN'] },
            { id: 'govos', label: 'GovOS', icon: 'fa-shield-halved', group: 'Governança', roles: ['ADMIN'] }
        ];

        let html = `
            <div class="os-sidebar-header">
                <div class="os-brand"><i class="fa-solid fa-cube"></i> FLUXAI <span>OS™</span></div>
            </div>
            <nav class="os-sidebar-nav">`;

        let currentGroup = "";
        navItems.forEach(item => {
            // Filtro de RBAC: só exibe se o usuário tiver o cargo permitido
            if (!item.roles.includes(userRole)) return;

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

// CONTROLE DE ACESSO REAL (SUPABASE)
import { getSupabase } from '../services/supabase-client.js';

export const OS_AUTH = {
    /**
     * Validação de Sessão e RBAC
     * @param {string} requiredRole - Cargo mínimo exigido para a página
     */
    check: async (requiredRole = null) => {
        const supabase = getSupabase();
        if (!supabase) return null;

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            console.warn('[AUTH] Sessão não encontrada.');
            window.location.href = 'login.html';
            return null;
        }

        // Buscar perfil para validar Role
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        const user = { ...session.user, ...profile };

        // Validação de RBAC
        if (requiredRole && user.role !== 'ADMIN') {
            if (user.role !== requiredRole) {
                console.error('[AUTH] Acesso Negado. Nível insuficiente.');
                window.location.href = 'access-denied.html';
                return null;
            }
        }

        return user;
    },

    /**
     * Logout Seguro
     */
    logout: async () => {
        const supabase = getSupabase();
        if (supabase) {
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        }
    }
};

// Extensão de UI para dados reais
const originalRenderTopbar = OS_UI.renderTopbar;
OS_UI.renderTopbar = async () => {
    const user = await OS_AUTH.check();
    if (!user) return;

    const initials = user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    
    const html = `
        <div class="os-topbar-left">
            <div class="os-status-indicator">
                <span class="os-dot"></span> ESTADO_OPERACIONAL: ${OS_CONFIG.status}
            </div>
        </div>
        <div class="os-topbar-right">
            <div class="os-user-profile" id="user-profile-menu" style="cursor: pointer;">
                <div class="os-avatar">${initials}</div>
                <span>${user.full_name || user.email}</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; margin-left: 8px; opacity: 0.5;"></i>
            </div>
        </div>`;
    
    document.querySelector('.os-topbar').innerHTML = html;

    // Listener para logout (opcional, para UI futura)
    document.getElementById('user-profile-menu').onclick = () => {
        if(confirm('Deseja encerrar a sessão operacional?')) {
            OS_AUTH.logout();
        }
    };
};
