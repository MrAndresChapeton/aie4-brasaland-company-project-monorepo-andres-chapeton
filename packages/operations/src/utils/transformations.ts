import type { Country, CountryMetrics, Currency, Location, MenuItem, PaymentMethod, SaleTransaction, WasteReason, WasteRecord } from "../../../shared/types/index.ts";
import { filterSalesByLocation } from "./collections.ts";
import type { Collection } from "./collections.ts";

function round(amount: number): number {
  if (!Number.isFinite(amount)) throw new RangeError("El importe debe ser finito");
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function amount(value: number): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError("El importe debe ser finito y no negativo");
  return value;
}

function revenue(sales: readonly SaleTransaction[], currency: Currency): number {
  return sales.reduce((total, sale) => total + amount(sale.totalPrice[currency]), 0);
}

export function calculateDailyRevenue(sales: Collection<SaleTransaction>, date: Date, currency: Currency, timeZone = "America/Bogota"): number {
  if (!Number.isFinite(date?.getTime())) throw new RangeError("La fecha no es valida");
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const day = formatter.format(date);
  const matching = (sales ?? []).filter((sale) => {
    if (!Number.isFinite(sale.timestamp?.getTime())) throw new RangeError("La fecha de venta no es valida");
    return formatter.format(sale.timestamp) === day;
  });
  return round(revenue(matching, currency));
}

export function calculateLocationMargin(sales: Collection<SaleTransaction>, menuItems: Collection<MenuItem>, locationId: string, currency: Currency): number {
  const localSales = filterSalesByLocation(sales, locationId);
  const totalRevenue = revenue(localSales, currency);
  const menu = new Map((menuItems ?? []).map((item) => [item.id, item]));
  const cost = localSales.reduce((total, sale) => {
    const item = menu.get(sale.itemId);
    if (!item) throw new RangeError(`Producto desconocido: ${sale.itemId}`);
    return total + amount(item.ingredientCost[currency]) * amount(sale.quantity);
  }, 0);
  return totalRevenue === 0 ? 0 : round(Math.max(0, Math.min(100, ((totalRevenue - cost) / totalRevenue) * 100)));
}

export function calculateWasteCost(wasteRecords: Collection<WasteRecord>, locationId: string, currency: Currency): number {
  return round((wasteRecords ?? []).filter((record) => record.locationId === locationId).reduce((total, record) => total + amount(record.cost[currency]), 0));
}

export function convertCurrency(value: number, fromCurrency: Currency, toCurrency: Currency): number {
  amount(value);
  if (fromCurrency === toCurrency) return value;
  return round(fromCurrency === "USD" ? value * 4000 : value / 4000);
}

export function scoreLocationPerformance(location: Location, sales: Collection<SaleTransaction>, wasteRecords: Collection<WasteRecord>, menuItems: Collection<MenuItem>, asOf = new Date()): number {
  if (!Number.isFinite(asOf?.getTime()) || !Number.isInteger(location.openingYear) || location.openingYear < 2008 || location.openingYear > asOf.getUTCFullYear() || !Number.isFinite(location.seatingCapacity) || location.seatingCapacity <= 0) {
    throw new RangeError("La locacion o fecha de referencia no es valida");
  }
  const localSales = filterSalesByLocation(sales, location.id);
  const totalRevenue = revenue(localSales, "USD");
  if (totalRevenue === 0) return 0;
  const operatingDays = Math.max(1, Math.floor((asOf.getTime() - Date.UTC(location.openingYear, 0, 1)) / 86400000) + 1);
  const revenueScore = Math.min(40, (totalRevenue / operatingDays / 1000) * 40);
  const efficiencyScore = Math.min(30, (localSales.length / location.seatingCapacity) * 30);
  const wasteScore = Math.max(0, 20 - (calculateWasteCost(wasteRecords, location.id, "USD") / totalRevenue) * 200);
  const marginScore = Math.min(10, calculateLocationMargin(localSales, menuItems, location.id, "USD") / 10);
  return round(revenueScore + efficiencyScore + wasteScore + marginScore);
}

