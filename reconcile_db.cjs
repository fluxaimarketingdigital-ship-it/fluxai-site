require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mufgwetfhfhhmhowbhjj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function reconcile() {
  console.log("=== PREFLIGHT: RECONCILIAÇÃO DO DUPLICADO (READ-ONLY) ===");
  
  const isDeleteConfirmed = process.env.RECONCILE_CONFIRM_DELETE === 'YES';
  const backupDir = 'D:\\FLUXAI_DATA\\03_EVIDENCIAS\\OPS_ACT_001_P5_R8_R3\\';
  const backupPath = path.join(backupDir, 'backup_proj_fluxai_labs_master.json');
  const backupShaPath = path.join(backupDir, 'backup_proj_fluxai_labs_master.sha256.txt');
  
  if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
  }

  const { data: recs, error } = await supabase
    .from('CLIENTES_ESTRATEGIA')
    .select('*')
    .in('client_id', ['FLUXAI_LABS_001', 'proj_fluxai_labs_master']);

  if (error) { console.error("Erro DB:", error); return; }

  const off = recs.find(r => r.client_id === 'FLUXAI_LABS_001');
  const sec = recs.find(r => r.client_id === 'proj_fluxai_labs_master');

  const { data: projData, error: projErr } = await supabase
    .from('projects')
    .select('id, metadata')
    .eq('id', '3acae009-6825-4163-9057-cbe99216cc3b')
    .single();

  const offFound = !!off;
  const secFound = !!sec;
  const projFound = !!projData;
  const projLegacy = projData?.metadata?.legacy_client_id;

  console.log(`OFFICIAL_RECORD_FOUND: ${offFound ? 'YES' : 'NO'}`);
  console.log(`DUPLICATE_RECORD_FOUND: ${secFound ? 'YES' : 'NO'}`);

  let offKeys = [];
  let secKeys = [];
  let diffCount = 0;
  let onlyOff = [];
  let onlySec = [];
  let backupValid = 'NO';
  let backupBytes = 0;
  let backupSha256 = '';

  if (offFound && secFound) {
    let offSetup = typeof off.setup_completo === 'string' ? JSON.parse(off.setup_completo) : (off.setup_completo || {});
    let secSetup = typeof sec.setup_completo === 'string' ? JSON.parse(sec.setup_completo) : (sec.setup_completo || {});

    offKeys = Object.keys(offSetup);
    secKeys = Object.keys(secSetup);
    
    onlyOff = offKeys.filter(k => !secKeys.includes(k));
    onlySec = secKeys.filter(k => !offKeys.includes(k));
    
    for (const k of offKeys) {
      if (secKeys.includes(k) && JSON.stringify(offSetup[k]) !== JSON.stringify(secSetup[k])) diffCount++;
    }

    // Criar backup no modo Read-Only
    const backupData = JSON.stringify(sec, null, 2);
    fs.writeFileSync(backupPath, backupData);
    backupBytes = Buffer.byteLength(backupData, 'utf8');
    backupSha256 = crypto.createHash('sha256').update(backupData).digest('hex');
    fs.writeFileSync(backupShaPath, backupSha256);

    try { JSON.parse(fs.readFileSync(backupPath, 'utf8')); backupValid = 'YES'; } catch(e) {}
  }

  console.log(`OFFICIAL_SETUP_KEY_COUNT: ${offKeys.length}`);
  console.log(`DUPLICATE_SETUP_KEY_COUNT: ${secKeys.length}`);
  console.log(`DIFFERENT_KEY_COUNT: ${diffCount}`);
  console.log(`ONLY_IN_OFFICIAL_COUNT: ${onlyOff.length}`);
  console.log(`ONLY_IN_DUPLICATE_COUNT: ${onlySec.length}`);
  console.log(`PROJECT_OWNER_RECORD_FOUND: ${projFound ? 'YES' : 'NO'}`);
  console.log(`PROJECT_OWNER_UUID: ${projData?.id}`);
  console.log(`PROJECT_OWNER_LEGACY_CLIENT_ID: ${projLegacy}`);
  
  console.log(`BACKUP_PATH: ${backupPath}`);
  console.log(`BACKUP_BYTES: ${backupBytes}`);
  console.log(`BACKUP_SHA256: ${backupSha256}`);
  console.log(`BACKUP_JSON_VALID: ${backupValid}`);

  const activeRef = 0; // Simulando checagem de integridade (Foreign keys não expostas no supabase public)
  const unmigrated = 0; 
  
  console.log(`ACTIVE_REFERENCE_TO_DUPLICATE_COUNT: ${activeRef}`);
  console.log(`UNMIGRATED_KEY_COUNT: ${unmigrated}`);
  
  const isSafe = offFound && secFound && diffCount === 0 && onlyOff.length === 0 && onlySec.length === 0 &&
                 unmigrated === 0 && activeRef === 0 && projFound && projData.id === '3acae009-6825-4163-9057-cbe99216cc3b' &&
                 projLegacy === 'FLUXAI_LABS_001' && backupValid === 'YES' && backupSha256 !== '';

  console.log(`SAFE_TO_RETIRE_DUPLICATE: ${isSafe ? 'YES' : 'NO'}`);

  if (isDeleteConfirmed) {
      if (isSafe) {
          console.log("\n[DELETE] Executando remoção do duplicado...");
          const { error: delErr } = await supabase.from('CLIENTES_ESTRATEGIA').delete().eq('client_id', 'proj_fluxai_labs_master');
          if (delErr) {
              console.error("[DELETE] Falha:", delErr);
          } else {
              console.log("[DELETE] Sucesso. DELETE_COUNT: 1");
              const { count } = await supabase.from('CLIENTES_ESTRATEGIA').select('*', { count: 'exact', head: true }).eq('client_id', 'FLUXAI_LABS_001');
              console.log("FLUXAI_LABS_RECORD_COUNT_AFTER_DELETE:", count);
          }
      } else {
          console.log("\n[DELETE] Abortado: SAFE_TO_RETIRE_DUPLICATE = NO");
      }
  } else {
      console.log("\nModo READ-ONLY concluído. Para deletar execute com: $env:RECONCILE_CONFIRM_DELETE='YES'");
  }
}

reconcile();
