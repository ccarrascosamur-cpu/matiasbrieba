# Site Factory Playbook

## Estado de deploy de este proyecto

Este proyecto parece estar con deploy automático desde GitHub hacia Cloudflare Worker.

Señales observadas:

- repositorio Git conectado en Cloudflare
- rama de producción: `main`
- comando de implementación: `npx wrangler deploy`

Eso significa que, en la práctica:

1. se hace `push` a `main`
2. Cloudflare dispara build/deploy
3. el Worker publica el sitio y la API

## Cuándo el deploy es automático

El deploy es automático si Cloudflare tiene:

- repo Git conectado
- branch de producción definida
- build/deploy habilitado

## Cuándo no es automático

No es automático si:

- el repo no está conectado
- no hay branch de producción configurada
- el proyecto requiere deploy manual

## Flujo recomendado para crear sitios nuevos

### Variante A: Landing page simple

Usar cuando el sitio:

- no necesita panel admin
- no necesita backend
- no necesita persistencia editable

Stack recomendado:

- HTML/CSS/JS
- Cloudflare Worker o Pages solo para hosting

Archivos mínimos:

- `index.html`
- `css/`
- `js/`

Deploy:

- GitHub
- Cloudflare con deploy automático por branch

### Variante B: Sitio con backend autoadministrable

Usar cuando el sitio:

- necesita panel admin
- necesita editar contenido sin tocar código
- necesita persistencia real

Stack recomendado:

- frontend estático
- admin en `/admin`
- Worker
- KV
- `/api/data`

## Proceso completo para crear un sitio nuevo

### 1. Definir el tipo de sitio

Siempre preguntar primero:

- `¿Es una landing page simple o un sitio con backend autoadministrable?`

Antes de diseñar o implementar, también pedir o asumir permiso para buscar referencias en Lazyweb cuando ayude a definir:

- estilo visual
- estructura de secciones
- referencias de interacción
- patrones de portfolios, estudios o landings

Si es landing simple:

- no crear backend
- no crear KV
- no crear admin

Si es autoadministrable:

- crear backend
- crear admin
- crear KV
- crear API

### 2. Crear repo en GitHub

1. crear repositorio nuevo
2. clonar repo localmente
3. crear rama principal `main`
4. subir estructura base

### 3. Crear proyecto en Cloudflare

1. crear Worker/project nuevo
2. conectar repo GitHub
3. dejar branch de producción en `main`
4. si usa Worker, definir deploy por `wrangler deploy`

### 4. Si el sitio es simple

Construir:

- home
- responsive
- enlaces y CTA
- assets
- referencias visuales tomadas de Lazyweb si aportan dirección clara

No crear:

- `worker.js` con API
- KV
- `/admin`

### 5. Si el sitio es autoadministrable

Crear:

- `worker.js`
- `wrangler.jsonc`
- `admin/index.html`
- `js/data.js`
- endpoint `GET /api/data`
- endpoint `POST /api/data`

### 6. Crear storage

En Cloudflare:

1. ir a `Storage & Databases`
2. crear namespace KV específico del proyecto
3. copiar el namespace ID
4. colocarlo en `wrangler.jsonc`

Binding en código:

- `SITE_DATA`

Namespace real:

- específico del proyecto

Ejemplo:

- `estudio-lopez-data`

### 7. Configurar credenciales admin

En Cloudflare:

- `SITE_ADMIN_USER`
- `SITE_ADMIN_PASSWORD`

### 8. Implementar frontend

Landing simple:

- render estático
- usar referencias de Lazyweb si ayudan a definir una dirección visual concreta

Autoadministrable:

- render desde `js/data.js`
- leer desde `/api/data`
- actualizar cuando cambie la data
- usar referencias de Lazyweb para UI pública y, si hace sentido, para el admin

### 9. Implementar admin

Solo para la variante con backend:

- formulario de proyectos
- configuración general
- guardado por API
- validación de URLs públicas

### 10. Subir a GitHub

1. commit
2. push a `main`

### 11. Deploy en Cloudflare

Si hay integración Git:

- el deploy debería correr solo

Si no:

- ejecutar deploy manual

### 12. Validar

#### Landing simple

- home carga
- responsive correcto
- links correctos
- assets cargan

#### Sitio con backend

- `/api/data` responde
- admin guarda
- home refleja cambios
- data persiste entre dispositivos

## Checklist reusable

### Landing simple

1. confirmar que no necesita backend
2. crear repo
3. crear proyecto en Cloudflare
4. construir frontend
5. push a GitHub
6. validar deploy

### Sitio con backend

1. confirmar que sí necesita backend
2. crear repo
3. crear proyecto en Cloudflare
4. crear KV
5. configurar `wrangler.jsonc`
6. crear `worker.js`
7. crear `/admin`
8. implementar `/api/data`
9. push a GitHub
10. validar deploy
11. validar guardado real

## Regla para agentes

Todo agente que cree un sitio debe preguntar primero:

- `¿Es una landing page simple o un sitio con backend autoadministrable?`

No debe asumir backend por defecto.

También debe considerar buscar referencias en Lazyweb antes de diseñar, especialmente si el usuario no entregó una dirección visual suficientemente concreta.

## Referencia útil

Para backend reusable en este repo:

- [worker.js](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/worker.js)
- [wrangler.jsonc](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/wrangler.jsonc)
- [REUSABLE_SITE_WORKFLOW.md](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/projects/Matias%20Brieba/REUSABLE_SITE_WORKFLOW.md)
