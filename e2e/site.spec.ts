import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

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

/** The title of the step of the story that is on show. */
const stepOnShow = (page: Page) => page.locator('.story-step[data-active="true"] h2');

/** Opens the home page at a step of the story and waits until the stage is pinned there. */
async function openStory(page: Page, step: string) {
  // Reduced motion turns smooth scrolling off, so a scroll is over when it returns.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/#${step}`);
  await expect
    .poll(async () => Math.abs((await page.locator(".story-stage").boundingBox())?.y ?? 99))
    .toBeLessThan(2);
}

/** Scrolls the page by a fraction of the screen, as a reader would. */
async function scrollScreens(page: Page, screens: number) {
  await page.evaluate((amount) => window.scrollBy(0, amount * window.innerHeight), screens);
}

const PAGES = [
  { path: "/", name: "first screen" },
  { path: "/#ahora", name: "story" },
  { path: "/proyectos", name: "projects board" },
  { path: "/proyectos/cancelaciones-hotel", name: "open project" },
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

test.describe("story", () => {
  test("keeps the stage in place while the scroll changes the step", async ({ page }) => {
    await openStory(page, "quien-soy");
    await expect(stepOnShow(page)).toHaveText(/^Me llamo Joaquín/);
    await scrollScreens(page, 0.85);
    await expect(stepOnShow(page)).toHaveText(/^Primero aprendí/);
    await scrollScreens(page, 0.85);
    await expect(stepOnShow(page)).toHaveText(/^Después llegaron/);
    // The stage has not moved: it still fills the screen from the top.
    const stage = await page.locator(".story-stage").boundingBox();
    expect(Math.abs(stage?.y ?? 99)).toBeLessThan(2);
  });

  test("does not let the footer in until the last step has been on show", async ({ page }) => {
    await openStory(page, "lo-que-mido");
    await expect(page.locator("footer")).not.toBeInViewport();
    // Just short of the last anchor: the last step is on, the story still fills the screen.
    await scrollScreens(page, 0.8);
    await expect(stepOnShow(page)).toHaveText(/^Fuera del trabajo/);
    await expect(page.locator("footer")).not.toBeInViewport();
    await scrollScreens(page, 1.5);
    await expect(page.locator("footer")).toBeInViewport();
    await expect(stepOnShow(page)).toHaveText(/^Fuera del trabajo/);
  });

  test("opens at the step named in the URL", async ({ page }) => {
    await openStory(page, "ahora");
    await expect(stepOnShow(page)).toHaveText(/^Después llegaron/);
  });

  test("lands on the last step when the page jumps past the story", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(stepOnShow(page)).toHaveText(/^Fuera del trabajo/);
  });

  test("jumps to a chapter from the list of chapters", async ({ page }) => {
    await openStory(page, "quien-soy");
    const chapters = page.getByRole("navigation", { name: "Capítulos de la historia" });
    await chapters.getByRole("link", { name: /Lo que mido/ }).click();
    await expect(page).toHaveURL(/#lo-que-mido$/);
    await expect(stepOnShow(page)).toHaveText(/^Lo interesante pasa/);
    await expect(chapters.getByRole("link", { name: /Lo que mido/ })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  test("brings on the step that receives the focus", async ({ page }) => {
    await openStory(page, "quien-soy");
    await page.getByRole("link", { name: "Ver los proyectos" }).focus();
    await expect(stepOnShow(page)).toHaveText(/^Fuera del trabajo/);
  });

  test("leads to the projects from its last step", async ({ page }) => {
    await openStory(page, "por-mi-cuenta");
    await page.getByRole("link", { name: "Ver los proyectos" }).click();
    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(page.getByRole("heading", { level: 1, name: "Proyectos" })).toBeVisible();
  });
});

test.describe("projects", () => {
  const card = (page: Page, name: string) =>
    page.locator(".board-card").filter({ has: page.getByRole("heading", { name }) });

  test("shows every project as a numbered column", async ({ page }) => {
    await page.goto("/proyectos");
    await expect(page.locator(".board-col")).toHaveCount(4);
    await expect(page.locator(".board-number")).toHaveText(["01", "02", "03", "04"]);
    await expect(page.locator(".board-detail:visible")).toHaveCount(0);
  });

  test("opens a project over the whole board and closes it again", async ({ page }) => {
    await page.goto("/proyectos");
    await card(page, "Cronista").click();
    await expect(page).toHaveURL(/\/proyectos\/cronista$/);
    await expect(page).toHaveTitle(/^Cronista · /);
    const open = page.locator('.board-col[data-open="true"]');
    await expect(open.getByRole("heading", { name: "El problema" })).toBeVisible();
    // The other columns are out of sight and out of reach.
    await expect(page.locator(".board-col[inert]")).toHaveCount(3);
    // The open column takes the whole board.
    const board = await page.locator(".board").boundingBox();
    await expect.poll(async () => (await open.boundingBox())?.width).toBe(board?.width);

    const back = page.getByRole("link", { name: "Volver a los proyectos" });
    await expect(back).toBeFocused();
    await back.click();
    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(page).toHaveTitle(/^Proyectos · /);
    await expect(page.locator(".board-col[inert]")).toHaveCount(0);
    await expect(card(page, "Cronista")).toBeFocused();
  });

  test("closes the open project with the browser's back button", async ({ page }) => {
    await page.goto("/proyectos");
    await card(page, "Twochi").click();
    await expect(page).toHaveURL(/\/proyectos\/twochi$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(page.locator(".board-detail:visible")).toHaveCount(0);
  });

  test("opens at the project named in the URL", async ({ page }) => {
    await page.goto("/proyectos/cancelaciones-hotel");
    await expect(page).toHaveTitle(/^Predicción de cancelaciones de hotel · /);
    await expect(
      page.locator('.board-col[data-open="true"]').getByRole("heading", { name: "Cifras" }),
    ).toBeVisible();
  });

  test("never links to the private repository", async ({ page }) => {
    await page.goto("/proyectos/twochi");
    const open = page.locator('.board-col[data-open="true"]');
    await expect(open.getByText("El repositorio es privado.")).toBeVisible();
    await expect(open.locator('a[href*="github.com"]')).toHaveCount(0);
  });

  test("answers an unknown project with the not-found page", async ({ page }) => {
    await page.goto("/proyectos/no-existe");
    await expect(page.locator(".board")).toHaveCount(0);
    await expect(page.getByText("Esta página se ha caído.")).toBeVisible();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("tells the whole story, one step after another", async ({ page }) => {
    await page.goto("/");
    for (const title of [/^Me llamo Joaquín/, /^Primero aprendí/, /^Fuera del trabajo/]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    await expectNoHorizontalScroll(page);
  });

  test("opens and closes a project with plain links", async ({ page }) => {
    test.skip(
      !process.env.CI,
      "the dev server streams a project page, which needs JavaScript; the build prerenders it",
    );
    await page.goto("/proyectos");
    await page.locator('.board-card[href="/proyectos/cronista"]').click();
    await expect(page).toHaveURL(/\/proyectos\/cronista$/);
    await expect(page.getByRole("heading", { name: "El problema" })).toBeVisible();
    await page.getByRole("link", { name: "Volver a los proyectos" }).click();
    await expect(page).toHaveURL(/\/proyectos$/);
  });
});

test.describe("footer", () => {
  test("holds the ways to reach the author", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      /linkedin\.com/,
    );
    await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      /github\.com/,
    );
    await expect(footer.getByRole("link", { name: "Correo" })).toHaveAttribute("href", /^mailto:/);
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
