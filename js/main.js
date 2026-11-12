document.addEventListener('DOMContentLoaded', () => {

  const config = {
    scrollThreshold: 50,
    formEndpoint: 'https://formspree.io/f/xyknqwdd',
  };

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const currentYearEl = document.getElementById('currentYear');
  const backToTop = document.getElementById('backToTop');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const headerHeight = () => navbar ? navbar.offsetHeight : 0;

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    navMenu.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    const icon = navToggle.querySelector('i');
    if (icon) icon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
  }

  navToggle?.addEventListener('click', () => {
    setMenu(!navMenu.classList.contains('active'));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) setMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      setMenu(false);
      navToggle?.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('active') && !navbar.contains(e.target)) {
      setMenu(false);
    }
  });

  /* ---------- Destaque do menu ---------- */
  function updateActiveLink() {
    const scrollPosition = window.scrollY + headerHeight() + 10;
    let currentId = null;

    sections.forEach(section => {
      if (scrollPosition >= section.offsetTop) currentId = section.id;
    });

    navLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar?.classList.toggle('scrolled', window.scrollY > config.scrollThreshold);
      updateActiveLink();
      ticking = false;
    });
  }, { passive: true });
  updateActiveLink();

  /* ---------- Rolagem suave com foco ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight();
      window.scrollTo({ top: targetId === '#home' ? 0 : top, behavior: reduceMotion ? 'auto' : 'smooth' });

      // Leva o foco do teclado junto (link "pular para o conteúdo" e menu)
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', targetId);
    });
  });

  /* ---------- Formulário (Formspree) ---------- */
  function showFormMessage(text, type) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = text;
  }

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    showFormMessage('', '');

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';

      const response = await fetch(config.formEndpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Falha no envio');

      showFormMessage('Mensagem enviada! Vou responder em breve.', 'success');
      contactForm.reset();
    } catch (error) {
      showFormMessage('Não foi possível enviar agora. Tente de novo ou me escreva por e-mail ou LinkedIn.', 'error');
      console.warn('Erro no formulário:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });

  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Animação de entrada ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.project-card, .skill-category, .timeline-item, .contact-card, .paper-card').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  console.log(`
    👋 Olá! Viu algo interessante no código?

    Sou João Arthur, desenvolvedor Python, Django e Visão Computacional.
    Vamos conversar sobre oportunidades ou projetos?

    📧 joaoarthurdduarte@gmail.com
    🔗 linkedin.com/in/arthur-duarte-380513356
    💻 github.com/jarthur-duarte
  `);
});
