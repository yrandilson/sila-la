import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isUuid } from '@/lib/validation'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized(req)) {
    return unauthorized()
  }

  const id = params.id
  if (!isUuid(id)) {
    return NextResponse.json({ error: 'ID invalido' }, { status: 400 })
  }

  const payload = await req.json()
  if (typeof payload.active !== 'boolean') {
    return NextResponse.json({ error: 'Campo active deve ser boolean' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ active: payload.active })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthorized(req)) {
    return unauthorized()
  }

  const id = params.id
  if (!isUuid(id)) {
    return NextResponse.json({ error: 'ID invalido' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
