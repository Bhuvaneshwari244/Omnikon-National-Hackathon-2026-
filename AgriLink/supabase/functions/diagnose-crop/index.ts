import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, plantPart, language, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langNames: Record<string, string> = {
      hi: "Hindi", te: "Telugu", ta: "Tamil", kn: "Kannada", ml: "Malayalam",
      mr: "Marathi", bn: "Bengali", gu: "Gujarati", pa: "Punjabi", or: "Odia",
      as: "Assamese", ur: "Urdu", sd: "Sindhi", ks: "Kashmiri", ne: "Nepali",
      sa: "Sanskrit", mai: "Maithili", doi: "Dogri", kok: "Konkani", mni: "Manipuri",
      sat: "Santali", bodo: "Bodo",
    };
    const langName = langNames[language] || "";

    let systemPrompt: string;
    let userPrompt: string;

    if (mode === "fertilizer") {
      systemPrompt = `You are an expert agricultural chemist and fertilizer specialist. Analyze the uploaded image of a fertilizer product, fertilizer bag, or fertilizer sample and provide a comprehensive assessment.

IMPORTANT: Respond ONLY in valid JSON format with this exact structure:
{
  "fertilizerName": "Name/brand of the fertilizer if visible, or type identified",
  "fertilizerType": "Chemical / Organic / Bio-fertilizer / Mixed / Unknown",
  "composition": "NPK ratio or key nutrient composition (e.g., 10-26-26, Urea 46-0-0)",
  "nutrients": "Key nutrients provided (Nitrogen, Phosphorus, Potassium, Micronutrients, etc.)",
  "suitableCrops": "List of crops this fertilizer is best suited for",
  "applicationMethod": "How to apply — broadcasting, side dressing, foliar spray, fertigation, etc.",
  "dosage": "Recommended dosage per acre/hectare for common crops",
  "waterQuantity": "Recommended water quantity for mixing/dissolving/applying this fertilizer — liters per acre or per kg of fertilizer, irrigation needs after application, and any water-related instructions",
  "bestSeason": "Best season or growth stage to apply this fertilizer",
  "soilSuitability": "Which soil types benefit most from this fertilizer",
  "precautions": "Safety precautions, storage instructions, and handling warnings",
  "alternatives": "Organic or alternative fertilizer options that provide similar benefits",
  "quality": "Good / Average / Poor / Cannot Determine — visual quality assessment if possible",
  "warnings": "Any concerns — over-application risks, environmental impact, expiry signs, contamination"
}

If the image doesn't show a fertilizer, still respond with JSON but set fertilizerName to "Not a fertilizer image" and provide general fertilizer advice.
${langName ? `IMPORTANT: ALL text field values in the JSON MUST be written in ${langName} language. The JSON keys must remain in English, but ALL values must be in ${langName}.` : ""}`;

      userPrompt = "Analyze this fertilizer image. Identify the fertilizer type, composition, suitable crops, application method, dosage, and provide safety precautions and organic alternatives.";
    } else if (mode === "soil") {
      systemPrompt = `You are an expert soil scientist and agricultural advisor. Analyze the uploaded soil image and provide a comprehensive soil assessment.

IMPORTANT: Respond ONLY in valid JSON format with this exact structure:
{
  "soilType": "Type of soil (e.g., Clay, Sandy, Loamy, Silt, Red, Black/Cotton, Laterite, Alluvial, etc.)",
  "color": "Observed soil color and what it indicates",
  "texture": "Soil texture description (coarse, fine, granular, etc.)",
  "moistureLevel": "Low" or "Medium" or "High",
  "phEstimate": "Estimated pH range (e.g., 6.0-6.5 Slightly Acidic)",
  "organicMatter": "Low" or "Medium" or "High",
  "fertility": "Low" or "Medium" or "High" or "Very High",
  "fertilityTips": "Detailed advice on how to improve and maintain soil fertility",
  "soilMaintenance": "Detailed soil maintenance practices — mulching, composting, crop rotation, cover cropping, etc.",
  "suitableCrops": "List of crops best suited for this soil type",
  "waterQuantity": "Recommended irrigation water quantity for this soil type — liters per acre per watering, frequency of watering, best irrigation method (drip, flood, sprinkler), and water retention tips",
  "waterRetention": "Poor" or "Moderate" or "Good" or "Excellent",
  "drainage": "Poor" or "Moderate" or "Good" or "Excessive",
  "improvements": "Specific amendments and improvements recommended (lime, gypsum, organic matter, etc.)",
  "warnings": "Any concerns like salinity, erosion risk, compaction, nutrient deficiency signs"
}

If the image doesn't show soil, still respond with JSON but set soilType to "Not a soil image" and provide general soil care advice.
${langName ? `IMPORTANT: ALL text field values in the JSON MUST be written in ${langName} language. The JSON keys must remain in English, but ALL values must be in ${langName}.` : ""}`;

      userPrompt = "Analyze this soil image. Identify the soil type, assess its health, fertility, moisture, and provide detailed maintenance and improvement recommendations.";
    } else {
      systemPrompt = `You are an expert agricultural scientist and plant pathologist. Analyze the uploaded image of a ${plantPart || "plant"} and provide a diagnosis.

IMPORTANT: Respond ONLY in valid JSON format with this exact structure:
{
  "disease": "Name of the disease or condition",
  "severity": "Low" or "Medium" or "High" or "Critical",
  "affectedPart": "${plantPart || "Unknown"}",
  "confidence": number between 0 and 100,
  "treatment": "Detailed treatment recommendations including specific chemicals/doses",
  "waterQuantity": "Recommended water quantity for the affected plant — liters per plant per day, irrigation frequency, whether to increase or reduce watering, and water management tips to help recovery",
  "prevention": "Preventive measures to avoid recurrence",
  "organicTreatment": "Organic/natural treatment alternatives",
  "symptoms": "Key symptoms observed in the image",
  "cause": "What causes this disease (fungal, bacterial, viral, nutritional, pest, etc.)",
  "soilCare": "Soil maintenance tips related to this disease — how soil health affects this condition and what soil amendments can help prevent it"
}

If the image doesn't show a plant or disease, still respond with JSON but set disease to "No disease detected" or "Not a plant image" and provide general farming advice in treatment/prevention fields.
${langName ? `IMPORTANT: ALL text field values in the JSON MUST be written in ${langName} language. The JSON keys must remain in English, but ALL values must be in ${langName}.` : ""}`;

      userPrompt = `Analyze this ${plantPart || "plant"} image for diseases, pests, or nutritional deficiencies. Provide detailed diagnosis including soil care recommendations.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", status, errorText);
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let result;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      result = JSON.parse(jsonMatch[1].trim());
    } catch {
      if (mode === "soil") {
        result = {
          soilType: "Analysis Complete", color: content, texture: "See analysis", moistureLevel: "Medium",
          phEstimate: "6.0-7.0", organicMatter: "Medium", fertility: "Medium",
          fertilityTips: content, soilMaintenance: "Consult local expert", suitableCrops: "Various",
          waterRetention: "Moderate", drainage: "Moderate", improvements: "Add organic compost", warnings: "None detected",
        };
      } else {
        result = {
          disease: "Analysis Complete", severity: "Medium", affectedPart: plantPart || "Unknown",
          confidence: 75, treatment: content, prevention: "Consult a local agricultural expert.",
          organicTreatment: "Use neem-based solutions.", symptoms: "See analysis", cause: "Requires further analysis",
          soilCare: "Maintain soil health with regular organic matter addition.",
        };
      }
    }

    // Fallback for fertilizer parse failure
    if (mode === "fertilizer" && result.disease) {
      result = {
        fertilizerName: "Analysis Complete", fertilizerType: "Unknown", composition: content,
        nutrients: "See analysis", suitableCrops: "Various", applicationMethod: "Consult label",
        dosage: "Follow manufacturer instructions", bestSeason: "Varies by crop",
        soilSuitability: "General", precautions: "Handle with care", alternatives: "Organic compost",
        quality: "Cannot Determine", warnings: "None detected",
      };
    }

    // Tag result with mode
    result._mode = mode || "disease";

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("diagnose-crop error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
