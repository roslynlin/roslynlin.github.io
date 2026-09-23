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
  document.querySelectorAll('a, button, .comp-card, .media-card, .work-row, .t-item, .extra-card, .ch, .contact-tag, .fp-link, .ghost-cta, .ep-card, .sum-card, .year-card').forEach((el) => {
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

  /* ---------- 14. More Craft lightbox — click-to-show preview ---------- */
  // Inline SVG previews for each More Craft work item.
  // Visual compositions reflect the spirit of each piece; not photos.
  const EX_PREVIEWS = {
    'sribd-deck': {
      tag: 'Visual Identity · Deck',
      title: 'SRIBD 机构简介',
      desc: 'SRIBD 品牌介绍演示设计与撰写 — 主视觉 / 版式 / 信息图 / 院长致辞页',
      foot: '受众：政府 · 学界 · 产业合作',
      svg: `
        <defs>
          <linearGradient id="sribdSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#1F5D3A"/><stop offset="1" stop-color="#2B1810"/>
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#sribdSky)"/>
        <g opacity="0.18" stroke="#D9A521" stroke-width="1">
          ${Array.from({length: 14}, (_, i) => `<line x1="${i*120}" y1="0" x2="${i*120+400}" y2="900"/>`).join('')}
        </g>
        <g font-family="Georgia, serif" fill="#FAF1E0">
          <text x="80" y="140" font-size="22" letter-spacing="6" fill="#D9A521">SRIBD · EST. 2016</text>
          <text x="80" y="320" font-size="120" font-weight="700" letter-spacing="-3">深圳数字</text>
          <text x="80" y="460" font-size="120" font-weight="700" letter-spacing="-3">技术研究院</text>
          <text x="80" y="540" font-size="34" font-style="italic" fill="#E5D2B0">Shenzhen Research Institute</text>
          <text x="80" y="585" font-size="34" font-style="italic" fill="#E5D2B0">of Big Data</text>
        </g>
        <g transform="translate(80, 700)" font-family="-apple-system, sans-serif" fill="#E5D2B0" font-size="18">
          <text x="0" y="0" letter-spacing="3">CROSS-DISCIPLINARY RESEARCH · POLICY · INDUSTRY</text>
        </g>
        <g transform="translate(1180, 200)">
          <circle r="180" fill="none" stroke="#D9A521" stroke-width="1.5" opacity="0.6"/>
          <circle r="140" fill="none" stroke="#D9A521" stroke-width="1" opacity="0.5"/>
          <circle r="100" fill="none" stroke="#D9A521" stroke-width="1" opacity="0.4"/>
          <circle cx="0" cy="0" r="6" fill="#D9A521"/>
          <text x="0" y="220" font-family="Georgia, serif" font-style="italic" font-size="22" fill="#D9A521" text-anchor="middle">a hub where data meets society</text>
        </g>
        <g transform="translate(80, 800)" font-family="sans-serif" font-size="14" fill="#FAF1E0" opacity="0.5">
          <text>Roslyn Lin · Brand & Deck Design · 2024</text>
        </g>
      `
    },
    'qq-dance': {
      tag: 'Cross-Industry Marketing · Deck',
      title: 'QQ 炫舞 × SRIBD 跨界营销',
      desc: '游戏 IP × 学术机构跨界营销方案与演示设计 — 创意 / 媒介 / 视觉 / 落地',
      foot: '受众：腾讯互娱 · 学术用户 · 大众传播',
      svg: `
        <rect width="1600" height="900" fill="#2B1810"/>
        <g opacity="0.3">
          <circle cx="200" cy="200" r="220" fill="#A83246"/>
          <circle cx="1400" cy="700" r="280" fill="#D9A521"/>
          <circle cx="800" cy="450" r="180" fill="#1F5D3A"/>
        </g>
        <g font-family="Georgia, serif" fill="#FAF1E0">
          <text x="80" y="120" font-size="20" letter-spacing="5" fill="#D9A521">CROSS-OVER · 2023</text>
          <text x="80" y="280" font-size="80" font-weight="700" letter-spacing="-2">当音乐节奏</text>
          <text x="80" y="370" font-size="80" font-weight="700" letter-spacing="-2" fill="#D9A521">遇见数据科学</text>
          <text x="80" y="500" font-size="32" font-style="italic" fill="#E5D2B0">QQ炫舞 × SRIBD</text>
          <text x="80" y="540" font-size="22" font-family="sans-serif" fill="#E5D2B0" opacity="0.85">游戏 IP × 科研机构 联名跨界 · 让硬核研究变得可被感知</text>
        </g>
        <g transform="translate(960, 180)" font-family="sans-serif" fill="#FAF1E0">
          <rect x="0" y="0" width="540" height="60" fill="none" stroke="#D9A521" stroke-width="1" opacity="0.5"/>
          <text x="20" y="38" font-size="20" font-weight="600">① 概念 · 当 AI 进入节奏游戏</text>
          <rect x="0" y="80" width="540" height="60" fill="none" stroke="#D9A521" stroke-width="1" opacity="0.5"/>
          <text x="20" y="118" font-size="20" font-weight="600">② 内容 · 游戏内 SRIBD 主题关卡</text>
          <rect x="0" y="160" width="540" height="60" fill="none" stroke="#D9A521" stroke-width="1" opacity="0.5"/>
          <text x="20" y="198" font-size="20" font-weight="600">③ 传播 · KOL + 短视频 + 线下快闪</text>
          <rect x="0" y="240" width="540" height="60" fill="none" stroke="#D9A521" stroke-width="1" opacity="0.5"/>
          <text x="20" y="278" font-size="20" font-weight="600">④ 转化 · 玩家调研 → 报名科研体验</text>
        </g>
        <g transform="translate(80, 820)" font-family="sans-serif" font-size="14" fill="#FAF1E0" opacity="0.5">
          <text>Roslyn Lin · Proposal & Deck Design · 2023</text>
        </g>
      `
    },
    'whitepaper': {
      tag: 'Whitepaper · Layout & Editorial',
      title: '行业白皮书 · 设计与内容',
      desc: '行业白皮书设计、内容策划与版面排版 — 从数据图表到长文阅读节奏的统一把控',
      foot: '成品：65 页 · 320+ 数据图 · A4 / iPad 双版',
      svg: `
        <rect width="1600" height="900" fill="#F4E8D6"/>
        <rect x="60" y="60" width="700" height="780" fill="#FAF1E0" stroke="#C8A878"/>
        <rect x="60" y="60" width="700" height="120" fill="#1F5D3A"/>
        <g font-family="Georgia, serif" fill="#FAF1E0">
          <text x="100" y="115" font-size="14" letter-spacing="4">WHITEPAPER · 2024</text>
          <text x="100" y="160" font-size="36" font-weight="600">AI 产业落地观察</text>
        </g>
        <g font-family="Georgia, serif" fill="#2B1810">
          <text x="100" y="240" font-size="60" font-weight="700">数据驱动的</text>
          <text x="100" y="310" font-size="60" font-weight="700" fill="#C24A1E">下一站</text>
          <line x1="100" y1="350" x2="280" y2="350" stroke="#C24A1E" stroke-width="3"/>
          <text x="100" y="400" font-size="16" font-style="italic" fill="#5A3D28">Industry × Research × Policy</text>
          <text x="100" y="440" font-size="14" font-family="sans-serif" fill="#5A3D28">一份关于中国 AI 产业落地的调研报告</text>
        </g>
        <!-- mini bar chart -->
        <g transform="translate(100, 540)">
          <text x="0" y="-10" font-family="sans-serif" font-size="12" fill="#8A6644">CHAPTERS · 8</text>
          ${[60, 90, 75, 110, 50, 95, 130, 70].map((h, i) => `
            <rect x="${i*70}" y="${130-h}" width="40" height="${h}" fill="${['#C24A1E','#D9A521','#1F5D3A','#A83246','#6B3A6B','#C24A1E','#1F5D3A','#D9A521'][i]}" opacity="0.85"/>
            <text x="${i*70+20}" y="160" font-family="sans-serif" font-size="11" fill="#5A3D28" text-anchor="middle">${i+1}</text>
          `).join('')}
        </g>
        <!-- right page -->
        <rect x="800" y="60" width="700" height="780" fill="#FAF1E0" stroke="#C8A878"/>
        <g font-family="Georgia, serif" fill="#2B1810">
          <text x="840" y="120" font-size="24" font-weight="600">02 · 数据图谱</text>
          <text x="840" y="148" font-size="13" font-style="italic" fill="#8A6644">A mapping of China's AI industry</text>
        </g>
        <!-- network diagram -->
        <g transform="translate(1150, 400)" opacity="0.85">
          ${[
            [0,0,40,'#C24A1E'], [-200,-120,30,'#1F5D3A'], [180,-150,28,'#D9A521'], [-220,80,32,'#A83246'], [210,110,34,'#6B3A6B'], [80,-200,22,'#1F5D3A'], [-100,200,26,'#C24A1E'], [160,180,24,'#D9A521']
          ].map(([x,y,r,c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity="0.7"/>`).join('')}
          ${Array.from({length:8}).map((_,i) => `<line x1="0" y1="0" x2="${[0,-200,180,-220,210,80,-100,160][i]}" y2="${[0,-120,-150,80,110,-200,200,180][i]}" stroke="#8A6644" stroke-width="0.8" opacity="0.5"/>`).join('')}
        </g>
        <g transform="translate(840, 720)" font-family="sans-serif" font-size="13" fill="#5A3D28">
          <text>· 65 页正文</text>
          <text y="22">· 320+ 数据图</text>
          <text y="44">· 双版（印刷 + 屏幕）</text>
        </g>
        <g transform="translate(60, 870)" font-family="sans-serif" font-size="12" fill="#8A6644">
          <text>Roslyn Lin · Design · Content · Layout · 2024</text>
        </g>
      `
    },
    'acegpt': {
      tag: 'Branding · Short Film',
      title: '《ACEGPT》品牌视觉与展示',
      desc: '从 0 到 1 设计品牌标识、制作项目短片 — 用于深圳市领导带队在沙特相关领导前展示',
      foot: '舞台：深圳 · 利雅得 · 双城同屏',
      svg: `
        <defs>
          <linearGradient id="aceBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#0E1B3A"/><stop offset="1" stop-color="#3B0F2D"/>
          </linearGradient>
          <linearGradient id="aceStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#5BC0F8"/><stop offset="1" stop-color="#FF8A3C"/>
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#aceBg)"/>
        <g opacity="0.16" stroke="#5BC0F8" stroke-width="0.6">
          ${Array.from({length:24}, (_, i) => `<line x1="0" y1="${i*40}" x2="1600" y2="${i*40}"/>`).join('')}
        </g>
        <!-- big ACE -->
        <g font-family="Georgia, serif" font-weight="800" letter-spacing="-6" fill="url(#aceStroke)">
          <text x="800" y="440" font-size="260" text-anchor="middle">ACE</text>
        </g>
        <g font-family="Georgia, serif" fill="#FAF1E0">
          <text x="800" y="540" font-size="72" font-weight="500" text-anchor="middle" letter-spacing="6">GPT</text>
        </g>
        <g transform="translate(800, 660)" font-family="Georgia, serif" fill="#FAF1E0" text-anchor="middle">
          <text font-size="22" font-style="italic" opacity="0.85">沙特 · 深圳 · 双城同屏</text>
        </g>
        <g transform="translate(80, 100)" font-family="sans-serif" fill="#5BC0F8" font-size="14" letter-spacing="4">
          <text>PROJECT · ACEGPT</text>
        </g>
        <g transform="translate(80, 800)" font-family="sans-serif" font-size="14" fill="#E5D2B0" opacity="0.5">
          <text>Branding · Logo · Short Film · On-stage Visual</text>
        </g>
        <g transform="translate(1520, 800)" font-family="sans-serif" font-size="14" fill="#E5D2B0" opacity="0.5" text-anchor="end">
          <text>Roslyn Lin · 2023</text>
        </g>
      `
    },
    'kernelcat': {
      tag: 'Video Interview · Tech Founder',
      title: '人物访谈 · KernelCAT',
      desc: 'AI 计算加速创业专访 — KernelCAT，10 个月融资近亿元',
      foot: '视频：12 min · 双机位 · 调色',
      svg: `
        <rect width="1600" height="900" fill="#1A1208"/>
        <!-- stage lights -->
        <g opacity="0.18">
          <ellipse cx="800" cy="500" rx="900" ry="220" fill="#D9A521"/>
        </g>
        <!-- interviewer/silhouette -->
        <g transform="translate(800, 380)">
          <ellipse cx="0" cy="0" rx="90" ry="110" fill="#2B1810"/>
          <path d="M -180 280 Q 0 180 180 280 Z" fill="#2B1810"/>
          <!-- rim light -->
          <path d="M -90 -80 Q -120 0 -80 110" stroke="#D9A521" stroke-width="3" fill="none" opacity="0.85"/>
          <path d="M 90 -80 Q 120 0 80 110" stroke="#D9A521" stroke-width="3" fill="none" opacity="0.85"/>
        </g>
        <!-- microphone -->
        <g transform="translate(680, 540)">
          <rect x="0" y="0" width="6" height="100" fill="#8A6644"/>
          <circle cx="3" cy="-10" r="14" fill="#2B1810" stroke="#D9A521" stroke-width="2"/>
        </g>
        <!-- title -->
        <g font-family="Georgia, serif" fill="#FAF1E0">
          <text x="80" y="120" font-size="16" letter-spacing="5" fill="#D9A521">Tech Founder · Interview · 2024</text>
          <text x="80" y="220" font-size="60" font-weight="700" letter-spacing="-2">KernelCAT</text>
          <text x="80" y="280" font-size="34" font-style="italic" fill="#E5D2B0">AI 计算加速创业专访</text>
          <text x="80" y="320" font-size="20" font-family="sans-serif" fill="#E5D2B0" opacity="0.7">10 个月融资近亿元</text>
        </g>
        <!-- timeline bar -->
        <g transform="translate(80, 480)">
          <text font-family="sans-serif" font-size="12" fill="#8A6644">TIMELINE</text>
          <line x1="0" y1="20" x2="1440" y2="20" stroke="#8A6644" stroke-width="1" opacity="0.5"/>
          ${[
            ['idea', 80],
            ['seed', 320],
            ['kernel', 560],
            ['demo', 800],
            ['series', 1040],
            ['ship', 1280]
          ].map(([n, x], i) => `
            <circle cx="${x}" cy="20" r="6" fill="#D9A521"/>
            <text x="${x}" y="50" font-family="sans-serif" font-size="12" fill="#FAF1E0" text-anchor="middle" opacity="0.7">${n}</text>
          `).join('')}
        </g>
        <g transform="translate(80, 760)" font-family="sans-serif" font-size="14" fill="#E5D2B0" opacity="0.5">
          <text>Roslyn Lin · Interview · Edit · Color · 2024</text>
        </g>
      `
    },
    'brand-film': {
      tag: 'Brand Film · 致广大而敬精微',
      title: '品牌宣传片 · SRIBD',
      desc: 'SRIBD 品牌宣传片全流程主创（策划 · 脚本 · 视觉） — 让"数据改变城市"被看见',
      foot: '影片：2:30 · 8 段 · 调色 · 配乐',
      svg: `
        <defs>
          <linearGradient id="filmG1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#2A1B12"/><stop offset="1" stop-color="#0B0805"/>
          </linearGradient>
          <linearGradient id="filmG2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#A83246" stop-opacity="0.95"/>
            <stop offset="0.5" stop-color="#D9A521" stop-opacity="0.75"/>
            <stop offset="1" stop-color="#1F5D3A" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#filmG1)"/>
        <!-- city silhouette -->
        <g transform="translate(0, 600)" fill="#0B0805">
          ${[
            [0,0,80,80],[80,30,60,50],[140,10,100,70],[240,40,70,40],[310,0,90,80],
            [400,20,60,60],[460,0,120,80],[580,30,80,50],[660,10,90,70],[750,40,60,40],
            [810,0,100,80],[910,20,80,60],[990,0,90,80],[1080,30,70,50],[1150,10,80,70],
            [1230,40,60,40],[1290,0,90,80],[1380,20,70,60],[1450,0,150,80]
          ].map(([x,y,w,h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}
        </g>
        <!-- horizon glow -->
        <ellipse cx="800" cy="620" rx="900" ry="120" fill="url(#filmG2)" opacity="0.35"/>
        <!-- big chinese title -->
        <g font-family="'Noto Serif SC', Georgia, serif" fill="#FAF1E0">
          <text x="800" y="300" font-size="120" font-weight="600" text-anchor="middle" letter-spacing="40">致广大</text>
          <text x="800" y="430" font-size="120" font-weight="600" text-anchor="middle" letter-spacing="40" fill="#D9A521">而敬精微</text>
        </g>
        <!-- subtitle -->
        <g transform="translate(800, 510)" font-family="Georgia, serif" fill="#E5D2B0" text-anchor="middle">
          <text font-size="22" font-style="italic">Branding Film · SRIBD</text>
        </g>
        <!-- film leader frames -->
        <g opacity="0.5">
          <line x1="0" y1="80" x2="1600" y2="80" stroke="#FAF1E0" stroke-width="1"/>
          <line x1="0" y1="820" x2="1600" y2="820" stroke="#FAF1E0" stroke-width="1"/>
        </g>
        <g transform="translate(80, 100)" font-family="sans-serif" font-size="12" fill="#D9A521" letter-spacing="4">
          <text>REEL · 01 · 30</text>
        </g>
        <g transform="translate(80, 860)" font-family="sans-serif" font-size="14" fill="#E5D2B0" opacity="0.5">
          <text>Roslyn Lin · Producer · Scriptwriter · Visual Director · 2024</text>
        </g>
        <g transform="translate(1520, 100)" font-family="sans-serif" font-size="12" fill="#D9A521" letter-spacing="3" text-anchor="end">
          <text>TIME · 2:30 · COLOR · MUSIC</text>
        </g>
      `
    }
  };

  // Build the lightbox DOM once
  const lb = document.createElement('div');
  lb.className = 'ex-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <div class="ex-lightbox-inner" role="document">
      <button class="ex-lb-close" aria-label="关闭预览">×</button>
      <div class="ex-lb-canvas"></div>
      <div class="ex-lb-meta">
        <span class="ex-lb-tag"></span>
        <h3 class="ex-lb-title"></h3>
        <p class="ex-lb-desc"></p>
        <div class="ex-lb-foot"></div>
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const lbCanvas = lb.querySelector('.ex-lb-canvas');
  const lbTitle = lb.querySelector('.ex-lb-title');
  const lbDesc = lb.querySelector('.ex-lb-desc');
  const lbTag = lb.querySelector('.ex-lb-tag');
  const lbFoot = lb.querySelector('.ex-lb-foot');

  function openLightbox(key, sourceEl) {
    const data = EX_PREVIEWS[key];
    if (!data) return;
    // Build named SVG with consistent viewBox
    const NS = 'http://www.w3.org/2000/svg';
    const svgEl = document.createElementNS(NS, 'svg');
    svgEl.setAttribute('viewBox', '0 0 1600 900');
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svgEl.innerHTML = data.svg;
    lbCanvas.innerHTML = '';
    lbCanvas.appendChild(svgEl);
    lbTag.textContent = data.tag;
    lbTitle.textContent = data.title;
    lbDesc.textContent = data.desc;
    lbFoot.textContent = data.foot;
    lb.classList.add('is-open');
    document.body.classList.add('lb-open');
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.classList.remove('lb-open');
  }

  // Click on each extra-list item → open preview
  document.querySelectorAll('.extra-list li[data-preview]').forEach((li) => {
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(li.dataset.preview, li);
    });
  });
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
  lb.querySelector('.ex-lb-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
  });

  /* ---------- 15. WeChat QR lightbox ---------- */
  const qrLb = document.createElement('div');
  qrLb.className = 'qr-lightbox';
  qrLb.setAttribute('role', 'dialog');
  qrLb.setAttribute('aria-modal', 'true');
  qrLb.innerHTML = `
    <div class="qr-lightbox-inner" role="document">
      <button class="qr-lightbox-close" aria-label="关闭">×</button>
      <img class="qr-lightbox-img" src="assets/wechat-qr.png" alt="Roslyn Lin 微信二维码">
      <p class="qr-lightbox-cap"><strong>WeChat</strong>镕姑凉 · 广东汕头 · 扫一扫加我</p>
    </div>
  `;
  document.body.appendChild(qrLb);
  function openQr() { qrLb.classList.add('is-open'); document.body.classList.add('lb-open'); }
  function closeQr() { qrLb.classList.remove('is-open'); document.body.classList.remove('lb-open'); }
  document.querySelectorAll('.qr-trigger').forEach((b) => b.addEventListener('click', openQr));
  qrLb.addEventListener('click', (e) => { if (e.target === qrLb) closeQr(); });
  qrLb.querySelector('.qr-lightbox-close').addEventListener('click', closeQr);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrLb.classList.contains('is-open')) closeQr();
  });

  /* ---------- 16. Console signature ---------- */
  console.log(
    '%c Roslyn Lin · Portfolio %c v3 · active editorial ',
    'background:#C24A1E;color:#FAF1E0;padding:6px 10px;font-family:Georgia,serif;',
    'background:#1F5D3A;color:#FAF1E0;padding:6px 10px;'
  );

})();