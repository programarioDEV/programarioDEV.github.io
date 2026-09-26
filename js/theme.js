// Tema claro/oscuro. El <head> aplica el tema guardado antes del primer pintado;
// este módulo solo gestiona el botón y persiste la elección del usuario.

import { t } from './i18n.js';

const STORAGE_KEY = 'theme';
const root = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento (modo privado, cookies bloqueadas): el tema dura solo esta visita.
  }
}

export function currentTheme() {
  return root.dataset.theme ?? (prefersDark.matches ? 'dark' : 'light');
}

function syncButton(button) {
  const theme = currentTheme();
  button.dataset.current = theme;
  button.setAttribute('aria-label', theme === 'dark' ? t.themeToLight : t.themeToDark);
}

export function initTheme(button) {
  if (!button) return;

  syncButton(button);

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    storeTheme(next);
    syncButton(button);
  });

  // Si el usuario no ha elegido, seguimos los cambios de tema del sistema.
  prefersDark.addEventListener('change', () => {
    if (!readStoredTheme()) syncButton(button);
  });
}
