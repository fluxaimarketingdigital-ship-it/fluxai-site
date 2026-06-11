const fs = require('fs');

const outFile = '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO_FINAL_V7.json';

function createAddRow(id, sheetId, values, x, y) {
    return {
        id,
        module: "google-sheets:addRow",
        version: 2,
        parameters: { "__IMTCONN__": 8785925 },
        mapper: {
            mode: "select",
            valueInputOption: "USER_ENTERED",
            from: "drive",
            spreadsheetId: "/1-MZBzS2KOZ_pSIR9rVX_mkecdvmQjF9j9q8ahMKqxQE",
            sheetId,
            includesHeaders: true,
            useColumnHeaders: false,
            insertDataOption: "INSERT_ROWS",
            insertUnformatted: false,
            ...values
        },
        metadata: { designer: { x, y } }
    };
}

function createUpdateRow(id, sheetId, valuesUpdate, x, y) {
    return {
        id,
        module: "google-sheets:updateRow",
        version: 2,
        parameters: { "__IMTCONN__": 8785925 },
        mapper: {
            mode: "select",
            valueInputOption: "USER_ENTERED",
            from: "drive",
            spreadsheetId: "/1-MZBzS2KOZ_pSIR9rVX_mkecdvmQjF9j9q8ahMKqxQE",
            sheetId,
            rowNumber: 1, // placeholder for user to map later
            includesHeaders: true,
            useColumnHeaders: false,
            ...valuesUpdate
        },
        metadata: { designer: { x, y } }
    };
}

function buildSheetFlow(baseId, sheetId, valuesAdd, valuesUpdate, yBase) {
    const subRouterId = baseId;
    const addId = baseId + 1;
    const updateId = baseId + 2;

    return [
        {
            id: subRouterId,
            module: "builtin:BasicRouter",
            version: 1,
            parameters: {},
            mapper: null,
            metadata: { designer: { x: 500, y: yBase } },
            routes: [
                {
                    name: "Rota Temporária (ADD)",
                    flow: [ createAddRow(addId, sheetId, valuesAdd, 800, yBase - 150) ]
                },
                {
                    name: "Rota Temporária (UPDATE)",
                    flow: [ createUpdateRow(updateId, sheetId, valuesUpdate, 800, yBase + 150) ]
                }
            ]
        }
    ];
}

function createSupabaseUpsert(id, table, fields, x, y) {
    return {
        id,
        module: "supabase:upsertARecord",
        version: 1,
        parameters: { "__IMTCONN__": 9280896 },
        mapper: { table, ...fields },
        onerror: [
            {
                id: id + 100,
                module: "builtin:Resume",
                version: 1,
                parameters: {},
                mapper: {},
                metadata: { designer: { x: x + 150, y: y + 100 } }
            }
        ],
        metadata: { designer: { x, y } }
    };
}

const webhook = {
    id: 1,
    module: "gateway:CustomWebHook",
    version: 1,
    parameters: { hook: 2372713, maxResults: 1 },
    mapper: {},
    metadata: { designer: { x: 0, y: 0 }, restore: { parameters: { hook: { label: "FLUXAI_PROXY_CLIENT_ONBOARDING_2026" } } } }
};

