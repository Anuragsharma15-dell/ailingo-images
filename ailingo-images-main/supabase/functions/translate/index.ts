import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, targetLocale } = await req.json();

    if (!content || !targetLocale) {
      throw new Error("Content and targetLocale are required");
    }

    const LINGO_DEV_API_KEY = Deno.env.get("LINGO_DEV_API_KEY");
    if (!LINGO_DEV_API_KEY) {
      throw new Error("LINGO_DEV_API_KEY is not configured");
    }

    console.log(`Translating content to ${targetLocale}`);

    // Call Lingo.dev API
    const response = await fetch("https://api.lingo.dev/v1/translate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LINGO_DEV_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        sourceLocale: "en",
        targetLocale,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lingo.dev API error:", response.status, errorText);
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Translation successful");

    return new Response(
      JSON.stringify({ translated: data.translated || data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in translate function:", error);
    const errorMessage = error instanceof Error ? error.message : "Translation failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
