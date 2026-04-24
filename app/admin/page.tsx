'use client'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
import { Plus, Trash2, Eye, EyeOff, Package } from 'lucide-react'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  long_description: '',
  price: '',
  type: 'planilha',
  demo_url: '',
  file_path: '',
  cover_url: '',
  tags: '',
  active: true,
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [adminToken, setAdminToken] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'list' | 'new'>('list')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token') || ''
    if (storedToken) {
      setAdminToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (adminToken) {
      void fetchProducts()
    }
  }, [adminToken])

  async function apiRequest(path: string, options: RequestInit = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
        ...(options.headers || {}),
      },
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(payload.error || 'Erro na API')
    }

    return payload
  }

  async function fetchProducts() {
    try {
      const payload = await apiRequest('/api/admin/products', { method: 'GET' })
      setProducts(payload.products || [])
    } catch (error: any) {
      setMsg('Erro ao carregar produtos: ' + error.message)
    }
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  function saveToken() {
    const normalized = tokenInput.trim()
    if (!normalized) {
      setMsg('Token nao pode ficar vazio.')
      return
    }

    localStorage.setItem('admin_token', normalized)
    setAdminToken(normalized)
    setTokenInput('')
    setMsg('Token salvo com sucesso.')
  }

  function logoutToken() {
    localStorage.removeItem('admin_token')
    setAdminToken('')
    setProducts([])
    setMsg('Token removido.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      await apiRequest('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || autoSlug(form.name),
          description: form.description,
          long_description: form.long_description,
          price: form.price,
          type: form.type,
          demo_url: form.demo_url || null,
          file_path: form.file_path,
          cover_url: form.cover_url || null,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
          active: form.active,
        }),
      })

      setMsg('Produto criado com sucesso!')
      setForm(emptyForm)
      await fetchProducts()
      setTab('list')
    } catch (error: any) {
      setMsg('Erro: ' + error.message)
    }

    setLoading(false)
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await apiRequest(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !current }),
      })
      await fetchProducts()
    } catch (error: any) {
      setMsg('Erro ao alterar status: ' + error.message)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Deletar produto? Esta acao nao pode ser desfeita.')) return

    try {
      await apiRequest(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })
      await fetchProducts()
    } catch (error: any) {
      setMsg('Erro ao deletar produto: ' + error.message)
    }
  }

  const inputStyle = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: '#fff',
    padding: '10px 14px',
    fontSize: '0.88rem',
    width: '100%',
    fontFamily: 'var(--font-body)',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    color: 'var(--muted)',
    fontSize: '0.75rem',
    marginBottom: 6,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  }

  if (!adminToken) {
    return (
      <div className="noise-bg min-h-screen" style={{ display: 'grid', placeItems: 'center', padding: 24, position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ width: '100%', maxWidth: 520, padding: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 8 }}>Acesso ao painel</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 18 }}>
            Informe o token ADMIN_PANEL_TOKEN para gerenciar produtos.
          </p>

          <input
            style={inputStyle}
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Cole aqui seu token"
          />

          <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={saveToken}>
            Entrar no admin
          </button>

          {msg && <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 12 }}>{msg}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="noise-bg min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Package size={18} style={{ color: 'var(--green)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Admin - Sila La</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={logoutToken} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.75rem', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>Sair</button>
            <a href="/" style={{ color: 'var(--muted)', fontSize: '0.82rem', textDecoration: 'none' }}>&larr; Ver loja</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[
            { id: 'list', label: `Produtos (${products.length})` },
            { id: 'new', label: 'Novo produto' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'list' | 'new')}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: tab === t.id ? 'var(--green)' : 'var(--border)',
                background: tab === t.id ? 'rgba(34,197,94,0.1)' : 'transparent',
                color: tab === t.id ? 'var(--green)' : 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'list' && (
          <div>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                <p>Nenhum produto cadastrado ainda.</p>
                <button onClick={() => setTab('new')} className="btn-primary" style={{ marginTop: 16 }}>Criar primeiro produto</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map((p) => (
                  <div key={p.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{p.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>/{p.slug} - {formatPrice(p.price)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 20, background: p.active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', color: p.active ? 'var(--green)' : 'var(--muted)', border: `1px solid ${p.active ? 'rgba(34,197,94,0.3)' : 'var(--border)'}` }}>
                        {p.active ? 'Ativo' : 'Oculto'}
                      </span>
                      <button onClick={() => toggleActive(p.id, p.active)} title="Alternar visibilidade" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 6 }}>
                        {p.active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => deleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 6 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'new' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome do produto *</label>
                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} required placeholder="Ex: Planilha de Controle Financeiro Pro" />
              </div>

              <div>
                <label style={labelStyle}>Slug (URL) *</label>
                <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="planilha-controle-financeiro-pro" />
              </div>

              <div>
                <label style={labelStyle}>Tipo *</label>
                <select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="planilha">Planilha</option>
                  <option value="software">Software</option>
                  <option value="site">Template Site</option>
                  <option value="aplicacao">Aplicacao</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Preco (R$) *</label>
                <input style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="49,90" />
              </div>

              <div>
                <label style={labelStyle}>Caminho do arquivo no Storage *</label>
                <input style={inputStyle} value={form.file_path} onChange={(e) => setForm({ ...form, file_path: e.target.value })} required placeholder="planilhas/nome-do-arquivo.xlsx" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descricao curta *</label>
                <input style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Uma linha descrevendo o produto..." />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descricao longa</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} placeholder="Detalhes completos do produto, o que esta incluido, como usar..." />
              </div>

              <div>
                <label style={labelStyle}>URL Demo / Preview</label>
                <input style={inputStyle} value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} placeholder="https://docs.google.com/spreadsheets/..." />
              </div>

              <div>
                <label style={labelStyle}>Tags (separadas por virgula)</label>
                <input style={inputStyle} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="excel, financas, controle, dashboard" />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
                <label htmlFor="active" style={{ color: '#ccc', fontSize: '0.85rem', cursor: 'pointer' }}>Publicar imediatamente (visivel na loja)</label>
              </div>
            </div>

            {msg && (
              <div style={{ marginTop: 16, padding: '10px 16px', background: msg.toLowerCase().includes('erro') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', borderRadius: 8, fontSize: '0.85rem', color: msg.toLowerCase().includes('erro') ? '#ef4444' : 'var(--green)' }}>
                {msg}
              </div>
            )}

            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={16} />
                {loading ? 'Salvando...' : 'Criar produto'}
              </button>
              <button type="button" onClick={() => setForm(emptyForm)} className="btn-outline">Limpar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
