// Punto de entrada (módulo ES). Cada función vive en js/ y es independiente:
// si un elemento no existe en la página, su módulo simplemente no hace nada.

import { initTheme } from './js/theme.js';
import { initMenu, initScrollSpy } from './js/navigation.js';
import { initContactForm, initCopyButtons } from './js/contact.js';
import { initPrint } from './js/print.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

initTheme($('[data-theme-toggle]'));
initMenu($('[data-menu-toggle]'), $('#nav-menu'));
initScrollSpy($$('#nav-menu a[href^="#"]'), $$('main > section[id]'));
initContactForm($('#contact-form'));
initCopyButtons($$('[data-copy]'), $('[data-copy-status]'));
initPrint($$('[data-action="print"]'), { title: 'Mario_Abarca_CV_Software_Engineer' });

const year = $('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
