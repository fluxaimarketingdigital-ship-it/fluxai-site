const SUPABASE_URL = "https://mufgwetfhfhhmhowbhjj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Zmd3ZXRmaGZoaG1ob3diaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg1MDYsImV4cCI6MjA5NDExNDUwNn0.G0VxvE6acPRKZIwee7d2ARBkIdqf9SRvVI1uagMrBZI";

async function runTests() {
    console.log("=== INICIANDO TESTE OPERACIONAL ===");
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
            headers: {
                "apikey": ANON_KEY,
                "Authorization": `Bearer ${ANON_KEY}`
            }
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errText}`);
        }
        
        const projects = await response.json();
        console.log(`[OK] Tabela projects carregada. Total de projetos: ${projects.length}`);
        
        let labsFound = false;
        let clientsFound = 0;
        let errors = [];

        projects.forEach(p => {
            console.log(`- Projeto: ${p.company_name} | Type: ${p.workspace_type} | Exempt: ${p.is_billing_exempt}`);
            
            if (p.company_name && p.company_name.toLowerCase().includes('fluxai labs')) {
                labsFound = true;
                if (p.workspace_type !== 'INTERNAL_WORKSPACE') {
                    errors.push(`Bug: FluxAI Labs tem workspace_type = ${p.workspace_type} em vez de INTERNAL_WORKSPACE`);
                }
                if (p.is_billing_exempt !== true) {
                    errors.push(`Bug: FluxAI Labs tem is_billing_exempt = ${p.is_billing_exempt} em vez de true`);
                }
            } else {
                clientsFound++;
                if (p.workspace_type !== 'CLIENT') {
                    errors.push(`Bug: Cliente externo (${p.company_name}) tem workspace_type = ${p.workspace_type} em vez de CLIENT`);
                }
                if (p.is_billing_exempt !== false) {
                    errors.push(`Bug: Cliente externo (${p.company_name}) tem is_billing_exempt = ${p.is_billing_exempt} em vez de false`);
                }
            }
        });
        
        if (!labsFound) {
            errors.push("Bug: Projeto FluxAI Labs não encontrado na tabela projects.");
        }
        if (clientsFound === 0) {
            console.log("[Aviso]: Nenhum projeto de cliente externo encontrado para validar.");
        }

        if (errors.length > 0) {
            console.error("=== BUGS ENCONTRADOS NO DB ===");
            errors.forEach(e => console.error(e));
        } else {
            console.log("=== BANCO DE DADOS VALIDADO COM SUCESSO ===");
        }

    } catch (e) {
        console.error("Erro ao conectar no Supabase:", e);
    }
}

runTests();
