import { supabase } from "@/integrations/supabase/client";
import { languages } from "@/data/translations";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "SVG", "PATH", "TEXTAREA", "INPUT"]);
const ATTR = "data-orig-text";

const cacheKey = (lang: string) => `agrilink-i18n-${lang}`;
const loadCache = (lang: string): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(cacheKey(lang)) || "{}"); } catch { return {}; }
};
const saveCache = (lang: string, cache: Record<string, string>) => {
  try { localStorage.setItem(cacheKey(lang), JSON.stringify(cache)); } catch {}
};

const langName = (code: string) => languages.find(l => l.code === code)?.name || code;

// Match strings that contain at least one letter (skip pure numbers/symbols/emoji)
const shouldTranslate = (s: string) => /[A-Za-z]/.test(s) && s.trim().length > 0;

function collectTextNodes(root: Node): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      const text = node.nodeValue || "";
      if (!shouldTranslate(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  return nodes;
}

function collectPlaceholders(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title]"));
}

async function translateStrings(texts: string[], lang: string): Promise<Record<string, string>> {
  const cache = loadCache(lang);
  const missing = Array.from(new Set(texts.filter(t => !(t in cache))));
  if (missing.length === 0) return cache;

  // Batch in chunks of 40
  const chunkSize = 40;
  for (let i = 0; i < missing.length; i += chunkSize) {
    const chunk = missing.slice(i, i + chunkSize);
    try {
      const { data, error } = await supabase.functions.invoke("translate-batch", {
        body: { texts: chunk, targetLanguage: langName(lang) },
      });
      if (error) throw error;
      const translations: string[] = data?.translations || [];
      chunk.forEach((src, idx) => {
        cache[src] = translations[idx] || src;
      });
      saveCache(lang, cache);
    } catch (e) {
      // On failure, leave as-is (English fallback)
      chunk.forEach(src => { cache[src] = cache[src] || src; });
    }
  }
  return cache;
}

let inFlight: Promise<void> | null = null;
let currentLang = "en";

export async function translateDOM(lang: string) {
  currentLang = lang;
  const root = document.body;
  if (!root) return;

  // Restore originals first (so switching lang works from any state)
  root.querySelectorAll(`[${ATTR}]`).forEach(el => {
    const orig = el.getAttribute(ATTR);
    if (orig !== null) {
      // For text-node holders, store as textContent
      if (el.hasAttribute("data-orig-placeholder")) {
        (el as HTMLInputElement).placeholder = el.getAttribute("data-orig-placeholder") || "";
      }
      if (el.hasAttribute("data-orig-arialabel")) {
        el.setAttribute("aria-label", el.getAttribute("data-orig-arialabel") || "");
      }
      if (el.hasAttribute("data-orig-title")) {
        el.setAttribute("title", el.getAttribute("data-orig-title") || "");
      }
    }
  });

  if (lang === "en") return; // Nothing more to do

  // Collect text nodes with their original values
  const textNodes = collectTextNodes(root);
  const jobs: { apply: (val: string) => void; text: string }[] = [];

  for (const node of textNodes) {
    const original = node.nodeValue || "";
    const trimmed = original.trim();
    if (!trimmed) continue;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    jobs.push({
      text: trimmed,
      apply: (val) => { node.nodeValue = leading + val + trailing; },
    });
  }

  // Attributes
  for (const el of collectPlaceholders(root)) {
    const ph = el.getAttribute("placeholder");
    if (ph && shouldTranslate(ph)) {
      if (!el.hasAttribute("data-orig-placeholder")) el.setAttribute("data-orig-placeholder", ph);
      jobs.push({ text: ph.trim(), apply: (v) => el.setAttribute("placeholder", v) });
    }
    const al = el.getAttribute("aria-label");
    if (al && shouldTranslate(al)) {
      if (!el.hasAttribute("data-orig-arialabel")) el.setAttribute("data-orig-arialabel", al);
      jobs.push({ text: al.trim(), apply: (v) => el.setAttribute("aria-label", v) });
    }
    const tt = el.getAttribute("title");
    if (tt && shouldTranslate(tt)) {
      if (!el.hasAttribute("data-orig-title")) el.setAttribute("data-orig-title", tt);
      jobs.push({ text: tt.trim(), apply: (v) => el.setAttribute("title", v) });
    }
  }

  const allTexts = jobs.map(j => j.text);
  const cache = await translateStrings(allTexts, lang);

  // Bail if language changed mid-flight
  if (currentLang !== lang) return;

  for (const job of jobs) {
    const translated = cache[job.text];
    if (translated && translated !== job.text) job.apply(translated);
  }
}

export function scheduleTranslate(lang: string) {
  if (inFlight) return;
  inFlight = new Promise<void>((resolve) => {
    // Debounce to allow route content to render
    setTimeout(async () => {
      try { await translateDOM(lang); } finally { inFlight = null; resolve(); }
    }, 250);
  });
}
