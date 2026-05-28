import { getSupabase } from '../../services/supabase-client.js';

export async function populateProjectFilter(selectId, onSelectCallback, currentProject) {
    const filter = document.getElementById(selectId);
    if (!filter) return;

    if (currentProject) filter.value = currentProject;
    
    filter.onchange = async (e) => {
        const newProj = e.target.value;
        localStorage.setItem('fluxai_current_project_id', newProj);
        if (onSelectCallback) {
            await onSelectCallback(newProj);
        }
    };

    try {
        const cached = localStorage.getItem('fluxai_supabase_projects');
        let projects = cached ? JSON.parse(cached) : [];
        if (!projects || projects.length === 0) {
            const supabase = getSupabase();
            const { data } = await supabase.from('projects').select('*').eq('status', 'ATIVO');
            projects = data || [];
        }

        filter.textContent = '';
        const optDef = document.createElement('option');
        optDef.value = "";
        optDef.textContent = "Selecione um Cliente...";
        filter.appendChild(optDef);
        
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = p.company_name || p.name;
            if (p.id === currentProject) opt.selected = true;
            filter.appendChild(opt);
        });
    } catch (e) {
        console.warn('Erro ao carregar projetos no filtro:', e);
    }
}
