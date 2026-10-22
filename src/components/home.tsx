"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardList,
  Headphones,
  Lightbulb,
  MoveUpRight,
  ShieldCheck,
  Snowflake,
  Truck,
  Zap,
} from "lucide-react";
import { useStore } from "./store";
import { ProductCard } from "./product-card";
const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.55 },
};
export function Home() {
  const { products, categories, setDrawer } = useStore();
  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="container hero-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="hero-eyebrow">
              <span /> CONECTANDO IDEIAS. TRANSFORMANDO AMBIENTES.
            </span>
            <h1>
              Potência para criar.
              <br />
              Conforto para{" "}
              <span>
                viver
                <svg viewBox="0 0 240 14" aria-hidden="true">
                  <path
                    d="M3 10Q110-6 236 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                  />
                </svg>
                .
              </span>
            </h1>
            <p>Energia, tecnologia e climatização para seus projetos.</p>
            <p className="hero-description">
              Do detalhe da instalação ao clima perfeito. Encontre as soluções
              que conectam o seu projeto ao próximo nível.
            </p>
            <div className="hero-buttons">
              <Link className="button yellow" href="/catalogo">
                Explorar catálogo <ArrowUpRight size={20} />
              </Link>
              <button
                className="hero-secondary"
                onClick={() => setDrawer(true)}
              >
                Monte seu orçamento <ArrowRight size={17} />
              </button>
            </div>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={17} /> Escolhas com confiança
              </span>
              <i />
              <span>
                <Headphones size={17} /> Atendimento que conecta
              </span>
            </div>
          </motion.div>
          <motion.div
            className="hero-art"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <div className="art-circle circle-one" />
            <div className="art-circle circle-two" />
            <div className="art-orbit" />
            <span className="art-cross cross-one">+</span>
            <span className="art-cross cross-two">+</span>
            <div className="hero-card climate-card">
              <span className="mini-icon">
                <Snowflake size={16} />
              </span>
              <div>
                <small>O CLIMA CERTO</small>
                <strong>
                  Mais conforto.
                  <br />
                  Menos consumo.
                </strong>
              </div>
              <ArrowUpRight size={19} />
            </div>
            <img
              className="hero-ac"
              src="/products/ar-condicionado.svg"
              alt="Ilustração de ar-condicionado split"
            />
            <img
              className="hero-cable"
              src="/products/cabos.svg"
              alt="Ilustração de rolo de cabo elétrico azul"
            />
            <img
              className="hero-bulb"
              src="/products/lampada.svg"
              alt="Ilustração de lâmpada LED"
            />
            <div className="hero-card energy-card">
              <span>
                <Zap size={18} fill="currentColor" />
              </span>
              <div>
                <strong>Seu projeto, energizado.</strong>
                <small>SOLUÇÕES DO INÍCIO AO FIM</small>
              </div>
            </div>
            <span className="art-caption">
              ELÉTRICA + ILUMINAÇÃO + CLIMATIZAÇÃO
            </span>
          </motion.div>
        </div>
        <div className="hero-bottom container">
          <span>ESCOLHAS INTELIGENTES. GRANDES POSSIBILIDADES.</span>
          <Link href="#categorias">
            Descubra a CSI <ArrowDown size={14} />
          </Link>
        </div>
      </section>
      <div className="benefits">
        <div className="container benefit-grid">
          <div>
            <Zap />
            <span>
              <strong>Tudo para o seu projeto</strong>
              <small>Elétrica e climatização em um só lugar</small>
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              <strong>Qualidade em cada escolha</strong>
              <small>Soluções para diferentes necessidades</small>
            </span>
          </div>
          <div>
            <Headphones />
            <span>
              <strong>Atendimento próximo</strong>
              <small>Uma conversa, a solução certa</small>
            </span>
          </div>
          <div>
            <ClipboardList />
            <span>
              <strong>Orçamento sem complicação</strong>
              <small>Selecione, envie e vamos conversar</small>
            </span>
          </div>
        </div>
      </div>
      <section id="categorias" className="section container">
        <motion.div {...reveal} className="section-heading">
          <div>
            <span className="eyebrow">ENCONTRE A SOLUÇÃO CERTA</span>
            <h2>
              Um universo de possibilidades<span>.</span>
            </h2>
            <p>Da energia que move ao conforto que transforma.</p>
          </div>
          <Link className="text-link" href="/catalogo">
            Ver todas as categorias <ArrowUpRight size={18} />
          </Link>
        </motion.div>
        <motion.div {...reveal} className="category-grid">
          {categories.map((c, i) => (
            <Link
              href={`/catalogo?categoria=${c.id}`}
              className="category-card"
              key={c.id}
            >
              <span className="category-number">0{i + 1}</span>
              <img src={`/products/${c.image}.svg`} alt="" loading="lazy" />
              <div>
                <h3>{c.short}</h3>
                <ArrowUpRight size={17} />
              </div>
            </Link>
          ))}
        </motion.div>
      </section>
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
          <img src="/products/cabos.svg" alt="Ilustração de cabo elétrico" />
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
          <img
            src="/products/ar-condicionado.svg"
            alt="Ilustração de ar-condicionado"
          />
          <Snowflake className="banner-snow" />
        </motion.div>
      </section>
      <section id="sobre" className="about-section container">
        <motion.div {...reveal} className="about-visual">
          <div className="about-blueprint" />
          <span className="about-top">A ENERGIA POR TRÁS DO SEU PROJETO</span>
          <div className="about-logo">
            <Zap fill="currentColor" />
            <strong>
              CSI<span>.</span>
            </strong>
            <small>E L E T R O L A R</small>
          </div>
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
          <div className="about-values">
            <span>
              <Lightbulb size={20} /> Soluções que inspiram
            </span>
            <span>
              <Headphones size={20} /> Atendimento próximo
            </span>
          </div>
          <button className="button" onClick={() => setDrawer(true)}>
            Vamos falar sobre seu projeto <ArrowUpRight size={18} />
          </button>
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
              <h3>Vamos conversar</h3>
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
