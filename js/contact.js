// Formulario de contacto sin backend propio.
// - Sin data-endpoint: valida y abre el cliente de correo con un mailto: ya redactado.
// - Con data-endpoint (Formspree, Getform, etc.): envía por POST y muestra el resultado.
// Los mensajes salen de i18n.js, en el idioma de la página.

import { t } from './i18n.js';

function errorFor(field) {
  const { validity } = field;
  if (validity.valid) return '';
  if (validity.valueMissing) return t.valueMissing;
  if (validity.typeMismatch) return t.typeMismatch;
  if (validity.tooLong) return t.tooLong(field.maxLength);
  if (validity.tooShort) return t.tooShort(field.minLength);
  return field.validationMessage;
}

// validity.tooShort solo se activa tras edición del usuario y no ignora espacios; lo comprobamos a mano.
function checkLength(field) {
  const length = field.value.trim().length;
  if (field.minLength > 0 && length > 0 && length < field.minLength) return t.tooShort(field.minLength);
  return '';
}

function showError(field, message) {
  const error = document.getElementById(`${field.id}-error`);
  if (error) error.textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

function validate(fields) {
  let firstInvalid = null;
  for (const field of fields) {
    const message = errorFor(field) || checkLength(field);
    showError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  }
  firstInvalid?.focus();
  return !firstInvalid;
}

function setStatus(status, state, message) {
  if (!status) return;
  status.dataset.state = state;
  status.textContent = message;
}

function buildMailto(recipient, { name, email, message }) {
  const subject = t.mailSubject(name);
  const body = `${message}\n\n—\n${name}\n${email}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function postToEndpoint(endpoint, form) {
  const response = await fetch(endpoint, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

export function initContactForm(form) {
  if (!form) return;

  const endpoint = form.dataset.endpoint?.trim();
  const recipient = form.dataset.recipient;
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[type="submit"]');
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];

  form.noValidate = true; // mensajes propios, accesibles y en el idioma de la página
  if (endpoint) form.querySelector('[data-mailto-note]')?.setAttribute('hidden', '');

  // Limpia el error de un campo en cuanto vuelve a ser válido.
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field.getAttribute('aria-invalid') === 'true' && !(errorFor(field) || checkLength(field))) {
      showError(field, '');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus(status, '', '');
    if (!validate(fields)) return;

    const data = Object.fromEntries(
      [...new FormData(form)].map(([key, value]) => [key, String(value).trim()]),
    );
    if (data._gotcha) return; // bot: se descarta en silencio

    if (!endpoint) {
      window.location.href = buildMailto(recipient, data);
      setStatus(status, 'success', t.mailOpened(recipient));
      return;
    }

    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try {
      await postToEndpoint(endpoint, form);
      form.reset();
      setStatus(status, 'success', t.sent);
    } catch {
      setStatus(status, 'error', t.sendFailed(recipient));
    } finally {
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}

/** Botones "Copiar": solo se muestran si el navegador permite escribir en el portapapeles. */
export function initCopyButtons(buttons, liveRegion) {
  if (!navigator.clipboard?.writeText) return;

  for (const button of buttons) {
    const label = button.querySelector('[data-copy-label]') ?? button;
    const original = label.textContent;
    let timer;

    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        label.textContent = t.copied;
        if (liveRegion) liveRegion.textContent = t.copiedAnnouncement;
      } catch {
        label.textContent = t.copyFailed;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        label.textContent = original;
        if (liveRegion) liveRegion.textContent = '';
      }, 2000);
    });
  }
}
