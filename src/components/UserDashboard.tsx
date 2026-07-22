import React, { useState } from "react";
import { Language, User } from "../types";
import { getTranslation } from "../i18n/translations";
import {
  Zap,
  TrendingUp,
  Award,
  CreditCard,
  Copy,
  CheckCircle2,
  DollarSign,
  Share2,
  ArrowUpRight,
  Clock,
  Sparkles,
  Bot,
  ShieldCheck
} from "lucide-react";

interface UserDashboardProps {
  language: Language;
  currentUser: User;
  onOpenPricing: () => void;
  onSelectToolTab: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  language,
  currentUser,
  onOpenPricing,
  onSelectToolTab,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  const usagePercent = Math.min(
    100,
    Math.round((currentUser.creditsUsed / currentUser.creditsLimit) * 100)
  );

  const referralLink = `${window.location.origin}/?ref=${currentUser.referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Top Welcome Banner */}
      <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            Painel do Membro VIP
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {getTranslation(language, "welcomeUser")}, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {getTranslation(language, "dashboardSubtitle")}
          </p>
        </div>

        <button
          onClick={onOpenPricing}
          className="px-5 py-3 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 text-xs relative z-10"
        >
          <CreditCard className="w-4 h-4 text-white" />
          {getTranslation(language, "upgradePlan")}
        </button>
      </div>

      {/* Stats Cards - Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Credits Used */}
        <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">Créditos de IA</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {currentUser.creditsUsed}
            </span>
            <span className="text-xs text-slate-500">
              / {currentUser.creditsLimit}
            </span>
          </div>
          <div className="w-full bg-[#050505] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">{getTranslation(language, "currentPlan")}</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 capitalize">
            {currentUser.plan}
          </div>
          <p className="text-[11px] text-slate-400">
            Cobrança {currentUser.billingCycle} • Renovação Automática
          </p>
        </div>

        {/* Affiliate Earnings */}
        <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">Comissões de Afiliado</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            R$ {(currentUser.affiliateEarnings * 5).toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400">30% Comissão Recorrente PIX</p>
        </div>

        {/* Quick Launch */}
        <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-3 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">Acesso Rápido</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <button
            onClick={onSelectToolTab}
            className="w-full py-2.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-cyan-300 text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10"
          >
            Abrir 100+ Ferramentas
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Affiliate Program Section */}
      <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Programa de Indicação VIP
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              {getTranslation(language, "affiliateTitle")}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {getTranslation(language, "affiliateSubtitle")}
            </p>
          </div>

          <button
            onClick={handleRequestPayout}
            className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all text-xs shadow-md shadow-cyan-500/20"
          >
            {payoutRequested ? "Solicitação de Saque Enviada!" : getTranslation(language, "requestPayout")}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-300 truncate w-full sm:w-auto">
            {referralLink}
          </span>
          <button
            onClick={handleCopyReferral}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-cyan-500/20"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            {copiedLink ? "Link Copiado!" : "Copiar Link"}
          </button>
        </div>
      </div>
    </div>
  );
};
