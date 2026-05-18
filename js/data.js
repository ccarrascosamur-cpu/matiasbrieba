// ── MB DATA LAYER ──
// Centralised data stored in localStorage
// Admin panel writes here; front-end reads here.

const MB_KEY = 'mb_portfolio_data';

const MB_DEFAULT = {
  projects: [
    {
      id: 1,
      name: 'Barra Central',
      client: 'Barra Central',
      cat: 'film',
      year: 2024,
      img: '',
      url: '',
      videoUrl: '',
      images: [],
      desc: 'Producción audiovisual para Barra Central.',
      featured: true,
    },
    {
      id: 2,
      name: 'Monster Energy Chile',
      client: 'Monster Energy',
      cat: 'foto',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/monster-energy-chile',
      videoUrl: '',
      images: [],
      desc: 'Fotografía deportiva y lifestyle para Monster Energy.',
      featured: true,
    },
    {
      id: 3,
      name: 'Juan Valdez Café',
      client: 'Juan Valdez',
      cat: 'corp',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/juan-valdez-cafe',
      videoUrl: '',
      images: [],
      desc: 'Fotografía de producto y corporativa para Juan Valdez.',
      featured: true,
    },
    {
      id: 4,
      name: 'Xclusive Chile',
      client: 'Xclusive',
      cat: 'foto',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/xclusive-chile',
      videoUrl: '',
      images: [],
      desc: 'Contenido visual para Xclusive Chile.',
      featured: true,
    },
    {
      id: 5,
      name: 'Nevados de Chillán',
      client: 'Nevados de Chillán',
      cat: 'deporte',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/nevados-de-chillan',
      videoUrl: '',
      images: [],
      desc: 'Fotografía deportiva en nieve y montaña.',
      featured: true,
    },
    {
      id: 6,
      name: 'Chile Suplementos',
      client: 'Chile Suplementos',
      cat: 'corp',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/chile-suplementos',
      videoUrl: '',
      images: [],
      desc: 'Fotografía de producto y corporativa.',
      featured: true,
    },
    {
      id: 7,
      name: 'Cruzados',
      client: 'Cruzados',
      cat: 'deporte',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/cruzados',
      videoUrl: '',
      images: [],
      desc: 'Fútbol y deporte de alta emoción.',
      featured: true,
    },
    {
      id: 8,
      name: 'Tamango Brebajes',
      client: 'Tamango',
      cat: 'film',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/tamango-brebajes',
      videoUrl: '',
      images: [],
      desc: 'Producción audiovisual y branding visual.',
      featured: false,
    },
    {
      id: 9,
      name: 'Santiago 2023',
      client: 'Personal',
      cat: 'foto',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/santiago-2023',
      videoUrl: '',
      images: [],
      desc: 'Reportaje fotográfico de Santiago.',
      featured: false,
    },
    {
      id: 10,
      name: 'Bruno Fritsch',
      client: 'Bruno Fritsch',
      cat: 'foto',
      year: 2024,
      img: '',
      url: 'https://matiasbriebaf.myportfolio.com/bruno-fristch',
      videoUrl: '',
      images: [],
      desc: 'Retrato y fotografía artística.',
      featured: false,
    },
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

function getMBData(){
  try {
    const raw = localStorage.getItem(MB_KEY);
    if(!raw) return structuredClone(MB_DEFAULT);
    return JSON.parse(raw);
  } catch(e){
    return structuredClone(MB_DEFAULT);
  }
}

function saveMBData(data){
  localStorage.setItem(MB_KEY, JSON.stringify(data));
}

// Init default if empty
(function(){
  if(!localStorage.getItem(MB_KEY)){
    saveMBData(MB_DEFAULT);
  }
})();

// Convert Google Drive share links to embeddable image URLs
function fixImgUrl(url){
  if(!url) return '';
  const m=url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
  if(m) return 'https://lh3.googleusercontent.com/d/'+m[1];
  return url;
}

// Parse a video URL and return {type, src} ready to embed as hero
function parseHeroVideo(url){
  if(!url) return null;
  const yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if(yt) return {type:'iframe',src:`https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&playsinline=1&rel=0&modestbranding=1`};
  const vm=url.match(/vimeo\.com\/(\d+)/);
  if(vm) return {type:'iframe',src:`https://player.vimeo.com/video/${vm[1]}?autoplay=1&loop=1&background=1&muted=1`};
  const gd=url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
  if(gd) return {type:'iframe',src:`https://drive.google.com/file/d/${gd[1]}/preview`};
  return {type:'video',src:url};
}
