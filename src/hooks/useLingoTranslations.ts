import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { translations, Language } from "@/lib/translations";

export const useLingoTranslations = (language: Language) => {
  const [lingoTranslations, setLingoTranslations] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If English, use static translations (no need to translate)
    if (language === "en") {
      setLingoTranslations(translations.en);
      return;
    }

    // Try to get translations from Lingo.dev
    const fetchLingoTranslations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("translate", {
          body: {
            content: translations.en,
            targetLocale: language,
          },
        });

        if (error) {
          console.warn("Lingo.dev translation failed, using fallback:", error);
          setLingoTranslations(translations[language] || translations.en);
        } else if (data?.translated) {
          setLingoTranslations(data.translated);
        } else {
          setLingoTranslations(translations[language] || translations.en);
        }
      } catch (err) {
        console.warn("Error fetching Lingo.dev translations:", err);
        setLingoTranslations(translations[language] || translations.en);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLingoTranslations();
  }, [language]);

  // Return static translations as fallback while loading or if Lingo.dev fails
  return {
    t: (key: keyof typeof translations.en): string => {
      if (lingoTranslations && lingoTranslations[key]) {
        return lingoTranslations[key];
      }
      return translations[language]?.[key] || translations.en[key];
    },
    isLoading,
  };
};
