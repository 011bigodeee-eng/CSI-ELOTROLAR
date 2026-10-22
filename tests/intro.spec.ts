import { test, expect } from "@playwright/test";

test("a primeira pintura fica coberta e pular funciona antes da hidratação", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  const html = await response!.text();
  expect(html.indexOf('id="csi-intro-bootstrap"')).toBeLessThan(
    html.indexOf('id="csi-site-shell"'),
  );
  await expect(page.locator("#csi-brand-intro")).toBeVisible();
  expect(
    await page
      .locator("#csi-site-shell")
      .evaluate((el) => getComputedStyle(el).visibility),
  ).toBe("hidden");
  await expect(page.locator("header")).toBeHidden();
  await expect(page.locator(".cinematic-hero")).toBeHidden();
  await page.getByRole("button", { name: "Pular introdução" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-csi-intro", "done", {
    timeout: 1000,
  });
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page
      .locator("#csi-site-shell")
      .evaluate((el) => (el as HTMLElement).inert),
  ).toBe(false);
});

test("seis cenas, revelação completa em aproximadamente 5 segundos e nenhuma repetição", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.addInitScript(() => {
    const frames: { state: string; visible: boolean }[] = [];
    (window as unknown as { introFrames: typeof frames }).introFrames = frames;
    function sample() {
      const shell = document.getElementById("csi-site-shell"),
        state = document.documentElement.dataset.csiIntro;
      if (shell && state)
        frames.push({
          state,
          visible: getComputedStyle(shell).visibility === "visible",
        });
      if (state !== "done") requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await page.goto("/");
  await expect(page.locator("#csi-brand-intro")).toBeVisible();
  expect(
    await page
      .locator(".intro-mark-solid .brand-symbol")
      .evaluate((el) => getComputedStyle(el).clipPath),
  ).toContain("polygon");
  await expect(page.locator("html")).toHaveAttribute("data-csi-intro", "done", {
    timeout: 7000,
  });
  const observation = await page.evaluate(() => ({
    elapsed: performance.now() - (window.__CSI_INTRO__?.start || 0),
    frames: (
      window as unknown as {
        introFrames: { state: string; visible: boolean }[];
      }
    ).introFrames,
    active: window.__CSI_INTRO__?.active,
  }));
  expect(observation.elapsed).toBeGreaterThanOrEqual(5000);
  expect(observation.elapsed).toBeLessThan(6800);
  expect(observation.active).toBe(false);
  const covered = observation.frames.filter((f) => f.state === "playing");
  expect(covered.length).toBeGreaterThan(0);
  expect(covered.every((f) => !f.visible)).toBe(true);
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator(".cinematic-hero")).toBeVisible();
  await page
    .getByRole("link", { name: "Explorar catálogo", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.getByRole("link", { name: "CSI Eletrolar, início" }).click();
  await expect(page.locator("#csi-brand-intro")).toBeHidden();
  await page.reload();
  await expect(page.locator("#csi-brand-intro")).toBeHidden();
  expect(errors).toEqual([]);
});

test("mobile simplificado permite pular por teclado e respeita mudança de preferência", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-csi-intro-lite",
    "true",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Pular introdução" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#csi-brand-intro")).toBeHidden({ timeout: 1000 });
  await page.evaluate(() => sessionStorage.removeItem("csi-brand-intro-v1"));
  await page.reload();
  await expect(page.locator("#csi-brand-intro")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#csi-brand-intro")).toBeHidden();
  expect(
    await page
      .locator("#csi-site-shell")
      .evaluate((el) => (el as HTMLElement).inert),
  ).toBe(false);
});

test("armazenamento bloqueado e movimento reduzido liberam a página sem erro", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#csi-brand-intro")).toBeHidden();
  await expect(page.locator("h1")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() =>
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await page.reload();
  await expect(page.locator("#csi-brand-intro")).toBeHidden();
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toEqual([]);
});

test("sem JavaScript a homepage continua acessível", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://localhost:3000");
    await expect(page.locator("#csi-brand-intro")).toBeHidden();
    await expect(page.locator("h1")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("watchdog libera a página se o CSS da timeline falhar", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const intro = document.getElementById("csi-brand-intro");
      if (intro) {
        intro.style.animation = "none";
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-csi-intro", "done", {
    timeout: 9000,
  });
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page
      .locator("#csi-site-shell")
      .evaluate((el) => (el as HTMLElement).inert),
  ).toBe(false);
});
