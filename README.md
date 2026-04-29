# Catálogo Atacado

Site-catálogo público para atacado de roupas. React + Supabase (sem backend próprio).

## Stack

- **React 18 + Vite + TypeScript**
- **Supabase** (PostgreSQL + Storage + Auth)
- **React Router v6**
- **Tailwind CSS**
- **Deploy:** Vercel (só o frontend)

---

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Encontre esses valores em: **Supabase > Project Settings > API**

### 3. Configurar o Supabase

Execute o arquivo `supabase-setup.sql` no **SQL Editor** do Supabase (em ordem, de cima pra baixo).

Isso cria:
- Tabelas `categories` e `products`
- RLS (leitura pública, escrita só para autenticados)
- Bucket `products` no Storage para imagens

### 4. Criar usuários admin

No Supabase: **Authentication > Users > Add user**

Crie com e-mail e senha. Não há cadastro público — só você cria os admins.

### 5. Rodar o projeto

```bash
npm run dev
```

---

## Rotas

| URL | Descrição |
|-----|-----------|
| `/` | Catálogo público |
| `/produto/:id` | Detalhe da peça |
| `/favoritos` | Peças favoritadas (localStorage) |
| `/admin/login` | Login admin |
| `/admin/produtos` | Listar/gerenciar produtos |
| `/admin/produtos/novo` | Cadastrar produto |
| `/admin/produtos/:id/editar` | Editar produto |
| `/admin/categorias` | Gerenciar categorias |

---

## Deploy na Vercel

1. Suba o projeto no GitHub
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente na Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático

---

## WhatsApp

Número configurado em `src/pages/ProductDetail.tsx`:

```ts
const WHATSAPP_NUMBER = '5553999882722'
```

A mensagem enviada ao clicar no botão:
> "Olá! Tenho interesse na peça: *Nome da Peça*"

---

## Personalização rápida

- **Nome do site:** Altere "Atacado" em `Navbar.tsx` e `AdminLayout.tsx`
- **Cores:** `tailwind.config.js` → objeto `colors`
- **Fonte:** `tailwind.config.js` + `index.html` (Google Fonts)
