const fs = require('fs');

const outFile = '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO_FINAL.json';

// Utility to create a Google Sheets Add Row module
function createAddRow(id, sheetId, values, x, y) {
    return {
        id,
        module: "google-sheets:addRow",
        version: 2,
        parameters: { "__IMTCONN__": null },
        mapper: {
            mode: "select",
            valueInputOption: "USER_ENTERED",
            from: "drive",
            spreadsheetId: "/1-MZBzS2KOZ_pSIR9rVX_mkecdvmQjF9j9q8ahMKqxQE",
            sheetId,
            includesHeaders: true,
            useColumnHeaders: false,
            values
        },
        metadata: { designer: { x, y } }
    };
}

// Utility to create a Google Sheets Update Row module
function createUpdateRow(id, sheetId, searchId, values, x, y) {
    return {
        id,
        module: "google-sheets:updateRow",
        version: 2,
        parameters: { "__IMTCONN__": null },
        mapper: {
            mode: "select",
            valueInputOption: "USER_ENTERED",
            from: "drive",
            spreadsheetId: "/1-MZBzS2KOZ_pSIR9rVX_mkecdvmQjF9j9q8ahMKqxQE",
            sheetId,
            rowNumber: `{{${searchId}.__IMTINDEX__}}`, // typical make row index variable
            includesHeaders: true,
            useColumnHeaders: false,
            values
        },
        metadata: { designer: { x, y } }
    };
}

// Utility to create a Google Sheets Search Rows module
function createSearchRows(id, sheetId, searchColumnIndex, searchValue, x, y) {
    return {
        id,
        module: "google-sheets-dummy:searchRows",
        version: 2,
        parameters: { "__IMTCONN__": null },
        mapper: {
            mode: "select",
            from: "drive",
            spreadsheetId: "/1-MZBzS2KOZ_pSIR9rVX_mkecdvmQjF9j9q8ahMKqxQE",
            sheetId
        },
        metadata: { designer: { x, y } }
    };
}

// Sub-flow for a specific Sheet
function buildSheetUpsertFlow(baseId, sheetId, searchValue, values, yBase) {
    const searchId = baseId;
    const routerId = baseId + 1;
    const addId = baseId + 2;
    const updateId = baseId + 3;

    return [
        createSearchRows(searchId, sheetId, searchValue, 400, yBase),
        {
            id: routerId,
            module: "builtin:BasicRouter",
            version: 1,
            parameters: {},
            mapper: {},
            metadata: { designer: { x: 700, y: yBase } },
            routes: [
                {
                    name: "Não existe -> Add",
                    flow: [ createAddRow(addId, sheetId, values, 1000, yBase - 150) ]
                },
                {
                    name: "Existe -> Update",
                    flow: [ createUpdateRow(updateId, sheetId, searchId, values, 1000, yBase + 150) ]
                }
            ]
        }
    ];
}

// Webhook
const webhook = {
    id: 1,
    module: "gateway:CustomWebHook",
    version: 1,
    parameters: { hook: 2372713, maxResults: 1 },
    mapper: {},
    metadata: { designer: { x: 0, y: 0 } }
};

// Define mappings for each sheet based on the reference (4).json
const val01 = {
    "0": "CLIENTE_FLUXAI_LABS_001_2026",
    "1": "{{1.client_id}}",
    "2": "{{1.client_name}}",
    "3": "{{1.segmento}}",
    "4": "{{1.objetivo_principal}}",
    "5": "{{1.responsavel_fluxai}}",
    "6": "2026-06-06 12:26:01",
    "7": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
};

const val02 = {
    "0": "CONTRATO_FLUXAI_LABS_001_2026",
    "1": "{{1.client_id}}",
    "2": "{{1.client_name}}",
    "3": "interno",
    "4": "cliente_interno_validacao",
    "5": "vigente",
    "6": "{{1.data_inicio}}",
    "8": "{{1.dia_vencimento}}",
    "9": "{{1.fee_mensal}}",
    "10": "0",
    "11": "{{1.modulos_contratados}}",
    "12": "{{1.escopo_setup}}",
    "13": "30",
    "14": "{{1.link_contrato_drive}}",
    "16": "Criado via onboarding FluxAI OS",
    "17": "{{1.responsavel}}",
    "18": "2026-06-06 12:26:01",
    "19": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
};

