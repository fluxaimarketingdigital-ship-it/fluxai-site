/**
 * FLUXAI OS™ CORE ENGINE v2.0.0
 * Gestão de Componentes Operacionais, RBAC e Estado Global
 */
import { OSState } from '/os/js/os-state.js';
import { OS_CONFIG } from '/os/config/os-config.js';
import { OS_LOGS_ENGINE } from '/os/services/logs-engine.js';

/**
 * Função utilitária de segurança global para prevenir XSS
 */
window.escapeHTML = function(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, function(s) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[s];
    });
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
        const runtimeCtx = window.FLUXAI_RUNTIME_CONTEXT || {};
        const sessionRole = runtimeCtx.role || userRole;

        // ADMIN sempre inicia no contexto MASTER
        if (sessionRole === 'ADMIN' && !OSState.get('activeContext')) {
            OSState.setContext('MASTER');
        }
        const context = OSState.get('activeContext') || (sessionRole === 'ADMIN' ? 'MASTER' : 'CLIENT');

        // contexts: em quais contextos o item aparece
        const navItems = [
            { id: 'command-center',   label: 'Command Center',        icon: 'fa-terminal',            group: 'Núcleo Estratégico',    roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'operations-center',label: 'Operations Center',     icon: 'fa-gauge-high',          group: 'Núcleo Estratégico',    roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'executive-center', label: 'Executive Center',      icon: 'fa-crown',               group: 'Núcleo Estratégico',    roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'onboarding',       label: 'Onboarding Estratégico',icon: 'fa-user-plus',           group: 'Operação de Clientes',  roles: ['ADMIN'],             contexts: ['MASTER','LABS'] },
            { id: 'clientes',         label: 'Clientes',              icon: 'fa-users',               group: 'Operação de Clientes',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'demandas',         label: 'Demandas',              icon: 'fa-list-check',          group: 'Operação de Clientes',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'leads',            label: 'Leads',                 icon: 'fa-funnel-dollar',       group: 'Operação de Clientes',  roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'content-engine',   label: 'Motor de Conteúdo',     icon: 'fa-pen-nib',             group: 'Produção & Conteúdo',   roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS','CLIENT'] },
            { id: 'flux-calendar',    label: 'Calendário Editorial',  icon: 'fa-calendar-days',       group: 'Produção & Conteúdo',   roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS','CLIENT'] },
            { id: 'relatorio-mensal', label: 'Relatório Mensal',      icon: 'fa-file-signature',      group: 'Métricas & Relatórios', roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            { id: 'metricas',         label: 'Métricas Inbound',      icon: 'fa-chart-pie',           group: 'Métricas & Relatórios', roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER','LABS'] },
            
            { id: 'client-portal',    label: 'Portal do Cliente',     icon: 'fa-briefcase',           group: 'Interface de Valor',    roles: ['ADMIN', 'CLIENT'],   contexts: ['MASTER','CLIENT'] },
            { id: 'contracts-finance',label: 'Contratos & Financeiro',icon: 'fa-file-invoice-dollar', group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'governance',       label: 'Governança',            icon: 'fa-user-shield',         group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'governance-users', label: 'Gestão de Usuários',    icon: 'fa-users-cog',           group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'logs',             label: 'Logs Operacionais',     icon: 'fa-terminal',            group: 'Governança',            roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER', 'LABS'] }
        ];

        const sidebar = document.querySelector('.os-sidebar');
        sidebar.replaceChildren();

        const header = document.createElement('div');
        header.className = 'os-sidebar-header';
        
        const logoDiv = document.createElement('div');
        logoDiv.className = 'os-logo';
        logoDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; padding: 10px 0;';
        
        const img = document.createElement('img');
        img.src = './assets/logo.png';
        img.alt = 'FluxAI Labs';
        img.style.cssText = 'max-width: 140px; height: auto;';
        // Simulating the onerror fallback visually since setting onerror securely is tricky
        logoDiv.appendChild(img);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'os-menu-close';
        closeBtn.onclick = () => document.querySelector('.os-sidebar').classList.remove('active');
        closeBtn.style.cssText = 'display: none; background: transparent; border: none; color: var(--os-text-muted); cursor: pointer; font-size: 1.2rem;';
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-xmark';
        closeBtn.appendChild(closeIcon);
        
        header.appendChild(logoDiv);
        header.appendChild(closeBtn);
        sidebar.appendChild(header);
        
        const nav = document.createElement('nav');
        nav.className = 'os-sidebar-nav';
        
        // Helper para rotas seguras (suporta clean URLs em produção)
        const getRoute = (baseName, params = '') => window.location.pathname.endsWith('.html') ? `${baseName}.html${params}` : `${baseName}${params}`;

        let currentGroup = "";
        navItems.forEach(item => {
            if (!item.roles.includes(userRole)) return;
            if (item.contexts && !item.contexts.includes(context)) return;
            
            if (sessionRole !== 'ADMIN') { 
                if (item.permission) { 
                    if (runtimeCtx.permissions && !runtimeCtx.permissions.includes(item.permission)) return; 
                } else if (runtimeCtx.permissions && runtimeCtx.permissions.length > 0) { 
                    if (!runtimeCtx.permissions.includes(item.id)) return; 
                } 
            } 
            
            if (item.group !== currentGroup) {
                currentGroup = item.group;
                const groupIcon = item.group === 'Workspace Interno' ? ' 🧪' : '';
                const span = document.createElement('span');
                span.className = 'os-nav-label';
                span.textContent = currentGroup + groupIcon;
                nav.appendChild(span);
            }
            
            let href;
            if (item.id === 'client-portal') {
                const pid = OSState.get('activeProjectId') || localStorage.getItem('fluxai_current_project_id') || '';
                href = getRoute('client-portal', pid ? `?project_id=${encodeURIComponent(pid)}` : '');
            } else if (item.id === 'flux-calendar') {
                const pid = OSState.get('activeProjectId') || localStorage.getItem('fluxai_current_project_id') || '';
                href = getRoute('flux-calendar', pid ? `?project=${encodeURIComponent(pid)}` : '');
            } else {
                href = getRoute(encodeURIComponent(item.id));
            }
            
            const isLabs = item.id === 'fluxai-labs';
            const a = document.createElement('a');
            a.href = href;
            a.className = `os-nav-link ${activeModule === item.id ? 'active' : ''}`;
            if (isLabs) a.style.color = 'rgba(167,139,250,0.9)';
            
            const icon = document.createElement('i');
            icon.className = `fa-solid ${item.icon}`;
            a.appendChild(icon);
            a.appendChild(document.createTextNode(' ' + item.label));
            
            nav.appendChild(a);
        });
        
        sidebar.appendChild(nav);
        
        const footer = document.createElement('div');
        footer.className = 'os-sidebar-footer';
        const footerLink = document.createElement('a');
        footerLink.href = '../pages/fluxai-os.html';
        footerLink.className = 'os-nav-link';
        const footerIcon = document.createElement('i');
        footerIcon.className = 'fa-solid fa-arrow-left';
        footerLink.appendChild(footerIcon);
        footerLink.appendChild(document.createTextNode(' Sair da Interface'));
        footer.appendChild(footerLink);
        
        sidebar.appendChild(footer);
    },

    /**
     * Estado de Carregamento (Performance Step 2)
     */
    showLoading: (elementId) => { 
        const el = document.getElementById(elementId); 
        if (el) {
            const loader = document.createElement('div');
            loader.className = 'os-skeleton-inline';
            el.replaceChildren(loader);
        }
    }, 

    /**
     * Renderiza a Topbar com seletor de contexto Master / Labs / Cliente,
     * indicador de estado de cliente ativo e badges de alertas.
     */
    renderTopbar: async () => {
        let user = null;
        try {
            user = await OS_AUTH.check();
        } catch(e) {}
        if (!user) return;

        user.full_name = user.full_name || user.name || user.email || 'Admin';

        const initials = (user.full_name || user.email || '??')
            .split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const context = OSState.get('activeContext') || 'MASTER';
        const isSuperAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user.role);

        // --- Seletor de Contexto ---
        const btnStyle = (active, color) =>
            `font-size:0.58rem; padding:4px 11px; border-radius:3px; border:1px solid ${active ? color : 'var(--os-border)'}; background:${active ? color : 'rgba(255,255,255,0.04)'}; color:${active ? (color === 'var(--os-primary)' ? '#000' : '#fff') : 'var(--os-text-muted)'}; cursor:pointer; font-weight:800; text-transform:uppercase; letter-spacing:1px; transition:all 0.2s;`;

        // Mapear projeto ativo na topbar
        const currentProjectId = localStorage.getItem('fluxai_current_project_id');
        let activeClientHtml = ""; 
        let activeProj = null; 
        let companyNameStr = 'TODOS OS CLIENTES';
        if (currentProjectId && currentProjectId !== 'todos') { 
            const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]'); 
            const supabaseProjects = JSON.parse(localStorage.getItem('fluxai_supabase_projects') || '[]'); 
            activeProj = mockProjects.find(p => p.id === currentProjectId) || supabaseProjects.find(p => p.id === currentProjectId); 
            if (activeProj) { 
                companyNameStr = (activeProj.company_name || activeProj.name || 'Desconhecido').toUpperCase();
            }
        } 
        activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: <span id="safe-client-name"></span></span>`; 
 
        const contextSwitcher = isSuperAdmin ? ` 
            <div style="display:flex; align-items:center; gap:5px; margin-left:18px;"> 
                <button onclick="window.__OSSetContext('MASTER')" title="Visão global" style="${btnStyle(context==='MASTER','var(--os-primary)')}"> 
                    <i class="fa-solid fa-bolt"></i> Master 
                </button> 
                <button onclick="window.__OSSetContext('LABS')" title="Workspace interno FluxAI" style="${btnStyle(context==='LABS','rgba(139,92,246,0.9)')}"> 
                    <i class="fa-solid fa-flask"></i> Labs 
                </button> 
                ${context === 'CLIENT' && activeProj ? ` 
                <span style="font-size:0.58rem; padding:4px 11px; border-radius:3px; border:1px solid var(--os-primary); background:rgba(142,158,104,0.1); color:var(--os-primary); font-weight:800; text-transform:uppercase; letter-spacing:1px;"> 
                    <i class="fa-solid fa-briefcase"></i> <span id="safe-ctx-name"></span> 
                </span>` : ''} 
            </div>` : ''; 
 
        // --- Badges de Alertas --- 
        const pending = OSState.get('pendingApprovals') || 0; 
        const finAlerts = (OSState.get('financialAlerts') || []).length; 
        const approvalBadge = pending > 0 ? `<span style="background:var(--os-warning);color:#000;font-size:0.5rem;font-weight:900;padding:2px 7px;border-radius:10px;margin-left:8px;">${pending} APROVAÇÕES</span>` : ''; 
        const financeBadge = finAlerts > 0 ? `<span style="background:var(--os-danger);color:#fff;font-size:0.5rem;font-weight:900;padding:2px 7px;border-radius:10px;margin-left:4px;">${finAlerts} ALERTA${finAlerts>1?'S':''}</span>` : ''; 
 
        const html = ` 
            <div class="os-topbar-left" style="display:flex;align-items:center;gap:15px;min-width:0;">  
                <button class="os-menu-toggle" id="mobile-menu-toggle"><i class="fa-solid fa-bars"></i></button>  
                <div class="os-status-indicator" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">  
                    <span class="os-dot"></span> ESTADO_OPERACIONAL: ${OS_CONFIG.statusStr}${activeClientHtml} 
                </div> 
                ${contextSwitcher}${approvalBadge}${financeBadge}  
            </div>  
            <div class="os-topbar-right"> 
                <div class="os-user-profile" id="user-profile-menu" style="cursor:pointer;"> 
                    <div class="os-avatar" id="safe-avatar"></div> 
                    <span id="safe-user-name"></span> 
                    <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;margin-left:8px;opacity:0.5;"></i> 
                </div> 
            </div>`; 
 
        const topbarEl = document.querySelector('.os-topbar');
        if (!topbarEl) {
            console.warn('[OS_CORE] Container global (.os-topbar) ausente nesta rota. Renderização ignorada.');
            return;
        }
        topbarEl.innerHTML = html;
        
        const safeClientNameEl = document.getElementById('safe-client-name');
        if(safeClientNameEl) safeClientNameEl.textContent = companyNameStr;
        const safeCtxNameEl = document.getElementById('safe-ctx-name');
        if(safeCtxNameEl && activeProj) safeCtxNameEl.textContent = activeProj.company_name || 'Cliente';
        const safeAvatarEl = document.getElementById('safe-avatar');
        if(safeAvatarEl) safeAvatarEl.textContent = initials;
        const safeUserNameEl = document.getElementById('safe-user-name');
        if(safeUserNameEl) safeUserNameEl.textContent = user.full_name || user.email;
 
        document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => { 
            document.querySelector('.os-sidebar')?.classList.toggle('active');
        });

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
                <span class="os-widget-label">${window.escapeHTML(data.label)}</span>
                ${data.trend ? `<i class="fa-solid ${trendIcon} ${trendClass}"></i>` : `<i class="fa-solid ${window.escapeHTML(data.icon || 'fa-chart-line')}" style="opacity:0.3"></i>`}
            </div>
            <div class="os-metric">
                <div class="os-metric-value">${window.escapeHTML(data.value || '0')}</div>
                <div class="os-metric-meta">
                    ${data.trend ? `<span class="${trendClass}">${window.escapeHTML(data.trend)}</span>` : ''} 
                    ${data.meta ? `<span style="color: var(--os-text-muted);">${window.escapeHTML(data.meta)}</span>` : ''}
                </div>
            </div>`;
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = html;
    }
};

// CONTROLE DE ACESSO REAL (SUPABASE)
import { getSupabase } from '../services/supabase-client.js';

/**
 * Allowlist segura de usuários autorizados.
 * Não contém senhas, tokens ou dados sensíveis.
 * Serve apenas para mapear e-mail autenticado (via Supabase Auth) para papel operacional.
 * Qualquer e-mail não listado recebe role CLIENT por padrão.
 */
const FLUXAI_ALLOWED_USERS = Object.freeze({
    'kassiadgomes@hotmail.com': {
        id: 'ADMIN_001',
        full_name: 'Kássia Gomes',
        role: 'ADMIN',
        permissions: ['*'],
        project_id: 'FLUXAI_LABS_001'
    },
    'admin@fluxai.com': {
        id: 'ADMIN_002',
        full_name: 'Admin FluxAI',
        role: 'ADMIN',
        permissions: ['*'],
        project_id: 'FLUXAI_LABS_001'
    },
    'kassia@fluxai.com': {
        id: 'ADMIN_003',
        full_name: 'Kássia Gomes',
        role: 'ADMIN',
        permissions: ['*'],
        project_id: 'FLUXAI_LABS_001'
    }
});

/**
 * Bootstrap de Autenticação por Página.
 * Chame no início de cada módulo protegido.
 * Reconstrói window.FLUXAI_RUNTIME_CONTEXT via Supabase Auth (sem nenhum storage manual).
 * @param {string|null} requiredRole - 'ADMIN' | 'OPERATOR' | 'CLIENT' | null
 * @param {string|null} requiredPermission - permissão específica ou null
 * @returns {object|null} user ou null após redirecionamento
 */
window.OS_AUTH_BOOTSTRAP = async function(requiredRole = null, requiredPermission = null) {
    const getRoute = (baseName) => window.location.pathname.endsWith('.html') ? `${baseName}.html` : baseName;

    // 1. Se já existe contexto em RAM (mesma SPA session), reusar
    if (window.FLUXAI_RUNTIME_CONTEXT) {
        return _applyRBAC(window.FLUXAI_RUNTIME_CONTEXT, requiredRole, requiredPermission);
    }

    // 2. Tentar reconstruir via Supabase Auth
    const supabase = getSupabase();
    if (!supabase) {
        console.warn('[BOOTSTRAP] Supabase indisponível. Redirecionando para login.');
        window.location.href = getRoute('login');
        return null;
    }

    let sessionUser = null;
    let sessionObj = null;
    try {
        const { data } = await supabase.auth.getSession();
        sessionObj = data?.session || null;
        sessionUser = data?.session?.user || null;
    } catch (err) {
        console.warn('[BOOTSTRAP] Erro ao obter sessão Supabase:', err.message);
    }

    const email = sessionUser ? String(sessionUser.email || '').toLowerCase().trim() : null;
    const knownProfile = email ? (FLUXAI_ALLOWED_USERS[email] || null) : null;

    console.log("[AUTH_BOOTSTRAP]", {
        route: window.location.pathname,
        hasSession: !!sessionObj,
        hasUser: !!sessionUser,
        email: email,
        mappedUser: !!knownProfile,
        role: knownProfile?.role || null
    });

    if (!sessionUser) {
        console.warn('[BOOTSTRAP] Sem sessão Supabase ativa. Redirecionando para login.');
        window.location.href = getRoute('login');
        return null;
    }

    // 3. Mapear e-mail para perfil operacional via allowlist (sem dados sensíveis)
    let safeRole, safePermissions, safeId, safeName, safeProjectId;

    if (knownProfile) {
        safeRole        = OS_AUTH.normalizeRole(knownProfile.role);
        safePermissions = knownProfile.permissions.includes('*')
                            ? OS_AUTH.getPermissionsForRole(safeRole)
                            : knownProfile.permissions;
        safeId          = knownProfile.id;
        safeName        = knownProfile.full_name;
        safeProjectId   = knownProfile.project_id || null;
    } else {
        // Tentar buscar perfil no banco de dados se não estiver na allowlist
        try {
            const { data: profile, error: dbError } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', sessionUser.id)
                .single();
            if (dbError || !profile) {
                throw new Error('Perfil não encontrado no sistema.');
            }
            safeRole        = OS_AUTH.normalizeRole(profile.role);
            safePermissions = OS_AUTH.getPermissionsForRole(safeRole);
            safeId          = sessionUser.id;
            safeName        = profile.full_name || email;
            safeProjectId   = sessionUser.user_metadata?.client_id || null;
        } catch (err) {
            console.error('[RBAC] Bloqueio: Conta sem perfil operacional válido.', err.message);
            alert('Falha de Acesso: Sua conta não possui um perfil operacional válido. Contate o administrador.');
            await OS_AUTH.logout();
            return null;
        }
    }

    // 4. Construir contexto em RAM exclusivamente
    window.FLUXAI_RUNTIME_CONTEXT = {
        id:           safeId,
        email:        email,
        full_name:    safeName,
        role:         safeRole,
        permissions:  safePermissions,
        project_id:   safeProjectId
    };

    return _applyRBAC(window.FLUXAI_RUNTIME_CONTEXT, requiredRole, requiredPermission);
};

/** Helper interno: aplica regras RBAC e bloqueia CLIENT em rotas internas */
function _applyRBAC(user, requiredRole, requiredPermission) {
    const getRoute = (baseName) => window.location.pathname.endsWith('.html') ? `${baseName}.html` : baseName;

    // Bloqueio de URL direta para CLIENT
    if (user.role === 'CLIENT') {
        const currentPath = window.location.pathname.toLowerCase();
        // CLIENT só pode acessar: client-portal, approval (aprovar entregas), access-denied, login, flux-calendar
        const isAllowed = [
            'client-portal',
            'approval',
            'contract-view',
            'flux-calendar',
            'access-denied',
            'login'
        ].some(allowed => currentPath.includes(allowed));

        if (!isAllowed) {
            console.warn('[RBAC] CLIENT bloqueado de rota interna:', currentPath);
            window.location.replace(
                window.location.pathname.endsWith('.html') ? 'client-portal.html' : 'client-portal'
            );
            return null;
        }
    }

    // Validação de role requerida
    if (requiredRole && user.role !== 'ADMIN') {
        let hasAccess = user.role === requiredRole;
        if (!hasAccess && requiredPermission && Array.isArray(user.permissions)) {
            hasAccess = user.permissions.includes(requiredPermission);
        }
        if (!hasAccess) {
            console.error('[RBAC] Acesso negado. Role insuficiente.', { user: user.role, required: requiredRole });
            window.location.href = getRoute('access-denied');
            return null;
        }
    }

    return user;
}

export const OS_AUTH = {
    normalizeRole: (value) => {
        const role = String(value || "").toUpperCase();
        if (role === "ADMIN") return "ADMIN";
        if (role === "OPERATOR") return "OPERATOR";
        if (role === "CLIENT") return "CLIENT";
        return "CLIENT";
    },
    getPermissionsForRole: (role) => {
        const permissionsByRole = {
            ADMIN: ["command-center", "onboarding", "content-engine", "crm-intelligence", "analytics", "automation-hub", "contracts-finance", "client-portal", "governance", "governance-users"],
            OPERATOR: ["command-center", "onboarding", "content-engine", "crm-intelligence", "analytics", "automation-hub"],
            CLIENT: ["client-portal"]
        };
        return permissionsByRole[role] || permissionsByRole.CLIENT;
    },
    /**
     * Validação de Sessão e RBAC
     * @param {string} requiredRole - Cargo mínimo exigido para a página
     * @param {string} requiredPermission - Permissão específica exigida
     */
    check: async (requiredRole = null, requiredPermission = null) => {
        // Delegar ao bootstrap global (reconstrói contexto via Supabase Auth se necessário)
        return await window.OS_AUTH_BOOTSTRAP(requiredRole, requiredPermission);
    },


    /**
     * Logout Seguro
     */
    logout: async () => {
        const user = OS_AUTH.user || {};
        if (typeof OS_LOGS_ENGINE !== 'undefined') {
            OS_LOGS_ENGINE.userAction(
                'AUTH_LOGOUT',
                'os-core',
                { user_id: user.id, email: user.email },
                user.role || 'CLIENT',
                user.project_id || null
            );
        }

        window.FLUXAI_RUNTIME_CONTEXT = null;
        localStorage.removeItem('fluxai_current_project_id');
        const supabase = getSupabase();
        if (supabase) {
            try {
                await supabase.auth.signOut();
            } catch (err) {
                console.warn('[AUTH] Erro no logout Supabase', err);
            }
        }
        const hasExt = window.location.pathname.endsWith('.html');
        window.location.href = hasExt ? 'login.html' : 'login';
    }
};

// ── Listener de estado de sessão (SIGNED_OUT) ──
// Invalida o contexto em RAM imediatamente quando o Supabase detecta
// logout (expiração de token, revoção de sessão ou logout em outra aba).
(function _registerAuthStateGuard() {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.onAuthStateChange((event, _session) => {
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !_session) {
            console.warn('[AUTH_GUARD] Sessão encerrada remotamente. Limpando contexto.');
            window.FLUXAI_RUNTIME_CONTEXT = null;
            localStorage.removeItem('fluxai_current_project_id');

            // Redirecionar apenas se estiver em rota protegida
            const path = window.location.pathname.toLowerCase();
            const isPublic = ['/os/login', '/os/access-denied', 'login.html', 'access-denied.html']
                .some(p => path.includes(p));
            if (!isPublic) {
                const hasExt = window.location.pathname.endsWith('.html');
                window.location.replace(hasExt ? 'login.html' : 'login');
            }
        }
    });
}());

