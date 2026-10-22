# CSI Eletrolar — catálogo digital

Prévia em Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion e Lucide. Design responsivo com ilustrações SVG locais, sem dependência de fontes ou imagens externas. O documento original `CSI` foi preservado.

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

Todos os produtos, preços, especificações e imagens iniciais são **demonstrativos**, identificados na interface. Não representam estoque, marcas ou ofertas reais. O logotipo tipográfico é uma proposta visual. Não foram inventados telefone, endereço, CNPJ, avaliações, certificações ou histórico da empresa.

O painel permite criar, editar e excluir produtos, atualizar preços, carregar PNG/JPG/WebP de até 2 MB, gerir categorias e marcar destaques. Os quatro primeiros produtos destacados aparecem na inicial. Categorias com produtos não podem ser excluídas. Campos de preço vazios exibem “Preço sob consulta”.

Produtos e categorias ficam no `localStorage` deste navegador. A lista de orçamento também persiste localmente; suas quantidades são limitadas a 999. As alterações não são compartilhadas com outros visitantes, não são publicadas e podem ser perdidas ao limpar o armazenamento. O painel sinaliza essa limitação. Não há pagamentos online.

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
