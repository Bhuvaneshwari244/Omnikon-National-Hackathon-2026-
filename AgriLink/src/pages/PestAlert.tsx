import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bug, AlertTriangle, MapPin, Bell, Users, Send } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface PestAlert {
  id: string;
  pestType: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  district: string;
  state: string;
  reportedBy: string;
  reportedAt: string;
  affectedCrops: string[];
  description: string;
  actionTaken: string;
  distance?: number;
}

export default function PestAlert() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PestAlert[]>([]);
  const [newReport, setNewReport] = useState({
    pestType: "",
    severity: "",
    location: "",
    crops: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState<"view" | "report">("view");

  useEffect(() => {
    // Mock alerts
    const mockAlerts: PestAlert[] = [
      {
        id: "1",
        pestType: "Locust Swarm",
        severity: "critical",
        location: "Nalgonda Village",
        district: "Nalgonda",
        state: "Telangana",
        reportedBy: "Farmer Group (15 members)",
        reportedAt: "2 hours ago",
        affectedCrops: ["Cotton", "Maize", "Soybean"],
        description: "Large swarm spotted moving from west. Approx 500+ locusts. Already damaged 2 acres of cotton field.",
        actionTaken: "Authorities notified. Pesticide spray scheduled for tomorrow morning.",
        distance: 8,
      },
      {
        id: "2",
        pestType: "Pink Bollworm",
        severity: "high",
        location: "Warangal Region",
        district: "Warangal",
        state: "Telangana",
        reportedBy: "Agriculture Officer",
        reportedAt: "1 day ago",
        affectedCrops: ["Cotton"],
        description: "Heavy infestation detected in multiple cotton fields. Larval stage observed in 30% of bolls.",
        actionTaken: "Pheromone traps deployed. Farmers advised to apply recommended insecticide.",
        distance: 25,
      },
      {
        id: "3",
        pestType: "Fall Armyworm",
        severity: "medium",
        location: "Guntur District",
        district: "Guntur",
        state: "Andhra Pradesh",
        reportedBy: "Extension Worker",
        reportedAt: "3 days ago",
        affectedCrops: ["Maize", "Sorghum"],
        description: "Moderate damage to young maize plants. Feeding patterns visible on leaves.",
        actionTaken: "Bio-pesticide (NPV) distribution started. Farmers trained on manual removal.",
        distance: 120,
      },
    ];

    setAlerts(mockAlerts);
  }, []);

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "bg-green-500/20 text-green-500 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      high: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      critical: "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse",
    };
    return colors[severity as keyof typeof colors];
  };

  const submitReport = () => {
    if (!newReport.pestType || !newReport.severity || !newReport.location || !newReport.description) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAlert: PestAlert = {
      id: Date.now().toString(),
      pestType: newReport.pestType,
      severity: newReport.severity as any,
      location: newReport.location,
      district: "Your District",
      state: "Your State",
      reportedBy: "You",
      reportedAt: "Just now",
      affectedCrops: newReport.crops.split(",").map(c => c.trim()),
      description: newReport.description,
      actionTaken: "Report submitted. Authorities will respond soon.",
    };

    setAlerts([newAlert, ...alerts]);
    setNewReport({ pestType: "", severity: "", location: "", crops: "", description: "" });
    setActiveTab("view");

    toast({
      title: "✅ Alert Reported",
      description: "Your report has been submitted to nearby farmers and authorities",
    });
  };

  const shareAlert = (alert: PestAlert) => {
    const message = `🚨 PEST ALERT\n\nType: ${alert.pestType}\nSeverity: ${alert.severity.toUpperCase()}\nLocation: ${alert.location}, ${alert.district}\nAffected Crops: ${alert.affectedCrops.join(", ")}\n\nDetails: ${alert.description}\n\nAction: ${alert.actionTaken}`;
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
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 bg-destructive/15 rounded-2xl flex items-center justify-center"
            >
              <Bug size={24} className="text-destructive" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                🐛 Pest Swarm Early Warning
              </h1>
              <p className="text-sm text-muted-foreground">
                Community-driven pest outbreak alerts and response
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 text-center">
            <AlertTriangle size={20} className="mx-auto mb-1 text-destructive" />
            <p className="text-xs text-muted-foreground">Active Alerts</p>
            <p className="text-lg font-bold">{alerts.length}</p>
          </Card>
          <Card className="p-3 text-center">
            <Users size={20} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Farmers Alerted</p>
            <p className="text-lg font-bold">450+</p>
          </Card>
          <Card className="p-3 text-center">
            <MapPin size={20} className="mx-auto mb-1 text-info" />
            <p className="text-xs text-muted-foreground">Coverage Area</p>
            <p className="text-lg font-bold">50km</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab("view")}
            variant={activeTab === "view" ? "default" : "outline"}
            className="flex-1"
          >
            <Bell size={16} className="mr-2" />
            View Alerts ({alerts.length})
          </Button>
          <Button
            onClick={() => setActiveTab("report")}
            variant={activeTab === "report" ? "default" : "outline"}
            className="flex-1"
          >
            <Send size={16} className="mr-2" />
            Report Pest
          </Button>
        </div>

        {/* View Alerts */}
        {activeTab === "view" && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <Card className="p-8 text-center">
                <Bug size={48} className="mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">No active pest alerts in your area</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to report!</p>
              </Card>
            ) : (
              alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`p-6 border-2 ${
                    alert.severity === "critical" ? "border-destructive/50 bg-destructive/5" :
                    alert.severity === "high" ? "border-orange-500/50" : ""
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">🐛 {alert.pestType}</h3>
                          {alert.distance && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin size={10} className="mr-1" />
                              {alert.distance}km away
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.location}, {alert.district} • {alert.reportedAt}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-3">
                      <p className="text-sm font-semibold mb-1">Affected Crops:</p>
                      <div className="flex gap-2 flex-wrap">
                        {alert.affectedCrops.map((crop, i) => (
                          <Badge key={i} variant="secondary">{crop}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold mb-1">📝 Description:</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>

                      <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                        <p className="text-sm font-semibold mb-1 text-success">✓ Action Taken:</p>
                        <p className="text-sm">{alert.actionTaken}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground">
                          <Users size={14} className="inline mr-1" />
                          Reported by: {alert.reportedBy}
                        </p>
                        <Button size="sm" variant="outline" onClick={() => shareAlert(alert)}>
                          <Send size={14} className="mr-1" />
                          Share Alert
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Report Pest */}
        {activeTab === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Report Pest Outbreak</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help your fellow farmers by reporting pest activity early. Your report will alert farmers within 50km radius.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pest Type*</label>
                  <Select value={newReport.pestType} onValueChange={(v) => setNewReport({...newReport, pestType: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Locust Swarm">🦗 Locust Swarm</SelectItem>
                      <SelectItem value="Pink Bollworm">🐛 Pink Bollworm</SelectItem>
                      <SelectItem value="Fall Armyworm">🐛 Fall Armyworm</SelectItem>
                      <SelectItem value="Aphids">🐛 Aphids</SelectItem>
                      <SelectItem value="Whitefly">🦟 Whitefly</SelectItem>
                      <SelectItem value="Brown Plant Hopper">🐛 Brown Plant Hopper</SelectItem>
                      <SelectItem value="Other">❓ Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity*</label>
                  <Select value={newReport.severity} onValueChange={(v) => setNewReport({...newReport, severity: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low (Few pests, localized)</SelectItem>
                      <SelectItem value="medium">🟡 Medium (Spreading, visible damage)</SelectItem>
                      <SelectItem value="high">🟠 High (Heavy infestation)</SelectItem>
                      <SelectItem value="critical">🔴 Critical (Swarm/outbreak)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Location*</label>
                  <Textarea
                    placeholder="Village name, District"
                    value={newReport.location}
                    onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Affected Crops</label>
                  <Textarea
                    placeholder="e.g., Cotton, Maize, Soybean (comma separated)"
                    value={newReport.crops}
                    onChange={(e) => setNewReport({...newReport, crops: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description*</label>
                  <Textarea
                    placeholder="Describe the situation: pest behavior, affected area, damage level, etc."
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <Button onClick={submitReport} className="w-full" size="lg">
                  <AlertTriangle size={16} className="mr-2" />
                  Submit Pest Alert
                </Button>
              </div>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="p-4 bg-info/10 border-info/30">
                <h4 className="font-semibold text-sm mb-2">📢 Who Gets Alerted?</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Farmers within 50km radius</li>
                  <li>• Agriculture officers in your district</li>
                  <li>• Nearby FPOs and farmer groups</li>
                  <li>• Pest management authorities</li>
                </ul>
              </Card>
              <Card className="p-4 bg-success/10 border-success/30">
                <h4 className="font-semibold text-sm mb-2">⚡ Quick Response</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Instant WhatsApp notifications</li>
                  <li>• SMS alerts to registered farmers</li>
                  <li>• Authorities notified automatically</li>
                  <li>• Community coordination enabled</li>
                </ul>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
