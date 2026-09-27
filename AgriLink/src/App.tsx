import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import CropLibrary from "./pages/CropLibrary";
import Community from "./pages/Community";
import MandiRates from "./pages/MandiRates";
import Transport from "./pages/Transport";
import Diagnosis from "./pages/Diagnosis";
import Recommendations from "./pages/Recommendations";
import YieldPredict from "./pages/YieldPredict";
import Irrigation from "./pages/Irrigation";
import WeatherAlerts from "./pages/WeatherAlerts";
import StorageMonitor from "./pages/StorageMonitor";
import PesticideCalculator from "./pages/PesticideCalculator";
import FarmerCredit from "./pages/FarmerCredit";
import LivestockCare from "./pages/LivestockCare";
import OrganicTrace from "./pages/OrganicTrace";
import PestAlert from "./pages/PestAlert";
import FoodDonation from "./pages/FoodDonation";
import BeeMonitor from "./pages/BeeMonitor";
import FishingZones from "./pages/FishingZones";
import MachineryShare from "./pages/MachineryShare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { lang } = useLanguage();
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/crops" element={<PageTransition><CropLibrary /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/mandi" element={<PageTransition><MandiRates /></PageTransition>} />
        <Route path="/transport" element={<PageTransition><Transport /></PageTransition>} />
        <Route path="/diagnosis" element={<PageTransition><Diagnosis /></PageTransition>} />
        <Route path="/recommendations" element={<PageTransition><Recommendations /></PageTransition>} />
        <Route path="/yield-predict" element={<PageTransition><YieldPredict /></PageTransition>} />
        <Route path="/irrigation" element={<PageTransition><Irrigation /></PageTransition>} />
        <Route path="/weather-alerts" element={<PageTransition><WeatherAlerts /></PageTransition>} />
        <Route path="/storage" element={<PageTransition><StorageMonitor /></PageTransition>} />
        <Route path="/pesticide" element={<PageTransition><PesticideCalculator /></PageTransition>} />
        <Route path="/credit" element={<PageTransition><FarmerCredit /></PageTransition>} />
        <Route path="/livestock" element={<PageTransition><LivestockCare /></PageTransition>} />
        <Route path="/organic-trace" element={<PageTransition><OrganicTrace /></PageTransition>} />
        <Route path="/pest-alert" element={<PageTransition><PestAlert /></PageTransition>} />
        <Route path="/food-donation" element={<PageTransition><FoodDonation /></PageTransition>} />
        <Route path="/bee-monitor" element={<PageTransition><BeeMonitor /></PageTransition>} />
        <Route path="/fishing-zones" element={<PageTransition><FishingZones /></PageTransition>} />
        <Route path="/machinery" element={<PageTransition><MachineryShare /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
