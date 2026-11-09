# Brasaland: contexto previo al Hito 3

**Fecha de corte:** 9 de noviembre de 2026.

## Resumen

Se consolidó la base del proyecto Brasaland en dos entregables: el sitio público
con registro simulado de Brasa Points y el núcleo TypeScript de operaciones del
hito 2. Se corrigió el arranque desde la raíz, se separaron las responsabilidades
del monorepo y se añadieron pruebas automatizadas y documentación de ejecución.

Esta entrega no implementa todavía un backend, una base de datos ni un dashboard
operativo. La lógica H2 queda preparada para alimentar esas capas posteriormente.

## Documentos de referencia

- [README.es.md](README.es.md): organización y responsabilidades del monorepo.
- [CONTEXT-brasaland.es.md](CONTEXT-brasaland.es.md): requisitos del sitio público y Brasa Points.
- [CONTEXTh2.md](CONTEXTh2.md): propósito de operaciones, suministros y fidelización.
- [CONTEXT_h2-brasaland.es.md](CONTEXT_h2-brasaland.es.md): entidades y funciones exigidas para H2.
- [company-choice-h1.md](company-choice-h1.md): elección de empresa y objetivos iniciales.

Este archivo resume el estado implementado; no sustituye las especificaciones
anteriores ni define requisitos nuevos para H3.

## Estructura actual

```text
/
├── CONTEXT-pre-h3.md             Resumen de cierre y punto de partida para H3
├── CONTEXT-brasaland.es.md       Especificaciones del sitio público
├── CONTEXT_h2-brasaland.es.md    Especificaciones de operaciones H2
├── CONTEXTh2.md                 Propósito del proyecto
├── company-choice-h1.md         Elección de Brasaland
├── README.es.md                 Guía del monorepo y comandos
├── package.json                 Comandos de coordinación desde la raíz
├── uis/
│   └── website/                 Sitio Next.js, React, TypeScript y Tailwind
│       ├── app/                 Landing, ruta de registro, layout y estilos
│       ├── lib/registration.ts  Validación y opciones del formulario
│       ├── public/              Identidad gráfica y fotografía local
│       └── tests/               Pruebas unitarias y de navegador
├── packages/
│   ├── shared/                  Tipos de negocio compartidos
│   │   └── types/index.ts
│   └── operations/              Lógica de negocio H2, sin dependencia de React
│       ├── src/index.ts         API pública del paquete
│       ├── src/utils/           Colecciones, búsquedas, cálculos y validaciones
│       └── tests/               Pruebas de operaciones
├── services/                    Espacio previsto para la API centralizada
├── data/                        Datos y pipelines futuros
├── agents/ skills/ mcps/         Capacidades de IA y herramientas futuras
├── workflows/                   Automatización futura
└── docs/ infra/ scripts/ internal/ shared/
                                Documentación y recursos transversales
```

Las carpetas reservadas para trabajo futuro conservan su estructura de plantilla;
su presencia no implica que ya exista una aplicación o integración ejecutable.

## Cambios realizados

### Sitio público y Brasa Points

- Se sustituyeron las páginas HTML sueltas de `uis/` por la aplicación `uis/website/`.
- Se configuraron Next.js 16, React 19, TypeScript y Tailwind CSS 4.
- La landing reúne historia, valores de marca, 14 sedes, menú informativo,
  beneficios Brasa Points y contacto.
- Se añadieron la ruta `/registro`, metadatos SEO, URL canónica, Open Graph y
  marcado Schema.org de tipo `Restaurant`.
- Se conservaron los recursos de marca y se sirve la fotografía desde `public/`.
- Se corrigieron las validaciones de nombre completo, email, teléfono por país,
  ciudad, sede, origen del contacto, edad mínima de 18 años y aceptación de términos.
- País, ciudad y sede tienen opciones dependientes; cambiar un campo superior
  limpia las selecciones inferiores. Las ofertas por email no vienen marcadas.
- Los errores se presentan por campo, con atributos accesibles y foco en el primer
  error. Corregir los datos permite reenviar sin el bloqueo de la validación anterior.
