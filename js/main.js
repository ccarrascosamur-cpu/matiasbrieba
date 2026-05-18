// ── MAIN.JS ── Matías Brieba Portfolio Site Logic

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
      nav.classList.toggle('scrolled', scrollY > window.innerHeight * 0.8);
    }, { passive: true });
    const ham    = document.getElementById('hamburger');
    const nlinks = document.getElementById('nlinks');
    if (ham && nlinks) {
      ham.addEventListener('click', () => {
        const isOpen = ham.classList.toggle('open');
        nlinks.classList.toggle('open');
        ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      nlinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          ham.classList.remove('open');
          nlinks.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
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

  // ── RENDER CLIENTS + STATS ──
  const clientsRow = document.getElementById('clientsRow');
  if (clientsRow) renderClients();
  const sp = document.getElementById('statProjects');
  const sc = document.getElementById('statClients');
  if (sp || sc) {
    const d = getMBData();
    if (sp) sp.innerHTML = `${d.projects.length}<sub>+</sub>`;
    if (sc) sc.innerHTML  = `${d.clients.length}<sub>+</sub>`;
  }

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// ── CLIENTS ──
function renderClients() {
  const row = document.getElementById('clientsRow');
  if (!row) return;
  const d   = getMBData();
  const vis = d.clients.filter(c => c.visible);
  row.innerHTML = vis.map(c => {
    const inner = `<span class="cb-item">${c.name}</span>`;
    return c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">${inner}</a>` : inner;
  }).join('');
}

function catLabel(cat) {
  return { film: 'Film', foto: 'Fotografía', corp: 'Corporativo', deporte: 'Deportes' }[cat] || cat;
}
