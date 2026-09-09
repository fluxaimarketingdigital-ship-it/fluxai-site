import { SHEETS_CONFIG } from './sheets-config.js';
import { SheetsAdapter } from './sheets-adapter.js';

// Mocks simulando o retorno da planilhas
import { mockClients } from '../data/clients.data.js';
import { mockServices } from '../data/services.data.js';
import { mockRoutes } from '../data/routes.data.js';
import { mockStatusMonitor } from '../data/status-monitor.data.js';
import { mockDemands } from '../data/demands.data.js';
import { mockLeads } from '../data/leads.data.js';
import { mockMetrics } from '../data/metrics.data.js';
import { mockMonthlyAnalysis } from '../data/monthly-analysis.data.js';

export const SheetsService = {
    async fetchClients() {
        if (SHEETS_CONFIG.mockEnabled) {
            return SheetsAdapter.parseClients(mockClients);
        }
        return [];
    },
    async fetchServices() {
        if (SHEETS_CONFIG.mockEnabled) return SheetsAdapter.parseServices(mockServices);
        return [];
    },
    async fetchRoutes() {
        if (SHEETS_CONFIG.mockEnabled) return SheetsAdapter.parseRoutes(mockRoutes);
        return [];
    },
    async fetchStatusMonitor() {
        if (SHEETS_CONFIG.mockEnabled) return mockStatusMonitor;
        return [];
    },
    async fetchDemands() {
        if (SHEETS_CONFIG.mockEnabled) return SheetsAdapter.parseDemands(mockDemands);
        return [];
    },
    async fetchLeads() {
        if (SHEETS_CONFIG.mockEnabled) return SheetsAdapter.parseLeads(mockLeads);
        return [];
    },
    async fetchMetrics() {
        if (SHEETS_CONFIG.mockEnabled) return SheetsAdapter.parseMetrics(mockMetrics);
        return [];
    },
    async fetchMonthlyAnalysis() {
        if (SHEETS_CONFIG.mockEnabled) return SheetsAdapter.parseMonthlyAnalysis(mockMonthlyAnalysis);
        return [];
    }
};
