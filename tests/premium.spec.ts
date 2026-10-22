import { test, expect } from "@playwright/test";

test("abertura por sessão, mega menu, visualização rápida e observações persistentes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expect(page.locator(".brand-intro")).toBeVisible();
  await expect(page.locator(".brand-intro")).toBeHidden({ timeout: 7000 });
  await expect(page.locator("h1")).toHaveAccessibleName(
    "Potência para criar. Conforto para viver.",
  );
  await page.reload();
  await expect(page.locator(".brand-intro")).toBeHidden();
  await page
    .getByRole("button", { name: "Abrir categorias do catálogo" })
    .click();
  await expect(page.locator("#mega-categories")).toBeVisible();
  await expect(page.locator(".mega-grid>a")).toHaveCount(8);
  await page.keyboard.press("Escape");
  await expect(page.locator("#mega-categories")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Abrir categorias do catálogo" }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Abrir categorias do catálogo" })
    .click();
  await page
    .locator(".mega-grid")
    .getByRole("link", { name: "Fios e cabos" })
    .click();
  await expect(page).toHaveURL(/categoria=cabos/);
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Visualizar Cabo flexível", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Cabo flexível", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(
      () =>
        !!document.querySelector("dialog")?.contains(document.activeElement),
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Aumentar quantidade na visualização" })
    .click();
  await page
    .getByRole("button", {
      name: "Adicionar à lista de orçamento",
      exact: true,
    })
    .click();
  await expect(page.locator(".quick-view-added")).toContainText("2 unidades");
  await page.getByRole("button", { name: "Ver minha lista" }).click();
  await expect(
    page.getByRole("heading", { name: "Lista de orçamento." }),
  ).toBeVisible();
  await expect(page.locator(".quantity span")).toHaveText("2");
  await page
    .getByLabel("Um detalhe que faz a diferença?")
    .fill("Confirmar a aplicação no meu projeto.");
  await page.getByText("Visualizar mensagem").click();
  await expect(page.locator(".message-details pre")).toContainText(
    "Observações:\nConfirmar a aplicação no meu projeto.",
  );
  await page.getByRole("button", { name: "Fechar lista" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Minha lista/ }).click();
  await expect(page.getByLabel("Um detalhe que faz a diferença?")).toHaveValue(
    "Confirmar a aplicação no meu projeto.",
  );
  await page
    .getByRole("button", { name: "Remover Cabo flexível", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Seu projeto começa aqui.",
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/catalogo");
  await page
    .getByRole("button", { name: "Visualizar Cabo flexível", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Visualizar Cabo flexível", exact: true }),
  ).toBeFocused();
  await page.getByLabel("Ordenar produtos").selectOption("name");
  const names = await page.locator(".product-card h3").allTextContents();
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "pt-BR")));
  expect(errors).toEqual([]);
});

test("responsividade, teclado, movimento reduzido e menu mobile", async ({
  page,
}) => {
  const hydrationErrors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && /hydrat/i.test(m.text()))
      hydrationErrors.push(m.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".brand-intro")).toBeHidden();
  expect(
    await page
      .locator(".hero-product-climate .hero-product-float")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  for (const width of [320, 390, 620, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow na largura ${width}`,
    ).toBe(true);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    expect(
      await page
        .locator(".cinematic-copy")
        .evaluate((el) => el.getBoundingClientRect().right <= innerWidth),
      `hero cortada na largura ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Abrir categorias do catálogo" })
    .click();
  await expect(page.locator(".mega-grid>a")).toHaveCount(8);
  await page
    .locator(".mega-grid")
    .getByRole("link", { name: "Iluminação LED" })
    .click();
  await expect(page.locator(".nav.open")).toHaveCount(0);
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Visualizar Lâmpada LED", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.keyboard.press("Escape");
  expect(hydrationErrors).toEqual([]);
});
