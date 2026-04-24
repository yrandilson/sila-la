export type ProductType = 'planilha' | 'software' | 'site' | 'aplicacao' | 'outro'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  long_description: string
  price: number           // em centavos (R$ 49,90 = 4990)
  type: ProductType
  demo_url?: string       // link para testar/preview
  file_path: string       // caminho no Supabase Storage
  cover_url: string       // imagem de capa
  tags: string[]
  active: boolean
  created_at: string
}

export interface Order {
  id: string
  email: string
  product_id: string
  stripe_session_id: string
  status: 'pending' | 'paid' | 'failed'
  download_token: string
  download_count: number
  max_downloads: number
  created_at: string
}
