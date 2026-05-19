# Cloudflare Setup

## Objetivo

Conectar un sitio estático con backend mínimo usando:

- Cloudflare Worker
- Cloudflare KV
- deploy con `wrangler deploy`

## Naming recomendado

- binding KV en código: `SITE_DATA`
- variables admin:
  - `SITE_ADMIN_USER`
  - `SITE_ADMIN_PASSWORD`

El namespace real en Cloudflare debe ser específico del proyecto.

Ejemplo:

- `mi-sitio-data`

## Pasos

### 1. Crear el namespace KV

En Cloudflare:

1. Ve a `Storage & Databases`
2. Entra a `KV`
3. Crea un namespace nuevo

Ejemplo de nombre:

- `mi-sitio-data`

### 2. Copiar el namespace ID

Una vez creado, copia el `id` del namespace.

### 3. Configurarlo en `wrangler.jsonc`

Usa esta estructura:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "SITE_DATA",
      "id": "TU_NAMESPACE_ID"
    }
  ]
}
```

## 4. Configurar credenciales admin

En Cloudflare agrega variables:

- `SITE_ADMIN_USER`
- `SITE_ADMIN_PASSWORD`

No dejar defaults inseguros en producción.

## 5. Deploy

Haz redeploy del proyecto para que Cloudflare tome:

- `worker.js`
- `wrangler.jsonc`
- binding `SITE_DATA`

## 6. Validación

Primero prueba:

- `GET /api/data`

Debe devolver JSON con:

- `projects`
- `clients`
- `config`

Luego prueba:

- guardar desde `/admin`

Eso debe hacer `POST /api/data` y persistir en KV.

## Regla importante

Si el proyecto deploya con `wrangler deploy`, la configuración real debe vivir en el repo.

No depender de modales manuales como fuente principal de configuración.
