// ── PORTFOLIO.JS ──

document.addEventListener('DOMContentLoaded', () => {
  let activeFilter = 'all';
  renderPortfolio(activeFilter);

  document.querySelectorAll('.pf-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('.pf-btn').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      activeFilter = b.dataset.filter||'all';
      renderPortfolio(activeFilter);
    });
  });

  window.addEventListener('mb:data-updated', () => {
    renderPortfolio(activeFilter);
  });
});

function renderPortfolio(filter){
  const grid = document.getElementById('portGrid');
  const cntEl = document.getElementById('port-count');
  if(!grid) return;
  const d = getMBData();
  let items = d.projects;
  if(filter !== 'all') items = items.filter(p=>p.cat===filter);
  if(cntEl) cntEl.textContent = `${items.length} proyectos`;

  grid.innerHTML = items.map((p,i)=>{
    const href = `project.html?id=${p.id}`;
    const imgSrc = typeof fixImgUrl === 'function' ? fixImgUrl(p.img) : p.img;
    return `
      <a class="pg-item rv" href="${href}" target="_blank"
         style="text-decoration:none;">
        ${imgSrc?`<img src="${imgSrc}" alt="${p.name}" loading="${i<6?'eager':'lazy'}" onerror="this.style.display='none'"/>`:''}
        <div class="pg-over" style="${!imgSrc?'opacity:1;background:linear-gradient(to top,rgba(8,8,8,.85) 0%,rgba(8,8,8,.2) 100%);':''}">
          <p class="pg-cat">${catLabel(p.cat)}</p>
          <p class="pg-name">${p.name}</p>
          <p class="pg-yr">${p.year}${p.client&&p.client!==p.name?' · '+p.client:''}</p>
        </div>
      </a>
    `;
  }).join('');

  document.querySelectorAll('#portGrid .rv').forEach(el=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});
    },{threshold:.05});
    obs.observe(el);
  });
}

function catLabel(cat){
  return {film:'Film',foto:'Fotografía',corp:'Corporativo',deporte:'Deportes'}[cat]||cat;
}
