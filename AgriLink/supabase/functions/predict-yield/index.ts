import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { crop, temperature, rainfall, humidity, soilPH, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an advanced agricultural AI that predicts crop yield based on environmental parameters. You have deep knowledge of Indian agriculture, crop science, and agronomy.

Given the inputs, predict the yield in tons/hectare with a confidence percentage. Also provide smart actionable suggestions based on the input conditions, and a comparison of yields for common Indian crops under the same conditions.

IMPORTANT: Respond ONLY in ${language || "English"} language.

Respond in this exact JSON format:
{
  "predictedYield": <number in tons/hectare, 2 decimal places>,
  "confidence": <number 0-100>,
  "modelAccuracy": <number 85-96, realistic ML model accuracy>,
  "suggestions": [
    { "icon": "<emoji>", "text": "<actionable suggestion based on input conditions>" }
  ],
  "comparison": [
    { "crop": "<crop name>", "yield": <predicted yield number>, "isSelected": <true if this is the user's selected crop> }
  ],
  "optimalConditions": {
    "temperature": "<optimal range>",
    "rainfall": "<optimal range>",
    "humidity": "<optimal range>",
    "soilPH": "<optimal range>"
  }
}

Include 4-6 suggestions analyzing temperature, rainfall, humidity, soil pH.
Include 6 crops in comparison (Rice, Wheat, Maize, Cotton, Sugarcane, Groundnut) - adjust yields based on the given environmental conditions.`;

    const userPrompt = `Predict crop yield for:
- Crop: ${crop}
- Temperature: ${temperature}°C
- Rainfall: ${rainfall} mm
- Humidity: ${humidity}%
- Soil pH: ${soilPH}`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "predict_yield",
              description: "Return crop yield prediction with suggestions and comparison data",
              parameters: {
                type: "object",
                properties: {
                  predictedYield: { type: "number" },
                  confidence: { type: "number" },
                  modelAccuracy: { type: "number" },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        icon: { type: "string" },
                        text: { type: "string" },
                      },
                      required: ["icon", "text"],
                    },
                  },
                  comparison: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        crop: { type: "string" },
                        yield: { type: "number" },
                        isSelected: { type: "boolean" },
                      },
                      required: ["crop", "yield", "isSelected"],
                    },
                  },
                  optimalConditions: {
                    type: "object",
                    properties: {
                      temperature: { type: "string" },
                      rainfall: { type: "string" },
                      humidity: { type: "string" },
                      soilPH: { type: "string" },
                    },
                    required: ["temperature", "rainfall", "humidity", "soilPH"],
                  },
                },
                required: ["predictedYield", "confidence", "modelAccuracy", "suggestions", "comparison", "optimalConditions"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "predict_yield" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;

    if (toolCall?.function?.arguments) {
      result = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!result) throw new Error("No prediction result");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("predict-yield error:", e);
    return new Response(JSON.stringify({ error: e.message || "Prediction failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
