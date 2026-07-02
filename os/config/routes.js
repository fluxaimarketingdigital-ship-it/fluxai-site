/**
 * FLUXAI OS™ ROUTES CONFIG
 * Central table of routes, labels, and roles allowed to access each module.
 * MASTER = proprietário do sistema (acesso total, igual a ADMIN)
 */

export const ROUTES = [
    { id: 'command-center',    label: 'Command Center',          icon: 'fa-terminal',            group: 'Núcleo Estratégico',       path: 'command-center.html',    roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'operations-center', label: 'Operations Center',        icon: 'fa-gauge-high',          group: 'Núcleo Estratégico',       path: 'operations-center.html', roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'executive-center',  label: 'Executive Center',         icon: 'fa-crown',               group: 'Núcleo Estratégico',       path: 'executive-center.html',  roles: ['MASTER', 'ADMIN'] },
    { id: 'onboarding',        label: 'Onboarding Estratégico',   icon: 'fa-user-plus',           group: 'Operação de Clientes',     path: 'onboarding.html',        roles: ['MASTER', 'ADMIN'] },
    { id: 'clientes',          label: 'Clientes',                 icon: 'fa-users',               group: 'Operação de Clientes',     path: 'clientes.html',          roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'demandas',          label: 'Demandas',                 icon: 'fa-list-check',          group: 'Operação de Clientes',     path: 'demandas.html',          roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'leads',             label: 'Leads',                    icon: 'fa-funnel-dollar',       group: 'Operação de Clientes',     path: 'leads.html',             roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'content-engine',    label: 'Motor de Conteúdo',        icon: 'fa-pen-nib',             group: 'Produção & Conteúdo',      path: 'content-engine.html',    roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'flux-calendar',     label: 'Calendário Editorial',     icon: 'fa-calendar-days',       group: 'Produção & Conteúdo',      path: 'flux-calendar.html',     roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'relatorio-mensal',  label: 'Relatório Mensal',         icon: 'fa-file-signature',      group: 'Métricas & Relatórios',    path: 'relatorio-mensal.html',  roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'metricas',          label: 'Métricas Inbound',         icon: 'fa-chart-pie',           group: 'Métricas & Relatórios',    path: 'metricas.html',          roles: ['MASTER', 'ADMIN', 'OPERATOR'] },
    { id: 'client-portal',     label: 'Portal do Cliente',        icon: 'fa-briefcase',           group: 'Interface de Valor',       path: 'client-portal.html',     roles: ['MASTER', 'ADMIN', 'CLIENT'] },
    { id: 'contracts-finance', label: 'Contratos & Financeiro',   icon: 'fa-file-invoice-dollar', group: 'Governança',               path: 'contracts-finance.html', roles: ['MASTER', 'ADMIN'] },
    { id: 'governance',        label: 'Governança',               icon: 'fa-user-shield',         group: 'Governança',               path: 'governance.html',        roles: ['MASTER', 'ADMIN'] },
    { id: 'governance-users',  label: 'Gestão de Usuários',       icon: 'fa-users-cog',           group: 'Governança',               path: 'governance-users.html',  roles: ['MASTER', 'ADMIN'] },
    { id: 'logs',              label: 'Logs Operacionais',         icon: 'fa-terminal',            group: 'Governança',               path: 'logs.html',              roles: ['MASTER', 'ADMIN', 'OPERATOR'] }
];

