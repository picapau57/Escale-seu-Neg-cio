import React, { useState } from "react";
import { Language, Plan } from "../types";
import { PLANS_DATA } from "../data/plans";
import { getTranslation } from "../i18n/translations";
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight } from "lucide-react";

interface PricingSectionProps {
  language: Language;
  onSelectPlan: (plan: Plan, cycle: "monthly" | "annual") => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  language,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-white">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.1)]">
          {getTranslation(language, "pricingTitle")}
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {getTranslation(language, "pricingSubtitle")}
        </h2>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-cyan-400" : "text-slate-400"}`}>
            {getTranslation(language, "monthly")}
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
            }
            className="relative w-14 h-8 bg-[#0A0A0A] border border-white/10 rounded-full p-1 transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-md transform transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${billingCycle === "annual" ? "text-cyan-400" : "text-slate-400"}`}>
              {getTranslation(language, "annual")}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {getTranslation(language, "saveBadge")}
            </span>
          </div>
        </div>
      </div>

      {/* Plans Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {PLANS_DATA.map((plan) => {
          const price =
            billingCycle === "monthly"
              ? plan.priceMonthlyBRL
              : plan.priceAnnualBRL;

          return (
            <div
              key={plan.id}
              className={`relative bg-[#0A0A0A] rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-xl ${
                plan.popular
                  ? "border-cyan-500 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-indigo-950/30 shadow-2xl shadow-cyan-500/10 ring-2 ring-cyan-500/50 scale-105 z-10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-cyan-500 to-indigo-600 text-white uppercase tracking-wider shadow-md">
                  MAIS POPULAR
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">{plan.nameKey}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {plan.creditsLimit.toLocaleString()} Créditos / Mês
                  </p>
                </div>

                <div className="py-2 border-y border-white/5">
                  <span className="text-3xl font-black text-white">
                    R$ {price}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> /mês</span>
                  {billingCycle === "annual" && plan.priceAnnualBRL > 0 && (
                    <span className="block text-[10px] text-cyan-400 mt-1 font-semibold">
                      Faturado R$ {price * 12}/ano
                    </span>
                  )}
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onSelectPlan(plan, billingCycle)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.id === "free" ? "Usar Plano Grátis" : "Assinar com PIX"}
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
