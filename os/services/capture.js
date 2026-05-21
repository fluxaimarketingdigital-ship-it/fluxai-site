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

            try {
                const { data, error } = await supabase.from('crm_leads').insert([leadData]);
                if (error) throw error;

                // Sucesso
                if (btnSubmit) {
                    btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Enviado com Sucesso!';
                    btnSubmit.style.backgroundColor = '#10b981';
                }
                
                // Disparar evento customizado se o site quiser fazer redirect ou exibir modal
                window.dispatchEvent(new CustomEvent('fluxai_lead_captured', { detail: leadData }));
                
                // Disparo para o Webhook Real (Make.com / n8n) - Ampliação de Métricas
                const webhookUrl = localStorage.getItem('fluxai_webhook_lead');
                if (webhookUrl) {
                    fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            event: 'new_lead_captured_site',
                            source: 'FluxAI Website Form',
                            timestamp: new Date().toISOString(),
                            data: leadData
                        })
                    }).catch(e => console.warn('Falha silenciosa ao disparar webhook do site:', e));
                }
                
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
                    btnSubmit.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Tentar Novamente';
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
