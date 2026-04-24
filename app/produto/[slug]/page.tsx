import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ExternalLink, ArrowLeft, Download, Shield } from 'lucide-react'
import CheckoutButton from './CheckoutButton'

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  return data
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const emoji = product.type === 'planilha' ? '📊' :
                product.type === 'software' ? '⚙️' :
                product.type === 'site' ? '🌐' :
                product.type === 'aplicacao' ? '📱' : '📦'

  return (
    <div className="noise-bg min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
      {/* NAV */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64 }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Voltar
          </Link>
          <span style={{ margin: '0 16px', color: 'var(--border)' }}>|</span>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              sila<span style={{ color: 'var(--green)' }}>lá</span>
            </span>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
        {/* LEFT */}
        <div>
          {/* Cover */}
          <div style={{
            height: 260,
            background: 'linear-gradient(135deg, #1a2a1a 0%, #0f1f0f 100%)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
            marginBottom: 32,
          }}>
            {emoji}
          </div>

          <div className="tag" style={{ marginBottom: 16 }}>
            {product.type === 'planilha' ? '📊 Planilha' :
             product.type === 'software' ? '⚙️ Software' :
             product.type === 'site' ? '🌐 Template' :
             product.type === 'aplicacao' ? '📱 Aplicação' : '📦 Produto'}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>{product.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

          {product.long_description && (
            <div style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 32, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
              {product.long_description.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: 8 }}>{line}</p>
              ))}
            </div>
          )}

          {product.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.7rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Demo Link */}
          {product.demo_url && (
            <div style={{ marginTop: 32, padding: 20, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 8, color: 'var(--green)' }}>🔍 Testar antes de comprar</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 12 }}>Veja uma versão de demonstração gratuita antes de decidir.</p>
              <a href={product.demo_url} target="_blank" rel="noopener" className="btn-outline" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ExternalLink size={14} /> Abrir Demo
              </a>
            </div>
          )}
        </div>

        {/* RIGHT — Checkout Card */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>
              {formatPrice(product.price)}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: 24 }}>Pagamento único · Sem mensalidade</p>

            <CheckoutButton productId={product.id} productName={product.name} />

            {product.demo_url && (
              <a href={product.demo_url} target="_blank" rel="noopener" className="btn-outline" style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: '0.85rem' }}>
                Ver demo grátis
              </a>
            )}

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: <Download size={14} />, text: 'Download imediato após pagamento' },
                { icon: <Shield size={14} />, text: 'Pagamento seguro via Stripe' },
                { icon: <CheckCircle size={14} />, text: 'Até 5 downloads do arquivo' },
                { icon: <CheckCircle size={14} />, text: 'Suporte incluído via WhatsApp' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: torna grid responsivo */}
      <style>{`
        @media (max-width: 680px) {
          div[style*="gridTemplateColumns: '1fr 340px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
