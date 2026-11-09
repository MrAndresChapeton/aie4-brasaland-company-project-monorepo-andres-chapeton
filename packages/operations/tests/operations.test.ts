import test from "node:test";
import assert from "node:assert/strict";
import * as operations from "../src/index.ts";
import type { Location, MenuItem, SaleTransaction, WasteRecord } from "../src/index.ts";

const item: MenuItem = { id: "PICANHA", name: "Picanha 250g", category: "Meat", basePrice: { USD: 18.5, COP: 74000 }, ingredientCost: { USD: 7.2, COP: 28800 }, prepTimeMinutes: 15, isAvailableInColombia: true, isAvailableInUSA: true, allergens: [], status: "Active" };
const fries: MenuItem = { ...item, id: "FRIES", name: "Papas Fritas", category: "Side", basePrice: { USD: 4.5, COP: 18000 }, ingredientCost: { USD: 1.2, COP: 4800 } };
const location: Location = { id: "MEDELLIN", name: "Medellin Centro", city: "Medellin", country: "Colombia", openingYear: 2008, seatingCapacity: 80, staffCount: 12, monthlyRentCost: { USD: 1500, COP: 6000000 }, averageMonthlyUtilities: { USD: 400, COP: 1600000 }, manager: "Carlos", status: "Active" };
const miami: Location = { ...location, id: "MIAMI", country: "USA", seatingCapacity: 100, openingYear: 2018 };
const sale: SaleTransaction = { id: "TX-1", locationId: location.id, itemId: item.id, quantity: 2, totalPrice: { USD: 37, COP: 148000 }, paymentMethod: "Credit card", timestamp: new Date("2024-03-16T00:30:00Z"), waiterName: "Maria" };
const secondSale: SaleTransaction = { ...sale, id: "TX-2", locationId: miami.id, itemId: fries.id, quantity: 3, totalPrice: { USD: 13.5, COP: 54000 }, paymentMethod: "Cash" };
const waste: WasteRecord = { id: "W-1", locationId: location.id, itemId: item.id, quantity: 1, reason: "Expired", cost: { USD: 7.2, COP: 28800 }, timestamp: sale.timestamp, reportedBy: "Maria" };
const menu = [item, fries];
const sales = [sale, secondSale];

test("colecciones: filtros por locacion, categoria, estado y rango inclusivo", () => {
  assert.deepEqual(operations.filterSalesByLocation(sales, location.id), [sale]);
  assert.deepEqual(operations.filterSalesByDateRange(sales, sale.timestamp, sale.timestamp), sales);
  assert.deepEqual(operations.filterMenuItemsByCategory(menu, "Side"), [fries]);
  assert.deepEqual(operations.filterActiveLocations([location, { ...miami, status: "Under renovation" }]), [location]);
  assert.deepEqual(operations.filterSalesByLocation(null, "none"), []);
  assert.throws(() => operations.filterSalesByDateRange(sales, new Date("invalid"), new Date()), RangeError);
  assert.throws(() => operations.filterSalesByDateRange(sales, new Date("2025-01-01"), new Date("2024-01-01")), RangeError);
});

test("ordenamientos en ambas direcciones y monedas sin mutaciones", () => {
  const locations = Object.freeze([location, miami]);
  assert.deepEqual(operations.sortLocationsByCapacity(locations, "desc"), [miami, location]);
  assert.deepEqual(operations.sortLocationsByCapacity(locations, "asc"), [location, miami]);
  for (const currency of ["USD", "COP"] as const) {
    assert.deepEqual(operations.sortMenuItemsByPrice(Object.freeze(menu), currency, "asc"), [fries, item]);
    assert.deepEqual(operations.sortMenuItemsByPrice(menu, currency, "desc"), menu);
  }
  assert.deepEqual(locations, [location, miami]);
  assert.deepEqual(menu, [item, fries]);
});

test("busquedas lineales y binarias: encontrados, ausentes y vacios", () => {
  assert.equal(operations.findLocationById([location], location.id), location);
  assert.equal(operations.findLocationById(null, "none"), null);
  assert.equal(operations.findMenuItemByName(menu, "pICANHA 250G"), item);
  assert.equal(operations.findMenuItemByName(menu, "none"), null);
  assert.equal(operations.binarySearchLocationByCapacity([location, miami], 100), 1);
  assert.equal(operations.binarySearchLocationByCapacity([location, miami], 80), 0);
  assert.equal(operations.binarySearchLocationByCapacity([location, miami], 90), -1);
  assert.equal(operations.binarySearchLocationByCapacity([], 90), -1);
});

test("ingresos por dia local, medianoche y horario de verano Miami", () => {
  const date = new Date("2024-03-15T12:00:00Z");
  assert.equal(operations.calculateDailyRevenue(sales, date, "USD"), 50.5);
  assert.equal(operations.calculateDailyRevenue(sales, date, "COP"), 202000);
  assert.equal(operations.calculateDailyRevenue(sales, date, "USD", "UTC"), 0);
  const spring = { ...sale, timestamp: new Date("2024-03-10T07:30:00Z") };
  assert.equal(operations.calculateDailyRevenue([spring], new Date("2024-03-10T12:00:00Z"), "USD", "America/New_York"), 37);
  assert.throws(() => operations.calculateDailyRevenue([], new Date("bad"), "USD"), RangeError);
});

