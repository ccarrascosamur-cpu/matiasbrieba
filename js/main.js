// ── MAIN.JS ── Premium cinematic scroll-driven video hero + site logic

// ════════════════════════════════════════════
//  SMOOTH SCROLL ENGINE (Lerp-based)
//  Replaces native scroll with buttery interpolation
// ════════════════════════════════════════════
class SmoothScroll {
  constructor(options = {}) {
    this.lerp = options.lerp || 0.08;
    this.current = 0;
    this.target = 0;
    this.isScrolling = false;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches;

    // Don't hijack scroll on touch devices — use native
    if (this.isTouch) return;

    this.init();
  }

  init() {
    // Capture wheel events
    window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

    // Capture keyboard
    window.addEventListener('keydown', this.onKeyDown.bind(this));

    // Start raf loop
    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    this.target = Math.max(0, Math.min(maxScroll, this.target + delta));
    this.isScrolling = true;
  }

  onKeyDown(e) {
    const vh = window.innerHeight;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    let delta = 0;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') delta = vh * 0.8;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') delta = -vh * 0.8;
    else if (e.key === ' ') delta = e.shiftKey ? -vh * 0.8 : vh * 0.8;
    else if (e.key === 'Home') { this.target = 0; this.isScrolling = true; return; }
    else if (e.key === 'End') { this.target = maxScroll; this.isScrolling = true; return; }

    if (delta !== 0) {
      e.preventDefault();
      this.target = Math.max(0, Math.min(maxScroll, this.target + delta));
      this.isScrolling = true;
    }
  }

  tick() {
    // Lerp interpolation
    const diff = this.target - this.current;

    if (Math.abs(diff) < 0.5) {
      this.current = this.target;
      this.isScrolling = false;
    } else {
      this.current += diff * this.lerp;
      this.isScrolling = true;
    }

    // Apply scroll
    window.scrollTo(0, this.current);

    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  // Get smoothed scroll position
  get scrollY() {
    return this.isTouch ? window.scrollY : this.current;
  }
}

// ════════════════════════════════════════════
//  CINEMATIC VIDEO HERO ENGINE
//  Scroll-linked playback with lerp smoothing
// ════════════════════════════════════════════
class CinematicHero {
  constructor(videoElement, options = {}) {
    this.video = videoElement;
    this.wrap = document.getElementById('heroVideoWrap');
    this.hero = document.getElementById('cinematicHero');
    this.indicator = document.getElementById('scrollIndicator');

    this.smoothScroll = options.smoothScroll || null;

    // Configuration
    this.config = {
      scaleStart: 1.0,
      scaleEnd: 1.12,
      innerScaleStart: 1.05,
      innerScaleEnd: 1.0,
      parallaxStrength: 0.15,
      lerpFactor: 0.12,
      fadeStart: 0.75,      // When hero starts fading
      fadeEnd: 0.95,        // When hero is fully faded
      ...options
    };

    // State
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.targetScale = this.config.scaleStart;
    this.currentScale = this.config.scaleStart;
    this.targetInnerScale = this.config.innerScaleStart;
    this.currentInnerScale = this.config.innerScaleStart;
    this.targetParallax = 0;
    this.currentParallax = 0;
    this.targetOpacity = 1;
    this.currentOpacity = 1;
    this.videoDuration = 0;
    this.isReady = false;
    this.lastTime = 0;

    this.init();
  }

