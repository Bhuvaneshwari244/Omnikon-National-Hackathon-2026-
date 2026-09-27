import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { scheduleTranslate } from "@/lib/autoTranslate";

/**
 * Runs whole-DOM auto-translation whenever the selected language or the
 * current route changes. Also re-runs shortly after each render to catch
 * async content (lists loaded from APIs, modals, etc.).
 */
export function useAutoTranslate() {
  const { lang } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    scheduleTranslate(lang);
    // Re-scan a couple of times to pick up late-arriving content
    const t1 = setTimeout(() => scheduleTranslate(lang), 1200);
    const t2 = setTimeout(() => scheduleTranslate(lang), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [lang, location.pathname]);

  // Observe DOM mutations and retranslate additions
  useEffect(() => {
    if (lang === "en") return;
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      setTimeout(() => { pending = false; scheduleTranslate(lang); }, 600);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: false });
    return () => observer.disconnect();
  }, [lang]);
}
