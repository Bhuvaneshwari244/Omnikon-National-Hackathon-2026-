import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Warehouse, Thermometer, Droplets, Bug, AlertTriangle, TrendingUp, TrendingDown, Calendar, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface StorageUnit {
  id: string;
  name: string;
  commodity: string;
  quantity: number;
  unit: string;
  temperature: number;
  humidity: number;
  dateStored: string;
  condition: "excellent" | "good" | "fair" | "poor";
  spoilageRisk: number;
  recommendations: string[];
}

export default function StorageMonitor() {
  const { toast } = useToast();
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>([
    {
      id: "1",
      name: "Main Warehouse - Section A",
      commodity: "Rice (Paddy)",
      quantity: 50,
      unit: "Quintals",
      temperature: 28,
      humidity: 62,
      dateStored: "2026-02-15",
      condition: "good",
      spoilageRisk: 15,
      recommendations: [
        "Temperature is slightly high. Improve ventilation.",
        "Humidity is within acceptable range.",
        "Regular inspection recommended every 3 days.",
      ],
    },
    {
      id: "2",
      name: "Storage Room B",
      commodity: "Wheat",
      quantity: 30,
      unit: "Quintals",
      temperature: 32,
      humidity: 68,
      dateStored: "2026-02-10",
      condition: "fair",
      spoilageRisk: 35,
      recommendations: [
        "⚠️ Temperature too high! Reduce immediately.",
        "⚠️ High humidity detected. Use dehumidifier.",
        "Check for moisture damage and pest infestation.",
        "Consider selling soon to avoid losses.",
      ],
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStorage, setNewStorage] = useState({
    name: "",
    commodity: "",
    quantity: "",
    temperature: "",
    humidity: "",
  });

  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: "bg-green-500/20 text-green-500 border-green-500/30",
      good: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      fair: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      poor: "bg-red-500/20 text-red-500 border-red-500/30",
    };
    return colors[condition as keyof typeof colors] || colors.good;
  };

  const getRiskColor = (risk: number) => {
    if (risk < 20) return "text-green-500";
    if (risk < 40) return "text-yellow-500";
    if (risk < 70) return "text-orange-500";
    return "text-red-500";
  };

  const getRiskBgColor = (risk: number) => {
    if (risk < 20) return "bg-green-500";
    if (risk < 40) return "bg-yellow-500";
    if (risk < 70) return "bg-orange-500";
    return "bg-red-500";
  };

  const getDaysStored = (dateStored: string) => {
    const stored = new Date(dateStored);
    const today = new Date();
    const diff = Math.floor((today.getTime() - stored.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getOptimalConditions = (commodity: string) => {
    const conditions: Record<string, { temp: string; humidity: string }> = {
      "Rice (Paddy)": { temp: "25-30°C", humidity: "12-14%" },
      Wheat: { temp: "20-25°C", humidity: "12-14%" },
      Maize: { temp: "20-25°C", humidity: "13-14%" },
      Cotton: { temp: "20-30°C", humidity: "55-65%" },
      Potato: { temp: "3-5°C", humidity: "90-95%" },
      Onion: { temp: "0-1°C", humidity: "65-70%" },
    };
    return conditions[commodity] || { temp: "25-30°C", humidity: "60-65%" };
  };

  const addStorage = () => {
    if (!newStorage.name || !newStorage.commodity || !newStorage.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const temp = parseFloat(newStorage.temperature) || 28;
    const humidity = parseFloat(newStorage.humidity) || 60;
    
    // Calculate condition based on temperature and humidity
    let condition: "excellent" | "good" | "fair" | "poor" = "good";
    let spoilageRisk = 10;
    
    if (temp > 35 || humidity > 70) {
      condition = "poor";
      spoilageRisk = 70;
    } else if (temp > 30 || humidity > 65) {
      condition = "fair";
      spoilageRisk = 35;
    } else if (temp > 28 || humidity > 62) {
      condition = "good";
      spoilageRisk = 15;
    } else {
      condition = "excellent";
      spoilageRisk = 5;
    }

    const recommendations = [];
    if (temp > 30) recommendations.push("⚠️ Temperature is high. Improve cooling/ventilation.");
    if (humidity > 65) recommendations.push("⚠️ High humidity. Use dehumidifier or improve airflow.");
    if (temp <= 30 && humidity <= 65) recommendations.push("✓ Conditions are good. Continue monitoring.");
    
    recommendations.push("Check for pest activity regularly.");
    recommendations.push("Inspect grain quality every week.");

    const newUnit: StorageUnit = {
      id: Date.now().toString(),
      name: newStorage.name,
      commodity: newStorage.commodity,
      quantity: parseFloat(newStorage.quantity),
      unit: "Quintals",
      temperature: temp,
      humidity,
      dateStored: new Date().toISOString().split('T')[0],
      condition,
      spoilageRisk,
      recommendations,
    };

    setStorageUnits([...storageUnits, newUnit]);
    setNewStorage({ name: "", commodity: "", quantity: "", temperature: "", humidity: "" });
    setShowAddForm(false);
    
    toast({
      title: "✅ Storage Unit Added",
      description: `${newStorage.commodity} storage is now being monitored`,
    });
  };

  const totalQuantity = storageUnits.reduce((sum, unit) => sum + unit.quantity, 0);
  const avgRisk = storageUnits.reduce((sum, unit) => sum + unit.spoilageRisk, 0) / storageUnits.length;
  const highRiskUnits = storageUnits.filter(u => u.spoilageRisk > 40).length;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-purple-500/15 rounded-2xl flex items-center justify-center"
            >
              <Warehouse size={24} className="text-purple-500" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                🏭 Storage Monitoring System
              </h1>
              <p className="text-sm text-muted-foreground">
                Reduce post-harvest losses with smart storage management
              </p>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Warehouse size={20} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Storage Units</p>
                  <p className="text-2xl font-bold">{storageUnits.length}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Stored</p>
                  <p className="text-2xl font-bold">{totalQuantity} Q</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className={getRiskColor(avgRisk)} />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Risk</p>
                  <p className="text-2xl font-bold">{avgRisk.toFixed(0)}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Bug size={20} className="text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold">{highRiskUnits}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Add New Storage Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full md:w-auto"
          >
            {showAddForm ? "Cancel" : "+ Add Storage Unit"}
          </Button>
        </div>

        {/* Add Storage Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add New Storage Unit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Storage Location Name*</Label>
                    <Input
                      placeholder="e.g., Main Warehouse"
                      value={newStorage.name}
                      onChange={(e) => setNewStorage({ ...newStorage, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Commodity*</Label>
                    <Select value={newStorage.commodity} onValueChange={(v) => setNewStorage({ ...newStorage, commodity: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select commodity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rice (Paddy)">🌾 Rice (Paddy)</SelectItem>
                        <SelectItem value="Wheat">🌾 Wheat</SelectItem>
                        <SelectItem value="Maize">🌽 Maize</SelectItem>
                        <SelectItem value="Cotton">☁️ Cotton</SelectItem>
                        <SelectItem value="Potato">🥔 Potato</SelectItem>
                        <SelectItem value="Onion">🧅 Onion</SelectItem>
                        <SelectItem value="Groundnut">🥜 Groundnut</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity (Quintals)*</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      value={newStorage.quantity}
                      onChange={(e) => setNewStorage({ ...newStorage, quantity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Current Temperature (°C)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 28"
                      value={newStorage.temperature}
                      onChange={(e) => setNewStorage({ ...newStorage, temperature: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Current Humidity (%)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 60"
                      value={newStorage.humidity}
                      onChange={(e) => setNewStorage({ ...newStorage, humidity: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={addStorage} className="w-full mt-4">
                  Add Storage Unit
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Storage Units */}
        <div className="space-y-4">
          {storageUnits.map((unit, i) => {
            const optimal = getOptimalConditions(unit.commodity);
            const daysStored = getDaysStored(unit.dateStored);
            
            return (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-6 border-2 ${
                  unit.spoilageRisk > 50 ? "border-red-500/30" :
                  unit.spoilageRisk > 30 ? "border-yellow-500/30" :
                  "border-border"
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{unit.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {unit.commodity} • {unit.quantity} {unit.unit}
                      </p>
                    </div>
                    <Badge className={getConditionColor(unit.condition)}>
                      {unit.condition.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer size={16} className="text-orange-500" />
                        <span className="text-xs text-muted-foreground">Temperature</span>
                      </div>
                      <p className="text-lg font-bold">{unit.temperature}°C</p>
                      <p className="text-[10px] text-muted-foreground">Optimal: {optimal.temp}</p>
                    </div>

                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets size={16} className="text-blue-500" />
                        <span className="text-xs text-muted-foreground">Humidity</span>
                      </div>
                      <p className="text-lg font-bold">{unit.humidity}%</p>
                      <p className="text-[10px] text-muted-foreground">Optimal: {optimal.humidity}</p>
                    </div>

                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-purple-500" />
                        <span className="text-xs text-muted-foreground">Days Stored</span>
                      </div>
                      <p className="text-lg font-bold">{daysStored}</p>
                      <p className="text-[10px] text-muted-foreground">Since {unit.dateStored}</p>
                    </div>

                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} className={getRiskColor(unit.spoilageRisk)} />
                        <span className="text-xs text-muted-foreground">Spoilage Risk</span>
                      </div>
                      <p className={`text-lg font-bold ${getRiskColor(unit.spoilageRisk)}`}>
                        {unit.spoilageRisk}%
                      </p>
                      <Progress value={unit.spoilageRisk} className="h-1 mt-1" />
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 border ${
                    unit.spoilageRisk > 50 ? "bg-red-500/10 border-red-500/30" :
                    unit.spoilageRisk > 30 ? "bg-yellow-500/10 border-yellow-500/30" :
                    "bg-success/10 border-success/30"
                  }`}>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      {unit.spoilageRisk > 30 ? <AlertTriangle size={16} /> : <Bug size={16} />}
                      Storage Recommendations:
                    </h4>
                    <ul className="space-y-1">
                      {unit.recommendations.map((rec, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span className={rec.startsWith("⚠️") ? "text-warning" : "text-success"}>
                            {rec.startsWith("⚠️") || rec.startsWith("✓") ? "" : "•"}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📚 Storage Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">✓ Do's:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Clean storage area before filling</li>
                  <li>• Ensure proper ventilation</li>
                  <li>• Use pallets to keep grain off ground</li>
                  <li>• Regular inspection (weekly)</li>
                  <li>• Maintain temperature below 30°C</li>
                  <li>• Keep humidity below 14% for grains</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✗ Don'ts:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Don't store wet or damp grain</li>
                  <li>• Avoid direct sunlight exposure</li>
                  <li>• Don't mix old and new stock</li>
                  <li>• Never ignore pest signs</li>
                  <li>• Don't block ventilation openings</li>
                  <li>• Avoid overcrowding storage space</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
