import { OS_CONFIG } from '../config/os-config.js';
import { OS_LOGS_ENGINE } from './logs-engine.js';

export const LeadCapture = {
    init: () => {
        // Assegurar que o Supabase client está disponível via CDN se não estiver empacotado
        if (typeof window.supabase === 'undefined') {
            console.warn('[FluxAI Capture] Biblioteca Supabase não encontrada no contexto global.');
            return;
        }

        const supabase = window.supabase.createClient(OS_CONFIG.supabase.url, OS_CONFIG.supabase.anonKey);
        
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
                status_lead: "novo",
                responsavel: "FluxAI",
                observacao: formData.get('internal_notes') || ''
            };

            try {
                // Registrar log de tentativa de envio
                OS_LOGS_ENGINE.userAction('LEAD_CAPTURED', payloadMake, !OS_CONFIG.flags.sendRealWebhooks);

                // Enviar via hub de webhooks centralizado
                const result = await OS_CONFIG.webhooks.send('LEAD_CAPTURE', payloadMake);
                
                if (!result.success) throw new Error(result.error || 'Erro ao enviar lead.');

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
                OS_LOGS_ENGINE.error('Erro ao enviar lead no formulário', { email: leadData.email, error: err.message }, err);
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
