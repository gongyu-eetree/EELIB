import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeHardwareImage(base64Image: string, task: string) {
  const model = "gemini-2.5-flash-image";
  const prompt = `You are an expert hardware engineer assistant. Based on the uploaded image, perform the following task: ${task}.
  Please provide professional analysis, including component identification, circuit principles, potential risks, or BOM alternatives.
  Reply in English.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Sorry, an error occurred during analysis. Please try again later.";
  }
}

export async function componentChat(query: string, imageBase64?: string | null) {
  const model = "gemini-3-flash-preview";
  try {
    let contents: any = query;
    
    // If image exists, construct multimodal request
    if (imageBase64) {
      contents = {
        parts: [
          { text: query || "Please analyze this image." },
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "You are a senior FAE (Field Application Engineer). Your task is to help hardware engineers and sales staff with component selection, technical parameter comparison, and finding alternatives. Your answers should be professional, accurate, and objective. If the user uploads an image, please analyze it. Reply in English."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Query failed. Please check your network or API configuration.";
  }
}

export async function deepComponentSearch(query: string) {
  // Switched to flash-preview for better stability with strict JSON generation
  const model = "gemini-3-flash-preview"; 
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `User is searching for a component or has a requirement: "${query}".
      Analyze this requirement and return 1-3 best matching electronic components.
      If it's a specific MPN, return detailed data for that MPN.
      If it's a description (e.g., "3.3V LDO"), recommend popular high-value parts.
      
      Important:
      1. Accurately judge if a component is an "Asian Source" or "Domestic" to China (isDomestic).
      2. Use real placeholder images or logo URLs.
      3. Generate full specs summary, pinout, and market analysis.
      4. All text fields must be in English.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Full Part Number (MPN)" },
              manufacturer: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              isDomestic: { type: Type.BOOLEAN, description: "True if manufacturer is from Asia/China (Low Cost Source)" },
              specs: { 
                type: Type.OBJECT, 
                properties: {
                  core: {type: Type.STRING},
                  voltage: {type: Type.STRING},
                  package: {type: Type.STRING},
                  temp: {type: Type.STRING}
                }
              },
              pinout: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pin: { type: Type.STRING },
                    func: { type: Type.STRING },
                    desc: { type: Type.STRING }
                  }
                }
              },
              engineeringInsights: {
                type: Type.OBJECT,
                properties: {
                   ratings: {
                     type: Type.OBJECT,
                     properties: {
                       newbieFriendly: { type: Type.NUMBER },
                       competitionPopularity: { type: Type.NUMBER },
                       failureRisk: { type: Type.NUMBER }
                     }
                   },
                   pitfalls: { type: Type.ARRAY, items: { type: Type.STRING }},
                   bestFit: { type: Type.ARRAY, items: { type: Type.STRING }}
                }
              },
              aiAdvice: {
                type: Type.OBJECT,
                properties: {
                  pros: { type: Type.ARRAY, items: { type: Type.STRING }},
                  cons: { type: Type.ARRAY, items: { type: Type.STRING }},
                  risks: {
                    type: Type.OBJECT,
                    properties: {
                      lifecycle: { type: Type.STRING },
                      supply: { type: Type.STRING },
                      thermalEMC: { type: Type.STRING },
                      secondSource: { type: Type.STRING }
                    }
                  }
                }
              },
              marketInfo: {
                 type: Type.OBJECT,
                 properties: {
                   priceTrend: { type: Type.STRING, enum: ["Rising", "Stable", "Falling"] },
                   buyingAdvice: { type: Type.STRING },
                   sources: {
                     type: Type.ARRAY,
                     items: {
                       type: Type.OBJECT,
                       properties: {
                         distributor: { type: Type.STRING },
                         price: { type: Type.STRING },
                         stock: { type: Type.STRING },
                         isAuthorized: { type: Type.BOOLEAN },
                         leadTime: { type: Type.STRING }
                       }
                     }
                   }
                 }
              }
            },
            required: ["name", "manufacturer", "description", "isDomestic", "specs", "aiAdvice"]
          }
        }
      }
    });
    
    // Process response to ensure it matches the full ComponentData type approximately
    const responseText = response.text || "[]";
    // Sanitize if markdown block is present (sometimes flash does this even with json mode)
    const jsonStr = responseText.replace(/```json\n?|```/g, '');
    const rawData = JSON.parse(jsonStr);
    
    return rawData.map((item: any) => ({
      ...item,
      id: `ai_${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&q=80&w=200', // Default placeholder
      datasheetInsights: {
        designNotes: "AI Generated Summary. Please refer to official PDF.",
        parameterTable: item.specs || {},
        datasheetUrl: `https://www.google.com/search?q=${item.name}+datasheet`,
        previewUrl: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=400'
      },
      alternatives: [],
      cad: {
        symbolUrl: '',
        footprintUrl: '',
        model3dUrl: ''
      }
    }));
  } catch (error) {
    console.error("Deep Search Error:", error);
    throw error;
  }
}

export async function chatAboutNews(query: string, newsContext: string) {
  const model = "gemini-3-flash-preview";
  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are a professional tech commentator and electronics engineer. Based on the following news content, discuss with the user:\n\n--- News Context ---\n${newsContext}\n--- End Context ---\n\nProvide deep insights, technical explanations, or trend predictions. Use Google Search for latest background info if needed. Reply in English. Use Markdown.`
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini News Chat Error:", error);
    return "AI discussion service is temporarily unavailable.";
  }
}

export async function generateHardwareSolution(requirement: string) {
  const model = "gemini-3-pro-preview";
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a complete technical solution based on the following hardware requirements: ${requirement}. Reply in English.`,
      config: {
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topologyName: { type: Type.STRING, description: "Name of the circuit topology" },
            description: { type: Type.STRING, description: "Brief description of the solution" },
            modules: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Key functional modules"
            },
            bom: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mpn: { type: Type.STRING, description: "Part Number" },
                  mfg: { type: Type.STRING, description: "Manufacturer" },
                  func: { type: Type.STRING, description: "Function" },
                  price: { type: Type.STRING, description: "Estimated Unit Price (USD)" },
                  stock: { type: Type.STRING, description: "Availability Status" }
                },
                required: ["mpn", "mfg", "func"]
              }
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                performance: { type: Type.INTEGER, description: "Performance Score (0-100)" },
                cost: { type: Type.INTEGER, description: "Cost Efficiency Score (0-100)" },
                availability: { type: Type.INTEGER, description: "Supply Stability Score (0-100)" },
                tradeoff: { type: Type.STRING, description: "Trade-off Analysis" }
              }
            }
          },
          required: ["topologyName", "description", "bom", "analysis"]
        }
      }
    });
    
    // Process response text to handle potential markdown code blocks
    const responseText = response.text || "{}";
    const jsonStr = responseText.replace(/```json\n?|```/g, '');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Generate Solution Error:", error);
    throw error;
  }
}