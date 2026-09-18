
(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  const year = document.getElementById('year');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // =========================
  // Dynamic footer year
  // =========================
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // =========================
  // Header scroll state
  // =========================
  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });

  // =========================
  // Mobile Navigation
  // =========================
  const closeNav = () => {
    if (!nav || !navToggle) return;

    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');

    document.body.classList.remove('menu-open');
  };

  navToggle?.addEventListener('click', () => {
    if (!nav) return;

    const isOpen = nav.classList.toggle('is-open');

    navToggle.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close menu' : 'Open menu'
    );

    document.body.classList.toggle(
      'menu-open',
      isOpen
    );
  });

  // Close menu after clicking navigation link
  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close mobile menu with Escape
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  // =========================
  // Scroll Reveal Animation
  // =========================
  const revealItems = document.querySelectorAll('.reveal');

  if (
    prefersReducedMotion ||
    !('IntersectionObserver' in window)
  ) {
    revealItems.forEach(item => {
      item.classList.add('is-visible');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px'
      }
    );

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  }

  // =========================
  // Reviews Slider
  // =========================
  const reviewsTrack =
    document.querySelector('.reviews-track');

  const prevButton =
    document.querySelector('.slider-btn.prev');

  const nextButton =
    document.querySelector('.slider-btn.next');

  const reviews = Array.from(
    document.querySelectorAll('.review-card')
  );

  let reviewIndex = 0;

  const renderReview = () => {
    if (!reviewsTrack || !reviews.length) return;

    reviewsTrack.style.transform =
      `translateX(-${reviewIndex * 100}%)`;
  };

  prevButton?.addEventListener('click', () => {
    reviewIndex =
      (reviewIndex - 1 + reviews.length) %
      reviews.length;

    renderReview();
  });

  nextButton?.addEventListener('click', () => {
    reviewIndex =
      (reviewIndex + 1) %
      reviews.length;

    renderReview();
  });

  // =========================
  // Gallery Lightbox
  // =========================
  const lightbox =
    document.getElementById('lightbox');

  const lightboxImage =
    document.getElementById('lightbox-image');

  const lightboxCaption =
    document.getElementById('lightbox-caption');

  const lightboxClose =
    document.querySelector('.lightbox-close');

  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'menu-open'
    );

    if (lightboxImage) {
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    }

    if (lastFocusedElement) {
      if (
        typeof lastFocusedElement.focus ===
        'function'
      ) {
        lastFocusedElement.focus();
      }
    }

    lastFocusedElement = null;
  };

  document
    .querySelectorAll('.gallery-item')
    .forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.image;

        if (
          !src ||
          !lightbox ||
          !lightboxImage
        ) {
          return;
        }

        lastFocusedElement = item;

        lightboxImage.src = src;

        lightboxImage.alt =
          item.querySelector('img')?.alt ||
          item.dataset.caption ||
          'Chaupal Seaview image';

        if (lightboxCaption) {
          lightboxCaption.textContent =
            item.dataset.caption || '';
        }

        lightbox.classList.add(
          'is-open'
        );

        lightbox.setAttribute(
          'aria-hidden',
          'false'
        );

        document.body.classList.add(
          'menu-open'
        );

        lightboxClose?.focus();
      });
    });

  // Close button
  lightboxClose?.addEventListener(
    'click',
    closeLightbox
  );

  // Close when clicking outside image
  lightbox?.addEventListener(
    'click',
    event => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    }
  );

  // =========================
  // Keyboard Accessibility
  // =========================
  window.addEventListener(
    'keydown',
    event => {
      if (
        event.key === 'Escape' &&
        lightbox?.classList.contains(
          'is-open'
        )
      ) {
        closeLightbox();
      }
    }
  );
})();
