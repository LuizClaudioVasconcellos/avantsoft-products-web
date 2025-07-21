# 🚀 Frontend - Gerenciamento de Produtos

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" width="120" alt="Next.js Logo" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="110" alt="React Logo" />
</p>

Aplicação frontend para consumo da API de produtos, desenvolvida com Next.js e TypeScript.

## ✨ Funcionalidades

- Listagem de produtos ordenada por nome
- Formulário para cadastro de novos produtos
- Visualização em tempo real das alterações
- Design responsivo e moderno

## 🛠️ Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- React Hook Form + Zod

## ⚡ Como Executar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/LuizClaudioVasconcellos/avantsoft-products-web.git
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure a API** (crie um arquivo `.env`):
   ```env
   API_URL=http://localhost:3000
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse no navegador**:
   ```
   http://localhost:3001
   ```

## 🚀 Comandos Úteis

| Comando          | Descrição                          |
|------------------|------------------------------------|
| `npm run dev`    | Inicia o servidor de desenvolvimento (porta 3001) |
| `npm run build`  | Gera a versão de produção          |
| `npm run start`  | Inicia o servidor de produção      |
| `npm run lint`   | Executa o linter do código         |

## 🌐 Variáveis de Ambiente

| Variável               | Descrição                     | Exemplo                |
|------------------------|-------------------------------|------------------------|
| `API_URL`  | URL da API backend            | `http://localhost:3000`|
