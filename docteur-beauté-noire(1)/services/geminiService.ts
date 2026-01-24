import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, AnalysisResult } from '../types';

export const generateSkinAnalysis = async (profile: UserProfile): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are "Docteur Beauté Noire", an expert dermatology-informed beauty coach specializing in melanin-rich (Black) skin.
    You act as a cosmetic chemist and product manager with a focus on African climates and availability.
    
    CRITICAL SAFETY & ETHICS:
    1. STRICT SAFETY: Do not provide medical diagnoses. Always include a disclaimer.
    2. MELANIN-RICH FOCUS: Address PIH, keloid risks, and specific barrier needs.
    3. AFRICA-FIRST: Recommend product types accessible in African markets (Nigeria, Ghana, Kenya, etc.) or globally accessible basic chemistry.
    4. INGREDIENTS: Provide safe dosage ranges (e.g., Niacinamide 2-5%, not 10%+ if sensitive).
    5. AVOID: Whitening agents (hydroquinone, mercury, steroids). Focus on "brightening" and "even tone".
    6. BARRIER HEALTH: Prioritize barrier repair if sensitivity is mentioned.
    7. LANGUAGE: Output content in ${profile.language === 'fr' ? 'FRENCH' : 'ENGLISH'}.
  `;

  // Prepare contents (multimodal if photo exists)
  const parts: any[] = [];

  // Add photos if available
  if (profile.photos.front) {
    // Basic base64 cleanup if header exists
    const base64Data = profile.photos.front.includes('base64,') 
      ? profile.photos.front.split('base64,')[1] 
      : profile.photos.front;
      
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
  }

  const promptText = `
    Generate a skincare routine and analysis for the following user.
    Language Preference: ${profile.language === 'fr' ? 'FRENCH' : 'ENGLISH'}
    
    Profile:
    Name: ${profile.name}
    Age: ${profile.age}
    Location: ${profile.location} (${profile.climate})
    Skin Type (Self-Reported): ${profile.skinType}
    Concerns: ${profile.concerns.join(", ")}
    Sensitivity: ${profile.sensitivity}
    Budget: ${profile.budget}
    Pregnant/Breastfeeding: ${profile.isPregnantOrBreastfeeding ? "Yes" : "No"}
    Shaving: ${profile.shavingFrequency || 'N/A'}
    History Flags: ${profile.historyFlags?.join(", ") || 'None'}
    Current Routine: ${profile.currentRoutine}

    If an image is provided:
    1. Analyze the front-facing photo for oiliness patterns (T-zone vs cheeks).
    2. Look for hyperpigmentation spots (PIH) common in melanin-rich skin.
    3. Assess texture (smooth vs congested).
    4. Refine the diagnostic based on visual evidence combined with self-report.
    
    Be extremely gentle and conservative if redness or irritation is visible.

    Provide the output in JSON format strictly matching the schema.
  `;

  parts.push({ text: promptText });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      snapshot: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          skinTypeConfidence: { type: Type.NUMBER },
          barrierStatus: { type: Type.STRING, enum: ['Healthy', 'Compromised', 'Needs Support'] },
          triggers: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['summary', 'skinTypeConfidence', 'barrierStatus', 'triggers']
      },
      routine: {
        type: Type.OBJECT,
        properties: {
          am: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepName: { type: Type.STRING },
                productType: { type: Type.STRING },
                instructions: { type: Type.STRING },
                recommendedProducts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      name: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                      localAlternative: { type: Type.STRING }
                    },
                    required: ['type', 'name', 'reason', 'keyIngredients']
                  }
                }
              },
              required: ['stepName', 'productType', 'instructions', 'recommendedProducts']
            }
          },
          pm: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepName: { type: Type.STRING },
                productType: { type: Type.STRING },
                instructions: { type: Type.STRING },
                recommendedProducts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      name: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                      localAlternative: { type: Type.STRING }
                    },
                    required: ['type', 'name', 'reason', 'keyIngredients']
                  }
                }
              },
              required: ['stepName', 'productType', 'instructions', 'recommendedProducts']
            }
          },
          weekly: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepName: { type: Type.STRING },
                productType: { type: Type.STRING },
                instructions: { type: Type.STRING },
                recommendedProducts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      name: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                      localAlternative: { type: Type.STRING }
                    },
                    required: ['type', 'name', 'reason', 'keyIngredients']
                  }
                }
              },
              required: ['stepName', 'productType', 'instructions', 'recommendedProducts']
            }
          }
        },
        required: ['am', 'pm', 'weekly']
      },
      keyIngredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            dosage: { type: Type.STRING },
            frequency: { type: Type.STRING },
            caution: { type: Type.STRING }
          },
          required: ['name', 'description', 'dosage', 'frequency', 'caution']
        }
      },
      lifestyleTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      disclaimer: { type: Type.STRING }
    },
    required: ['snapshot', 'routine', 'keyIngredients', 'lifestyleTips', 'disclaimer']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: responseSchema
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AnalysisResult;
};