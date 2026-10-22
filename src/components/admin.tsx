"use client";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Boxes,
  Check,
  ImagePlus,
  Layers3,
  LockKeyhole,
  LogOut,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useStore } from "./store";
import { money, type Product } from "@/lib/catalog";
export function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  const router = useRouter();
  async function login(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error);
      else router.refresh();
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="admin-login container">
      <div className="login-card">
        <span className="login-icon">
          <LockKeyhole size={26} />
        </span>
        <span className="eyebrow">ÁREA DO PROPRIETÁRIO</span>
        <h1>
          Seu catálogo.
          <br />
          Sob seu controle<span>.</span>
        </h1>
        <p>
          Acesse para gerenciar produtos, categorias e os destaques da CSI
          Eletrolar.
        </p>
        {configured ? (
          <form onSubmit={login}>
            <label htmlFor="admin-password">Senha de acesso</label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button full" disabled={pending}>
              {pending ? "Verificando…" : "Acessar painel"}
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <div className="config-note">
            Painel protegido. Para habilitar o acesso, configure{" "}
            <code>ADMIN_PASSWORD</code> e <code>ADMIN_SESSION_SECRET</code> nas
            variáveis do servidor. Não há senha pública padrão.
          </div>
        )}
        <span className="secure-note">
          <ShieldCheck size={15} /> Autenticação validada no servidor
        </span>
      </div>
      <p className="admin-demo-note">
        Prévia demonstrativa: alterações de produtos ficam neste navegador.
        <br />A integração com banco de dados será uma etapa futura.
      </p>
    </section>
  );
}
const blank: Product = {
  id: "",
  name: "",
  description: "",
  category: "cabos",
  image: "/products/cabos.svg",
  featured: false,
};
export function AdminPanel() {
  const { products, categories, save, setNotice } = useStore();
  const [tab, setTab] = useState("products"),
    [editing, setEditing] = useState<Product | null>(null),
    [search, setSearch] = useState(""),
    [categoryName, setCategoryName] = useState(""),
    [categoryEdit, setCategoryEdit] = useState<string | null>(null),
    [deleteId, setDeleteId] = useState<string | null>(null),
    [uploadError, setUploadError] = useState("");
  const router = useRouter();
  const uploadVersion = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  useEffect(() => {
    if (!editing && !deleteId) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditing(null);
        setDeleteId(null);
      }
      if (e.key === "Tab") {
        const elements = document
          .querySelector(".edit-modal,.confirm-modal")
          ?.querySelectorAll<HTMLElement>(
            "button:not([disabled]),input,select,textarea",
          );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [!!editing, !!deleteId]);
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!editing || uploading) return;
    if (!editing.name.trim() || !editing.description.trim()) {
      setUploadError("Preencha o nome e a descrição.");
      return;
    }
    if (
      !categories.some((c) => c.id === editing.category) ||
      (editing.price !== undefined &&
        (!Number.isFinite(editing.price) ||
          editing.price <= 0 ||
          editing.price > 10000000))
    ) {
      setUploadError(
        "Selecione uma categoria válida e informe um preço positivo ou deixe em branco.",
      );
      return;
    }
    const p = {
      ...editing,
      name: editing.name.trim(),
      description: editing.description.trim(),
      id: editing.id || crypto.randomUUID(),
    };
    if (
      save(
        editing.id
          ? products.map((x) => (x.id === p.id ? p : x))
          : [...products, p],
        categories,
      )
    ) {
      setEditing(null);
      setNotice("Produto salvo nesta prévia.");
      setSavedAt(
        new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    }
  }
  async function upload(file?: File) {
    if (!file || !editing) return;
    setUploadError("");
    const version = ++uploadVersion.current;
    setUploading(false);
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setUploadError("Use PNG, JPG ou WebP de até 2 MB.");
      return;
    }
    setUploading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read"));
        reader.readAsDataURL(file);
      });
      const image = new Image();
      image.src = data;
      await image.decode();
      if (
        !image.naturalWidth ||
        !image.naturalHeight ||
        image.naturalWidth * image.naturalHeight > 40000000
      )
        throw new Error("dimensions");
      if (version === uploadVersion.current)
        setEditing((p) => (p ? { ...p, image: data } : p));
    } catch {
      if (version === uploadVersion.current)
        setUploadError(
          "Imagem inválida ou muito grande. Use uma imagem legível de até 40 megapixels.",
        );
    } finally {
      if (version === uploadVersion.current) setUploading(false);
    }
  }

  function categorySubmit(e: FormEvent) {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === name.toLowerCase() && c.id !== categoryEdit,
      )
    ) {
      setNotice("Essa categoria já existe.");
      return;
    }
    const next = categoryEdit
      ? categories.map((c) =>
          c.id === categoryEdit ? { ...c, name, short: name } : c,
        )
      : [
          ...categories,
          { id: crypto.randomUUID(), name, short: name, image: "instalacao" },
        ];
    if (save(products, next)) {
      setCategoryName("");
      setCategoryEdit(null);
      setNotice("Categoria salva.");
    }
  }
  return (
    <section className="container admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">PAINEL ADMINISTRATIVO</span>
          <h1>
            Bom ter você por aqui<span>.</span>
          </h1>
          <p>Gerencie as possibilidades do seu catálogo.</p>
        </div>
        <button className="button outline" onClick={logout}>
          <LogOut size={17} /> Sair do painel
        </button>
      </div>
      <div className="admin-warning">
        <ShieldCheck size={20} />
        <div>
          <b>Modo demonstração · armazenamento local</b>
          <p>
            As alterações afetam somente este navegador. Não são publicadas nem
            compartilhadas com outros visitantes. Nunca cadastre informações
            sensíveis.
          </p>
        </div>
      </div>
      <div className="stat-grid">
        <div>
          <Boxes />
          <strong>{products.length}</strong>
          <span>Produtos no catálogo</span>
        </div>
        <div>
          <Layers3 />
          <strong>{categories.length}</strong>
          <span>Categorias</span>
        </div>
        <div>
          <Star />
          <strong>{products.filter((p) => p.featured).length}</strong>
          <span>Produtos em destaque</span>
        </div>
      </div>
      <div className="admin-save-status" role="status">
        <Check size={16} />
        {savedAt
          ? `Último produto salvo às ${savedAt} neste navegador.`
          : "Suas alterações ficam salvas neste navegador."}
      </div>
      <div className="admin-tabs">
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Produtos
        </button>
        <button
          className={tab === "categories" ? "active" : ""}
          onClick={() => setTab("categories")}
        >
          Categorias
        </button>
      </div>
      {tab === "products" ? (
        <>
          <div className="admin-toolbar">
            <div className="input-search">
              <Search size={18} />
              <input
                aria-label="Buscar produto no painel"
                placeholder="Buscar produto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="button"
              onClick={() => {
                setUploadError("");
                setEditing({ ...blank, category: categories[0]?.id || "" });
              }}
              disabled={!categories.length}
            >
              <Plus size={18} /> Novo produto
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço ilustrativo</th>
                  <th>Destaque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-product">
                          <img src={p.image} alt="" />
                          <div>
                            <b>{p.name}</b>
                            <small>{p.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {categories.find((c) => c.id === p.category)?.short}
                      </td>
                      <td>{p.price ? money(p.price) : "Sob consulta"}</td>
                      <td>
                        <button
                          className={`icon-button ${p.featured ? "star-active" : ""}`}
                          aria-label={`${p.featured ? "Remover" : "Adicionar"} destaque: ${p.name}`}
                          onClick={() =>
                            save(
                              products.map((x) =>
                                x.id === p.id
                                  ? { ...x, featured: !x.featured }
                                  : x,
                              ),
                              categories,
                            )
                          }
                        >
                          <Star
                            size={18}
                            fill={p.featured ? "currentColor" : "none"}
                          />
                        </button>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-button"
                            aria-label={`Editar ${p.name}`}
                            onClick={() => {
                              setUploadError("");
                              setEditing({ ...p });
                            }}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="icon-button danger"
                            aria-label={`Excluir ${p.name}`}
                            onClick={() => setDeleteId(p.id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!products.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase()),
            ).length && (
              <div className="empty-state">Nenhum produto encontrado.</div>
            )}
          </div>
        </>
      ) : (
        <div className="category-management">
          <form onSubmit={categorySubmit}>
            <h3>{categoryEdit ? "Editar categoria" : "Nova categoria"}</h3>
            <label htmlFor="category-name">Nome da categoria</label>
            <input
              id="category-name"
              required
              maxLength={80}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex.: Iluminação externa"
            />
            <button className="button">
              <Plus size={17} />
              {categoryEdit ? "Salvar categoria" : "Adicionar categoria"}
            </button>
            {categoryEdit && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setCategoryEdit(null);
                  setCategoryName("");
                }}
              >
                Cancelar edição
              </button>
            )}
          </form>
          <div>
            {categories.map((c) => (
              <div key={c.id} className="category-admin-row">
                <div>
                  <b>{c.name}</b>
                  <small>
                    {products.filter((p) => p.category === c.id).length}{" "}
                    produtos
                  </small>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Editar categoria ${c.name}`}
                  onClick={() => {
                    setCategoryEdit(c.id);
                    setCategoryName(c.name);
                  }}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="icon-button danger"
                  aria-label={`Excluir categoria ${c.name}`}
                  onClick={() => {
                    if (products.some((p) => p.category === c.id)) {
                      setNotice(
                        "Mova ou exclua os produtos desta categoria primeiro.",
                      );
                      return;
                    }
                    if (
                      save(
                        products,
                        categories.filter((x) => x.id !== c.id),
                      )
                    ) {
                      setNotice("Categoria removida.");
                      if (categoryEdit === c.id) {
                        setCategoryEdit(null);
                        setCategoryName("");
                      }
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {editing && (
        <div className="modal-layer">
          <div className="modal-overlay" onClick={() => setEditing(null)} />
          <section
            className="edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-title"
          >
            <div className="modal-heading">
              <h2 id="edit-title">
                {editing.id ? "Editar produto" : "Novo produto"}
              </h2>
              <button
                className="icon-button"
                onClick={() => setEditing(null)}
                aria-label="Fechar editor"
              >
                <X />
              </button>
            </div>
            <form onSubmit={submit}>
              <label htmlFor="product-name">Nome do produto</label>
              <input
                autoFocus
                id="product-name"
                required
                maxLength={100}
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
              <label htmlFor="product-description">Descrição</label>
              <textarea
                id="product-description"
                required
                maxLength={500}
                rows={3}
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
              <label htmlFor="product-specifications">
                Informações técnicas · opcional
              </label>
              <textarea
                id="product-specifications"
                rows={3}
                maxLength={1200}
                value={editing.specifications || ""}
                onChange={(e) =>
                  setEditing({ ...editing, specifications: e.target.value })
                }
                placeholder="Cadastre somente informações confirmadas do fabricante."
              />
              <div className="form-grid">
                <div>
                  <label htmlFor="product-category">Categoria</label>
                  <select
                    id="product-category"
                    required
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="product-price">Preço (R$) · opcional</label>
                  <input
                    id="product-price"
                    type="number"
                    min="0.01"
                    max="10000000"
                    step="0.01"
                    value={editing.price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>
              <label htmlFor="product-badge">Etiqueta · opcional</label>
              <input
                id="product-badge"
                maxLength={35}
                value={editing.badge || ""}
                onChange={(e) =>
                  setEditing({ ...editing, badge: e.target.value })
                }
              />
              <div className="image-upload">
                <img src={editing.image} alt="Prévia da imagem do produto" />
                <label htmlFor="product-image">
                  <ImagePlus size={20} />
                  <b>Adicionar imagem</b>
                  <small>
                    {uploading
                      ? "Validando imagem…"
                      : "PNG, JPG ou WebP · até 2 MB"}
                  </small>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => upload(e.target.files?.[0])}
                  />
                </label>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                />
                <Star size={16} /> Destacar na página inicial (até 4 são
                exibidos)
              </label>
              {uploadError && (
                <p className="error" role="alert">
                  {uploadError}
                </p>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="button outline"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
                <button className="button" disabled={uploading}>
                  <Check size={17} />{" "}
                  {uploading ? "Validando imagem…" : "Salvar produto"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {deleteId && (
        <div className="modal-layer">
          <div className="modal-overlay" onClick={() => setDeleteId(null)} />
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="confirm-modal"
          >
            <Trash2 size={28} />
            <h2 id="delete-title">Excluir este produto?</h2>
            <p>
              {products.find((p) => p.id === deleteId)?.name} será removido do
              catálogo e das listas deste navegador. Esta ação não pode ser
              desfeita.
            </p>
            <div className="modal-actions">
              <button
                autoFocus
                className="button outline"
                onClick={() => setDeleteId(null)}
              >
                Cancelar
              </button>
              <button
                className="button danger-button"
                onClick={() => {
                  if (
                    save(
                      products.filter((p) => p.id !== deleteId),
                      categories,
                    )
                  ) {
                    setDeleteId(null);
                    setNotice("Produto excluído.");
                  }
                }}
              >
                Excluir produto
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
