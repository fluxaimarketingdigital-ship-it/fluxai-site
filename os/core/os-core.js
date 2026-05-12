/**
 * FLUXAI OS™ CORE ENGINE
 * Ponto de Entrada Centralizado
 */

import { OS_CONFIG } from '../config/os-config.js';
import { OS_AUTH } from './auth.js';
import { OS_ROUTER } from './router.js';
import { osState } from './state.js';
import { ErrorHandler } from '../services/error-handler.js';

// Inicialização Global
ErrorHandler.init();

export {
    OS_CONFIG,
    OS_AUTH,
    OS_ROUTER,
    osState
};

// Log de Inicialização do Core
console.log(`%c ${OS_CONFIG.brand} ${OS_CONFIG.version} %c ${OS_CONFIG.status} `, 
    'background: #6b7a45; color: #fff; font-weight: bold;', 
    'background: #333; color: #fff;');
