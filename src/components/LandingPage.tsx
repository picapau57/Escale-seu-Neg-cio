import React from "react";
import { Language } from "../types";
import { getTranslation } from "../i18n/translations";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
  Store,
  DollarSign,
  Bot,
  Layers,
  ChevronDown,
  Users
} from "lucide-react";

interface LandingPageProps {
  language: Language;
  onExploreTools: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onExploreTools,
  onOpenPricing,
  onOpenAuth,
}) => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      q: "O que é o PROFIT AI HUB?",
      a: "É a plataforma de inteligência artificial de negócios mais completa do mercado, reunindo mais de 100 ferramentas de geração de texto, anúncios, estratégias, plano de negócios, Marketplace e mentores virtuais C-level em um só lugar.",
    },
    {
      q: "Como funciona o pagamento via PIX Mercado Pago?",
      a: "Você escolhe seu plano e o sistema gera instantaneamente um QR Code e um código PIX 'Copia e Cola'. Assim que você realiza o pagamento no app do seu banco, a assinatura é ativada em segundos.",
    },
    {
      q: "Posso vender meus próprios Prompts e Templates no Marketplace?",
      a: "Sim! Qualquer usuário com plano ativo pode cadastrar prompts, templates Notion, e-books e kits de marketing para venda, recebendo 85% do valor diretamente em sua conta.",
    },
    {
      q: "Quais idiomas são suportados?",
      a: "A plataforma suporta integralmente Português (Brasil), Inglês e Espanhol com alternância instantânea de idioma.",
    },
  ];

  return (
    <div className="space-y-20 text-white pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[400px] h-[250px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-400/20 text-xs text-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            <span>{getTranslation(language, "tagline")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
            {getTranslation(language, "heroTitle")}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {getTranslation(language, "heroSubtitle")}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-2xl shadow-cyan-500/25 transition-all text-sm transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white text-white" />
              {getTranslation(language, "getStarted")}
            </button>

            <button
              onClick={onExploreTools}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all text-sm flex items-center justify-center gap-2"
            >
              {getTranslation(language, "exploreTools")}
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Key Badges - Bento Grid Style */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            {[
              { icon: Zap, label: "100+ Ferramentas de IA", sub: "Textos, Ads, SEO & VSL" },
              { icon: ShieldCheck, label: "PIX Mercado Pago", sub: "Ativação em segundos" },
              { icon: Store, label: "Marketplace VIP", sub: "Compre e Venda Prompts" },
              { icon: Bot, label: "Mentores C-Level", sub: "CMO, Legal & CTO IA" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 space-y-1 shadow-lg"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                  <item.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-xs font-bold text-white">{item.label}</h4>
                <p className="text-[10px] text-slate-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS TICKER BAR */}
      <section className="bg-[#0A0A0A] border-y border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-white">45.000+</span>
            <span className="block text-xs text-slate-400 mt-1">Usuários Ativos</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-cyan-400">100+</span>
            <span className="block text-xs text-slate-400 mt-1">Ferramentas de IA</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-indigo-400">2.5M+</span>
            <span className="block text-xs text-slate-400 mt-1">Conteúdos Gerados</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-white">99.9%</span>
            <span className="block text-xs text-slate-400 mt-1">Satisfação dos Empreendedores</span>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Perguntas Frequentes (FAQ)</h2>
          <p className="text-xs text-slate-400">Tire suas dúvidas sobre a plataforma e o sistema de pagamento</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 text-sm font-bold text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-cyan-400 transform transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
