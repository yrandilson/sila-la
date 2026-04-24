'use client'
import { useState } from 'react'
import { ShoppingCart, Loader2 } from 'lucide-react'

export default function CheckoutButton({ productId, productName }: { productId: string; productName: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (e) {
      alert('Erro ao iniciar checkout. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn-primary"
      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '1rem', padding: '14px' }}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
      {loading ? 'Redirecionando...' : 'Comprar agora'}
    </button>
  )
}
