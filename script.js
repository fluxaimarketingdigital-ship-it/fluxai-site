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

    // 3. PARALLAX EFFECT
    const parallaxElements = document.querySelectorAll('.parallax-element');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 1;
            el.style.transform = `translateX(${-x * speed}px) translateY(${-y * speed}px)`;
        });
    });

    // SCROLL REVEAL ANIMATION
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

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
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    // 7. SERVICE MODAL
    const modal = document.getElementById('serviceModal');
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const modalBody = document.getElementById('modalBody');
    const closeServiceModal = document.getElementById('closeServiceModal');

    const servicesData = {
        branding: { title: "Identidade Visual & Branding", desc: "Design sofisticado e posicionamento premium.", features: ["Logo & Variações", "Paleta de Cores", "Brandbook"] },
        social: { title: "Social Media & Gestão", desc: "Conteúdo que gera desejo e autoridade.", features: ["Planejamento", "Design High-Ticket", "Análise de Dados"] },
        sites: { title: "Sites & SEO", desc: "Desenvolvimento de estruturas de alta conversão.", features: ["Sites & Landing Pages", "Otimização SEO", "Hospedagem Dedicada"] },
        ads: { title: "Tráfego & Performance", desc: "Anúncios que colocam seu negócio no topo.", features: ["Google Ads", "Meta Ads", "Remarketing"] },
        ia: { title: "Automação & Agentes de IA", desc: "Escala real no seu atendimento e conversão.", features: ["Chatbots Inteligentes", "Assistentes Virtuais", "Integração CRM"] },
        strategy: { title: "Estratégia & Dados", desc: "Crescimento embasado em métricas precisas.", features: ["Diagnóstico Online", "Análise de Concorrência", "Relatórios de Performance"] }
    };

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const s = card.getAttribute('data-service');
            const d = servicesData[s];
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

    // 8. UNIFIED FLUX BOT (RESTAURAÇÃO V10)
    const initFluxBot = () => {
        const trigger = document.getElementById('fluxBotTrigger');
        const win = document.getElementById('fluxChatWindow');
        const close = document.getElementById('closeFluxChat');
        const send = document.getElementById('sendFluxBot');
        const input = document.getElementById('fluxInput');
        const msgs = document.getElementById('fluxMessages');
        const tooltip = document.getElementById('fluxTooltip');

        if (!trigger || !win) return;

        const appendMsg = (text, sender) => {
            const d = document.createElement('div');
            d.style.marginBottom = '15px';
            d.style.textAlign = sender === 'user' ? 'right' : 'left';
            d.innerHTML = `<span style="display:inline-block; padding:12px 18px; border-radius:18px; max-width:85%; background:${sender === 'user' ? '#FF6B00' : '#f1f1f1'}; color:${sender === 'user' ? '#fff' : '#1a1a1a'}; font-size:0.95rem;">${text}</span>`;
            msgs.appendChild(d);
            msgs.scrollTop = msgs.scrollHeight;
        };

        trigger.addEventListener('click', () => {
            win.classList.add('active');
            if (tooltip) tooltip.classList.remove('active');
            if (msgs.children.length === 0) {
                setTimeout(() => appendMsg('Olá! Sou o <b>Flux</b>, seu assistente da FluxAI. 🚀<br>No que posso te ajudar hoje?', 'ai'), 600);
            }
        });

        if (close) close.addEventListener('click', () => win.classList.remove('active'));

        const handleSend = () => {
            const val = input.value.trim();
            if (!val) return;
            appendMsg(val, 'user');
            input.value = '';
            setTimeout(() => appendMsg('Entendi! Vou analisar sua dúvida e te conectar a um especialista.', 'ai'), 1000);
        };

        if (send) send.addEventListener('click', handleSend);
        if (input) input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSend(); });

        setTimeout(() => { if(tooltip) tooltip.classList.add('active'); }, 2000);
    };
    initFluxBot();

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

});

// 10. CLEAN UP ELFSIGHT BRANDING
setInterval(() => {
    document.querySelectorAll('a[href*="elfsight.com"], .eapps-link').forEach(el => el.remove());
}, 1000);
