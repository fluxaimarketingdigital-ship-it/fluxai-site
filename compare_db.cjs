require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mufgwetfhfhhmhowbhjj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("ERRO: SUPABASE_SERVICE_ROLE_KEY não encontrada.");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function runCompare() {
  const { data: recs, error } = await supabase
    .from('CLIENTES_ESTRATEGIA')
    .select('client_id, setup_completo')
    .in('client_id', ['FLUXAI_LABS_001', 'proj_fluxai_labs_master']);

  if (error) { console.error(error); return; }

  const off = recs.find(r => r.client_id === 'FLUXAI_LABS_001');
  const sec = recs.find(r => r.client_id === 'proj_fluxai_labs_master');

  let offSetup = {};
  let secSetup = {};
  try { offSetup = typeof off.setup_completo === 'string' ? JSON.parse(off.setup_completo) : (off.setup_completo || {}); } catch(e){}
  try { secSetup = typeof sec.setup_completo === 'string' ? JSON.parse(sec.setup_completo) : (sec.setup_completo || {}); } catch(e){}

  const offKeys = Object.keys(offSetup);
  const secKeys = Object.keys(secSetup);

  const onlyOff = offKeys.filter(k => !secKeys.includes(k));
  const onlySec = secKeys.filter(k => !offKeys.includes(k));
  
  let diffCount = 0;
  for (const k of Object.keys(offSetup)) {
    if (secKeys.includes(k) && JSON.stringify(offSetup[k]) !== JSON.stringify(secSetup[k])) diffCount++;
  }

  console.log("OFFICIAL_SETUP_KEY_COUNT:", offKeys.length);
  console.log("SECOND_SETUP_KEY_COUNT:", secKeys.length);
  console.log("DIFFERENT_KEY_COUNT:", diffCount);
  console.log("ONLY_IN_OFFICIAL_COUNT:", onlyOff.length);
  console.log("ONLY_IN_SECOND_COUNT:", onlySec.length);
}

runCompare();
