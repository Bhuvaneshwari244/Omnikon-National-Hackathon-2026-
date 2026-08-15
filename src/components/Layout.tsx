import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/data/translations";
import { Home, BookOpen, Users, BarChart3, Truck, Stethoscope, Star, Sparkles, Menu, X, MessageCircle, Droplets, CloudRain, Warehouse, Calculator, CreditCard, Heart, QrCode, Bug, HeartHandshake, Flower2, Fish, Tractor } from "lucide-react";
import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import Chatbot from "./Chatbot";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const allRoutes = [
  { path: "/", icon: Home, label: "Home", category: "Main" },
  { path: "/crops", icon: BookOpen, label: "Crop Library", category: "Main" },
  { path: "/diagnosis", icon: Stethoscope, label: "AI Diagnosis", category: "Main" },
  { path: "/mandi", icon: BarChart3, label: "Mandi Rates", category: "Main" },
  { path: "/transport", icon: Truck, label: "Transport", category: "Main" },
  { path: "/community", icon: Users, label: "Community", category: "Main" },
  { path: "/recommendations", icon: Star, label: "Recommendations", category: "Main" },
  { path: "/yield-predict", icon: Sparkles, label: "Yield Predict", category: "Main" },
  
  { path: "/irrigation", icon: Droplets, label: "Smart Irrigation", category: "Smart Farming" },
  { path: "/weather-alerts", icon: CloudRain, label: "Weather Alerts", category: "Smart Farming" },
  { path: "/pesticide", icon: Calculator, label: "Pesticide Calculator", category: "Smart Farming" },
  { path: "/storage", icon: Warehouse, label: "Storage Monitor", category: "Smart Farming" },
  
  { path: "/credit", icon: CreditCard, label: "Farmer Credit", category: "Finance & Trade" },
  { path: "/livestock", icon: Heart, label: "Livestock Care", category: "Finance & Trade" },
  { path: "/organic-trace", icon: QrCode, label: "Organic Trace", category: "Finance & Trade" },
  { path: "/pest-alert", icon: Bug, label: "Pest Alert", category: "Finance & Trade" },
  
  { path: "/food-donation", icon: HeartHandshake, label: "Food Donation", category: "New Features" },
  { path: "/bee-monitor", icon: Flower2, label: "Bee Monitor", category: "New Features" },
  { path: "/fishing-zones", icon: Fish, label: "Fishing Zones", category: "New Features" },
  { path: "/machinery", icon: Tractor, label: "Machinery Share", category: "New Features" },
];

const navItems = [
  { path: "/", icon: Home, key: "home" as const },
  { path: "/crops", icon: BookOpen, key: "crops" as const },
  { path: "/community", icon: Users, key: "community" as const },
  { path: "/mandi", icon: BarChart3, key: "mandi" as const },
  { path: "/transport", icon: Truck, key: "transport" as const },
  { path: "/diagnosis", icon: Stethoscope, key: "diagnosis" as const },
  { path: "/recommendations", icon: Star, key: "recommendations" as const },
  { path: "/yield-predict", icon: Sparkles, key: "yieldPredict" as const },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useAutoTranslate();

  const groupedRoutes = allRoutes.reduce((acc, route) => {
    if (!acc[route.category]) acc[route.category] = [];
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, typeof allRoutes>);

  return (
    <div className="min-h-screen bg-background text-foreground relative flex">
      <AnimatedBackground />
      
      {/* Left Sidebar - Always Visible on Desktop */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-card border-r border-border shadow-lg z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h2 className="font-bold text-sm">All Features</h2>
              <p className="text-xs text-muted-foreground">{allRoutes.length} pages</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors ml-auto"
          >
            {sidebarCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(groupedRoutes).map(([category, routes]) => (
            <div key={category} className="mb-4">
              {!sidebarCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                  {category}
                </h3>
              )}
              <div className="space-y-0.5">
                {routes.map((route) => {
                  const isActive = location.pathname === route.path;
                  return (
                    <Link
                      key={route.path}
                      to={route.path}
                      title={sidebarCollapsed ? route.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <route.icon size={18} className="flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm truncate">{route.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-border">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium">100% Coverage</span>
              </div>
              <p className="text-xs text-muted-foreground">
                20/20 problems solved
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group" data-no-translate>
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-display font-bold text-gradient tracking-tight">AgriLink</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}
                    className="relative px-3 py-2 rounded-xl text-sm transition-all duration-200">
                    <span className={`relative z-10 flex items-center gap-1.5 ${active ? "text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                      <item.icon size={15} />
                      {t.nav[item.key]}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              {/* Mobile All Pages Button */}
              <button 
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Menu size={16} />
                <span className="hidden sm:inline">All ({allRoutes.length})</span>
              </button>
              
              <select value={lang} onChange={e => setLang(e.target.value)}
                data-no-translate
                className="bg-secondary text-secondary-foreground text-xs rounded-xl px-3 py-2 border border-border/50 focus:ring-2 focus:ring-primary outline-none">
                {languages.map(l => <option key={l.code} value={l.code}>{l.native}</option>)}
              </select>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-foreground rounded-xl hover:bg-secondary transition-colors">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden overflow-hidden bg-card border-t border-border/50"
              >
                <div className="p-4 space-y-1">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link to={item.path} onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${location.pathname === item.path ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                        <item.icon size={18} /> {t.nav[item.key]}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Mobile Sidebar with ALL Routes */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
              />
              
              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border shadow-2xl z-50 overflow-y-auto lg:hidden"
              >
                {/* Sidebar Header */}
                <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg">All Features</h2>
                    <p className="text-sm text-muted-foreground">{allRoutes.length} pages available</p>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Sidebar Content */}
                <div className="p-4 space-y-6">
                  {Object.entries(groupedRoutes).map(([category, routes]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {routes.map((route) => {
                          const isActive = location.pathname === route.path;
                          return (
                            <Link
                              key={route.path}
                              to={route.path}
                              onClick={() => setMobileSidebarOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                isActive
                                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                  : "text-foreground hover:bg-secondary"
                              }`}
                            >
                              <route.icon size={18} className="flex-shrink-0" />
                              <span className="text-sm">{route.label}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="sidebar-active"
                                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
                                />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar Footer */}
                <div className="sticky bottom-0 bg-card border-t border-border p-4">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-medium">100% Coverage</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      20/20 OMNIKON problems solved
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="pb-20 md:pb-8">{children}</main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50">
          <div className="flex justify-around py-2.5">
            {navItems.slice(0, 5).map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className="relative flex flex-col items-center gap-0.5 text-[10px] p-1">
                  <span className={`relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                    <item.icon size={20} />
                  </span>
                  <span className={`relative z-10 ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {t.nav[item.key]}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="bottom-nav-dot"
                      className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Chatbot */}
        <Chatbot />

        {/* WhatsApp Floating Button */}
        <motion.a
          href={buildWhatsAppLink("Hi AgriLink, I need help with farming")}
          target="_blank" rel="noopener noreferrer"
          className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-3 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={24} />
        </motion.a>
      </div>
    </div>
  );
}
