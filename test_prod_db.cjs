const SUPABASE_URL = "https://mufgwetfhfhhmhowbhjj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Zmd3ZXRmaGZoaG1ob3diaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg1MDYsImV4cCI6MjA5NDExNDUwNn0.G0VxvE6acPRKZIwee7d2ARBkIdqf9SRvVI1uagMrBZI";

async function checkProjects() {
    console.log('Querying all projects...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=id,company_name,workspace_type,status,metadata`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!response.ok) {
        console.error('Error:', await response.text());
        return;
    }
    
    const data = await response.json();
    console.log(`Found ${data.length} total projects in PRODUCTION DB:`);
    console.log(data.map(d => ({
        name: d.company_name,
        type: d.workspace_type,
        status: d.status,
        legacy_id: d.metadata?.legacy_client_id || null
    })));
}

checkProjects();
