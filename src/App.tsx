import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import CropLibrary from "./pages/CropLibrary";
import Community from "./pages/Community";
import MandiRates from "./pages/MandiRates";
import Transport from "./pages/Transport";
import Diagnosis from "./pages/Diagnosis";
import Recommendations from "./pages/Recommendations";
import YieldPredict from "./pages/YieldPredict";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { lang } = require("@/contexts/LanguageContext").useLanguage();
  return (
    <div key={lang}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/crops" element={<CropLibrary />} />
        <Route path="/community" element={<Community />} />
        <Route path="/mandi" element={<MandiRates />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/yield-predict" element={<YieldPredict />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
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
