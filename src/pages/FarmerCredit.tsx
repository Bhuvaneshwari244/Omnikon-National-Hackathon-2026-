import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, TrendingUp, CheckCircle, AlertTriangle, DollarSign, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface CreditScore {
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  loanAmount: number;
  interestRate: number;
  factors: {
    name: string;
    score: number;
    weight: string;
  }[];
  recommendations: string[];
  eligibleSchemes: {
    name: string;
    amount: string;
    rate: string;
    tenure: string;
  }[];
}

export default function FarmerCredit() {
  const { toast } = useToast();
  const [farmerData, setFarmerData] = useState({
    landSize: "",
    cropHistory: "",
    yearsOfFarming: "",
    irrigationType: "",
    marketAccess: "",
    previousLoans: "",
  });
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);

  const calculateCreditScore = () => {
    if (!farmerData.landSize || !farmerData.cropHistory || !farmerData.yearsOfFarming) {
      toast({
        title: "Missing Information",
        description: "Please fill required fields to calculate credit score",
        variant: "destructive",
      });
      return;
    }

    const landSize = parseFloat(farmerData.landSize);
    const years = parseInt(farmerData.yearsOfFarming);
    
    // Calculate component scores
    const landScore = Math.min((landSize / 5) * 30, 30);
    const experienceScore = Math.min((years / 20) * 25, 25);
    const cropHistoryScore = farmerData.cropHistory === "diverse" ? 20 : farmerData.cropHistory === "seasonal" ? 15 : 10;
    const irrigationScore = farmerData.irrigationType === "drip" ? 15 : farmerData.irrigationType === "canal" ? 10 : 5;
    const marketScore = farmerData.marketAccess === "direct" ? 10 : farmerData.marketAccess === "mandi" ? 7 : 3;
    const loanHistoryScore = farmerData.previousLoans === "none" ? 0 : farmerData.previousLoans === "repaid" ? 0 : -10;
    
    const totalScore = Math.min(Math.max(landScore + experienceScore + cropHistoryScore + irrigationScore + marketScore + loanHistoryScore, 0), 100);
    
    let rating: "excellent" | "good" | "fair" | "poor";
    let interestRate: number;
    let loanAmount: number;
    
    if (totalScore >= 80) {
      rating = "excellent";
      interestRate = 4;
      loanAmount = Math.round(landSize * 150000);
    } else if (totalScore >= 60) {
      rating = "good";
      interestRate = 7;
      loanAmount = Math.round(landSize * 100000);
    } else if (totalScore >= 40) {
      rating = "fair";
      interestRate = 9;
      loanAmount = Math.round(landSize * 75000);
    } else {
      rating = "poor";
      interestRate = 12;
      loanAmount = Math.round(landSize * 50000);
    }

    const result: CreditScore = {
      score: Math.round(totalScore),
      rating,
      loanAmount,
      interestRate,
      factors: [
        { name: "Land Ownership", score: Math.round(landScore), weight: "30%" },
        { name: "Farming Experience", score: Math.round(experienceScore), weight: "25%" },
        { name: "Crop Diversification", score: Math.round(cropHistoryScore), weight: "20%" },
        { name: "Irrigation System", score: Math.round(irrigationScore), weight: "15%" },
        { name: "Market Access", score: Math.round(marketScore), weight: "10%" },
      ],
      recommendations: [
        totalScore < 60 ? "Consider diversifying crops to improve score" : "Maintain crop diversity",
        farmerData.irrigationType !== "drip" ? "Upgrade to drip irrigation for better credit terms" : "Excellent irrigation setup",
        farmerData.marketAccess !== "direct" ? "Explore direct market access options" : "Great market connectivity",
        years < 10 ? "Build farming experience over time" : "Strong farming track record",
      ],
      eligibleSchemes: [
        {
          name: "Kisan Credit Card (KCC)",
          amount: `₹${(loanAmount * 0.5).toLocaleString()}`,
          rate: `${interestRate}% p.a.`,
          tenure: "3 years",
        },
        {
          name: "PM-KISAN",
          amount: "₹6,000/year",
          rate: "Subsidy",
          tenure: "Annual",
        },
        rating !== "poor" ? {
          name: "Agriculture Infrastructure Fund",
          amount: `₹${loanAmount.toLocaleString()}`,
          rate: `${interestRate + 1}% p.a.`,
          tenure: "5 years",
        } : null,
        rating === "excellent" || rating === "good" ? {
          name: "Farmer Producer Organization (FPO)",
          amount: `₹${Math.round(loanAmount * 1.5).toLocaleString()}`,
          rate: `${interestRate - 1}% p.a.`,
          tenure: "7 years",
        } : null,
      ].filter(Boolean) as any,
    };

    setCreditScore(result);
    toast({
      title: "✅ Credit Score Calculated",
      description: `Your score: ${result.score}/100 (${rating.toUpperCase()})`,
    });
  };

  const getRatingColor = (rating: string) => {
    const colors = {
      excellent: "bg-green-500/20 text-green-500 border-green-500/30",
      good: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      fair: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      poor: "bg-red-500/20 text-red-500 border-red-500/30",
    };
    return colors[rating as keyof typeof colors];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center"
            >
              <CreditCard size={24} className="text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                💳 Farmer Credit Score System
              </h1>
              <p className="text-sm text-muted-foreground">
                Data-driven micro-credit assessment for fair loan access
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Banner */}
        <Card className="p-4 mb-6 bg-info/10 border-info/30">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-info mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Alternative Credit Scoring</h4>
              <p className="text-xs text-muted-foreground">
                Traditional credit scores don't work for farmers. We use farming data, crop history, and land records to provide fair credit assessment.
              </p>
            </div>
          </div>
        </Card>

        {/* Input Form */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Farmer Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Land Size (Acres)*</Label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={farmerData.landSize}
                onChange={(e) => setFarmerData({...farmerData, landSize: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Years of Farming*</Label>
              <Input
                type="number"
                placeholder="e.g., 15"
                value={farmerData.yearsOfFarming}
                onChange={(e) => setFarmerData({...farmerData, yearsOfFarming: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Crop History*</Label>
              <Select value={farmerData.cropHistory} onValueChange={(v) => setFarmerData({...farmerData, cropHistory: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diverse">🌈 Diverse (3+ different crops)</SelectItem>
                  <SelectItem value="seasonal">🌾 Seasonal (2 crops/year)</SelectItem>
                  <SelectItem value="single">🌱 Single Crop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Irrigation Type</Label>
              <Select value={farmerData.irrigationType} onValueChange={(v) => setFarmerData({...farmerData, irrigationType: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drip">💧 Drip Irrigation (Modern)</SelectItem>
                  <SelectItem value="canal">🌊 Canal/Well</SelectItem>
                  <SelectItem value="rainfed">🌧️ Rain-fed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Market Access</Label>
              <Select value={farmerData.marketAccess} onValueChange={(v) => setFarmerData({...farmerData, marketAccess: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">🤝 Direct to Buyer</SelectItem>
                  <SelectItem value="mandi">🏪 Through Mandi</SelectItem>
                  <SelectItem value="middleman">👤 Through Middleman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Previous Loan History</Label>
              <Select value={farmerData.previousLoans} onValueChange={(v) => setFarmerData({...farmerData, previousLoans: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select history" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">✓ No Previous Loans</SelectItem>
                  <SelectItem value="repaid">✓ Previous Loan Repaid</SelectItem>
                  <SelectItem value="active">⏳ Active Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculateCreditScore} className="w-full mt-6" size="lg">
            <TrendingUp className="mr-2" size={20} />
            Calculate Credit Score
          </Button>
        </Card>

        {/* Results */}
        {creditScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Credit Score Summary */}
            <Card className="p-6 border-2 border-primary">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - creditScore.score / 100)}`}
                        className={getScoreColor(creditScore.score)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(creditScore.score)}`}>
                        {creditScore.score}
                      </span>
                    </div>
                  </div>
                </motion.div>
                <Badge className={`${getRatingColor(creditScore.rating)} text-lg px-4 py-1`}>
                  {creditScore.rating.toUpperCase()} RATING
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Eligible Loan Amount</p>
                  <p className="text-2xl font-bold text-success">₹{creditScore.loanAmount.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                  <p className="text-2xl font-bold text-info">{creditScore.interestRate}% p.a.</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Credit Rating</p>
                  <p className="text-2xl font-bold">{creditScore.score}/100</p>
                </div>
              </div>
            </Card>

            {/* Score Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                {creditScore.factors.map((factor, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{factor.name}</span>
                      <span className="text-muted-foreground">
                        {factor.score}/{factor.weight} weight
                      </span>
                    </div>
                    <Progress value={(factor.score / parseInt(factor.weight)) * 100} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-warning/10 border-warning/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award size={20} className="text-warning" />
                Improve Your Score
              </h3>
              <ul className="space-y-2">
                {creditScore.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-warning mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Eligible Schemes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-success" />
                Eligible Government Schemes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creditScore.eligibleSchemes.map((scheme, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border rounded-xl p-4 hover:border-primary transition-colors"
                  >
                    <h4 className="font-semibold mb-2">{scheme.name}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-semibold">{scheme.amount}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-semibold text-success">{scheme.rate}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Tenure:</span>
                        <span className="font-semibold">{scheme.tenure}</span>
                      </p>
                    </div>
                    <Button size="sm" className="w-full mt-3" variant="outline">
                      Apply Now
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6 bg-success/10 border-success/30">
              <h3 className="text-lg font-semibold mb-3">Why This Matters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5" />
                  <span>No need for traditional credit history</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5" />
                  <span>Based on actual farming data</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5" />
                  <span>Fair assessment for small farmers</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-success mt-0.5" />
                  <span>Access to government subsidies</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
