import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const productId = session.metadata?.product_id
    const email = session.customer_details?.email || session.customer_email || ''

    if (!productId) {
      console.error('No product_id in metadata')
      return NextResponse.json({ error: 'No product_id' }, { status: 400 })
    }

    // Upsert evita erro em caso de reenvio do mesmo evento pela Stripe.
    const { error } = await supabaseAdmin.from('orders').upsert({
      email,
      product_id: productId,
      stripe_session_id: session.id,
      status: 'paid',
      download_count: 0,
      max_downloads: 5,
    }, { onConflict: 'stripe_session_id' })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Pedido criado: ${email} → produto ${productId}`)
  }

  return NextResponse.json({ received: true })
}
