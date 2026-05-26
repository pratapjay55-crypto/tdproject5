/* ══════════════════════════════════════════════
   FlowApp — main.js
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. ACTIVE NAV LINK ON SCROLL ──────────────
     Highlights the correct nav link based on which
     section is currently in the viewport.
  ─────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');

  const activateLink = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });


  /* ── 2. SMOOTH SCROLL FOR ALL ANCHOR LINKS ─────
     Closes the mobile menu after clicking a link.
  ─────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close Bootstrap mobile navbar if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        toggler && toggler.click();
      }
    });
  });


  /* ── 3. STATS COUNTER ANIMATION ────────────────
     Counts up numbers inside .stat-number elements
     when the stats section scrolls into view.
  ─────────────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const parseStatValue = text => {
    // Extract the numeric portion, ignoring suffixes like K+, ★, %, +
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  const animateCounters = () => {
    statNumbers.forEach(el => {
      const original   = el.dataset.original || el.textContent.trim();
      el.dataset.original = original;          // store once
      const numericVal = parseStatValue(original);
      if (numericVal === null) return;

      const suffix     = original.replace(/[\d.]+/, '');
      const duration   = 1600;
      const stepTime   = 16;
      const steps      = duration / stepTime;
      const increment  = numericVal / steps;
      let   current    = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericVal) {
          current = numericVal;
          clearInterval(timer);
        }
        // Display with same decimal places as original
        const display = numericVal % 1 !== 0
          ? current.toFixed(1)
          : Math.floor(current);
        el.textContent = display + suffix;
      }, stepTime);
    });
  };

  // Use IntersectionObserver to trigger once
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }


  /* ── 4. FEATURE CARDS — ENTRANCE ANIMATION ─────
     Fades each card in with a slight upward slide
     when they enter the viewport.
  ─────────────────────────────────────────────── */
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.style.opacity  = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger by card index
          const delay = (Array.from(featureCards).indexOf(entry.target)) * 120;
          setTimeout(() => {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    featureCards.forEach(card => cardObserver.observe(card));
  } else {
    // Fallback: just show all cards immediately
    featureCards.forEach(card => {
      card.style.opacity  = '1';
      card.style.transform = 'translateY(0)';
    });
  }


  /* ── 5. EMAIL SUBSCRIBE FORM (FOOTER) ───────────
     Validates email and shows a success message.
  ─────────────────────────────────────────────── */
  const emailInput  = document.getElementById('footerEmail');
  const joinBtn     = document.getElementById('joinBtn');

  if (emailInput && joinBtn) {
    joinBtn.addEventListener('click', () => {
      const val = emailInput.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

      if (!isValid) {
        emailInput.style.borderColor = '#ff5f57';
        emailInput.focus();
        return;
      }

      // Success state
      emailInput.style.borderColor = '#28c840';
      joinBtn.textContent  = '✓ Joined!';
      joinBtn.style.background = '#28c840';
      joinBtn.disabled = true;
      emailInput.value = '';

      // Reset after 3 s
      setTimeout(() => {
        joinBtn.textContent = 'Join →';
        joinBtn.style.background = '';
        joinBtn.disabled = false;
        emailInput.style.borderColor = '';
      }, 3000);
    });
  }


  /* ── 6. NAVBAR SCROLL SHADOW ───────────────────
     Adds a subtle shadow to the navbar on scroll.
  ─────────────────────────────────────────────── */
  const navbar = document.querySelector('header .navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

});