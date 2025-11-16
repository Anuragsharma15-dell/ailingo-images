import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getTranslation, Language } from "@/lib/translations";

interface ImageGeneratorProps {
  language: Language;
}

export const ImageGenerator = ({ language }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(getTranslation(language, "errorPrompt"));
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
        toast.success(getTranslation(language, "successMessage"));
      } else {
        throw new Error("No image received");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast.error(error.message || getTranslation(language, "errorMessage"));
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
    toast.success(getTranslation(language, "downloadSuccess"));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="p-6 space-y-6 bg-card border-border shadow-elevated">
        <div className="space-y-4">
          <Textarea
            placeholder={getTranslation(language, "placeholder")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] text-lg resize-none bg-secondary border-border focus:border-primary transition-colors"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {getTranslation(language, "generating")}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                {getTranslation(language, "generateButton")}
              </>
            )}
          </Button>
        </div>
      </Card>

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
              {getTranslation(language, "downloadButton")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