  init() {
    if (!this.video) return;

    // Preload and prepare video
    this.video.load();

    // Wait for metadata
    const onMeta = () => {
      this.videoDuration = this.video.duration || 0;
      this.isReady = true;
      // Start from beginning
      this.video.currentTime = 0;
    };

    if (this.video.readyState >= 1) {
      onMeta();
    } else {
      this.video.addEventListener('loadedmetadata', onMeta, { once: true });
    }

    // Also handle canplay
    this.video.addEventListener('canplay', () => {
      this.isReady = true;
    }, { once: true });

    // Start animation loop
    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  tick(timestamp) {
    // Calculate scroll progress through hero section
    const heroRect = this.hero.getBoundingClientRect();
    const vh = window.innerHeight;

    // Progress: 0 = top of hero at top of viewport
    //           1 = bottom of hero at top of viewport (scrolled past)
    let rawProgress = 0;
    if (heroRect.bottom > 0 && heroRect.top < vh) {
      rawProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
    } else if (heroRect.top <= 0) {
      rawProgress = 1;
    }

    this.targetProgress = rawProgress;

    // Smooth interpolation (lerp)
    this.currentProgress += (this.targetProgress - this.currentProgress) * this.config.lerpFactor;

    // Calculate derived values with eased curves
    const p = this.currentProgress;
    const eased = this.easeOutCubic(p);

    // Scale: subtle zoom-out as user scrolls (creates depth)
    this.targetScale = this.lerp(this.config.scaleStart, this.config.scaleEnd, p);
    this.currentScale += (this.targetScale - this.currentScale) * this.config.lerpFactor;

    // Inner scale: counter-scale for parallax depth
    this.targetInnerScale = this.lerp(this.config.innerScaleStart, this.config.innerScaleEnd, p);
    this.currentInnerScale += (this.targetInnerScale - this.currentInnerScale) * this.config.lerpFactor;

    // Parallax: subtle vertical shift
    this.targetParallax = p * this.config.parallaxStrength * 100; // pixels
    this.currentParallax += (this.targetParallax - this.currentParallax) * this.config.lerpFactor;

    // Opacity fade as user scrolls past hero
    let targetOp = 1;
    if (p > this.config.fadeStart) {
      targetOp = 1 - ((p - this.config.fadeStart) / (this.config.fadeEnd - this.config.fadeStart));
      targetOp = Math.max(0, targetOp);
    }
    this.targetOpacity = targetOp;
    this.currentOpacity += (this.targetOpacity - this.currentOpacity) * this.config.lerpFactor;

    // Apply video time scrubbing
    if (this.isReady && this.videoDuration > 0) {
      const targetTime = eased * this.videoDuration;
      // Only update if difference is significant (reduces jitter)
      if (Math.abs(this.video.currentTime - targetTime) > 0.016) {
        this.video.currentTime = targetTime;
      }
    }

    // Apply transforms via CSS custom properties (GPU accelerated)
    if (this.wrap) {
      this.wrap.style.setProperty('--hero-scale', this.currentScale.toFixed(4));
      this.wrap.style.transform = `scale(${this.currentScale.toFixed(4)}) translateY(${this.currentParallax.toFixed(2)}px)`;
    }

    if (this.video) {
      this.video.style.setProperty('--video-inner-scale', this.currentInnerScale.toFixed(4));
      this.video.style.transform = `translate(-50%, -50%) scale(${this.currentInnerScale.toFixed(4)})`;
    }

    // Fade overlay and indicator
    if (this.indicator) {
      this.indicator.style.setProperty('--indicator-opacity', this.currentOpacity.toFixed(3));
      this.indicator.style.opacity = this.currentOpacity.toFixed(3);
    }

    // Fade the hero itself for seamless blend
    if (this.hero) {
      this.hero.style.opacity = this.currentOpacity.toFixed(3);
    }

    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

// ════════════════════════════════════════════
//  MAIN INITIALIZATION
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // ── SMOOTH SCROLL (desktop only) ──
  const smoothScroll = new SmoothScroll({ lerp: 0.08 });

  // ── CINEMATIC VIDEO HERO ──
  const heroVideo = document.getElementById('heroVideo');
  const cinematicHero = new CinematicHero(heroVideo, {
    smoothScroll: smoothScroll,
    lerpFactor: 0.1,
    scaleStart: 1.0,
    scaleEnd: 1.08,
    parallaxStrength: 0.12,
    fadeStart: 0.70,
    fadeEnd: 0.95
  });

  // ── CURSOR ──
  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  if (cur && ring) {
    let mx=0, my=0, rx=0, ry=0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function tick() {
      cur.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      rx += (mx - rx) * .11;
      ry += (my - ry) * .11;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    })();
    document.querySelectorAll('a,button,.gi,.pg-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
  }

  // ── NAV SCROLL + HAMBURGER ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', scrollY > window.innerHeight * 1.5);
    }, { passive: true });
    const ham    = document.getElementById('hamburger');
    const nlinks = document.getElementById('nlinks');
    if (ham && nlinks) {
      ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        nlinks.classList.toggle('open');
      });
      nlinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          ham.classList.remove('open');
          nlinks.classList.remove('open');
        });
      });
    }
  }

  // ── SCROLL REVEAL ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  // ── RENDER BENTO + CLIENTS + STATS ──
  const bento = document.getElementById('bento');
  if (bento) renderBento('all');
  const clientsRow = document.getElementById('clientsRow');
  if (clientsRow) renderClients();
  const sp = document.getElementById('statProjects');
  const sc = document.getElementById('statClients');
  if (sp || sc) {
    const d = getMBData();
    if (sp) sp.innerHTML = `${d.projects.length}<sub>+</sub>`;
    if (sc) sc.innerHTML  = `${d.clients.length}<sub>+</sub>`;
  }

  // ── FILTER BUTTONS ──
  document.querySelectorAll('.fb').forEach(b => {
    b.addEventListener('click', () => {
      const parent = b.closest('.filters,.port-filters');
      if (parent) parent.querySelectorAll('.fb').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      if (bento) renderBento(b.dataset.filter || 'all');
    });
  });
});

