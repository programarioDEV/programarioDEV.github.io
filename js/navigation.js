// Navegación: menú desplegable en móvil y resaltado de la sección visible (scrollspy).

const DESKTOP_QUERY = '(min-width: 48rem)';

export function initMenu(toggle, menu) {
  if (!toggle || !menu) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Elegir una sección cierra el menú.
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Esc cierra y devuelve el foco al botón que lo abrió.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Clic fuera del menú, o foco que sale de él con Tab, lo cierra.
  document.addEventListener('click', (event) => {
    if (isOpen() && !menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  menu.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !menu.contains(event.relatedTarget) && event.relatedTarget !== toggle) {
      setOpen(false);
    }
  });

  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/**
 * Marca con aria-current el enlace de la sección que cruza la franja central del viewport.
 * Las secciones sin enlace (p. ej. el hero) limpian la marca.
 */
export function initScrollSpy(links, sections) {
  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const linkById = new Map(links.map((link) => [decodeURIComponent(link.hash.slice(1)), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const active = linkById.get(entry.target.id);
        for (const link of links) {
          if (link === active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}
