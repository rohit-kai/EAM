'use strict';

/**
 * add event listener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * MOBILE NAVBAR TOGGLE
 */
const navbar = document.querySelector('[data-navbar]');
const navTogglers = document.querySelectorAll('[data-nav-toggler]');
const overlay = document.querySelector('[data-overlay]');

const toggleNav = function () {
  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
};

addEventOnElements(navTogglers, 'click', toggleNav);

/**
 * NAVBAR NAVIGATION & SMOOTH SCROLLING
 */
const navLinks = document.querySelectorAll('.navbar-link');

const closeNav = function () {
  if (navbar) navbar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
};

navLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    closeNav();

    const href = link.getAttribute('href');
    const isHome = link.textContent.trim().toLowerCase() === 'home' || href === './index.html' || href === '#';
    const isCurrentIndex = window.location.pathname.endsWith('index.html') || 
                           window.location.pathname === '/' || 
                           window.location.pathname.endsWith('/crafti/') || 
                           window.location.pathname.endsWith('/crafti');

    if (isHome && isCurrentIndex) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        history.replaceState(null, '', href);
      }
    }
  });
});

/**
 * SCROLLSPY: Highlight active nav link on scroll
 */
const isIndex = window.location.pathname.endsWith('index.html') || 
                window.location.pathname === '/' || 
                window.location.pathname.endsWith('/crafti/') || 
                window.location.pathname.endsWith('/crafti');

if (isIndex) {
  const sections = ['about', 'portfolio', 'contact'];
  const homeLink = Array.from(navLinks).find(l => l.textContent.trim().toLowerCase() === 'home');

  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY + 180;

    if (window.scrollY < 300) {
      navLinks.forEach(l => l.classList.remove('active'));
      if (homeLink) homeLink.classList.add('active');
      return;
    }

    sections.forEach(function (secId) {
      const section = document.getElementById(secId);
      if (!section) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.navbar-link[href="#${secId}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });
}

/**
 * active header when window scroll down to 100px
 */
const header = document.querySelector('[data-header]');

const headerActive = function () {
  if (window.scrollY > 100) {
    header.classList.add('active');
  } else {
    header.classList.remove('active');
  }
};

window.addEventListener('scroll', headerActive);
headerActive();

/**
 * ANIMATED COUNTERS
 */
const counters = document.querySelectorAll('[data-count]');

const animateCounter = function (el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const update = function () {
    current += step;
    if (current >= target) {
      current = target;
      el.textContent = prefix + current + suffix;
      return;
    }
    el.textContent = prefix + current + suffix;
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(function (counter) {
  counterObserver.observe(counter);
});

/**
 * NEWSLETTER FORM VALIDATION & MOCK SUBMISSION
 */
const newsletterForm = document.querySelector('[data-newsletter-form]');

if (newsletterForm) {
  const emailInput = newsletterForm.querySelector('[data-email-input]');
  const formMessage = newsletterForm.querySelector('[data-form-message]');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      formMessage.textContent = 'Please enter your email address.';
      formMessage.className = 'form-message error';
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      formMessage.className = 'form-message error';
      emailInput.focus();
      return;
    }

    // Mock submission
    formMessage.textContent = 'Thank you. You have been added to our private list.';
    formMessage.className = 'form-message success';
    emailInput.value = '';

    setTimeout(function () {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }, 5000);
  });

  // Clear error on input
  emailInput.addEventListener('input', function () {
    if (formMessage.classList.contains('error')) {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }
  });
}

/**
 * SMOOTH REVEAL ON SCROLL
 */
const revealElements = document.querySelectorAll(
  '.leader-card, .portfolio-card, .timeline-item, .feature-item, .quote-card'
);

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(function (el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
  revealObserver.observe(el);
});
