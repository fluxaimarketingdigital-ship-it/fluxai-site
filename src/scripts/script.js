import { INTEGRATIONS } from '../config/integrations.js';
import { CONTACT_INFO } from '../config/constants.js';

// Utilitário inline de sanitização para o site público (sem ESM externo)
const UTM_PATTERN = /^[a-zA-Z0-9_\-\s]{0,100}$/;
function safeUtmParam(key, fallback = '') {
    const raw = new URLSearchParams(window.location.search).get(key);
    if (!raw) return fallback;
    const clean = String(raw).slice(0, 100);
    // Rejeitar protocolos perigosos
    if (/^(javascript|data|vbscript):/i.test(clean.trim())) return fallback;
    return UTM_PATTERN.test(clean) ? clean : fallback;
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. BODY LOADED FADE-IN
    document.body.classList.add('loaded');

    // 2. LUXURY CUSTOM CURSOR
    const cursor = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    const animateCursor = () => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactables = document.querySelectorAll('a, button, .service-card, .btn');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // 3. PARALLAX EFFECT (Optimized with requestAnimationFrame)
    const parallaxElements = document.querySelectorAll('.parallax-element');
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) / 50;
        targetY = (e.clientY - window.innerHeight / 2) / 50;
    });

    const animateParallax = () => {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 1;
            el.style.transform = `translateX(${-currentX * speed}px) translateY(${-currentY * speed}px)`;
        });
        requestAnimationFrame(animateParallax);
    };
    animateParallax();

    // SCROLL REVEAL ANIMATION
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. DARK MODE
    const initDarkMode = () => {
        const saved = localStorage.getItem('theme');
        const isDark = saved === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                const icon = themeToggle.querySelector('i');
                if (icon) icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            });
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    };
    initDarkMode();

    // 5. SCROLL EFFECTS (Header)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // 6. MOBILE MENU
    const menuToggle = document.getElementById('mobile-toggle') || document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu on link click (Mobile UX)
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // 7. SERVICE MODAL
    const modal = document.getElementById('serviceModal');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modalBody = document.getElementById('modalBody');
    const closeServiceModal = document.getElementById('closeServiceModal');

    const servicesData = {
        command: { title: "FluxAI Command Center™", desc: "Arquitetura de autoridade e diferenciação de elite.", features: ["Narrativa Soberana", "Identidade Visual Premium", "Análise de Concorrência"] },
        content: { title: "FluxAI Content Engine™", desc: "Engenharia de conteúdo focada em ativos de retenção.", features: ["Conteúdo de Alta Densidade", "Scripts Estratégicos", "Gestão de Ativos Digitais"] },
        crm: { title: "FluxAI CRM Intelligence™", desc: "Infraestrutura de aquisição e escala de receita.", features: ["Tráfego Pago Especializado", "Funis de Alta Conversão", "Inteligência de Dados"] },
        automation: { title: "FluxAI Automation Hub™", desc: "Núcleo tecnológico de automação e IA aplicada.", features: ["Agentes Comerciais de IA", "Arquitetura de CRM", "Eficiência Operacional"] },
        analytics: { title: "FluxAI Analytics Intelligence™", desc: "A leitura estratégica dos dados para transformar métricas soltas em decisões de crescimento.", features: ["Modelagem LTV", "Atribuição Fina", "Dashboards Consolidados"] },
        governanca: { title: "FluxAI Governança Operacional™", desc: "A camada que protege consistência, escopo, aprovação, entregas e qualidade da operação.", features: ["Controle de Escopo", "Fluxos de Aprovação", "Proteção de Ativos"] }
    };

    document.querySelectorAll('.service-card, .os-item, .nav-item').forEach(card => {
        card.addEventListener('click', (e) => {
            // Se for link do dashboard, o dashboard.js já cuida
            if (card.classList.contains('nav-item')) return;

            const s = card.getAttribute('data-service') || card.getAttribute('data-module') || card.querySelector('strong')?.innerText.toLowerCase() || '';
            let d = servicesData[s];
            
            if(!d) {
                const searchStr = s.toLowerCase();
                if(searchStr.includes('command') || searchStr.includes('center')) d = servicesData.command;
                else if(searchStr.includes('content')) d = servicesData.content;
                else if(searchStr.includes('crm') || searchStr.includes('intelligence')) d = servicesData.crm;
                else if(searchStr.includes('automation') || searchStr.includes('hub')) d = servicesData.automation;
                else if(searchStr.includes('analytics')) d = servicesData.analytics;
                else if(searchStr.includes('govos') || searchStr.includes('governança') || searchStr.includes('governanca') || searchStr.includes('governance')) d = servicesData.governanca;
            }

            if (d && modal && modalBody) {
                modalBody.innerHTML = `<h3>${d.title}</h3><p style="margin-bottom:15px; color:#ccc;">${d.desc}</p><ul style="list-style:none; padding:0; margin:0;">${d.features.map(f => `<li style="margin-bottom:8px;"><i class="fa-solid fa-check" style="color:#FF6B00; margin-right:8px;"></i>${f}</li>`).join('')}</ul>`;
                modal.classList.add('active');
                if (modalOverlay) modalOverlay.classList.add('active');
            }
        });
    });

    const hideServiceModal = () => {
        if (modal) modal.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
    };
    if (closeServiceModal) closeServiceModal.addEventListener('click', hideServiceModal);
    if (modalOverlay) modalOverlay.addEventListener('click', hideServiceModal);

    // 13. TRACK SOCIAL PROOF CLICKS (GA4)
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.getAttribute('data-platform');
            trackEvent('click_social_proof', { button_text: 'Social Proof', platform: platform });
        });
    });

    // 8. DIAGNOSTICO FORM (WEBHOOK + WHATSAPP REDIRECT)
    const diagnosticoForm = document.getElementById('diagnosticoForm');
    if (diagnosticoForm) {

        let form_start_triggered = false;
        diagnosticoForm.addEventListener('focusin', () => {
            if(!form_start_triggered) {
                form_start_triggered = true;
                trackEvent('form_start', { form_id: 'diagnosticoForm' });
            }
        });
    
        diagnosticoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = diagnosticoForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
            btnSubmit.disabled = true;

            const nome = document.getElementById('nome').value;
            const wpp = document.getElementById('whatsapp').value;
            const inst = document.getElementById('instagram').value;
            const seg = document.getElementById('segmento').value;
            const gar = document.getElementById('gargalo').value;
            const des = document.getElementById('desafio').value;
            
            // Tracking Events (FB & GA4)
            // gtag generate_lead will be called only on success.

            const WEBHOOK_URL = INTEGRATIONS.webhookUrl; 

            // Captura de Inteligência de Tráfego (UTMs)
            const urlParams = new URLSearchParams(window.location.search);
            const utmSource = safeUtmParam('utm_source', 'Direto');
            const utmMedium = safeUtmParam('utm_medium', 'Orgânico');
            const utmCampaign = safeUtmParam('utm_campaign', 'N/A');

            const payload = {
                data: new Date().toISOString(),
                nome: nome,
                whatsapp: wpp,
                instagram: inst,
                segmento: seg,
                gargalo: gar,
                desafio: des,
                origem: utmSource,
                meio: utmMedium,
                campanha: utmCampaign,
                referencia: document.referrer || 'Direto'
            };

            if(WEBHOOK_URL) {
                try {
                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                } catch(error) {
                    console.error("Erro ao enviar para webhook, redirecionando para WhatsApp...", error);
                }
            }

            // WhatsApp Redirect
            const msg = `Olá! Tenho interesse no Diagnóstico Estratégico.%0A%0A*Nome:* ${nome}%0A*WhatsApp:* ${wpp}%0A*Instagram:* ${inst}%0A*Segmento:* ${seg}%0A*Gargalo:* ${gar}%0A*Cenário Atual:* ${des}`;
            window.open(`${CONTACT_INFO.whatsappLink}?text=${msg}`, '_blank');
            
            btnSubmit.innerHTML = 'Enviado com Sucesso <i class="fa-solid fa-check"></i>';
            setTimeout(() => {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                diagnosticoForm.reset();
            }, 3000);
        });
    }

    // 9. WELCOME POPUP
    const initWelcomePopup = () => {
        const p = document.getElementById('welcomePopup');
        const o = document.getElementById('welcomeOverlay');
        const c = document.getElementById('closeWelcome');
        if (!p) return;
        setTimeout(() => { p.classList.add('active'); if(o) o.classList.add('active'); }, 2500);
        const closeAll = () => { p.classList.remove('active'); if(o) o.classList.remove('active'); };
        if (c) c.addEventListener('click', closeAll);
        if (o) o.addEventListener('click', closeAll);
    };
    initWelcomePopup();

    // 10. TRACK WHATSAPP CLICKS (GA4)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('whatsapp_click', { destination: 'whatsapp' });
        });
    });


});

// 11. CLEAN UP ELFSIGHT BRANDING
const cleanElfsight = () => {
    document.querySelectorAll('a[href*="elfsight.com"], .eapps-link').forEach(el => el.remove());
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => cleanElfsight());
});

observer.observe(document.body, { childList: true, subtree: true });
cleanElfsight();

// 12. ANTI-COPY & SOURCE PROTECTION
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
    if (e.key === "F12" || 
       (e.ctrlKey && e.shiftKey && e.key === "I") || 
       (e.ctrlKey && e.key === "u") || 
       (e.ctrlKey && e.shiftKey && e.key === "J") || 
       (e.ctrlKey && e.shiftKey && e.key === "C")) {
        e.preventDefault();
    }
});
