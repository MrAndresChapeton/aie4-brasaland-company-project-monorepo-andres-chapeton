# Operaciones Brasaland - Hito 2

Paquete TypeScript independiente de React y Next.js. Implementa las especificaciones
de [CONTEXT_h2-brasaland.es.md](../../CONTEXT_h2-brasaland.es.md).

## Organizacion

- `src/utils/collections.ts`: 6 filtros y ordenamientos sin mutar los arrays.
- `src/utils/search.ts`: 3 busquedas, incluida busqueda binaria ascendente.
- `src/utils/transformations.ts`: 11 calculos de finanzas, scoring y reportes.
- `src/utils/validations.ts`: 3 validadores que acumulan errores.
- `src/index.ts`: API publica; las interfaces se reutilizan desde `packages/shared`.
- `tests/operations.test.ts`: pruebas con los valores del briefing y casos limite.

## Ejecutar

Requiere Node.js 24 y las dependencias de `uis/website` instaladas para el typecheck.
Desde la raiz: `npm test` y `npm run typecheck`.
Desde esta carpeta: `npm test` y `npm run typecheck`.

```typescript
import { convertCurrency, calculateDailyRevenue } from "./src/index.ts";

convertCurrency(18.5, "USD", "COP"); // 74000
calculateDailyRevenue([], new Date("2024-03-15T12:00:00Z"), "USD", "America/Bogota"); // 0
```

## Decisiones y casos limite

- Colecciones nulas o ausentes equivalen a arrays vacios. Las busquedas devuelven
  `null` o `-1`, y las agregaciones vacias devuelven cero o grupos vacios.
- Los filtros y ordenamientos crean arrays nuevos; no cambian sus entradas.
- Los rangos incluyen ambos instantes. Se rechazan fechas invalidas y rangos invertidos.
- Los ingresos diarios comparan fechas en una zona IANA explicita: por defecto
  `America/Bogota`; para Florida usar `America/New_York`, con horario de verano.
  Las fechas representan instantes; construirlas con `Z` o un offset explicito.
- Los importes se redondean al final a 2 decimales. La conversion usa 4000 COP/USD;
  convertir a la misma moneda conserva el importe original. No es contabilidad
  de precision arbitraria ni consulta una tasa de cambio externa.
- El costo de ingredientes se multiplica por cantidad. Productos o locaciones
  desconocidos en reportes producen `RangeError`, no margenes silenciosamente inflados.
- El margen se limita a 0-100 segun el briefing; una perdida se representa como 0.
- El desperdicio usa `cost` como costo total registrado, sin multiplicarlo otra vez.
- Scoring: apertura estimada el 1 de enero UTC de `openingYear`, al menos un dia
  operativo; sin ingresos el puntaje es 0. Eficiencia cuenta transacciones, no unidades.
- `scoreLocationPerformance` y `rankLocationsByPerformance` aceptan `asOf` como
  ultimo parametro opcional; `validateLocation` acepta `currentYear`. Pasarlos
  explicitamente hace reproducibles los resultados; por defecto usan la fecha actual.
- Los validadores rechazan importes no positivos, `NaN` e infinitos. Para entradas
  externas, validar las entidades antes de llamar a las funciones de procesamiento.
- Todos los metodos de pago y motivos de desperdicio aparecen aunque no tengan datos.
- No se implementan autenticacion, inventario persistente ni un dashboard operativo:
  H2 es el nucleo de logica que alimentara esas interfaces en futuros hitos.