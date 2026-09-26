// Punto de entrada (módulo ES), compartido por / (inglés) y /es/ (español).
// Cada función vive en js/ y es independiente: si un elemento no existe en la página,
// su módulo simplemente no hace nada.

import { lang, t } from './js/i18n.js';
import { initTheme } from './js/theme.js';
import { initMenu, initScrollSpy } from './js/navigation.js';
import { initLanguageSwitch } from './js/language.js';
import { initContactForm, initCopyButtons } from './js/contact.js';
import { initPrint } from './js/print.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

initTheme($('[data-theme-toggle]'));
initMenu($('[data-menu-toggle]'), $('#nav-menu'));
initScrollSpy($$('#nav-menu a[href^="#"]'), $$('main > section[id]'));
initLanguageSwitch($$('[data-lang-link]'), lang);
initContactForm($('#contact-form'));
initCopyButtons($$('[data-copy]'), $('[data-copy-status]'));
initPrint($$('[data-action="print"]'), { title: t.printTitle });

const year = $('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
