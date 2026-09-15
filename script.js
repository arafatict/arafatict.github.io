const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Close' : 'Menu';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    });
  });
}

const noteForm = document.querySelector('#note-form');
const noteStatus = document.querySelector('#note-status');
const noteSubmit = document.querySelector('#note-submit');

if (noteForm && noteStatus && noteSubmit) {
  noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    noteStatus.className = 'form-status';
    noteStatus.textContent = '';

    if (!noteForm.checkValidity()) {
      noteForm.reportValidity();
      noteStatus.className = 'form-status error';
      noteStatus.textContent = 'Please complete all required fields with a valid email address.';
      return;
    }

    const endpoint = noteForm.dataset.formEndpoint || '';
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
      noteStatus.className = 'form-status error';
      noteStatus.textContent = 'The message form is being connected. Please contact me by email for now.';
      return;
    }

    noteSubmit.disabled = true;
    noteSubmit.setAttribute('aria-busy', 'true');
    noteSubmit.querySelector('span').textContent = '…';
    const formData = new FormData(noteForm);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Form service returned an error');
      noteForm.reset();
      noteStatus.className = 'form-status success';
      noteStatus.textContent = 'Thank you! Your message has been sent successfully. I’ll get back to you as soon as possible.';
    } catch (error) {
      noteStatus.className = 'form-status error';
      noteStatus.textContent = 'Sorry, your message could not be sent. Please try again later or email me directly.';
    } finally {
      noteSubmit.disabled = false;
      noteSubmit.removeAttribute('aria-busy');
      noteSubmit.querySelector('span').textContent = '↗';
    }
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
