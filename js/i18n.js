// Textos que genera JavaScript, en el idioma del documento (<html lang>).
// El contenido de la página vive en el HTML de cada idioma: / (inglés) y /es/ (español).

const STRINGS = {
  en: {
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    valueMissing: 'This field is required.',
    typeMismatch: 'Enter a valid email address, e.g. name@domain.com.',
    tooShort: (min) => `Enter at least ${min} characters.`,
    tooLong: (max) => `Use at most ${max} characters.`,
    mailSubject: (name) => `Contact from your portfolio — ${name}`,
    mailOpened: (email) => `Your email app opened with the message ready. If it didn't, write to me directly at ${email}.`,
    sent: 'Thanks! Your message arrived and I will get back to you soon.',
    sendFailed: (email) => `The message could not be sent. Please write to me directly at ${email}.`,
    copied: 'Copied!',
    copyFailed: 'Could not copy',
    copiedAnnouncement: 'Email copied to the clipboard.',
    printTitle: 'Mario_Abarca_CV_Software_Engineer_EN',
  },
  es: {
    themeToLight: 'Cambiar a tema claro',
    themeToDark: 'Cambiar a tema oscuro',
    valueMissing: 'Este campo es obligatorio.',
    typeMismatch: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
    tooShort: (min) => `Escribe al menos ${min} caracteres.`,
    tooLong: (max) => `Usa como máximo ${max} caracteres.`,
    mailSubject: (name) => `Contacto desde el portafolio — ${name}`,
    mailOpened: (email) => `Abrí tu app de correo con el mensaje listo. Si no se abrió, escríbeme directamente a ${email}.`,
    sent: '¡Gracias! Tu mensaje llegó y te responderé pronto.',
    sendFailed: (email) => `No se pudo enviar el mensaje. Escríbeme directamente a ${email}.`,
    copied: '¡Copiado!',
    copyFailed: 'No se pudo copiar',
    copiedAnnouncement: 'Correo copiado al portapapeles.',
    printTitle: 'Mario_Abarca_CV_Software_Engineer_ES',
  },
};

/** Id de cada sección en inglés → su equivalente en español. */
export const SECTION_IDS = {
  content: 'contenido',
  home: 'inicio',
  stack: 'stack',
  projects: 'proyectos',
  experience: 'experiencia',
  contact: 'contacto',
};

export const lang = document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'en';
export const t = STRINGS[lang];
