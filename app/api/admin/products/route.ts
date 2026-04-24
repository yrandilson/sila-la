import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isSafeSlug, normalizeTags, parsePriceInCents } from '@/lib/validation'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return unauthorized()
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data || [] })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return unauthorized()
  }

  const payload = await req.json()

  const name = (payload.name || '').toString().trim()
  const slug = (payload.slug || '').toString().trim().toLowerCase()
  const description = (payload.description || '').toString().trim()
  const longDescription = (payload.long_description || '').toString().trim()
  const filePath = (payload.file_path || '').toString().trim()
  const type = (payload.type || '').toString().trim()
  const demoUrl = (payload.demo_url || '').toString().trim()
  const coverUrl = (payload.cover_url || '').toString().trim()
  const active = Boolean(payload.active)

  const validTypes = ['planilha', 'software', 'site', 'aplicacao', 'outro']

  if (!name || !description || !filePath) {
    return NextResponse.json({ error: 'Campos obrigatorios ausentes' }, { status: 400 })
  }

  if (!isSafeSlug(slug)) {
    return NextResponse.json({ error: 'Slug invalido' }, { status: 400 })
  }

  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Tipo invalido' }, { status: 400 })
  }

  const parsedPrice = parsePriceInCents(payload.price)
  if (!parsedPrice) {
    return NextResponse.json({ error: 'Preco invalido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      slug,
      description,
      long_description: longDescription || null,
      price: parsedPrice,
      type,
      demo_url: demoUrl || null,
      file_path: filePath,
      cover_url: coverUrl || null,
      tags: normalizeTags(payload.tags),
      active,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data }, { status: 201 })
}
