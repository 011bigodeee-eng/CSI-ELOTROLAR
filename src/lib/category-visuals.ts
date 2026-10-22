/** Conceptual images illustrate the sector, never the company's actual premises or stock. */
export function categoryVisual(id: string) {
  const options: Record<
    string,
    { position: string; description: string; label: string }
  > = {
    cabos: {
      position: "0% 0%",
      description: "Conexões que dão vida a cada projeto.",
      label: "CONECTAR",
    },
    ar: {
      position: "100% 0%",
      description: "Conforto em todos os sentidos.",
      label: "CLIMATIZAR",
    },
    iluminacao: {
      position: "0% 100%",
      description: "Uma nova perspectiva para seu ambiente.",
      label: "ILUMINAR",
    },
    disjuntores: {
      position: "100% 100%",
      description: "Proteção começa com a escolha certa.",
      label: "PROTEGER",
    },
    tomadas: {
      position: "0% 100%",
      description: "O detalhe que conecta tudo.",
      label: "CONECTAR",
    },
    instalacao: {
      position: "100% 100%",
      description: "Tudo começa com uma boa instalação.",
      label: "CONSTRUIR",
    },
    ventilacao: {
      position: "100% 0%",
      description: "Leveza para viver e trabalhar melhor.",
      label: "RENOVAR",
    },
    acessorios: {
      position: "0% 0%",
      description: "Soluções que completam seu projeto.",
      label: "COMPLETAR",
    },
  };
  return (
    options[id] || {
      position: "100% 100%",
      description: "Descubra as possibilidades desta categoria.",
      label: "EXPLORAR",
    }
  );
}
