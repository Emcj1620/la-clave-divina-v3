/**
 * La Clave Divina — LP V2
 * script.js
 * CRO-Optimized Interactions
 */

(function () {
  'use strict';

  /* ============================================================
     1. STICKY HEADER
     Shows after scrolling past the hero CTA (~600px)
     CRO rationale: Attention Ratio — keep the conversion action
     accessible at all scroll depths without competing with hero.
  ============================================================ */
  const stickyHeader = document.getElementById('sticky-header');
  const STICKY_THRESHOLD = 600;

  if (stickyHeader) {
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          stickyHeader.classList.add('visible');
        } else {
          stickyHeader.classList.remove('visible');
        }
      },
      { threshold: 0, rootMargin: '-600px 0px 0px 0px' }
    );

    const heroSection = document.getElementById('hero');
    if (heroSection) stickyObserver.observe(heroSection);
  }

  /* ============================================================
     2. SCROLL ANIMATIONS (Intersection Observer)
     CRO rationale: Visual rhythm keeps users engaged as they scroll.
     Uses IntersectionObserver (performant, no scroll event listeners).
  ============================================================ */
  const animatedEls = document.querySelectorAll('.animate-fade-up');

  if (animatedEls.length) {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedEls.forEach(el => animObserver.observe(el));
  }

  /* ============================================================
     3. FAQ ACCORDION
     CRO rationale: Hick's Law — reduces cognitive load by showing
     one answer at a time. Pre-empts objections progressively.
  ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others first
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
    });

    // Keyboard accessibility
    btn.setAttribute('aria-expanded', 'false');
    item.addEventListener('faq-toggle', () => {
      btn.setAttribute('aria-expanded', item.classList.contains('open').toString());
    });
  });

  /* ============================================================
     4. SMOOTH SCROLL for anchor links
     CRO rationale: Reduces friction when navigating to offer section.
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // account for sticky header
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     5. STAGGERED ANIMATION for grid children
     CRO rationale: Von Restorff Effect — sequential reveal draws
     the eye through the content in the intended order.
  ============================================================ */
  function staggerChildren(parentSelector, childSelector, delay = 80) {
    const parents = document.querySelectorAll(parentSelector);
    parents.forEach(parent => {
      const children = parent.querySelectorAll(childSelector);
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * delay}ms`;
      });
    });
  }

  staggerChildren('.benefits-grid', '.benefit-card', 80);
  staggerChildren('.testimonials-grid', '.testimonial-card', 80);
  staggerChildren('.forwhom-grid', '.forwhom-card', 60);
  staggerChildren('.identification-grid', '.id-card', 60);
  staggerChildren('.bonus-grid', '.bonus-card', 60);

  /* ============================================================
     6. OFFER SECTION — Number counter animation
     CRO rationale: Animates the perceived value of the offer stack.
     People pay more attention to dynamic numbers.
  ============================================================ */
  function animateCounter(el, target, duration = 1200) {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            animateCounter(el, target);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ============================================================
     7. CTA BUTTON RIPPLE EFFECT
     CRO rationale: Tactile feedback increases perceived interactivity
     and encourages click completion (Fogg Behavior Model — trigger).
  ============================================================ */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.5s linear;
        pointer-events: none;
      `;

      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `@keyframes ripple { to { transform: scale(1); opacity: 0; } }`;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

})();
