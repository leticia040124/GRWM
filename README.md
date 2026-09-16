# GRWM

Sistema web acadêmico para organizar peças do guarda-roupa, montar looks e receber sugestões usando roupas cadastradas pelo próprio usuário. O projeto segue `GRWM (1).pdf` e o backlog contido nesse documento.

## Tecnologias

- React, TypeScript e Vite para a interface responsiva.
- Express para a API HTTP.
- PostgreSQL hospedado no Supabase para persistência.
- Multer para upload de fotos e bcryptjs para senhas.

## Requisitos do ambiente

Node.js 20 ou superior, npm e um projeto Supabase com acesso ao PostgreSQL.

## Instalação e execução

```powershell
git clone https://github.com/leticia040124/GRWM.git
cd GRWM
npm install
npm run build
npm run dev
```

Antes de iniciar, copie `.env.example` para `.env` e preencha `DATABASE_URL`. Se a senha tiver caracteres especiais, aplique codificação de URL à senha.

`npm run dev` compila e serve a interface e a API em `http://127.0.0.1:3001`. Depois de alterar o frontend, reinicie o comando para gerar uma nova compilação. Esta forma de execução evita uma restrição de acesso à pasta pai encontrada pelo otimizador de dependências do Vite neste ambiente.

Para executar uma versão compilada com um único servidor:

```powershell
npm run build
npm start
```

Abra `http://127.0.0.1:3001`. `npm run preview` também visualiza a compilação, mas requer a API em execução para usar os dados.

O servidor aplica `server/schema.sql` ao iniciar. Os comandos usam `CREATE TABLE IF NOT EXISTS`, portanto não apagam dados existentes.

## Como conferir os dados salvos

No painel do Supabase, abra **Table Editor**, selecione o esquema **grwm_app** e escolha uma tabela, como `users`, `items` ou `looks`. Esse esquema separado evita conflitos com tabelas que já existiam no projeto. Também é possível conferir a conexão e os principais registros pelo terminal:

```powershell
npm run db:inspect
```

O comando lista as tabelas, as quantidades e até 50 usuários, peças e looks. Por segurança, senhas nunca são exibidas.

## Variáveis de ambiente

`DATABASE_URL` é obrigatória e deve conter a conexão PostgreSQL fornecida pelo Supabase. Nunca envie o arquivo `.env` ao GitHub. `PORT` altera a porta da API (padrão: `3001`). Dados e imagens enviadas ficam no PostgreSQL, permitindo que continuem disponíveis após reinicializações da hospedagem.

## Publicação gratuita

O `render.yaml` prepara um Web Service gratuito no Render. Conecte o repositório, escolha essa branch e informe `DATABASE_URL` como variável secreta. O Render executará `npm ci && npm run build`, iniciará a aplicação com `npm start` e verificará `/api/health`. O serviço gratuito pode adormecer quando não está em uso; a primeira abertura seguinte pode demorar um pouco.

`OPENAI_API_KEY` é opcional e habilita sugestões automáticas a partir de fotos, prova virtual aproximada e simulação de maquiagem. `OPENAI_VISION_MODEL` permite trocar o modelo de análise (padrão: `gpt-5.6-luna`); `OPENAI_IMAGE_MODEL` troca o modelo de edição de imagem (padrão: `gpt-image-2.5-sunburst`). As fotos só são enviadas ao serviço externo quando o usuário aciona explicitamente o botão de análise ou simulação. Sugestões podem ser corrigidas antes de salvar; falhas não impedem o uso manual. A integração usa [Responses](https://developers.openai.com/api/reference/typescript/resources/beta/subresources/responses/methods/create) e [edição de imagens](https://developers.openai.com/api/docs/guides/image-generation). Chamadas externas podem gerar custos conforme a conta usada.

## Estrutura

- `src/App.tsx`: conta, navegação e carregamento dos dados.
- `src/pages.tsx`: telas e fluxos de closet, looks, histórico, inspirações, viagens, cápsulas, perfil e estatísticas.
- `src/lib.ts`: chamadas à API, tipos e regras locais de sugestão.
- `src/app.css`: estilos e responsividade.
- `server/index.js`: API, autenticação, consultas PostgreSQL, upload e rotas.
- `server/schema.sql`: tabelas, relacionamentos e índices do PostgreSQL.
- `render.yaml`: configuração de publicação do serviço web no Render.

## Decisões diante de pontos indefinidos

O PDF não define provedor de IA, fonte de clima, hospedagem nem credenciais. A geração inicial de looks usa regras locais de categoria, ocasião, estilo, preferências e feedback, conforme a evolução prevista no PB19. A análise de inspiração e compra usa características informadas pelo usuário e pode receber sugestões automáticas quando a integração opcional estiver configurada. O projeto funciona localmente sem serviço pago. A prova virtual e maquiagem são acionáveis somente com chave de API, e a imagem resultante é uma simulação aproximada, sem medida real de tamanho ou caimento. A integração externa não pôde ser testada sem credenciais.

A estimativa local de revenda aparece nos detalhes de uma peça quando há preço e condição informados. A fórmula, que o PDF não define, parte de 80%, 65%, 50% ou 35% do preço pago conforme a condição, reduz até 8% ao ano e 1,5% por uso (com limites de 50% e 55% para esses dois fatores) e mostra uma faixa de ±10%. É uma referência interna, sem consulta a preços de mercado.

Uploads aceitam JPG, PNG e WebP até 5 MB. Peças usadas em looks não podem ser excluídas diretamente, para preservar a integridade do histórico; remova-as primeiro dos looks associados.