// Sheet 01 Add vs Update
const s01_add = { "0": "{{1.client_id}}", "1": "{{1.client_name}}", "2": "{{1.tipo_cliente}}", "3": "{{1.segmento}}", "4": "{{1.posicionamento_atual}}", "5": "{{1.posicionamento_desejado}}", "6": "{{1.proposta_valor}}", "7": "{{1.diferenciais}}", "8": "{{1.publico_alvo}}", "9": "{{1.persona_principal}}", "10": "{{1.dor_principal}}", "11": "{{1.desejo_principal}}", "12": "{{1.inimigo_comum}}", "13": "{{1.nivel_percepcao_premium}}", "14": "{{1.objetivo_principal}}", "15": "{{1.objetivo_mes_atual}}", "16": "{{1.prioridade_estrategica}}", "17": "{{1.tom_de_voz}}", "18": "{{1.palavras_evitar}}", "19": "{{1.palavras_usar}}", "20": "{{1.restricoes_comunicacao}}", "21": "{{1.roadmap_ia}}", "22": "{{1.status_cliente}}", "23": "{{1.responsavel_fluxai}}", "24": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "25": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const s01_upd = { ...s01_add }; delete s01_upd["24"]; 

// Sheet 02 Add vs Update
const s02_add = { "0": "{{1.contrato_id}}", "1": "{{1.client_id}}", "2": "{{1.client_name}}", "3": "{{1.tipo_contrato}}", "4": "{{1.plano_cliente}}", "5": "{{1.status_contrato}}", "6": "{{1.data_inicio}}", "7": "{{1.data_fim}}", "8": "{{1.dia_vencimento}}", "9": "{{1.fee_mensal}}", "10": "{{1.valor_setup}}", "11": "{{1.modulos_contratados}}", "12": "{{1.escopo_setup}}", "13": "{{1.creditos_ia_base_mes}}", "14": "{{1.link_contrato_drive}}", "15": "{{1.link_proposta_drive}}", "16": "{{1.observacao_contrato}}", "17": "{{1.responsavel_comercial}}", "18": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "19": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const s02_upd = { ...s02_add }; delete s02_upd["18"]; 

// Sheet 11 Add vs Update
const s11_add = { "0": "DNA_{{1.client_id}}", "1": "{{1.client_id}}", "2": "{{1.client_name}}", "3": "{{1.proposta_valor}}", "4": "{{1.diferenciais}}", "5": "{{1.tom_de_voz}}", "6": "estratégico, executivo, claro e humano", "7": "{{1.pilares_editoriais}}", "8": "{{1.linguagem_proibida}}", "9": "{{1.linguagem_proibida}}", "10": "{{1.proposta_valor}}", "11": "{{1.roadmap_ia}}", "12": "{{1.drive_folder_url}}", "13": "{{1.posicionamento_editorial}}", "14": "Não prometer resultado garantido", "15": "Evitar hype, promessa milagrosa e linguagem genérica", "16": "{{1.cta_padrao}}", "17": "{{1.linguagem_permitida}}", "18": "{{1.pilares_editoriais}}", "19": "{{1.pilares_editoriais}}", "20": "{{1.roadmap_ia}}", "21": "ativo", "22": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "23": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const s11_upd = { ...s11_add }; delete s11_upd["22"];

// Sheet 10 Add vs Update
const s10_add = { "0": "{{1.limite_id}}", "1": "{{1.client_id}}", "2": "{{1.client_name}}", "3": "{{1.mes_referencia}}", "4": "{{1.tipo_entrega}}", "5": "contrato_interno", "6": "{{1.contrato_id}}", "7": "{{1.creditos_ia_base_mes}}", "8": "0", "9": "0", "10": "{{1.creditos_ia_base_mes}}", "11": "ativo", "12": "{{1.modulos_contratados}}", "13": "não", "14": "não", "15": "{{1.responsavel}}", "16": "{{1.data_inicio}}", "17": "{{1.data_fim}}", "18": "Limite operacional interno de IA. Não representa crédito financeiro.", "19": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "20": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const s10_upd = { ...s10_add }; delete s10_upd["19"];

const r1 = { name: "1", flow: buildSheetFlow(100, "01_CLIENTES_ESTRATEGIA", s01_add, s01_upd, -600) };
const r2 = { name: "2", flow: buildSheetFlow(200, "02_CONTRATOS_CLIENTES", s02_add, s02_upd, -200) };
const r3 = { name: "3", flow: buildSheetFlow(300, "11_DNA_CLIENTE_GPT", s11_add, s11_upd, 200) };
const r4 = { name: "4", flow: buildSheetFlow(400, "10_IA_CREDITOS_CLIENTE", s10_add, s10_upd, 600) };

const r5 = {
    name: "Supabase",
    flow: [
        createSupabaseUpsert(501, "CLIENTES_ESTRATEGIA", {
            client_id: "{{1.client_id}}",
            cliente_nome: "{{1.client_name}}",
            segmento: "{{1.segmento}}",
            objetivo_principal: "{{1.objetivo_principal}}",
            responsavel_fluxai: "{{1.responsavel_fluxai}}",
            status_cliente: "{{1.status_cliente}}",
            data_atualizacao: "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
        }, 400, 1000),
        createSupabaseUpsert(502, "CONTRATOS_CLIENTES", {
            contrato_id: "{{1.contrato_id}}",
            client_id: "{{1.client_id}}",
            cliente_nome: "{{1.client_name}}",
            tipo_contrato: "{{1.tipo_contrato}}",
            plano_cliente: "{{1.plano_cliente}}",
            status_contrato: "{{1.status_contrato}}",
            data_inicio: "{{1.data_inicio}}",
            dia_vencimento: "{{1.dia_vencimento}}",
            valor_mensal: "{{1.fee_mensal}}",
            escopo_contratado: "{{1.escopo_setup}}",
            responsavel_comercial: "{{1.responsavel_comercial}}",
            data_atualizacao: "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
        }, 700, 1200)
    ]
};

const mainRouter = {
    id: 50,
    module: "builtin:BasicRouter",
    version: 1,
    parameters: {},
    mapper: null,
    metadata: { designer: { x: 150, y: 0 } },
    routes: [r1, r2, r3, r4, r5]
};

fs.writeFileSync(outFile, JSON.stringify({ name: "09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO_FINAL_V7", flow: [webhook, mainRouter] }, null, 4));
console.log("FINAL V7 (LEGO STRATEGY) GENERATED!");
