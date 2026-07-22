import React, { useState, useEffect } from "react";
import { Language, User, Plan } from "./types";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { AIToolsHub } from "./components/AIToolsHub";
import { MarketplaceHub } from "./components/MarketplaceHub";
import { PricingSection } from "./components/PricingSection";
import { UserDashboard } from "./components/UserDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { AuthModal } from "./components/AuthModal";
import { PixPaymentModal } from "./components/PixPaymentModal";
import { LiveChatWidget } from "./components/LiveChatWidget";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PLANS_DATA } from "./data/plans";
import { getTranslation } from "./i18n/translations";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("profit_lang") as Language) || "pt-BR";
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("profit_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            id: parsed.id || "USR-77821",
            name: parsed.name || "Alexandre Silva",
            email: parsed.email || "founder@profitai.com",
            role: parsed.role || "admin",
            plan: parsed.plan || "professional",
            billingCycle: parsed.billingCycle || "annual",
            creditsUsed: typeof parsed.creditsUsed === "number" ? parsed.creditsUsed : 420,
            creditsLimit: typeof parsed.creditsLimit === "number" ? parsed.creditsLimit : 5000,
            isTwoFactorEnabled: parsed.isTwoFactorEnabled ?? true,
            emailVerified: parsed.emailVerified ?? true,
            referralCode: parsed.referralCode || "PROFIT-8821",
            affiliateEarnings: typeof parsed.affiliateEarnings === "number" ? parsed.affiliateEarnings : 240.50,
            joinedAt: parsed.joinedAt || "2026-01-15",
          };
        }
      } catch (e) {}
    }
    // Default logged in demo user for immediate rich testing
    return {
      id: "USR-77821",
      name: "Alexandre Silva",
      email: "founder@profitai.com",
      role: "admin",
      plan: "professional",
      billingCycle: "annual",
      creditsUsed: 420,
      creditsLimit: 5000,
      isTwoFactorEnabled: true,
      emailVerified: true,
      referralCode: "PROFIT-8821",
      affiliateEarnings: 240.50,
      joinedAt: "2026-01-15",
    };
  });

  const [activeTab, setActiveTab] = useState<string>("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // PIX Checkout Modal State
  const [pixModalData, setPixModalData] = useState<{
    open: boolean;
    plan: Plan;
    cycle: "monthly" | "annual";
  }>({
    open: false,
    plan: PLANS_DATA[2], // Professional
    cycle: "annual",
  });

  useEffect(() => {
    localStorage.setItem("profit_lang", language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("profit_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("profit_user");
    }
  }, [currentUser]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("landing");
  };

  const handleOpenPixForPlan = (plan: Plan, cycle: "monthly" | "annual") => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setPixModalData({
      open: true,
      plan,
      cycle,
    });
  };

  const handleOpenPixForMarketplaceItem = (item: { name: string; priceBRL: number }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    // Create custom virtual plan for marketplace item
    const customPlan: Plan = {
      id: "professional",
      nameKey: item.name,
      priceMonthlyBRL: item.priceBRL,
      priceAnnualBRL: item.priceBRL,
      priceMonthlyUSD: item.priceBRL / 5,
      priceAnnualUSD: item.priceBRL / 5,
      creditsLimit: 0,
      features: ["Acesso vitalício ao arquivo digital"],
    };
    setPixModalData({
      open: true,
      plan: customPlan,
      cycle: "monthly",
    });
  };

  const handlePixSuccess = (planId: Plan["id"]) => {
    setPixModalData((prev) => ({ ...prev, open: false }));
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        plan: planId,
        creditsLimit: PLANS_DATA.find((p) => p.id === planId)?.creditsLimit || 5000,
      };
      setCurrentUser(updatedUser);
      setActiveTab("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Notification / Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white text-[11px] font-extrabold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        <span>PROMOÇÃO RELÂMPAGO: 50% OFF EM PLANOS ANUAIS COM CUPOM <strong className="text-cyan-300 underline font-mono">LANCAMENTO50</strong> VIA PIX</span>
      </div>

      {/* Navigation */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === "landing" && (
          <ErrorBoundary fallbackMessage="Erro ao carregar a Página Inicial">
            <LandingPage
              language={language}
              onExploreTools={() => setActiveTab("tools")}
              onOpenPricing={() => setActiveTab("pricing")}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </ErrorBoundary>
        )}

        {activeTab === "tools" && (
          <ErrorBoundary fallbackMessage="Erro ao carregar o Hub de Ferramentas de IA">
            <AIToolsHub
              language={language}
              currentUser={currentUser}
              onOpenPricing={() => setActiveTab("pricing")}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </ErrorBoundary>
        )}

        {activeTab === "marketplace" && (
          <ErrorBoundary fallbackMessage="Erro ao carregar o Marketplace">
            <MarketplaceHub
              language={language}
              currentUser={currentUser}
              onOpenPixCheckout={handleOpenPixForMarketplaceItem}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          </ErrorBoundary>
        )}

        {(activeTab === "pricing" || activeTab === "affiliates") && (
          <ErrorBoundary fallbackMessage="Erro ao carregar os Planos">
            <PricingSection
              language={language}
              onSelectPlan={(plan, cycle) => handleOpenPixForPlan(plan, cycle)}
            />
          </ErrorBoundary>
        )}

        {activeTab === "dashboard" && currentUser && (
          <ErrorBoundary fallbackMessage="Erro ao carregar o Painel do Usuário">
            <UserDashboard
              language={language}
              currentUser={currentUser}
              onOpenPricing={() => setActiveTab("pricing")}
              onSelectToolTab={() => setActiveTab("tools")}
            />
          </ErrorBoundary>
        )}

        {activeTab === "admin" && currentUser?.role === "admin" && (
          <ErrorBoundary fallbackMessage="Erro ao carregar o Painel do Administrador">
            <AdminPanel language={language} />
          </ErrorBoundary>
        )}
      </main>

      {/* Floating Chat Widget */}
      <LiveChatWidget />

      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal
          language={language}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {pixModalData.open && (
        <PixPaymentModal
          language={language}
          selectedPlan={pixModalData.plan}
          billingCycle={pixModalData.cycle}
          userEmail={currentUser?.email || "cliente@empresa.com"}
          onClose={() => setPixModalData((prev) => ({ ...prev, open: false }))}
          onSuccess={handlePixSuccess}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/10 text-slate-400 text-xs py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white">PROFIT <span className="text-cyan-400">AI</span> HUB</span>
              <span className="text-slate-500">— {getTranslation(language, "tagline")}</span>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <button onClick={() => setActiveTab("landing")} className="hover:text-cyan-400 transition-colors">
                Início
              </button>
              <button onClick={() => setActiveTab("tools")} className="hover:text-cyan-400 transition-colors">
                Ferramentas
              </button>
              <button onClick={() => setActiveTab("marketplace")} className="hover:text-cyan-400 transition-colors">
                Marketplace
              </button>
              <button onClick={() => setActiveTab("pricing")} className="hover:text-cyan-400 transition-colors">
                Planos & PIX
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p className="text-slate-500">{getTranslation(language, "copyright")}</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                {getTranslation(language, "security")} • Pagamento via Mercado Pago PIX
              </p>
              <div className="flex items-center gap-2 ml-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span className="text-[10px] text-white font-bold uppercase tracking-tight">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
