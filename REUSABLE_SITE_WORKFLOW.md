# Reusable Site Workflow

## Propósito

Guía genérica para construir un sitio estático con admin y backend real, reutilizable en Codex, Claude o Kimi.

El patrón objetivo es:

- frontend estático
- admin simple
- backend mínimo
- persistencia real
- deploy fácil

## Arquitectura recomendada

- frontend: HTML, CSS, JS
- admin: `/admin`
- backend: Cloudflare Worker
- storage: Cloudflare KV
- API: `/api/data`
- deploy: `wrangler deploy`

## Principio central

No usar `localStorage` como source of truth.

`localStorage` solo se usa para:

- caché local
- fallback si falla la red

La verdad debe vivir en backend.

## Naming genérico recomendado

Usar nombres neutrales y reutilizables:

- KV binding: `SITE_DATA`
- usuario admin: `SITE_ADMIN_USER`
- password admin: `SITE_ADMIN_PASSWORD`
- endpoint: `/api/data`

El namespace real en Cloudflare sí debe ser específico por proyecto.

Ejemplos:

- `cliente-a-data`
- `portfolio-julia-data`
- `arquitectura-estudio-data`

## Flujo de información

1. El frontend pide `GET /api/data`.
2. El Worker lee la data desde `SITE_DATA`.
3. El Worker devuelve JSON.
4. El admin edita contenido.
5. El admin envía `POST /api/data`.
6. El Worker valida auth.
7. El Worker guarda la data actualizada en `SITE_DATA`.
8. El frontend vuelve a leer esos datos.
9. El navegador guarda una copia local solo como caché.

## Qué guarda el backend

Estructura base recomendada:

```json
{
  "projects": [],
  "clients": [],
  "config": {}
}
```

## Paso a paso de implementación

### 1. Crear el frontend estático

Crea:

- `index.html`
- `portfolio.html`
- `project.html`
- `admin/index.html`
- `js/data.js`

Objetivo:

- el sitio público renderiza datos
- el admin edita esos datos

### 2. Definir una capa única de datos en cliente

En `js/data.js` crea:

- `getSiteData()`
- `loadSiteDataRemote()`
- `saveSiteDataRemote()`
- funciones de normalización
- evento global de actualización

Responsabilidades:

- leer caché local
- pedir data remota
- guardar data remota
- normalizar URLs de imágenes y videos

### 3. Crear el backend mínimo

Crea `worker.js`.

Debe hacer dos cosas:

- servir archivos estáticos con `env.ASSETS.fetch(request)`
- servir `/api/data`

Comportamiento recomendado:

- `GET /api/data`: devuelve JSON actual
- `POST /api/data`: valida auth y persiste JSON

### 4. Crear la configuración de deploy

Crea `wrangler.jsonc`.

Debe incluir:

- nombre del proyecto
- `main`
- `compatibility_date`
- assets binding
- KV binding `SITE_DATA`

Ejemplo:

```jsonc
{
  "name": "my-site",
  "main": "worker.js",
  "compatibility_date": "2026-05-19",
  "assets": {
    "directory": ".",
    "binding": "ASSETS"
  },
  "kv_namespaces": [
    {
      "binding": "SITE_DATA",
      "id": "TU_NAMESPACE_ID"
    }
  ]
}
```

### 5. Crear el namespace KV

En Cloudflare:

1. Ve a `Storage & Databases`.
2. Entra a `KV`.
3. Crea un namespace nuevo.
4. Ponle un nombre específico del proyecto.

Ejemplo:

- `mi-estudio-data`

### 6. Conectar el namespace al proyecto

Copia el `id` del namespace y úsalo en `wrangler.jsonc`.

No dependas de crear bindings manuales en modales si tu deploy usa `wrangler deploy`.

Si el proyecto deploya desde repo, la configuración correcta debe vivir en `wrangler.jsonc`.

### 7. Agregar auth de escritura

