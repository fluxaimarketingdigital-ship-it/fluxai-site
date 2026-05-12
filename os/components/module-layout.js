/**
 * COMPONENT: Module Layout
 * Provedor de estrutura base para todos os módulos
 */

import { SidebarOS } from './sidebar-os.js';
import { TopbarOS } from './topbar-os.js';
import { OS_AUTH } from '../core/auth.js';

export const ModuleLayout = {
    init: (moduleId) => {
        // 1. Validar Acesso
        if (!OS_AUTH.check()) return;

        // 2. Renderizar Componentes Globais
        SidebarOS.render(moduleId);
        TopbarOS.render();
    }
};
