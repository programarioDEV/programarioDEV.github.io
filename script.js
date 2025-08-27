// Utilidades
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    $('#themeToggle')?.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
}

(function initTheme(){
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const saved = localStorage.getItem('theme');
    setTheme(saved || (prefersLight ? 'light' : 'dark'));
})();

$('#themeToggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// Navegación móvil
const navToggle = $('#navToggle');
const navMenu = $('#navMenu');
navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Año en footer
$('#year').textContent = new Date().getFullYear().toString();

// Simulación de envío de formulario
$('#sendBtn')?.addEventListener('click', () => {
    const msg = $('#formMsg');
    msg.textContent = 'Gracias por tu mensaje. Te responderé pronto.';
    msg.style.color = 'var(--cyan)';
    setTimeout(() => { msg.textContent = ''; }, 4000);
});

// Typing effect para el bloque Python
(function typePython(){
    const el = $('#typing');
    if(!el) return;
    const original = el.textContent;
    const tokens = original
        .replace(/class|def|return|print/g, m => `§kw§${m}§`)
        .replace(/#[^\n]*/g, m => `§cm§${m}§`)
        .replace(/"([^"]*)"|'([^']*)'/g, m => `§str§${m}§`)
        .replace(/\b([A-Za-z_]\w*)\(/g, m => `§fn§${m}§`)
        .split('');

    el.textContent = '';
    let i = 0;
    const speed = 8; // ms por carácter
    const timer = setInterval(() => {
        if(i >= tokens.length){
            clearInterval(timer);
            // Postprocesado para envolver spans
            el.innerHTML = el.textContent
                .replaceAll('§kw§', '<span class="kw">')
                .replaceAll('§cm§', '<span class="cm">')
                .replaceAll('§str§', '<span class="str">')
                .replaceAll('§fn§', '<span class="fn">')
                .replaceAll('§', '</span>');
            return;
        }
        el.textContent += tokens[i++];
    }, speed);
})();

// IntersectionObserver para animaciones de aparición
(function revealOnScroll(){
    const els = $$('.reveal');
    if(!('IntersectionObserver' in window)){
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if(e.isIntersecting){
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
})();