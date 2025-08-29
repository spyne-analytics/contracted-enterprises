import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Contracted Rooftops Dashboard',
  description: 'Dashboard for managing contracted rooftops',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
