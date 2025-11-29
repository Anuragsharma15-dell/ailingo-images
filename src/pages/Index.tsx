import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles } from "lucide-react";
import { Language } from "@/lib/translations";
import { useLingoTranslations } from "@/hooks/useLingoTranslations";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useLingoTranslations(selectedLanguage);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-glow pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ImageAI
            </span>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => setSelectedLanguage(lang as Language)}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <ImageGenerator language={selectedLanguage} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p className="text-sm">
          {t("poweredBy")} & Lingo.dev
        </p>
      </footer>
    </div>
  );
};

export default Index;
