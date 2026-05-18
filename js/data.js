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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/4a646a4e-496e-4390-b9ac-b4b3062560f9_rwc_242x0x1439x1080x1439.jpg?h=d1e5f7df4bf1ad8f90c908fce16a442a',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/1029c1dd-c9da-45ad-aa61-bf9c0ca24f51_rw_600.png?h=6b198400613aefd30fd12ef0782a6d01',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/4a646a4e-496e-4390-b9ac-b4b3062560f9_rwc_242x0x1439x1080x1439.jpg?h=d1e5f7df4bf1ad8f90c908fce16a442a',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/1029c1dd-c9da-45ad-aa61-bf9c0ca24f51_rw_600.png?h=6b198400613aefd30fd12ef0782a6d01',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/4a646a4e-496e-4390-b9ac-b4b3062560f9_rwc_242x0x1439x1080x1439.jpg?h=d1e5f7df4bf1ad8f90c908fce16a442a',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/1029c1dd-c9da-45ad-aa61-bf9c0ca24f51_rw_600.png?h=6b198400613aefd30fd12ef0782a6d01',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/4a646a4e-496e-4390-b9ac-b4b3062560f9_rwc_242x0x1439x1080x1439.jpg?h=d1e5f7df4bf1ad8f90c908fce16a442a',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/1029c1dd-c9da-45ad-aa61-bf9c0ca24f51_rw_600.png?h=6b198400613aefd30fd12ef0782a6d01',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/4a646a4e-496e-4390-b9ac-b4b3062560f9_rwc_242x0x1439x1080x1439.jpg?h=d1e5f7df4bf1ad8f90c908fce16a442a',
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
      img: 'https://cdn.myportfolio.com/99e3222b-7b10-4664-a4cf-206afa74b111/1029c1dd-c9da-45ad-aa61-bf9c0ca24f51_rw_600.png?h=6b198400613aefd30fd12ef0782a6d01',
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
