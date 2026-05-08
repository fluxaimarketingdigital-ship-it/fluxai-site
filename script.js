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
        positioning: { title: "FluxAI Positioning™", desc: "Arquitetura de autoridade e diferenciação de elite.", features: ["Narrativa Soberana", "Identidade Visual Premium", "Análise de Concorrência"] },
        content: { title: "FluxAI Content Engine™", desc: "Engenharia de conteúdo focada em ativos de retenção.", features: ["Conteúdo de Alta Densidade", "Scripts Estratégicos", "Gestão de Ativos Digitais"] },
        growth: { title: "FluxAI Growth System™", desc: "Infraestrutura de aquisição e escala de receita.", features: ["Tráfego Pago Especializado", "Funis de Alta Conversão", "Inteligência de Dados"] },
        intelligence: { title: "FluxAI Intelligence Core™", desc: "Núcleo tecnológico de automação e IA aplicada.", features: ["Agentes Comerciais de IA", "Arquitetura de CRM", "Eficiência Operacional"] }
    };

    document.querySelectorAll('.service-card, .os-item').forEach(card => {
        card.addEventListener('click', () => {
            const s = card.getAttribute('data-service') || card.querySelector('strong')?.innerText.toLowerCase();
            // Fallback for names
            let d = servicesData[s];
            if(!d) {
                if(s?.includes('positioning')) d = servicesData.positioning;
                if(s?.includes('content')) d = servicesData.content;
                if(s?.includes('acquisition') || s?.includes('growth')) d = servicesData.growth;
                if(s?.includes('intelligence') || s?.includes('ia')) d = servicesData.intelligence;
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

    // 8. DIAGNOSTICO FORM (WHATSAPP REDIRECT)
    const diagnosticoForm = document.getElementById('diagnosticoForm');
    if (diagnosticoForm) {
        diagnosticoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const wpp = document.getElementById('whatsapp').value;
            const inst = document.getElementById('instagram').value;
            const des = document.getElementById('desafio').value;
            
            const msg = `Olá! Tenho interesse no Diagnóstico Estratégico.%0A%0A*Nome:* ${nome}%0A*WhatsApp:* ${wpp}%0A*Instagram:* ${inst}%0A*Meu Desafio:* ${des}`;
            window.open(`https://wa.me/5571981114694?text=${msg}`, '_blank');
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

});

// 10. CLEAN UP ELFSIGHT BRANDING (Optimized with MutationObserver)
const cleanElfsight = () => {
    document.querySelectorAll('a[href*="elfsight.com"], .eapps-link').forEach(el => el.remove());
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => cleanElfsight());
});

observer.observe(document.body, { childList: true, subtree: true });
cleanElfsight();
