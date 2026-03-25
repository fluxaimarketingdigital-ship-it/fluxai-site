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
    // Default: light mode. Saved preference overrides.
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark'; // light by default for new visitors

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      });

      // Initial icon
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

  // Scroll Suave Melhorado (Corrige espa\u00E3§o do header preso)
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
        // Para parar de observar depois que j\u00E3¡ revelou:
        observer.unobserve(entry.target);
      });
    }, revealOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
    
    // Dispara tbm uma vez no carregamento, para garantir que algo no topo apare\u00E3§a imediatamente.
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

  // Formul\u00E3¡rio: Envio de Dados via WhatsApp
  const diagnosticoForm = document.getElementById('diagnosticoForm');
  if (diagnosticoForm) {
    diagnosticoForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita o recarregamento na mesma aba

      const nome = document.getElementById('nome').value;
      const whatsapp = document.getElementById('whatsapp').value;
      const instagram = document.getElementById('instagram').value;
      const desafio = document.getElementById('desafio').value;

      const numeroDestino = '5571981114694'; // N\u00E3ºmero da FluxAI
      const mensagem = `ðŸ”¥ *Nova Aplica\u00E3§\u00E3£o - Consultoria FluxAI*\n\n` +
                       `*Nome/Empresa:* ${nome}\n` +
                       `*WhatsApp:* ${whatsapp}\n` +
                       `*Instagram:* ${instagram}\n` +
                       `*Resumo do Desafio:* ${desafio}\n\n` +
                       `_Enviado atrav\u00E9s da Landing Page._`;

      const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;
      
      // Rastreamento GA4 - Lead via Formul\u00E3¡rio
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

  // L\u00F3gica do Modal de servi\u00E7os
  const modal = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');

  const servicesData = {
    branding: {
      title: "Identidade Visual & Branding",
      desc: "Sua marca n\u00E3£o \u00E9 apenas um logo; \u00E9 a percep\u00E3§\u00E3£o de valor que voc\u00EA gera no mercado.",
      features: [
        "Cria\u00E3§\u00E3£o de Logo e Varia\u00E3§\u00E3µes",
        "Paleta de Cores e Tipografia",
        "Manual da Marca (Brandbook)",
        "Design para Papelaria e Social Media",
        "Estrat\u00E9gia de Posicionamento Premium"
      ]
    },
    social: {
      title: "Social Media & Gest\u00E3£o",
      desc: "Transformamos seguidores em clientes atrav\u00E9s de conte\u00E3ºdo que conecta e gera desejo.",
      features: [
        "Planejamento Mensal de Conte\u00E3ºdo",
        "Copywriting Persuasivo (Legendas)",
        "Design de Posts e Stories de Alto N\u00E3­vel",
        "An\u00E3¡lise de M\u00E9tricas e Engajamento",
        "Gest\u00E3£o Ativa de Comunidade"
      ]
    },
    sites: {
      title: "Sites & Landing Pages",
      desc: "Desenvolvemos sua sede digital com foco total em velocidade, SEO e captura de leads qualificados.",
      features: [
        "Landing Pages de Alta Convers\u00E3£o (Captura de Leads)",
        "Sites Institucionais com Foco em SEO",
        "Entrega Org\u00E3¢nica & Performance no Google",
        "Otimiza\u00E3§\u00E3£o para Dispositivos M\u00F3veis",
        "Integra\u00E3§\u00E3£o com CRM e Funis de Vendas"
      ]
    },
    ads: {
      title: "Tr\u00E3¡fego Pago & Performance",
      desc: "Colocamos sua marca na frente de quem realmente quer comprar, com precis\u00E3£o t\u00E9cnica absoluta.",
      features: [
        "Gest\u00E3£o de Campanhas (Meta/Google/TikTok)",
        "Instala\u00E3§\u00E3£o de Pixel Meta & API de Convers\u00E3£o",
        "Remarketing Estrat\u00E9gico para Recupera\u00E3§\u00E3£o",
        "Segmenta\u00E3§\u00E3£o Avan\u00E3§ada de P\u00E3ºblico Alvo",
        "Relat\u00F3rios de ROI e Otimiza\u00E3§\u00E3£o Constante"
      ]
    },
    ia: {
      title: "Capacita\u00E3§\u00E3£o de Imagens (IA)",
      desc: "O futuro do design est\u00E3¡ aqui. Treinamos processos para escala infinita.",
      features: [
        "Cria\u00E3§\u00E3£o de Imagens Realistas via IA",
        "Prompt Engineering para Neg\u00F3cios",
        "Fluxos de Trabalho Automatizados",
        "Consist\u00EAncia Visual com IA",
        "Capacita\u00E3§\u00E3£o para Equipes Criativas"
      ]
    },
    strategy: {
      title: "Estrat\u00E9gia & Dados",
      desc: "Mudamos a hist\u00F3ria do seu neg\u00F3cio atrav\u00E9s de dados reais e decis\u00E3µes inteligentes.",
      features: [
        "Configura\u00E3§\u00E3£o de Google Analytics 4 (GA4)",
        "Cria\u00E3§\u00E3£o de Dashboards de Performance",
        "An\u00E3¡lise de Funil e Taxa de Convers\u00E3£o (CRO)",
        "Estrat\u00E9gia de LTV e Reten\u00E3§\u00E3£o de Clientes",
        "Posicionamento Competitivo e Plano de Expans\u00E3£o"
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
              Solicitar Diagn\u00F3stico para este Servi\u00E3§o
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
        if (type === 'whatsapp') {
          gtag('event', 'generate_lead', { 'method': 'direct_whatsapp' });
        }
      }
      // Meta Pixel: Lead em todos os cliques de WhatsApp
      if (type === 'whatsapp' && typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
    });
  });

  // Rastreamento do Bot\u00E3£o Flutuante (WhatsApp)
  const fabWhatsApp = document.querySelector('.fab-whatsapp');
  if (fabWhatsApp) {
    fabWhatsApp.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { 'method': 'floating_whatsapp' });
      }
      // Meta Pixel: Lead no bot\u00E3£o flutuante
      if (typeof fbq === 'function') fbq('track', 'Lead');
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

  // --- FAQ ENGINE ---
  const faq = [
    {
      keywords: ['oi', 'ol\u00E3¡', 'ola', 'hey', 'boa tarde', 'bom dia', 'boa noite', 'tudo bem', 'tudo'],
      answer: 'Ol\u00E1! Fico feliz em te ver por aqui ðŸ˜Š Sou o Flux, assistente da FluxAI. Posso te ajudar com informa\u00E3§\u00E3µes sobre nossos servi\u00E7os de Marketing Digital, Branding, Social Media, Sites, Tr\u00E3¡fego Pago e IA. Como posso te ajudar? ðŸ’Ž'
    },
    {
      keywords: ['branding', 'identidade', 'logo', 'marca', 'visual', 'logotipo', 'brandbook'],
      answer: 'Nossa identidade visual \u00E9 feita para posicionar sua marca como refer\u00EAncia! ðŸŽ¨ Criamos Logo, Paleta de Cores, Tipografia, Manual da Marca (Brandbook) e Design para redes sociais. Tudo com padr\u00E3£o High-Ticket. Quer agendar um diagn\u00F3stico gratuito?'
    },
    {
      keywords: ['social', 'redes', 'instagram', 'facebook', 'tiktok', 'conte\u00E3ºdo', 'gest\u00E3£o', 'post', 'stories'],
      answer: 'Gerenciamos suas redes sociais do zero ao resultado! ðŸ“² Fazemos planejamento de conte\u00E3ºdo, Copywriting, Design de Posts e Stories e an\u00E3¡lise de m\u00E9tricas. Transformamos seguidores em clientes reais. Posso te conectar com nossa equipe!'
    },
    {
      keywords: ['site', 'landing', 'p\u00E3¡gina', 'web', 'seo', 'google', 'indexar', 'aparecer'],
      answer: 'Desenvolvemos Landing Pages e Sites Institucionais focados em SEO e captura de leads! ðŸ’» Otimizados para Google, mobile e super r\u00E3¡pidos. Seu site j\u00E3¡ est\u00E3¡ no ar? Precisa de upgrades ou um novo projeto?'
    },
    {
      keywords: ['tr\u00E3¡fego', 'ads', 'an\u00E3ºncios', 'meta', 'campanha', 'facebook ads', 'google ads', 'vendas', 'leads', 'remarketing'],
      answer: 'Gerenciamos campanhas de Tr\u00E3¡fego Pago no Meta (Facebook/Instagram) e Google Ads! ðŸŽ¯ Instalamos Pixel, criamos estrat\u00E9gias de Remarketing e entregamos relat\u00F3rios de ROI mensais. Quer saber como atrair mais clientes agora?'
    },
    {
      keywords: ['ia', 'intelig\u00EAncia artificial', 'imagem', 'capacita\u00E3§\u00E3£o', 'prompt', 'gpt', 'ai', 'automa\u00E3§\u00E3£o'],
      answer: 'Trabalhamos com IA aplicada ao marketing! ðŸ¤– Treinamos equipes em Prompt Engineering, criamos imagens realistas via IA e desenvolvemos fluxos de trabalho automatizados para escalar sua produ\u00E3§\u00E3£o de conte\u00E3ºdo. Interessante n\u00E9?'
    },
    {
      keywords: ['estrat\u00E9gia', 'dados', 'analytics', 'ga4', 'dashboard', 'roi', 'resultado', 'm\u00E9tricas'],
      answer: 'Nossa \u00E3¡rea de Estrat\u00E9gia & Dados configura seu Google Analytics 4, cria Dashboards de Performance e faz an\u00E3¡lise de CRO (taxa de convers\u00E3£o). Decis\u00E3µes inteligentes = crescimento acelerado! ðŸ“Š Quer saber mais?'
    },
    {
      keywords: ['pre\u00E3§o', 'valor', 'quanto', 'custo', 'investimento', 'pacote', 'plano', 'or\u00E3§amento'],
      answer: 'Cada projeto \u00E9 \u00E3ºnico e personalizado! ðŸ’° Os valores dependem do escopo, mas trabalhamos com pacotes sob medida para cada fase do seu neg\u00F3cio. O primeiro passo \u00E9 um Diagn\u00F3stico Gratuito â€” assim mapeamos exatamente o que voc\u00EA precisa. Posso te conectar com nossa equipe?'
    },
    {
      keywords: ['contato', 'falar', 'conversar', 'whatsapp', 'chamar', 'atendimento', 'equipe', 'especialista'],
      answer: 'Claro! Voc\u00EA pode falar diretamente com nossa equipe agora mesmo pelo WhatsApp ðŸ‘‡\n\nðŸ“² <a href="https://wa.me/5571981114694" target="_blank" style="color:var(--primary); font-weight:700;">Clique aqui para abrir o WhatsApp</a>'
    },
    {
      keywords: ['diagn\u00F3stico', 'diagnostico', 'gratuito', 'consultoria', 'an\u00E3¡lise', 'teste'],
      answer: 'O Diagn\u00F3stico de Alto Valor da FluxAI \u00E9 GRATUITO! ðŸ”¥ Nossa equipe analisa sua presen\u00E3§a digital e entrega um plano estrat\u00E9gico personalizado. Para solicitar, \u00E9 s\u00F3 preencher o formul\u00E3¡rio l\u00E3¡ embaixo na p\u00E3¡gina ou chamar no WhatsApp. Vamos juntos?'
    },
    {
      keywords: ['obrigad', 'valeu', 'grato', 'grata', '\u00F3timo', 'otimo', 'perfeito', 'excelente'],
      answer: 'Fico feliz em ajudar! ðŸ™Œ Se tiver mais d\u00FAvidas ou quiser agendar seu diagn\u00F3stico, \u00E9 s\u00F3 perguntar. Estamos sempre aqui para elevar o n\u00E3­vel da sua marca! ðŸ’Ž'
    },
    {
      keywords: ['fluxai', 'ag\u00EAncia', 'agencia', 'empresa', 'quem', 'voc\u00EAs', 'historia'],
      answer: 'A FluxAI \u00E9 uma ag\u00EAncia premium de Marketing Digital especializada em posicionamento High-Ticket! ðŸš€ Unimos Branding, IA, Tr\u00E3¡fego Pago e Estrat\u00E9gia para transformar marcas em refer\u00EAncias de mercado. J\u00E3¡ ajudamos +50 marcas a escalar. Quer ser a pr\u00F3xima?'
    }
  ];

  const getResponse = (text) => {
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const item of faq) {
      if (item.keywords.some(kw => lower.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
        return item.answer;
      }
    }
    return 'Boa pergunta! ðŸ¤” N\u00E3£o encontrei uma resposta espec\u00E3­fica para isso, mas nossa equipe com certeza pode te ajudar. Chama a gente no WhatsApp: <a href="https://wa.me/5571981114694" target="_blank" style="color:var(--primary); font-weight:700;">Clique aqui</a> ðŸ’Ž';
  };
  // --- END FAQ ENGINE ---

  aiBtn.addEventListener('click', () => {
    aiWindow.classList.toggle('active');
    if (aiWindow.classList.contains('active')) {
      if (aiBody.children.length === 0) {
        setTimeout(() => addAIMessage('Ol\u00E1! Sou o <strong>Flux</strong>, assistente da FluxAI ðŸ’Ž<br>Pergunte sobre nossos servi\u00E7os, pre\u00E3§os ou qualquer d\u00FAvida!'), 500);
      }
    }
  });

  aiClose.addEventListener('click', () => aiWindow.classList.remove('active'));

  const sendMessage = () => {
    const text = aiInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    aiInput.value = '';

    // Show typing indicator
    const typingId = showTyping();
    setTimeout(() => {
      removeTyping(typingId);
      addAIMessage(getResponse(text));
    }, 800);
  };

  aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Optional send button support
  const sendBtn = document.getElementById('aiSend');
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);

  const addMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.style.marginBottom = '12px';
    msg.style.textAlign = sender === 'user' ? 'right' : 'left';
    msg.innerHTML = `<span style="display:inline-block; padding:10px 14px; border-radius:14px; max-width:85%; text-align:left; line-height:1.5; background:${sender === 'user' ? 'var(--primary)' : 'var(--bg-slate-dark)'}; color:${sender === 'user' ? '#fff' : 'var(--text-main)'}">${text}</span>`;
    aiBody.appendChild(msg);
    aiBody.scrollTop = aiBody.scrollHeight;
  };

  const addAIMessage = (text) => addMessage(text, 'ai');

  const showTyping = () => {
    const id = 'typing-' + Date.now();
    const msg = document.createElement('div');
    msg.id = id;
    msg.style.marginBottom = '12px';
    msg.innerHTML = `<span style="display:inline-block; padding:10px 14px; border-radius:14px; background:var(--bg-slate-dark); color:var(--text-muted);">\u2726 digitando...</span>`;
    aiBody.appendChild(msg);
    aiBody.scrollTop = aiBody.scrollHeight;
    return id;
  };

  const removeTyping = (id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  };
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
  initAIAssistant(); // Restaurado em favor do Typebot AI real
  initWelcomePopup();

});

// Agressively remove Elfsight branding asynchronously
setInterval(() => {
  const elfsightBadges = document.querySelectorAll('a[href*="elfsight.com"], .eapps-link');
  elfsightBadges.forEach(badge => {
    badge.style.setProperty('display', 'none', 'important');
    badge.remove();
  });
}, 800);
