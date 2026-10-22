"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardList,
  Headphones,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useStore } from "./store";
import { Brand } from "./brand";
import { ProductImage } from "./product-image";
import { Navigation } from "./navigation";
import dynamic from "next/dynamic";
const ProductQuickView = dynamic(
  () => import("./product-quick-view").then((m) => m.ProductQuickView),
  { ssr: false },
);
import { quoteMessage, whatsappUrl, money } from "@/lib/catalog";
export function SiteShell({ children }: { children: React.ReactNode }) {
  const { setDrawer, notice, previewId } = useStore();
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="announcement">
        <span>SEU PROJETO COMEÇA COM A ESCOLHA CERTA.</span>
        <span className="announcement-right">
          <span className="status-dot" /> CATÁLOGO DEMONSTRATIVO <i /> Elétrica
          & climatização
        </span>
      </div>
      <Navigation />
      <main id="conteudo">{children}</main>
      <footer id="contato" className="premium-footer">
        <div className="container footer-manifesto">
          <span className="eyebrow">DO PRIMEIRO FIO AO CLIMA IDEAL.</span>
          <p>
            Boas conexões.
            <br />
            <span>Novas possibilidades.</span>
          </p>
          <button
            aria-label="Abrir lista de orçamento"
            onClick={() => setDrawer(true)}
          >
            <ArrowUpRight size={38} />
          </button>
        </div>
        <div className="container footer-main">
          <div>
            <Link href="/">
              <Brand />
            </Link>
            <p>
              Energia, tecnologia e climatização
              <br />
              para seus projetos.
            </p>
            <span className="footer-tag">DO PRIMEIRO FIO AO CLIMA IDEAL.</span>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/catalogo">Todos os produtos</Link>
            <Link href="/catalogo?categoria=iluminacao">Iluminação</Link>
            <Link href="/catalogo?categoria=ar">Climatização</Link>
          </div>
          <div>
            <h4>CSI Eletrolar</h4>
            <Link href="/#sobre">Sobre a empresa</Link>
            <Link href="/admin">Área administrativa</Link>
            <button onClick={() => setDrawer(true)}>
              Solicitar orçamento <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="footer-cta">
            <Headphones size={25} />
            <h4>Vamos tirar seu projeto do papel?</h4>
            <p>Monte sua lista e solicite um atendimento.</p>
            <button onClick={() => setDrawer(true)}>
              Orçamento pelo WhatsApp <MessageCircle size={16} />
            </button>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} CSI Eletrolar.</span>
          <span>
            Prévia demonstrativa · Produtos, imagens e preços ilustrativos.
          </span>
        </div>
      </footer>
      <button
        className="floating-whatsapp"
        aria-label="Abrir orçamento para WhatsApp"
        onClick={() => setDrawer(true)}
      >
        <MessageCircle size={25} />
        <span>Vamos conversar?</span>
      </button>
      <AnimatePresence>
        {notice && (
          <motion.div
            className="toast"
            role="status"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Check size={18} />
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
      <QuoteDrawer />
      {previewId && <ProductQuickView />}
    </>
  );
}
function QuoteDrawer() {
  const {
    products,
    quote,
    quantity,
    clear,
    drawer,
    setDrawer,
    setNotice,
    notes,
    setNotes,
  } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const lines = Object.entries(quote).flatMap(([id, quantity]) => {
    const product = products.find((p) => p.id === id);
    return product ? [{ product, quantity }] : [];
  });
  const url = whatsappUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    lines,
    notes,
  );
  useEffect(() => setCopied(false), [notes, quote]);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
      if (e.key === "Tab") {
        const els = panelRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href],input,textarea,summary",
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [drawer, setDrawer]);
  return (
    <AnimatePresence>
      {drawer && (
        <div className="drawer-layer">
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">SEU PRÓXIMO PROJETO</span>
                <h2 id="quote-title">
                  Lista de orçamento<span>.</span>
                </h2>
              </div>
              <button
                ref={closeRef}
                className="icon-button"
                aria-label="Fechar lista"
                onClick={() => setDrawer(false)}
              >
                <X />
              </button>
            </div>
            {lines.length ? (
              <>
                <div className="quote-items">
                  {lines.map(({ product: p, quantity: n }) => (
                    <motion.div
                      layout="position"
                      initial={{ y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="quote-item"
                      key={p.id}
                    >
                      <ProductImage src={p.image} alt="" />
                      <div>
                        <h4>{p.name}</h4>
                        <small>
                          {p.price
                            ? `${money(p.price)} · valor ilustrativo`
                            : "Preço sob consulta"}
                        </small>
                        <div className="quantity">
                          <button
                            aria-label={`Diminuir quantidade de ${p.name}`}
                            onClick={() => quantity(p.id, n - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span aria-label="Quantidade">{n}</span>
                          <button
                            disabled={n >= 999}
                            aria-label={`Aumentar quantidade de ${p.name}`}
                            onClick={() => quantity(p.id, n + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="icon-button remove"
                        aria-label={`Remover ${p.name}`}
                        onClick={() => quantity(p.id, 0)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="quote-footer">
                  <button className="text-button" onClick={clear}>
                    Limpar lista
                  </button>
                  <div className="quote-summary">
                    <span>Produtos selecionados</span>
                    <motion.b
                      key={lines.reduce((s, l) => s + l.quantity, 0)}
                      initial={{ y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      aria-live="polite"
                    >
                      {lines.reduce((s, l) => s + l.quantity, 0)} unidades
                    </motion.b>
                  </div>
                  <p>
                    Sem pagamento online. Preços e disponibilidade serão
                    confirmados no atendimento.
                  </p>
                  <div className="quote-notes">
                    <label htmlFor="quote-notes">
                      Um detalhe que faz a diferença?
                    </label>
                    <textarea
                      id="quote-notes"
                      maxLength={1000}
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Conte sobre seu projeto, entrega ou preferências…"
                    />
                    <span>{notes.length}/1000 · Observações opcionais</span>
                  </div>
                  {url ? (
                    <a
                      className="button whatsapp-button"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={20} /> Enviar orçamento{" "}
                      <ArrowUpRight size={18} />
                    </a>
                  ) : (
                    <>
                      <div className="config-note">
                        WhatsApp da empresa ainda não configurado nesta prévia.
                        Você pode copiar a mensagem abaixo.
                      </div>
                      <button
                        className="button full"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              quoteMessage(lines, notes),
                            );
                            setCopied(true);
                            setNotice("Mensagem de orçamento copiada.");
                          } catch {
                            setNotice(
                              "Não foi possível copiar automaticamente. Selecione a mensagem abaixo.",
                            );
                          }
                        }}
                      >
                        {copied ? (
                          <Check size={18} />
                        ) : (
                          <ClipboardList size={18} />
                        )}{" "}
                        {copied ? "Mensagem copiada" : "Copiar orçamento"}
                      </button>
                      <details className="message-details">
                        <summary>Visualizar mensagem</summary>
                        <pre>{quoteMessage(lines, notes)}</pre>
                      </details>
                    </>
                  )}
                  <span className="secure-note">
                    <ShieldCheck size={14} /> Seus produtos, organizados em uma
                    única mensagem.
                  </span>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <span className="quote-empty-art">
                  <ClipboardList size={48} />
                  <span />
                  <span />
                </span>
                <h3>Seu projeto começa aqui.</h3>
                <p>
                  Explore o catálogo e adicione os produtos que você precisa à
                  sua lista.
                </p>
                <Link
                  className="button"
                  href="/catalogo"
                  onClick={() => setDrawer(false)}
                >
                  Explorar catálogo <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
