/**
 * FluxAI Labs — Pages Observer Utility
 * Garante que elementos .reveal acima do fold sejam imediatamente ativados.
 * Usado nas páginas internas (/pages/*.html).
 */
document.addEventListener('DOMContentLoaded', () => {
    // Ativar imediatamente todos os .reveal que já estão visíveis no viewport
    const activateVisible = () => {
        document.querySelectorAll('.reveal:not(.active)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('active');
            }
        });
    };

    // Observer com rootMargin generoso para disparar antes de entrar no viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Disparar imediatamente (resolve o carregamento inicial)
    activateVisible();

    // Também disparar no scroll (fallback)
    window.addEventListener('scroll', activateVisible, { passive: true });
});
