import { OS_CONFIG } from '../config/os-config.js';
import { OS_LOGS_ENGINE } from './logs-engine.js';
import { getUrlParam } from './sanitizer.js';

export const LeadCapture = {
    init: () => {
        const form = document.getElementById('fluxai-lead-form');
        if (!form) return;
        
        let supabaseClient = null;
        const initSupabase = async () => {
            if (supabaseClient) return supabaseClient;
            if (typeof window.supabase === 'undefined') {
                // Se ainda não carregou, force o carregamento agora
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            supabaseClient = window.supabase.createClient(OS_CONFIG.supabase.url, OS_CONFIG.supabase.anonKey);
            return supabaseClient;
        };
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = form.querySelector('button[type="submit"]');
            const originalText = btnSubmit ? btnSubmit.innerHTML : 'Enviar';
            if (btnSubmit) btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

            // Coletar dados
            const formData = new FormData(form);
            
            // Gerar ID no formato LEAD-YYYYMMDD-HHMMSS
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const leadIdStr = `LEAD-${year}${month}${day}-${hours}${minutes}${seconds}`;

            const leadData = {
                id: leadIdStr,
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
                utm_source: getUrlParam('utm_source', 'orgânico', { allowPattern: /^[a-zA-Z0-9_\-\s]{0,100}$/ })
            };

            // Payload exclusivo para o Make.com
            const payloadMake = {
                lead_id: leadIdStr,
                cliente_id: "FLUXAI_LABS_001",
                cliente_nome: "FluxAI Labs",
                origem_site: "site_fluxai",
                nome_lead: formData.get('name') || '',
                email: formData.get('email') || '',
                telefone: formData.get('phone') || '',
                empresa: formData.get('company') || '',
                servico_interesse: "leads_site",
                canal_origem: "site",
                campanha: getUrlParam('utm_campaign', '', { allowPattern: /^[a-zA-Z0-9_\-\s]{0,100}$/ }),
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
                try {
                    const client = await initSupabase();
                    client.from('crm_leads').insert([leadData]).catch(e => console.warn('Erro silencioso no Supabase', e));
                } catch (e) {
                    console.warn('[FluxAI Capture] Supabase falhou ao inicializar no background.', e);
                }

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
