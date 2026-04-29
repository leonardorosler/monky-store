-- ============================================================
-- CATÁLOGO ATACADO — Setup Supabase
-- Execute no SQL Editor do Supabase (em ordem)
-- ============================================================

-- 1. TABELAS
-- ------------------------------------------------------------

create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  price numeric(10,2) not null default 0,
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  available boolean default true,
  created_at timestamptz default now()
);

-- 2. ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table categories enable row level security;
alter table products enable row level security;

-- Leitura pública (catálogo aberto)
create policy "Public read categories"
  on categories for select using (true);

create policy "Public read products"
  on products for select using (true);

-- Escrita só para admins autenticados
create policy "Admin insert categories"
  on categories for insert with check (auth.role() = 'authenticated');

create policy "Admin update categories"
  on categories for update using (auth.role() = 'authenticated');

create policy "Admin delete categories"
  on categories for delete using (auth.role() = 'authenticated');

create policy "Admin insert products"
  on products for insert with check (auth.role() = 'authenticated');

create policy "Admin update products"
  on products for update using (auth.role() = 'authenticated');

create policy "Admin delete products"
  on products for delete using (auth.role() = 'authenticated');

-- 3. STORAGE BUCKET PARA IMAGENS
-- ------------------------------------------------------------
-- Execute separado se der erro de permissão no bucket

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Admin update product images"
  on storage.objects for update
  using (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'products' and auth.role() = 'authenticated');

-- ============================================================
-- APÓS RODAR O SQL:
-- No Supabase > Authentication > Users: crie os usuários admin
-- manualmente com e-mail e senha. Não há cadastro público.
-- ============================================================
