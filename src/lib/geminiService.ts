import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface DealResult {
    name: string;
    price: string;
    store: string;
    url: string;
}

export interface ScoutResponse {
    deals: DealResult[];
    summary: string;
    sources: { title: string; url: string }[];
}

const SYSTEM_PROMPT = `You are a sneaker deal finder assistant for "100 Sneaker". 
When the user describes a sneaker they want, search the web for the best current deals and budget-friendly alternatives.

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "summary": "A brief 1-2 sentence overview of what you found",
  "deals": [
    {
      "name": "Full sneaker name and colorway",
      "price": "$XX",
      "store": "Store name",
      "url": "Direct link to the product page"
    }
  ]
}

Rules:
- Find 4-8 deals maximum
- Include the actual product page URL, not a search URL
- Focus on budget-friendly options (under $100 when possible)
- Include the store/retailer name
- Sort by price (lowest first)
- If you can't find exact matches, suggest similar styles at lower prices
- Always include real, working URLs from your search results`;

export async function scoutDeals(query: string): Promise<ScoutResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Find me the best current deals for: ${query}`,
        config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: SYSTEM_PROMPT,
        },
    });

    // Extract source citations from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
            title: c.web.title || "Source",
            url: c.web.uri,
        }));

    // Parse the JSON response
    let deals: DealResult[] = [];
    let summary = "";

    try {
        const text = response.text ?? "";
        // Try to extract JSON from the response (handle markdown fences)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            deals = parsed.deals ?? [];
            summary = parsed.summary ?? "";
        }
    } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        // Fallback: use raw text as summary
        summary = response.text ?? "Sorry, I couldn't find any deals right now. Please try again.";
    }

    return { deals, summary, sources };
}
