import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Language } from "@/lib/translations";
import { useLingoTranslations } from "@/hooks/useLingoTranslations";
import { useNavigate } from "react-router-dom";

interface ImageGeneratorProps {
  language: Language;
}

export const ImageGenerator = ({ language }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const { t } = useLingoTranslations(language);
  const navigate = useNavigate();

  // Track how many images user has generated
  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    const savedCount = Number(localStorage.getItem("generationCount")) || 0;
    setGenerationCount(savedCount);
  }, []);

  const handleGenerate = async () => {
    const token = localStorage.getItem("token");

    // 🔥 If user is not logged in → redirect to register
    if (!token) {
      toast.error("You must register or login to generate images.");
      navigate("/register");
      return;
    }

    // 🔥 Free limit: 2 images max
    if (generationCount >= 2) {
      toast.error("Free limit reached! Upgrade to create unlimited images.");
      return;
    }

    if (!prompt.trim()) {
      toast.error(t("errorPrompt"));
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);

        // Save new generation count
        const newCount = generationCount + 1;
        localStorage.setItem("generationCount", String(newCount));
        setGenerationCount(newCount);

        toast.success(t("successMessage"));
      } else {
        throw new Error("No image returned from server");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || t("errorMessage"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(t("downloadSuccess"));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">

      {/* 🔥🔥 UPGRADED TEXTAREA + GENERATE UI 🔥🔥 */}
      <Card className="relative p-8 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 overflow-hidden">

        {/* Animated soft glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-40 animate-pulse pointer-events-none" />

        <div className="space-y-4 relative z-10">

          <p className="text-lg font-semibold text-white/90">✨ Create your AI image</p>

          {/* TEXTAREA */}
          <div className="relative">
            <Textarea
              placeholder={t("placeholder")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="
                min-h-[150px] text-base bg-black/20 backdrop-blur-md text-white 
                border border-white/20 rounded-xl px-4 py-3 resize-none
                focus:ring-2 focus:ring-primary/50 focus:border-primary
                transition-all
              "
            />
            {/* Character Counter */}
            <span className="absolute bottom-2 right-4 text-xs text-white/50">
              {prompt.length}/400
            </span>
          </div>

          {/* GENERATE BUTTON */}
          <Button
  onClick={handleGenerate}
  disabled={isGenerating || !prompt.trim() || generationCount >= 2}
  className="
    w-full h-14 text-lg font-semibold relative overflow-hidden rounded-xl
    bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/40
    hover:opacity-90 transition-all
  "
>
  {isGenerating ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      {t("generating")}
    </>
  ) : (
    <>
      <Sparkles className="mr-2 h-5 w-5" />
      {t("generateButton")}
    </>
  )}
</Button>

        </div>
      </Card>

      {/* GENERATED IMAGE CARD */}
      {generatedImage && (
        <Card className="p-4 bg-card border-border shadow-elevated animate-in fade-in-50 duration-500">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-secondary">
              <img
                src={generatedImage}
                alt="Generated artwork"
                className="w-full h-auto"
              />
            </div>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full h-12 font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("downloadButton")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
