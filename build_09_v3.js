const fs = require('node:fs');

const outFile = '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO_FINAL_V3.json';

function createSearchRows(id, sheetId, searchColumn, searchValue, x, y) {
    return {
        id,
        module: "google-sheets-dummy:searchRows",
        version: 2,
        parameters: { "__IMTCONN__": null },
        mapper: {},
        metadata: { designer: { x, y } }
    };
}

function createAggregator(id, sourceId, x, y) {
    return {
        id,
        module: "builtin-dummy:ArrayAggregator",
        version: 1,
        parameters: {},
        mapper: {},
        metadata: { designer: { x, y } }
    };
}

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

function createUpdateRow(id, sheetId, aggId, values, x, y) {
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
            rowNumber: `{{get(map(${aggId}.array; "rowNumber"); 1)}}`, // safe extract rowNumber from aggregator array
            includesHeaders: true,
            useColumnHeaders: false,
            values
        },
        metadata: { designer: { x, y } }
    };
}

function buildSheetFlow(baseId, sheetId, searchValue, values, yBase) {
    const searchId = baseId;
    const aggId = baseId + 1;
    const routerId = baseId + 2;
    const addId = baseId + 3;
    const updateId = baseId + 4;

    return [
        createSearchRows(searchId, sheetId, "A", searchValue, 400, yBase),
        createAggregator(aggId, searchId, 600, yBase),
        {
            id: routerId,
            module: "builtin:BasicRouter",
            version: 1,
            parameters: {},
            mapper: {},
            metadata: { designer: { x: 800, y: yBase } },
            routes: [
                {
                    name: "Não existe (Add)",
                    flow: [ createAddRow(addId, sheetId, values, 1100, yBase - 150) ]
                },
                {
                    name: "Existe (Update)",
                    flow: [ createUpdateRow(updateId, sheetId, aggId, values, 1100, yBase + 150) ]
                }
            ]
        }
    ];
}

const webhook = {
    id: 1,
    module: "gateway:CustomWebHook",
    version: 1,
    parameters: { hook: 2372713, maxResults: 1 },
    mapper: {},
    metadata: { designer: { x: 0, y: 0 } }
};

const val01 = { "0": "{{1.client_id}}", "1": "{{1.client_name}}", "2": "{{1.segmento}}", "3": "{{1.objetivo_principal}}", "4": "{{1.responsavel_fluxai}}", "5": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "6": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const val02 = { "0": "{{1.contrato_id}}", "1": "{{1.client_id}}", "2": "{{1.client_name}}", "3": "interno", "4": "cliente_interno_validacao", "5": "vigente", "6": "{{1.data_inicio}}", "8": "{{1.dia_vencimento}}", "9": "{{1.fee_mensal}}", "10": "0", "11": "{{1.modulos_contratados}}", "12": "{{1.escopo_setup}}", "13": "30", "14": "{{1.link_contrato_drive}}", "16": "Criado via onboarding", "17": "{{1.responsavel}}", "18": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "19": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const val11 = { "0": "DNA_{{1.client_id}}", "1": "{{1.client_id}}", "2": "{{1.client_name}}", "3": "{{1.proposta_valor}}", "4": "{{1.diferenciais}}", "5": "{{1.tom_de_voz}}", "6": "{{1.data_inicio}}", "7": "{{1.pilares_editoriais}}", "8": "{{1.linguagem_proibida}}", "9": "{{1.linguagem_proibida}}", "10": "{{1.proposta_valor}}", "11": "{{1.roadmap_ia}}", "12": "{{1.drive_folder_url}}", "13": "{{1.posicionamento_editorial}}", "14": "Não prometer", "15": "Evitar hype", "16": "{{1.cta_padrao}}", "17": "{{1.linguagem_permitida}}", "18": "{{1.pilares_editoriais}}", "19": "{{1.pilares_editoriais}}", "20": "{{1.roadmap_ia}}", "21": "ativo", "22": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "23": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };
const val10 = { "0": "{{1.limite_id}}", "1": "{{1.client_id}}", "2": "{{1.client_name}}", "3": "{{1.mes_referencia}}", "4": "{{1.tipo_entrega}}", "5": "contrato_interno", "6": "{{1.contrato_id}}", "7": "30", "8": "0", "9": "0", "10": "30", "11": "ativo", "12": "{{1.modulos_contratados}}", "13": "não", "14": "não", "15": "{{1.responsavel}}", "16": "{{1.data_inicio}}", "18": "Limite operacional", "19": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}", "20": "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}" };

const r1 = { name: "1", flow: buildSheetFlow(100, "01_CLIENTES_ESTRATEGIA", "{{1.client_id}}", val01, -600) };
const r2 = { name: "2", flow: buildSheetFlow(200, "02_CONTRATOS_CLIENTES", "{{1.contrato_id}}", val02, -200) };
const r3 = { name: "3", flow: buildSheetFlow(300, "11_DNA_CLIENTE_GPT", "DNA_{{1.client_id}}", val11, 200) };
const r4 = { name: "4", flow: buildSheetFlow(400, "10_IA_CREDITOS_CLIENTE", "{{1.limite_id}}", val10, 600) };

const r5 = {
    name: "Supabase",
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
    routes: [r1, r2, r3, r4, r5]
};

fs.writeFileSync(outFile, JSON.stringify({ name: "09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO_FINAL", flow: [webhook, mainRouter] }, null, 4));
console.log("FINAL V3 GENERATED!");