export function rankLocationsByPerformance(locations: Collection<Location>, sales: Collection<SaleTransaction>, wasteRecords: Collection<WasteRecord>, menuItems: Collection<MenuItem>, asOf = new Date()): Array<{ location: Location; score: number }> {
  return (locations ?? []).map((location) => ({ location, score: scoreLocationPerformance(location, sales, wasteRecords, menuItems, asOf) })).sort((first, second) => second.score - first.score);
}

export function countSalesByPaymentMethod(sales: Collection<SaleTransaction>): Record<PaymentMethod, number> {
  const counts: Record<PaymentMethod, number> = { Cash: 0, "Credit card": 0, "Debit card": 0, "Digital wallet": 0 };
  for (const sale of sales ?? []) {
    if (!Object.hasOwn(counts, sale.paymentMethod)) throw new RangeError("Metodo de pago desconocido");
    counts[sale.paymentMethod] += 1;
  }
  return counts;
}

export function calculateAverageTicket(sales: Collection<SaleTransaction>, currency: Currency): number {
  return sales?.length ? round(revenue(sales, currency) / sales.length) : 0;
}

export function findTopSellingItems(sales: Collection<SaleTransaction>, menuItems: Collection<MenuItem>, topN: number): Array<{ item: MenuItem; totalSold: number }> {
  if (!Number.isInteger(topN) || topN < 0) throw new RangeError("topN debe ser un entero no negativo");
  const menu = new Map((menuItems ?? []).map((item) => [item.id, item]));
  const totals = new Map<string, number>();
  for (const sale of sales ?? []) {
    if (!menu.has(sale.itemId)) throw new RangeError(`Producto desconocido: ${sale.itemId}`);
    totals.set(sale.itemId, (totals.get(sale.itemId) ?? 0) + amount(sale.quantity));
  }
  return [...totals].map(([id, totalSold]) => ({ item: menu.get(id)!, totalSold })).sort((first, second) => second.totalSold - first.totalSold).slice(0, topN);
}

export function groupWasteByReason(wasteRecords: Collection<WasteRecord>): Record<WasteReason, WasteRecord[]> {
  const groups: Record<WasteReason, WasteRecord[]> = { Expired: [], "Cooking error": [], "Customer return": [], Damage: [], Other: [] };
  for (const record of wasteRecords ?? []) {
    if (!Object.hasOwn(groups, record.reason)) throw new RangeError("Motivo de desperdicio desconocido");
    groups[record.reason].push(record);
  }
  return groups;
}

export function calculateCountryComparison(sales: Collection<SaleTransaction>, locations: Collection<Location>, menuItems: Collection<MenuItem>): { Colombia: CountryMetrics; USA: CountryMetrics } {
  const knownLocations = new Set((locations ?? []).map((location) => location.id));
  const knownItems = new Set((menuItems ?? []).map((item) => item.id));
  for (const sale of sales ?? []) {
    if (!knownLocations.has(sale.locationId) || !knownItems.has(sale.itemId)) throw new RangeError("La venta referencia una locacion o producto desconocido");
  }
  function metrics(country: Country): CountryMetrics {
    const localLocations = (locations ?? []).filter((location) => location.country === country);
    const ids = new Set(localLocations.map((location) => location.id));
    const localSales = (sales ?? []).filter((sale) => ids.has(sale.locationId));
    const totalLocations = localLocations.length;
    const usd = revenue(localSales, "USD");
    const cop = revenue(localSales, "COP");
    return {
      totalLocations,
      totalRevenue: { USD: round(usd), COP: round(cop) },
      averageRevenuePerLocation: { USD: totalLocations ? round(usd / totalLocations) : 0, COP: totalLocations ? round(cop / totalLocations) : 0 },
      totalSales: localSales.length,
    };
  }
  return { Colombia: metrics("Colombia"), USA: metrics("USA") };
}