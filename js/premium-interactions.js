/* ============================================================
   PREMIUM INTERACTIONS - MODERN JS 2026
   Minimal vanilla JS for scroll animations, mobile menu, etc.
   ============================================================ */

(function() {
  'use strict';

  // ============================================================
  // NAVIGATION SCROLL EFFECT
  // ============================================================
  const navHeader = document.querySelector('.google-nav, .landing-nav');
  
  if (navHeader) {
    let lastScrollY = 0;
    let ticking = false;
    
    const updateNav = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        navHeader.classList.add('scrolled');
      } else {
        navHeader.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // SCROLL PROGRESS INDICATOR
  // ============================================================
  const createScrollProgress = () => {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progress.style.width = `${scrollPercent}%`;
    };
    
    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateProgress);
    }, { passive: true });
  };
  
  createScrollProgress();

  // ============================================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };
  
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animate-in class
  document.querySelectorAll('.animate-in, .animate-on-scroll').forEach(el => {
    animateOnScroll.observe(el);
  });
  
  // Auto-add animation to certain elements
  const elementsToAnimate = [
    '.google-feature-item',
    '.specialty-card',
    '.bento-item',
    '.test-card',
    '.app-card',
    '.quick-action'
  ];
  
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.classList.contains('animate-in')) {
        el.classList.add('animate-in');
        el.setAttribute('data-delay', Math.min(index + 1, 5));
        animateOnScroll.observe(el);
      }
    });
  });

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================================
  // MOBILE MENU TOGGLE
  // ============================================================
  const menuBtn = document.querySelector('.nav-menu-btn, #menuBtn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay, #mobileMenuOverlay');
  const menuClose = document.querySelector('.mobile-menu-close, #menuClose');
  
  const toggleMobileMenu = (show) => {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.toggle('active', show);
      document.body.style.overflow = show ? 'hidden' : '';
    }
  };
  
  if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMobileMenu(true));
  }
  
  if (menuClose) {
    menuClose.addEventListener('click', () => toggleMobileMenu(false));
  }
  
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        toggleMobileMenu(false);
      }
    });
  }

  // ============================================================
  // MOBILE BOTTOM NAV ACTIVE STATE
  // ============================================================
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  
  mobileNavItems.forEach(item => {
    item.addEventListener('click', function() {
      mobileNavItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ============================================================
  // SIDEBAR TOGGLE (Mobile)
  // ============================================================
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // ============================================================
  // CARD HOVER TILT EFFECT (Subtle)
  // ============================================================
  const tiltCards = document.querySelectorAll('.test-card, .specialty-card, .google-feature-item');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================================
  // RIPPLE EFFECT ON BUTTONS
  // ============================================================
  const addRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  };
  
  // Add ripple style
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);
  
  document.querySelectorAll('.google-btn, .landing-btn, .auth-button, .test-button, .btn').forEach(btn => {
    btn.addEventListener('click', addRipple);
  });

  // ============================================================
  // PARALLAX ON HERO (Subtle)
  // ============================================================
  const heroOrbs = document.querySelectorAll('.hero-orb, .visual-orb');
  
  if (heroOrbs.length > 0) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroOrbs.forEach((orb, index) => {
            const speed = 0.05 * (index + 1);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  window.showToast = (message, type = 'info', duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = `notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ============================================================
  // FOCUS TRAP FOR MODALS
  // ============================================================
  const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
      
      if (e.key === 'Escape') {
        const closeBtn = element.querySelector('.auth-close-btn, .modal-close');
        if (closeBtn) closeBtn.click();
      }
    });
  };
  
  const authContainer = document.querySelector('.auth-container');
  if (authContainer) {
    trapFocus(authContainer);
  }

  // ============================================================
  // DEBOUNCE UTILITY
  // ============================================================
  window.debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ============================================================
  // INIT ON DOM READY
  // ============================================================
  console.log('✨ Premium interactions loaded');
  
})();
