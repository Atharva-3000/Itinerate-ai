import ItineraryGenerator from '@/components/ItineraryGenerator'
import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
              WanderLens
            </span>
          </h1>
          <p className="text-xl text-teal-200">
            Your AI-Powered Travel Companion
          </p>
        </header>
        <ItineraryGenerator />
      </div>
    </main>
  )
}

