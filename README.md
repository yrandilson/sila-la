# 🛒 Sila Lá — Loja de Produtos Digitais

> Stack: Next.js 14 · Supabase · Stripe · Vercel

---

Manual de operacao e vendas: `MANUAL_PUBLICACAO_E_VENDAS.md`

## 📋 ÍNDICE

1. [Criar contas](#1-criar-contas)
2. [Configurar Supabase](#2-configurar-supabase)
3. [Configurar Stripe](#3-configurar-stripe)
4. [Configurar o projeto local](#4-configurar-o-projeto-local)
5. [Fazer deploy na Vercel](#5-fazer-deploy-na-vercel)
6. [Cadastrar produtos](#6-cadastrar-produtos)
7. [Upload dos arquivos](#7-upload-dos-arquivos)
8. [Testar tudo](#8-testar-tudo)
9. [Plano de marketing](#9-plano-de-marketing)
10. [Checklist de lançamento](#10-checklist-de-lançamento)

---

## 1. Criar contas

| Serviço | Link | Custo |
|---|---|---|
| Supabase | https://supabase.com | Gratuito |
| Stripe | https://stripe.com/br | Gratuito (paga por venda) |
| Vercel | https://vercel.com | Gratuito |
| GitHub | https://github.com | Gratuito |

---

## 2. Configurar Supabase

### 2.1 Criar projeto
1. Acesse https://supabase.com → **New Project**
2. Escolha nome: `sila-la`
3. Defina uma senha forte para o banco
4. Região: **South America (São Paulo)**
5. Clique **Create new project** (aguarda ~2 min)

### 2.2 Criar as tabelas
1. No painel Supabase → **SQL Editor**
2. Cole o conteúdo do arquivo `supabase/schema.sql`
3. Clique **Run** (▶)

### 2.3 Criar o Storage bucket
1. Supabase → **Storage** → **New bucket**
2. Nome: `products`
3. Marque **Private** (NUNCA público — segurança dos arquivos)
4. Clique **Save**

### 2.4 Política de Storage (permitir upload via service role)
No SQL Editor, execute:
```sql
CREATE POLICY "Service role full access" ON storage.objects
  FOR ALL USING (true)
  WITH CHECK (true);
```

### 2.5 Pegar as chaves
Supabase → **Settings** → **API**:
- `URL` → NEXT_PUBLIC_SUPABASE_URL
- `anon public` → NEXT_PUBLIC_SUPABASE_ANON_KEY
- `service_role` → SUPABASE_SERVICE_ROLE_KEY (⚠️ nunca exponha no frontend)

---

## 3. Configurar Stripe

### 3.1 Ativar conta
1. Acesse https://dashboard.stripe.com
2. Complete o cadastro com seus dados bancários brasileiros
3. **Modo teste** para desenvolvimento (chaves com `sk_test_` e `pk_test_`)
4. **Modo live** para produção (chaves com `sk_live_` e `pk_live_`)

### 3.2 Pegar as chaves
Stripe → **Developers** → **API Keys**:
- `Publishable key` → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- `Secret key` → STRIPE_SECRET_KEY

### 3.3 Configurar Webhook
1. Stripe → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://SEU-SITE.vercel.app/api/webhook`
3. Eventos para ouvir: `checkout.session.completed`
4. Clique **Add endpoint**
5. Copie o **Signing secret** → STRIPE_WEBHOOK_SECRET

---

## 4. Configurar o projeto local

### 4.1 Instalar dependências
```bash
cd sila-la
npm install
```

### 4.2 Criar arquivo de variáveis
```bash
cp .env.example .env.local
```

Preencha `.env.local` com suas chaves:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.3 Rodar localmente
```bash
npm run dev
```
Acesse: http://localhost:3000

### 4.4 Testar webhook localmente (opcional)
```bash
# Instalar Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 5. Fazer deploy na Vercel

### 5.1 Subir para GitHub
```bash
git init
git add .
git commit -m "feat: loja sila lá v1"
git remote add origin https://github.com/SEU_USUARIO/sila-la.git
git push -u origin main
```

### 5.2 Importar na Vercel
1. Acesse https://vercel.com → **Add New** → **Project**
2. Selecione o repositório `sila-la`
3. Clique **Deploy**

### 5.3 Adicionar variáveis de ambiente
Vercel → Projeto → **Settings** → **Environment Variables**
Adicione TODAS as variáveis do `.env.local`, mas:
- Troque `NEXT_PUBLIC_SITE_URL` para a URL do seu site Vercel
- Em produção, troque as chaves `test_` pelas `live_`

### 5.4 Atualizar webhook da Stripe
Stripe → Webhooks → Edite o endpoint e atualize a URL para:
`https://sila-la.vercel.app/api/webhook`

---

## 6. Cadastrar produtos

Acesse: `https://seu-site.vercel.app/admin`

Campos:
| Campo | Descrição |
|---|---|
| Nome | Nome do produto |
| Slug | URL amigável (auto-gerado) |
| Tipo | planilha / software / site / aplicacao |
| Preço | Em reais (ex: 49,90) |
| Caminho do arquivo | Caminho no Supabase Storage (ex: `planilhas/arquivo.xlsx`) |
| Descrição curta | Uma linha — aparece na listagem |
| Descrição longa | Detalhes completos — aparece na página do produto |
| URL Demo | 🔑 Link de demonstração gratuita para o cliente testar antes de comprar |
| Tags | Palavras-chave separadas por vírgula |

### Dicas para a URL Demo por tipo de produto:
- **Planilha**: Compartilhe via Google Sheets em modo "visualização" ou "copiar"
- **Software**: Grave um vídeo no YouTube mostrando o uso
- **Template Site**: Publique uma versão de preview no Vercel/Netlify
- **Aplicação**: Crie uma conta demo com dados fictícios

---

## 7. Upload dos arquivos

### Via painel Supabase:
1. Supabase → **Storage** → bucket `products`
2. Crie pastas: `planilhas/`, `softwares/`, `sites/`, `apps/`
3. Faça upload do arquivo
4. Copie o caminho exato (ex: `planilhas/meu-arquivo.xlsx`)
5. Cole no campo **Caminho do arquivo** ao cadastrar o produto

---

## 8. Testar tudo

### Cartão de teste Stripe:
```
Número: 4242 4242 4242 4242
Validade: qualquer data futura
CVV: qualquer 3 dígitos
```

### Fluxo completo:
1. ✅ Abra a loja → veja produtos
2. ✅ Clique no produto → veja a página de detalhes
3. ✅ Clique em "Ver demo" → abre o preview
4. ✅ Clique "Comprar" → vai para checkout Stripe
5. ✅ Use o cartão de teste acima
6. ✅ Redireciona para `/sucesso`
7. ✅ Clique "Baixar agora" → faz download do arquivo
8. ✅ Verifique no Supabase → tabela `orders` → deve ter o pedido com `status: paid`

---

## 9. Plano de Marketing

### Fase 1 — Lançamento (Semana 1-2)

#### 🆓 Gratuito
- **WhatsApp**: Envie para todos os contatos relevantes com print do produto
- **Instagram**: Stories mostrando o produto em uso + link na bio
- **LinkedIn**: Post sobre o problema que o produto resolve
- **Grupos do Facebook/WhatsApp**: Grupos de finanças, empreendedores, área do produto
- **Reddit Brasil**: r/brdev, r/investimentos, r/financaspessoais (dependendo do produto)

#### 📊 Estratégia de conteúdo
- Grave um vídeo curto (Reels/TikTok) mostrando o resultado do produto em 30s
- Crie uma versão gratuita simplificada como isca digital
- Poste "antes e depois" de quem usa o produto

### Fase 2 — Crescimento (Mês 1-3)

#### SEO
- Crie posts de blog sobre o problema que seu produto resolve
- Título: "Como [resolver problema] — template grátis + versão pro"
- Target: termos com intenção de compra

#### Parcerias
- Contate criadores de conteúdo na área do produto
- Ofereça comissão de 30-40% por venda (afiliados)
- Procure no YouTube quem faz conteúdo sobre o tema

#### Preço estratégico
- Lance com desconto de 30-40% por "tempo limitado"
- Ofereça pacotes (ex: 3 produtos por R$ X)
- Crie versão lite gratuita para capturar e-mails

### Fase 3 — Escala (Mês 3+)

#### Tráfego pago (quando tiver caixa)
- Meta Ads: público de interesse relacionado ao produto
- Google Ads: palavras-chave de intenção (ex: "planilha controle financeiro")
- Orçamento mínimo: R$ 20/dia para testar

#### E-mail Marketing
- Capture e-mails com produto gratuito
- Use Brevo (gratuito até 300 emails/dia) ou MailerLite
- Sequência: boas-vindas → valor → oferta

### Canais por tipo de produto

| Produto | Melhor canal |
|---|---|
| Planilha financeira | Instagram, grupos financeiros, YouTube |
| Software / App | LinkedIn, comunidades dev, Product Hunt |
| Template de site | Instagram, LinkedIn, Behance |
| Planilha gestão | LinkedIn, grupos empreendedores |

---

## 10. Checklist de Lançamento

### Antes do lançamento:
- [ ] Supabase criado e tabelas rodando
- [ ] Stripe conta ativa com dados bancários
- [ ] Webhook configurado
- [ ] Deploy na Vercel funcionando
- [ ] Pelo menos 1 produto cadastrado com arquivo no Storage
- [ ] Fluxo de compra testado com cartão de teste
- [ ] Download funcionando após pagamento
- [ ] URL demo configurada no produto
- [ ] E-mail de contato funcionando

### Na semana do lançamento:
- [ ] Trocar chaves Stripe de `test` para `live`
- [ ] Atualizar `NEXT_PUBLIC_SITE_URL` para URL real
- [ ] Atualizar URL do webhook para URL de produção
- [ ] Testar compra real com valor de R$ 1,00
- [ ] Post no Instagram/LinkedIn anunciando

### Boas práticas contínuas:
- [ ] Verificar pedidos no Supabase toda semana
- [ ] Responder dúvidas em até 24h
- [ ] Atualizar produtos conforme feedback
- [ ] Adicionar novos produtos mensalmente

---

## 🆘 Suporte

Dúvidas sobre o código? Pode perguntar ao Claude.

---

*Gerado por Claude (Anthropic) — Sila Lá Store v1.0*
