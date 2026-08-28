document.addEventListener('DOMContentLoaded', () => {
  
  const config = {
    headerHeight: 72,
    scrollThreshold: 50,
    formEndpoint: 'https://formspree.io/f/xyknqwdd',
};

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contactForm');
  const currentYearEl = document.getElementById('currentYear');
  const backToTop = document.getElementById('backToTop');

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  function toggleNavMenu() {
    navMenu.classList.toggle('active');
    navToggle.innerHTML = navMenu.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
    
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
  }

  function closeNavMenu() {
    navMenu.classList.remove('active');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle?.addEventListener('click', toggleNavMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        closeNavMenu();
      }
    });
  });

  function updateActiveLink() {
    const scrollPosition = window.scrollY + config.headerHeight + 10;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > config.scrollThreshold) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    
    updateActiveLink();
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - config.headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      const formData = new FormData(contactForm);
      
      const response = await fetch(config.formEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showFormMessage('Mensagem enviada com sucesso! Entrarei em contato em breve. 🎉', 'success');
        contactForm.reset();
      } else {
        throw new Error('Falha no envio');
      }
      
    } catch (error) {
      showFormMessage('Ops! Algo deu errado. Tente me contatar pelo LinkedIn. 😅', 'error');
      console.error('Form error:', error);
      
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      setTimeout(() => {
        const message = contactForm.querySelector('.form-message');
        message?.remove();
      }, 5000);
    }
  });

  function showFormMessage(text, type) {
    const message = document.createElement('p');
    message.className = `form-message ${type}`;
    message.style.cssText = `
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      text-align: center;
      ${type === 'success' 
        ? 'background: rgba(34, 197, 94, 0.1); color: var(--color-success);' 
        : 'background: rgba(239, 68, 68, 0.1); color: var(--color-error);'}
    `;
    message.textContent = text;
    contactForm.appendChild(message);
  }

  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-category, .timeline-item, .contact-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img').forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      closeNavMenu();
      navToggle?.focus();
    }
  });

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  window.addEventListener('scroll', debounce(updateActiveLink, 100));

  console.log(`
    👋 Olá! Viu algo interessante no código?
    
    Sou Joao Arthur, desenvolvedor apaixonado por código limpo.
    Vamos conversar sobre oportunidades ou projetos?
    
    📧 joaoarthurdduarte@gmail.com
    🔗 linkedin.com/in/arthur-duarte-380513356
    💻 github.com/jarthur-duarte
  `);
});