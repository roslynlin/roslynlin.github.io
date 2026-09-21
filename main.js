/* ============================================================
   ROSLYN LIN · PORTFOLIO  v3 — ACTIVE INTERACTIONS
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Topbar scroll state ---------- */
  const topbar = document.querySelector('.topbar');
  const onScroll = () => {
    topbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Custom cursor ---------- */
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  // Tighter lerp + transform3d for snappier feel
  (function loop() {
    cx += (tx - cx) * 0.5;
    cy += (ty - cy) * 0.5;
    cursor.style.transform = `translate3d(${cx - 11}px, ${cy - 11}px, 0)`;
    requestAnimationFrame(loop);
  })();
  // Snap distance check — if far, jump instantly to avoid lag feel
  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    if (Math.hypot(dx, dy) > 180) {
      cx = e.clientX;
      cy = e.clientY;
    }
  });
  // Hover state
  document.querySelectorAll('a, button, .comp-card, .media-card, .work-row, .t-item, .extra-card, .ch, .contact-tag, .fp-link, .ghost-cta').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  /* ---------- 3. Reveal on scroll ---------- */
  const revealTargets = [
    '.hero-meta', '.hero-title', '.hero-bottom',
    '.about-main > *', '.about-side > *',
    '.stat-row',
    '.comp-card',
    '.featured-project',
    '.work-row',
    '.media-card', '.media-quote',
    '.t-item',
    '.extra-card',
    '.contact-title', '.contact-actions', '.contact-foot',
    '.lead-text',
    '.sticker'
  ];
  const allReveal = document.querySelectorAll(revealTargets.join(','));
  allReveal.forEach((el, i) => {
    const useRotate = el.classList.contains('comp-card') || el.classList.contains('extra-card') || el.classList.contains('featured-project');
    el.classList.add(useRotate ? 'reveal-rotate' : 'reveal');
    el.style.transitionDelay = `${Math.min(i * 0.04, 0.6)}s`;
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  allReveal.forEach((el) => io.observe(el));

  /* ---------- 4. Number counter ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 4);
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const v = 0 + (target - 0) * ease(p);
          el.textContent = v.toLocaleString('en-US', { maximumFractionDigits: 0 }) + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- 5. Magnetic buttons ---------- */
  document.querySelectorAll('.ghost-cta, .fp-link').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) rotate(${x * 0.04}deg)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---------- 6. Poster parallax (stronger) ---------- */
  document.querySelectorAll('.fp-poster').forEach((p) => {
    const wrap = p.parentElement;
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      p.style.transform = `translate(${x * 14}px, ${y * 14}px) rotate(${x * 2.5}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      p.style.transform = '';
    });
  });

  /* ---------- 7. Scroll parallax on portfolio sticker ---------- */
  const stickerPortfolio = document.querySelector('.sticker-portfolio');
  let raf = null;
  const parallax = () => {
    const y = window.scrollY;
    if (stickerPortfolio) {
      stickerPortfolio.style.transform = `rotate(8deg) translateY(${y * -0.1}px)`;
    }
    raf = null;
  };
  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(parallax);
  }, { passive: true });

  /* ---------- 8. Smooth scroll with offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- 9. Active section indicator ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const navIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((s) => navIo.observe(s));

  /* ---------- 10. Hero title char stagger (per line) ---------- */
  const words = document.querySelectorAll('.hero-title .word');
  // Preserve final rotation for line-4 (set in CSS via parent .line-4)
  words.forEach((w, i) => {
    const parent = w.closest('.line');
    const isLast = parent && parent.classList.contains('line-4');
    w.style.display = 'inline-block';
    w.style.transform = `translateY(110%) rotate(${isLast ? -2 : 2}deg)`;
    w.style.opacity = '0';
    w.style.transition = `transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.13}s, opacity 0.7s ease ${0.15 + i * 0.13}s`;
  });
  // Trigger after a tick
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      words.forEach((w) => {
        const parent = w.closest('.line');
        const isLast = parent && parent.classList.contains('line-4');
        w.style.transform = isLast ? 'translateY(0) rotate(-2deg)' : 'translateY(0) rotate(0)';
        w.style.opacity = '1';
      });
    });
  });

  // Hero English auxiliary line — softer entrance
  const heroEn = document.querySelector('.hero-en');
  if (heroEn) {
    heroEn.style.opacity = '0';
    heroEn.style.transform = 'translateY(20px)';
    heroEn.style.transition = 'opacity 1s ease 1.1s, transform 1s cubic-bezier(0.22,1,0.36,1) 1.1s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroEn.style.opacity = '1';
        heroEn.style.transform = 'translateY(0)';
      });
    });
  }

  /* ---------- 11. Brand mark hover ---------- */
  const brandMark = document.querySelector('.brand-mark');
  if (brandMark) {
    brandMark.addEventListener('mouseenter', () => { brandMark.textContent = '林'; });
    brandMark.addEventListener('mouseleave', () => { brandMark.textContent = 'R'; });
  }

  /* ---------- 12. Tilt on extras + media cards ---------- */
  document.querySelectorAll('.extra-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotate(${x * 2}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 13. Stats panel scroll progress ---------- */
  const stats = document.querySelector('.stats');
  if (stats) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) stats.classList.add('in-view');
        });
      },
      { threshold: 0.3 }
    );
    statObserver.observe(stats);
  }

  /* ---------- 14. Console signature ---------- */
  console.log(
    '%c Roslyn Lin · Portfolio %c v3 · active editorial ',
    'background:#C24A1E;color:#FAF1E0;padding:6px 10px;font-family:Georgia,serif;',
    'background:#1F5D3A;color:#FAF1E0;padding:6px 10px;'
  );

})();