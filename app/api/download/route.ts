import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
  }

  // Busca o pedido pelo token
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*, products(*)')
    .eq('download_token', token)
    .eq('status', 'paid')
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Token não encontrado ou pedido inválido' }, { status: 404 })
  }

  // Verifica limite de downloads
  if (order.download_count >= order.max_downloads) {
    return NextResponse.json({ error: 'Limite de downloads atingido. Entre em contato pelo WhatsApp.' }, { status: 403 })
  }

  // Gera URL assinada (válida por 10 minutos)
  const { data: signedUrl, error: storageError } = await supabaseAdmin
    .storage
    .from('products')
    .createSignedUrl(order.products.file_path, 600) // 600 segundos = 10 min

  if (storageError || !signedUrl) {
    return NextResponse.json({ error: 'Erro ao gerar link de download' }, { status: 500 })
  }

  // Incrementa contador com guarda de concorrencia.
  const { data: updatedRows, error: updateError } = await supabaseAdmin
    .from('orders')
    .update({ download_count: order.download_count + 1 })
    .eq('id', order.id)
    .eq('download_count', order.download_count)
    .select('id')

  if (updateError) {
    return NextResponse.json({ error: 'Erro ao atualizar contador de downloads' }, { status: 500 })
  }

  if (!updatedRows || updatedRows.length === 0) {
    return NextResponse.json({ error: 'Requisicao concorrente detectada. Tente novamente.' }, { status: 409 })
  }

  // Redireciona para o arquivo
  return NextResponse.redirect(signedUrl.signedUrl)
}
