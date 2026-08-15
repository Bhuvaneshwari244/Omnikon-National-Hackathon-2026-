import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cloud, CloudRain, Wind, Zap, AlertTriangle, Sun, Thermometer, Umbrella, ShieldAlert, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface WeatherAlert {
  id: string;
  type: "rain" | "heatwave" | "frost" | "storm" | "drought" | "hail";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timeframe: string;
  recommendation: string;
  affectedCrops: string[];
  icon: any;
  color: string;
}

interface CropRisk {
  crop: string;
  riskLevel: "low" | "medium" | "high";
  threats: string[];
  actions: string[];
}

export default function WeatherAlerts() {
  const { t } = useLanguage();
  const [location, setLocation] = useState("Hyderabad, Telangana");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["rice", "cotton"]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [cropRisks, setCropRisks] = useState<CropRisk[]>([]);

  // Simulate weather alerts (would come from weather API)
  useEffect(() => {
    const mockAlerts: WeatherAlert[] = [
      {
        id: "1",
        type: "rain",
        severity: "high",
        title: "Heavy Rainfall Expected",
        description: "Heavy to very heavy rainfall expected in next 48 hours (80-120mm)",
        timeframe: "Next 48 hours",
        recommendation: "Postpone pesticide application. Ensure proper drainage in fields.",
        affectedCrops: ["Rice", "Cotton", "Vegetables"],
        icon: CloudRain,
        color: "text-blue-500",
      },
      {
        id: "2",
        type: "heatwave",
        severity: "medium",
        title: "High Temperature Alert",
        description: "Temperature expected to reach 38-40°C over next 3 days",
        timeframe: "Next 3 days",
        recommendation: "Increase irrigation frequency. Provide shade for sensitive crops.",
        affectedCrops: ["Tomato", "Leafy Vegetables", "Flowers"],
        icon: Sun,
        color: "text-orange-500",
      },
      {
        id: "3",
        type: "storm",
        severity: "critical",
        title: "Severe Thunderstorm Warning",
        description: "Strong winds (60-80 km/h) with lightning expected tomorrow evening",
        timeframe: "Tomorrow 4-8 PM",
        recommendation: "Secure loose structures. Avoid going to fields during storm.",
        affectedCrops: ["Banana", "Sugarcane", "Tall crops"],
        icon: Zap,
        color: "text-purple-500",
      },
    ];

    const mockRisks: CropRisk[] = [
      {
        crop: "Rice (Paddy)",
        riskLevel: "high",
        threats: ["Waterlogging due to heavy rain", "Blast disease outbreak", "Nitrogen leaching"],
        actions: [
          "Ensure proper drainage channels",
          "Apply fungicide before rain if blast history exists",
          "Plan split nitrogen application after rain",
        ],
      },
      {
        crop: "Cotton",
        riskLevel: "medium",
        threats: ["Boll rot due to moisture", "Pink bollworm activity increase"],
        actions: [
          "Monitor boll development stage",
          "Remove affected bolls immediately",
          "Apply recommended insecticide post-rain",
        ],
      },
    ];

    setAlerts(mockAlerts);
    setCropRisks(mockRisks);
  }, [selectedCrops]);

  const getSeverityBadge = (severity: string) => {
    const styles = {
      low: "bg-green-500/20 text-green-500 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      high: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      critical: "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse",
    };
    return styles[severity as keyof typeof styles] || styles.low;
  };

  const getRiskColor = (level: string) => {
    const colors = {
      low: "border-green-500/30 bg-green-500/5",
      medium: "border-yellow-500/30 bg-yellow-500/5",
      high: "border-red-500/30 bg-red-500/5",
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  const shareAlert = (alert: WeatherAlert) => {
    const message = `⚠️ Weather Alert\n\n${alert.title}\n\n${alert.description}\n\nTimeframe: ${alert.timeframe}\n\nAction: ${alert.recommendation}`;
    window.open(buildWhatsAppLink(message), "_blank");
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
              className="w-12 h-12 bg-warning/15 rounded-2xl flex items-center justify-center"
            >
              <AlertTriangle size={24} className="text-warning" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                🌦️ Weather Alerts & Crop Protection
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time weather warnings and crop-specific risk assessment
              </p>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Alert Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hyderabad, Telangana">📍 Hyderabad, Telangana</SelectItem>
                    <SelectItem value="Warangal, Telangana">📍 Warangal, Telangana</SelectItem>
                    <SelectItem value="Guntur, Andhra Pradesh">📍 Guntur, Andhra Pradesh</SelectItem>
                    <SelectItem value="Vijayawada, Andhra Pradesh">📍 Vijayawada, Andhra Pradesh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Get instant alerts for severe weather
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold">
              Active Alerts ({alerts.length})
            </h2>
            <Badge variant="destructive" className="animate-pulse">
              {alerts.filter(a => a.severity === "critical" || a.severity === "high").length} Urgent
            </Badge>
          </div>

          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`p-5 border-2 ${
                    alert.severity === "critical" ? "border-red-500/50 bg-red-500/5" :
                    alert.severity === "high" ? "border-orange-500/50 bg-orange-500/5" :
                    "border-border"
                  }`}>
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={alert.severity === "critical" ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          alert.severity === "critical" ? "bg-red-500/20" :
                          alert.severity === "high" ? "bg-orange-500/20" :
                          "bg-yellow-500/20"
                        }`}
                      >
                        <alert.icon size={24} className={alert.color} />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground">{alert.timeframe}</p>
                          </div>
                          <Badge className={getSeverityBadge(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="text-sm mb-3">{alert.description}</p>

                        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-3">
                          <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                            <ShieldAlert size={16} />
                            Recommended Action:
                          </p>
                          <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="text-xs text-muted-foreground">Affected crops:</span>
                          {alert.affectedCrops.map((crop, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shareAlert(alert)}
                          className="w-full"
                        >
                          <Bell size={14} className="mr-2" />
                          Share Alert via WhatsApp
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Crop-Specific Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-display font-bold mb-4">
            🌾 Crop-Specific Risk Assessment
          </h2>

          <div className="space-y-4">
            {cropRisks.map((risk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`p-5 border-2 ${getRiskColor(risk.riskLevel)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg">🌾 {risk.crop}</h3>
                    <Badge className={getSeverityBadge(risk.riskLevel)}>
                      {risk.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-warning" />
                      Potential Threats:
                    </h4>
                    <ul className="space-y-1">
                      {risk.threats.map((threat, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-warning">•</span>
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-success">
                      <ShieldAlert size={16} />
                      Protective Actions:
                    </h4>
                    <ul className="space-y-1">
                      {risk.actions.map((action, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span className="text-success">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Historical Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">📊 This Week's Weather Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <CloudRain size={32} className="mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">45mm</p>
                <p className="text-xs text-muted-foreground">Rainfall</p>
              </div>
              <div className="text-center">
                <Thermometer size={32} className="mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">32°C</p>
                <p className="text-xs text-muted-foreground">Avg Temp</p>
              </div>
              <div className="text-center">
                <Wind size={32} className="mx-auto mb-2 text-cyan-500" />
                <p className="text-2xl font-bold">18km/h</p>
                <p className="text-xs text-muted-foreground">Avg Wind</p>
              </div>
              <div className="text-center">
                <Umbrella size={32} className="mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">65%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
