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
    name: "Cabo flexível 2,5 mm²",
    description:
      "Rolo de 100 metros para instalações elétricas. Especificações ilustrativas, sujeitas à confirmação.",
    category: "cabos",
    price: 189.9,
    image: "/products/cabos.svg",
    featured: true,
    badge: "Mais procurado",
  },
  {
    id: "p2",
    name: "Ar-condicionado Split Inverter",
    description:
      "Modelo demonstrativo de 12.000 BTUs, com tecnologia inverter e operação silenciosa. Disponibilidade a confirmar.",
    category: "ar",
    image: "/products/ar-condicionado.svg",
    featured: true,
    badge: "Tecnologia inverter",
  },
  {
    id: "p3",
    name: "Disjuntor tripolar 32 A",
    description:
      "Proteção para circuitos elétricos, curva C e montagem em trilho DIN. Consulte adequação ao seu projeto.",
    category: "disjuntores",
    price: 64.9,
    image: "/products/disjuntor.svg",
    featured: true,
  },
  {
    id: "p4",
    name: "Lâmpada LED bulbo 12 W",
    description:
      "Iluminação de uso geral, luz branca e base E27. Produto ilustrativo para apresentação do catálogo.",
    category: "iluminacao",
    price: 14.9,
    image: "/products/lampada.svg",
    featured: true,
    badge: "Economia de energia",
  },
  {
    id: "p5",
    name: "Tomada de embutir 20 A",
    description:
      "Conjunto de tomada com placa branca e padrão brasileiro de três pinos. Modelo demonstrativo.",
    category: "tomadas",
    price: 24.9,
    image: "/products/tomada.svg",
    featured: false,
  },
  {
    id: "p6",
    name: "Ventilador de mesa 40 cm",
    description:
      "Ventilação para ambientes internos, com ajuste de inclinação. Modelo demonstrativo.",
    category: "ventilacao",
    price: 179.9,
    image: "/products/ventilador.svg",
    featured: false,
  },
  {
    id: "p7",
    name: "Quadro de distribuição 12 módulos",
    description:
      "Organização de circuitos e instalação em trilho DIN. Capacidade e especificações a confirmar.",
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
export function quoteMessage(lines: QuoteLine[]) {
  return [
    "Olá, CSI Eletrolar! Gostaria de solicitar um orçamento:",
    "",
    ...lines.map(
      ({ product, quantity }, i) =>
        `${i + 1}. ${product.name} — ${quantity} un.`,
    ),
    "",
    "Por favor, confirmem os preços, a disponibilidade e as condições de entrega.",
    "Pedido gerado pela prévia demonstrativa do catálogo.",
  ].join("\n");
}
export function whatsappUrl(phone: string, lines: QuoteLine[]) {
  const digits = phone.replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(quoteMessage(lines))}`;
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
