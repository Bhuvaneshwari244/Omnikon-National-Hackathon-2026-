import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { texts, targetLanguage } = await req.json();
    if (!Array.isArray(texts) || !targetLanguage) {
      return new Response(JSON.stringify({ error: "texts[] and targetLanguage required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (targetLanguage === "English" || targetLanguage === "en") {
      return new Response(JSON.stringify({ translations: texts }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const prompt = `Translate each item in the JSON array below to ${targetLanguage}. Preserve numbers, emojis, symbols, brand names (AgriLink, WhatsApp, AI, Gemini), and units exactly. Return ONLY a JSON array of the same length with translated strings, no explanations.\n\n${JSON.stringify(texts)}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a professional translator. Output only valid JSON arrays of strings." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await resp.json();
    let content: string = data?.choices?.[0]?.message?.content ?? "[]";
    content = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    let translations: string[];
    try {
      translations = JSON.parse(content);
      if (!Array.isArray(translations)) throw new Error("not array");
    } catch {
      const m = content.match(/\[[\s\S]*\]/);
      translations = m ? JSON.parse(m[0]) : texts;
    }
    if (translations.length !== texts.length) translations = texts;
    return new Response(JSON.stringify({ translations }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
