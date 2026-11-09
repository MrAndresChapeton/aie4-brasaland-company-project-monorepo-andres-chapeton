# Sitio web de Brasaland

Sitio público de una sola página construido con Next.js, React, TypeScript y Tailwind CSS. Integra la historia de la marca, ubicaciones, programa Brasa Points y su formulario de registro.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Para validar la compilación de producción, ejecuta `npm run build`.

También puedes ejecutar `npm run dev -- --port 3000` desde la raíz del monorepo.
Requiere Node.js 24 o superior para las pruebas TypeScript nativas.

## Pruebas

Desde la raíz: `npm test`, `npm run typecheck`, `npm run lint` y `npm run build`.
Para pruebas reales de navegador, instala Chromium con
`npm --prefix uis/website exec -- playwright install chromium`, mantén
`npm run dev -- --port 3000` activo y ejecuta `npm run test:e2e`.
Playwright verifica escritorio y móvil, validaciones, reenvío, dependencias
país-ciudad-sede, imágenes, SEO y accesibilidad automatizada WCAG A/AA.
Las capturas y trazas se generan en `test-results/` y no se versionan.

## Alcance

Idioma base: español. La ruta `/registro#registro` lleva al formulario Brasa Points.
El registro valida los datos en el navegador; no está conectado a una API,
no almacena información y no envía correos. El éxito es una simulación.
No es un formulario de pedidos ni de reservas. Las utilidades del hito 2 viven
en [`../../packages/operations/`](../../packages/operations/README.md).

## Recursos

La identidad gráfica existente se conserva en `public/brand-mark.png`.
La fotografía de parrilla se sirve localmente en `public/grill.jpg`:
[origen en Unsplash](https://unsplash.com/photos/1544025162-d76694265947),
[licencia Unsplash](https://unsplash.com/license).