export type Category = {
  id: string;
  name: string;
  short: string;
  image: string;
};
export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  image: string;
  featured: boolean;
  badge?: string;
  specifications?: string;
};
export const categories: Category[] = [
  {
    id: "cabos",
    name: "Fios e cabos elétricos",
    short: "Fios e cabos",
    image: "cabos",
  },
  {
    id: "disjuntores",
    name: "Disjuntores e quadros elétricos",
    short: "Disjuntores e quadros",
    image: "disjuntor",
  },
  {
    id: "tomadas",
    name: "Tomadas e interruptores",
    short: "Tomadas e interruptores",
    image: "tomada",
  },
  {
    id: "iluminacao",
    name: "Lâmpadas e iluminação LED",
    short: "Iluminação LED",
    image: "lampada",
  },
  {
    id: "instalacao",
    name: "Materiais para instalações elétricas",
    short: "Instalação elétrica",
    image: "instalacao",
  },
  {
    id: "ar",
    name: "Ar-condicionado",
    short: "Ar-condicionado",
    image: "ar-condicionado",
  },
  {
    id: "ventilacao",
    name: "Ventiladores e climatizadores",
    short: "Ventilação",
    image: "ventilador",
  },
  {
    id: "acessorios",
    name: "Acessórios para climatização",
    short: "Acessórios",
    image: "acessorio",
  },
];
export const demoProducts: Product[] = [
  {
    id: "p1",
    name: "Cabo flexível",
    description:
      "Exemplo visual de fio e cabo para seu projeto. Consulte os modelos, bitolas e aplicações disponíveis.",
    category: "cabos",
    image: "/products/cabos.svg",
    featured: true,
    badge: "Linha elétrica",
  },
  {
    id: "p2",
    name: "Ar-condicionado split",
    description:
      "Exemplo visual de climatização. Consulte os modelos disponíveis e a solução adequada ao seu ambiente.",
    category: "ar",
    image: "/products/ar-condicionado.svg",
    featured: true,
    badge: "Climatização",
  },
  {
    id: "p3",
    name: "Disjuntor tripolar",
    description:
      "Exemplo visual de proteção elétrica. Especificações e adequação ao projeto devem ser confirmadas no atendimento.",
    category: "disjuntores",
    image: "/products/disjuntor.svg",
    featured: true,
  },
  {
    id: "p4",
    name: "Lâmpada LED",
    description:
      "Exemplo visual de iluminação LED. Consulte os formatos e características dos produtos disponíveis.",
    category: "iluminacao",
    image: "/products/lampada.svg",
    featured: true,
    badge: "Iluminação",
  },
  {
    id: "p5",
    name: "Tomada de embutir",
    description:
      "Exemplo visual de tomada para instalações elétricas. Consulte os modelos e aplicações disponíveis.",
    category: "tomadas",
    image: "/products/tomada.svg",
    featured: false,
  },
  {
    id: "p6",
    name: "Ventilador de mesa",
    description:
      "Exemplo visual de ventilação para ambientes internos. Características e disponibilidade sob consulta.",
    category: "ventilacao",
    image: "/products/ventilador.svg",
    featured: false,
  },
  {
    id: "p7",
    name: "Quadro de distribuição",
    description:
      "Exemplo visual de organização de circuitos. Consulte as dimensões e especificações adequadas ao seu projeto.",
    category: "instalacao",
    image: "/products/instalacao.svg",
    featured: false,
  },
  {
    id: "p8",
    name: "Tubo de cobre para climatização",
    description:
      "Acessório para instalação de sistemas de climatização. Consulte dimensões e aplicação.",
    category: "acessorios",
    image: "/products/acessorio.svg",
    featured: false,
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export type QuoteLine = { product: Product; quantity: number };
export function quoteMessage(lines: QuoteLine[], notes = "") {
  return [
    "Olá, CSI Eletrolar! Gostaria de solicitar um orçamento:",
    "",
    ...lines.map(
      ({ product, quantity }, i) =>
        `${i + 1}. ${product.name} — ${quantity} un.`,
    ),
    "",
    ...(notes.trim() ? ["Observações:", notes.trim().slice(0, 1000), ""] : []),
    "Por favor, confirmem os preços, a disponibilidade e as condições de entrega.",
    "Pedido gerado pela prévia demonstrativa do catálogo.",
  ].join("\n");
}
export function whatsappUrl(phone: string, lines: QuoteLine[], notes = "") {
  const digits = phone.replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(quoteMessage(lines, notes))}`;
}
export function filterProducts(
  products: Product[],
  query: string,
  category: string,
) {
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  return products.filter(
    (p) =>
      (category === "todos" || p.category === category) &&
      normalize(`${p.name} ${p.description}`).includes(normalize(query.trim())),
  );
}
