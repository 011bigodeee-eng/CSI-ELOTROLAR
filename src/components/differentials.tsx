"use client";
import {
  ArrowUpRight,
  ClipboardList,
  Headphones,
  Layers3,
  Snowflake,
  Zap,
} from "lucide-react";
import { Reveal } from "./interactions";
import { useStore } from "./store";
export function Differentials() {
  const { setDrawer } = useStore();
  return (
    <section className="differentials container">
      <Reveal className="differentials-intro">
        <span className="eyebrow">ESCOLHAS QUE FAZEM SENTIDO</span>
        <h2>
          Conectados ao
          <br />
          que você <em>precisa.</em>
        </h2>
        <p>
          Mais possibilidades para o seu projeto.
          <br />
          Menos complicação para você.
        </p>
        <span className="differential-signature">
          <Zap size={17} /> ESSENCIAL EM CADA CONEXÃO.
        </span>
      </Reveal>
      <div className="differential-grid">
        <Reveal className="differential-card differential-primary">
          <span className="differential-icon">
            <Zap />
            <Snowflake />
          </span>
          <h3>
            Da energia ao
            <br />
            clima ideal.
          </h3>
          <p>Soluções em elétrica e climatização reunidas em um só lugar.</p>
          <span className="differential-line" />
        </Reveal>
        <Reveal className="differential-card" delay={0.08}>
          <Headphones />
          <h3>
            Uma conversa.
            <br />A escolha certa.
          </h3>
          <p>
            Atendimento personalizado para encontrar o que seu projeto precisa.
          </p>
        </Reveal>
        <Reveal className="differential-card" delay={0.12}>
          <Layers3 />
          <h3>
            Possibilidades
            <br />
            para explorar.
          </h3>
          <p>Navegue por diferentes categorias e organize suas escolhas.</p>
        </Reveal>
        <Reveal className="differential-card differential-quote" delay={0.16}>
          <ClipboardList />
          <h3>
            Seu orçamento,
            <br />
            sem complicação.
          </h3>
          <button onClick={() => setDrawer(true)}>
            Monte sua lista <ArrowUpRight size={19} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
