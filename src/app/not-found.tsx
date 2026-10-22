import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
export default function NotFound() {
  return (
    <section className="container empty-state" style={{ minHeight: 450 }}>
      <Zap size={44} />
      <span className="eyebrow">404 · CONEXÃO NÃO ENCONTRADA</span>
      <h1>Vamos encontrar o caminho certo?</h1>
      <p>
        A página que você procura não está disponível. Explore as soluções do
        nosso catálogo.
      </p>
      <Link className="button" href="/catalogo">
        Ir para o catálogo <ArrowRight size={18} />
      </Link>
    </section>
  );
}
