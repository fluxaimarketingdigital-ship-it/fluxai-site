/**
 * FLUXAI OS™ ROUTES CONFIG
 */

export const ROUTES = [
    { id: 'command-center', label: 'Centro de Comando', icon: 'fa-terminal', group: 'Módulos Operacionais', path: '../../modules/command-center/command-center.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'content-engine', label: 'Motor de Conteúdo', icon: 'fa-pen-nib', group: 'Módulos Operacionais', path: '../../modules/content-engine/content-engine.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'crm-intelligence', label: 'Inteligência de CRM', icon: 'fa-users-gear', group: 'Módulos Operacionais', path: '../../modules/crm-intelligence/crm-intelligence.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'automation-hub', label: 'Central de Automação', icon: 'fa-robot', group: 'Módulos Operacionais', path: '../../modules/automation-hub/automation-hub.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'analytics', label: 'Análise de Dados', icon: 'fa-chart-line', group: 'Módulos Operacionais', path: '../../modules/analytics/analytics.html', roles: ['ADMIN', 'OPERATOR', 'CLIENT'] },
    { id: 'intelligence', label: 'Camada de Inteligência', icon: 'fa-brain', group: 'Núcleo Estratégico', path: '../../modules/intelligence/intelligence.html', roles: ['ADMIN'] },
    { id: 'gpt-layer', label: 'Camada GPT Operacional', icon: 'fa-bolt-lightning', group: 'Núcleo Estratégico', path: '../../modules/gpt-layer/gpt-layer.html', roles: ['ADMIN', 'OPERATOR'] },
    { id: 'client-workspace', label: 'Workspace do Cliente', icon: 'fa-briefcase', group: 'Interface de Valor', path: '../../modules/client-workspace/client-workspace.html', roles: ['ADMIN', 'CLIENT'] },
    { id: 'governance', label: 'Governança', icon: 'fa-user-shield', group: 'Governança', path: '../../modules/governance/governance.html', roles: ['ADMIN'] }
];
