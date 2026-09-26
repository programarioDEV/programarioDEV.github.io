// Selector de idioma. En el HTML los enlaces apuntan a index.html para que funcionen
// incluso abriendo los archivos desde el disco; con JS, además:
// - en el servidor usan la URL limpia (/es/ en vez de /es/index.html), y
// - llevan a la misma sección que se está leyendo (p. ej. /#projects ↔ /es/#proyectos).

import { SECTION_IDS } from './i18n.js';

function cleanUrl(href) {
  const url = new URL(href);
  if (url.protocol.startsWith('http')) url.pathname = url.pathname.replace(/index\.html$/, '');
  return url;
}

function currentSectionId() {
  const line = window.innerHeight * 0.35;
  let current = null;
  for (const section of document.querySelectorAll('main > section[id]')) {
    if (section.getBoundingClientRect().top <= line) current = section.id;
  }
  return current;
}

function translateSectionId(id, from, to) {
  if (from === to) return id;
  if (from === 'en') return SECTION_IDS[id] ?? null;
  return Object.keys(SECTION_IDS).find((key) => SECTION_IDS[key] === id) ?? null;
}

export function initLanguageSwitch(links, currentLang) {
  for (const link of links) {
    link.href = cleanUrl(link.href).href;

    const target = link.hreflang;
    if (!target || target === currentLang) continue;

    link.addEventListener('click', (event) => {
      // Respeta abrir en pestaña nueva (Ctrl/Cmd/Shift + clic, clic central).
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const section = translateSectionId(currentSectionId(), currentLang, target);
      if (!section || section === 'home' || section === 'inicio') return; // arriba de todo: enlace normal

      event.preventDefault();
      const url = cleanUrl(link.href);
      url.hash = section;
      window.location.assign(url);
    });
  }
}
