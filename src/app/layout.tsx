import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import { ToastContainer } from '../components/Toast';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WanderLens - AI Travel Companion',
  description: 'Generate personalized travel itineraries with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
