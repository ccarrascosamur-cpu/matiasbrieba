const STORAGE_KEY = 'site-data';

const DEFAULT_DATA = {
  projects: [
    { id: 1, name: 'Barra Central', client: 'Barra Central', cat: 'film', year: 2024, img: '', url: '', videoUrl: '', videos: [], images: [], desc: 'Producción audiovisual para Barra Central.', featured: true },
    { id: 2, name: 'Monster Energy Chile', client: 'Monster Energy', cat: 'foto', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/monster-energy-chile', videoUrl: '', videos: [], images: [], desc: 'Fotografía deportiva y lifestyle para Monster Energy.', featured: true },
    { id: 3, name: 'Juan Valdez Café', client: 'Juan Valdez', cat: 'corp', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/juan-valdez-cafe', videoUrl: '', videos: [], images: [], desc: 'Fotografía de producto y corporativa para Juan Valdez.', featured: true },
    { id: 4, name: 'Xclusive Chile', client: 'Xclusive', cat: 'foto', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/xclusive-chile', videoUrl: '', videos: [], images: [], desc: 'Contenido visual para Xclusive Chile.', featured: true },
    { id: 5, name: 'Nevados de Chillán', client: 'Nevados de Chillán', cat: 'deporte', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/nevados-de-chillan', videoUrl: '', videos: [], images: [], desc: 'Fotografía deportiva en nieve y montaña.', featured: true },
    { id: 6, name: 'Chile Suplementos', client: 'Chile Suplementos', cat: 'corp', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/chile-suplementos', videoUrl: '', videos: [], images: [], desc: 'Fotografía de producto y corporativa.', featured: true },
    { id: 7, name: 'Cruzados', client: 'Cruzados', cat: 'deporte', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/cruzados', videoUrl: '', videos: [], images: [], desc: 'Fútbol y deporte de alta emoción.', featured: true },
    { id: 8, name: 'Tamango Brebajes', client: 'Tamango', cat: 'film', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/tamango-brebajes', videoUrl: '', videos: [], images: [], desc: 'Producción audiovisual y branding visual.', featured: false },
    { id: 9, name: 'Santiago 2023', client: 'Personal', cat: 'foto', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/santiago-2023', videoUrl: '', videos: [], images: [], desc: 'Reportaje fotográfico de Santiago.', featured: false },
    { id: 10, name: 'Bruno Fritsch', client: 'Bruno Fritsch', cat: 'foto', year: 2024, img: '', url: 'https://matiasbriebaf.myportfolio.com/bruno-fristch', videoUrl: '', videos: [], images: [], desc: 'Retrato y fotografía artística.', featured: false },
  ],
  clients: [
    { id: 101, name: 'Monster Energy', url: '', visible: true },
    { id: 102, name: 'Juan Valdez', url: '', visible: true },
    { id: 103, name: 'Cruzados', url: '', visible: true },
    { id: 104, name: 'Nevados de Chillán', url: '', visible: true },
    { id: 105, name: 'Xclusive Chile', url: '', visible: true },
    { id: 106, name: 'Chile Suplementos', url: '', visible: true },
    { id: 107, name: 'Barra Central', url: '', visible: true },
    { id: 108, name: 'Tamango', url: '', visible: true },
  ],
  config: {
    email: 'matiasbrieba@gmail.com',
    instagram: '@matiasbrieba',
    city: 'Chile',
    heroVideo: '',
  },
};

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== 'string') return [];
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function normalizeData(input) {
  const data = input && typeof input === 'object' ? input : {};
  const projects = Array.isArray(data.projects) ? data.projects : DEFAULT_DATA.projects;
  return {
    projects: projects.map((project) => {
      const videos = Array.isArray(project?.videos) ? project.videos : normalizeList(project?.videoUrl || '');
      return {
        id: Number(project?.id) || Date.now(),
        name: String(project?.name || '').trim(),
        client: String(project?.client || '').trim(),
        cat: String(project?.cat || 'foto').trim(),
        year: Number(project?.year) || new Date().getFullYear(),
        img: String(project?.img || '').trim(),
        url: String(project?.url || '').trim(),
        videoUrl: String(project?.videoUrl || videos[0] || '').trim(),
        videos: normalizeList(videos),
        images: normalizeList(project?.images || []),
        desc: String(project?.desc || '').trim(),
        featured: Boolean(project?.featured),
      };
    }),
    clients: (Array.isArray(data.clients) ? data.clients : DEFAULT_DATA.clients).map((client, index) => ({
      id: Number(client?.id) || 100 + index,
      name: String(client?.name || '').trim(),
      url: String(client?.url || '').trim(),
      visible: client?.visible !== false,
    })),
    config: {
      email: String(data?.config?.email || DEFAULT_DATA.config.email).trim(),
      instagram: String(data?.config?.instagram || DEFAULT_DATA.config.instagram).trim(),
      city: String(data?.config?.city || DEFAULT_DATA.config.city).trim(),
      heroVideo: String(data?.config?.heroVideo || '').trim(),
    },
  };
}

function readAuth(request) {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Basic ')) return null;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;
    return {
      user: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch (_err) {
    return null;
  }
}

function isAuthorized(request, env) {
  const creds = readAuth(request);
  const expectedUser = env.MB_ADMIN_USER || 'matias';
  const expectedPassword = env.MB_ADMIN_PASSWORD || 'brieba2024';
  return creds && creds.user === expectedUser && creds.password === expectedPassword;
}

async function readStoredData(env) {
  if (!env.MB_DATA) return normalizeData(DEFAULT_DATA);
  const raw = await env.MB_DATA.get(STORAGE_KEY, 'json');
  return raw ? normalizeData(raw) : normalizeData(DEFAULT_DATA);
}

async function handleApi(request, env) {
  if (request.method === 'GET') {
    return json(await readStoredData(env));
  }

  if (request.method === 'POST') {
    if (!env.MB_DATA) {
      return json({ error: 'Missing KV binding: MB_DATA' }, { status: 500 });
    }
    if (!isAuthorized(request, env)) {
      return json({ error: 'Unauthorized' }, {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="admin"' },
      });
    }
    let payload;
    try {
      payload = await request.json();
    } catch (_err) {
      return json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const normalized = normalizeData(payload);
    await env.MB_DATA.put(STORAGE_KEY, JSON.stringify(normalized));
    return json(normalized);
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'GET, POST' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/data') {
      return handleApi(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
