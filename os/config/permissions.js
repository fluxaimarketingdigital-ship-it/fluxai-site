/**
 * FLUXAI OS™ PERMISSIONS
 */

export const PERMISSIONS = {
    ADMIN: ['*'],
    OPERATOR: [
        'command-center.view',
        'content-engine.view',
        'content-engine.edit',
        'crm-intelligence.view',
        'automation-hub.view',
        'analytics.view'
    ],
    VIEWER: [
        'command-center.view',
        'analytics.view'
    ]
};
