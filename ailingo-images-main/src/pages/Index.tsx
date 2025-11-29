import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ImageGenerator } from "@/components/ImageGenerator";
import { Sparkles } from "lucide-react";
import { Language } from "@/lib/translations";
import { useLingoTranslations } from "@/hooks/useLingoTranslations";
import { useNavigate } from "react-router-dom";


const Index = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useLingoTranslations(selectedLanguage);

  return (
    <div className="min-h-screen 
      bg-gradient-to-br from-[#050505] via-[#0c0c0d] to-[#111112] 
      relative overflow-hidden text-white">

      {/* Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="relative z-20 border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>

            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              ImageAI
            </span>

            <span className="ml-2 px-2 py-1 rounded-lg bg-white/10 text-xs font-semibold text-white/70">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => setSelectedLanguage(lang as Language)}
            />

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/10 transition font-medium"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/20 hover:opacity-90 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* HERO + GENERATOR */}
      <main className="relative z-20 container mx-auto px-6 py-20 md:py-28">
        <div className="text-center space-y-6 mb-20 animate-in fade-in-50 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(140,90,255,0.3)]">
              {t("title")}
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative">
          <div className="absolute -top-16 -left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>

          <ImageGenerator language={selectedLanguage} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/5 mt-20 py-6">
        <div className="container mx-auto px-6 text-center text-white/40 text-sm">
          {t("poweredBy")} • Lingo.dev
        </div>
      </footer>
    </div>
  );
};

export default Index;
