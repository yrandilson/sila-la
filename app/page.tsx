import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import Link from 'next/link'
import { Search, ShoppingCart, Star, Heart, Zap } from 'lucide-react'

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return data || []
}

const typeEmoji: Record<string, string> = {
  planilha: '📊',
  software: '⚙️',
  site: '🌐',
  aplicacao: '📱',
  outro: '📦',
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export default async function HomePage() {
  const products = await getProducts()
  const categories = ['planilha', 'software', 'site', 'aplicacao', 'outro']

  return (
    <div className="store-page">
      {/* TOP NAV */}
      <header className="store-header">
        <div className="header-top">
          <div className="store-container">
            <div className="nav-top-row">
              <Link href="/" className="store-logo">
                Sila<span>Lá</span>
              </Link>

              <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Buscar produtos..." className="search-input" />
              </div>

              <div className="nav-actions">
                <button className="icon-btn" title="Favoritos">
                  <Heart size={18} />
                </button>
                <button className="icon-btn" title="Carrinho">
                  <ShoppingCart size={18} />
                  <span className="badge">0</span>
                </button>
                <Link href="/admin" className="btn-sm">Admin</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <div className="store-container">
            <nav className="category-nav">
              <button className="cat-btn active">Todos</button>
              {categories.map((cat) => (
                <button key={cat} className="cat-btn" data-category={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="hero-banner">
        <div className="store-container">
          <div className="banner-content">
            <h1>Ferramentas Digitais <span>para seu sucesso</span></h1>
            <p>Planilhas, softwares, templates e automações prontas para usar</p>
            <button className="btn-primary-lg">Explorar agora</button>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-section">
        <div className="store-container">
          <div className="trust-items">
            <div className="trust-item">
              <Zap size={20} />
              <span>Entrega Digital Imediata</span>
            </div>
            <div className="trust-item">
              <div className="shield-icon">🔒</div>
              <span>Pagamento Seguro com Stripe</span>
            </div>
            <div className="trust-item">
              <Star size={20} />
              <span>Suporte Completo ao Cliente</span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS & SORT */}
      <section className="products-section">
        <div className="store-container products-wrapper">
          {/* SIDEBAR FILTERS */}
          <aside className="filters-sidebar">
            <h3 className="filter-title">Filtros</h3>

            <div className="filter-group">
              <label className="filter-label">Ordenar por</label>
              <select className="filter-select">
                <option>Mais novo</option>
                <option>Maior preço</option>
                <option>Menor preço</option>
                <option>Populares</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Intervalo de preço</label>
              <div className="price-range">
                <input type="range" min="0" max="500" className="range-input" />
                <div className="price-display">
                  <span>R$ 0</span>
                  <span>R$ 500+</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Tipo de produto</label>
              {categories.map((cat) => (
                <label key={cat} className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="products-main">
            {products.length === 0 ? (
              <div className="empty-catalog">
                <p className="empty-title">Catálogo vazio</p>
                <p className="empty-desc">Nenhum produto publicado ainda. Volte em breve!</p>
                <Link href="/admin" className="btn-primary">Publicar produto</Link>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <article key={product.id} className="product-item">
                    <div className="product-image-wrapper">
                      <div className="product-image">
                        <span className="product-emoji">{typeEmoji[product.type] || '📦'}</span>
                      </div>
                      <button className="wishlist-btn">
                        <Heart size={18} />
                      </button>
                      {Math.random() > 0.5 && (
                        <div className="promo-badge">Top vendedor</div>
                      )}
                    </div>

                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>

                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < 4 ? 'filled' : ''}
                            />
                          ))}
                        </div>
                        <span className="rating-count">(42 avaliações)</span>
                      </div>

                      {product.tags?.length > 0 && (
                        <div className="product-tags">
                          {product.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="product-tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="product-footer">
                        <div>
                          <span className="price-label">De</span>
                          <p className="product-price">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <div className="product-actions">
                          <Link
                            href={`/produto/${product.slug}`}
                            className="btn-add-cart"
                          >
                            Comprar
                          </Link>
                          {product.demo_url && (
                            <a
                              href={product.demo_url}
                              target="_blank"
                              rel="noopener"
                              className="btn-demo"
                              title="Ver demo"
                            >
                              👁️
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="store-footer">
        <div className="store-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4 className="footer-title">Sobre</h4>
              <ul className="footer-links">
                <li><a href="#">Quem somos</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carreiras</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-title">Atendimento</h4>
              <ul className="footer-links">
                <li><a href="#">Contato</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Devoluções</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-title">Políticas</h4>
              <ul className="footer-links">
                <li><a href="#">Privacidade</a></li>
                <li><a href="#">Termos</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-title">Junte-se a nós</h4>
              <p className="footer-desc">Receba as novidades e ofertas exclusivas.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="seu@email.com" className="newsletter-input" />
                <button className="btn-primary-sm">Inscrever</button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© 2026 Sila Lá. Todos os direitos reservados.</p>
            <div className="payment-methods">
              <span>Stripe</span>
              <span>PIX</span>
              <span>Cartão</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
