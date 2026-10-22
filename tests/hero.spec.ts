import { test, expect } from "@playwright/test";

test("produtos e cards compartilham destaque e abrem suas categorias", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("csi-brand-intro-v1", "seen"),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const hero = page.locator(".hero-evolution");
  await page
    .getByRole("link", { name: "Explorar fios e cabos", exact: true })
    .focus();
  await expect(hero).toHaveAttribute("data-active-product", "cabos");
  await expect(page.locator(".hero-product-cables")).toHaveAttribute(
    "data-selected",
    "true",
  );
  await page
    .getByRole("link", { name: "Explorar fios e cabos", exact: true })
    .press("Enter");
  await expect(page).toHaveURL(/categoria=cabos/);
  await page.goto("/");
  await page.locator(".hero-glass-card").first().focus();
  await expect(hero).toHaveAttribute("data-active-product", "ar");
  await page.locator(".hero-glass-card").first().press("Enter");
  await expect(page).toHaveURL(/categoria=ar/);
});

test("cena preserva proporções e separa cards dos produtos no celular", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [320, 390, 760, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const ratios = await page
      .locator(".hero-product-crop img")
      .evaluateAll((images) =>
        images.map((el) => {
          const r = el.getBoundingClientRect();
          return r.width / r.height;
        }),
      );
    for (const ratio of ratios) expect(ratio).toBeCloseTo(2 / 3, 2);
    if (width <= 760) {
      const art = await page.locator(".hero-scene-visual").boundingBox();
      const cards = await page.locator(".hero-glass-cards").boundingBox();
      expect(cards!.y).toBeGreaterThanOrEqual(art!.y + art!.height - 1);
      for (const card of await page.locator(".hero-glass-card").all())
        expect((await card.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  }
});
