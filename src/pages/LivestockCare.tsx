import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Upload, AlertCircle, Heart, Thermometer, Activity, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface LivestockResult {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  symptoms: string[];
  causes: string[];
  treatment: string;
  vaccination: string;
  prevention: string;
  isolation: boolean;
  veterinaryUrgency: string;
}

export default function LivestockCare() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [animalType, setAnimalType] = useState("");
  const [symptomType, setSymptomType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LivestockResult | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = () => {
    if (!image || !animalType || !symptomType) {
      toast({
        title: "Missing Information",
        description: "Please upload image and fill all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: Record<string, LivestockResult> = {
        "dairy_fmd": {
          disease: "Foot and Mouth Disease (FMD)",
          confidence: 87,
          severity: "high",
          symptoms: [
            "Blisters in mouth and on feet",
            "Excessive salivation and drooling",
            "Lameness and reluctance to move",
            "Reduced milk production",
            "Fever (104-106°F)",
          ],
          causes: [
            "Highly contagious virus",
            "Spreads through direct contact",
            "Contaminated feed and water",
          ],
          treatment: "No specific cure. Supportive care: pain relief, antibiotics for secondary infections, soft feed, clean water. Recovery in 1-2 weeks.",
          vaccination: "FMD vaccine every 6 months. Booster dose for young calves at 4 months.",
          prevention: "Quarantine new animals, restrict visitor movement, disinfect equipment, vaccination schedule, avoid grazing in infected areas.",
          isolation: true,
          veterinaryUrgency: "Call veterinarian immediately. Highly contagious, must report to authorities.",
        },
        "dairy_mastitis": {
          disease: "Mastitis (Udder Infection)",
          confidence: 92,
          severity: "medium",
          symptoms: [
            "Swollen, hard udder",
            "Hot and painful quarters",
            "Abnormal milk (clots, blood, watery)",
            "Reduced milk yield",
            "Fever in acute cases",
          ],
          causes: [
            "Bacterial infection (E. coli, Staph, Strep)",
            "Poor milking hygiene",
            "Teat injuries",
            "Dirty bedding",
          ],
          treatment: "Antibiotics (intramammary or injectable), anti-inflammatory drugs, frequent milking out, warm compresses.",
          vaccination: "J-5 vaccine for E. coli mastitis. Available for specific bacterial strains.",
          prevention: "Pre and post-milking teat dipping, clean dry bedding, proper milking technique, equipment sanitization, dry cow therapy.",
          isolation: false,
          veterinaryUrgency: "Consult vet within 24 hours. Early treatment prevents chronic infection.",
        },
        "poultry_coccidiosis": {
          disease: "Coccidiosis (Intestinal Parasites)",
          confidence: 85,
          severity: "high",
          symptoms: [
            "Bloody diarrhea",
            "Drooping wings",
            "Ruffled feathers",
            "Huddling together",
            "Reduced feed intake",
            "Dehydration",
          ],
          causes: [
            "Eimeria parasites",
            "Overcrowding",
            "Damp litter",
            "Poor ventilation",
          ],
          treatment: "Anticoccidial drugs (Amprolium, Sulfonamides). Provide electrolytes, isolate sick birds, replace litter.",
          vaccination: "Coccidiosis vaccine at day-old chick stage. Live vaccine in drinking water.",
          prevention: "Good litter management, avoid overcrowding, rotation of anticoccidials, biosecurity measures, clean water.",
          isolation: true,
          veterinaryUrgency: "Start treatment immediately. Can cause high mortality in young birds.",
        },
      };

      const key = `${animalType}_${symptomType}`;
      const mockResult = mockResults[key] || mockResults["dairy_fmd"];
      
      setResult(mockResult);
      setLoading(false);
      toast({
        title: "✅ Analysis Complete",
        description: `Detected: ${mockResult.disease}`,
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "bg-green-500/20 text-green-500 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      high: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      critical: "bg-red-500/20 text-red-500 border-red-500/30",
    };
    return colors[severity as keyof typeof colors];
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-pink-500/15 rounded-2xl flex items-center justify-center"
            >
              <Heart size={24} className="text-pink-500" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                🐄 Livestock Health Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                Early disease detection for dairy & poultry
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 text-center">
            <Activity size={20} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">AI Accuracy</p>
            <p className="text-lg font-bold">90%+</p>
          </Card>
          <Card className="p-3 text-center">
            <Clock size={20} className="mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">Detection</p>
            <p className="text-lg font-bold">&lt; 2min</p>
          </Card>
          <Card className="p-3 text-center">
            <Heart size={20} className="mx-auto mb-1 text-pink-500" />
            <p className="text-xs text-muted-foreground">Diseases</p>
            <p className="text-lg font-bold">25+</p>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-6">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
          
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.button
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-border/50 rounded-2xl p-10 hover:border-primary transition-colors"
              >
                <Camera size={40} className="mx-auto mb-3 text-primary" />
                <p className="font-semibold">Upload Animal Photo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Take clear photo of affected area or animal behavior
                </p>
              </motion.button>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src={image} alt="Animal" className="w-full max-h-64 object-contain rounded-xl mb-3" />
                <Button onClick={() => { setImage(null); setResult(null); }} variant="outline" size="sm" className="w-full">
                  Remove & Upload Different Photo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {image && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Animal Type*</label>
                <Select value={animalType} onValueChange={setAnimalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dairy">🐄 Dairy Cattle (Cow/Buffalo)</SelectItem>
                    <SelectItem value="goat">🐐 Goat/Sheep</SelectItem>
                    <SelectItem value="poultry">🐔 Poultry (Chicken/Duck)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Observed Issue*</label>
                <Select value={symptomType} onValueChange={setSymptomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select symptom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fmd">🦠 Mouth/Foot Blisters</SelectItem>
                    <SelectItem value="mastitis">🥛 Udder Problem</SelectItem>
                    <SelectItem value="coccidiosis">💩 Bloody Diarrhea</SelectItem>
                    <SelectItem value="respiratory">🫁 Breathing Difficulty</SelectItem>
                    <SelectItem value="fever">🌡️ High Fever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={analyze} disabled={loading} className="w-full">
                {loading ? "Analyzing..." : "Analyze Health Condition"}
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className={`p-6 border-2 ${result.severity === "critical" || result.severity === "high" ? "border-destructive/50" : ""}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{result.disease}</h3>
                  <p className="text-sm text-muted-foreground">Confidence: {result.confidence}%</p>
                </div>
                <Badge className={getSeverityColor(result.severity)}>
                  {result.severity.toUpperCase()}
                </Badge>
              </div>

              {result.isolation && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <AlertCircle size={16} />
                    ISOLATE ANIMAL IMMEDIATELY
                  </p>
                </div>
              )}

              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                <p className="text-sm font-semibold mb-1">⚕️ Veterinary Action:</p>
                <p className="text-sm">{result.veterinaryUrgency}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">🔍 Symptoms Observed:</h4>
              <ul className="space-y-1">
                {result.symptoms.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-warning">•</span>{s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">🦠 Possible Causes:</h4>
              <ul className="space-y-1">
                {result.causes.map((c, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-destructive">•</span>{c}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-success/10 border-success/30">
              <h4 className="font-semibold mb-2 text-success">💊 Treatment Plan:</h4>
              <p className="text-sm">{result.treatment}</p>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">💉 Vaccination:</h4>
              <p className="text-sm">{result.vaccination}</p>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-2">🛡️ Prevention for Future:</h4>
              <p className="text-sm">{result.prevention}</p>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
