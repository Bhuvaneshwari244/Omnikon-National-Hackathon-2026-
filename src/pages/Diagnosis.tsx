import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translatePlantPart } from "@/data/dataTranslations";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle, Sparkles, Leaf, Bug, Pill, Droplets, Mountain, FlaskConical, Sprout, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { AnimatedLabel } from "@/components/AnimatedLabel";

export default function Diagnosis() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [plantPart, setPlantPart] = useState("Leaf");
  const [mode, setMode] = useState<"disease" | "soil" | "fertilizer">("disease");
  const fileRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File, maxWidth = 1024, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("Canvas not supported")); return; }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = ev.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: t.diagnosis.fileTooLarge, description: t.diagnosis.fileTooLargeDesc, variant: "destructive" });
      return;
    }
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
      setResult(null);
    } catch {
      toast({ title: t.diagnosis.analysisFailed, description: "Could not process image. Please try another.", variant: "destructive" });
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("diagnose-crop", {
        body: { imageBase64: image, plantPart, language: lang, mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      toast({ title: t.diagnosis.analysisFailed, description: err.message || "Could not analyze image. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const plantParts = [
    { name: "Leaf", icon: "🍃" }, { name: "Stem", icon: "🌿" }, { name: "Root", icon: "🌱" }, { name: "Fruit", icon: "🍎" },
    { name: "Pod/Seed", icon: "🫘" }, { name: "Flower", icon: "🌸" }, { name: "Insect", icon: "🐛" }, { name: "Full Plant", icon: "🌳" },
  ];

  const isSoilResult = result?._mode === "soil";
  const isFertilizerResult = result?._mode === "fertilizer";

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }} 
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center"
          >
            <Sparkles size={24} className="text-primary" />
          </motion.div>
          <div>
            <motion.h1 
              className="text-2xl font-display font-bold text-foreground"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
              transition={{ type: "spring", stiffness: 300, y: { repeat: 2, duration: 0.3 } }}
            >
              {t.diagnosis.title}
            </motion.h1>
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {t.diagnosis.poweredBy}
            </motion.p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "disease" as const, label: "🌿 Plant Disease", icon: Bug },
            { id: "soil" as const, label: "🪨 Soil Detection", icon: Mountain },
            { id: "fertilizer" as const, label: "🧪 Fertilizer", icon: FlaskConical },
          ].map((m, i) => (
            <motion.button 
              key={m.id}
              onClick={() => { setMode(m.id); setResult(null); }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${
                mode === m.id ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <motion.span
                animate={mode === m.id ? { y: [0, -3, 0], rotate: [0, 10, -10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <m.icon size={18} />
              </motion.span>
              <motion.span
                animate={mode === m.id ? { y: [0, -2, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
              >
                {m.label}
              </motion.span>
            </motion.button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ type: "spring", stiffness: 300 }}
          whileHover={{ y: -3 }}
          className="glass-card p-6 mb-6"
        >
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.button 
                key="upload" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => fileRef.current?.click()}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-dashed border-border/50 rounded-2xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center"
                  animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {mode === "soil" ? <Mountain size={32} className="text-primary" /> : mode === "fertilizer" ? <FlaskConical size={32} className="text-primary" /> : <Camera size={32} className="text-primary" />}
                </motion.div>
                <motion.p 
                  className="text-foreground font-semibold text-lg"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                >
                  {mode === "soil" ? "Upload Soil Photo" : mode === "fertilizer" ? "Upload Fertilizer Photo" : t.diagnosis.upload}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "soil" ? "Take a clear photo of your soil sample" : mode === "fertilizer" ? "Take a photo of fertilizer bag or sample" : t.diagnosis.photoHint}
                </p>
              </motion.button>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="relative">
                  <motion.img 
                    src={image} 
                    alt="Uploaded" 
                    className="w-full max-h-64 object-contain rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    whileHover={{ scale: 1.1 }}
                    onClick={() => { setImage(null); setResult(null); }}
                    className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground text-xs px-3 py-1.5 rounded-xl font-medium"
                  >
                    {t.diagnosis.remove}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {image && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              {/* Plant part selector only for disease mode */}
              {mode === "disease" && (
                <>
                  <motion.label 
                    className="text-sm font-medium text-foreground mb-2 block"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    🌿 {t.diagnosis.affectedPart}
                  </motion.label>
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {plantParts.map((part, i) => (
                      <motion.button 
                        key={part.name} 
                        whileTap={{ scale: 0.9 }} 
                        whileHover={{ y: -4, scale: 1.08 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, delay: i * 0.04 }}
                        onClick={() => setPlantPart(part.name)}
                        className={`relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs transition-all ${plantPart === part.name ? "text-primary-foreground font-medium shadow-lg" : "text-secondary-foreground hover:bg-muted"}`}
                      >
                        <motion.span 
                          className="relative z-10 text-lg"
                          animate={plantPart === part.name ? { y: [0, -3, 0], scale: [1, 1.2, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                        >
                          {part.icon}
                        </motion.span>
                        <motion.span 
                          className="relative z-10"
                          animate={plantPart === part.name ? { y: [0, -2, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
                        >
                          {translatePlantPart(part.name, lang)}
                        </motion.span>
                        {plantPart === part.name && <motion.div layoutId="plant-part" className="absolute inset-0 bg-primary rounded-xl" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              <motion.button 
                whileTap={{ scale: 0.97 }} 
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={analyze} 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" />{t.diagnosis.analyzing}</>
                ) : (
                  <>
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Sparkles size={20} />
                    </motion.span>
                    {mode === "soil" ? "Analyze Soil" : mode === "fertilizer" ? "Analyze Fertilizer" : t.diagnosis.analyze}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {/* Error Result - Non-plant image */}
          {result && result._mode === "error" && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="glass-card p-6 space-y-4"
            >
              <motion.div 
                className="flex items-start gap-3"
                animate={{ x: [0, -5, 5, 0] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <AlertTriangle size={32} className="text-warning" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-warning mb-2">
                    {result.error}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {result.message}
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-warning/10 rounded-2xl p-4 border border-warning/20"
                whileHover={{ y: -2 }}
              >
                <h4 className="font-semibold text-foreground mb-3">{result.suggestion}</h4>
                <div className="space-y-2">
                  {result.examples.map((example: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="text-primary">✓</span>
                      {example}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.button
                onClick={() => { setImage(null); setResult(null); }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Upload New Image
              </motion.button>
            </motion.div>
          )}
          
          {result && !isSoilResult && !isFertilizerResult && result._mode !== "error" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="glass-card p-6 space-y-4">
              <motion.h2 
                className="text-xl font-display font-bold text-foreground flex items-center gap-2"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <CheckCircle size={24} className="text-primary" />
                </motion.span>
                {t.diagnosis.result}
              </motion.h2>
              <motion.div 
                className="bg-secondary/50 rounded-2xl p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <motion.h3 
                    className="font-bold text-foreground text-lg"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {result.disease}
                  </motion.h3>
                  <motion.span 
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      result.severity === "Critical" ? "bg-destructive/30 text-destructive" :
                      result.severity === "High" ? "bg-destructive/20 text-destructive" :
                      result.severity === "Medium" ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    }`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {result.severity} {t.diagnosis.severity}
                  </motion.span>
                </div>
                <p className="text-sm text-muted-foreground">{t.diagnosis.affected}: {result.affectedPart} • {t.diagnosis.confidence}: {result.confidence}%</p>
                {result.cause && <p className="text-sm text-muted-foreground mt-1">{t.diagnosis.cause}: {result.cause}</p>}
              </motion.div>
              {result.symptoms && (
                <motion.div 
                  className="bg-warning/10 rounded-2xl p-4 border border-warning/20"
                  whileHover={{ y: -2 }}
                >
                  <motion.h4 
                    className="font-semibold text-warning mb-2 flex items-center gap-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Bug size={16} /> {t.diagnosis.symptoms}
                  </motion.h4>
                  <p className="text-sm text-foreground">{result.symptoms}</p>
                </motion.div>
              )}
              <div className="space-y-3">
                <motion.div 
                  className="bg-success/10 rounded-2xl p-4 border border-success/20"
                  whileHover={{ y: -2 }}
                >
                  <motion.h4 
                    className="font-semibold text-success mb-2 flex items-center gap-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  >
                    <Pill size={16} /> {t.diagnosis.treatment}
                  </motion.h4>
                  <p className="text-sm text-foreground">{result.treatment}</p>
                </motion.div>
                {result.organicTreatment && (
                  <motion.div 
                    className="bg-success/5 rounded-2xl p-4 border border-success/10"
                    whileHover={{ y: -2 }}
                  >
                    <motion.h4 
                      className="font-semibold text-success mb-2 flex items-center gap-2"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                    >
                      <Leaf size={16} /> {t.diagnosis.organicTreatment}
                    </motion.h4>
                    <p className="text-sm text-foreground">{result.organicTreatment}</p>
                  </motion.div>
                )}
                <motion.div 
                  className="bg-info/10 rounded-2xl p-4 border border-info/20"
                  whileHover={{ y: -2 }}
                >
                  <motion.h4 
                    className="font-semibold text-info mb-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  >
                    🛡️ {t.diagnosis.prevention}
                  </motion.h4>
                  <p className="text-sm text-foreground">{result.prevention}</p>
                </motion.div>
                {result.soilCare && (
                  <motion.div 
                    className="bg-accent/10 rounded-2xl p-4 border border-accent/20"
                    whileHover={{ y: -2 }}
                  >
                    <h4 className="font-semibold text-accent mb-2 flex items-center gap-2"><Mountain size={16} /> 🪨 Soil Maintenance</h4>
                    <p className="text-sm text-foreground">{result.soilCare}</p>
                  </motion.div>
                )}
                {result.waterQuantity && (
                  <motion.div 
                    className="bg-info/10 rounded-2xl p-4 border border-info/20"
                    whileHover={{ y: -2 }}
                  >
                    <h4 className="font-semibold text-info mb-2 flex items-center gap-2"><Droplets size={16} /> 💧 Water Requirement</h4>
                    <p className="text-sm text-foreground">{result.waterQuantity}</p>
                  </motion.div>
                )}
              </div>
              <motion.a 
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -4, scale: 1.02 }}
                href={buildWhatsAppLink(`🔬 AI Disease Diagnosis:\n\nDisease: ${result.disease}\nSeverity: ${result.severity}\nPart: ${result.affectedPart}\nConfidence: ${result.confidence}%\n\nPlease advise on treatment.`)}
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-success hover:bg-success/90 text-success-foreground py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                💬 {t.diagnosis.askExpert}
              </motion.a>
            </motion.div>
          )}

          {/* Fertilizer Detection Results */}
          {result && isFertilizerResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="glass-card p-6 space-y-4">
              <motion.h2 
                className="text-xl font-display font-bold text-foreground flex items-center gap-2"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <CheckCircle size={24} className="text-primary" />
                </motion.span>
                🧪 Fertilizer Analysis Report
              </motion.h2>

              <motion.div className="bg-secondary/50 rounded-2xl p-4" whileHover={{ scale: 1.01 }}>
                <motion.h3 className="font-bold text-foreground text-lg mb-1" animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  {result.fertilizerName}
                </motion.h3>
                <p className="text-sm text-muted-foreground">Type: {result.fertilizerType}</p>
                {result.quality && result.quality !== "Cannot Determine" && (
                  <motion.span 
                    className={`inline-block mt-2 px-3 py-1 rounded-xl text-xs font-bold ${
                      result.quality === "Good" ? "bg-success/20 text-success" :
                      result.quality === "Poor" ? "bg-destructive/20 text-destructive" :
                      "bg-warning/20 text-warning"
                    }`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {result.quality} Quality
                  </motion.span>
                )}
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "🧬 Composition", value: result.composition },
                  { label: "🌿 Nutrients", value: result.nutrients },
                  { label: "📅 Best Season", value: result.bestSeason },
                  { label: "🪨 Soil Suitability", value: result.soilSuitability },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label} 
                    className="bg-card border border-border/50 rounded-xl p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-sm mt-0.5 text-foreground">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div className="bg-success/10 rounded-2xl p-4 border border-success/20" whileHover={{ y: -2 }}>
                <h4 className="font-semibold text-success mb-2 flex items-center gap-2"><Sprout size={16} /> Suitable Crops</h4>
                <p className="text-sm text-foreground">{result.suitableCrops}</p>
              </motion.div>

              <motion.div className="bg-primary/10 rounded-2xl p-4 border border-primary/20" whileHover={{ y: -2 }}>
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><FlaskConical size={16} /> Application Method</h4>
                <p className="text-sm text-foreground">{result.applicationMethod}</p>
              </motion.div>

              <motion.div className="bg-info/10 rounded-2xl p-4 border border-info/20" whileHover={{ y: -2 }}>
                <h4 className="font-semibold text-info mb-2 flex items-center gap-2"><Droplets size={16} /> Dosage</h4>
                <p className="text-sm text-foreground">{result.dosage}</p>
              </motion.div>

              {result.waterQuantity && (
                <motion.div className="bg-info/15 rounded-2xl p-4 border border-info/25" whileHover={{ y: -2 }}>
                  <h4 className="font-semibold text-info mb-2 flex items-center gap-2"><Droplets size={16} /> 💧 Water Requirement</h4>
                  <p className="text-sm text-foreground">{result.waterQuantity}</p>
                </motion.div>
              )}

              <motion.div className="bg-success/5 rounded-2xl p-4 border border-success/10" whileHover={{ y: -2 }}>
                <h4 className="font-semibold text-success mb-2 flex items-center gap-2"><Leaf size={16} /> Organic Alternatives</h4>
                <p className="text-sm text-foreground">{result.alternatives}</p>
              </motion.div>

              <motion.div className="bg-warning/10 rounded-2xl p-4 border border-warning/20" whileHover={{ y: -2 }}>
                <h4 className="font-semibold text-warning mb-2 flex items-center gap-2"><ShieldAlert size={16} /> ⚠️ Precautions</h4>
                <p className="text-sm text-foreground">{result.precautions}</p>
              </motion.div>

              {result.warnings && result.warnings !== "None" && result.warnings !== "None detected" && (
                <motion.div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20" whileHover={{ y: -2 }}>
                  <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Warnings</h4>
                  <p className="text-sm text-foreground">{result.warnings}</p>
                </motion.div>
              )}

              <motion.a 
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -4, scale: 1.02 }}
                href={buildWhatsAppLink(`🧪 AI Fertilizer Analysis:\n\nFertilizer: ${result.fertilizerName}\nType: ${result.fertilizerType}\nComposition: ${result.composition}\n\nPlease advise on usage.`)}
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-success hover:bg-success/90 text-success-foreground py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                💬 Ask Expert on WhatsApp
              </motion.a>
            </motion.div>
          )}

          {/* Soil Detection Results */}
          {result && isSoilResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="glass-card p-6 space-y-4">
              <motion.h2 
                className="text-xl font-display font-bold text-foreground flex items-center gap-2"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <CheckCircle size={24} className="text-primary" />
                </motion.span>
                Soil Analysis Report
              </motion.h2>

              <motion.div 
                className="bg-secondary/50 rounded-2xl p-4"
                whileHover={{ scale: 1.01 }}
              >
                <motion.h3 
                  className="font-bold text-foreground text-lg mb-1"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🪨 {result.soilType}
                </motion.h3>
                <p className="text-sm text-muted-foreground">{result.color}</p>
                <p className="text-sm text-muted-foreground mt-1">Texture: {result.texture}</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "💧 Moisture", value: result.moistureLevel, color: result.moistureLevel === "High" ? "text-info" : result.moistureLevel === "Low" ? "text-warning" : "text-foreground" },
                  { label: "🧪 pH Estimate", value: result.phEstimate, color: "text-foreground" },
                  { label: "🌱 Organic Matter", value: result.organicMatter, color: result.organicMatter === "High" ? "text-success" : result.organicMatter === "Low" ? "text-destructive" : "text-warning" },
                  { label: "⭐ Fertility", value: result.fertility, color: result.fertility === "High" || result.fertility === "Very High" ? "text-success" : result.fertility === "Low" ? "text-destructive" : "text-warning" },
                  { label: "💦 Water Retention", value: result.waterRetention, color: "text-foreground" },
                  { label: "🚰 Drainage", value: result.drainage, color: "text-foreground" },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label} 
                    className="bg-card border border-border/50 rounded-xl p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <motion.p 
                      className={`font-bold text-sm mt-0.5 ${stat.color}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                    >
                      {stat.value}
                    </motion.p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="bg-success/10 rounded-2xl p-4 border border-success/20"
                whileHover={{ y: -2 }}
              >
                <h4 className="font-semibold text-success mb-2 flex items-center gap-2"><Sprout size={16} /> Fertility Maintenance</h4>
                <p className="text-sm text-foreground">{result.fertilityTips}</p>
              </motion.div>

              <motion.div 
                className="bg-primary/10 rounded-2xl p-4 border border-primary/20"
                whileHover={{ y: -2 }}
              >
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><Mountain size={16} /> Soil Maintenance</h4>
                <p className="text-sm text-foreground">{result.soilMaintenance}</p>
              </motion.div>

              <motion.div 
                className="bg-info/10 rounded-2xl p-4 border border-info/20"
                whileHover={{ y: -2 }}
              >
                <h4 className="font-semibold text-info mb-2 flex items-center gap-2"><Leaf size={16} /> Suitable Crops</h4>
                <p className="text-sm text-foreground">{result.suitableCrops}</p>
              </motion.div>

              {result.waterQuantity && (
                <motion.div 
                  className="bg-info/15 rounded-2xl p-4 border border-info/25"
                  whileHover={{ y: -2 }}
                >
                  <h4 className="font-semibold text-info mb-2 flex items-center gap-2"><Droplets size={16} /> 💧 Irrigation Water Requirement</h4>
                  <p className="text-sm text-foreground">{result.waterQuantity}</p>
                </motion.div>
              )}

              <motion.div 
                className="bg-accent/10 rounded-2xl p-4 border border-accent/20"
                whileHover={{ y: -2 }}
              >
                <h4 className="font-semibold text-accent mb-2 flex items-center gap-2"><FlaskConical size={16} /> Recommended Improvements</h4>
                <p className="text-sm text-foreground">{result.improvements}</p>
              </motion.div>

              {result.warnings && result.warnings !== "None" && result.warnings !== "None detected" && (
                <motion.div 
                  className="bg-warning/10 rounded-2xl p-4 border border-warning/20"
                  whileHover={{ y: -2 }}
                >
                  <h4 className="font-semibold text-warning mb-2 flex items-center gap-2"><ShieldAlert size={16} /> ⚠️ Warnings</h4>
                  <p className="text-sm text-foreground">{result.warnings}</p>
                </motion.div>
              )}

              <motion.a 
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -4, scale: 1.02 }}
                href={buildWhatsAppLink(`🪨 AI Soil Analysis:\n\nSoil Type: ${result.soilType}\nFertility: ${result.fertility}\npH: ${result.phEstimate}\nOrganic Matter: ${result.organicMatter}\n\nPlease advise on soil improvement.`)}
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-success hover:bg-success/90 text-success-foreground py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                💬 Ask Expert on WhatsApp
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
