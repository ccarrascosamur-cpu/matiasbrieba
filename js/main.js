// ── MAIN.JS ── Scroll-driven video hero + all site logic

document.addEventListener('DOMContentLoaded', () => {

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

  // ── HERO BACKGROUND from first featured project ──
  const hbg = document.getElementById('hbg');
  if (hbg) {
    const d = getMBData();
    const featured = d.projects.find(p => p.featured && (p.coverImg || p.img));
    const imgSrc = featured ? fixImgUrl(featured.coverImg || featured.img) : '';
    if (imgSrc) hbg.style.backgroundImage = `url('${imgSrc}')`;
  }

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

  // ── RE-RENDER WHEN REMOTE DATA ARRIVES ──
  window.addEventListener('mb:data-updated', () => {
    const d = getMBData();
    if (hbg) {
      const featured = d.projects.find(p => p.featured && (p.coverImg || p.img));
      const imgSrc = featured ? fixImgUrl(featured.coverImg || featured.img) : '';
      if (imgSrc) hbg.style.backgroundImage = `url('${imgSrc}')`;
    }
    if (bento) {
      const activeBtn = document.querySelector('.fb.on');
      renderBento(activeBtn ? (activeBtn.dataset.filter || 'all') : 'all');
    }
    if (clientsRow) renderClients();
    const sp = document.getElementById('statProjects');
    const sc = document.getElementById('statClients');
    if (sp) sp.innerHTML = `${d.projects.length}<sub>+</sub>`;
    if (sc) sc.innerHTML  = `${d.clients.length}<sub>+</sub>`;
  });

  // ── SCROLL-DRIVEN VIDEO HERO ──
  initVideoHero();
});

// ════════════════════════════════════════════
//  SCROLL-DRIVEN VIDEO HERO
//
//  .video-pin = 200vh (pin zone)
//  Scroll progress p: 0 → 1 across 100vh travel
//
//  p 0.00 → 1.00  video scrubs from 0 to end
//  p 0.20 → 0.50  hero text fades IN
//  p 0.50 → 0.72  hero text fades OUT + lifts
//  p 0.62 → 1.00  page-cover slides UP covering video
// ════════════════════════════════════════════
function initVideoHero() {
  const pin     = document.getElementById('videoPin');
  const video   = document.getElementById('heroVideo');
  const content = document.getElementById('heroContent');
  const cover   = document.getElementById('pageCover');

  if (!pin || !video) return;

  video.load();

  function update() {
    const pinTop  = pin.offsetTop;
    const vh      = window.innerHeight;
    const travel  = pin.offsetHeight - vh;   // 100vh
    const p       = Math.max(0, Math.min(1, (window.scrollY - pinTop) / travel));

    // VIDEO SCRUB
    if (video.readyState >= 2 && video.duration) {
      video.currentTime = p * video.duration;
    }

    // TEXT: fade in 0.20→0.50, fade out 0.50→0.72
    let op = 0, ty = 16;
    if (p >= 0.20 && p < 0.50) {
      const t = (p - 0.20) / 0.30;
      op = t; ty = 16 * (1 - t);
    } else if (p >= 0.50 && p < 0.72) {
      const t = (p - 0.50) / 0.22;
      op = 1 - t; ty = -10 * t;
    }
    if (content) {
      content.style.opacity   = op.toFixed(3);
      content.style.transform = `translateY(${ty.toFixed(1)}px)`;
    }

    // COVER: slide up 0.62→1.00
    let cty = 100;
    if (p >= 0.62) {
      const t = (p - 0.62) / 0.38;
      cty = 100 * (1 - t * t);   // ease-in
    }
    if (cover) cover.style.transform = `translateY(${cty.toFixed(2)}%)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  // Also run on video metadata load in case duration wasn't available yet
  video.addEventListener('loadedmetadata', update);
  update();
}

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
    const imgSrc = typeof fixImgUrl === 'function' ? fixImgUrl(p.coverImg || p.img) : (p.coverImg || p.img);
    return `
      <a class="gi ${cls} rv" href="${href}" target="_blank"
         style="text-decoration:none;" data-cat="${p.cat}">
        ${imgSrc ? `<img src="${imgSrc}" alt="${p.name}" loading="${i < 3 ? 'eager' : 'lazy'}" onerror="this.style.display='none'"/>` : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a1a1a 0%,#0f0f0f 100%);"></div>`}
        <div class="giov">
          <p class="gcat">${catLabel(p.cat)}</p>
          <p class="gname">${p.name}</p>
          <p class="gyr">${p.year}${p.client && p.client !== p.name ? ' · ' + p.client : ''}</p>
        </div>
        <div class="gbadge">
          <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </div>
        <span class="gnum">0${i + 1}</span>
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
