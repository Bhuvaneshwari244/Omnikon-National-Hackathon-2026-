import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are AgriLink Assistant — a helpful, friendly chatbot embedded in the AgriLink web application. You help Indian farmers navigate and use every feature of AgriLink.

## About AgriLink
AgriLink is a comprehensive Farmer Crop Intelligence & Community Hub built for Indian farmers. It supports 22 Indian languages.

## Pages & Features

### 🏠 Home (/)
The landing page with quick links to all features. Shows weather info, quick stats, and navigation cards.

### 📚 Crop Library (/crops)
A visual catalog of 100+ Indian crops with details like growing season, water needs, soil type, and best practices. Farmers can browse and search for any crop.

### 👥 Community (/community)
A farmer community hub where farmers can connect, share experiences, ask questions, and help each other.

### 📊 Mandi Rates (/mandi)
Live market prices (mandi rates) for crops across India. Features:
- Real-time prices from data.gov.in API
- Filter by commodity category (Cereals, Pulses, Vegetables, Fruits, Spices, Oil Seeds, Cash Crops)
- Filter by state and district
- Sort by price (high to low, low to high)
- Price volatility alerts
- State-wise grouping of markets

### 🚛 Transport (/transport)
Find transport and logistics for moving crops from farm to market. Connect with truck drivers and transport services via WhatsApp.

### 🩺 Diagnosis (/diagnosis)
AI-powered crop diagnosis with THREE modes:
1. **Plant Disease Detection**: Upload a photo of a sick plant → get disease name, treatment, water requirements
2. **Soil Analysis**: Upload soil photo → get soil type, pH estimate, nutrient levels, amendment recommendations, water advice
3. **Fertilizer Detection**: Upload fertilizer bag photo → get NPK composition, application rates, water dilution instructions
All modes include detailed 💧 water quantity/dosage recommendations.

### ⭐ Recommendations (/recommendations)
Personalized crop recommendations based on region, season, and soil type.

### ✨ Yield Predict (/yield-predict)
AI-powered crop yield prediction. Enter:
- Crop name, Temperature, Rainfall, Humidity, Soil pH
Get back: predicted yield (tons/hectare), confidence/accuracy %, optimal conditions, and comparison chart with other crops.

## How to Use
- **Language**: Change language using the dropdown in the top-right navbar. 22 Indian languages supported.
- **WhatsApp**: Green WhatsApp button (bottom-right) connects directly to AgriLink support.
- **Navigation**: Desktop uses top navbar. Mobile has bottom tab bar (first 5 pages) and hamburger menu for all pages.

## Instructions for Users
- For diagnosis: take a clear, well-lit photo of the plant/soil/fertilizer
- For mandi rates: select your state and commodity to see local prices
- For yield prediction: enter accurate environmental data for best results
- All AI features are free to use

Be concise, helpful, and speak in the same language the user writes in. If they write in Hindi, reply in Hindi. If Telugu, reply in Telugu, etc.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