test("finanzas: margen ponderado por cantidades, desperdicio y cambio", () => {
  for (const currency of ["USD", "COP"] as const) {
    assert.equal(operations.calculateLocationMargin(sales, menu, location.id, currency), 61.08);
    assert.equal(operations.calculateAverageTicket(sales, currency), currency === "USD" ? 25.25 : 101000);
    assert.equal(operations.calculateWasteCost([waste], location.id, currency), waste.cost[currency]);
  }
  assert.equal(operations.convertCurrency(18.5, "USD", "COP"), 74000);
  assert.equal(operations.convertCurrency(74000, "COP", "USD"), 18.5);
  assert.equal(operations.convertCurrency(1.2345, "USD", "USD"), 1.2345);
  assert.equal(operations.convertCurrency(100, "COP", "USD"), 0.03);
  assert.throws(() => operations.convertCurrency(NaN, "USD", "COP"), RangeError);
  assert.throws(() => operations.calculateLocationMargin(sales, [], location.id, "USD"), /desconocido/);
  assert.equal(operations.calculateLocationMargin([{ ...sale, totalPrice: { USD: 1, COP: 4000 } }], menu, location.id, "USD"), 0);
});

test("scoring reproducible: limites, dias de apertura y ranking", () => {
  const opening = { ...location, openingYear: 2024, seatingCapacity: 1 };
  const large = { ...sale, totalPrice: { USD: 10000, COP: 40000000 } };
  assert.equal(operations.scoreLocationPerformance(opening, [large], [], [{ ...item, ingredientCost: { USD: 0, COP: 0 } }], new Date("2024-01-01T00:00:00Z")), 100);
  assert.equal(operations.scoreLocationPerformance(location, [], [], menu, new Date("2024-01-01")), 0);
  const ranked = operations.rankLocationsByPerformance([location, miami], sales, [waste], menu, new Date("2024-03-16"));
  assert.ok(ranked[0].score >= ranked[1].score);
  assert.ok(ranked.every(({ score }) => score >= 0 && score <= 100));
  assert.throws(() => operations.scoreLocationPerformance({ ...location, seatingCapacity: 0 }, sales, [], menu), RangeError);
});

test("agregaciones por metodo, cantidad vendida, desperdicio y pais", () => {
  assert.deepEqual(operations.countSalesByPaymentMethod(sales), { Cash: 1, "Credit card": 1, "Debit card": 0, "Digital wallet": 0 });
  assert.deepEqual(operations.findTopSellingItems(sales, menu, 1), [{ item: fries, totalSold: 3 }]);
  assert.deepEqual(operations.findTopSellingItems(sales, menu, 0), []);
  assert.throws(() => operations.findTopSellingItems(sales, menu, -1), RangeError);
  assert.deepEqual(operations.groupWasteByReason([waste]).Expired, [waste]);
  assert.deepEqual(operations.groupWasteByReason([waste]).Damage, []);
  const comparison = operations.calculateCountryComparison(sales, [location, miami], menu);
  assert.equal(comparison.Colombia.totalRevenue.COP, 148000);
  assert.equal(comparison.USA.averageRevenuePerLocation.USD, 13.5);
  assert.equal(comparison.USA.totalSales, 1);
  assert.throws(() => operations.calculateCountryComparison(sales, [], menu), RangeError);
});

test("colecciones vacias o nulas producen resultados neutros", () => {
  assert.equal(operations.calculateDailyRevenue(null, sale.timestamp, "USD"), 0);
  assert.equal(operations.calculateLocationMargin(null, null, "none", "USD"), 0);
  assert.equal(operations.calculateWasteCost(null, "none", "USD"), 0);
  assert.equal(operations.calculateAverageTicket(null, "USD"), 0);
  assert.deepEqual(operations.rankLocationsByPerformance(null, null, null, null), []);
  assert.deepEqual(operations.findTopSellingItems(null, null, 3), []);
  assert.deepEqual(operations.calculateCountryComparison(null, null, null).USA, { totalLocations: 0, totalRevenue: { USD: 0, COP: 0 }, averageRevenuePerLocation: { USD: 0, COP: 0 }, totalSales: 0 });
});

test("validaciones: datos validos, nulos y reglas de negocio", () => {
  assert.deepEqual(operations.validateMenuItem(item), { valid: true, errors: [] });
  assert.equal(operations.validateSaleTransaction(sale).valid, true);
  assert.equal(operations.validateLocation(location, 2024).valid, true);
  assert.equal(operations.validateMenuItem(null).valid, false);
  assert.equal(operations.validateSaleTransaction(null).valid, false);
  assert.equal(operations.validateLocation(null).valid, false);
  const invalid = operations.validateMenuItem({ ...item, name: " ", prepTimeMinutes: 61, basePrice: { USD: NaN, COP: -1 }, isAvailableInColombia: false, isAvailableInUSA: false });
  assert.equal(invalid.errors.length, 5);
  assert.equal(invalid.valid, false);
  for (const value of [0, -1, NaN, Infinity]) {
    assert.equal(operations.validateSaleTransaction({ ...sale, quantity: value }).valid, false);
    assert.equal(operations.validateLocation({ ...location, staffCount: value }).valid, false);
    assert.equal(operations.validateMenuItem({ ...item, prepTimeMinutes: value }).valid, false);
  }
  assert.equal(operations.validateSaleTransaction({ ...sale, waiterName: " ", timestamp: new Date("bad") }).errors.length, 2);
  for (const openingYear of [2007, 2025, 2020.5]) assert.equal(operations.validateLocation({ ...location, openingYear }, 2024).valid, false);
  assert.equal(operations.validateLocation({ ...location, monthlyRentCost: { USD: 0, COP: Infinity }, averageMonthlyUtilities: { USD: -1, COP: NaN } }).errors.length, 4);
});