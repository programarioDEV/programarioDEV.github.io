// "Descargar CV": abre el diálogo de impresión (Guardar como PDF) con la hoja de estilos @media print.
// Durante la impresión cambia el título del documento, que el navegador usa como nombre del PDF.

export function initPrint(buttons, { title } = {}) {
  if (typeof window.print !== 'function') return;

  if (title) {
    const original = document.title;
    window.addEventListener('beforeprint', () => { document.title = title; });
    window.addEventListener('afterprint', () => { document.title = original; });
  }

  for (const button of buttons) {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  }
}
