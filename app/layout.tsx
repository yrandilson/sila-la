import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sila Lá — Produtos Digitais',
  description: 'Planilhas, softwares, sites e aplicações prontos para usar. Compre, baixe e use agora.',
  keywords: 'produtos digitais, planilhas, software, templates, ferramentas',
  openGraph: {
    title: 'Sila Lá — Produtos Digitais',
    description: 'Ferramentas digitais que economizam seu tempo.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
