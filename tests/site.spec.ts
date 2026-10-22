import { test, expect } from "@playwright/test";
test("catálogo, orçamento, painel protegido, CRUD e experiência móvel", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Potência para criar",
  );
  await expect(page.locator(".category-card")).toHaveCount(8);
  await expect(page.locator(".product-card")).toHaveCount(4);
  for (const section of await page.locator("main section").all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(130);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  await page.screenshot({ path: "/tmp/csi-desktop.png", fullPage: true });
  await page
    .getByRole("link", { name: "Explorar catálogo", exact: true })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  const search = page.getByRole("textbox", { name: "Pesquisar produtos" });
  await search.fill("lampada");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card h3")).toHaveText("Lâmpada LED");
  await search.fill("não existe");
  await expect(page.getByText("Nenhum produto por aqui.")).toBeVisible();
  await page.getByRole("button", { name: "Limpar busca e filtros" }).click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page
    .getByRole("button", { name: "Fios e cabos", exact: false })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Adicionar à lista: Cabo flexível" })
    .click();
  await page.getByRole("button", { name: /Minha lista/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Aumentar quantidade de Cabo flexível",
    })
    .click();
  await expect(page.locator(".quantity span")).toHaveText("2");
  await page.getByText("Visualizar mensagem").click();
  await expect(page.locator(".message-details pre")).toContainText(
    "Cabo flexível — 2 un.",
  );
  await page.getByRole("button", { name: "Fechar lista" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Minha lista/ }).click();
  await expect(page.locator(".quantity span")).toHaveText("2");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto("/admin");
  await expect(page.getByLabel("Senha de acesso")).toBeVisible();
  await page.getByLabel("Senha de acesso").fill("errada");
  await page.getByRole("button", { name: "Acessar painel" }).click();
  await expect(page.locator(".error[role=alert]")).toHaveText(
    "Senha incorreta.",
  );
  await page
    .getByLabel("Senha de acesso")
    .fill("csi-e2e-only-not-for-deployment");
  await page.getByRole("button", { name: "Acessar painel" }).click();
  await expect(
    page.getByRole("heading", { name: "Bom ter você por aqui." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Categorias", exact: true }).click();
  await page.getByLabel("Nome da categoria").fill("Categoria E2E");
  await page.getByRole("button", { name: "Adicionar categoria" }).click();
  await expect(
    page.locator(".category-admin-row").filter({ hasText: "Categoria E2E" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Produtos", exact: true }).click();
  await page.getByRole("button", { name: "Novo produto" }).click();
  await page.getByLabel("Nome do produto").fill("Produto E2E");
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Produto temporário para teste funcional");
  await page
    .getByLabel("Categoria", { exact: true })
    .selectOption({ label: "Categoria E2E" });
  await page.getByLabel("Preço (R$) · opcional").fill("29.90");
  await page.getByLabel("Adicionar imagem").setInputFiles({
    name: "teste.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1cAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(
    page.locator("tr").filter({ hasText: "Produto E2E" }),
  ).toContainText("R$ 29,90");
  await page
    .getByRole("button", { name: "Editar Produto E2E", exact: true })
    .click();
  await page.getByLabel("Nome do produto").fill("Produto E2E editado");
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await page.reload();
  await expect(
    page.locator("tr").filter({ hasText: "Produto E2E editado" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Excluir Produto E2E editado", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Excluir produto", exact: true })
    .click();
  await expect(
    page.locator("tr").filter({ hasText: "Produto E2E editado" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Categorias", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Excluir categoria Categoria E2E",
      exact: true,
    })
    .click();
  await expect(
    page.locator(".category-admin-row").filter({ hasText: "Categoria E2E" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Sair do painel" }).click();
  await expect(page.getByLabel("Senha de acesso")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const section of await page.locator("main section").all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(130);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  await page.screenshot({ path: "/tmp/csi-mobile.png", fullPage: true });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Catálogo" })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(8);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Filtrar categorias" }).click();
  await page
    .locator(".catalog-sidebar")
    .getByRole("button", { name: "Ar-condicionado", exact: false })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});
