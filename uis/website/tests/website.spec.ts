import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing, imagenes, SEO y ancho adaptable sin errores de React", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("El sabor de la brasa, en cada bocado");
  await expect(page.getByRole("heading", { name: "Contacto", exact: true })).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  expect(JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}")["@type"]).toBe("Restaurant");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/brasaland\.com\/?$/);
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("landing.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("errores accesibles, correccion y registro exitoso sin ofertas preseleccionadas", async ({ page }, testInfo) => {
  await page.goto("/#registro");
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
  await expect(page.locator("#fullName")).toBeFocused();
  await expect(page.locator("#fullName-error")).toHaveText("Ingresa tu nombre completo (nombre y apellido)");
  await page.locator("#fullName").fill("Ana Perez");
  await page.locator("#email").fill("ana@example.com");
  await page.locator("#country").selectOption("Colombia");
  await page.locator("#city").selectOption("Medellín");
  await page.locator("#favoriteLocation").selectOption("El Poblado");
  await page.locator("#phone").fill("+57 300 123 4567");
  await page.locator("#birthDate").fill("2000-01-01");
  await page.locator("#referral").selectOption("Redes sociales");
  await expect(page.locator('[name="offers"]')).not.toBeChecked();
  await page.locator("#terms").check();
  await page.screenshot({ path: testInfo.outputPath("registro.png"), fullPage: true });
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await expect(page.getByRole("status")).toContainText("¡Bienvenido a Brasa Points!");
  await page.getByRole("button", { name: "Registrar otra cuenta" }).click();
  await expect(page.locator("#fullName")).toHaveValue("");
  await expect(page.locator("#city")).toBeDisabled();
});

test("cambio de pais y ciudad limpia selecciones y comprueba telefono", async ({ page }) => {
  await page.goto("/registro#registro");
  await page.locator("#country").selectOption("Colombia");
  await page.locator("#city").selectOption("Medellín");
  await expect(page.locator("#favoriteLocation option")).toHaveCount(5);
  await page.locator("#favoriteLocation").selectOption("El Poblado");
  await page.locator("#city").selectOption("Bogotá");
  await expect(page.locator("#favoriteLocation")).toHaveValue("");
  await page.locator("#country").selectOption("Estados Unidos");
  await expect(page.locator("#city")).toHaveValue("");
  await expect(page.locator("#city option")).toHaveCount(3);
  await expect(page.locator("#favoriteLocation")).toBeDisabled();
  await page.locator("#city").selectOption("Miami");
  await expect(page.locator("#favoriteLocation option")).toHaveCount(3);
  await page.locator("#phone").fill("+57 300 123 4567");
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await expect(page.locator("#phone-error")).toBeVisible();
});

test("auditoria automatizada WCAG A y AA", async ({ page }) => {
  await page.goto("/");
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(result.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
});