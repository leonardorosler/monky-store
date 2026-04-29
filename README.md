# Catálogo Atacado

Site-catálogo para atacado de roupas voltado a lojistas. Catálogo público com filtros por categoria, favoritos e contato direto via WhatsApp. Painel admin protegido para gerenciamento completo de produtos e categorias.

Projeto real em produção — desenvolvido do zero com foco em simplicidade operacional: sem backend próprio, sem cold start, sem custo de servidor.

---

## Funcionalidades

**Catálogo público**
- Listagem de produtos com filtro por categoria e busca por nome
- Página de detalhe com galeria de imagens, tamanhos, cores e preço
- Botão de contato via WhatsApp com mensagem pré-preenchida com o nome da peça
- Favoritos salvos localmente (localStorage), sem necessidade de login

**Painel admin** (`/admin`)
- Autenticação via Supabase Auth (acesso restrito)
- CRUD completo de produtos: nome, descrição, categoria, preço, tamanhos, cores, imagens e disponibilidade
- Upload de imagens direto para o Supabase Storage
- Gerenciamento de categorias (criar, editar, deletar)
- Marcar produto como disponível ou esgotado diretamente na listagem

---

## Stack

- **React 18 + Vite + TypeScript**
- **Supabase** — PostgreSQL, Storage e Auth
- **React Router v6**
- **Tailwind CSS**
- **Deploy:** Vercel (frontend only)

Arquitetura sem backend: o cliente React se comunica diretamente com o Supabase via SDK. A segurança é garantida pelo Row Level Security (RLS) no banco — leitura pública, escrita restrita a usuários autenticados.

---

## Rodando localmente

**Pré-requisitos:** Node.js 18+, conta no Supabase

```bash
# 1. Clonar e instalar
git clone https://github.com/seu-usuario/catalogo-atacado.git
cd catalogo-atacado
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 3. Rodar o SQL no Supabase
# SQL Editor → executar o conteúdo de supabase-setup.sql

# 4. Criar usuário admin
# Supabase → Authentication → Users → Add user

# 5. Iniciar
npm run dev
```

---

## Deploy

```bash
npm run build
```

Na Vercel, conectar o repositório e configurar as variáveis de ambiente:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Estrutura do projeto

```
src/
├── lib/            # Supabase client
├── types/          # Interfaces TypeScript
├── hooks/          # useProducts, useCategories, useFavorites
├── components/     # Navbar, ProductCard, CategoryFilter, ImageUpload, ProtectedRoute
└── pages/
    ├── Catalog.tsx
    ├── ProductDetail.tsx
    ├── Favorites.tsx
    └── admin/      # Login, Layout, ProductList, ProductForm, CategoryList
```
