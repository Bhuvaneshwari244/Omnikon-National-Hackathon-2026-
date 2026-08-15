import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Users, BarChart3, Truck, Stethoscope, Star, ChevronRight, Sparkles, TrendingUp, Leaf, Globe, Zap, Droplets, CloudRain, Warehouse, Calculator, CreditCard, Heart, QrCode, Bug, HeartHandshake, Flower2, Fish, Tractor } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { StaggerContainer, StaggerItem } from "@/components/StaggerChildren";
import { AnimatedLabel } from "@/components/AnimatedLabel";

export default function Index() {
  const { t } = useLanguage();

  const features = [
    { path: "/crops", icon: BookOpen, color: "from-red-600 to-orange-600", title: "Crop Library", desc: t.features.cropsDesc },
    { path: "/diagnosis", icon: Stethoscope, color: "from-violet-600 to-purple-600", title: "AI Diagnosis", desc: t.features.diagnosisDesc },
    { path: "/irrigation", icon: Droplets, color: "from-cyan-600 to-blue-600", title: "Smart Irrigation", desc: "Smart water management with weather-based scheduling" },
    { path: "/weather-alerts", icon: CloudRain, color: "from-yellow-600 to-orange-600", title: "Weather Alerts", desc: "Real-time alerts and crop protection guidance" },
    { path: "/pesticide", icon: Calculator, color: "from-green-600 to-emerald-600", title: "Pesticide Calculator", desc: "Precision dosage calculator to reduce overuse" },
    { path: "/mandi", icon: BarChart3, color: "from-emerald-600 to-green-600", title: "Mandi Rates", desc: t.features.mandiDesc },
    { path: "/storage", icon: Warehouse, color: "from-purple-600 to-pink-600", title: "Storage Monitor", desc: "Monitor storage conditions and prevent spoilage" },
    { path: "/transport", icon: Truck, color: "from-amber-600 to-yellow-600", title: "Transport", desc: t.features.transportDesc },
    { path: "/credit", icon: CreditCard, color: "from-indigo-600 to-blue-600", title: "Farmer Credit", desc: "Data-driven credit scoring for fair loans" },
    { path: "/livestock", icon: Heart, color: "from-pink-600 to-rose-600", title: "Livestock Care", desc: "Early disease detection for dairy & poultry" },
    { path: "/organic-trace", icon: QrCode, color: "from-lime-600 to-green-600", title: "Organic Trace", desc: "Farm-to-consumer organic product traceability" },
    { path: "/pest-alert", icon: Bug, color: "from-red-600 to-orange-600", title: "Pest Alert", desc: "Community pest outbreak early warning system" },
    { path: "/food-donation", icon: HeartHandshake, color: "from-green-600 to-teal-600", title: "Food Donation", desc: "Connect surplus produce to NGOs and reduce waste" },
    { path: "/bee-monitor", icon: Flower2, color: "from-yellow-600 to-amber-600", title: "Bee Monitor", desc: "Prevent bee colony collapse with health tracking" },
    { path: "/fishing-zones", icon: Fish, color: "from-blue-600 to-cyan-600", title: "Fishing Zones", desc: "Identify safe, productive fishing areas" },
    { path: "/machinery", icon: Tractor, color: "from-orange-600 to-red-600", title: "Machinery Share", desc: "Share agricultural equipment and reduce costs" },
    { path: "/community", icon: Users, color: "from-purple-600 to-blue-600", title: "Community", desc: t.features.communityDesc },
    { path: "/recommendations", icon: Star, color: "from-pink-600 to-purple-600", title: "Recommendations", desc: t.features.recommendationsDesc },
  ];

  const stats = [
    { label: t.stats.cropsListed, value: "100+", icon: Leaf, color: "text-emerald-400" },
    { label: t.stats.languages, value: "30+", icon: Globe, color: "text-blue-400" },
    { label: t.stats.mandiMarkets, value: "500+", icon: TrendingUp, color: "text-amber-400" },
    { label: t.stats.aiPowered, value: t.stats.realtime, icon: Zap, color: "text-violet-400" },
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6">
        {/* Hero */}
        <section className="text-center py-10 md:py-20 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Sparkles size={14} />
            </motion.span>
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 15, y: { repeat: 2, duration: 0.4 } }}
            className="text-4xl md:text-6xl font-display font-bold text-gradient mb-4 leading-tight tracking-tight"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ y: -5, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/crops" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3.5 rounded-2xl transition-all glow-red group">
                {t.hero.cta} <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -5, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/diagnosis" className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-muted text-foreground font-semibold px-8 py-3.5 rounded-2xl transition-colors border border-border/50 group">
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Stethoscope size={18} />
                </motion.span>
                {t.hero.aiDiagnosis}
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Dashboard */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {stats.map((s, i) => (
            <StaggerItem key={s.label}>
              <motion.div 
                className="stat-card group hover:border-primary/30 transition-all duration-300"
                whileHover={{ y: -8, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                >
                  <s.icon size={22} className={`${s.color} mb-3 group-hover:scale-110 transition-transform`} />
                </motion.div>
                <motion.p 
                  className="text-2xl md:text-3xl font-display font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: [1, 1.15, 1] }}
                  transition={{ delay: i * 0.1 + 0.2, scale: { repeat: 2, duration: 0.3 } }}
                >
                  {s.value}
                </motion.p>
                <motion.p 
                  className="text-xs text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  {s.label}
                </motion.p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Problem Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div 
            className="glass-card p-6 md:p-8 border-l-4 border-l-primary"
            whileHover={{ y: -4 }}
          >
            <motion.h2 
              className="text-xl font-display font-bold text-foreground mb-5"
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-block mr-2"
              >
                ⚠️
              </motion.span>
              {t.hero.problemTitle}
            </motion.h2>
            <ul className="space-y-3">
              {t.problemItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className="flex items-start gap-3 text-secondary-foreground"
                >
                  <motion.span 
                    className="text-primary mt-0.5 text-lg"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                  >
                    ▸
                  </motion.span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Feature Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <StaggerItem key={f.path}>
              <motion.div
                whileHover={{ y: -10, scale: 1.03, rotate: 1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to={f.path} className="glass-card-hover p-5 md:p-6 block group">
                  <motion.div 
                    className={`w-12 h-12 md:w-14 md:h-14 mb-4 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                    animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.15 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <f.icon size={24} className="text-white" />
                  </motion.div>
                  <motion.h3 
                    className="font-display font-semibold text-foreground mb-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    {f.title}
                  </motion.h3>
                  <motion.p 
                    className="text-xs text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.15 }}
                  >
                    {f.desc}
                  </motion.p>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
