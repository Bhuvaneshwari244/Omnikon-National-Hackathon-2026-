import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Thermometer, CloudRain, Droplets, FlaskConical, TrendingUp, Lightbulb, BarChart3, Loader2, Sparkles, RotateCcw } from "lucide-react";
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

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", te: "Telugu", ta: "Tamil", kn: "Kannada",
  ml: "Malayalam", mr: "Marathi", bn: "Bengali", gu: "Gujarati", pa: "Punjabi",
  or: "Odia", as: "Assamese", ur: "Urdu", sd: "Sindhi", ne: "Nepali",
  mai: "Maithili", sat: "Santali", ks: "Kashmiri", doi: "Dogri", kok: "Konkani",
  mni: "Manipuri", bo: "Bodo", sa: "Sanskrit", raj: "Rajasthani", bh: "Bhojpuri",
  chh: "Chhattisgarhi", gon: "Gondi", tu: "Tulu", kha: "Khasi", miz: "Mizo", nag: "Nagamese",
};

const yieldT: Record<string, Record<string, string>> = {
  en: { title: "Crop Yield Prediction", subtitle: "AI-powered yield estimation based on environmental inputs", badge: "ML-Powered", cropType: "Crop Type", selectCrop: "Select crop...", temperature: "Temperature (°C)", rainfall: "Rainfall (mm)", humidity: "Humidity (%)", soilPH: "Soil pH", predict: "Predict Yield", predicting: "Predicting...", predictedYield: "Predicted Yield", tonsHectare: "tons/hectare", confidence: "Confidence", modelAccuracy: "Model Accuracy", optimalFor: "Optimal Conditions for", smartSuggestions: "Smart Suggestions", yieldComparison: "Yield Comparison by Crop", predictAnother: "Predict Another Crop", missingFields: "Missing Fields", fillAll: "Please fill all inputs", predictionFailed: "Prediction Failed" },
  hi: { title: "फसल उपज भविष्यवाणी", subtitle: "पर्यावरणीय इनपुट के आधार पर AI-संचालित उपज अनुमान", badge: "ML-संचालित", cropType: "फसल का प्रकार", selectCrop: "फसल चुनें...", temperature: "तापमान (°C)", rainfall: "वर्षा (मिमी)", humidity: "आर्द्रता (%)", soilPH: "मिट्टी pH", predict: "उपज की भविष्यवाणी करें", predicting: "भविष्यवाणी हो रही है...", predictedYield: "अनुमानित उपज", tonsHectare: "टन/हेक्टेयर", confidence: "विश्वसनीयता", modelAccuracy: "मॉडल सटीकता", optimalFor: "के लिए इष्टतम स्थितियाँ", smartSuggestions: "स्मार्ट सुझाव", yieldComparison: "फसल के अनुसार उपज तुलना", predictAnother: "दूसरी फसल की भविष्यवाणी करें", missingFields: "फ़ील्ड अधूरे हैं", fillAll: "कृपया सभी इनपुट भरें", predictionFailed: "भविष्यवाणी विफल" },
  te: { title: "పంట దిగుబడి అంచనా", subtitle: "పర్యావరణ ఆధారిత AI దిగుబడి అంచనా", badge: "ML-ఆధారిత", cropType: "పంట రకం", selectCrop: "పంట ఎంచుకోండి...", temperature: "ఉష్ణోగ్రత (°C)", rainfall: "వర్షపాతం (మిమీ)", humidity: "తేమ (%)", soilPH: "నేల pH", predict: "దిగుబడి అంచనా", predicting: "అంచనా వేస్తోంది...", predictedYield: "అంచనా దిగుబడి", tonsHectare: "టన్నులు/హెక్టేర్", confidence: "విశ్వసనీయత", modelAccuracy: "మోడల్ ఖచ్చితత్వం", optimalFor: "కోసం అనుకూల పరిస్థితులు", smartSuggestions: "తెలివైన సూచనలు", yieldComparison: "పంట వారీ దిగుబడి పోలిక", predictAnother: "మరో పంట అంచనా", missingFields: "ఫీల్డ్‌లు తప్పిపోయాయి", fillAll: "దయచేసి అన్ని ఇన్‌పుట్‌లు నింపండి", predictionFailed: "అంచనా విఫలమైంది" },
  ta: { title: "பயிர் விளைச்சல் கணிப்பு", subtitle: "சுற்றுச்சூழல் உள்ளீடுகள் அடிப்படையில் AI விளைச்சல் மதிப்பீடு", badge: "ML-இயக்கம்", cropType: "பயிர் வகை", selectCrop: "பயிர் தேர்வு...", temperature: "வெப்பநிலை (°C)", rainfall: "மழைப்பொழிவு (மிமீ)", humidity: "ஈரப்பதம் (%)", soilPH: "மண் pH", predict: "விளைச்சல் கணிக்க", predicting: "கணிக்கிறது...", predictedYield: "கணிக்கப்பட்ட விளைச்சல்", tonsHectare: "டன்/ஹெக்டேர்", confidence: "நம்பகத்தன்மை", modelAccuracy: "மாடல் துல்லியம்", optimalFor: "க்கான உகந்த நிலைமைகள்", smartSuggestions: "புத்திசாலி பரிந்துரைகள்", yieldComparison: "பயிர் வாரியாக விளைச்சல் ஒப்பீடு", predictAnother: "மற்றொரு பயிர் கணிக்க", missingFields: "புலங்கள் இல்லை", fillAll: "அனைத்து உள்ளீடுகளையும் நிரப்பவும்", predictionFailed: "கணிப்பு தோல்வி" },
  kn: { title: "ಬೆಳೆ ಇಳುವರಿ ಊಹೆ", subtitle: "ಪರಿಸರ ಆಧಾರಿತ AI ಇಳುವರಿ ಅಂದಾಜು", badge: "ML-ಚಾಲಿತ", cropType: "ಬೆಳೆ ರೀತಿ", selectCrop: "ಬೆಳೆ ಆಯ್ಕೆ...", temperature: "ಉಷ್ಣತೆ (°C)", rainfall: "ಮಳೆ (ಮಿಮೀ)", humidity: "ತೇವಾಂಶ (%)", soilPH: "ಮಣ್ಣು pH", predict: "ಇಳುವರಿ ಊಹಿಸಿ", predicting: "ಊಹಿಸಲಾಗುತ್ತಿದೆ...", predictedYield: "ಅಂದಾಜು ಇಳುವರಿ", tonsHectare: "ಟನ್/ಹೆಕ್ಟೇರ್", confidence: "ವಿಶ್ವಾಸ", modelAccuracy: "ಮಾಡೆಲ್ ನಿಖರತೆ", optimalFor: "ಗೆ ಅನುಕೂಲ ಪರಿಸ್ಥಿತಿ", smartSuggestions: "ಚುರುಕು ಸಲಹೆಗಳು", yieldComparison: "ಬೆಳೆ ಇಳುವರಿ ಹೋಲಿಕೆ", predictAnother: "ಮತ್ತೊಂದು ಬೆಳೆ ಊಹಿಸಿ", missingFields: "ಕ್ಷೇತ್ರಗಳು ಇಲ್ಲ", fillAll: "ಎಲ್ಲಾ ಇನ್‌ಪುಟ್ ಭರ್ತಿ ಮಾಡಿ", predictionFailed: "ಊಹೆ ವಿಫಲ" },
  ml: { title: "വിളവ് പ്രവചനം", subtitle: "പരിസ്ഥിതി ഇൻപുട്ടുകൾ അടിസ്ഥാനമാക്കി AI വിളവ് കണക്കാക്കൽ", badge: "ML-പ്രവർത്തിത", cropType: "വിള തരം", selectCrop: "വിള തിരഞ്ഞെടുക്കുക...", temperature: "താപനില (°C)", rainfall: "മഴ (മിമീ)", humidity: "ഈർപ്പം (%)", soilPH: "മണ്ണ് pH", predict: "വിളവ് പ്രവചിക്കുക", predicting: "പ്രവചിക്കുന്നു...", predictedYield: "പ്രവചിച്ച വിളവ്", tonsHectare: "ടൺ/ഹെക്ടർ", confidence: "വിശ്വാസ്യത", modelAccuracy: "മോഡൽ കൃത്യത", optimalFor: "ന് അനുയോജ്യ സാഹചര്യങ്ങൾ", smartSuggestions: "സ്മാർട്ട് നിർദ്ദേശങ്ങൾ", yieldComparison: "വിള അനുസരിച്ച് വിളവ് താരതമ്യം", predictAnother: "മറ്റൊരു വിള പ്രവചിക്കുക", missingFields: "ഫീൽഡുകൾ ഇല്ല", fillAll: "എല്ലാ ഇൻപുട്ടുകളും പൂരിപ്പിക്കുക", predictionFailed: "പ്രവചനം പരാജയം" },
  mr: { title: "पीक उत्पादन अंदाज", subtitle: "पर्यावरणीय इनपुटवर आधारित AI उत्पादन अंदाज", badge: "ML-चालित", cropType: "पीक प्रकार", selectCrop: "पीक निवडा...", temperature: "तापमान (°C)", rainfall: "पाऊस (मिमी)", humidity: "आर्द्रता (%)", soilPH: "माती pH", predict: "उत्पादन अंदाज", predicting: "अंदाज लावत आहे...", predictedYield: "अंदाजित उत्पादन", tonsHectare: "टन/हेक्टर", confidence: "विश्वासार्हता", modelAccuracy: "मॉडेल अचूकता", optimalFor: "साठी सर्वोत्तम परिस्थिती", smartSuggestions: "स्मार्ट सूचना", yieldComparison: "पीक उत्पादन तुलना", predictAnother: "दुसऱ्या पिकाचा अंदाज", missingFields: "फील्ड अपूर्ण", fillAll: "सर्व इनपुट भरा", predictionFailed: "अंदाज अयशस्वी" },
  bn: { title: "ফসল ফলন পূর্বাভাস", subtitle: "পরিবেশগত ইনপুট ভিত্তিক AI ফলন অনুমান", badge: "ML-চালিত", cropType: "ফসল ধরন", selectCrop: "ফসল নির্বাচন...", temperature: "তাপমাত্রা (°C)", rainfall: "বৃষ্টিপাত (মিমি)", humidity: "আর্দ্রতা (%)", soilPH: "মাটি pH", predict: "ফলন পূর্বাভাস", predicting: "পূর্বাভাস করছে...", predictedYield: "পূর্বাভাসিত ফলন", tonsHectare: "টন/হেক্টর", confidence: "বিশ্বাসযোগ্যতা", modelAccuracy: "মডেল নির্ভুলতা", optimalFor: "এর জন্য সর্বোত্তম পরিস্থিতি", smartSuggestions: "স্মার্ট পরামর্শ", yieldComparison: "ফসল অনুযায়ী ফলন তুলনা", predictAnother: "অন্য ফসলের পূর্বাভাস", missingFields: "ফিল্ড অনুপস্থিত", fillAll: "সব ইনপুট পূরণ করুন", predictionFailed: "পূর্বাভাস ব্যর্থ" },
  gu: { title: "પાક ઉપજ આગાહી", subtitle: "પર્યાવરણીય ઇનપુટ આધારિત AI ઉપજ અંદાજ", badge: "ML-સંચાલિત", cropType: "પાક પ્રકાર", selectCrop: "પાક પસંદ કરો...", temperature: "તાપમાન (°C)", rainfall: "વરસાદ (મિમી)", humidity: "ભેજ (%)", soilPH: "માટી pH", predict: "ઉપજ આગાહી", predicting: "આગાહી કરી રહ્યા છીએ...", predictedYield: "અંદાજિત ઉપજ", tonsHectare: "ટન/હેક્ટર", confidence: "વિશ્વસનીયતા", modelAccuracy: "મોડેલ ચોકસાઈ", optimalFor: "માટે શ્રેષ્ઠ સ્થિતિ", smartSuggestions: "સ્માર્ટ સૂચનો", yieldComparison: "પાક ઉપજ સરખામણી", predictAnother: "બીજા પાકની આગાહી", missingFields: "ફીલ્ડ ખૂટે છે", fillAll: "બધા ઇનપુટ ભરો", predictionFailed: "આગાહી નિષ્ફળ" },
  pa: { title: "ਫਸਲ ਉਪਜ ਭਵਿੱਖਬਾਣੀ", subtitle: "ਵਾਤਾਵਰਣ ਇਨਪੁਟ ਅਧਾਰਿਤ AI ਉਪਜ ਅੰਦਾਜ਼ਾ", badge: "ML-ਸੰਚਾਲਿਤ", cropType: "ਫਸਲ ਕਿਸਮ", selectCrop: "ਫਸਲ ਚੁਣੋ...", temperature: "ਤਾਪਮਾਨ (°C)", rainfall: "ਬਾਰਿਸ਼ (ਮਿਮੀ)", humidity: "ਨਮੀ (%)", soilPH: "ਮਿੱਟੀ pH", predict: "ਉਪਜ ਭਵਿੱਖਬਾਣੀ", predicting: "ਭਵਿੱਖਬਾਣੀ ਹੋ ਰਹੀ ਹੈ...", predictedYield: "ਅੰਦਾਜ਼ਿਤ ਉਪਜ", tonsHectare: "ਟਨ/ਹੈਕਟੇਅਰ", confidence: "ਭਰੋਸੇਯੋਗਤਾ", modelAccuracy: "ਮਾਡਲ ਸ਼ੁੱਧਤਾ", optimalFor: "ਲਈ ਅਨੁਕੂਲ ਸਥਿਤੀਆਂ", smartSuggestions: "ਸਮਾਰਟ ਸੁਝਾਅ", yieldComparison: "ਫਸਲ ਉਪਜ ਤੁਲਨਾ", predictAnother: "ਹੋਰ ਫਸਲ ਦੀ ਭਵਿੱਖਬਾਣੀ", missingFields: "ਖੇਤਰ ਗੁੰਮ ਹਨ", fillAll: "ਸਾਰੇ ਇਨਪੁਟ ਭਰੋ", predictionFailed: "ਭਵਿੱਖਬਾਣੀ ਅਸਫਲ" },
};

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
  const t = yieldT[lang] || yieldT.en;
  const [crop, setCrop] = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [humidity, setHumidity] = useState("");
  const [soilPH, setSoilPH] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);

  const handlePredict = async () => {
    if (!crop || !temperature || !rainfall || !humidity || !soilPH) {
      toast({ title: t.missingFields, description: t.fillAll, variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("predict-yield", {
        body: {
          crop, temperature: Number(temperature), rainfall: Number(rainfall),
          humidity: Number(humidity), soilPH: Number(soilPH),
          language: LANG_NAMES[lang] || "English",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      toast({ title: t.predictionFailed, description: e.message || "Try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCrop("");
    setTemperature("");
    setRainfall("");
    setHumidity("");
    setSoilPH("");
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} /> <span>🤖 {t.badge}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </motion.div>

        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-8 border-border/50 shadow-lg">
            <CardContent className="pt-6 space-y-5">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sprout size={16} className="text-primary" /> {t.cropType}
                </label>
                <Select value={crop} onValueChange={setCrop}>
                  <SelectTrigger><SelectValue placeholder={t.selectCrop} /></SelectTrigger>
                  <SelectContent>
                    {CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Thermometer size={16} className="text-destructive" /> {t.temperature}
                  </label>
                  <Input type="number" placeholder="e.g., 30" value={temperature} onChange={e => setTemperature(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <CloudRain size={16} className="text-primary" /> {t.rainfall}
                  </label>
                  <Input type="number" placeholder="e.g., 200" value={rainfall} onChange={e => setRainfall(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Droplets size={16} className="text-primary" /> {t.humidity}
                  </label>
                  <Input type="number" placeholder="e.g., 65" value={humidity} onChange={e => setHumidity(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <FlaskConical size={16} className="text-accent-foreground" /> {t.soilPH}
                  </label>
                  <Input type="number" step="0.1" placeholder="e.g., 6.5" value={soilPH} onChange={e => setSoilPH(e.target.value)} />
                </div>
              </div>

              <Button onClick={handlePredict} disabled={loading} className="w-full h-12 text-base font-semibold rounded-xl" size="lg">
                {loading ? <><Loader2 className="animate-spin mr-2" size={20} /> {t.predicting}</> : <><TrendingUp className="mr-2" size={20} /> {t.predict}</>}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Predict Another Button */}
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline" className="rounded-xl gap-2">
                  <RotateCcw size={16} /> {t.predictAnother}
                </Button>
              </div>

              {/* Yield Card */}
              <Card className="border-primary/30 shadow-lg text-center">
                <CardContent className="py-8">
                  <div className="text-5xl mb-2">🌾</div>
                  <p className="text-sm text-muted-foreground mb-1">{t.predictedYield}</p>
                  <p className="text-5xl font-bold text-primary">{result.predictedYield.toFixed(2)}</p>
                  <p className="text-muted-foreground mt-1">{t.tonsHectare}</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm flex-wrap">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      ✨ {t.confidence}: {result.confidence}%
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      🎯 {t.modelAccuracy}: {result.modelAccuracy}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Optimal Conditions */}
              {result.optimalConditions && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">🎯 {t.optimalFor} {crop}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: t.temperature, value: result.optimalConditions.temperature, icon: "🌡️" },
                        { label: t.rainfall, value: result.optimalConditions.rainfall, icon: "🌧️" },
                        { label: t.humidity, value: result.optimalConditions.humidity, icon: "💧" },
                        { label: t.soilPH, value: result.optimalConditions.soilPH, icon: "🧪" },
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
                      <Lightbulb size={20} className="text-accent-foreground" /> {t.smartSuggestions}
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
                      <BarChart3 size={20} className="text-primary" /> {t.yieldComparison}
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
                            formatter={(value: number) => [`${value.toFixed(2)} t/ha`, t.predictedYield]}
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

              {/* Bottom Predict Another */}
              <div className="flex justify-center pt-2">
                <Button onClick={handleReset} variant="outline" size="lg" className="rounded-xl gap-2">
                  <RotateCcw size={18} /> {t.predictAnother}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
