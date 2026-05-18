# Matías Brieba — Portfolio
**Deploy en Cloudflare Pages**

## Estructura
```
matias-brieba/
├── index.html          ← Sitio principal
├── portfolio.html      ← Página de portfolio (abre en nueva pestaña)
├── admin/
│   └── index.html      ← Panel de administración
├── css/
│   └── style.css
├── js/
│   ├── data.js         ← Capa de datos (localStorage CMS)
│   ├── main.js         ← Lógica principal
│   └── portfolio.js    ← Lógica página portfolio
├── _headers            ← Headers de seguridad Cloudflare
└── _redirects          ← Redirects Cloudflare
```

---

## Deploy en Cloudflare Pages

### Opción A — Desde GitHub (recomendado)
1. Sube esta carpeta a un repositorio GitHub (público o privado).
2. Ve a **Cloudflare Dashboard → Pages → Create a project**.
3. Conecta tu cuenta de GitHub y selecciona el repositorio.
4. En "Build settings":
   - **Framework preset:** `None`
   - **Build command:** (dejar vacío)
   - **Build output directory:** `/` (raíz)
5. Click **Save and Deploy**.
6. Tu sitio queda en `https://tu-proyecto.pages.dev`

### Opción B — Deploy directo (drag & drop)
1. Ve a **Cloudflare Dashboard → Pages → Create a project → Upload assets**.
2. Arrastra la carpeta `matias-brieba/` completa.
3. Deploy instantáneo.

---

## Admin Panel
- URL: `https://tu-dominio.pages.dev/admin`
- **Usuario:** `matias`
- **Contraseña:** `brieba2024`

> Cambia la contraseña desde el mismo panel: **Configuración → Seguridad**.

Los datos se guardan en `localStorage` del navegador visitante del admin.
Para un CMS real en producción, conectar a Cloudflare D1 o KV.

---

## Dominio personalizado
En Cloudflare Pages → tu proyecto → **Custom domains** → agrega `matiasbrieba.cl` (o el que tengas).

---

## Actualizar contenido
1. Ir a `/admin`
2. Iniciar sesión
3. Agregar / editar / eliminar proyectos y clientes
4. Los cambios se reflejan instantáneamente en el sitio

> **Nota:** Al ser localStorage, los datos persisten en el mismo navegador.
> Para multi-dispositivo agregar Cloudflare Workers + D1 (opcional).
