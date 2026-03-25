import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Thermometer, CloudRain, Droplets, FlaskConical, TrendingUp, Lightbulb, BarChart3, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import PageTransition from "@/components/PageTransition";

const CROPS = [
  "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Groundnut",
  "Soybean", "Mustard", "Jowar", "Bajra", "Barley", "Chickpea",
  "Pigeon Pea", "Sunflower", "Sesame", "Jute", "Tea", "Coffee",
  "Potato", "Onion", "Tomato", "Banana", "Mango",
];

type Prediction = {
  predictedYield: number;
  confidence: number;
  modelAccuracy: number;
  suggestions: { icon: string; text: string }[];
  comparison: { crop: string; yield: number; isSelected: boolean }[];
  optimalConditions: { temperature: string; rainfall: string; humidity: string; soilPH: string };
};

export default function YieldPredict() {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [crop, setCrop] = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [humidity, setHumidity] = useState("");
  const [soilPH, setSoilPH] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);

  const handlePredict = async () => {
    if (!crop || !temperature || !rainfall || !humidity || !soilPH) {
      toast({ title: "Missing Fields", description: "Please fill all inputs", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("predict-yield", {
        body: {
          crop, temperature: Number(temperature), rainfall: Number(rainfall),
          humidity: Number(humidity), soilPH: Number(soilPH),
          language: lang === "en" ? "English" : lang === "hi" ? "Hindi" : lang,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      toast({ title: "Prediction Failed", description: e.message || "Try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} /> <span>🤖 ML-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">Crop Yield Prediction</h1>
          <p className="text-muted-foreground">AI-powered yield estimation based on environmental inputs</p>
        </motion.div>

        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-8 border-border/50 shadow-lg">
            <CardContent className="pt-6 space-y-5">
              {/* Crop Select */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sprout size={16} className="text-primary" /> Crop Type
                </label>
                <Select value={crop} onValueChange={setCrop}>
                  <SelectTrigger><SelectValue placeholder="Select crop..." /></SelectTrigger>
                  <SelectContent>
                    {CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Thermometer size={16} className="text-red-500" /> Temperature (°C)
                  </label>
                  <Input type="number" placeholder="e.g., 30" value={temperature} onChange={e => setTemperature(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <CloudRain size={16} className="text-blue-500" /> Rainfall (mm)
                  </label>
                  <Input type="number" placeholder="e.g., 200" value={rainfall} onChange={e => setRainfall(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Droplets size={16} className="text-cyan-500" /> Humidity (%)
                  </label>
                  <Input type="number" placeholder="e.g., 65" value={humidity} onChange={e => setHumidity(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <FlaskConical size={16} className="text-amber-500" /> Soil pH
                  </label>
                  <Input type="number" step="0.1" placeholder="e.g., 6.5" value={soilPH} onChange={e => setSoilPH(e.target.value)} />
                </div>
              </div>

              <Button onClick={handlePredict} disabled={loading} className="w-full h-12 text-base font-semibold rounded-xl" size="lg">
                {loading ? <><Loader2 className="animate-spin mr-2" size={20} /> Predicting...</> : <><TrendingUp className="mr-2" size={20} /> Predict Yield</>}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Yield Card */}
              <Card className="border-primary/30 shadow-lg text-center">
                <CardContent className="py-8">
                  <div className="text-5xl mb-2">🌾</div>
                  <p className="text-sm text-muted-foreground mb-1">Predicted Yield</p>
                  <p className="text-5xl font-bold text-primary">{result.predictedYield.toFixed(2)}</p>
                  <p className="text-muted-foreground mt-1">tons/hectare</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      ✨ Confidence: {result.confidence}%
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      🎯 Model Accuracy: {result.modelAccuracy}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Optimal Conditions */}
              {result.optimalConditions && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">🎯 Optimal Conditions for {crop}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Temperature", value: result.optimalConditions.temperature, icon: "🌡️" },
                        { label: "Rainfall", value: result.optimalConditions.rainfall, icon: "🌧️" },
                        { label: "Humidity", value: result.optimalConditions.humidity, icon: "💧" },
                        { label: "Soil pH", value: result.optimalConditions.soilPH, icon: "🧪" },
                      ].map(c => (
                        <div key={c.label} className="bg-secondary/50 rounded-xl p-3 text-center">
                          <span className="text-lg">{c.icon}</span>
                          <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                          <p className="font-semibold text-sm">{c.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Smart Suggestions */}
              {result.suggestions?.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb size={20} className="text-amber-500" /> Smart Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                        <span className="text-lg shrink-0">{s.icon}</span>
                        <p className="text-sm">{s.text}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Yield Comparison Chart */}
              {result.comparison?.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 size={20} className="text-primary" /> Yield Comparison by Crop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.comparison} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                          <XAxis dataKey="crop" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                          <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                            formatter={(value: number) => [`${value.toFixed(2)} t/ha`, "Yield"]}
                          />
                          <Bar dataKey="yield" radius={[6, 6, 0, 0]}>
                            {result.comparison.map((entry, i) => (
                              <Cell key={i} fill={entry.isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
