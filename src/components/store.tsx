"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  categories as initialCategories,
  demoProducts,
  type Product,
  type Category,
} from "@/lib/catalog";
import { localCatalogRepository } from "@/lib/repository";
type Store = {
  products: Product[];
  categories: Category[];
  quote: Record<string, number>;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  add: (id: string) => void;
  quantity: (id: string, n: number) => void;
  clear: () => void;
  save: (products: Product[], categories: Category[]) => boolean;
  notice: string;
  setNotice: (s: string) => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(demoProducts),
    [categories, setCategories] = useState(initialCategories),
    [quote, setQuote] = useState<Record<string, number>>({}),
    [drawer, setDrawer] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const data = localCatalogRepository.load();
    setProducts(data.products);
    setCategories(data.categories);
    try {
      const q = JSON.parse(localStorage.getItem("csi-quote-v1") || "{}");
      if (q && typeof q === "object" && !Array.isArray(q))
        setQuote(
          Object.fromEntries(
            Object.entries(q)
              .filter(
                ([id, n]) =>
                  data.products.some((p: Product) => p.id === id) &&
                  Number.isInteger(n) &&
                  Number(n) > 0 &&
                  Number(n) <= 999,
              )
              .map(([id, n]) => [id, Number(n)]),
          ),
        );
    } catch {}
  }, []);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  function update(q: Record<string, number>) {
    setQuote(q);
    try {
      localStorage.setItem("csi-quote-v1", JSON.stringify(q));
    } catch {
      setNotice(
        "Armazenamento indisponível. A lista será mantida nesta sessão.",
      );
    }
  }
  function add(id: string) {
    update({ ...quote, [id]: Math.min((quote[id] || 0) + 1, 999) });
    setNotice("Produto adicionado à sua lista de orçamento.");
  }
  function quantity(id: string, n: number) {
    const q = { ...quote };
    if (n <= 0) delete q[id];
    else q[id] = Math.min(999, Math.floor(n));
    update(q);
  }
  function save(p: Product[], c: Category[]) {
    try {
      localCatalogRepository.save({ products: p, categories: c });
      setProducts(p);
      setCategories(c);
      const q = Object.fromEntries(
        Object.entries(quote).filter(([id]) => p.some((x) => x.id === id)),
      );
      update(q);
      return true;
    } catch {
      setNotice(
        "Não foi possível salvar. Verifique o espaço e as permissões do navegador.",
      );
      return false;
    }
  }
  return (
    <Context.Provider
      value={{
        products,
        categories,
        quote,
        drawer,
        setDrawer,
        add,
        quantity,
        clear: () => update({}),
        save,
        notice,
        setNotice,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const ctx = useContext(Context);
  if (!ctx) throw Error("Store unavailable");
  return ctx;
}
