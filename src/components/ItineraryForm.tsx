import { useState } from 'react';
import { ScaleLoader } from 'react-spinners';

export interface ItineraryFormData {
  destination: string;
  budget: string;
  lifestyle: string;
  duration: string;
}

interface ItineraryFormProps {
  onSubmit: (formData: ItineraryFormData) => Promise<void>;
  loading: boolean;
}

export function ItineraryForm({ onSubmit, loading }: ItineraryFormProps) {
  const [formData, setFormData] = useState<ItineraryFormData>({
    destination: '',
    budget: '',
    lifestyle: '',
    duration: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
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
        className={`w-full inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${loading ? 'bg-white text-black' : ''}`}
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
  );
}
