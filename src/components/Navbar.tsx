import React from "react";
import { Language, User } from "../types";
import { getTranslation } from "../i18n/translations";
import { Sparkles, Globe, User as UserIcon, Shield, Zap, LogOut, ChevronDown, LayoutDashboard, Store, DollarSign, HelpCircle, Key } from "lucide-react";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
    { code: "en", label: "English (US)", flag: "🇺🇸" },
    { code: "es", label: "Español (ES)", flag: "🇪🇸" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0A0A]/90 border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab("landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-white">
              PROFIT <span className="text-cyan-400">AI</span> HUB
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-cyan-400 font-semibold border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              PRO VERSION
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab("tools")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "tools"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {getTranslation(language, "navTools")}
          </button>

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "marketplace"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            {getTranslation(language, "navMarketplace")}
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "pricing"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            {getTranslation(language, "navPricing")}
          </button>

          <button
            onClick={() => setActiveTab("affiliates")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "affiliates"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {getTranslation(language, "navAffiliates")}
          </button>

          {currentUser && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {getTranslation(language, "navDashboard")}
            </button>
          )}

          {currentUser?.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-indigo-600 text-white shadow-md ${
                activeTab === "admin" ? "ring-2 ring-cyan-400" : "opacity-90 hover:opacity-100"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {getTranslation(language, "navAdmin")}
            </button>
          )}
        </nav>

        {/* Right Section: Language + Auth */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:border-white/20 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span className="font-semibold uppercase text-cyan-400">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-1 z-50 backdrop-blur-xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                      language === lang.code
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth Info / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white truncate max-w-[100px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-bold capitalize">
                    {currentUser.plan} Plan
                  </p>
                </div>
              </button>

              <button
                onClick={onLogout}
                title={getTranslation(language, "navLogout")}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                {getTranslation(language, "navLogin")}
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]"
              >
                {getTranslation(language, "navRegister")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
