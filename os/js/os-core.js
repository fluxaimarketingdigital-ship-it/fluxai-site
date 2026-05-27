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
        const session = JSON.parse(localStorage.getItem('fluxai_session') || '{}');
        const sessionRole = session.role || userRole;

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
            { id: 'fluxai-labs',      label: 'FluxAI Labs',           icon: 'fa-flask',               group: 'Workspace Interno',     roles: ['ADMIN'],             contexts: ['MASTER','LABS'], permission: 'fluxai-labs-workspace' },
            { id: 'client-portal',    label: 'Portal do Cliente',     icon: 'fa-briefcase',           group: 'Interface de Valor',    roles: ['ADMIN', 'CLIENT'],   contexts: ['MASTER','CLIENT'] },
            { id: 'contracts-finance',label: 'Contratos & Financeiro',icon: 'fa-file-invoice-dollar', group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'governance',       label: 'Governança',            icon: 'fa-user-shield',         group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'governance-users', label: 'Gestão de Usuários',    icon: 'fa-users-cog',           group: 'Governança',            roles: ['ADMIN'],             contexts: ['MASTER'] },
            { id: 'logs',             label: 'Logs Operacionais',     icon: 'fa-terminal',            group: 'Governança',            roles: ['ADMIN', 'OPERATOR'], contexts: ['MASTER', 'LABS'] }
        ];

        let html = `
            <div class="os-sidebar-header">
                <div class="os-logo" style="display: flex; align-items: center; justify-content: center; padding: 10px 0;">
                    <img src="./assets/logo.png" alt="FluxAI Labs" style="max-width: 140px; height: auto;" onerror="this.outerHTML='FLUXAI OS™ <span style=\\\'font-size:0.6rem; color:var(--os-primary);\\\'>v1.0</span>'" />
                </div>
                <button class="os-menu-close" onclick="document.querySelector('.os-sidebar').classList.remove('active')" style="display: none; background: transparent; border: none; color: var(--os-text-muted); cursor: pointer; font-size: 1.2rem;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <nav class="os-sidebar-nav">`;

        let currentGroup = "";
        navItems.forEach(item => {
            // 1. Filtro de papel (RBAC)
            if (!item.roles.includes(userRole)) return;
            // 2. Filtro de contexto
            if (item.contexts && !item.contexts.includes(context)) return;
            // 3. Filtro de permissão granular — ADMIN sempre vê tudo
            if (sessionRole !== 'ADMIN') {
                if (item.permission) {
                    if (session.permissions && !session.permissions.includes(item.permission)) return;
                } else if (session.permissions && session.permissions.length > 0) {
                    if (!session.permissions.includes(item.id)) return;
                }
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
            } else if (item.id === 'flux-calendar') {
                const pid = OSState.get('activeProjectId') || localStorage.getItem('fluxai_current_project_id') || '';
                href = `flux-calendar.html?project=${pid}`;
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
        if (currentProjectId && currentProjectId !== 'todos') {
            const mockProjects = JSON.parse(localStorage.getItem('fluxai_mock_projects') || '[]');
            const supabaseProjects = JSON.parse(localStorage.getItem('fluxai_supabase_projects') || '[]');
            activeProj = mockProjects.find(p => p.id === currentProjectId) || supabaseProjects.find(p => p.id === currentProjectId);
            if (activeProj) {
                const companyName = window.escapeHTML(activeProj.company_name || activeProj.name || 'Desconhecido');
                activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: ${companyName.toUpperCase()}</span>`;
            } else {
                activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: TODOS OS CLIENTES</span>`;
            }
        } else {
            activeClientHtml = ` &nbsp;|&nbsp; <span style="color: var(--os-primary); font-weight: 800;"><i class="fa-solid fa-briefcase"></i> CLIENTE: TODOS OS CLIENTES</span>`;
        }

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
                    <i class="fa-solid fa-briefcase"></i> ${window.escapeHTML(activeProj.company_name || 'Cliente')}
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
                    <span class="os-dot"></span> ESTADO_OPERACIONAL: ${OS_CONFIG.status}${activeClientHtml}
                </div>
                ${contextSwitcher}${approvalBadge}${financeBadge}
            </div>
            <div class="os-topbar-right">
                <div class="os-user-profile" id="user-profile-menu" style="cursor:pointer;">
                    <div class="os-avatar">${window.escapeHTML(initials)}</div>
                    <span>${window.escapeHTML(user.full_name || user.email)}</span>
                    <i class="fa-solid fa-chevron-down" style="font-size:0.7rem;margin-left:8px;opacity:0.5;"></i>
                </div>
            </div>`;

        document.querySelector('.os-topbar').innerHTML = html;

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
            console.warn('[AUTH] Supabase offline ou CDN ausente. Redirecionando para login.');
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.security('SECURITY_ACCESS_DENIED', { reason: 'Supabase offline e sem sessão local' }, 'critical');
            }
            window.location.href = 'login.html';
            return null;
        }

        let session = null;
        try {
            const { data } = await supabase.auth.getSession();
            session = data.session;
        } catch (err) {
            console.warn('[AUTH] Erro ao conectar com Supabase auth. Redirecionando para login.', err);
            if (typeof OS_LOGS_ENGINE !== 'undefined') {
                OS_LOGS_ENGINE.security('SECURITY_ACCESS_DENIED', { reason: 'Falha na conexão Supabase auth: ' + err.message }, 'critical');
            }
            window.location.href = 'login.html';
            return null;
        }
        
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
                if (typeof OS_LOGS_ENGINE !== 'undefined') {
                    OS_LOGS_ENGINE.security('SECURITY_ACCESS_DENIED', { 
                        user_id: user.id || user.email, 
                        user_role: user.role, 
                        required_role: requiredRole 
                    }, 'critical');
                }
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
            localStorage.getItem('fluxai_session') ? JSON.parse(localStorage.getItem('fluxai_session')).role : 'OPERATOR',
            localStorage.getItem('fluxai_current_project_id') || null,
            false // simulated = false (log real de governança)
        );
    }
    
    alert(`Mensagem copiada para a área de transferência!\n\nRedirecionando para o WhatsApp Web para envio manual pelo operador.`);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
};




