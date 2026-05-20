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
            { id: 'command-center', label: 'Centro de Comando', icon: 'fa-gauge-high', group: 'Núcleo Estratégico', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'onboarding', label: 'Onboarding Estratégico', icon: 'fa-address-card', group: 'Núcleo Estratégico', roles: ['ADMIN'] },
            { id: 'content-engine', label: 'Motor de Conteúdo', icon: 'fa-pen-nib', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'crm-intelligence', label: 'Inteligência de CRM', icon: 'fa-users-gear', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'automation-hub', label: 'Central de Automação', icon: 'fa-robot', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'analytics', label: 'Análise de Dados', icon: 'fa-chart-line', group: 'Módulos Operacionais', roles: ['ADMIN', 'OPERATOR'] },
            { id: 'client-portal', label: 'Portal do Cliente', icon: 'fa-briefcase', group: 'Interface de Valor', roles: ['ADMIN', 'CLIENT'] },
            { id: 'contracts-finance', label: 'Contratos & Financeiro', icon: 'fa-file-invoice-dollar', group: 'Governança', roles: ['ADMIN'] },
            { id: 'governance', label: 'Governança', icon: 'fa-user-shield', group: 'Governança', roles: ['ADMIN'] },
            { id: 'governance-users', label: 'Gestão de Usuários', icon: 'fa-users-cog', group: 'Governança', roles: ['ADMIN'] },
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

            // Filtro de Permissões Granulares (se definido na sessão)
            const session = JSON.parse(localStorage.getItem('fluxai_session') || '{}');
            if (session.permissions && session.permissions.length > 0) {
                if (!session.permissions.includes(item.id)) return;
            }

            if (item.group !== currentGroup) {
                currentGroup = item.group;
                html += `<span class="os-nav-label">${currentGroup}</span>`;
            }
            html += `
                <a href="${item.id === 'client-portal' ? 'client-portal.html?project_id=' + (localStorage.getItem('fluxai_current_project_id') || '') : item.id + '.html'}" class="os-nav-link ${activeModule === item.id ? 'active' : ''}">
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
     * Estado de Carregamento (Performance Step 2)
     */
    showLoading: (elementId) => {
        const el = document.getElementById(elementId);
        if (el) el.innerHTML = `<div class="os-skeleton-inline"></div>`;
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
        const isPositive = data.trend && data.trend.startsWith('+');
        const trendClass = isPositive ? 'trend-up' : 'trend-down';
        const trendIcon = isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
        
        const html = `
            <div class="os-widget-header">
                <span class="os-widget-label">${data.label}</span>
                ${data.trend ? `<i class="fa-solid ${trendIcon} ${trendClass}"></i>` : `<i class="fa-solid ${data.icon || 'fa-chart-line'}" style="opacity:0.3"></i>`}
            </div>
            <div class="os-metric">
                <div class="os-metric-value">${data.value || '0'}</div>
                <div class="os-metric-meta">
                    ${data.trend ? `<span class="${trendClass}">${data.trend}</span>` : ''} 
                    ${data.meta ? `<span style="color: var(--os-text-muted);">${data.meta}</span>` : ''}
                </div>
            </div>`;
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
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
        // 1. Tentar carregar sessão local do localStorage
        const localSession = localStorage.getItem('fluxai_session');
        if (localSession) {
            try {
                const sessionData = JSON.parse(localSession);
                const user = {
                    id: sessionData.id || 'mock-id',
                    role: sessionData.role || 'CLIENT',
                    full_name: sessionData.name || 'Usuário Local',
                    email: sessionData.email || 'local@fluxai.com',
                    project_id: sessionData.project_id || null,
                    permissions: sessionData.permissions || []
                };

                // Validação de RBAC
                if (requiredRole && user.role !== 'ADMIN') {
                    if (user.role !== requiredRole) {
                        console.error('[AUTH] Acesso Negado. Nível insuficiente.');
                        window.location.href = 'access-denied.html';
                        return null;
                    }
                }
                return user;
            } catch (err) {
                console.error('[AUTH] Erro ao ler fluxai_session', err);
            }
        }

        const supabase = getSupabase();
        if (!supabase) {
            console.warn('[AUTH] Supabase offline ou CDN ausente. Ativando Bypass Mock User.');
            return { id: 'mock-admin', role: 'ADMIN', full_name: 'Admin FluxAI', email: 'admin@fluxai.com' };
        }

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
        localStorage.removeItem('fluxai_session');
        localStorage.removeItem('fluxai_current_project_id');
        const supabase = getSupabase();
        if (supabase) {
            try {
                await supabase.auth.signOut();
            } catch (err) {
                console.warn('[AUTH] Erro no logout Supabase', err);
            }
        }
        window.location.href = 'login.html';
    }
};

// Extensão de UI para dados reais
const originalRenderTopbar = OS_UI.renderTopbar;
OS_UI.renderTopbar = async () => {
    const user = await OS_AUTH.check();
    if (!user) return;

    const initials = user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    
    // Mapear projeto ativo na topbar
    const currentProjectId = localStorage.getItem('fluxai_current_project_id');
    let activeClientHtml = "";
    let activeProj = null;
    if (currentProjectId && currentProjectId !== 'todos') {
        const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
        const supabaseProjects = JSON.parse(localStorage.getItem('fluxai_supabase_projects') || '[]');
        activeProj = mockProjects.find(p => p.id === currentProjectId) || supabaseProjects.find(p => p.id === currentProjectId);
        if (activeProj) {
            const companyName = activeProj.company_name || activeProj.name || 'Desconhecido';
            activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: ${companyName.toUpperCase()}</span>`;
        } else {
            activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: TODOS OS CLIENTES</span>`;
        }
    } else {
        activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: TODOS OS CLIENTES</span>`;
    }

    const html = `
        <div class="os-topbar-left">
            <div class="os-status-indicator">
                <span class="os-dot"></span> ESTADO_OPERACIONAL: ${OS_CONFIG.status}${activeClientHtml}
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

