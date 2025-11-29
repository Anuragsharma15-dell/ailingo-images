import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // Parse form-data (because avatar includes file)
    let formData;
    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();
    } else {
      throw new Error("FormData with avatarImage & script required");
    }

    const script = formData.get("script") as string;
    const avatarImage = formData.get("avatarImage") as File;

    if (!script) throw new Error("script is required");
    if (!avatarImage) throw new Error("avatarImage is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating talking avatar...");

    // Convert uploaded image file to Base64
    const arrayBuffer = await avatarImage.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // Send request to Lovable AI Gateway
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-video", // 👈 correct model for talking avatar
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `Generate a talking avatar video using the provided face. Script: ${script}`,
                },
                {
                  type: "input_image",
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          modalities: ["video", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limits exceeded, try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Payment required. Add funds to your workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate talking avatar");
    }

    const data = await response.json();
    console.log("Avatar generation response:", data);

    const videoUrl = data.choices?.[0]?.message?.videos?.[0]?.video_url?.url;

    if (!videoUrl) throw new Error("No video generated");

    return new Response(
      JSON.stringify({ videoUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-talking-avatar:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate video",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
