import { useMakeRoute } from './os/services/useMakeRoute.js';
import { ROTAS_OS_MAKE } from './os/services/makeRoutes.js';

// MOCK GLOBAL DO FETCH (MOCK TOTAL - NENHUM POST REAL)
let fetchChamado = false;
global.fetch = async (url, options) => {
    fetchChamado = true;
    console.log(`\n[REDE SIMULADA] POST interceptado para: ${url}`);
    
    // Mostrando o Payload formatado
    const obj = JSON.parse(options.body);
    console.log(`[PAYLOAD FINAL MONTADO]:\n${JSON.stringify(obj, null, 2)}`);
    
    // Simula resposta ok=false se o email for 'erro@email.com'
    if (options.body.includes('erro@email.com')) {
        return {
            ok: false,
            status: 400,
            text: async () => JSON.stringify({ ok: false, message: 'Simulação de erro do Make', motivo_bloqueio: 'teste_erro_forçado' }),
            json: async () => ({ ok: false, message: 'Simulação de erro do Make', motivo_bloqueio: 'teste_erro_forçado' })
        };
    }

    // Simula resposta Accepted string pura para ROTA_OS_14_ARQUIVOS
    if (options.body.includes('simulacao_accepted_rota_14')) {
        return {
            ok: true,
            status: 200,
            text: async () => 'Accepted',
            json: async () => { throw new Error('Não é JSON'); }
        };
    }
    
    return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true, message: 'Simulação de Sucesso' }),
        json: async () => ({ ok: true, message: 'Simulação de Sucesso' })
    };
};

global.window = {
    confirm: (msg) => {
        console.log(`[MODAL CONFIRM EXIBIDO] ${msg.replace(/\n/g, ' ')}`);
        return true; 
    }
};

global.alert = (msg) => {
    console.log(`[ALERT EXIBIDO] ${msg}`);
};

async function runTests() {
    console.log("=== INICIANDO TESTES ISOLADOS (SEM REDE REAL) ===\n");

    // Teste 1: Geração de ID (ROTA 01)
    console.log("--> TESTE 1: Geração de ID (ROTA 01)");
    const payload1 = { titulo: "Teste ID", descricao: "Validar geracao" };
    const res1 = await useMakeRoute.executeRoute('ROTA_OS_01_PORTAL_DEMANDAS', payload1, { role: 'ADMIN' });
    console.log("Resultado Função Teste 1:", res1, "\n");

    // Teste 2: Payload ROTA 02
    console.log("--> TESTE 2: Geração de ID (ROTA 02)");
    const payload2 = { nome_lead: "Lead Local", email: "teste@email.com" };
    const res2 = await useMakeRoute.executeRoute('ROTA_OS_02_LEADS_SITE', payload2, { role: 'ADMIN' });
    console.log("Resultado Função Teste 2:", res2, "\n");

    // Teste 3: Rota Inativa
    ROTAS_OS_MAKE['ROTA_TESTE_INATIVA'] = { rota_id: 'R_INATIVA', status_rota: 'inativo', webhook_url: 'https://mock.local' };
    console.log("--> TESTE 3: Rota inativa");
    const res3 = await useMakeRoute.executeRoute('ROTA_TESTE_INATIVA', {}, { role: 'ADMIN' });
    console.log("Resultado Função Teste 3:", res3, "\n");

    // Teste 4: Rota Manual sem permissão
    console.log("--> TESTE 4: Rota manual com role CLIENT (ROTA 09)");
    const res4 = await useMakeRoute.executeRoute('ROTA_OS_09_ONBOARDING', {}, { role: 'CLIENT' });
    console.log("Resultado Função Teste 4:", res4, "\n");

    // Teste 5: Aviso/Confirm Rota Monitorada
    // Necessita passar os dados de confirmacao e ter um webhookUrl senao bate no bloqueio webhook vazio
    ROTAS_OS_MAKE['ROTA_OS_11_IA_CREDITOS'].webhook_url = 'mock_url_apenas_para_passar';
    console.log("--> TESTE 5: Rota Monitorada (ROTA 11)");
    const res5 = await useMakeRoute.executeRoute('ROTA_OS_11_IA_CREDITOS', {}, { role: 'OPERATOR' });
    console.log("Resultado Função Teste 5:", res5, "\n");

    // Teste 6: Bloqueio webhook vazio
    console.log("--> TESTE 6: Webhook vazio (ROTA 15)");
    const res6 = await useMakeRoute.executeRoute('ROTA_OS_15_PLANEJAMENTO', {}, { role: 'OPERATOR' });
    console.log("Resultado Função Teste 6:", res6, "\n");

    // Teste 7: Resposta ok=false
    console.log("--> TESTE 7: Resposta ok=false simulada (ROTA 02)");
    const payloadErro = { nome_lead: "Erro", email: "erro@email.com" };
    const res7 = await useMakeRoute.executeRoute('ROTA_OS_02_LEADS_SITE', payloadErro, { role: 'ADMIN' });
    console.log("Resultado Função Teste 7:", res7, "\n");

    // Teste 8: Resposta Accepted (ROTA_OS_14_ARQUIVOS)
    console.log("--> TESTE 8: Interpretação de Sucesso ROTA 14 (Simulação 'Accepted')");
    ROTAS_OS_MAKE['ROTA_OS_14_ARQUIVOS'].webhook_url = 'mock_url_para_14';
    const payloadArq = { arquivo_id: "", observacao: "simulacao_accepted_rota_14" };
    const res8 = await useMakeRoute.executeRoute('ROTA_OS_14_ARQUIVOS', payloadArq, { role: 'ADMIN' });
    console.log("Resultado Função Teste 8:", res8, "\n");

    console.log(`=== FIM DOS TESTES ===`);
    console.log(`CONFIRMAÇÃO: fetch verdadeiro chamado? NÃO. Somente o Mock interceptou as chamadas: ${fetchChamado}`);
}

runTests();
