"use client";
import { useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import toast, { Toaster } from 'react-hot-toast';
import {ScaleLoader} from 'react-spinners';
import { ItineraryDisplay } from './ItineraryDisplay';

interface ItineraryForm {
  destination: string;
  budget: string;
  lifestyle: string;
  duration: string;
}

export default function ItineraryGenerator() {
  const [formData, setFormData] = useState<ItineraryForm>({
    destination: '',
    budget: '',
    lifestyle: '',
    duration: '',
  });
  const [itinerary, setItinerary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      // Structured prompt with grounding
      const structuredPrompt = {
        destination: formData.destination,
        budget: formData.budget,
        lifestyle: formData.lifestyle,
        duration: formData.duration,
        requirements: {
          mustInclude: [
            "daily activities with times",
            "estimated costs",
            "local transportation",
            "restaurant recommendations",
            "must-see attractions"
          ],
          format: "structured daily itinerary"
        }
      };

      const prompt = `As an expert travel planner of over 20 Years of experience, create a detailed itinerary based on these specifications, the budget provided will be in the native currency of the destination:
      ${JSON.stringify(structuredPrompt, null, 2)}

      Before Going Ahead, Let me know if it's viable or not.
      Please format the response in pure markdown format as follows:

      # Day X

      ## Morning (9:00 AM - 12:00 PM)
      Activity 1 - Location - Estimated Cost
      Activity 2 - Location - Estimated Cost

      ## Afternoon (1:00 PM - 4:00 PM)
      Activity 1 - Location - Estimated Cost
      Activity 2 - Location - Estimated Cost

      ## Evening (7:00 PM - 10:00 PM)
      Activity 1 - Location - Estimated Cost
      Activity 2 - Location - Estimated Cost

      Include:
      * Specific time slots for each activity
      * Exact locations (not just general areas)
      * Realistic cost estimates in local currency
      * Transportation details between locations
      * Meal recommendations at local restaurants
      * Cultural insights and travel tips

      Make sure the itinerary:
      1. Matches the specified lifestyle preference
      2. Stays within the daily budget
      3. Includes local authentic experiences
      4. Considers realistic travel times between locations
      5. Balances tourist attractions with local experiences
      
      If you have any Extra remarks, add them under a ## Extra Remarks heading at the end.
      Use only pure markdown syntax without any HTML tags or classes, that can be perfectly compatible inside ReactMarkdown component.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings,
      });

      const response = await result.response;
      let generatedText = response.text();
      
      // Convert **# Day X** to # Day X
      generatedText = generatedText.replace(/\*\*#\s*(Day\s*\d+)\*\*/g, '# $1');
      // Convert remaining ** to proper markdown
      generatedText = generatedText.replace(/\*\*(.*?)\*\*/g, '# $1');
      
      console.log('=== GEMINI RESPONSE ===');
      console.log('Raw response:', response);
      console.log('Generated text after preprocessing:', generatedText);
      console.log('=== END GEMINI RESPONSE ===');
      
      setItinerary(generatedText);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setItinerary('Sorry, there was an error generating your itinerary. Please try again.');
      toast.error('Sorry, there was an error generating your itinerary. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="destination" className="block text-sm font-medium text-teal-300">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-500"
              placeholder="e.g., Tokyo, Japan"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-teal-300">
              Budget
            </label>
            <input
              type="text"
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-500"
              placeholder="e.g., ₹50,000"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lifestyle" className="block text-sm font-medium text-teal-300">
              Preferred Lifestyle
            </label>
            <select
              id="lifestyle"
              value={formData.lifestyle}
              onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
              required
            >
              <option value="">Select lifestyle</option>
              <option value="luxury">Luxury</option>
              <option value="comfort">Comfort</option>
              <option value="budget">Budget</option>
              <option value="backpacker">Backpacker</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-teal-300">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-500"
              placeholder="e.g., 5 days"
              required
            />
          </div>
        </div>

        <button 
          className={`w-full inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover::text-white ${loading ? 'bg-white text-black' : ''}`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <span className='text-white'>Loading</span>
                <ScaleLoader color='white' height={14} width={2} />
            </span>
          ) : (
            <span>Generate Itinerary</span>
          )}
        </button>
      </form>

      {itinerary && (
        <div className="mt-8">
          <ItineraryDisplay itinerary={itinerary} />
        </div>
      )}
    </div>
  );
}
