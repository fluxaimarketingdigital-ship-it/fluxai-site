
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://mufgwetfhfhhmhowbhjj.supabase.co", "sb_publishable_Ui_zR38kkGVdTxRUELcRfw_5ahurUs5");

async function checkAsset(id) {
    const { data, error } = await supabase.from('content_assets').select('status, title').eq('id', id).single();
    if (error) console.error('Error:', error);
    else console.log('Asset:', data);
}

checkAsset('ec2e54c6-8d63-4266-af2a-b33bd6951610');
