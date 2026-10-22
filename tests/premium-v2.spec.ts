import { test, expect } from "@playwright/test";

test("busca sugere resultados reais de outras categorias e imagens quebradas têm alternativa", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/catalogo?categoria=cabos");
  await page.getByLabel("Pesquisar produtos").fill("LÂMPADA");
  await expect(page.getByText("Nenhum produto por aqui.")).toBeVisible();
  await page
    .locator(".search-suggestions")
    .getByRole("button", { name: /Lâmpada LED/ })
    .click();
  await expect(page).toHaveURL(/categoria=iluminacao/);
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.route("**/products/fotos/*.webp", (route) => route.abort());
  await page.reload();
  await expect(page.locator(".product-image-fallback").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Visualizar Lâmpada LED", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("efeitos dos produtos respondem ao foco sem animação com movimento reduzido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const [name, effect] of [
    ["Explorar iluminação", "iluminacao"],
    ["Explorar ar-condicionado", "ar"],
    ["Explorar fios e cabos", "cabos"],
  ]) {
    await page.getByRole("link", { name, exact: true }).focus();
    await expect(page.locator(`.response-${effect}`)).toHaveCSS("opacity", "1");
  }
  await expect(page.locator(".response-cabos path")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("painel rejeita imagem corrompida e mantém informações técnicas após recarregar", async ({
  page,
}) => {
  await page.goto("/admin");
  await page
    .getByLabel("Senha de acesso")
    .fill("csi-e2e-only-not-for-deployment");
  await page.getByRole("button", { name: "Acessar painel" }).click();
  await page.getByRole("button", { name: "Novo produto" }).click();
  await page
    .getByLabel("Nome do produto", { exact: true })
    .fill("Produto com ficha confirmada");
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Descrição cadastrada pelo proprietário.");
  await page
    .getByLabel("Informações técnicas · opcional")
    .fill("Informação fornecida pelo proprietário para teste.");
  await page.locator("#product-image").setInputFiles({
    name: "corrompida.png",
    mimeType: "image/png",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.locator(".edit-modal").getByRole("alert")).toContainText(
    "Imagem inválida",
  );
  await page.getByRole("button", { name: "Salvar produto" }).click();
  await expect(page.locator(".admin-save-status")).toContainText(
    "Último produto salvo",
  );
  await page.reload();
  await page.goto("/catalogo");
  await page
    .getByRole("button", {
      name: "Visualizar Produto com ficha confirmada",
      exact: true,
    })
    .click();
  await expect(page.locator(".product-specifications")).toContainText(
    "Informação fornecida pelo proprietário para teste.",
  );
});
