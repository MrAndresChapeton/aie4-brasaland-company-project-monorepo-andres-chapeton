export const citiesByCountry: Record<string, string[]> = {
  Colombia: ["Medellín", "Bogotá", "Cali"],
  "Estados Unidos": ["Miami", "Orlando"],
};

export const locationsByCity: Record<string, string[]> = {
  Medellín: ["El Poblado", "Laureles", "Envigado", "Sabaneta"],
  Bogotá: ["Usaquén", "Chapinero", "Zona Rosa"],
  Cali: ["Granada", "Ciudad Jardín", "Unicentro"],
  Miami: ["Brickell", "Coral Gables"],
  Orlando: ["Downtown", "International Drive"],
};

export const referralOptions = ["Redes sociales", "Recomendación", "Pasando por el local", "Búsqueda en internet", "Otro"];

export function validateRegistration(data: FormData, today = new Date()): Record<string, string> {
  const errors: Record<string, string> = {};
  const text = (field: string) => String(data.get(field) ?? "").trim();
  if (text("fullName").split(/\s+/).filter(Boolean).length < 2) errors.fullName = "Ingresa tu nombre completo (nombre y apellido)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email"))) errors.email = "Ingresa un email válido (ejemplo: nombre@correo.com)";
  const country = text("country");
  const city = text("city");
  const phone = text("phone");
  const digits = phone.replace(/[\s()-]/g, "");
  const phonePattern = country === "Colombia" ? /^\+57\d{10}$/ : country === "Estados Unidos" ? /^\+1\d{10}$/ : /^\+(57\d{10}|1\d{10})$/;
  if (!/^\+[\d\s()-]+$/.test(phone) || !phonePattern.test(digits)) errors.phone = "El teléfono debe incluir código de país (ejemplo: +57 300 123 4567 o +1 305 123 4567)";
  if (!Object.hasOwn(citiesByCountry, country)) errors.country = "Selecciona tu país";
  if (!Object.hasOwn(citiesByCountry, country) || !citiesByCountry[country].includes(city)) errors.city = "Selecciona tu ciudad";
  const favorite = text("favoriteLocation");
  if (favorite && (!Object.hasOwn(locationsByCity, city) || !locationsByCity[city].includes(favorite))) errors.favoriteLocation = "Selecciona una ubicación de tu ciudad";
  if (!referralOptions.includes(text("referral"))) errors.referral = "Cuéntanos cómo conociste Brasaland";
  const birthValue = text("birthDate");
  const birth = new Date(`${birthValue}T00:00:00Z`);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(birthValue) && Number.isFinite(birth.getTime()) && birth.toISOString().slice(0, 10) === birthValue;
  const birthday = birth.getUTCMonth() * 100 + birth.getUTCDate();
  const currentDay = today.getMonth() * 100 + today.getDate();
  const age = today.getFullYear() - birth.getUTCFullYear() - (currentDay < birthday ? 1 : 0);
  if (!validDate || age < 18) errors.birthDate = "Debes ser mayor de 18 años para registrarte en Brasa Points";
  if (data.get("terms") !== "on") errors.terms = "Debes aceptar los términos del programa Brasa Points para continuar";
  return errors;
}