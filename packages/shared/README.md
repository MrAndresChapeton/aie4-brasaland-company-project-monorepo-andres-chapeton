# Tipos compartidos Brasaland

`@repo/shared-types` define las entidades del hito 2 en `types/index.ts`:
`Price`, `MenuItem`, `SaleTransaction`, `Location`, `WasteRecord` y `CountryMetrics`,
con sus uniones de monedas, estados, categorias, paises y metodos de pago.

No contiene logica de negocio ni dependencias de React. Las utilidades viven en
[`../operations/`](../operations/README.md).