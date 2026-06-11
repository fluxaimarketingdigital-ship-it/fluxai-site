const fs = require('node:fs');

const inputFile = '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_SEGURO.blueprint (4).json';
const outputFile = '09_FLUXAI_NOVO_CLIENTE_ONBOARDING_COM_SUPABASE.json';

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const blueprint = JSON.parse(rawData);
    
    // Find webhook and specific sheets modules
    const webhook = blueprint.flow.find(m => m.id === 1);
    const sheetsFlow = blueprint.flow.filter(m => [9, 10, 11, 12].includes(m.id));
    
    // Shift the sheets flow to the right
    sheetsFlow.forEach(m => {
        if(m.metadata && m.metadata.designer) {
            m.metadata.designer.x += 300;
        }
    });

    const router = {
        id: 50,
        module: "builtin:BasicRouter",
        version: 1,
        parameters: {},
        mapper: {},
        metadata: {
            designer: { x: 300, y: 0 }
        },
        routes: [
            {
                name: "Rota 1 - Google Sheets",
                flow: sheetsFlow
            },
            {
                name: "Rota 2 - Supabase",
                flow: [
                    {
                        id: 51,
                        module: "supabase:createARow",
                        version: 1,
                        parameters: {
                            "__IMTCONN__": null
                        },
                        mapper: {
                            table: "CLIENTES_ESTRATEGIA",
                            columns: {
                                client_id: "{{1.client_id}}",
                                cliente_nome: "{{1.client_name}}",
                                segmento: "{{1.segmento}}",
                                objetivo_principal: "{{1.objetivo_principal}}",
                                responsavel_fluxai: "{{1.responsavel_fluxai}}",
                                data_atualizacao: "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
                            }
                        },
                        metadata: {
                            designer: { x: 600, y: 300 },
                            parameters: [
                                { name: "__IMTCONN__", type: "account:supabase", label: "Connection", required: true }
                            ]
                        }
                    },
                    {
                        id: 52,
                        module: "supabase:createARow",
                        version: 1,
                        parameters: {
                            "__IMTCONN__": null
                        },
                        mapper: {
                            table: "CONTRATOS_CLIENTES",
                            columns: {
                                contrato_id: "{{1.contrato_id}}",
                                client_id: "{{1.client_id}}",
                                cliente_nome: "{{1.client_name}}",
                                escopo_contratado: "{{1.escopo_setup}}",
                                data_inicio: "{{1.data_inicio}}",
                                dia_vencimento: "{{1.dia_vencimento}}",
                                responsavel_comercial: "{{1.responsavel_comercial}}",
                                observacao: "Criado via onboarding FluxAI OS",
                                data_atualizacao: "{{formatDate(now; \"YYYY-MM-DD HH:mm:ss\")}}"
                            }
                        },
                        metadata: {
                            designer: { x: 900, y: 300 },
                            parameters: [
                                { name: "__IMTCONN__", type: "account:supabase", label: "Connection", required: true }
                            ]
                        }
                    }
                ]
            }
        ]
    };

    blueprint.flow = [webhook, router];

    fs.writeFileSync(outputFile, JSON.stringify(blueprint, null, 4));
    console.log("SUCESSO: Blueprint gerado em " + outputFile);

} catch (e) {
    console.error("ERRO: ", e);
}
