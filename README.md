# WanderLens - AI Travel Companion

WanderLens is an AI-powered travel itinerary generator that creates personalized travel plans based on your destination, budget, and lifestyle preferences.

## Features

- Generate detailed travel itineraries using Google's Gemini AI
- Personalized recommendations based on your preferences
- Downloadable itineraries in a clean, receipt-like format
- Modern, responsive UI built with Next.js and Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter your travel details:
   - Destination
   - Budget
   - Lifestyle preference
   - Duration of stay

2. Click "Generate Itinerary" to create your personalized travel plan

3. Review the generated itinerary and download it if desired

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS/ Flowbite
- Google Gemini AI
- shadcn/ui components
- Aceternity UI effects
