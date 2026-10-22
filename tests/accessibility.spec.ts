import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("páginas públicas e modal sem violações WCAG A/AA detectadas", async ({
  page,
}) => {
  const issues: unknown[] = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/catalogo", "/admin"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    if (route === "/catalogo")
      await expect(page.locator(".product-card")).toHaveCount(8);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    issues.push(
      ...results.violations.map((v) => ({
        route,
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    );
  }
  await page.goto("/catalogo");
  await page
    .getByRole("button", { name: "Visualizar Cabo flexível", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  issues.push(
    ...result.violations.map((v) => ({
      route: "quick-view",
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  );
  await page
    .getByRole("button", {
      name: "Adicionar à lista de orçamento",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Ver minha lista" }).click();
  await expect(page.locator(".drawer")).toBeVisible();
  const drawerResult = await new AxeBuilder({ page })
    .include(".drawer")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  issues.push(
    ...drawerResult.violations.map((v) => ({
      route: "quote-drawer",
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Abrir categorias do catálogo" })
    .click();
  await expect(page.locator("#mega-categories")).toBeVisible();
  const menuResult = await new AxeBuilder({ page })
    .include("header")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  issues.push(
    ...menuResult.violations.map((v) => ({
      route: "mega-menu",
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  );
  expect(issues).toEqual([]);
});
