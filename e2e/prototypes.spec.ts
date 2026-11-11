import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Portfolio de Joaquín Castro Salas" },
  { path: "/proto/agente", heading: /Hola, soy Joaquín/ },
  { path: "/proto/cosmos", heading: "Joaquín Castro Salas" },
];

/** Collects console errors and failed requests so a test can assert there were none. */
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

for (const { path, heading } of PAGES) {
  test.describe(path, () => {
    test("renders its heading without errors or horizontal scroll", async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(path);

      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });

    for (const theme of ["light", "dark"] as const) {
      test(`has no serious accessibility violations (${theme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        // Entrance animations fade text in; measure contrast once they have settled.
        await page.waitForFunction(() =>
          [...document.querySelectorAll("h1, h1 *")].every(
            (element) => getComputedStyle(element).opacity === "1",
          ),
        );

        const results = await new AxeBuilder({ page }).analyze();
        const serious = results.violations.filter(
          (violation) => violation.impact === "serious" || violation.impact === "critical",
        );
        expect(serious.map((violation) => `${violation.id}: ${violation.nodes[0]?.html}`)).toEqual(
          [],
        );
      });
    }
  });
}

test.describe("agent prototype", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/proto/agente");
  });

  test("answers a suggested question and cites the repository", async ({ page }) => {
    await page.getByRole("button", { name: "¿Qué has construido?" }).click();

    await expect(page.getByText(/Lo más completo es Cronista/)).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "Resuelto en" })).toBeAttached();
  });

  test("routes free text to the matching answer", async ({ page }) => {
    await page.getByLabel("Pregunta al agente por mi trabajo").fill("¿cómo evalúas un RAG?");
    await page.getByRole("button", { name: "Preguntar" }).click();

    await expect(page.getByText(/Midiéndolo antes de creérmelo/)).toBeVisible();
  });

  test("says so when it has no prepared answer", async ({ page }) => {
    await page.getByLabel("Pregunta al agente por mi trabajo").fill("¿cuál es tu color favorito?");
    await page.getByRole("button", { name: "Preguntar" }).click();

    await expect(page.getByText(/No tengo una respuesta preparada/)).toBeVisible();
  });

  test("opens a project and closes it with Escape", async ({ page }) => {
    await page.getByRole("button", { name: /Predicción de cancelaciones de hotel/ }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Ver el repositorio en GitHub" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("preferences", () => {
  test("theme and mascot survive a reload", async ({ page }) => {
    await page.goto("/proto/cosmos");
    const html = page.locator("html");

    await page.getByRole("button", { name: "Oscuro" }).click();
    await page.getByRole("button", { name: "Suave" }).click();
    await expect(html).toHaveClass(/dark/);
    await expect(html).toHaveAttribute("data-mascot", "soft");

    await page.reload();
    await expect(html).toHaveClass(/dark/);
    await expect(html).toHaveAttribute("data-mascot", "soft");
    await expect(page.getByRole("button", { name: "Oscuro" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("follows the system theme on a first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/proto/agente");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
