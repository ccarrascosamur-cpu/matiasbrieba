# Agent Site Prompt Template

Usa este prompt base en Codex, Claude o Kimi cuando quieras crear un sitio nuevo.

## Prompt

Quiero que construyas este sitio completo y dejes el proyecto listo para GitHub y Cloudflare.

Antes de empezar, debes preguntarme primero:

`¿Este sitio es una landing page simple o un sitio con backend autoadministrable?`

Reglas:

1. Si es `landing page simple`:
   - no crear backend
   - no crear KV
   - no crear `/admin`
   - dejar deploy estático limpio

2. Si es `sitio con backend autoadministrable`:
   - crear frontend estático
   - crear `/admin`
   - crear backend con Cloudflare Worker
   - crear persistencia con Cloudflare KV
   - usar endpoint `GET /api/data`
   - usar endpoint `POST /api/data`
   - usar binding genérica `SITE_DATA`
   - usar variables `SITE_ADMIN_USER` y `SITE_ADMIN_PASSWORD`
   - usar `localStorage` solo como caché/fallback, nunca como source of truth

3. Siempre dejar instrucciones claras para:
   - crear repo en GitHub
   - conectar el repo a Cloudflare
   - configurar deploy automático
   - crear KV si aplica
   - validar el sitio al final

4. Antes de diseñar o implementar, busca referencias en Lazyweb cuando ayuden a definir:
   - dirección visual
   - estructura de una landing
   - estilo de portfolio o estudio
   - patrones de interacción

5. Si el sitio tiene multimedia:
   - validar que las URLs sean públicas
   - bloquear rutas locales
   - hacer el hero video compatible con mobile

6. Si el sitio es autoadministrable:
   - toda la configuración del backend debe quedar versionada en repo
   - preferir `wrangler.jsonc`
   - no depender solo de bindings creadas a mano en modales

7. Al final debes entregar:
   - código implementado
   - archivos clave creados
   - pasos exactos de configuración en GitHub y Cloudflare
   - validaciones pendientes

## Variables que el usuario debería completar

- nombre del proyecto
- tipo de sitio
- estilo visual
- secciones requeridas
- contenido base
- dominio
- si llevará admin o no
- si llevará video hero o no

## Prompt corto alternativo

Crea este sitio y antes de empezar pregúntame si es una landing simple o un sitio con backend autoadministrable. Antes de diseñar, busca referencias útiles en Lazyweb. Si es simple, no crees backend. Si es autoadministrable, usa Cloudflare Worker + KV con `SITE_DATA`, `GET /api/data`, `POST /api/data`, `/admin`, deploy con `wrangler.jsonc` y deja instrucciones completas para GitHub y Cloudflare.
