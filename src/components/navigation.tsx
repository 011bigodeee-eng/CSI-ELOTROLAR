"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ClipboardList,
  Menu,
  Search,
  X,
  Zap,
} from "lucide-react";
import { useStore } from "./store";
import { Brand } from "./brand";
export function Navigation() {
  const { quote, categories, setDrawer } = useStore();
  const path = usePathname();
  const [menu, setMenu] = useState(false),
    [mega, setMega] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [section, setSection] = useState("inicio");
  const root = useRef<HTMLElement>(null),
    dropdown = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const count = Object.values(quote).reduce((a, b) => a + b, 0);
  function close() {
    setMenu(false);
    setMega(false);
  }
  useEffect(() => {
    close();
  }, [path]);
  useEffect(() => {
    let frame = 0;
    function sync() {
      setScrolled(window.scrollY > 24);
      let next = "inicio";
      for (const id of ["sobre", "contato"]) {
        const element = document.getElementById(id);
        if (
          element &&
          element.getBoundingClientRect().top < window.innerHeight * 0.4
        )
          next = id;
      }
      setSection(next);
    }
    function scroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    }
    sync();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [path]);
  useEffect(() => {
    if (!mega && !menu) return;
    const pointer = (e: globalThis.PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", key);
    };
  }, [mega, menu]);
  const active =
    path === "/catalogo" ? "catalogo" : path === "/" ? section : "";
  function item(id: string, label: string, href: string) {
    return (
      <Link
        href={href}
        className={active === id ? "active" : ""}
        aria-current={active === id ? "page" : undefined}
        onClick={close}
      >
        {label}
        {active === id && (
          <motion.span
            layoutId="nav-active"
            className="nav-active-mark"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
      </Link>
    );
  }
  return (
    <header
      ref={root}
      className={`header premium-header ${scrolled ? "is-scrolled" : ""} ${menu ? "mobile-open" : ""}`}
    >
      <div className="container header-inner">
        <Link href="/" aria-label="CSI Eletrolar, início" onClick={close}>
          <Brand />
        </Link>
        <nav
          id="primary-navigation"
          className={menu ? "nav open" : "nav"}
          aria-label="Navegação principal"
        >
          {item("inicio", "Início", "/")}
          <div
            ref={dropdown}
            className="nav-catalogue"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                setMega(false);
            }}
          >
            <div className="catalog-nav-link">
              {item("catalogo", "Catálogo", "/catalogo")}
              <button
                ref={trigger}
                className={`catalog-menu-toggle ${mega ? "expanded" : ""}`}
                aria-label="Abrir categorias do catálogo"
                aria-expanded={mega}
                aria-controls="mega-categories"
                onClick={() => setMega(!mega)}
              >
                <ChevronDown size={14} />
              </button>
            </div>
            <AnimatePresence>
              {mega && (
                <motion.div
                  id="mega-categories"
                  className="mega-menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="container mega-inner">
                    <div className="mega-intro">
                      <span className="eyebrow">
                        UM MUNDO DE POSSIBILIDADES
                      </span>
                      <h3>
                        Seu projeto.
                        <br />
                        Nossas conexões<span>.</span>
                      </h3>
                      <Link href="/catalogo" onClick={close}>
                        Ver catálogo completo <ArrowRight size={17} />
                      </Link>
                    </div>
                    <div className="mega-grid">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/catalogo?categoria=${encodeURIComponent(c.id)}`}
                          onClick={close}
                        >
                          <span className="mega-product-image">
                            <img
                              src={`/products/${c.image}.svg`}
                              alt=""
                              width={56}
                              height={45}
                            />
                          </span>
                          <span>{c.short}</span>
                          <ArrowUpRight size={15} />
                        </Link>
                      ))}
                    </div>
                    <div className="mega-bottom">
                      <Zap size={15} />
                      <span>Da primeira conexão ao clima perfeito.</span>
                      <span>ELÉTRICA + CLIMATIZAÇÃO</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {item("sobre", "Sobre a CSI", "/#sobre")}
          {item("contato", "Contato", "/#contato")}
          <div className="mobile-nav-note">
            <span className="eyebrow">O PRÓXIMO PASSO É SEU</span>
            <p>Vamos dar energia ao seu projeto.</p>
            <button
              className="button"
              onClick={() => {
                close();
                setDrawer(true);
              }}
            >
              Monte seu orçamento <ArrowUpRight size={17} />
            </button>
          </div>
        </nav>
        <div className="header-actions">
          <Link
            href="/catalogo"
            className="header-search icon-button"
            aria-label="Buscar no catálogo"
            onClick={close}
          >
            <Search size={19} />
          </Link>
          <button
            className={`quote-trigger ${count ? "has-items" : ""}`}
            onClick={() => {
              close();
              setDrawer(true);
            }}
            aria-label={`Minha lista, ${count} itens`}
          >
            <ClipboardList size={19} />
            <span>Minha lista</span>
            <motion.b
              key={count}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
            >
              {count}
            </motion.b>
          </button>
          <button
            className="button small header-contact"
            onClick={() => {
              close();
              setDrawer(true);
            }}
          >
            Peça seu orçamento <ArrowUpRight size={16} />
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => {
              setMenu(!menu);
              setMega(false);
            }}
            aria-expanded={menu}
            aria-controls="primary-navigation"
            aria-label="Abrir menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
