require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mufgwetfhfhhmhowbhjj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada no ambiente.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  console.log("=== FASE 1: AUDITORIA READ-ONLY DO BANCO ===");

  const { data: estData, error: estErr } = await supabase
    .from('CLIENTES_ESTRATEGIA')
    .select('client_id, cliente_nome, data_criacao, data_atualizacao')
    .ilike('cliente_nome', '%FluxAI Labs%');
    
  if (estErr) {
    console.error("Erro ao acessar CLIENTES_ESTRATEGIA:", estErr);
  } else {
    console.log("FLUXAI_LABS_RECORD_COUNT_DB:", estData.length);
    console.log("FLUXAI_LABS_RECORD_IDS:", estData.map(r => r.client_id).join(', '));
    console.log("Detalhes CLIENTES_ESTRATEGIA:", JSON.stringify(estData, null, 2));
  }

  const { data: projData, error: projErr } = await supabase
    .from('projects')
    .select('id, company_name, metadata')
    .ilike('company_name', '%FluxAI Labs%');

  if (projErr) {
    console.error("Erro ao acessar projects:", projErr);
  } else {
    console.log("PROJECT_OWNER_RECORD_FOUND:", projData.length > 0 ? "YES" : "NO");
    if (projData.length > 0) {
      projData.forEach(p => {
        console.log("PROJECT_OWNER_UUID:", p.id);
        console.log("PROJECT_OWNER_LEGACY_CLIENT_ID:", p.metadata?.legacy_client_id);
      });
    }
  }
}

runAudit();
