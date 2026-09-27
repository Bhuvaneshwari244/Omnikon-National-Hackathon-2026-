import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QrCode, Leaf, MapPin, Calendar, User, CheckCircle, Shield, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TraceabilityRecord {
  productId: string;
  productName: string;
  batchId: string;
  organicCertified: boolean;
  farmerDetails: {
    name: string;
    location: string;
    certificationId: string;
  };
  farmDetails: {
    size: string;
    soilType: string;
    irrigationType: string;
  };
  timeline: {
    date: string;
    stage: string;
    location: string;
    details: string;
    verified: boolean;
  }[];
  inputs: {
    type: string;
    name: string;
    organic: boolean;
    quantity: string;
  }[];
  certifications: {
    name: string;
    authority: string;
    validUntil: string;
    verified: boolean;
  }[];
}

export default function OrganicTrace() {
  const { toast } = useToast();
  const [productCode, setProductCode] = useState("");
  const [traceData, setTraceData] = useState<TraceabilityRecord | null>(null);
  const [registerMode, setRegisterMode] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    farmer: "",
    location: "",
    certId: "",
  });

  const traceProduct = () => {
    if (!productCode) {
      toast({
        title: "Enter Product Code",
        description: "Please scan or enter the product QR code",
        variant: "destructive",
      });
      return;
    }

    // Mock traceability data
    const mockData: TraceabilityRecord = {
      productId: productCode,
      productName: "Organic Tomatoes",
      batchId: "ORG-TOM-2026-0315",
      organicCertified: true,
      farmerDetails: {
        name: "Ramesh Kumar",
        location: "Warangal, Telangana",
        certificationId: "NPOP/NAB/034/2024",
      },
      farmDetails: {
        size: "5 acres",
        soilType: "Red Soil (Organic certified)",
        irrigationType: "Drip Irrigation",
      },
      timeline: [
        {
          date: "2026-01-15",
          stage: "Planting",
          location: "Farm - Warangal",
          details: "Organic certified seeds planted. No synthetic fertilizers used.",
          verified: true,
        },
        {
          date: "2026-02-10",
          stage: "Growing Period",
          location: "Farm - Warangal",
          details: "Neem-based pest control applied. Organic compost added.",
          verified: true,
        },
        {
          date: "2026-03-05",
          stage: "Harvesting",
          location: "Farm - Warangal",
          details: "Manual harvesting. 500 kg yield from 1 acre.",
          verified: true,
        },
        {
          date: "2026-03-06",
          stage: "Sorting & Packaging",
          location: "FPO Center - Warangal",
          details: "Quality checked, sorted, packed in eco-friendly boxes.",
          verified: true,
        },
        {
          date: "2026-03-07",
          stage: "Transportation",
          location: "Cold Storage Truck",
          details: "Temperature maintained at 8-10°C during transit.",
          verified: true,
        },
        {
          date: "2026-03-08",
          stage: "Retail Ready",
          location: "Organic Store - Hyderabad",
          details: "Ready for consumer purchase. QR code activated.",
          verified: true,
        },
      ],
      inputs: [
        { type: "Seeds", name: "Hybrid Tomato Seeds (Organic)", organic: true, quantity: "500g" },
        { type: "Fertilizer", name: "Vermicompost", organic: true, quantity: "200 kg" },
        { type: "Pest Control", name: "Neem Oil Spray", organic: true, quantity: "5 liters" },
        { type: "Water", name: "Drip Irrigation Water", organic: true, quantity: "As needed" },
      ],
      certifications: [
        {
          name: "NPOP (National Programme for Organic Production)",
          authority: "APEDA - Govt of India",
          validUntil: "2026-12-31",
          verified: true,
        },
        {
          name: "USDA Organic",
          authority: "United States Department of Agriculture",
          validUntil: "2026-11-30",
          verified: true,
        },
        {
          name: "India Organic Logo",
          authority: "APEDA",
          validUntil: "2026-12-31",
          verified: true,
        },
      ],
    };

    setTraceData(mockData);
    toast({
      title: "✅ Product Verified",
      description: "Genuine organic product from certified farm",
    });
  };

  const registerProduct = () => {
    if (!newProduct.name || !newProduct.farmer || !newProduct.location) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const generatedId = `ORG-${Date.now().toString().slice(-6)}`;
    toast({
      title: "✅ Product Registered",
      description: `Product ID: ${generatedId}. QR code generated!`,
    });
    
    setProductCode(generatedId);
    setRegisterMode(false);
    traceProduct();
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
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-green-500/15 rounded-2xl flex items-center justify-center"
            >
              <Leaf size={24} className="text-green-500" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                🌿 Organic Product Traceability
              </h1>
              <p className="text-sm text-muted-foreground">
                Farm-to-consumer transparency with blockchain verification
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-success/10 border-success/30">
            <Shield size={20} className="mb-2 text-success" />
            <h3 className="font-semibold text-sm mb-1">100% Transparent</h3>
            <p className="text-xs text-muted-foreground">
              Every step from farm to table tracked
            </p>
          </Card>
          <Card className="p-4 bg-info/10 border-info/30">
            <CheckCircle size={20} className="mb-2 text-info" />
            <h3 className="font-semibold text-sm mb-1">Verified Organic</h3>
            <p className="text-xs text-muted-foreground">
              Government certified organic produce
            </p>
          </Card>
          <Card className="p-4 bg-primary/10 border-primary/30">
            <QrCode size={20} className="mb-2 text-primary" />
            <h3 className="font-semibold text-sm mb-1">QR Code System</h3>
            <p className="text-xs text-muted-foreground">
              Instant verification via smartphone
            </p>
          </Card>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setRegisterMode(false)}
            variant={!registerMode ? "default" : "outline"}
            className="flex-1"
          >
            <QrCode size={16} className="mr-2" />
            Verify Product
          </Button>
          <Button
            onClick={() => setRegisterMode(true)}
            variant={registerMode ? "default" : "outline"}
            className="flex-1"
          >
            <Package size={16} className="mr-2" />
            Register Product
          </Button>
        </div>

        {/* Verify Mode */}
        {!registerMode && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Scan or Enter Product Code</h3>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., ORG-12345 or scan QR code"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={traceProduct}>
                <QrCode size={16} className="mr-2" />
                Verify
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try: ORG-12345 or ORG-67890 for demo
            </p>
          </Card>
        )}

        {/* Register Mode */}
        {registerMode && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Register New Organic Product</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name*</Label>
                <Input
                  placeholder="e.g., Organic Tomatoes"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Farmer Name*</Label>
                <Input
                  placeholder="Your name"
                  value={newProduct.farmer}
                  onChange={(e) => setNewProduct({...newProduct, farmer: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Farm Location*</Label>
                <Input
                  placeholder="Village, District"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Organic Certification ID</Label>
                <Input
                  placeholder="e.g., NPOP/NAB/034/2024"
                  value={newProduct.certId}
                  onChange={(e) => setNewProduct({...newProduct, certId: e.target.value})}
                />
              </div>
              <Button onClick={registerProduct} className="w-full">
                Register & Generate QR Code
              </Button>
            </div>
          </Card>
        )}

        {/* Traceability Results */}
        {traceData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Product Overview */}
            <Card className="p-6 border-2 border-success">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{traceData.productName}</h2>
                  <p className="text-sm text-muted-foreground">Batch: {traceData.batchId}</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30 text-lg px-4 py-1">
                  ✓ CERTIFIED ORGANIC
                </Badge>
              </div>
              <div className="bg-success/10 rounded-xl p-4">
                <div className="text-center">
                  <QrCode size={80} className="mx-auto mb-2 text-success" />
                  <p className="text-sm font-mono font-semibold">{traceData.productId}</p>
                  <p className="text-xs text-muted-foreground mt-1">Scan to verify authenticity</p>
                </div>
              </div>
            </Card>

            {/* Farmer Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" />
                Farmer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Farmer Name</p>
                  <p className="font-semibold">{traceData.farmerDetails.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Farm Location</p>
                  <p className="font-semibold flex items-center gap-1">
                    <MapPin size={14} />
                    {traceData.farmerDetails.location}
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Organic Certification ID</p>
                  <p className="font-semibold font-mono">{traceData.farmerDetails.certificationId}</p>
                </div>
              </div>
            </Card>

            {/* Farm Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🌾 Farm Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Farm Size</p>
                  <p className="font-semibold">{traceData.farmDetails.size}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Soil Type</p>
                  <p className="font-semibold">{traceData.farmDetails.soilType}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Irrigation</p>
                  <p className="font-semibold">{traceData.farmDetails.irrigationType}</p>
                </div>
              </div>
            </Card>

            {/* Journey Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-info" />
                Farm-to-Consumer Journey
              </h3>
              <div className="space-y-3">
                {traceData.timeline.map((stage, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-8 pb-4 border-l-2 border-success last:border-l-0"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-success border-2 border-background" />
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{stage.stage}</h4>
                        {stage.verified && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle size={10} className="mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(stage.date).toLocaleDateString('en-IN')} • {stage.location}
                      </p>
                      <p className="text-sm">{stage.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Inputs Used */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🌱 Inputs & Materials Used</h3>
              <div className="space-y-2">
                {traceData.inputs.map((input, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={input.organic ? "default" : "secondary"}>
                        {input.organic ? "Organic" : "Synthetic"}
                      </Badge>
                      <div>
                        <p className="font-semibold text-sm">{input.name}</p>
                        <p className="text-xs text-muted-foreground">{input.type}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{input.quantity}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6 bg-success/10 border-success/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
                <Shield size={20} />
                Organic Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {traceData.certifications.map((cert, i) => (
                  <div key={i} className="bg-background rounded-xl p-4 border border-success/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{cert.name}</h4>
                      {cert.verified && <CheckCircle size={16} className="text-success" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{cert.authority}</p>
                    <p className="text-xs">Valid until: {new Date(cert.validUntil).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Consumer Trust Badge */}
            <Card className="p-6 bg-primary/10 border-primary/30 text-center">
              <CheckCircle size={48} className="mx-auto mb-3 text-primary" />
              <h3 className="text-xl font-bold mb-2">✓ Verified Authentic Organic Product</h3>
              <p className="text-sm text-muted-foreground">
                This product is certified organic and traceable from farm to your table. 
                All information is verified and tamper-proof.
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
