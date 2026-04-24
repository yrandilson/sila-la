# Manual Completo de Publicacao e Vendas

Este manual mostra como cadastrar e vender produtos digitais no sistema Sila La.

## 1. O que voce pode vender

- Planilhas
- Automacoes
- Sites e templates
- Aplicacoes web
- Scripts
- Sistemas
- Extensoes
- Apps e outros arquivos digitais

Regra principal: o arquivo final deve estar no bucket privado do Supabase Storage, e o caminho correto deve ser cadastrado no produto.

## 2. Configuracao obrigatoria

Preencha as variaveis em `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SITE_URL=https://seu-site.vercel.app
ADMIN_PANEL_TOKEN=crie-um-token-forte-aqui
```

Dicas para o token admin:

- Minimo 32 caracteres
- Use letras maiusculas/minusculas, numeros e simbolos
- Nunca compartilhe em WhatsApp ou email

## 3. Como publicar produtos no site

1. Rode o projeto (`npm run dev`) e abra `/admin`.
2. Informe o token `ADMIN_PANEL_TOKEN`.
3. Clique em `Novo produto`.
4. Preencha os campos:

- Nome do produto
- Slug da URL
- Tipo
- Preco
- Caminho do arquivo no Storage
- Descricao curta
- Descricao longa (opcional)
- URL demo (opcional)
- Tags (opcional)
- Ativo (publicar agora)

5. Clique em `Criar produto`.
6. Confira o produto na homepage e na pagina `/produto/[slug]`.

## 4. Padrao de organizacao do Storage

Crie pastas no bucket `products` para manter o catalogo limpo:

- `planilhas/`
- `automacoes/`
- `sites/`
- `aplicacoes/`
- `scripts/`
- `sistemas/`
- `extensoes/`
- `apps/`
- `outros/`

Padrao recomendado de arquivo:

`categoria/nome-produto-versao.ext`

Exemplos:

- `planilhas/controle-financeiro-v2.xlsx`
- `scripts/automacao-relatorios-v1.zip`
- `extensoes/chrome-leads-exporter-v1.zip`

## 5. Precificacao (guia rapido)

Use um preco inicial para validar demanda.

- Entrada: R$ 19,90 a R$ 79,90
- Intermediario: R$ 89,90 a R$ 299,90
- Premium: R$ 399,90+

Sugestao pratica:

1. Comece com preco de entrada por 15 dias.
2. Colete feedback e ajuste produto.
3. Suba preco gradualmente.

## 6. Fluxo de compra do cliente

1. Cliente abre o produto.
2. Clica em comprar.
3. Stripe processa pagamento.
4. Webhook marca pedido como pago.
5. Cliente vai para `/sucesso`.
6. Cliente baixa pelo link assinado.

## 7. Checklist antes de publicar um novo produto

- Arquivo enviado no bucket privado
- Caminho do arquivo testado
- Nome e descricao revisados
- URL demo funcionando
- Preco correto
- Produto com status ativo
- Compra teste aprovada no Stripe
- Download teste concluido

## 8. Estrategia para comecar (sua pergunta: se da certo)

Sim, e um bom inicio para vender produtos digitais.

Para dar certo, foque no seguinte:

1. Nicho claro (ex.: produtividade para pequenos negocios)
2. Oferta simples (1 problema, 1 promessa)
3. Prova (demo, video, caso de uso)
4. Distribuicao (Instagram, WhatsApp, YouTube curto, comunidades)
5. Iteracao semanal (melhore produto com base em uso real)

## 9. Plano de retencao e escala

- Crie versao basica e versao pro
- Lance bundles (3 produtos por preco especial)
- Tenha atualizacoes mensais e changelog
- Ofereca suporte por canal unico
- Capture emails no pos-venda para upsell

## 10. Erros comuns para evitar

- Deixar arquivo em bucket publico
- Cadastrar `file_path` errado
- Publicar sem teste de compra real
- Vender sem demo
- Misturar publico de nichos muito diferentes

## 11. Operacao semanal recomendada

1. Segunda: revisar metricas (vendas, conversao, ticket)
2. Terca: produzir 1 novo conteudo de divulgacao
3. Quarta: ajustar paginas de produto
4. Quinta: melhorar um produto existente
5. Sexta: publicar 1 oferta (desconto ou bundle)

## 12. Meta de primeiros 30 dias

- 5 a 10 produtos publicados
- 1 venda por dia como meta inicial
- 2 canais de aquisicao ativos
- 1 rotina fixa de melhoria semanal

Se mantiver consistencia, este sistema e uma boa base para crescer seu negocio digital.
