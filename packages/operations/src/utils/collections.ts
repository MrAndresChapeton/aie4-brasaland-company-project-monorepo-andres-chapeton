import type { Currency, Location, MenuCategory, MenuItem, SaleTransaction } from "../../../shared/types/index.ts";

export type Collection<T> = readonly T[] | null | undefined;

export function filterSalesByLocation(sales: Collection<SaleTransaction>, locationId: string): SaleTransaction[] {
  return (sales ?? []).filter((sale) => sale.locationId === locationId);
}

export function filterSalesByDateRange(sales: Collection<SaleTransaction>, startDate: Date, endDate: Date): SaleTransaction[] {
  if (!Number.isFinite(startDate?.getTime()) || !Number.isFinite(endDate?.getTime()) || startDate > endDate) {
    throw new RangeError("El rango de fechas no es valido");
  }
  return (sales ?? []).filter((sale) => sale.timestamp >= startDate && sale.timestamp <= endDate);
}

export function filterMenuItemsByCategory(items: Collection<MenuItem>, category: MenuCategory): MenuItem[] {
  return (items ?? []).filter((item) => item.category === category);
}

export function filterActiveLocations(locations: Collection<Location>): Location[] {
  return (locations ?? []).filter((location) => location.status === "Active");
}

export function sortLocationsByCapacity(locations: Collection<Location>, order: "asc" | "desc"): Location[] {
  return [...(locations ?? [])].sort((first, second) => (first.seatingCapacity - second.seatingCapacity) * (order === "asc" ? 1 : -1));
}

export function sortMenuItemsByPrice(items: Collection<MenuItem>, currency: Currency, order: "asc" | "desc"): MenuItem[] {
  return [...(items ?? [])].sort((first, second) => (first.basePrice[currency] - second.basePrice[currency]) * (order === "asc" ? 1 : -1));
}