import { GoogleGenAI, Type } from "@google/genai";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. Analyze Face/Body
export const analyzeImage = async (file: File, mode: 'FACE' | 'BODY'): Promise<{ features: string[], suggestions: {name: string, description: string}[], reasoning: string }> => {
  if (!apiKey) throw new Error("API Key not found");

  const base64Data = await fileToGenerativePart(file);
  const mimeType = file.type;

  const model = "gemini-2.5-flash";
  
  let prompt = "";
  if (mode === 'FACE') {
    prompt = `Analyze this image of a face. 
    1. Identify face shape, skin tone, hair texture, and glasses suitability.
    2. Suggest 3 specific haircuts/styles that would fit perfectly.
    3. Suggest a beard style (if male-presenting or applicable).
    4. Suggest glasses shape.
    Return the response as a valid JSON object.`;
  } else {
    prompt = `Analyze this full body image.
    1. Identify body shape and current style.
    2. Suggest 3 specific fashion outfits that would flatter this body type.
    3. Explain why these styles work.
    Return the response as a valid JSON object.`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          features: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of identified features (e.g. Oval face, Fair skin, Athletic build)"
          },
          suggestions: {
            type: Type.ARRAY,
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the style (e.g. 'Textured Crop' or 'Smart Casual')" },
                description: { type: Type.STRING, description: "A visual description of what this style looks like." }
              }
            },
            description: "List of recommended styles"
          },
          reasoning: {
            type: Type.STRING,
            description: "A short paragraph explaining why these styles fit the user."
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No analysis received from AI");
  }

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse JSON", response.text);
    throw new Error("Failed to parse AI response");
  }
};

// 2. Visual Transformation (Virtual Try-On)
export const generateStyleVisualization = async (file: File, promptRequest: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const base64Data = await fileToGenerativePart(file);
  const mimeType = file.type;

  // Using gemini-2.5-flash-image for image editing capabilities
  const model = "gemini-2.5-flash-image";

  const prompt = `Edit this image to show the person with the following style: ${promptRequest}. 
  Maintain the person's identity, facial features, and pose as strictly as possible. 
  Only change the hair, facial hair, glasses, or clothing as requested. 
  Make it look photorealistic. High quality.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    }
  });

  // Extract image from response
  // The response might contain text or inlineData. We look for inlineData.
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("No image generated. The model might have refused the request or returned only text.");
};