Usa Basic Auth para `POST /api/data`.

Variables recomendadas:

- `SITE_ADMIN_USER`
- `SITE_ADMIN_PASSWORD`

Defaults sugeridos para desarrollo:

- user: `admin`
- password: `change-me`

Nunca dejar esos defaults en producción si el sitio es real.

### 8. Hacer que el admin guarde en backend

En `admin/index.html`:

- al guardar proyecto, cliente o config, llamar `saveSiteDataRemote()`
- no depender solo de `localStorage`
- si el backend responde ok, actualizar la UI

### 9. Hacer que el frontend lea la misma data

En `index`, `portfolio` y `project`:

- leer desde la capa de datos compartida
- re-renderizar cuando llegue data remota

Objetivo:

- el admin y el sitio público deben consumir la misma fuente

### 10. Mantener caché local solo como respaldo

Guardar una copia en `localStorage` está bien si:

- el backend sigue siendo la fuente principal
- la caché se reemplaza cuando llega data remota nueva

### 11. Validar multimedia

Aceptar solo:

- `https://...`
- YouTube
- Vimeo
- Google Drive público
- rutas públicas del sitio

Bloquear:

- `file://`
- `C:\...`
- `localhost`
- `127.0.0.1`

### 12. Resolver imágenes de Google Drive correctamente

No confiar en formatos frágiles.

Preferir una transformación estable:

- `https://drive.google.com/thumbnail?id=FILE_ID&sz=w2000`

### 13. Hacer hero video compatible con mobile

Si usas `<video>` directo:

- `autoplay`
- `muted`
- `defaultMuted`
- `playsinline`
- `webkit-playsinline`

Y reintentar `play()` en:

- `loadedmetadata`
- `canplay`
- `pageshow`
- `visibilitychange`
- primer `touchstart`

### 14. Probar el backend antes del admin

Primero valida:

1. `GET /api/data`
2. devuelve JSON válido
3. `POST /api/data`
4. persiste correctamente

Recién después pruebas la UI del admin.

## Estructura recomendada de archivos

- `worker.js`
- `wrangler.jsonc`
- `index.html`
- `portfolio.html`
- `project.html`
- `admin/index.html`
- `js/data.js`

## Errores a evitar

- guardar contenido solo en `localStorage`
- tener una capa de datos en `admin` y otra distinta en `home`
- crear bindings solo en UI cuando el deploy depende del repo
- usar nombres específicos del proyecto en código reusable
- usar URLs locales para multimedia

## Checklist para nuevos sitios

1. Crear frontend estático.
2. Crear `worker.js`.
3. Crear `wrangler.jsonc`.
4. Crear namespace KV.
5. Poner el namespace ID en `wrangler.jsonc`.
6. Implementar `GET /api/data`.
7. Implementar `POST /api/data`.
8. Conectar auth de escritura.
9. Hacer que admin guarde por API.
10. Hacer que frontend lea por API.
11. Dejar `localStorage` como caché.
12. Validar multimedia pública.
13. Validar video hero en mobile.
14. Probar `/api/data`.
15. Probar el admin.
16. Probar el sitio público.

## Prompt reutilizable para otro agente

Construye un sitio estático con admin y backend real usando este patrón:

- frontend HTML/CSS/JS
- admin en `/admin`
- Worker como backend
- Cloudflare KV como storage
- endpoint `GET /api/data`
- endpoint `POST /api/data`
- binding genérica `SITE_DATA`
- auth con `SITE_ADMIN_USER` y `SITE_ADMIN_PASSWORD`
- `localStorage` solo como caché/fallback
- validación de multimedia pública
- compatibilidad mobile para hero video
- configuración versionada en `wrangler.jsonc`

## Referencia en este repo

La base actual quedó en:

- [worker.js](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/worker.js)
- [wrangler.jsonc](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/wrangler.jsonc)
- [js/data.js](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/js/data.js)
- [admin/index.html](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/admin/index.html)
