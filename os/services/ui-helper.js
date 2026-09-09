/**
 * SERVICE: UI Helper
 * Utilitários para estados de loading, vazios e feedback visual.
 */

export const UIHelper = {
    /**
     * Exibe um loader em um container específico
     */
    showLoader: (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="os-loader-container">
                    <div class="os-loader-spinner"></div>
                    <span class="os-loader-text">Sincronizando...</span>
                </div>
            `;
        }
    },

    /**
     * Exibe um estado vazio discreto e institucional
     */
    showEmptyState: (containerId, message = "Nenhum dado identificado no contexto atual.") => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="os-empty-state">
                    <i class="fa-solid fa-inbox"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    },

    /**
     * Transição suave de conteúdo
     */
    fadeSwap: (containerId, newHtml) => {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = newHtml;
                container.style.opacity = '1';
                container.style.transition = 'opacity 0.3s ease';
            }, 200);
        }
    }
};
