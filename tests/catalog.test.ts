import test from "node:test";
import assert from "node:assert/strict";
import {
  demoProducts,
  categories,
  filterProducts,
  quoteMessage,
  whatsappUrl,
} from "../src/lib/catalog";
test("busca sem acentos e filtro por categoria funcionam juntos", () => {
  assert.equal(
    filterProducts(demoProducts, "lampada", "iluminacao")[0]?.id,
    "p4",
  );
  assert.equal(filterProducts(demoProducts, "lampada", "cabos").length, 0);
  assert.equal(filterProducts(demoProducts, "", "todos").length, 8);
  assert.equal(
    filterProducts(demoProducts, "produto inexistente", "todos").length,
    0,
  );
});
test("mensagem mantém nomes e quantidades, sem afirmar preços reais", () => {
  const lines = [
    { product: demoProducts[0], quantity: 3 },
    { product: demoProducts[1], quantity: 2 },
  ];
  const message = quoteMessage(lines);
  assert.match(message, /1\. Cabo flexível 2,5 mm² — 3 un\./);
  assert.match(message, /2\. Ar-condicionado Split Inverter — 2 un\./);
  assert.match(message, /confirmem os preços/);
  const url = whatsappUrl("55 (11) 99999-0000", lines);
  assert.ok(url?.startsWith("https://wa.me/5511999990000?text="));
  assert.equal(decodeURIComponent(url!.split("?text=")[1]), message);
  assert.equal(whatsappUrl("", lines), null);
  assert.equal(whatsappUrl("123", lines), null);
});
test("dados demonstrativos têm IDs únicos, categorias e imagens locais", () => {
  assert.equal(
    new Set(demoProducts.map((p) => p.id)).size,
    demoProducts.length,
  );
  for (const p of demoProducts) {
    assert.ok(categories.some((c) => c.id === p.category));
    assert.ok(p.image.startsWith("/products/"));
    assert.ok(!p.price || p.price > 0);
  }
  assert.equal(categories.length, 8);
});
