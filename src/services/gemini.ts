import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const describeVideo = async (videoBase64: string, mimeType: string, onProgress?: (text: string) => void) => {
  const ai = getAI();
  
  const prompt = `Describe this video in detail, scene by scene. 
  Break it down into timestamps or logical segments. 
  For each segment, describe:
  1. What is happening.
  2. The visual setting.
  3. Any notable objects or people.
  4. The overall mood or atmosphere.
  
  Be clear, objective, and thorough. Use Markdown for formatting.`;

  const maxRetries = 3;
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: videoBase64,
                },
              },
            ],
          },
        ],
      });

      return response.text;
    } catch (error: any) {
      lastError = error;
      // Check if it's a 503 or 429 error which are worth retrying
      const isRetryable = error.message?.includes("503") || 
                          error.message?.includes("429") || 
                          error.status === "UNAVAILABLE" ||
                          error.status === "RESOURCE_EXHAUSTED";
      
      if (isRetryable && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 2000; // 2s, 4s, 8s
        console.warn(`Gemini API busy (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};
