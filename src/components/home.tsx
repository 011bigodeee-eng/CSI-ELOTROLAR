"use client";
import Link from "next/link";
import { storeWhatsappUrl } from "@/lib/contact";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Headphones,
  Lightbulb,
  Snowflake,
  Zap,
} from "lucide-react";
import { ProductImage } from "./product-image";
import { Brand } from "./brand";
import { officialLogo } from "@/lib/visual-assets";
import { useStore } from "./store";
import { ProductCard } from "./product-card";
import { CinematicHero } from "./cinematic-hero";
import { EditorialCategories } from "./editorial-categories";
import { Differentials } from "./differentials";
const reveal = {
  initial: false,
  whileInView: { opacity: [0.7, 1], y: [18, 0] },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.55 },
};
export function Home() {
  const { products } = useStore();
  return (
    <>
      <CinematicHero />
      <EditorialCategories />
      <section className="featured-section">
        <div className="container">
          <motion.div {...reveal} className="section-heading">
            <div>
              <span className="eyebrow">BOAS ESCOLHAS COMEÇAM AQUI</span>
              <h2>
                Destaques que fazem a diferença<span>.</span>
              </h2>
              <p>Uma seleção para inspirar o seu próximo projeto.</p>
            </div>
            <Link className="text-link" href="/catalogo">
              Explorar todos os produtos <ArrowUpRight size={18} />
            </Link>
          </motion.div>
          <div className="demo-notice">
            <span className="status-dot" /> PRÉVIA DO CATÁLOGO{" "}
            <span>
              Produtos, imagens e preços demonstrativos. Consulte a
              disponibilidade real.
            </span>
          </div>
          <motion.div {...reveal} className="product-grid">
            {products
              .filter((p) => p.featured)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </motion.div>
        </div>
      </section>
      <Differentials />
      <section className="container solutions-section">
        <motion.div {...reveal} className="solution-banner electric-banner">
          <div>
            <span className="eyebrow">DO PRIMEIRO FIO À ÚLTIMA CONEXÃO</span>
            <h2>
              Grandes projetos
              <br />
              começam com
              <br />
              <em>boas conexões.</em>
            </h2>
            <Link href="/catalogo?categoria=cabos">
              Explore a linha elétrica <ArrowUpRight size={18} />
            </Link>
          </div>
          <ProductImage
            src="/products/cabos.svg"
            alt="Imagem de referência de cabo elétrico"
          />
        </motion.div>
        <motion.div {...reveal} className="solution-banner climate-banner">
          <div>
            <span className="eyebrow">CONFORTO EM TODOS OS SENTIDOS</span>
            <h2>
              O seu ambiente.
              <br />O clima <em>ideal.</em>
            </h2>
            <p>Soluções de climatização para viver e trabalhar melhor.</p>
            <Link href="/catalogo?categoria=ar">
              Conheça a linha de climatização <ArrowUpRight size={18} />
            </Link>
          </div>
          <ProductImage
            src="/products/ar-condicionado.svg"
            alt="Imagem de referência de ar-condicionado"
          />
          <Snowflake className="banner-snow" />
        </motion.div>
      </section>
      <section id="sobre" className="about-section container">
        <motion.div {...reveal} className="about-visual">
          <div className="about-blueprint" />
          <span className="about-top">A ENERGIA POR TRÁS DO SEU PROJETO</span>
          {officialLogo ? (
            <div className="about-official-brand">
              <Brand />
            </div>
          ) : (
            <div className="about-logo">
              <Zap fill="currentColor" />
              <strong>
                CSI<span>.</span>
              </strong>
              <small>E L E T R O L A R</small>
            </div>
          )}
          <div className="about-stamp">
            <Check size={18} /> ELÉTRICA & CLIMATIZAÇÃO
          </div>
          <span className="about-coordinate">CONEXÃO QUE TRANSFORMA.</span>
        </motion.div>
        <motion.div {...reveal} className="about-copy">
          <span className="eyebrow">MUITO PRAZER, SOMOS A CSI ELETROLAR</span>
          <h2>
            Mais que produtos.
            <br />
            <span>Possibilidades para você.</span>
          </h2>
          <p>
            Materiais elétricos, equipamentos e soluções de climatização
            reunidos para conectar suas ideias às escolhas certas.
          </p>
          <p>
            Seja para renovar um ambiente ou planejar uma instalação, explore
            nosso catálogo e monte uma lista com o que seu projeto precisa. O
            próximo passo começa com uma conversa.
          </p>
          <div className="about-chapters">
            <Link href="/catalogo?categoria=cabos">
              <span>01 / CONECTAR</span>
              <strong>Da ideia à instalação.</strong>
              <p>Materiais elétricos para compor seu projeto.</p>
              <ArrowUpRight size={18} />
            </Link>
            <Link href="/catalogo?categoria=ar">
              <span>02 / TRANSFORMAR</span>
              <strong>Do espaço ao conforto.</strong>
              <p>Explore equipamentos e soluções de climatização.</p>
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="about-values">
            <span>
              <Lightbulb size={20} /> Soluções que inspiram
            </span>
            <span>
              <Headphones size={20} /> Atendimento próximo
            </span>
          </div>
          <a
            className="button"
            href={storeWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos falar sobre seu projeto <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </section>
      <section className="how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SIMPLES DO COMEÇO AO FIM</span>
              <h2>
                Seu orçamento em três passos<span>.</span>
              </h2>
            </div>
            <p>Você escolhe. A gente conecta as soluções.</p>
          </div>
          <div className="steps">
            <div>
              <b>01</b>
              <h3>Encontre o que precisa</h3>
              <p>
                Explore as categorias e descubra as opções para o seu projeto.
              </p>
            </div>
            <ArrowRight />
            <div>
              <b>02</b>
              <h3>Monte sua lista</h3>
              <p>Adicione os produtos e ajuste as quantidades do seu jeito.</p>
            </div>
            <ArrowRight />
            <div>
              <b>03</b>
              <h3>
                <a
                  href={storeWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="step-contact-link"
                >
                  Vamos conversar <ArrowUpRight size={17} />
                </a>
              </h3>
              <p>
                Envie sua lista pelo WhatsApp e solicite um orçamento
                personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container final-cta">
        <div>
          <span className="eyebrow">O PRÓXIMO PASSO É SEU</span>
          <h2>
            Tem um projeto em mente?
            <br />
            Vamos dar energia a ele<span>.</span>
          </h2>
          <p>Encontre os produtos. Monte sua lista. Conte com a CSI.</p>
        </div>
        <Link className="button yellow" href="/catalogo">
          Começar meu projeto <ArrowUpRight size={20} />
        </Link>
        <Zap className="cta-watermark" />
      </section>
    </>
  );
}
