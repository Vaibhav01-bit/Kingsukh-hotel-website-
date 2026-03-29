/* ─── MAIN JS v2 — Kingsukh Guest House ─── */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     OFFER BANNER
  ══════════════════════════════════ */
  const offerBanner = document.getElementById('offerBanner');
  const offerClose = document.getElementById('offerClose');
  const navbar = document.getElementById('navbar');

  const updateNavOffset = () => {
    if (offerBanner && offerBanner.classList.contains('hide')) {
      navbar?.classList.add('banner-hidden');
    } else {
      navbar?.classList.remove('banner-hidden');
    }
  };
  updateNavOffset();

  offerClose?.addEventListener('click', () => {
    offerBanner.classList.add('hide');
    navbar?.classList.add('banner-hidden');
    sessionStorage.setItem('offerClosed', '1');
  });

  if (sessionStorage.getItem('offerClosed') === '1') {
    offerBanner?.classList.add('hide');
    navbar?.classList.add('banner-hidden');
  }

  /* ══════════════════════════════════
     NAVBAR — Smart scroll + active link
  ══════════════════════════════════ */
  const navLinks = document.querySelectorAll('.nav-link');
  const progressBar = document.getElementById('scrollProgress');

  /* ── cache hero elements for parallax ── */
  const heroSection = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-img');
  const heroContent = document.querySelector('.hero-content');
  const heroOverlay = document.querySelector('.hero-overlay');
  const scrollHint = document.querySelector('.scroll-hint');

  /* scroll-direction tracking */
  let lastScrollY = 0;
  let ticking = false;

  const onScroll = () => {
    const sy = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    /* ── SCROLL PROGRESS BAR ── */
    if (progressBar) {
      const pct = docH > 0 ? (sy / docH) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }

    /* ── HERO PARALLAX (only while hero is in view) ── */
    if (heroSection && sy < heroSection.offsetHeight) {
      const heroH = heroSection.offsetHeight;
      const progress = Math.min(sy / heroH, 1);

      if (heroImg) {
        heroImg.style.transform = `scale(1.08) translateY(${progress * 18}%)`;
      }
      if (heroContent) {
        const fadeStart = 0.08;
        const opacity = progress < fadeStart ? 1 : Math.max(0, 1 - (progress - fadeStart) / 0.35);
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${progress * -60}px)`;
      }
      if (heroOverlay) {
        const extra = progress * 0.35;
        heroOverlay.style.background = `linear-gradient(135deg,
          rgba(13,26,21,${0.82 + extra}) 0%,
          rgba(26,60,46,${0.60 + extra}) 50%,
          rgba(13,26,21,${0.75 + extra}) 100%)`;
      }
      if (scrollHint) scrollHint.classList.toggle('hidden', sy > 30);
    }

    /* ── SMART NAVBAR: hide on scroll-down, show on scroll-up ── */
    const scrollingDown = sy > lastScrollY;
    if (sy > 120) {
      /* hide when scrolling down fast enough */
      if (scrollingDown && sy - lastScrollY > 4) {
        navbar?.classList.add('nav-hidden');
      } else if (!scrollingDown) {
        navbar?.classList.remove('nav-hidden');
      }
    } else {
      /* always show near top */
      navbar?.classList.remove('nav-hidden');
    }
    lastScrollY = sy;

    /* ── NAVBAR GLASSMORPHISM when scrolled past hero ── */
    if (sy > 80) {
      navbar?.classList.add('nav-scrolled');
    } else {
      navbar?.classList.remove('nav-scrolled');
    }

    /* ── Active nav link ── */
    const scrollPos = sy + 140;
    let activeSet = false;
    document.querySelectorAll('section[id]').forEach(sec => {
      if (activeSet) return;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        activeSet = true;
      }
    });
    /* default to home if nothing matches (very top) */
    if (!activeSet && sy < 200) {
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelector('.nav-link[href="#home"]')?.classList.add('active');
    }

    /* ── Back to top button ── */
    const btn = document.getElementById('backToTop');
    sy > 300 ? btn?.classList.add('visible') : btn?.classList.remove('visible');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══════════════════════════════════
     HAMBURGER
  ══════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ══════════════════════════════════
     BACK TO TOP
  ══════════════════════════════════ */
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════
     COUNTER ANIMATION
  ══════════════════════════════════ */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  };

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animateCounter(e.target);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('[data-target]').forEach(c => counterObs.observe(c));

  /* ══════════════════════════════════
     AOS — Animate on Scroll
  ══════════════════════════════════ */
  const aosObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.aosDelay || 0);
        setTimeout(() => e.target.classList.add('aos-animate'), delay);
        aosObs.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

  /* ══════════════════════════════════
     GALLERY LIGHTBOX
  ══════════════════════════════════ */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentLbIndex = 0;

  const openLb = (i) => {
    currentLbIndex = i;
    const img = galleryItems[i].querySelector('img');
    const cap = galleryItems[i].querySelector('.gallery-overlay span');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCaption.textContent = cap?.textContent || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
  document.getElementById('lbClose')?.addEventListener('click', closeLb);
  document.getElementById('lbNext')?.addEventListener('click', () => openLb((currentLbIndex + 1) % galleryItems.length));
  document.getElementById('lbPrev')?.addEventListener('click', () => openLb((currentLbIndex - 1 + galleryItems.length) % galleryItems.length));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') openLb((currentLbIndex + 1) % galleryItems.length);
    if (e.key === 'ArrowLeft') openLb((currentLbIndex - 1 + galleryItems.length) % galleryItems.length);
  });

  /* ══════════════════════════════════
     REVIEWS CAROUSEL
  ══════════════════════════════════ */
  const track = document.getElementById('reviewsTrack');
  const cards = track ? Array.from(track.querySelectorAll('.review-card')) : [];
  const dotsWrap = document.getElementById('revDots');
  let revIndex = 0;
  let autoRevTimer;

  // Create dots
  if (dotsWrap && cards.length) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'rev-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Review ${i + 1}`);
      dot.addEventListener('click', () => goRev(i));
      dotsWrap.appendChild(dot);
    });
  }

  const getVisibleCount = () => {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  };

  const goRev = (i) => {
    if (!track || !cards.length) return;
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    revIndex = Math.min(Math.max(i, 0), maxIndex);
    const cardW = cards[0].offsetWidth + 24; // gap=24px
    track.scrollTo({ left: revIndex * cardW, behavior: 'smooth' });

    dotsWrap?.querySelectorAll('.rev-dot').forEach((d, di) => {
      d.classList.toggle('active', di === revIndex);
    });
    clearTimeout(autoRevTimer);
    autoRevTimer = setTimeout(autoRev, 4000);
  };

  const autoRev = () => {
    const visible = getVisibleCount();
    const next = revIndex + 1 >= cards.length - visible + 1 ? 0 : revIndex + 1;
    goRev(next);
  };

  document.getElementById('revPrev')?.addEventListener('click', () => goRev(revIndex - 1));
  document.getElementById('revNext')?.addEventListener('click', () => goRev(revIndex + 1));

  autoRevTimer = setTimeout(autoRev, 4000);

  /* ══════════════════════════════════
     FAQ ACCORDION
  ══════════════════════════════════ */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ══════════════════════════════════
     QUICK BOOKING FORM
  ══════════════════════════════════ */
  const quickBookForm = document.getElementById('quickBookForm');
  quickBookForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin = document.getElementById('bCheckin').value;
    const checkout = document.getElementById('bCheckout').value;
    const guests = document.getElementById('bGuests').value;
    const room = document.getElementById('bRoom').options[document.getElementById('bRoom').selectedIndex].text;

    if (!checkin || !checkout) {
      showToast('Please select both check-in and check-out dates.');
      return;
    }
    if (new Date(checkout) <= new Date(checkin)) {
      showToast('Check-out must be after check-in date.');
      return;
    }

    // Open WhatsApp with pre-filled message
    const msg = encodeURIComponent(
      `Hello! I'd like to book a room.\n\n` +
      `Room: ${room}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/919007062180?text=${msg}`, '_blank');
  });

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bCheckin')?.setAttribute('min', today);
  document.getElementById('bCheckout')?.setAttribute('min', today);
  document.getElementById('checkin')?.setAttribute('min', today);
  document.getElementById('checkout')?.setAttribute('min', today);

  /* ══════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════ */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      form.style.animation = 'shake .4s ease';
      setTimeout(() => form.style.animation = '', 500);
      return;
    }

    const btn = form.querySelector('.form-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      showToast('Message sent! We\'ll reply on WhatsApp shortly. 🙏');
    }, 1400);
  });

  /* ══════════════════════════════════
     TOAST HELPER
  ══════════════════════════════════ */
  const toastEl = document.getElementById('toast');
  let toastTimer;

  const showToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  };

  /* ══════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ══════════════════════════════════
     RATING BARS — animate in view
  ══════════════════════════════════ */
  const ratingSection = document.querySelector('.rating-summary');
  if (ratingSection) {
    const rObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.rbar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 100);
        });
        rObs.disconnect();
      }
    }, { threshold: .3 });
    rObs.observe(ratingSection);
  }

  /* ══════════════════════════════════
     3D TILT — Contact Cards
  ══════════════════════════════════ */
  document.querySelectorAll('.tilt-card').forEach(card => {
    const glow = card.querySelector('.cinfo-glow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to +1
      const dy = (e.clientY - cy) / (rect.height / 2);   // -1 to +1
      const tiltX = dy * -10;   // rotate around X axis
      const tiltY = dx * 10;   // rotate around Y axis

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03,1.03,1.03)`;

      // move glow to cursor position
      if (glow) {
        const gx = e.clientX - rect.left;
        const gy = e.clientY - rect.top;
        glow.style.left = `${gx}px`;
        glow.style.top = `${gy}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });

  /* ══════════════════════════════════════
     3D TILT — Review Cards (magnetic tilt)
  ══════════════════════════════════════ */
  document.querySelectorAll('.rev-3d-card').forEach(card => {
    const glow = card.querySelector('.rev-card-glow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -8;
      const tiltY = dx * 8;
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1.02) translateZ(10px)`;
      if (glow) {
        glow.style.left = `${e.clientX - rect.left}px`;
        glow.style.top = `${e.clientY - rect.top}px`;
      }
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform .12s linear, border-color .4s, box-shadow .4s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94), border-color .4s, box-shadow .4s';
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0)';
    });
  });

  /* ══════════════════════════════════════
     REVIEWS SECTION — Floating Particles
  ══════════════════════════════════════ */
  const revParticles = document.getElementById('revParticles');
  if (revParticles) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'rev-particle';
      const size = (Math.random() * 4 + 2).toFixed(1);
      const x = (Math.random() * 100).toFixed(1);
      const yBase = (Math.random() * 100).toFixed(1);
      const dur = (Math.random() * 6 + 5).toFixed(1);
      const delay = (Math.random() * 8).toFixed(1);
      p.style.cssText = `width:${size}px;height:${size}px;left:${x}%;top:${yBase}%;--dur:${dur}s;--delay:${delay}s;`;
      revParticles.appendChild(p);
    }
  }

  /* ══════════════════════════════════
     DYNAMIC FOOTER YEAR
  ══════════════════════════════════ */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

}); // end DOMContentLoaded

/* ─── CSS for shake ─── */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%      { transform:translateX(-8px); }
    40%      { transform:translateX(8px); }
    60%      { transform:translateX(-6px); }
    80%      { transform:translateX(6px); }
  }
`;
document.head.appendChild(style);
