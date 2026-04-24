import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { CheckCircle, Download, ArrowLeft } from 'lucide-react'

async function getOrder(sessionId: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*, products(*)')
    .eq('stripe_session_id', sessionId)
    .eq('status', 'paid')
    .single()
  return data
}

export default async function SucessoPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id
  const order = sessionId ? await getOrder(sessionId) : null

  return (
    <div className="noise-bg min-h-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
      <div className="card fade-up" style={{ maxWidth: 500, width: '100%', padding: 40, textAlign: 'center' }}>
        <div style={{ color: 'var(--green)', marginBottom: 20 }}>
          <CheckCircle size={56} style={{ margin: '0 auto' }} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Pagamento confirmado!</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 32 }}>
          Obrigado pela compra. Seu download está pronto.
        </p>

        {order ? (
          <>
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: 20, marginBottom: 24, textAlign: 'left' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: 4 }}>Produto</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{order.products?.name}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: 8 }}>
                Downloads restantes: <strong style={{ color: '#fff' }}>{order.max_downloads - order.download_count}</strong> de {order.max_downloads}
              </p>
            </div>

            <a
              href={`/api/download?token=${order.download_token}`}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '1rem', padding: '14px', marginBottom: 12 }}
            >
              <Download size={18} />
              Baixar agora
            </a>

            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 24 }}>
                Compra vinculada ao email: <strong style={{ color: '#fff' }}>{order.email}</strong>
            </p>
          </>
        ) : (
          <div style={{ background: 'rgba(255,200,0,0.06)', border: '1px solid rgba(255,200,0,0.2)', borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <p style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
              ⏳ Seu pedido está sendo processado. Aguarde alguns segundos e recarregue a página.
            </p>
          </div>
        )}

        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Voltar à loja
        </Link>
      </div>
    </div>
  )
}
