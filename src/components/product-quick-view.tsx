"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShieldCheck, X } from "lucide-react";
import { money } from "@/lib/catalog";
import { useStore } from "./store";
export function ProductQuickView() {
  const {
    previewId,
    setPreviewId,
    products,
    categories,
    quote,
    quantity,
    setDrawer,
    setNotice,
  } = useStore();
  const ref = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState(1);
  const p = products.find((x) => x.id === previewId);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !p) return;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [p?.id]);
  if (!p) return null;
  return (
    <dialog
      ref={ref}
      className="quick-view-dialog"
      aria-labelledby="quick-view-title"
      onCancel={(e) => {
        e.preventDefault();
        setPreviewId(null);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setPreviewId(null);
      }}
    >
      <motion.div
        className="quick-view-content"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <button
          className="icon-button quick-view-close"
          aria-label="Fechar visualização do produto"
          onClick={() => setPreviewId(null)}
        >
          <X size={21} />
        </button>
        <div className="quick-view-image">
          <span className="eyebrow">EXPLORE CADA POSSIBILIDADE</span>
          <img
            src={p.image}
            alt={`Imagem demonstrativa de ${p.name}`}
            width={600}
            height={460}
          />
          <span>IMAGEM CONCEITUAL · PRÉVIA DO CATÁLOGO</span>
        </div>
        <div className="quick-view-copy">
          <span className="eyebrow">
            {categories.find((c) => c.id === p.category)?.name || "Produto"}
          </span>
          <h2 id="quick-view-title">{p.name}</h2>
          <p>{p.description}</p>
          <div className="quick-view-price">
            {p.price ? (
              <>
                <small>Preço cadastrado nesta prévia</small>
                <strong>{money(p.price)}</strong>
              </>
            ) : (
              <>
                <small>Vamos encontrar a melhor solução?</small>
                <strong>Preço sob consulta</strong>
              </>
            )}
          </div>
          <div className="quick-view-quantity">
            <span>Quantidade</span>
            <div className="quantity">
              <button
                disabled={amount <= 1}
                aria-label="Diminuir quantidade na visualização"
                onClick={() => setAmount(Math.max(1, amount - 1))}
              >
                <Minus size={16} />
              </button>
              <span>{amount}</span>
              <button
                disabled={amount >= 999}
                aria-label="Aumentar quantidade na visualização"
                onClick={() => setAmount(Math.min(999, amount + 1))}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <button
            className="button full"
            onClick={() => {
              quantity(p.id, (quote[p.id] || 0) + amount);
              setNotice(`${p.name} adicionado à sua lista.`);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={quote[p.id] ? "added" : "add"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {quote[p.id] ? <Check size={18} /> : <Plus size={18} />}
              </motion.span>
            </AnimatePresence>
            {quote[p.id]
              ? "Adicionar mais à lista"
              : "Adicionar à lista de orçamento"}
          </button>
          {quote[p.id] && (
            <p className="quick-view-added">
              <Check size={14} />
              {quote[p.id]}{" "}
              {quote[p.id] === 1
                ? "unidade na sua lista"
                : "unidades na sua lista"}
            </p>
          )}
          <button
            className="text-link quick-view-list"
            onClick={() => {
              setPreviewId(null);
              setDrawer(true);
            }}
          >
            Ver minha lista <ArrowRight size={17} />
          </button>
          <span className="secure-note">
            <ShieldCheck size={14} /> Consulte preços, especificações e
            disponibilidade.
          </span>
        </div>
      </motion.div>
    </dialog>
  );
}
