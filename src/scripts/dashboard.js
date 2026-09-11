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
        if (initialModId) cache[initialModId] = initialContent;
    }

    const updateDisplay = (contentNode) => {
        const currentContent = display.querySelector('.display-content');
        if (currentContent) {
            currentContent.style.opacity = '0';
            currentContent.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                display.replaceChildren(contentNode);
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
            display.replaceChildren(contentNode);
            const newContent = display.querySelector('.display-content');
            if (newContent) {
                newContent.style.display = 'block';
                setTimeout(() => newContent.classList.add('active'), 50);
            }
        }
    };

    const loadModule = async (moduleId) => {
        if (cache[moduleId]) {
            updateDisplay(cache[moduleId].cloneNode(true));
            return;
        }

        // Show loading state (Silently)
        const loadingNode = document.createElement('div');
        loadingNode.className = 'display-content active';
        loadingNode.style.opacity = '0.5';
        loadingNode.innerHTML = `
            <div class="display-header">
                <span class="data-badge">[LOADING.SYS]</span>
                <h3>Processando...</h3>
            </div>
            <div class="display-body">
                <p class="safe-loading-msg"></p>
            </div>
        `;
        loadingNode.querySelector('.safe-loading-msg').textContent = \`Carregando infraestrutura de \${moduleId.replace(/-/g, ' ').toUpperCase()}...\`;
        updateDisplay(loadingNode);

        try {
            const fetchUrl = "/pages/" + moduleId + ".html";
            const response = await fetch(fetchUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainContent = doc.querySelector('main .container');

            if (mainContent) {
                const titleHTML = mainContent.querySelector('h1')?.innerHTML || '';
                const modLabel = mainContent.querySelector('.section-top-label')?.textContent?.trim() || '';
                const editorialClone = mainContent.querySelector('.editorial-content');
                const bodyNodes = editorialClone ? editorialClone.cloneNode(true) : document.createElement('div');
                // Remove 'reveal' so the cloned content is immediately visible (not opacity:0)
                bodyNodes.classList.remove('reveal');
                bodyNodes.style.opacity = '1';
                bodyNodes.style.transform = 'none';

                const formattedNode = document.createElement('div');
                formattedNode.className = 'display-content reveal';
                
                const header = document.createElement('div');
                header.className = 'display-header';
                const badge = document.createElement('span');
                badge.className = 'data-badge';
                badge.textContent = modLabel;
                const h3 = document.createElement('h3');
                h3.innerHTML = titleHTML;
                header.appendChild(badge);
                header.appendChild(h3);
                
                const bodyDiv = document.createElement('div');
                bodyDiv.className = 'display-body';
                bodyDiv.appendChild(bodyNodes);
                
                const footer = document.createElement('div');
                footer.className = 'display-footer';
                footer.style.marginTop = '30px';
                
                // Novo CTA para o Painel Dinamico
                const a = document.createElement('a');
                a.className = 'btn btn-primary btn-large';
                a.href = "/#diagnostico";
                a.innerHTML = 'Solicitar Diagnóstico Estratégico <i class="fa-solid fa-arrow-right"></i>';
                footer.appendChild(a);
                
                formattedNode.appendChild(header);
                formattedNode.appendChild(bodyDiv);
                formattedNode.appendChild(footer);

                cache[moduleId] = formattedNode;
                updateDisplay(formattedNode.cloneNode(true));
            }
        } catch (error) {
            console.error("Erro ao carregar módulo:", error);
            // Fallback seguro em caso de falha (Módulo Inválido)
            const defaultItem = document.querySelector('.nav-item[data-module="command-center"]');
            if (defaultItem) activateTab(defaultItem, true);
        }
    };

    const activateTab = (item, isPopState = false) => {
        const isMobile = window.innerWidth <= 1024;
        const moduleId = item.getAttribute('data-module');

        if (item.classList.contains('active')) return;

        // Update Active State and Accessibility
        navItems.forEach(nav => {
            nav.classList.remove('active');
            nav.setAttribute('aria-selected', 'false');
            nav.setAttribute('tabindex', '-1');
        });
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
        item.setAttribute('tabindex', '0');
        item.focus();

        loadModule(moduleId);

        // History API setup
        if (!isPopState) {
            const newUrl = \`/?module=\${moduleId}#estruturas\`;
            window.history.pushState({ moduleId }, '', newUrl);
        }

        // Mobile scroll to display
        if (isMobile && !isPopState) {
            display.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    navItems.forEach(item => {
        // Inicializa o tabindex
        if (!item.classList.contains('active')) {
            item.setAttribute('tabindex', '-1');
        } else {
            item.setAttribute('tabindex', '0');
        }

        item.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab(item);
        });
    });

    // Keyboard navigation (ArrowUp, ArrowDown, Enter, Space)
    const navItemsArray = Array.from(navItems);
    navItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            let targetIndex = null;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                targetIndex = (index + 1) % navItemsArray.length;
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                targetIndex = (index - 1 + navItemsArray.length) % navItemsArray.length;
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateTab(item);
            }

            if (targetIndex !== null) {
                navItemsArray[targetIndex].focus();
            }
        });
    });

    window.addEventListener('popstate', (e) => {
        const moduleId = e.state?.moduleId;
        if (moduleId) {
            const targetItem = document.querySelector(\`.nav-item[data-module="\${moduleId}"]\`);
            if (targetItem) {
                activateTab(targetItem, true);
            }
        } else {
            // Check se é carregamento de página anterior que tem o param na URL
            const params = new URLSearchParams(window.location.search);
            const mId = params.get('module');
            if (mId) {
                const targetItem = document.querySelector(\`.nav-item[data-module="\${mId}"]\`);
                if (targetItem) activateTab(targetItem, true);
            } else {
                // Default fallback
                const defaultItem = document.querySelector('.nav-item[data-module="command-center"]');
                if (defaultItem) activateTab(defaultItem, true);
            }
        }
    });

    // INIT CHECKS (Deep Link Support)
    const initDeepLink = () => {
        const params = new URLSearchParams(window.location.search);
        const moduleParam = params.get('module');
        if (moduleParam) {
            const targetItem = document.querySelector(\`.nav-item[data-module="\${moduleParam}"]\`);
            if (targetItem && !targetItem.classList.contains('active')) {
                // Simula clique silencioso
                activateTab(targetItem, true);
                window.history.replaceState({ moduleId: moduleParam }, '', \`/?module=\${moduleParam}#estruturas\`);
            } else if (!targetItem) {
                // Invalid module fallback
                const defaultItem = document.querySelector('.nav-item[data-module="command-center"]');
                window.history.replaceState({ moduleId: 'command-center' }, '', '/?module=command-center#estruturas');
            }
        } else {
            // Nenhum parametro: marca estado inicial para o popstate
            const activeItem = document.querySelector('.nav-item.active');
            if(activeItem) {
                const moduleId = activeItem.getAttribute('data-module');
                window.history.replaceState({ moduleId }, '', window.location.href);
            }
        }
    };

    initDeepLink();
};

document.addEventListener('DOMContentLoaded', initDashboard);
