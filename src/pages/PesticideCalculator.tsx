import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calculator, Leaf, AlertTriangle, Droplets, DollarSign, Shield, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PesticideResult {
  totalQuantity: number;
  waterNeeded: number;
  applicationTimes: number;
  costEstimate: number;
  safetyPeriod: number;
  applicationMethod: string;
  timing: string[];
  weatherConditions: string;
  safetyPrecautions: string[];
  organicAlternatives: string[];
}

export default function PesticideCalculator() {
  const { toast } = useToast();
  const [fieldSize, setFieldSize] = useState("");
  const [crop, setCrop] = useState("");
  const [pest, setPest] = useState("");
  const [pesticideType, setPesticideType] = useState("");
  const [severity, setSeverity] = useState("");
  const [result, setResult] = useState<PesticideResult | null>(null);

  const calculateDosage = () => {
    if (!fieldSize || !crop || !pest || !pesticideType || !severity) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields to calculate dosage",
        variant: "destructive",
      });
      return;
    }

    const area = parseFloat(fieldSize);
    const severityFactor = severity === "high" ? 1.2 : severity === "medium" ? 1.0 : 0.8;
    
    // Base calculation (ml per acre)
    const baseQuantity = pesticideType === "insecticide" ? 500 : 
                         pesticideType === "fungicide" ? 400 : 
                         pesticideType === "herbicide" ? 600 : 300;
    
    const totalQuantity = Math.round(baseQuantity * area * severityFactor);
    const waterNeeded = Math.round(area * 200); // 200 liters per acre
    const applicationTimes = severity === "high" ? 3 : severity === "medium" ? 2 : 1;
    const costPerMl = pesticideType === "organic" ? 2 : 1.5;
    const costEstimate = Math.round(totalQuantity * costPerMl);
    
    const resultData: PesticideResult = {
      totalQuantity,
      waterNeeded,
      applicationTimes,
      costEstimate,
      safetyPeriod: pesticideType === "organic" ? 3 : 7,
      applicationMethod: pesticideType === "herbicide" ? "Ground Spray" : "Foliar Spray",
      timing: [
        "Early morning (6-8 AM) - Low temperature, low wind",
        "Late evening (5-7 PM) - Good for oil-based pesticides",
      ],
      weatherConditions: "Avoid rain for 4-6 hours. Wind speed < 10 km/h. Temperature < 30°C.",
      safetyPrecautions: [
        "Wear protective clothing (gloves, mask, goggles)",
        "Keep children and animals away from treated area",
        "Do not eat, drink, or smoke during application",
        "Wash hands and exposed skin thoroughly after use",
        "Store pesticides in original containers, away from food",
        "Dispose of empty containers safely",
      ],
      organicAlternatives: [
        "Neem oil spray (5ml/liter water)",
        "Garlic-chili spray (homemade)",
        "Bacillus thuringiensis (Bt) for caterpillars",
        "Trichoderma for fungal diseases",
        "Manual pest picking for low infestation",
      ],
    };

    setResult(resultData);
    toast({
      title: "✅ Calculation Complete",
      description: `${totalQuantity}ml pesticide needed for ${area} acres`,
    });
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-green-500/15 rounded-2xl flex items-center justify-center"
            >
              <Calculator size={24} className="text-green-500" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                🧪 Precision Pesticide Calculator
              </h1>
              <p className="text-sm text-muted-foreground">
                Reduce pesticide overuse with precise dosage calculation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-success/10 border-success/30">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={20} className="text-success" />
              <h3 className="font-semibold">Cost Savings</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Save 20-30% on pesticide costs with precise application
            </p>
          </Card>
          <Card className="p-4 bg-info/10 border-info/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={20} className="text-info" />
              <h3 className="font-semibold">Safer Usage</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Minimize health risks with correct dosage
            </p>
          </Card>
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={20} className="text-primary" />
              <h3 className="font-semibold">Eco-Friendly</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Reduce environmental impact significantly
            </p>
          </Card>
        </div>

        {/* Input Form */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Field & Pest Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Field Size (Acres)*</Label>
              <Input
                type="number"
                placeholder="e.g., 2.5"
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Crop Type*</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">🌾 Rice</SelectItem>
                  <SelectItem value="cotton">☁️ Cotton</SelectItem>
                  <SelectItem value="wheat">🌾 Wheat</SelectItem>
                  <SelectItem value="tomato">🍅 Tomato</SelectItem>
                  <SelectItem value="potato">🥔 Potato</SelectItem>
                  <SelectItem value="chilli">🌶️ Chilli</SelectItem>
                  <SelectItem value="brinjal">🍆 Brinjal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pest/Disease Type*</Label>
              <Select value={pest} onValueChange={setPest}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aphids">🐛 Aphids</SelectItem>
                  <SelectItem value="bollworm">🐛 Bollworm</SelectItem>
                  <SelectItem value="whitefly">🦟 Whitefly</SelectItem>
                  <SelectItem value="blight">🍂 Blight (Fungal)</SelectItem>
                  <SelectItem value="rust">🍂 Rust (Fungal)</SelectItem>
                  <SelectItem value="weeds">🌿 Weeds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pesticide Type*</Label>
              <Select value={pesticideType} onValueChange={setPesticideType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insecticide">🐛 Insecticide</SelectItem>
                  <SelectItem value="fungicide">🍄 Fungicide</SelectItem>
                  <SelectItem value="herbicide">🌿 Herbicide</SelectItem>
                  <SelectItem value="organic">🍃 Organic Pesticide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Infestation Severity*</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low (Spot treatment)</SelectItem>
                  <SelectItem value="medium">🟡 Medium (Moderate spread)</SelectItem>
                  <SelectItem value="high">🔴 High (Heavy infestation)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculateDosage} className="w-full mt-6" size="lg">
            <Calculator className="mr-2" size={20} />
            Calculate Precise Dosage
          </Button>
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Dosage Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FlaskConical size={20} className="text-primary" />
                Application Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Pesticide Needed</p>
                  <p className="text-2xl font-bold text-primary">{result.totalQuantity}ml</p>
                </div>
                <div className="bg-info/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Water Required</p>
                  <p className="text-2xl font-bold text-info">{result.waterNeeded}L</p>
                </div>
                <div className="bg-warning/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Applications</p>
                  <p className="text-2xl font-bold text-warning">{result.applicationTimes}x</p>
                </div>
                <div className="bg-success/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Est. Cost</p>
                  <p className="text-2xl font-bold text-success">₹{result.costEstimate}</p>
                </div>
              </div>
            </Card>

            {/* Application Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Application Guidelines</h3>
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-primary/20 text-primary">Method</Badge>
                    <div className="flex-1">
                      <p className="font-semibold">{result.applicationMethod}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Safety Period: {result.safetyPeriod} days before harvest
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-info/10 border border-info/30 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Droplets size={16} className="text-info" />
                    Best Application Timing:
                  </h4>
                  <ul className="space-y-1">
                    {result.timing.map((time, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-info">•</span>
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-warning" />
                    Weather Conditions:
                  </h4>
                  <p className="text-sm">{result.weatherConditions}</p>
                </div>
              </div>
            </Card>

            {/* Safety Precautions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-destructive" />
                Safety Precautions (IMPORTANT)
              </h3>
              <ul className="space-y-2">
                {result.safetyPrecautions.map((precaution, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-destructive mt-1">⚠️</span>
                    <span className="text-sm">{precaution}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Organic Alternatives */}
            <Card className="p-6 bg-success/5 border-success/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Leaf size={20} className="text-success" />
                Organic Alternatives
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Consider these eco-friendly options for sustainable farming:
              </p>
              <ul className="space-y-2">
                {result.organicAlternatives.map((alt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span className="text-sm">{alt}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Cost Comparison */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-success" />
                Cost Impact Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-destructive/10 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Without Precision:</p>
                  <p className="text-xl font-bold text-destructive">
                    ₹{Math.round(result.costEstimate * 1.35)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Typical overuse: 35% extra
                  </p>
                </div>
                <div className="bg-success/10 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">With Precision:</p>
                  <p className="text-xl font-bold text-success">₹{result.costEstimate}</p>
                  <p className="text-xs text-success mt-1">
                    You Save: ₹{Math.round(result.costEstimate * 0.35)} (35%)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
