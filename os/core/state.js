/**
 * FLUXAI OS™ GLOBAL STATE
 * Gestão Centralizada de Estados Operacionais
 */

class OSState {
    constructor() {
        this.state = {
            user: null,
            activeModule: null,
            systemStatus: 'ESTÁVEL',
            notifications: []
        };
        this.listeners = [];
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

export const osState = new OSState();
