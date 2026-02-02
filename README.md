# Sistema de Gestão de Editais - FAPES (Front-end)

O **Sistema de Gestão de Editais** é uma interface administrativa moderna e intuitiva desenvolvida para a FAPES. O objetivo é facilitar o cadastro, edição e acompanhamento de editais de fomento, garantindo usabilidade e conformidade com padrões visuais corporativos.

## 🚀 Sobre o Projeto

Este frontend foi construído com foco em performance e experiência do usuário (UX). Oferece um painel de controle limpo, feedback visual imediato (toasts), e interações dinâmicas (modais, filtros em tempo real).

### Principais Funcionalidades:
*   **Gestão de Editais**: Listagem paginada, filtros por status e busca textual.
*   **CRUD Completo**: Criação e Edição (Inclusive modo "In-Place" via Modal).
*   **Visualização de Detalhes**: Modal detalhado com pré-visualização de arquivos.
*   **Upload de Documentos**: Suporte a envio de PDFs e anexos.
*   **Design Responsivo**: Adaptável a diferentes tamanhos de tela e suporte a Dark Mode.

## 🛠 Tecnologias Utilizadas

*   **Vue.js 3** (Composition API, Script Setup)
*   **TypeScript** (Segurança de tipos)
*   **Vite** (Build tool ultrarrápido)
*   **TailwindCSS** (Estilização utilitária e design system)
*   **Pinia** (Gerenciamento de estado)
*   **Docker** (Containerização para produção)
*   **Lucide Vue Next** (Ícones SVG modernos)

## 📦 Como Rodar

### Pré-requisitos
*   Node.js 18+ ou Docker instalado.

### 1. Desenvolvimento Local

Para rodar o projeto em modo de desenvolvimento (hot-reload):

```bash
# Instale as dependências
npm install

# Inicie o servidor dev
npm run dev
```
O sistema estará acessível em `http://localhost:5173`.

### 2. Produção com Docker

Para rodar a versão de produção containerizada (Nginx):

```bash
# Construa e suba o container
docker-compose up -d --build
```
O sistema estará acessível em `http://localhost:3000`.

### 3. Mock Server (Backend Fake)

Para desenvolvimento frontend independente do Django (Offline Mode):

```bash
# Inicie o servidor mock (Porta 8001)
npm run mock-server

# Em outro terminal, inicie o frontend apontando para o mock
npm run switch:mock
npm run dev
```
O Fake Backend roda em `http://localhost:8001` e serve contratos definidos em `contracts/`.

## 📸 Screenshots

*(Espaço reservado para capturas de tela do Painel, Modal de Detalhes e Formulários)*

---
**FAPES** - Fundação de Amparo à Pesquisa do Espírito Santo