- Se corrigieron advertencias de claves de React y contraste de textos y botones.
- Se completaron la navegación móvil, el enlace para saltar al contenido y el aviso
  visible de que todavía no se pueden hacer pedidos en línea.

La experiencia actual está en español. La versión inglesa de la web HTML anterior
no se migró como segundo idioma; sigue siendo una mejora pendiente.

### Núcleo de operaciones H2

Se implementaron **23 funciones** en `packages/operations/src/utils/`:

| Archivo | Responsabilidad | Funciones |
| --- | --- | ---: |
| `collections.ts` | Filtros y ordenamientos no mutables | 6 |
| `search.ts` | Búsquedas lineales y búsqueda binaria | 3 |
| `transformations.ts` | Finanzas, scoring, rankings y reportes | 11 |
| `validations.ts` | Validación de menú, ventas y locaciones | 3 |

Las interfaces `Price`, `MenuItem`, `SaleTransaction`, `Location`, `WasteRecord`
y `CountryMetrics`, junto con sus tipos auxiliares, viven en `packages/shared`.
También se corrigieron los puntos de entrada de ese paquete para apuntar a
`types/index.ts`.

Los cálculos trabajan en USD y COP, con conversión fija de 1 USD = 4000 COP y
redondeo a dos decimales. Los ingresos diarios permiten indicar una zona horaria
IANA; Bogotá es el valor predeterminado y Florida usa `America/New_York`.

Se contemplan colecciones vacías o nulas, rangos inclusivos, ausencia de mutaciones
y errores explícitos ante referencias desconocidas en los reportes. El scoring
acepta una fecha de referencia para producir resultados reproducibles. Las decisiones
sobre apertura estimada, margen y casos límite están documentadas en
[packages/operations/README.md](packages/operations/README.md).

### Organización y herramientas

- Se añadieron comandos raíz que delegan en cada proyecto sin mover sus dependencias.
- Se actualizaron la guía principal y los README de las interfaces y paquetes.
- Se incorporaron los documentos de propósito y especificaciones H2; el documento
  de elección inicial queda identificado como `company-choice-h1.md`.
- Se retiraron el contexto placeholder anterior y las páginas HTML reemplazadas.
- `.gitignore` excluye dependencias, compilaciones, resultados de pruebas y archivos
  de entorno, manteniendo el lockfile de la aplicación para instalaciones reproducibles.

## Ejecución y verificación

Se requiere **Node.js 24 o superior**. Desde la raíz:

```bash
npm --prefix uis/website ci
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Rutas disponibles: <http://localhost:3000> y
<http://localhost:3000/registro#registro>.

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Las pruebas E2E requieren el servidor activo en el puerto 3000, Chromium de
Playwright y sus bibliotecas de sistema. Instalar el navegador con
`npm --prefix uis/website exec -- playwright install chromium`; si el entorno
carece de bibliotecas, completar su instalación con `playwright install-deps chromium`
en un entorno con los permisos adecuados.

En el cierre de la implementación se aprobaron **14 pruebas unitarias** y
**8 pruebas de navegador**, además de ESLint, TypeScript y la compilación de
producción. Se comprobaron respuestas HTTP 200 para ambas rutas y capturas en
escritorio y móvil. La auditoría automática WCAG A/AA no detectó infracciones
en las vistas evaluadas; esto no sustituye una revisión manual de accesibilidad.

## Límites y continuidad hacia H3

- El registro es una simulación: no persiste datos, no crea cuentas y no envía emails.
- No existen pedidos, reservas, autenticación, inventario persistente ni integración con proveedores.
- Las funciones H2 están probadas como paquete, pero aún no están conectadas a una API o dashboard.
- La tasa de cambio es fija y los cálculos no usan aritmética contable de precisión arbitraria.
- Antes de procesar entradas externas deben validarse las entidades de negocio.
- Los siguientes pasos deben definirse con el briefing de H3. Como continuidad
  posible, la API correspondería a `services/`, el dashboard interno a `uis/backoffice/`
  y los contratos reutilizables a `packages/`, sin duplicar la lógica de operaciones.