# Cache Lite App

Uma aplicação web em React + TypeScript para interagir com um servidor de cache via WebSocket.

## Funcionalidades

- Conexão a um servidor de cache via WebSocket (IP e porta configuráveis)
- Console para envio de comandos e visualização de logs/respostas do servidor
- Listagem de chaves armazenadas no cache
- Reconexão rápida e desconexão manual
- Interface responsiva com TailwindCSS

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) (com suporte a React e TypeScript)
- [nginx](https://www.nginx.com/) (para servir o build em produção via Docker)

## Estrutura do Projeto

```
├── src/
│   ├── context/CacheContext.tsx   # Contexto global para WebSocket e estado do cache
│   ├── pages/
│   │   ├── Connect/               # Tela de conexão ao servidor
│   │   └── Home/                  # Console principal e listagem de chaves
│   ├── ws/cacheSocket.ts          # (Reservado para lógica de WebSocket)
│   ├── App.tsx, main.tsx, etc.
├── public/
├── dockerfile                     # Dockerfile para build e deploy com nginx
├── nginx.conf                     # Configuração customizada do nginx
├── tailwind.config.js, postcss.config.js
├── package.json, tsconfig.json, etc.
```

## Como rodar localmente

1. **Instale as dependências:**
   ```sh
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```
   O app estará disponível em [http://localhost:5173](http://localhost:5173).

## Build para produção

```sh
npm run build
```
Os arquivos finais estarão em `dist/`.

## Docker

Para rodar em produção usando Docker + nginx:

```sh
docker build -t cache-lite-app .
docker run -p 5173:5173 cache-lite-app
```

## Configuração do Servidor de Cache

- O app espera um servidor WebSocket rodando no IP/porta informados na tela de conexão.
- Comandos podem ser enviados pelo console.
- O comando `KEYS` retorna as chaves armazenadas (espera-se resposta no formato `keys:chave1,chave2,...`).

## Licença

MIT

---

Desenvolvido por Luis Felipe F. Filho