/**
 * Ponte Manual Assistida do WhatsApp
 * Copia o texto para a área de transferência, registra o log de governança e abre o WhatsApp Web.
 */
window.triggerWhatsAppContact = (phone, message) => {
    const cleanPhone = String(phone).replace(/\D/g, '');
    
    // Copiar mensagem para área de transferência
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message)
            .then(() => console.log('[WHATSAPP] Mensagem copiada com sucesso.'))
            .catch(err => console.error('[WHATSAPP] Erro ao copiar mensagem:', err));
    } else {
        try {
            const el = document.createElement('textarea');
            el.value = message;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            console.log('[WHATSAPP] Mensagem copiada (textarea fallback).');
        } catch (e) {
            console.error('[WHATSAPP] Falha no fallback de cópia:', e);
        }
    }
    
    // Registrar log
    if (typeof OS_LOGS_ENGINE !== 'undefined') {
        OS_LOGS_ENGINE.userAction(
            'CONTACT_INTENTION_LOGGED',
            'whatsapp-ponte',
            { phone: cleanPhone, message_length: message.length },
            (window.FLUXAI_RUNTIME_CONTEXT || {}).role || 'OPERATOR',
            OSState.get('activeProjectId') || null,
            false // simulated = false (log real de governança)
        );
    }
    
    alert(`Mensagem copiada para a área de transferência!\n\nRedirecionando para o WhatsApp Web para envio manual pelo operador.`);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
};




