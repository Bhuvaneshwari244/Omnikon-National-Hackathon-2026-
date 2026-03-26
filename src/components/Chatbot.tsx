import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agrilink-chat`;

const chatLabels: Record<string, { title: string; placeholder: string; greeting: string }> = {
  en: { title: "AgriLink Assistant", placeholder: "Ask about any feature...", greeting: "Hi! 👋 I'm your AgriLink Assistant. Ask me anything about mandi rates, crop diagnosis, yield prediction, or any feature!" },
  hi: { title: "AgriLink सहायक", placeholder: "कोई भी सवाल पूछें...", greeting: "नमस्ते! 👋 मैं आपका AgriLink सहायक हूँ। मंडी रेट, फसल निदान, उपज भविष्यवाणी या किसी भी सुविधा के बारे में पूछें!" },
  te: { title: "AgriLink సహాయకుడు", placeholder: "ఏదైనా అడగండి...", greeting: "హలో! 👋 నేను మీ AgriLink సహాయకుడిని. మండి ధరలు, పంట నిర్ధారణ, దిగుబడి అంచనా గురించి అడగండి!" },
  ta: { title: "AgriLink உதவியாளர்", placeholder: "எதையும் கேளுங்கள்...", greeting: "வணக்கம்! 👋 நான் உங்கள் AgriLink உதவியாளர். மண்டி விலைகள், பயிர் கண்டறிதல் பற்றி கேளுங்கள்!" },
  kn: { title: "AgriLink ಸಹಾಯಕ", placeholder: "ಏನಾದರೂ ಕೇಳಿ...", greeting: "ನಮಸ್ಕಾರ! 👋 ನಾನು ನಿಮ್ಮ AgriLink ಸಹಾಯಕ. ಮಂಡಿ ದರಗಳು, ಬೆಳೆ ರೋಗನಿರ್ಣಯ ಬಗ್ಗೆ ಕೇಳಿ!" },
  ml: { title: "AgriLink സഹായി", placeholder: "എന്തെങ്കിലും ചോദിക്കൂ...", greeting: "ഹലോ! 👋 ഞാൻ നിങ്ങളുടെ AgriLink സഹായിയാണ്. മണ്ഡി നിരക്കുകൾ, വിള രോഗനിർണയം എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ!" },
  mr: { title: "AgriLink सहाय्यक", placeholder: "काहीही विचारा...", greeting: "नमस्कार! 👋 मी तुमचा AgriLink सहाय्यक आहे. मंडी दर, पीक निदान बद्दल विचारा!" },
  bn: { title: "AgriLink সহায়ক", placeholder: "যেকোনো প্রশ্ন করুন...", greeting: "হ্যালো! 👋 আমি আপনার AgriLink সহায়ক। মান্ডি দাম, ফসল নির্ণয় সম্পর্কে জিজ্ঞাসা করুন!" },
  gu: { title: "AgriLink સહાયક", placeholder: "કંઈપણ પૂછો...", greeting: "નમસ્તે! 👋 હું તમારો AgriLink સહાયક છું. મંડી ભાવ, પાક નિદાન વિશે પૂછો!" },
  pa: { title: "AgriLink ਸਹਾਇਕ", placeholder: "ਕੁਝ ਵੀ ਪੁੱਛੋ...", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 👋 ਮੈਂ ਤੁਹਾਡਾ AgriLink ਸਹਾਇਕ ਹਾਂ। ਮੰਡੀ ਭਾਅ, ਫ਼ਸਲ ਨਿਦਾਨ ਬਾਰੇ ਪੁੱਛੋ!" },
};

export default function Chatbot() {
  const { lang } = useLanguage();
  const labels = chatLabels[lang] || chatLabels.en;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: labels.greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Update greeting when language changes
  useEffect(() => {
    const l = chatLabels[lang] || chatLabels.en;
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ role: "assistant", content: l.greeting }];
      }
      return prev;
    });
  }, [lang]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMessages.length) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  return (
    <>
      {/* Chat Button - positioned above WhatsApp */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-32 md:bottom-16 right-4 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-3.5 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-44 md:bottom-28 right-4 z-50 w-[340px] sm:w-[380px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold text-sm">{labels.title}</span>
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[50vh]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-3 py-2">
                    <Loader2 size={16} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-2 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder={labels.placeholder}
                className="flex-1 bg-secondary text-foreground text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-primary text-primary-foreground rounded-xl p-2 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
