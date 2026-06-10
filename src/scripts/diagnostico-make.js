import { useMakeRoute } from '/os/services/useMakeRoute.js';

// Utilitário inline de sanitização
const UTM_PATTERN = /^[a-zA-Z0-9_\-\s]{0,100}$/;
function safeUtmParam(key, fallback = '') {
    const raw = new URLSearchParams(window.location.search).get(key);
    if (!raw) return fallback;
    const clean = String(raw).slice(0, 100);
    if (/^(javascript|data|vbscript):/i.test(clean.trim())) return fallback;
    return UTM_PATTERN.test(clean) ? clean : fallback;
}

document.addEventListener('DOMContentLoaded', () => {
    // 8. DIAGNOSTICO FORM (WEBHOOK + WHATSAPP REDIRECT)
    const diagnosticoForm = document.getElementById('diagnosticoForm');
    if (diagnosticoForm) {
        let form_start_triggered = false;
        diagnosticoForm.addEventListener('focusin', () => {
            if(!form_start_triggered) {
                form_start_triggered = true;
                if(typeof trackEvent === 'function') trackEvent('form_start', { form_id: 'diagnosticoForm' });
            }
        });
    
        diagnosticoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = diagnosticoForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit?.innerHTML || 'Enviar';
            if (btnSubmit) {
                btnSubmit.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
                btnSubmit.disabled = true;
            }

            const nome = document.getElementById('nome')?.value?.trim() || '';
            const wpp = document.getElementById('whatsapp')?.value?.trim() || '';
            const inst = document.getElementById('instagram')?.value?.trim() || '';
            const seg = document.getElementById('segmento')?.value?.trim() || '';
            const gar = document.getElementById('gargalo')?.value?.trim() || '';
            const des = document.getElementById('desafio')?.value?.trim() || '';
            
            if (!nome || !wpp) {
                alert("Nome e WhatsApp são obrigatórios.");
                if (btnSubmit) {
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.disabled = false;
                }
                return;
            }

            const payload = {
                lead_id: "",
                cliente_id: "",
                cliente_nome: "",
                origem_site: "site_fluxai",
                nome_lead: nome,
                email: "", 
                telefone: wpp,
                empresa: inst,
                servico_interesse: "Diagnóstico FluxAI",
                canal_origem: "formulario_site",
                campanha: safeUtmParam('utm_campaign', ''),
                pagina_origem: "landing_diagnostico",
                status_lead: "novo",
                responsavel: "",
                observacao: `[SEG] ${seg} | [GAR] ${gar} | [DES] ${des}`
            };

            try {
                console.info('[MakeIntegration] RouteId Usado: ROTA_OS_02_LEADS_SITE');
                console.info('[MakeIntegration] Payload Final Montado:', payload);
                
                const result = await useMakeRoute.executeRoute('ROTA_OS_02_LEADS_SITE', payload, { role: 'CLIENT' });
                
                console.info('[MakeIntegration] Status final:', result.success);

                if (!result.success) {
                    throw new Error(result.error || 'Erro no webhook');
                }

                if(typeof fbq === 'function') fbq('track', 'Lead');
                if(typeof trackEvent === 'function') trackEvent('lead_submit', { form_id: 'diagnosticoForm' });
                
                if (btnSubmit) {
                    btnSubmit.innerHTML = 'Aguarde nosso contato. Sua aplicação foi recebida. <i class="fa-solid fa-check"></i>';
                    btnSubmit.style.background = '#10b981';
                    btnSubmit.style.color = '#fff';
                }
                
                setTimeout(() => {
                    if (btnSubmit) {
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.style.background = '';
                        btnSubmit.style.color = '';
                        btnSubmit.disabled = false;
                    }
                    diagnosticoForm.reset();
                }, 4000);

            } catch(error) {
                console.error("Erro ao enviar form", error);
                if (btnSubmit) {
                    btnSubmit.innerHTML = 'Não foi possível enviar sua aplicação agora. Revise os dados e tente novamente.';
                    btnSubmit.style.background = '#ef4444';
                }
                setTimeout(() => {
                    if (btnSubmit) {
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.style.background = '';
                        btnSubmit.disabled = false;
                    }
                }, 4000);
            }
        });
    }
});
