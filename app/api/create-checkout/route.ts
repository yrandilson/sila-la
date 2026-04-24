import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { env } from '@/lib/env'
import { isUuid } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json()
    if (typeof productId !== 'string' || !isUuid(productId)) {
      return NextResponse.json({ error: 'productId invalido' }, { status: 400 })
    }

    // Busca produto no Supabase
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('active', true)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const siteUrl = env.NEXT_PUBLIC_SITE_URL

    // Cria sessão Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price, // já em centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/produto/${product.slug}`,
      metadata: {
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