// ── BENTO ──
function renderBento(filter) {
  const bento = document.getElementById('bento');
  if (!bento) return;
  const d     = getMBData();
  let items   = d.projects.filter(p => p.featured);
  if (filter !== 'all') items = items.filter(p => p.cat === filter);
  if (!items.length) items = d.projects.slice(0, 8);

  const layouts = ['b-hero','b-tall','b-sq','b-sq','b-sq','b-sq','b-wide','b-wide'];

  bento.innerHTML = items.slice(0, 8).map((p, i) => {
    const cls  = layouts[i] || 'b-sq';
    const href = `project.html?id=${p.id}`;
    return `
      <a class="gi ${cls} rv" href="${href}" target="_blank"
         style="text-decoration:none;" data-cat="${p.cat}">
        <img src="${p.img}" alt="${p.name}" loading="${i < 3 ? 'eager' : 'lazy'}"
             onerror="this.style.display='none';this.parentNode.style.background='#1a1a1a'"/>
        <div class="gi-over">
          <p class="gi-cat">${catLabel(p.cat)}</p>
          <p class="gi-name">${p.name}</p>
          <p class="gi-yr">${p.year}${p.client && p.client !== p.name ? ' · ' + p.client : ''}</p>
        </div>
        <div class="gi-badge">
          <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </div>
        <span class="gi-num">0${i + 1}</span>
      </a>`;
  }).join('');

  document.querySelectorAll('#bento .rv').forEach(el => {
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); o.unobserve(e.target); } });
    }, { threshold: .06 });
    o.observe(el);
  });
}

function renderClients() {
  const row = document.getElementById('clientsRow');
  if (!row) return;
  const d   = getMBData();
  const vis = d.clients.filter(c => c.visible);
  row.innerHTML = vis.map(c => {
    const inner = `<span class="cb-item">${c.name}</span>`;
    return c.url ? `<a href="${c.url}" target="_blank" style="text-decoration:none;">${inner}</a>` : inner;
  }).join('');
}

function catLabel(cat) {
  return { film: 'Film', foto: 'Fotografía', corp: 'Corporativo', deporte: 'Deportes' }[cat] || cat;
}
