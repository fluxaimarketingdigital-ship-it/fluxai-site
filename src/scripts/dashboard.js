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

    const loadModule = async (url, moduleId) => {
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
        loadingNode.querySelector('.safe-loading-msg').textContent = `Carregando infraestrutura de ${moduleId.replace(/-/g, ' ').toUpperCase()}...`;
        updateDisplay(loadingNode);

        try {
            const fetchUrl = url.startsWith("/pages/") ? url : "/pages/" + url.split("/").pop().replace(".html", "") + ".html"; const response = await fetch(fetchUrl);
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
                const a = document.createElement('a');
                a.className = 'btn btn-secondary';
                a.href = url;
                a.innerHTML = 'Explorar Arquitetura Completa <i class="fa-solid fa-arrow-right"></i>';
                footer.appendChild(a);
                
                formattedNode.appendChild(header);
                formattedNode.appendChild(bodyDiv);
                formattedNode.appendChild(footer);

                cache[moduleId] = formattedNode;
                updateDisplay(formattedNode.cloneNode(true));
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
