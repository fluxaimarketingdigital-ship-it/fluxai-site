document.addEventListener('DOMContentLoaded', () => {

  // --- LUXURY CUSTOM CURSOR ---
  const cursor = document.createElement('div');
  const cursorOutline = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursorOutline.className = 'custom-cursor-outline';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorOutline);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth outline follow
  const animateCursor = () => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Cursor Hover Effects
  const interactables = document.querySelectorAll('a, button, .service-card, .btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // --- PARALLAX EFFECT ---
  const parallaxElements = document.querySelectorAll('.parallax-element');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 50;
    const y = (e.clientY - window.innerHeight / 2) / 50;
    
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 1;
      el.style.transform = `translateX(${-x * speed}px) translateY(${-y * speed}px)`;
    });
  });

  // --- PREMIUM DARK MODE TOGGLE ---
  const initDarkMode = () => {
    // Default: dark mode (Premium). Saved choice overrides.
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true; // dark by default

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (!saved) localStorage.setItem('theme', 'dark'); // persist default

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      });

      // Initial icon state
      const icon = themeToggle.querySelector('i');
      icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  };
  initDarkMode();


  // Menu Fixo / Efeito de Sombra
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle do Menu Mobile
  const menuToggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  const icon = menuToggle.querySelector('i');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      
      if (menu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Fecha o menu depois de clicar em qualquer link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      });
    });
  }

  // Scroll Suave Melhorado (Corrige espaço do header preso)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === "#" || targetId === "#topo") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Efeito Reveal Ao Rolar (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealOptions = {
      threshold: 0.15,
      // O evento dispara 50px antes do elemento aparecer na parte inferior da tela
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('active');
        // Para parar de observar depois que já revelou:
        observer.unobserve(entry.target);
      });
    }, revealOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
    
    // Dispara tbm uma vez no carregamento, para garantir que algo no topo apareça imediatamente.
    setTimeout(() => {
      revealElements.forEach(el => {
         const top = el.getBoundingClientRect().top;
         // Se o topo estiver sendo mostrado na tela logo no carregamento
         if(top < window.innerHeight) {
           el.classList.add('active');
         }
      });
    }, 100);
  }

  // Formulário: Envio de Dados via WhatsApp
  const diagnosticoForm = document.getElementById('diagnosticoForm');
  if (diagnosticoForm) {
    diagnosticoForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita o recarregamento na mesma aba

      const nome = document.getElementById('nome').value;
      const whatsapp = document.getElementById('whatsapp').value;
      const instagram = document.getElementById('instagram').value;
      const desafio = document.getElementById('desafio').value;

      const numeroDestino = '5571981114694'; // Número da FluxAI
      const mensagem = `🔥 *Nova Aplicação - Consultoria FluxAI*\n\n` +
                       `*Nome/Empresa:* ${nome}\n` +
                       `*WhatsApp:* ${whatsapp}\n` +
                       `*Instagram:* ${instagram}\n` +
                       `*Resumo do Desafio:* ${desafio}\n\n` +
                       `_Enviado através da Landing Page._`;

      const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
      
      // Rastreamento GA4 - Lead via Formulário
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          'method': 'form_diagnostico',
          'event_category': 'conversion',
          'event_label': 'Diagnostic Request'
        });
      }

      window.open(url, '_blank');
      diagnosticoForm.reset();
    });
  }

  // Lógica do Modal de Serviços
  const modal = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');

  const servicesData = {
    branding: {
      title: "Identidade Visual & Branding",
      desc: "Sua marca não é apenas um logo; é a percepção de valor que você gera no mercado.",
      features: [
        "Criação de Logo e Variações",
        "Paleta de Cores e Tipografia",
        "Manual da Marca (Brandbook)",
        "Design para Papelaria e Social Media",
        "Estratégia de Posicionamento Premium"
      ]
    },
    social: {
      title: "Social Media & Gestão",
      desc: "Transformamos seguidores em clientes através de conteúdo que conecta e gera desejo.",
      features: [
        "Planejamento Mensal de Conteúdo",
        "Copywriting Persuasivo (Legendas)",
        "Design de Posts e Stories de Alto Nível",
        "Análise de Métricas e Engajamento",
        "Gestão Ativa de Comunidade"
      ]
    },
    sites: {
      title: "Sites & Landing Pages",
      desc: "Desenvolvemos sua sede digital com foco total em velocidade, SEO e captura de leads qualificados.",
      features: [
        "Landing Pages de Alta Conversão (Captura de Leads)",
        "Sites Institucionais com Foco em SEO",
        "Entrega Orgânica & Performance no Google",
        "Otimização para Dispositivos Móveis",
        "Integração com CRM e Funis de Vendas"
      ]
    },
    ads: {
      title: "Tráfego Pago & Performance",
      desc: "Colocamos sua marca na frente de quem realmente quer comprar, com precisão técnica absoluta.",
      features: [
        "Gestão de Campanhas (Meta/Google/TikTok)",
        "Instalação de Pixel Meta & API de Conversão",
        "Remarketing Estratégico para Recuperação",
        "Segmentação Avançada de Público Alvo",
        "Relatórios de ROI e Otimização Constante"
      ]
    },
    ia: {
      title: "Capacitação de Imagens (IA)",
      desc: "O futuro do design está aqui. Treinamos processos para escala infinita.",
      features: [
        "Criação de Imagens Realistas via IA",
        "Prompt Engineering para Negócios",
        "Fluxos de Trabalho Automatizados",
        "Consistência Visual com IA",
        "Capacitação para Equipes Criativas"
      ]
    },
    strategy: {
      title: "Estratégia & Dados",
      desc: "Mudamos a história do seu negócio através de dados reais e decisões inteligentes.",
      features: [
        "Configuração de Google Analytics 4 (GA4)",
        "Criação de Dashboards de Performance",
        "Análise de Funil e Taxa de Conversão (CRO)",
        "Estratégia de LTV e Retenção de Clientes",
        "Posicionamento Competitivo e Plano de Expansão"
      ]
    }
  };

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      const data = servicesData[serviceKey];
      
      if (data) {
        modalBody.innerHTML = `
          <h2>${data.title}</h2>
          <p>${data.desc}</p>
          <ul class="modal-features">
            ${data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('')}
          </ul>
          <div class="modal-cta-wrap">
            <a href="#diagnostico" class="btn btn-primary btn-block" id="modalCta">
              Solicitar Diagnóstico para este Serviço
            </a>
          </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo

        // Link do CTA interno do modal
        document.getElementById('modalCta').addEventListener('click', () => {
          closeModalFunc();
        });
      }
    });
  });

  function closeModalFunc() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Destrava o scroll
  }

  if (closeModal) {
    closeModal.addEventListener('click', closeModalFunc);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModalFunc);
  }

  // Rastreamento de Cliques (WhatsApp e Instagram)
  document.querySelectorAll('a[href*="wa.me"], a[href*="instagram.com"]').forEach(link => {
    link.addEventListener('click', function() {
      const type = this.href.includes('wa.me') ? 'whatsapp' : 'instagram';
      if (typeof gtag === 'function') {
        gtag('event', 'click_contact', {
          'contact_type': type,
          'location': 'footer_or_nav'
        });
        // Se for WhatsApp, também podemos contar como um lead em potencial
        if (type === 'whatsapp') {
          gtag('event', 'generate_lead', { 'method': 'direct_whatsapp' });
        }
      }
    });
  });

  // Rastreamento do Botão Flutuante (WhatsApp)
  const fabWhatsApp = document.querySelector('.fab-whatsapp');
  if (fabWhatsApp) {
    fabWhatsApp.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { 'method': 'floating_whatsapp' });
      }
    });
  }

  /* ---------------------------------------------------------
   AI ASSISTANT (FLUX)
--------------------------------------------------------- */
const initAIAssistant = () => {
  const aiBtn = document.getElementById('aiBtn');
  const aiWindow = document.getElementById('aiWindow');
  const aiClose = document.getElementById('aiClose');
  const aiInput = document.getElementById('aiInput');
  const aiBody = document.getElementById('aiBody');

  if (!aiBtn) return;

  aiBtn.addEventListener('click', () => {
    aiWindow.classList.toggle('active');
    if (aiWindow.classList.contains('active')) {
      // Simulate welcome message
      if (aiBody.children.length === 0) {
        setTimeout(() => addAIMessage("Olá! Sou o Flux. Como posso ajudar a elevar o posicionamento da sua marca hoje? 💎"), 500);
      }
    }
  });

  aiClose.addEventListener('click', () => aiWindow.classList.remove('active'));

  aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && aiInput.value.trim() !== '') {
      const userMsg = aiInput.value;
      addMessage(userMsg, 'user');
      aiInput.value = '';
      
      // AI Response simulation
      setTimeout(() => {
        addAIMessage("Entendi. Nossos especialistas em tecnologia e design High-Ticket podem transformar essa visão em realidade. Gostaria de agendar um diagnóstico gratuito?");
      }, 1000);
    }
  });

  const addMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.style.marginBottom = '12px';
    msg.style.textAlign = sender === 'user' ? 'right' : 'left';
    msg.innerHTML = `<span style="display:inline-block; padding:8px 12px; border-radius:12px; background:${sender === 'user' ? 'var(--primary)' : 'var(--bg-slate-dark)'}; color:${sender === 'user' ? '#fff' : 'inherit'}">${text}</span>`;
    aiBody.appendChild(msg);
    aiBody.scrollTop = aiBody.scrollHeight;
  };

  const addAIMessage = (text) => addMessage(text, 'ai');
};

/* ---------------------------------------------------------
   WELCOME POP-UP LOGIC
--------------------------------------------------------- */
const initWelcomePopup = () => {
  const popup = document.getElementById('welcomePopup');
  const overlay = document.getElementById('welcomeOverlay');
  const close = document.getElementById('closeWelcome');
  
  if (!popup) return;

  // Show after 2.5 seconds
  setTimeout(() => {
    popup.classList.add('active');
    if (overlay) overlay.classList.add('active');
  }, 2500);

  const closeAll = () => {
    popup.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  if (close) close.addEventListener('click', closeAll);
  if (overlay) overlay.addEventListener('click', closeAll);
};

// INICIALIZAR AO CARREGAR
  // Smooth Entrance (Fade-in ao carregar)
  // Initial Execution
  document.body.classList.add('loaded');
  initAIAssistant();
  initWelcomePopup();

});
