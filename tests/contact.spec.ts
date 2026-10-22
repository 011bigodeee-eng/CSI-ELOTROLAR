import { test, expect } from "@playwright/test";

test("contato oficial, endereço e mensagem de orçamento usam os dados da loja", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const talk = page.getByRole("link", {
    name: "Vamos conversar pelo WhatsApp da loja",
  });
  await expect(talk).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/5516997797959\?text=/,
  );
  await expect(talk).toHaveAttribute("target", "_blank");
  await page
    .getByRole("link", { name: "Vamos conversar", exact: true })
    .focus();
  await expect(
    page.getByRole("link", { name: "Vamos conversar", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".store-address")).toContainText(
    "Pedro Speranza, 73",
  );
  await expect(page.locator(".store-address")).toContainText("13593-062");
  const map = new URL(
    (await page
      .getByRole("link", { name: "Ver endereço da loja no mapa" })
      .getAttribute("href"))!,
  );
  expect(map.searchParams.get("query")).toContain(
    "Dourado, São Paulo, 13593-062",
  );
  await page
    .getByRole("button", { name: "Solicitar orçamento", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Um detalhe que faz a diferença?")
    .fill("Quero retirar na loja.");
  const send = page.getByRole("link", { name: "Enviar orçamento" });
  const url = new URL((await send.getAttribute("href"))!);
  expect(url.pathname).toBe("/5516997797959");
  expect(url.searchParams.get("text")).toContain("Cabo flexível — 1 un.");
  expect(url.searchParams.get("text")).toContain("Quero retirar na loja.");
});
