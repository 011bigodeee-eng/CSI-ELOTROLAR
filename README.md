# CSI Eletrolar — catálogo digital

Prévia em Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion e Lucide. Design responsivo com imagens conceituais locais em WebP, ilustrações SVG e fonte variável Manrope auto-hospedada (licença OFL em `src/app/fonts/OFL.txt`). Sem requisições externas para fontes ou imagens. O documento original `CSI` foi preservado.

## Desenvolvimento

Requer Node.js 20.9 ou superior (validado com 24.19) e npm.

```sh
npm ci
npm run dev
```

O catálogo funciona sem banco, sem credenciais e sem configuração inicial. `/` é a apresentação, `/catalogo` oferece pesquisa, categorias e ordenação, e `/admin` é o painel protegido.

## Configuração

Copie `.env.example` para `.env.local` e preencha apenas os campos necessários:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número **oficial** da empresa, com `55`, DDD e número, somente dígitos. Sem ele, a lista oferece cópia e visualização da mensagem e explica que o WhatsApp está pendente. Reinicie o desenvolvimento ou refaça o build após alterar essa variável pública.
- `ADMIN_PASSWORD`: senha forte definida pelo proprietário. Não há senha padrão. Não use prefixo `NEXT_PUBLIC_`.
- `ADMIN_SESSION_SECRET`: segredo aleatório persistente, gerado com `openssl rand -hex 32`. Necessário junto com a senha para habilitar o painel.

Não versionar `.env.local`. A sessão utiliza cookie HttpOnly, SameSite Strict, Secure sob HTTPS e validade de oito horas, com assinatura HMAC validada no servidor. O login verifica origem e limita tentativas na memória do processo. Em múltiplas instâncias, substitua esse limite por armazenamento compartilhado antes de uso em produção.

## Prévia e persistência

Os produtos e imagens iniciais são **demonstrativos**, identificados na interface. Os dados padrão não incluem preços nem promessas de estoque ou especificações técnicas não confirmadas. Não representam marcas ou ofertas reais. Imagens conceituais geradas não retratam instalações da empresa. Cadastros já salvos no navegador não são sobrescritos pelo redesign. O logotipo tipográfico é uma proposta visual. Não foram inventados telefone, endereço, CNPJ, avaliações, certificações ou histórico da empresa.

O painel permite criar, editar e excluir produtos, atualizar preços, carregar PNG/JPG/WebP de até 2 MB, gerir categorias e marcar destaques. Os quatro primeiros produtos destacados aparecem na inicial. Categorias com produtos não podem ser excluídas. Campos de preço vazios exibem “Preço sob consulta”.

Produtos e categorias ficam no `localStorage` deste navegador. A lista de orçamento também persiste localmente; suas quantidades são limitadas a 999. Observações opcionais (até 1.000 caracteres) ficam no `sessionStorage` e integram a mensagem do orçamento. As alterações não são compartilhadas com outros visitantes, não são publicadas e podem ser perdidas ao limpar o armazenamento. O painel sinaliza essa limitação. Não há pagamentos online.

## Futura integração com Supabase

`src/lib/repository.ts` define o contrato de persistência e o adaptador local. Para integração, transforme o contrato em assíncrono, implemente um adaptador Supabase e atualize o carregamento do provider. O frontend e os componentes de catálogo não precisam consultar diretamente o banco.

Esquema sugerido: `categories(id, name, short, image)` e `products(id, name, description, category_id, price, image_url, featured, badge)`, com chave estrangeira e restrição para preço positivo. Use Supabase Auth para proprietário, políticas RLS de leitura pública e escrita somente de administradores, e Storage para imagens. Nunca envie uma service role key ao cliente. Migre as mutações do navegador para operações autenticadas no backend. Não trate o bloqueio da tela como autorização para futuras APIs.

## Verificação

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
```

Os testes E2E usam credenciais exclusivas de teste no processo temporário do servidor, sem alterar `.env.local`. Instale Chromium com `npx playwright install chromium`, ou aponte `PLAYWRIGHT_CHROMIUM_EXECUTABLE` para um navegador instalado. Os testes percorrem busca, filtro, orçamento persistente, autenticação, CRUD de produto e categoria, upload e layout móvel.

## Vercel

Importe este repositório, selecione **Next.js**, mantenha `npm run build` como comando de build e a saída padrão do framework. Cadastre as variáveis necessárias nas configurações do projeto antes do deploy. O `vercel.json` declara explicitamente o framework Next.js, os comandos de instalação/build e a saída `.next`, inclusive para projetos importados inicialmente como sites estáticos. Em **Root Directory**, use a raiz do repositório (vazio ou `.`), e mantenha a branch de produção `main`. A configuração atual solicita que buscadores não indexem a prévia; remova essa restrição em `src/app/layout.tsx` apenas quando as informações oficiais estiverem prontas.

O catálogo público pode ser apresentado sem banco ou WhatsApp. Para envio real, informe o telefone oficial. Para publicação definitiva, substitua os dados demonstrativos, revise a identidade visual com o cliente e integre persistência/autorização de produção se o proprietário precisar atualizar o catálogo para todos os visitantes.

## Redesign premium

- Hero com revelação por palavras, luz acompanhando o cursor, parallax leve por CSS/Motion e três produtos flutuantes. Os atalhos de categoria respondem ao hover e ao foco. Sem WebGL ou bibliotecas 3D adicionais.
- Abertura da marca de aproximadamente 2,2 segundos, uma única vez por sessão na inicial. `sessionStorage` indisponível ou movimento reduzido desabilitam a abertura; ela nunca captura cliques nem trava a navegação.
- Cabeçalho com vidro sutil, compactação ao rolar, indicador da seção ativa e mega menu alimentado pelas categorias cadastradas. Escape, foco e clique externo fecham o menu.
- Categorias com imagens conceituais em uma composição editorial; nomes e links seguem os cadastros existentes. Categorias novas recebem uma apresentação genérica, sem sugerir estoque.
- Visualização rápida em `<dialog>` nativo: foco contido, Escape, retorno do foco, quantidade e indicação de itens já adicionados. O código do modal é carregado sob demanda.
- Skeletons durante o carregamento real, transições na pesquisa/filtros e feedback ao adicionar itens. As funções de preço, ordenação, upload e CRUD permanecem disponíveis.
- Fonte e imagens servidas localmente. WebPs da hero e das categorias somam aproximadamente 350 kB; a mesma imagem de composição é reutilizada pelo cache. Imagens fora da tela têm lazy loading.
- `prefers-reduced-motion` desabilita abertura, flutuação e parallax. Dispositivos com ponteiro de toque recebem efeitos simplificados. Animações não controlam o acesso ao conteúdo principal.

O WhatsApp continua usando `NEXT_PUBLIC_WHATSAPP_NUMBER`; nenhum contato ou perfil social foi inventado. O painel e a arquitetura de persistência existentes foram preservados, sem novo backend.
