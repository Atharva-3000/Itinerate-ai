import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,

} from "@google/generative-ai";

export interface ItineraryPrompt {
  destination: string;
  budget: string;
  lifestyle: string;
  duration: string;
}



export const generateItinerary = async (
  formData: ItineraryPrompt
): Promise<string> => {
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        "must-see attractions",
      ],
      format: "structured daily itinerary",
    },
  };

  const prompt = `As an expert travel planner with over 20 years of experience, create a detailed itinerary in pure Markdown format. Use only valid Markdown syntax. For each day, use the following structure:

# Day X

## Morning (e.g., 9:00 AM - 12:00 PM)
- Activity - Location - **Estimated Cost**

## Afternoon (e.g., 1:00 PM - 4:00 PM)
- Activity - Location - **Estimated Cost**

## Evening (e.g., 7:00 PM - 10:00 PM)
- Activity - Location - **Estimated Cost**

At the end of the itinerary, include:

## Extra Remarks
- Add any additional insights or travel tips.

Do not use redundant # symbols or include HTML tags. Ensure the text follows proper Markdown formatting.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const response = await result.response;
    const rawText = response.text();

    console.log('=== CLEANED MARKDOWN ===');
    console.log(rawText);
    console.log('=== END CLEANED MARKDOWN ===');

    return rawText;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary");
  }
};

