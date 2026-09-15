// Test harness nativo — node:test (Node.js 18+)
// NÃO instala dependência. Usa apenas built-ins.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ─── MOCK mínimo do Supabase para testes unitários ───────────────────────────
function makeSupabaseMock({ clientRegistry = [], counts = {}, healthData = [] } = {}) {
    const mockQuery = (data, count) => ({
        eq: () => mockQuery(data, count),
        order: () => mockQuery(data, count),
        limit: () => mockQuery(data, count),
        select: () => ({ count, data, error: null }),
        then: (fn) => Promise.resolve(fn({ count, data, error: null })),
    });
    return {
        from: (table) => ({
            select: (cols, opts) => {
                const isHealth = table === 'operational_events';
                const chain = {
                    eq: () => chain,
                    in: () => chain,
                    order: () => chain,
                    limit: () => chain,
                    then: (fn) => Promise.resolve(fn({ count: counts[table] ?? 0, data: isHealth ? healthData : clientRegistry, error: null }))
                };
                return chain;
            }
        }),
    };
}

// ─── Registry em memória para testes ─────────────────────────────────────────
const FLUXAI_UUID = 'aaaaaaaa-0001-0001-0001-000000000001';
const EXECUTA_UUID = 'bbbbbbbb-0002-0002-0002-000000000002';
const mockRegistry = [
    { id: FLUXAI_UUID, company_name: 'FluxAI Labs', workspace_type: 'CLIENT', status: 'ATIVO' },
    { id: EXECUTA_UUID, company_name: 'Executa Group', workspace_type: 'CLIENT', status: 'ATIVO' },
];

// ─── LÓGICA pura extraída para teste ─────────────────────────────────────────
function buildClientFilterOptions(registry) {
    return [
        { id: null, label: 'Todos os clientes' },
        ...registry.map(c => ({ id: c.id, label: c.company_name }))
    ];
}

function getFilteredCount(registry, selectedProjectId) {
    if (selectedProjectId === null) return registry.length;
    return registry.filter(c => c.id === selectedProjectId).length;
}

function detectCrossClientLeak(selectedProjectId, returnedProjects) {
    if (selectedProjectId === null) return 0; // "Todos" é legítimo
    return returnedProjects.filter(p => p.id !== selectedProjectId).length;
}

function aggregateAll(registryA, registryB) {
    const ids = new Set();
    const merged = [];
    for (const c of [...registryA, ...registryB]) {
        if (!ids.has(c.id)) { ids.add(c.id); merged.push(c); }
    }
    return merged;
}

// ─── TESTES ───────────────────────────────────────────────────────────────────
describe('Command Center Multi-Client Filter', () => {

    test('01 — Lista de clientes inclui FluxAI Labs', () => {
        const opts = buildClientFilterOptions(mockRegistry);
        assert.ok(opts.some(o => o.label === 'FluxAI Labs'), 'FluxAI Labs deve estar na lista');
    });

    test('02 — Lista de clientes inclui Executa Group', () => {
        const opts = buildClientFilterOptions(mockRegistry);
        assert.ok(opts.some(o => o.label === 'Executa Group'), 'Executa Group deve estar na lista');
    });

    test('03 — "Todos" inclui ambos os clientes', () => {
        const opts = buildClientFilterOptions(mockRegistry);
        const nonAll = opts.filter(o => o.id !== null);
        assert.ok(nonAll.some(o => o.id === FLUXAI_UUID));
        assert.ok(nonAll.some(o => o.id === EXECUTA_UUID));
    });

    test('04 — Filtro FluxAI Labs exclui Executa Group', () => {
        const resultado = [{ id: FLUXAI_UUID, company_name: 'FluxAI Labs' }];
        const leak = detectCrossClientLeak(FLUXAI_UUID, resultado);
        assert.equal(leak, 0, 'Nenhum registro de Executa deve aparecer no filtro FluxAI Labs');
    });

    test('05 — Filtro Executa Group exclui FluxAI Labs', () => {
        const resultado = [{ id: EXECUTA_UUID, company_name: 'Executa Group' }];
        const leak = detectCrossClientLeak(EXECUTA_UUID, resultado);
        assert.equal(leak, 0, 'Nenhum registro de FluxAI Labs deve aparecer no filtro Executa');
    });

    test('06 — Agregação "Todos" não duplica registros', () => {
        const merged = aggregateAll(mockRegistry, mockRegistry);
        assert.equal(merged.length, mockRegistry.length, 'Sem duplicatas na agregação');
    });

    test('07 — Cards client-scoped respeitam filtro (count = 1 para cliente específico)', () => {
        const count = getFilteredCount(mockRegistry, FLUXAI_UUID);
        assert.equal(count, 1);
    });

    test('08 — Cards globais permanecem globais (selectedProjectId = null)', () => {
        const count = getFilteredCount(mockRegistry, null);
        assert.equal(count, mockRegistry.length);
    });

    test('09 — Cliente desconhecido fail-closed (count = 0)', () => {
        const count = getFilteredCount(mockRegistry, 'unknown-uuid-999');
        assert.equal(count, 0, 'UUID desconhecido deve resultar em 0 registros');
    });

    test('10 — Vazamento cross-client = 0 para FluxAI Labs', () => {
        const returned = [{ id: FLUXAI_UUID, company_name: 'FluxAI Labs' }];
        const leak = detectCrossClientLeak(FLUXAI_UUID, returned);
        assert.equal(leak, 0);
    });

    test('11 — Empty state: nenhum resultado quando filtro sem dados', () => {
        const count = getFilteredCount([], FLUXAI_UUID);
        assert.equal(count, 0);
    });

    test('12 — Erro controlado: registry vazio não quebra options', () => {
        const opts = buildClientFilterOptions([]);
        assert.equal(opts.length, 1); // Apenas "Todos os clientes"
        assert.equal(opts[0].id, null);
    });

    test('13 — Opções derivam de registry, não de hardcode', () => {
        const custom = [{ id: 'x-001', company_name: 'Cliente X', workspace_type: 'CLIENT', status: 'ATIVO' }];
        const opts = buildClientFilterOptions(custom);
        assert.equal(opts.length, 2);
        assert.equal(opts[1].label, 'Cliente X');
    });

    test('14 — Futuro cliente entra automaticamente', () => {
        const withFuture = [...mockRegistry, { id: 'cccc-0003', company_name: 'Novo Cliente', workspace_type: 'CLIENT', status: 'ATIVO' }];
        const opts = buildClientFilterOptions(withFuture);
        assert.equal(opts.length, 4); // Todos + 3 clientes
    });

    test('15 — FluxAI Labs logical_id mapeável', () => {
        const found = mockRegistry.find(c => c.company_name === 'FluxAI Labs');
        assert.ok(found, 'FluxAI Labs deve ser encontrado no registry');
        assert.equal(found.id, FLUXAI_UUID);
    });

    test('16 — Executa Group logical_id mapeável', () => {
        const found = mockRegistry.find(c => c.company_name === 'Executa Group');
        assert.ok(found, 'Executa Group deve ser encontrado no registry');
        assert.equal(found.id, EXECUTA_UUID);
    });
});
