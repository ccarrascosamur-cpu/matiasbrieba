// ── MB DATA LAYER ──
// Remote-first storage backed by Cloudflare Pages Functions + KV,
// with localStorage used as a client-side cache/fallback.

const MB_KEY = 'mb_portfolio_data';
const MB_API_URL = '/api/data';
const MB_DATA_EVENT = 'mb:data-updated';

const MB_DEFAULT = {
  projects: [
    { id: 1,  order: 1,  name: 'Barra Central',        client: 'Barra Central',        cat: 'film',    year: 2024, img: '', url: '', videoUrl: '', images: [], desc: 'Producción audiovisual para Barra Central.', featured: true },
    { id: 2,  order: 2,  name: 'Monster Energy Chile', client: 'Monster Energy',       cat: 'foto',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/monster-energy-chile', videoUrl: '', images: [], desc: 'Fotografía deportiva y lifestyle para Monster Energy.', featured: true },
    { id: 3,  order: 3,  name: 'Juan Valdez Café',     client: 'Juan Valdez',          cat: 'corp',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/juan-valdez-cafe', videoUrl: '', images: [], desc: 'Fotografía de producto y corporativa para Juan Valdez.', featured: true },
    { id: 4,  order: 4,  name: 'Xclusive Chile',       client: 'Xclusive',             cat: 'foto',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/xclusive-chile', videoUrl: '', images: [], desc: 'Contenido visual para Xclusive Chile.', featured: true },
    { id: 5,  order: 5,  name: 'Nevados de Chillán',   client: 'Nevados de Chillán',   cat: 'deporte', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/nevados-de-chillan', videoUrl: '', images: [], desc: 'Fotografía deportiva en nieve y montaña.', featured: true },
    { id: 6,  order: 6,  name: 'Chile Suplementos',    client: 'Chile Suplementos',    cat: 'corp',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/chile-suplementos', videoUrl: '', images: [], desc: 'Fotografía de producto y corporativa.', featured: true },
    { id: 7,  order: 7,  name: 'Cruzados',             client: 'Cruzados',             cat: 'deporte', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/cruzados', videoUrl: '', images: [], desc: 'Fútbol y deporte de alta emoción.', featured: true },
    { id: 8,  order: 8,  name: 'Tamango Brebajes',     client: 'Tamango',              cat: 'film',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/tamango-brebajes', videoUrl: '', images: [], desc: 'Producción audiovisual y branding visual.', featured: false },
    { id: 9,  order: 9,  name: 'Santiago 2023',        client: 'Personal',             cat: 'foto',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/santiago-2023', videoUrl: '', images: [], desc: 'Reportaje fotográfico de Santiago.', featured: false },
    { id: 10, order: 10, name: 'Bruno Fritsch',        client: 'Bruno Fritsch',        cat: 'foto',    year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/bruno-fristch', videoUrl: 'https://drive.google.com/file/d/1APph2KaLNXxoYQbsQaKQVuUJjfGKWoeq/view?usp=drive_link', videos: ['https://drive.google.com/file/d/1APph2KaLNXxoYQbsQaKQVuUJjfGKWoeq/view?usp=drive_link','https://drive.google.com/file/d/1lQbZVQCDNoR-mdRZc5XjcfMn3xIBZUMt/view?usp=drive_link','https://drive.google.com/file/d/1hbiR2Iam8jmVvj443iAMMewieEj658Wv/view?usp=drive_link'], images: [], desc: 'Retrato y fotografía artística.', featured: false },
  ],
  clients: [
    {id:101, name:'Monster Energy',     url:'',  visible:true},
    {id:102, name:'Juan Valdez',        url:'',  visible:true},
    {id:103, name:'Cruzados',           url:'',  visible:true},
    {id:104, name:'Nevados de Chillán', url:'',  visible:true},
    {id:105, name:'Xclusive Chile',     url:'',  visible:true},
    {id:106, name:'Chile Suplementos',  url:'',  visible:true},
    {id:107, name:'Barra Central',      url:'',  visible:true},
    {id:108, name:'Tamango',            url:'',  visible:true},
  ],
  config: {
    email: 'matiasbrieba@gmail.com',
    instagram: '@matiasbrieba',
    city: 'Chile',
  }
};

function normalizeMediaUrl(url){
  if(!url) return '';
  const clean = String(url).trim();
  if(!clean) return '';
  if(/^(?:data:|blob:|https?:)?\/\//i.test(clean)) return clean;
  if(/^file:/i.test(clean)) return clean;
  if(/^[a-zA-Z]:[\\/]/.test(clean) || clean.startsWith('\\\\')) return clean;
  try{
    return new URL(clean, getSiteBaseUrl()).href;
  }catch(_err){
    return clean;
  }
}

function getSiteBaseUrl(){
  if(typeof window === 'undefined' || !window.location) return 'http://localhost/';
  const {origin, pathname} = window.location;
  const adminIdx = pathname.indexOf('/admin/');
  const basePath = adminIdx >= 0
    ? `${pathname.slice(0, adminIdx) || ''}/`
    : pathname.replace(/\/[^/]*$/, '/');
  return `${origin}${basePath}`;
}

function isLocalOnlyMediaUrl(url){
  const clean = String(url || '').trim();
  if(!clean) return false;
  if(/^file:/i.test(clean)) return true;
  if(/^[a-zA-Z]:[\\/]/.test(clean) || clean.startsWith('\\\\')) return true;
  try{
    const parsed = new URL(clean, getSiteBaseUrl());
    return ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
  }catch(_err){
    return false;
  }
}

function parseList(value){
  if(Array.isArray(value)) return value.map(item => normalizeMediaUrl(item)).filter(Boolean);
  if(typeof value !== 'string') return [];
  return value.split('\n').map(item => normalizeMediaUrl(item)).filter(Boolean);
}

function normaliseProject(project){
  if(!project || typeof project !== 'object') return project;
  const videos = Array.isArray(project.videos)
    ? project.videos
    : (project.videoUrl ? [project.videoUrl] : []);
  return {
    ...project,
    order: typeof project.order === 'number' ? project.order : 0,
    coverImg: fixImgUrl(project.coverImg || ''),
    img: fixImgUrl(project.img || ''),
    headerVideo: normalizeMediaUrl(project.headerVideo || ''),
    images: parseList(project.images || []),
    videos: parseList(videos),
    videoUrl: normalizeMediaUrl(project.videoUrl || videos[0] || ''),
  };
}

function cloneDefaultData(){
  return JSON.parse(JSON.stringify(MB_DEFAULT));
}

function normaliseData(data){
  const base = cloneDefaultData();
  return {
    ...base,
    ...(data && typeof data === 'object' ? data : {}),
    projects: Array.isArray(data?.projects) ? data.projects.map(normaliseProject) : base.projects.map(normaliseProject),
    clients: Array.isArray(data?.clients) ? data.clients : base.clients,
    config: data?.config && typeof data.config === 'object' ? data.config : base.config,
  };
}

function dispatchDataUpdate(data, source){
  if(typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(MB_DATA_EVENT, {
    detail: { data, source },
  }));
}

function writeLocalData(data, source = 'local'){
  const payload = normaliseData(data);
  localStorage.setItem(MB_KEY, JSON.stringify(payload));
  dispatchDataUpdate(payload, source);
  return payload;
}

function getMBData(){
  try {
    const raw = localStorage.getItem(MB_KEY);
    if(!raw) return normaliseData(MB_DEFAULT);
    return normaliseData(JSON.parse(raw));
  } catch(e){
    return normaliseData(MB_DEFAULT);
  }
}

function saveMBData(data){
  return writeLocalData(data, 'local-save');
}

function getAdminAuthHeader(){
  try{
    const raw = localStorage.getItem('mb_admin_auth');
    return raw ? `Basic ${raw}` : '';
  }catch(_err){
    return '';
  }
}

async function fetchMBDataRemote(){
  const res = await fetch(MB_API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-store',
    },
  });
  if(!res.ok) throw new Error(`GET ${MB_API_URL} failed with ${res.status}`);
  return normaliseData(await res.json());
}

async function loadMBDataRemote(){
  try{
    const data = await fetchMBDataRemote();
    return writeLocalData(data, 'remote-load');
  }catch(_err){
    return getMBData();
  }
}

async function saveMBDataRemote(data){
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const authHeader = getAdminAuthHeader();
  if(authHeader) headers.Authorization = authHeader;
  const res = await fetch(MB_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(normaliseData(data)),
  });
  if(!res.ok){
    const message = await res.text();
    throw new Error(message || `POST ${MB_API_URL} failed with ${res.status}`);
  }
  return writeLocalData(await res.json(), 'remote-save');
}

// Single remote load promise shared across the module
let _remoteLoadPromise = null;
function getRemoteLoadPromise(){
  if(!_remoteLoadPromise){
    _remoteLoadPromise = typeof fetch === 'function'
      ? loadMBDataRemote().catch(() => {
          // If remote fails, fallback to localStorage or defaults
          if(!localStorage.getItem(MB_KEY)){
            writeLocalData(MB_DEFAULT, 'default-init');
          }
          return getMBData();
        })
      : Promise.resolve(getMBData());
  }
  return _remoteLoadPromise;
}

// Init default if empty, but always try remote first
(function(){
  getRemoteLoadPromise();
})();

window.MBDataStore = {
  ready: getRemoteLoadPromise(),
  eventName: MB_DATA_EVENT,
  get: getMBData,
  loadRemote: loadMBDataRemote,
  saveRemote: saveMBDataRemote,
};

// Convert Google Drive share links to embeddable image URLs
function fixImgUrl(url){
  const clean = normalizeMediaUrl(url);
  if(!clean) return '';
  // Already a thumbnail URL — ensure large size
  const thumbMatch = clean.match(/drive\.google\.com\/thumbnail\?id=([A-Za-z0-9_-]+)/);
  if(thumbMatch) return `https://drive.google.com/thumbnail?id=${thumbMatch[1]}&sz=w1200`;
  // Share/file links
  const m = clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=[^&]+&)?id=)([A-Za-z0-9_-]+)/);
  if(m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200`;
  return clean;
}

// Parse a video URL and return {type, src} ready to embed as hero
function parseHeroVideo(url){
  const clean = normalizeMediaUrl(url);
  if(!clean) return null;
  const yt=clean.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if(yt) return {type:'iframe',src:`https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`};
  const vm=clean.match(/vimeo\.com\/(\d+)/);
  if(vm) return {type:'iframe',src:`https://player.vimeo.com/video/${vm[1]}?autoplay=1&loop=1&background=1&muted=1`};
  const gd=clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
  if(gd) return {type:'iframe',src:`https://drive.google.com/file/d/${gd[1]}/preview`};
  return {type:'video',src:clean};
}

function parseProjectVideo(url){
  const clean = normalizeMediaUrl(url);
  if(!clean) return null;
  const yt = clean.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if(yt){
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&playsinline=1`,
    };
  }
  const vm = clean.match(/vimeo\.com\/(\d+)/);
  if(vm){
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vm[1]}`,
    };
  }
  const gd = clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
  if(gd){
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${gd[1]}/preview`,
    };
  }
  return {type:'video', src: clean};
}
