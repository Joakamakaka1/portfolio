import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** From this width up the notebook is a book with two faces showing; below it is a pager. */
const isBook = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

/** Asserts that a face of the notebook is the one (or one of the two) on show. */
async function expectShowing(page: Page, id: string) {
  const face = page.locator(`#${id}`);
  if (isBook(page)) {
    await expect(face).not.toHaveAttribute("inert");
  } else {
    // In the pager the face on show is the one centred in the screen.
    await expect
      .poll(() =>
        face.evaluate((element) => {
          const box = element.getBoundingClientRect();
          return Math.abs(box.left + box.width / 2 - window.innerWidth / 2) < 24;
        }),
      )
      .toBe(true);
  }
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

const PAGES = [
  { path: "/", name: "first screen and the closed notebook" },
  { path: "/#proyectos", name: "open notebook" },
  { path: "/#contacto", name: "last pages of the notebook" },
  { path: "/proyectos/cancelaciones-hotel", name: "project file" },
  { path: "/creditos", name: "credits" },
];

for (const { path, name } of PAGES) {
  test.describe(name, () => {
    test("renders one main heading, without errors or horizontal scroll", async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expectNoHorizontalScroll(page);
      expect(errors).toEqual([]);
    });

    for (const theme of ["light", "dark"] as const) {
      test(`has no serious accessibility violations (${theme})`, async ({ page }) => {
        // Without motion nothing is measured halfway through a transition.
        await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
        await page.goto(path);
        await expect(page.locator("html")).toHaveClass(theme === "dark" ? /dark/ : /^(?!.*dark)/);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page }).analyze();
        const serious = results.violations.filter(
          (violation) => violation.impact === "serious" || violation.impact === "critical",
        );
        expect(serious.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
      });
    }
  });
}

test.describe("first screen", () => {
  test("shows the collage as one picture with a text alternative", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("img", { name: /^Lámina I\./ })).toBeVisible();
  });
});

test.describe("notebook", () => {
  test("opens from the cover and keeps the page in the URL", async ({ page }) => {
    await page.goto("/");
    await expectShowing(page, "tapa");
    await page.getByRole("button", { name: "Abrir el cuaderno" }).click();
    await expect(page).toHaveURL(/#quien-soy$/);
    await expectShowing(page, "quien-soy");
    await expect(page.getByRole("heading", { name: /^Me llamo Joaquín/ })).toBeVisible();
  });

  test("turns pages forwards and backwards", async ({ page }) => {
    await page.goto("/#quien-soy");
    await expectShowing(page, "quien-soy");
    // A book turns a leaf (two pages); the pager moves one page.
    const next = isBook(page) ? "ahora" : "el-principio";
    await page.getByRole("button", { name: "Página siguiente" }).click();
    await expect(page).toHaveURL(new RegExp(`#${next}$`));
    await expectShowing(page, next);
    await page.getByRole("button", { name: "Página anterior" }).click();
    await expect(page).toHaveURL(/#quien-soy$/);
    await expectShowing(page, "quien-soy");
  });

  test("turns pages with the keyboard", async ({ page }) => {
    await page.goto("/#quien-soy");
    await page.getByRole("button", { name: "Página siguiente" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(new RegExp(`#${isBook(page) ? "ahora" : "el-principio"}$`));
    await page.keyboard.press("End");
    await expectShowing(page, "contacto");
    await page.keyboard.press("Home");
    await expectShowing(page, "tapa");
    await expect(page).not.toHaveURL(/#/);
  });

  test("opens at the page named in the URL", async ({ page }) => {
    await page.goto("/#proyectos");
    await expectShowing(page, "proyectos");
  });

  test("lays every page out in the index and opens the one picked", async ({ page }) => {
    await page.goto("/#quien-soy");
    await page.getByRole("button", { name: "Ver todas las páginas" }).click();
    const picks = page.getByRole("button", { name: /^Ir a la (tapa|página)/ });
    await expect(picks).toHaveCount(11);
    await page.getByRole("button", { name: "Ir a la página 6: Cronista" }).click();
    await expect(page).toHaveURL(/#cronista$/);
    await expectShowing(page, "cronista");
    await expect(picks).toHaveCount(0);
  });

  test("announces the pages on show", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir el cuaderno" }).click();
    const announced = isBook(page)
      ? "Páginas 1 y 2 de 10: Quién soy y El principio."
      : "Página 1 de 10: Quién soy.";
    await expect(page.getByText(announced)).toBeAttached();
  });

  test("keeps hidden pages out of reach in book mode", async ({ page }) => {
    test.skip(!isBook(page), "every page of the pager can be reached by scrolling");
    await page.goto("/");
    await expect(page.locator("#cronista")).toHaveAttribute("inert");
    await page.goto("/#cronista");
    await expect(page.locator("#cronista")).not.toHaveAttribute("inert");
    await expect(page.locator("#tapa")).toHaveAttribute("inert");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("lays every page out, one after another", async ({ page }) => {
    await page.goto("/#contacto");
    for (const title of [
      /^Me llamo Joaquín/,
      /^Primero aprendí/,
      "Cronista",
      "Dónde encontrarme.",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    await expect(page.locator("#contacto")).toBeInViewport();
    await expectNoHorizontalScroll(page);
  });
});

test.describe("projects", () => {
  test("goes from the notebook to a project file and back", async ({ page }) => {
    await page.goto("/#cronista");
    await expectShowing(page, "cronista");
    await page.locator("#cronista").getByRole("link", { name: "Leer la ficha" }).click();
    await expect(page).toHaveURL(/\/proyectos\/cronista$/);
    await expect(page.getByRole("heading", { level: 1, name: "Cronista" })).toBeVisible();
    await page.getByRole("link", { name: "Volver al cuaderno" }).click();
    await expect(page).toHaveURL(/\/#cronista$/);
    await expectShowing(page, "cronista");
  });

  test("never links to the private repository", async ({ page }) => {
    await page.goto("/proyectos/twochi");
    const file = page.getByRole("article");
    await expect(file.getByText("El repositorio es privado.")).toBeVisible();
    await expect(file.locator('a[href*="github.com"]')).toHaveCount(0);
  });

  test("answers an unknown project with the not-found page", async ({ page }) => {
    await page.goto("/proyectos/no-existe");
    await expect(page.getByText("Esta página se ha caído del cuaderno.")).toBeVisible();
  });
});

test.describe("credits", () => {
  test("links every print to its source", async ({ page }) => {
    await page.goto("/creditos");
    const sources = page
      .getByRole("main")
      .locator('a[href^="https://commons.wikimedia.org/wiki/File:"]');
    expect(await sources.count()).toBeGreaterThan(10);
    await expect(page.getByRole("link", { name: "Octopus macropus" })).toBeVisible();
  });
});

test.describe("theme", () => {
  test("survives a reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Tema oscuro" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: "Tema oscuro" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("follows the system on a first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
