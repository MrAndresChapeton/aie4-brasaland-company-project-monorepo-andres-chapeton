import test from "node:test";
import assert from "node:assert/strict";
import { citiesByCountry, locationsByCity, validateRegistration } from "../lib/registration.ts";

function registration(overrides: Record<string, string> = {}): FormData {
  const form = new FormData();
  const data = { fullName: "Ana Perez", email: "ana@example.com", phone: "+57 300 123 4567", country: "Colombia", city: "Medellín", favoriteLocation: "El Poblado", referral: "Redes sociales", birthDate: "2000-01-01", terms: "on", ...overrides };
  for (const [field, value] of Object.entries(data)) form.set(field, value);
  return form;
}

const today = new Date(2026, 10, 9, 12);

test("registro valido en ambos paises y marketing opcional", () => {
  assert.deepEqual(validateRegistration(registration(), today), {});
  assert.deepEqual(validateRegistration(registration({ country: "Estados Unidos", city: "Miami", favoriteLocation: "Brickell", phone: "+1 305 123 4567" }), today), {});
  assert.deepEqual(validateRegistration(registration({ favoriteLocation: "" }), today), {});
});

test("errores requeridos y reenvio despues de corregir", () => {
  const data = new FormData();
  assert.equal(Object.keys(validateRegistration(data, today)).length, 8);
  data.set("fullName", "Ana");
  assert.ok(validateRegistration(data, today).fullName);
  data.set("fullName", "Ana Perez");
  assert.equal(validateRegistration(data, today).fullName, undefined);
});

test("edad exacta de 18, dia anterior, fechas futuras e imposibles", () => {
  assert.equal(validateRegistration(registration({ birthDate: "2008-11-09" }), today).birthDate, undefined);
  for (const birthDate of ["2008-11-10", "2027-01-01", "2000-02-30", "not-a-date", ""]) assert.ok(validateRegistration(registration({ birthDate }), today).birthDate);
});

test("telefono debe coincidir con pais y longitud", () => {
  for (const phone of ["3001234567", "+1 305 123 4567", "+57 300", "+57 abc 123 4567", "+57 300 123 45678"]) assert.ok(validateRegistration(registration({ phone }), today).phone);
  assert.equal(validateRegistration(registration({ phone: "+573001234567" }), today).phone, undefined);
});

test("ciudades y 14 sedes dependientes, email y terminos", () => {
  assert.equal(Object.values(locationsByCity).flat().length, 14);
  assert.equal(citiesByCountry.Colombia.length, 3);
  assert.ok(validateRegistration(registration({ city: "Miami" }), today).city);
  assert.ok(validateRegistration(registration({ favoriteLocation: "Brickell" }), today).favoriteLocation);
  assert.ok(validateRegistration(registration({ country: "toString" }), today).country);
  assert.ok(validateRegistration(registration({ email: "ana@", terms: "", referral: "invalid" }), today).email);
  assert.ok(validateRegistration(registration({ terms: "" }), today).terms);
});