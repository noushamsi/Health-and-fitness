
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIFitnessAdvice = async (prompt: string, profile: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Profile: ${JSON.stringify(profile)}. User Question: ${prompt}`,
      config: {
        systemInstruction: "You are an expert fitness coach and nutritionist at Vertex Development. Provide concise, science-backed advice. If asked for plans, use structured formatting.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate advice right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the AI coach. Please try again later.";
  }
};

export const generateMealPlan = async (profile: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a one-day healthy meal plan for someone with these stats: ${JSON.stringify(profile)}. Output strictly valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fats: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["name", "calories", "protein"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"meals": []}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { meals: [] };
  }
};
