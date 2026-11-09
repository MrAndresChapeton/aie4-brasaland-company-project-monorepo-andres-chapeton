import type { Location, MenuItem, Price, SaleTransaction } from "../../../shared/types/index.ts";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function validatePrice(price: Price | undefined, field: string, errors: string[]): void {
  for (const currency of ["USD", "COP"] as const) {
    if (!positive(price?.[currency])) errors.push(`${field}.${currency} debe ser mayor que cero y finito`);
  }
}

export function validateMenuItem(item: MenuItem | null | undefined): ValidationResult {
  const errors: string[] = [];
  if (!item) return { valid: false, errors: ["El item es obligatorio"] };
  if (!item.name?.trim()) errors.push("El nombre es obligatorio");
  validatePrice(item.basePrice, "basePrice", errors);
  validatePrice(item.ingredientCost, "ingredientCost", errors);
  if (!positive(item.prepTimeMinutes) || item.prepTimeMinutes > 60) errors.push("La preparacion debe durar entre 0 y 60 minutos, sin incluir 0");
  if (!item.isAvailableInColombia && !item.isAvailableInUSA) errors.push("El item debe estar disponible en al menos un pais");
  return { valid: errors.length === 0, errors };
}

export function validateSaleTransaction(sale: SaleTransaction | null | undefined): ValidationResult {
  const errors: string[] = [];
  if (!sale) return { valid: false, errors: ["La venta es obligatoria"] };
  if (!positive(sale.quantity)) errors.push("La cantidad debe ser mayor que cero y finita");
  validatePrice(sale.totalPrice, "totalPrice", errors);
  if (!sale.waiterName?.trim()) errors.push("El nombre de quien atiende es obligatorio");
  if (!(sale.timestamp instanceof Date) || !Number.isFinite(sale.timestamp.getTime())) errors.push("La fecha de venta no es valida");
  return { valid: errors.length === 0, errors };
}

export function validateLocation(location: Location | null | undefined, currentYear = new Date().getUTCFullYear()): ValidationResult {
  const errors: string[] = [];
  if (!location) return { valid: false, errors: ["La locacion es obligatoria"] };
  if (!Number.isInteger(location.openingYear) || location.openingYear < 2008 || location.openingYear > currentYear) errors.push("El ano de apertura debe estar entre 2008 y el ano actual");
  if (!positive(location.seatingCapacity)) errors.push("La capacidad debe ser mayor que cero y finita");
  if (!positive(location.staffCount)) errors.push("El personal debe ser mayor que cero y finito");
  validatePrice(location.monthlyRentCost, "monthlyRentCost", errors);
  validatePrice(location.averageMonthlyUtilities, "averageMonthlyUtilities", errors);
  return { valid: errors.length === 0, errors };
}