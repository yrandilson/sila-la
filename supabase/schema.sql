-- =============================================
-- SCHEMA COMPLETO - SILA LA STORE
-- Execute este SQL no Supabase > SQL Editor
-- =============================================

-- Tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price INTEGER NOT NULL, -- em centavos (R$ 49,90 = 4990)
  type TEXT NOT NULL CHECK (type IN ('planilha','software','site','aplicacao','outro')),
  demo_url TEXT,          -- URL para demo/preview gratuito
  file_path TEXT NOT NULL, -- caminho no Supabase Storage
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  download_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_orders_token ON orders(download_token);
CREATE INDEX idx_orders_session ON orders(stripe_session_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(active);

-- RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Produtos: leitura pública, escrita apenas admin
CREATE POLICY "Produtos públicos visíveis" ON products
  FOR SELECT USING (active = true);

-- Orders: leitura apenas com service role (via webhook)
-- Não expõe orders para o cliente via client público

-- =============================================
-- PRODUTO DE EXEMPLO (opcional)
-- =============================================
INSERT INTO products (name, slug, description, long_description, price, type, demo_url, file_path, cover_url, tags)
VALUES (
  'Planilha de Controle Financeiro Pro',
  'planilha-controle-financeiro-pro',
  'Controle total das suas finanças em uma planilha inteligente com dashboards automáticos.',
  'Esta planilha foi desenvolvida para quem quer ter controle total da vida financeira. Inclui: dashboard automático, categorização de gastos, projeção de metas, relatórios mensais e anuais. Compatível com Google Sheets e Excel.',
  4990,  -- R$ 49,90
  'planilha',
  'https://docs.google.com/spreadsheets/d/DEMO_ID/edit',
  'planilhas/controle-financeiro-pro.xlsx',
  '/covers/planilha-financeiro.jpg',
  ARRAY['finanças', 'planilha', 'excel', 'google sheets']
);
