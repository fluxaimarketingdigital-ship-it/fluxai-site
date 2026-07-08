require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://mufgwetfhfhhmhowbhjj.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
async function run() {
  const { data, error } = await supabase.from('PLANEJAMENTO_CONTEUDO').select('*').order('data_criacao', { ascending: false }).limit(3);
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}
run();
