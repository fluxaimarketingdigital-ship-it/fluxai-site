/**
 * FLUXAI OS™ CORE ENGINE v2.0.0
 * Gestão de Componentes Operacionais, RBAC e Estado Global
 */
import { OSState } from '/os/js/os-state.js';

export const OS_CONFIG = {
    brand: "FLUXAI OS™",
    version: "v2.0.0_CONSOLIDATED",
    status: "ESTÁVEL"
};

// Projeto interno da FluxAI Labs (INTERNAL_WORKSPACE)
export const FLUXAI_LABS_PROJECT = {
    id: 'proj_fluxai_labs_master',
    company_name: 'FluxAI Labs',
    segment: 'Agência de Marketing Digital & Tecnologia',
    workspace_type: 'INTERNAL_WORKSPACE',
    is_billing_exempt: true,
    metadata: {
        is_test_environment: true,
        allow_benchmark: true,
        dna: {
            desired_patterns: ['Autoridade Técnica', 'Inovação', 'Resultados Reais'],
            anti_patterns: ['Promessas Vazias', 'Linguagem Genérica', 'Discurso de Guru']
        },
        tone_of_voice: 'Técnico, direto, confiável, premium, sem exageros'
    }
};

// COMPONENTES REUTILIZÁVEIS
export const OS_UI = {
    /**
     * Renderiza a Sidebar filtrada por RBAC e Contexto (Master / Labs / Cliente)
     */
    renderSidebar: (activeModule, userRole = 'CLIENT') => {
        const context = OSState.get('activeContext') || 'MASTER';

        // contexts: em quais contextos o item aparece
        const navItems = [
            { id: 'command-center',   label: 'Centro de Comando',     icon: 'fa-gauge-high',          group: 'Núcleo Estratégico',    roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'onboarding',       label: 'Onboarding Estratégico',icon: 'fa-address-card',         group: 'Núcleo Estratégico',    roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER', 'LABS'] },
            { id: 'content-engine',   label: 'Motor de Conteúdo',     icon: 'fa-pen-nib',             group: 'Módulos Operacionais',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS','CLIENT'] },
            { id: 'crm-intelligence', label: 'Inteligência de CRM',   icon: 'fa-users-gear',          group: 'Módulos Operacionais',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER'] },
            { id: 'automation-hub',   label: 'Central de Automação',  icon: 'fa-robot',               group: 'Módulos Operacionais',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER'] },
            { id: 'analytics',        label: 'Análise de Dados',      icon: 'fa-chart-line',          group: 'Módulos Operacionais',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'fluxai-labs',      label: 'FluxAI Labs',           icon: 'fa-flask',               group: 'Workspace Interno',     roles: ['ADMIN'],             contexts: ['MASTER','LABS'], permission: 'fluxai-labs-workspace' },
            { id: 'client-portal',    label: 'Portal do Cliente',     icon: 'fa-briefcase',           group: 'Interface de Valor',    roles: ['ADMIN', 'CLIENT'],   contexts: ['MASTER','CLIENT'] },
            { id: 'contracts-finance',label: 'Contratos & Financeiro',icon: 'fa-file-invoice-dollar', group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'governance',       label: 'Governança',            icon: 'fa-user-shield',         group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'governance-users', label: 'Gestão de Usuários',    icon: 'fa-users-cog',           group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
        ];

        let html = `
            <div class="os-sidebar-header">
                <div class="os-brand"><i class="fa-solid fa-cube"></i> FLUXAI <span>OS™</span></div>
            </div>
            <nav class="os-sidebar-nav">`;

        let currentGroup = "";
        navItems.forEach(item => {
            // 1. Filtro de papel (RBAC)
            if (!item.roles.includes(userRole)) return;
            // 2. Filtro de contexto
            if (item.contexts && !item.contexts.includes(context)) return;
            // 3. Filtro de permissão granular
            const session = JSON.parse(localStorage.getItem('fluxai_session') || '{}');
            if (item.permission) {
                if (session.permissions && !session.permissions.includes(item.permission)) return;
            } else if (session.permissions && session.permissions.length > 0) {
                if (!session.permissions.includes(item.id)) return;
            }

            if (item.group !== currentGroup) {
                currentGroup = item.group;
                const groupIcon = item.group === 'Workspace Interno' ? ' ⚡' : '';
                html += `<span class="os-nav-label">${currentGroup}${groupIcon}</span>`;
            }

            let href;
            if (item.id === 'client-portal') {
                const pid = OSState.get('activeProjectId') || localStorage.getItem('fluxai_current_project_id') || '';
                href = `client-portal.html?project_id=${pid}`;
            } else {
                href = `${item.id}.html`;
            }

            const isLabs = item.id === 'fluxai-labs';
            html += `
                <a href="${href}" class="os-nav-link ${activeModule === item.id ? 'active' : ''}" ${isLabs ? 'style="color:rgba(167,139,250,0.9);"' : ''}>
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
    /**
     * Renderiza a Topbar com seletor de contexto Master / Labs / Cliente
     * e badges de alertas operacionais.
     */
    renderTopbar: async () => {
        // Lê sessão diretamente do localStorage para não disparar redirect
        let user = null;
        try {
            const raw = localStorage.getItem('fluxai_session');
            if (raw) user = JSON.parse(raw);
        } catch(e) {}
        if (!user) {
            // Sem sessão: topbar vazio mas sem redirecionar
            return;
        }
        user.full_name = user.full_name || user.name || user.email || 'Admin';

        const initials = (user.full_name || user.email || '??')
            .split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const context = OSState.get('activeContext') || 'MASTER';
        const activeProject = OSState.get('activeProject');
        const isSuperAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user.role);

        // --- Seletor de Contexto ---
        const btnStyle = (active, color) =>
            `font-size:0.58rem; padding:4px 11px; border-radius:3px; border:1px solid ${active ? color : 'var(--os-border)'}; background:${active ? color : 'rgba(255,255,255,0.04)'}; color:${active ? (color === 'var(--os-primary)' ? '#000' : '#fff') : 'var(--os-text-muted)'}; cursor:pointer; font-weight:800; text-transform:uppercase; letter-spacing:1px; transition:all 0.2s;`;

        const contextSwitcher = isSuperAdmin ? `
            <div style="display:flex; align-items:center; gap:5px; margin-left:18px;">
                <button onclick="window.__OSSetContext('MASTER')" title="Visão global" style="${btnStyle(context==='MASTER','var(--os-primary)')}">
                    <i class="fa-solid fa-bolt"></i> Master
                </button>
                <button onclick="window.__OSSetContext('LABS')" title="Workspace interno FluxAI" style="${btnStyle(context==='LABS','rgba(139,92,246,0.9)')}">
                    <i class="fa-solid fa-flask"></i> Labs
                </button>
                ${context === 'CLIENT' && activeProject ? `
                <span style="font-size:0.58rem; padding:4px 11px; border-radius:3px; border:1px solid var(--os-primary); background:rgba(142,158,104,0.1); color:var(--os-primary); font-weight:800; text-transform:uppercase; letter-spacing:1px;">
                    <i class="fa-solid fa-briefcase"></i> ${activeProject.company_name || 'Cliente'}
                </span>` : ''}
            </div>` : '';

        // --- Badges de Alertas ---
        const pending = OSState.get('pendingApprovals') || 0;
        const finAlerts = (OSState.get('financialAlerts') || []).length;
        const approvalBadge = pending > 0 ? `<span style="background:var(--os-warning);color:#000;font-size:0.5rem;font-weight:900;padding:2px 7px;border-radius:10px;margin-left:8px;">${pending} APROVAÇÕES</span>` : '';
        const financeBadge = finAlerts > 0 ? `<span style="background:var(--os-danger);color:#fff;font-size:0.5rem;font-weight:900;padding:2px 7px;border-radius:10px;margin-left:4px;">${finAlerts} ALERTA${finAlerts>1?'S':''}</span>` : '';

        const html = `
            <div class="os-topbar-left" style="display:flex;align-items:center;">
                <div class="os-status-indicator"><span class="os-dot"></span> ${OS_CONFIG.status}</div>
                ${contextSwitcher}${approvalBadge}${financeBadge}
            </div>
            <div class="os-topbar-right">
                <div class="os-user-profile" id="user-profile-menu" style="cursor:pointer;">
                    <div class="os-avatar">${initials}</div>
                    <span>${user.full_name || user.email}</span>
                    <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;margin-left:8px;opacity:0.5;"></i>
                </div>
            </div>`;

        document.querySelector('.os-topbar').innerHTML = html;

        document.getElementById('user-profile-menu')?.addEventListener('click', () => {
            if (confirm('Deseja encerrar a sessão operacional?')) OS_AUTH.logout();
        });

        // Função global de troca de contexto
        window.__OSSetContext = (ctx) => {
            OSState.setContext(ctx);
            OS_UI.renderSidebar(null, user.role);
            OS_UI.renderTopbar();
        };
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

