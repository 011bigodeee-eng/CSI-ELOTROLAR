"use client";
import { RefreshCw } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container empty-state" style={{ minHeight: 450 }}>
      <RefreshCw size={40} />
      <h1>Uma pausa na conexão.</h1>
      <p>
        Não foi possível carregar esta página. Tente novamente em instantes.
      </p>
      <button className="button" onClick={reset}>
        Tentar novamente
      </button>
    </section>
  );
}
