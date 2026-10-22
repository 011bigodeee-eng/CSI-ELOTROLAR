import test from "node:test";
import assert from "node:assert/strict";
import {
  createSession,
  verifySession,
  passwordMatches,
  isSameOrigin,
} from "../src/lib/auth";
test("sessões assinadas rejeitam tokens adulterados, ausentes e expirados", () => {
  const token = createSession();
  assert.equal(verifySession(token), true);
  assert.equal(verifySession(undefined), false);
  assert.equal(verifySession("invalid"), false);
  assert.equal(verifySession(token + "x"), false);
  assert.equal(verifySession("1." + token.split(".")[1]), false);
});
test("painel não possui senha padrão e compara somente a senha configurada", () => {
  const previous = process.env.ADMIN_PASSWORD;
  try {
    delete process.env.ADMIN_PASSWORD;
    assert.equal(passwordMatches("admin"), false);
    process.env.ADMIN_PASSWORD = "test-only-fixture";
    assert.equal(passwordMatches("test-only-fixture"), true);
    assert.equal(passwordMatches("wrong"), false);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previous;
  }
});
test("proteção de origem funciona atrás do proxy e rejeita outro domínio", () => {
  assert.equal(
    isSameOrigin(
      new Request("http://0.0.0.0:3000/api/admin/login", {
        headers: { host: "localhost:3000", origin: "http://localhost:3000" },
      }),
    ),
    true,
  );
  assert.equal(
    isSameOrigin(
      new Request("https://csi.example/api/admin/login", {
        headers: { host: "csi.example", origin: "https://outro.example" },
      }),
    ),
    false,
  );
  assert.equal(
    isSameOrigin(new Request("https://csi.example/api/admin/login")),
    false,
  );
});
