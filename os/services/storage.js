/**
 * SERVICE: Storage (Sync Ready)
 * Gerenciamento de persistência local com estados de sincronização.
 */

export const SYNC_STATUS = {
    SYNCED: 'sincronizado',
    PENDING: 'pendente_sync',
    ERROR: 'erro_sync'
};

export const StorageService = {
    save: (key, data, status = SYNC_STATUS.PENDING) => {
        const item = {
            data,
            status,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(`os_${key}`, JSON.stringify(item));
        
        if (status === SYNC_STATUS.PENDING) {
            console.log(`[STORAGE] Item '${key}' salvo localmente. Aguardando sincronização.`);
        }
    },

    get: (key) => {
        const raw = localStorage.getItem(`os_${key}`);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    },

    /**
     * Retorna apenas os dados, ignorando metadados de sync
     */
    getData: (key) => {
        const item = StorageService.get(key);
        return item ? item.data : null;
    },

    /**
     * Marca um item como sincronizado
     */
    markSynced: (key) => {
        const item = StorageService.get(key);
        if (item) {
            StorageService.save(key, item.data, SYNC_STATUS.SYNCED);
        }
    },

    /**
     * Marca um item com erro de sincronização
     */
    markError: (key) => {
        const item = StorageService.get(key);
        if (item) {
            StorageService.save(key, item.data, SYNC_STATUS.ERROR);
        }
    }
};