const val11 = {
    "0": "DNA_FLUXAI_LABS_001",
    "1": "{{1.client_id}}",
    "2": "{{1.client_name}}",
    "3": "{{1.proposta_valor}}",
    "4": "{{1.diferenciais}}",
    "5": "{{1.tom_de_voz}}",
    "6": "{{1.data_inicio}}",
    "7": "{{1.pilares_editoriais}}",
    "8": "{{1.linguagem_proibida}}",
    "9": "{{1.linguagem_proibida}}",
    "10": "{{1.proposta_valor}}",
    "11": "{{1.roadmap_ia}}",
    "12": "{{1.drive_folder_url}}",
    "13": "{{1.posicionamento_editorial}}",
    "14": "Não prometer resultado garantido",
    "15": "Evitar hype, promessa milagrosa e linguagem genérica",
    "16": "{{1.cta_padrao}}",
    "17": "{{1.linguagem_permitida}}",
    "18": "{{1.pilares_editoriais}}",
    "19": "{{1.pilares_editoriais}}",
    "20": "{{1.roadmap_ia}}",
    "21": "ativo",
    "22": "2026-06-06 12:26:01",
    "23": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
};

const val10 = {
    "0": "IA_FLUXAI_LABS_001_2026_06",
    "1": "{{1.client_id}}",
    "2": "{{1.client_name}}",
    "3": "{{1.mes_referencia}}",
    "4": "{{1.tipo_entrega}}",
    "5": "contrato_interno",
    "6": "CONTRATO_FLUXAI_LABS_001_2026",
    "7": "30",
    "8": "0",
    "9": "0",
    "10": "30",
    "11": "ativo",
    "12": "{{1.modulos_contratados}}",
    "13": "não",
    "14": "não",
    "15": "{{1.responsavel}}",
    "16": "{{1.data_inicio}}",
    "18": "Limite operacional",
    "19": "2026-06-06 12:26:01",
    "20": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
};

const route1 = { name: "Sheets 01", flow: buildSheetUpsertFlow(100, "01_CLIENTES_ESTRATEGIA", "{{1.client_id}}", val01, -600) };
const route2 = { name: "Sheets 02", flow: buildSheetUpsertFlow(200, "02_CONTRATOS_CLIENTES", "{{1.contrato_id}}", val02, -200) };
const route3 = { name: "Sheets 11", flow: buildSheetUpsertFlow(300, "11_DNA_CLIENTE_GPT", "{{1.dna_id}}", val11, 200) };
const route4 = { name: "Sheets 10", flow: buildSheetUpsertFlow(400, "10_IA_CREDITOS_CLIENTE", "{{1.limite_id}}", val10, 600) };

const route5 = {
    name: "Supabase Upsert",
    flow: [
        {
            id: 501,
            module: "supabase:upsertARecord",
            version: 1,
            parameters: { "__IMTCONN__": null },
            mapper: {
                table: "CLIENTES_ESTRATEGIA",
                client_id: "{{1.client_id}}",
                cliente_nome: "{{1.client_name}}",
                segmento: "{{1.segmento}}",
                objetivo_principal: "{{1.objetivo_principal}}",
                responsavel_fluxai: "{{1.responsavel_fluxai}}",
                data_atualizacao: "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
            },
            metadata: { designer: { x: 400, y: 1000 } }
        },
        {
            id: 502,
            module: "supabase:upsertARecord",
            version: 1,
            parameters: { "__IMTCONN__": null },
            mapper: {
                table: "CONTRATOS_CLIENTES",
                contrato_id: "{{1.contrato_id}}",
                client_id: "{{1.client_id}}",
                cliente_nome: "{{1.client_name}}",
                escopo_contratado: "{{1.escopo_setup}}",
                data_inicio: "{{1.data_inicio}}",
                dia_vencimento: "{{1.dia_vencimento}}",
                responsavel_comercial: "{{1.responsavel_comercial}}",
                observacao: "Criado via onboarding FluxAI OS",
                data_atualizacao: "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
            },
            metadata: { designer: { x: 700, y: 1200 } }
        }
    ]
};

const mainRouter = {
    id: 50,
    module: "builtin:BasicRouter",
    version: 1,
    parameters: {},
    mapper: {},
    metadata: { designer: { x: 150, y: 0 } },
    routes: [route1, route2, route3, route4, route5]
};

const finalBlueprint = {
    name: "09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO_FINAL",
    flow: [webhook, mainRouter]
};

fs.writeFileSync(outFile, JSON.stringify(finalBlueprint, null, 4));
console.log("FINAL BLUEPRINT GENERATED!");
