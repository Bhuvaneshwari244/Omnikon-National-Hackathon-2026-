import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Droplets, Cloud, Sun, Calendar, AlertTriangle, TrendingDown, TrendingUp, Wind, ThermometerSun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sample weather data structure (would come from API in production)
interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: number;
    rain: number;
    icon: string;
  }>;
}

interface IrrigationSchedule {
  today: string;
  nextIrrigation: string;
  waterAmount: number;
  duration: number;
  reason: string;
  schedule: Array<{
    date: string;
    amount: number;
    time: string;
    status: "pending" | "completed" | "skipped";
  }>;
}

export default function Irrigation() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [cropType, setCropType] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");
  const [schedule, setSchedule] = useState<IrrigationSchedule | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Simulate weather data (replace with actual API call)
  useEffect(() => {
    setWeather({
      temp: 32,
      humidity: 65,
      rainfall: 0,
      windSpeed: 12,
      forecast: [
        { day: "Today", temp: 32, rain: 0, icon: "☀️" },
        { day: "Tomorrow", temp: 31, rain: 5, icon: "🌤️" },
        { day: "Day 3", temp: 29, rain: 15, icon: "🌧️" },
        { day: "Day 4", temp: 30, rain: 0, icon: "☀️" },
        { day: "Day 5", temp: 33, rain: 0, icon: "☀️" },
      ],
    });
  }, []);

  const calculateIrrigation = () => {
    if (!cropType || !fieldSize || !soilType || !irrigationType) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields to calculate irrigation schedule",
        variant: "destructive",
      });
      return;
    }

    // Simplified irrigation calculation
    const baseWater = parseFloat(fieldSize) * 4000; // liters per acre
    const cropFactor = cropType === "rice" ? 1.5 : cropType === "wheat" ? 0.8 : 1.0;
    const soilFactor = soilType === "clay" ? 0.8 : soilType === "sandy" ? 1.2 : 1.0;
    
    const waterAmount = Math.round(baseWater * cropFactor * soilFactor);
    const duration = Math.round((waterAmount / 1000) * 60); // minutes

    const scheduleData: IrrigationSchedule = {
      today: new Date().toLocaleDateString(),
      nextIrrigation: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      waterAmount,
      duration,
      reason: weather?.forecast[1].rain && weather.forecast[1].rain > 10 
        ? "Delayed due to expected rainfall" 
        : "Based on crop water requirement and soil moisture",
      schedule: [
        { date: "Today", amount: waterAmount, time: "6:00 AM", status: "pending" },
        { date: "Day 3", amount: waterAmount, time: "6:00 AM", status: "pending" },
        { date: "Day 6", amount: waterAmount, time: "6:00 AM", status: "pending" },
        { date: "Day 9", amount: waterAmount, time: "6:00 AM", status: "pending" },
      ],
    };

    setSchedule(scheduleData);
    toast({
      title: "✅ Irrigation Schedule Generated",
      description: `Next irrigation: ${scheduleData.nextIrrigation}`,
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
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-info/15 rounded-2xl flex items-center justify-center"
            >
              <Droplets size={24} className="text-info" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                💧 Smart Irrigation Scheduler
              </h1>
              <p className="text-sm text-muted-foreground">
                Optimize water usage with weather-based irrigation planning
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weather Dashboard */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cloud size={20} className="text-primary" />
                Current Weather Conditions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ThermometerSun size={16} className="text-orange-500" />
                    <span className="text-xs text-muted-foreground">Temperature</span>
                  </div>
                  <p className="text-xl font-bold">{weather.temp}°C</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets size={16} className="text-blue-500" />
                    <span className="text-xs text-muted-foreground">Humidity</span>
                  </div>
                  <p className="text-xl font-bold">{weather.humidity}%</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud size={16} className="text-gray-500" />
                    <span className="text-xs text-muted-foreground">Rainfall</span>
                  </div>
                  <p className="text-xl font-bold">{weather.rainfall}mm</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Wind size={16} className="text-cyan-500" />
                    <span className="text-xs text-muted-foreground">Wind Speed</span>
                  </div>
                  <p className="text-xl font-bold">{weather.windSpeed}km/h</p>
                </div>
              </div>

              <h4 className="text-sm font-semibold mb-3">5-Day Forecast</h4>
              <div className="flex gap-2 overflow-x-auto">
                {weather.forecast.map((day, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="min-w-[100px] bg-secondary/30 rounded-xl p-3 text-center"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                    <p className="text-2xl mb-1">{day.icon}</p>
                    <p className="text-sm font-bold">{day.temp}°C</p>
                    <p className="text-xs text-info">{day.rain}mm rain</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Field Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">🌾 Rice (Paddy)</SelectItem>
                    <SelectItem value="wheat">🌾 Wheat</SelectItem>
                    <SelectItem value="cotton">☁️ Cotton</SelectItem>
                    <SelectItem value="sugarcane">🎋 Sugarcane</SelectItem>
                    <SelectItem value="maize">🌽 Maize (Corn)</SelectItem>
                    <SelectItem value="tomato">🍅 Tomato</SelectItem>
                    <SelectItem value="potato">🥔 Potato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Field Size (Acres)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 2.5"
                  value={fieldSize}
                  onChange={(e) => setFieldSize(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Soil Type</Label>
                <Select value={soilType} onValueChange={setSoilType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">🪨 Clay (High water retention)</SelectItem>
                    <SelectItem value="loam">🌱 Loam (Balanced)</SelectItem>
                    <SelectItem value="sandy">🏖️ Sandy (Low water retention)</SelectItem>
                    <SelectItem value="silt">💧 Silt (Medium retention)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Irrigation Method</Label>
                <Select value={irrigationType} onValueChange={setIrrigationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip">💧 Drip Irrigation</SelectItem>
                    <SelectItem value="sprinkler">🚿 Sprinkler</SelectItem>
                    <SelectItem value="flood">🌊 Flood Irrigation</SelectItem>
                    <SelectItem value="furrow">🌾 Furrow Irrigation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={calculateIrrigation}
              className="w-full mt-6"
              size="lg"
            >
              <Droplets className="mr-2" size={20} />
              Generate Irrigation Schedule
            </Button>
          </Card>
        </motion.div>

        {/* Irrigation Schedule */}
        <AnimatePresence>
          {schedule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-success" />
                  Your Irrigation Schedule
                </h3>

                <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Next Irrigation</p>
                      <p className="text-lg font-bold text-success">{schedule.nextIrrigation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Water Required</p>
                      <p className="text-lg font-bold">{schedule.waterAmount.toLocaleString()} L</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Duration</p>
                      <p className="text-lg font-bold">{schedule.duration} min</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                    <AlertTriangle size={16} className="mt-0.5" />
                    {schedule.reason}
                  </p>
                </div>

                <h4 className="text-sm font-semibold mb-3">Upcoming Schedule</h4>
                <div className="space-y-2">
                  {schedule.schedule.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        item.status === "pending" 
                          ? "bg-info/10 border border-info/30" 
                          : item.status === "completed"
                          ? "bg-success/10 border border-success/30"
                          : "bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Droplets size={20} className={
                          item.status === "pending" ? "text-info" :
                          item.status === "completed" ? "text-success" : "text-muted-foreground"
                        } />
                        <div>
                          <p className="font-semibold text-sm">{item.date}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.amount.toLocaleString()} L</p>
                        <p className="text-xs capitalize text-muted-foreground">{item.status}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 bg-warning/10 border border-warning/30 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sun size={16} />
                    Water Conservation Tips
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Irrigate early morning (6-8 AM) to minimize evaporation</li>
                    <li>• Monitor soil moisture before each irrigation</li>
                    <li>• Adjust schedule based on actual rainfall</li>
                    <li>• Check for leaks in irrigation system regularly</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
