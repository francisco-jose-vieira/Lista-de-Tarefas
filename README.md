# 🚀 Projeto Fullstack com Next.js, Prisma, PostgreSQL e Tailwind

Este projeto é uma aplicação fullstack desenvolvida com **Next.js** no front-end e **Prisma + PostgreSQL** no back-end.

------------------------------------------------------------------------

## 🧰 Tecnologias Utilizadas

-   [Next.js 14+](https://nextjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [TailwindCSS](https://tailwindcss.com/)
-   [Prisma ORM](https://www.prisma.io/)
-   [PostgreSQL](https://www.postgresql.org/)

------------------------------------------------------------------------

## ⚙️ Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

-   [Node.js (v18+)](https://nodejs.org/)
-   [PostgreSQL](https://www.postgresql.org/download/)
-   Um editor de código (recomendado: [VS
    Code](https://code.visualstudio.com/))

------------------------------------------------------------------------

## 📦 Como Clonar o Projeto

``` bash
# Clonar o repositório
git clone https://github.com/francisco-jose-vieira/Lista-de-Tarefas.git

# Entrar na pasta do projeto
cd Lista-de-Tarefas
```

------------------------------------------------------------------------

## 🧩 Instalar Dependências

``` bash
npm install
# ou
yarn install
```

------------------------------------------------------------------------

## 🔑 Configuração das Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione as
variáveis abaixo:

``` env
# URL de conexão com o banco PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nomedobanco?schema=public"

```

------------------------------------------------------------------------

## 🗃️ Configurar o Banco de Dados com Prisma

1.  Gere o cliente Prisma:

    ``` bash
    npx prisma generate
    ```

2.  Rode as migrações para criar as tabelas:

    ``` bash
    npx prisma migrate dev --name init
    ```

3.  (Opcional) Acesse o painel visual do banco:

    ``` bash
    npx prisma studio
    ```

------------------------------------------------------------------------

## 🎨 Rodar o Servidor de Desenvolvimento

``` bash
npm run dev
# ou
yarn dev
```



------------------------------------------------------------------------

## 🚀 Deploy 
O projeto estará disponível em:\
👉 **https://lista-de-tarefas-phi-vert.vercel.app/**

------------------------------------------------------------------------

## 👨‍💻 Autor

**Francisco José**\
📧 <franciscojose2703@gmail.com>\
💼 Desenvolvedor Front-end
