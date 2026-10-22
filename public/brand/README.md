# Identidade oficial — original recebido e aplicado

O arquivo original foi recebido no ZIP `IMG_7694.JPG.zip` e instalado como `logo-oficial.jpg`, sem recorte, redesenho, remoção de fundo ou alteração dos pixels. A mesma arte completa é utilizada no cabeçalho, mobile, intro, institucional, rodapé e favicon.

Para uma futura substituição, salve **uma** versão como `logo-oficial.webp` (também aceita PNG, AVIF, JPG ou JPEG). Preserve a arte completa, proporções, mascote, texto, cores e margens; não redesenhe. O fundo branco pode permanecer: os componentes oferecem uma base clara para leitura em fundos escuros.

Opcionalmente, forneça `favicon-oficial.png` ou WebP, contendo a versão de ícone aprovada pela empresa. Sem um ícone separado, a logo completa será usada no favicon. Não corte automaticamente o mascote ou a marca para produzir um ícone.

Execute `npm run assets:prepare` e reinicie o desenvolvimento ou faça novo build. O manifesto conecta automaticamente a logo ao cabeçalho/menu mobile, intro, seção institucional, rodapé e favicon em `/icon.svg`. A intro preserva o bloqueio da primeira pintura, sessão e botão de pular; a imagem inteira recebe revelação, luz e movimento sem deformação. A versão com a imagem recebida foi conferida no navegador.

`favicon-provisorio.svg` permanece apenas como fallback caso a logo oficial seja removida. O favicon atual utiliza a logo oficial inteira; ainda não foi fornecida uma variante de ícone separada.
