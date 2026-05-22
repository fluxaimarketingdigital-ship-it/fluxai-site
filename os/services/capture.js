import { SUPABASE_CONFIG } from '../config/supabase-config.js';

export const LeadCapture = {
    init: () => {
        // Assegurar que o Supabase client está disponível via CDN se não estiver empacotado
        if (typeof window.supabase === 'undefined') {
            console.warn('[FluxAI Capture] Biblioteca Supabase não encontrada no contexto global.');
            return;
        }

        const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        
        const form = document.getElementById('fluxai-lead-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = form.querySelector('button[type="submit"]');
            const originalText = btnSubmit ? btnSubmit.innerHTML : 'Enviar';
            if (btnSubmit) btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

            // Coletar dados
            const formData = new FormData(form);
            const leadData = {
                name: formData.get('name') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                company: formData.get('company') || '',
                pain_point: formData.get('pain_point') || '',
                internal_notes: formData.get('internal_notes') || '',
                source: 'WEBSITE',
                status: 'NOVO',
                temperature: 'MORNO',
                health_score: 50,
                utm_source: new URLSearchParams(window.location.search).get('utm_source') || 'orgânico'
            };

            // Payload exclusivo para o Make.com
            const payloadMake = {
                cliente_id: "FLUXAI_LABS_001",
                cliente_nome: "FluxAI Labs",
                origem_site: "site_fluxai",
                nome_lead: formData.get('name') || '',
                email: formData.get('email') || '',
                telefone: formData.get('phone') || '',
                empresa: formData.get('company') || '',
                servico_interesse: "leads_site",
                canal_origem: "site",
                campanha: new URLSearchParams(window.location.search).get('utm_campaign') || '',
                pagina_origem: window.location.href,
                observacao: formData.get('internal_notes') || ''
            };

            const webhookUrl = 'https://hook.us2.make.com/gmu9xakjqfocdd8nk4sn5lxcc7pmbte2';

            try {
                console.log('Enviando payload para o Make:', payloadMake);
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadMake)
                });
                console.log('Resposta do Make:', response);

                if (!response.ok) throw new Error('Erro na requisição para o Make');

                // Envio assíncrono pro Supabase (sem afetar a resposta do Make)
                supabase.from('crm_leads').insert([leadData]).catch(e => console.warn('Erro silencioso no Supabase', e));

                if (btnSubmit) {
                    btnSubmit.innerHTML = 'Diagnóstico enviado com sucesso.';
                    btnSubmit.style.backgroundColor = '#10b981';
                }
                
                window.dispatchEvent(new CustomEvent('fluxai_lead_captured', { detail: payloadMake }));
                
                setTimeout(() => {
                    form.reset();
                    if (btnSubmit) {
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.style.backgroundColor = '';
                    }
                }, 3000);

            } catch (err) {
                console.error('[FluxAI Capture] Erro ao enviar lead:', err);
                if (btnSubmit) {
                    btnSubmit.innerHTML = 'Não foi possível enviar seu diagnóstico agora. Tente novamente.';
                    btnSubmit.style.backgroundColor = '#ef4444';
                }
                setTimeout(() => {
                    if (btnSubmit) {
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.style.backgroundColor = '';
                    }
                }, 3000);
            }
        });
    }
};

// Auto-init se incluído diretamente via módulo
document.addEventListener('DOMContentLoaded', () => {
    LeadCapture.init();
});
