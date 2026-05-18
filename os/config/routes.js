/**
 * FLUXAI OS™ ROUTES CONFIG
 */

export const ROUTES = [
    { id: 'command-center', label: 'Centro de Comando', icon: 'fa-gauge-high', group: 'Núcleo Estratégico', path: 'command-center.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'onboarding', label: 'Onboarding Estratégico', icon: 'fa-address-card', group: 'Núcleo Estratégico', path: 'onboarding.html', roles: ['ADMIN'] },
    { id: 'content-engine', label: 'Motor de Conteúdo', icon: 'fa-pen-nib', group: 'Módulos Operacionais', path: 'content-engine.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'crm-intelligence', label: 'Inteligência de CRM', icon: 'fa-users-gear', group: 'Módulos Operacionais', path: 'crm-intelligence.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'automation-hub', label: 'Central de Automação', icon: 'fa-robot', group: 'Módulos Operacionais', path: 'automation-hub.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'analytics', label: 'Análise de Dados', icon: 'fa-chart-line', group: 'Módulos Operacionais', path: 'analytics.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'client-workspace', label: 'Workspace do Cliente', icon: 'fa-briefcase', group: 'Interface de Valor', path: 'workspace.html', roles: ['ADMIN', 'CLIENT'] },
    { id: 'contracts-finance', label: 'Contratos & Financeiro', icon: 'fa-file-invoice-dollar', group: 'Governança', path: 'contracts-finance.html', roles: ['ADMIN'] },
    { id: 'governance', label: 'Governança', icon: 'fa-user-shield', group: 'Governança', path: 'governance.html', roles: ['ADMIN'] }
];
