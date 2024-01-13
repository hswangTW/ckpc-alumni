import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const className = 'bg-black'

export const metadata: Metadata = {
  title: 'CKPC Alumni',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hant-TW" className='w-full h-full'>
      <body className={inter.className}>
        {children}
        <footer className='flex justify-center items-center'>
          <p className='text-xs'>UIcons by <Link className='text-sky-600' href="https://www.flaticon.com/uicons">Flaticon</Link></p>
        </footer>
      </body>
    </html>
  )
}
