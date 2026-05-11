// FLUXAI OS™ DASHBOARD CORE
export const initDashboard = () => {
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    const display = document.getElementById('module-display');
    const cache = {};

    if (!navItems.length || !display) return;

    // Pre-cache initial content
    const initialContent = display.querySelector('.display-content');
    if (initialContent) {
        const initialModId = document.querySelector('.nav-item.active')?.getAttribute('data-module');
        if (initialModId) cache[initialModId] = initialContent.outerHTML;
    }

    const updateDisplay = (contentHtml) => {
        const currentContent = display.querySelector('.display-content');
        if (currentContent) {
            currentContent.style.opacity = '0';
            currentContent.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                display.innerHTML = contentHtml;
                const newContent = display.querySelector('.display-content');
                if (newContent) {
                    newContent.style.display = 'block';
                    newContent.style.opacity = '0';
                    newContent.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        newContent.classList.add('active');
                        newContent.style.opacity = '1';
                        newContent.style.transform = 'translateY(0)';
                    }, 50);
                }
            }, 400);
        } else {
            display.innerHTML = contentHtml;
            const newContent = display.querySelector('.display-content');
            if (newContent) {
                newContent.style.display = 'block';
                setTimeout(() => newContent.classList.add('active'), 50);
            }
        }
    };

    const loadModule = async (url, moduleId) => {
        if (cache[moduleId]) {
            updateDisplay(cache[moduleId]);
            return;
        }

        // Show loading state (Silently)
        const loadingHtml = `<div class="display-content active" style="opacity: 0.5;">
            <div class="display-header">
                <span class="data-badge">[LOADING.SYS]</span>
                <h3>Processando...</h3>
            </div>
            <div class="display-body">
                <p>Carregando infraestrutura de ${moduleId.replace(/-/g, ' ')}...</p>
            </div>
        </div>`;
        updateDisplay(loadingHtml);

        try {
            const fetchUrl = url.startsWith("/") ? url : (url.startsWith("pages/") ? "/" + url : url); const response = await fetch(fetchUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainContent = doc.querySelector('main .container');

            if (mainContent) {
                const title = mainContent.querySelector('h1')?.innerText || '';
                const modLabel = mainContent.querySelector('.section-top-label')?.innerText || '';
                const body = mainContent.querySelector('.editorial-content')?.innerHTML || '';

                const formattedHtml = `<div class="display-content reveal">
                    <div class="display-header">
                        <span class="data-badge">${modLabel}</span>
                        <h3>${title}</h3>
                    </div>
                    <div class="display-body">${body}</div>
                    <div class="display-footer" style="margin-top: 30px;">
                        <a href="${url}" class="btn btn-secondary">Explorar Arquitetura Completa <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>`;

                cache[moduleId] = formattedHtml;
                updateDisplay(formattedHtml);
            }
        } catch (error) {
            console.error("Erro ao carregar módulo:", error);
            window.location.href = url; // Fallback
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Check if it's a mobile screen to decide if we should scroll to display
            const isMobile = window.innerWidth <= 1024;
            
            e.preventDefault();
            const url = item.getAttribute('href');
            const moduleId = item.getAttribute('data-module');

            if (item.classList.contains('active')) return;

            // Update Active State
            navItems.forEach(nav => {
                nav.classList.remove('active');
                nav.setAttribute('aria-selected', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');

            loadModule(url, moduleId);

            // History API
            window.history.pushState({ moduleId }, '', url);

            // Mobile scroll to display
            if (isMobile) {
                display.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    window.addEventListener('popstate', (e) => {
        const moduleId = e.state?.moduleId;
        if (moduleId) {
            const targetItem = document.querySelector(`.nav-item[data-module="${moduleId}"]`);
            if (targetItem) {
                // Trigger click without pushing to history again
                const url = targetItem.getAttribute('href');
                navItems.forEach(nav => {
                    nav.classList.remove('active');
                    nav.setAttribute('aria-selected', 'false');
                });
                targetItem.classList.add('active');
                targetItem.setAttribute('aria-selected', 'true');
                loadModule(url, moduleId);
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', initDashboard);
