import React, { useState } from "react";
import { Language, SupportTicket, Coupon, AdminMetrics } from "../types";
import { getTranslation } from "../i18n/translations";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Globe,
  Smartphone,
  Key,
  Tag,
  Store,
  MessageSquare,
  Send,
  Save,
  CheckCircle2,
  Clock,
  RefreshCw,
  Lock,
  PieChart as ChartIcon
} from "lucide-react";

interface AdminPanelProps {
  language: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "plans" | "coupons" | "tickets" | "marketing">("metrics");

  // Mercado Pago Keys state
  const [mpAccessToken, setMpAccessToken] = useState("");
  const [mpPublicKey, setMpPublicKey] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<{ status: "idle" | "loading" | "success" | "error"; message?: string }>({ status: "idle" });

  // Real-time Metrics state
  const [metricsMode, setMetricsMode] = useState<"sample" | "realtime">("sample");
  const [liveMetrics, setLiveMetrics] = useState({
    today: 7100,
    weekly: 44750,
    monthly: 171000,
    yearly: 2050000,
    liveUsers: 1482,
    approvedTxCount: 0,
    totalTxCount: 0,
  });
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (data.success) {
        setMetricsMode(data.mode);
        if (data.metrics) setLiveMetrics(data.metrics);
        if (data.transactions) setLiveTransactions(data.transactions);
      }
    } catch (err) {
      console.warn("Could not fetch metrics:", err);
    }
  };

  // Load saved keys & metrics on mount & poll every 5s
  React.useEffect(() => {
    async function loadKeys() {
      try {
        const local = localStorage.getItem("profit_ai_mp_keys");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.mpAccessToken) setMpAccessToken(parsed.mpAccessToken);
          if (parsed.mpPublicKey) setMpPublicKey(parsed.mpPublicKey);
        }

        const res = await fetch("/api/admin/mercadopago-keys");
        const data = await res.json();
        if (data.success) {
          if (data.mpAccessToken) setMpAccessToken(data.mpAccessToken);
          if (data.mpPublicKey) setMpPublicKey(data.mpPublicKey);
        }
      } catch (err) {
        console.warn("Could not load MP keys from server:", err);
      }
    }
    loadKeys();
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMetricsMode = async (sampleMode: boolean) => {
    // Immediate optimistic UI update on click
    const newMode = sampleMode ? "sample" : "realtime";
    setMetricsMode(newMode);

    if (!sampleMode) {
      const approved = liveTransactions.filter((t) => t.status === "approved");
      const realRev = approved.reduce((sum, t) => sum + Number(t.amountBRL || 0), 0);
      setLiveMetrics({
        today: realRev,
        weekly: realRev,
        monthly: realRev,
        yearly: realRev,
        liveUsers: Math.max(1, approved.length),
        approvedTxCount: approved.length,
        totalTxCount: liveTransactions.length,
      });
    } else {
      setLiveMetrics({
        today: 7100,
        weekly: 44750,
        monthly: 171000,
        yearly: 2050000,
        liveUsers: 1482,
        approvedTxCount: 0,
        totalTxCount: liveTransactions.length,
      });
    }

    try {
      const res = await fetch("/api/admin/metrics/reset-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sampleMode }),
      });
      const data = await res.json();
      if (data.success) {
        setMetricsMode(data.mode);
        if (data.metrics) setLiveMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Error toggling metrics mode:", err);
    }
  };

  const handleClearTransactions = async () => {
    if (!confirm("Deseja realmente zerar todo o histórico de transações de teste?")) return;
    try {
      await fetch("/api/admin/metrics/clear-transactions", { method: "POST" });
      fetchMetrics();
    } catch (err) {
      console.error("Error clearing transactions:", err);
    }
  };

  const handleSaveMpKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLoading(true);
    setTestStatus({ status: "idle" });

    try {
      // 1. Save to local storage
      localStorage.setItem("profit_ai_mp_keys", JSON.stringify({ mpAccessToken, mpPublicKey }));

      // 2. Save to server memory / backend API
      const res = await fetch("/api/admin/mercadopago-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mpAccessToken, mpPublicKey }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 4000);
      }
    } catch (err) {
      console.error("Error saving keys:", err);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!mpAccessToken) return;
    setTestStatus({ status: "loading" });

    try {
      const res = await fetch(`https://api.mercadopago.com/v1/payment_methods?access_token=${mpAccessToken}`);
      if (res.ok) {
        setTestStatus({ status: "success", message: "🟢 Conexão com Mercado Pago confirmada e ativa!" });
      } else {
        const errData = await res.json();
        setTestStatus({ status: "error", message: `⚠️ Token recusado pelo Mercado Pago: ${errData.message || "Chave inválida"}` });
      }
    } catch (err: any) {
      setTestStatus({ status: "error", message: "⚠️ Não foi possível validar o token junto ao Mercado Pago." });
    }
  };
  const revenueData = [
    { day: "Seg", revenue: 4200 },
    { day: "Ter", revenue: 5800 },
    { day: "Qua", revenue: 7100 },
    { day: "Qui", revenue: 6400 },
    { day: "Sex", revenue: 8900 },
    { day: "Sáb", revenue: 10200 },
    { day: "Dom", revenue: 12500 },
  ];

  const planDistribution = [
    { name: "Starter", value: 450, color: "#38bdf8" },
    { name: "Professional", value: 1200, color: "#f59e0b" },
    { name: "Business", value: 310, color: "#10b981" },
    { name: "Enterprise", value: 85, color: "#8b5cf6" },
  ];

  const sampleUsers = [
    { id: "USR-01", name: "Gabriel Santos", email: "gabriel@agencia.com", plan: "professional", date: "2026-07-21" },
    { id: "USR-02", name: "Mariana Costa", email: "mariana@saas.io", plan: "business", date: "2026-07-20" },
    { id: "USR-03", name: "Rodrigo Lima", email: "rodrigo@tech.br", plan: "enterprise", date: "2026-07-19" },
    { id: "USR-04", name: "Beatriz Oliveira", email: "beatriz@marketing.com", plan: "starter", date: "2026-07-18" },
  ];

  const sampleCoupons: Coupon[] = [
    { code: "LANCAMENTO50", discountPercent: 50, validUntil: "2026-08-31", usageCount: 412, maxUsage: 1000, active: true },
    { code: "PROFIT20", discountPercent: 20, validUntil: "2026-12-31", usageCount: 89, maxUsage: 500, active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Top Admin Banner */}
      <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            <Shield className="w-3.5 h-3.5 text-cyan-400" /> Founder & Executive Admin
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            PROFIT AI HUB Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoramento ao vivo de faturamento, usuários online, tráfego e Mercado Pago.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#050505] p-2 px-4 rounded-2xl border border-white/10 relative z-10">
          <div className="text-right px-2">
            <span className="block text-[10px] text-slate-500">Usuários Online:</span>
            <span className="text-lg font-black text-cyan-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              {liveMetrics.liveUsers.toLocaleString("pt-BR")} Ao Vivo
            </span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/10 shadow-xl">
        {[
          { id: "metrics", label: getTranslation(language, "tabMetrics") },
          { id: "users", label: getTranslation(language, "tabUsers") },
          { id: "plans", label: getTranslation(language, "tabPlans") },
          { id: "coupons", label: getTranslation(language, "tabCoupons") },
          { id: "tickets", label: getTranslation(language, "tabTickets") },
          { id: "marketing", label: getTranslation(language, "tabMarketing") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* METRICS & ANALYTICS TAB */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          {/* Real-time Mode Control Bar */}
          <div className="bg-[#0A0A0A] p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  metricsMode === "realtime" ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" : "bg-amber-400"
                }`}
              ></div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {metricsMode === "realtime" ? "🟢 Modo: TEMPO REAL (Faturamento Real Apenas)" : "💡 Modo: DEMO / EXEMPLO (Simulação)"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {metricsMode === "realtime"
                    ? "Exibindo faturamento e pagamentos reais processados via PIX e Mercado Pago."
                    : "Os valores exibidos abaixo são um exemplo ilustrativo para demonstração do painel."}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {metricsMode === "sample" ? (
                <button
                  onClick={() => handleToggleMetricsMode(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Zerar Valores e Ver em Tempo Real (R$ 0,00)
                </button>
              ) : (
                <button
                  onClick={() => handleToggleMetricsMode(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors"
                >
                  Restaurar Exemplo Ilustrativo
                </button>
              )}

              {liveTransactions.length > 0 && (
                <button
                  onClick={handleClearTransactions}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-colors"
                >
                  Zerar Transações
                </button>
              )}
            </div>
          </div>

          {/* Revenue Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold">{getTranslation(language, "todayRev")}</span>
              <div className="text-2xl font-black text-cyan-400">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(liveMetrics.today)}
              </div>
              <span className="text-[10px] text-cyan-400/80 font-semibold">
                {metricsMode === "realtime" ? `${liveMetrics.approvedTxCount} Vendas Aprovadas` : "+18.4% vs ontem"}
              </span>
            </div>

            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold">{getTranslation(language, "weeklyRev")}</span>
              <div className="text-2xl font-black text-white">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(liveMetrics.weekly)}
              </div>
              <span className="text-[10px] text-slate-500">Semana Atual</span>
            </div>

            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold">{getTranslation(language, "monthlyRev")}</span>
              <div className="text-2xl font-black text-cyan-400">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(liveMetrics.monthly)}
              </div>
              <span className="text-[10px] text-cyan-400/80 font-semibold">MRR Ativo</span>
            </div>

            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-1 shadow-xl">
              <span className="text-xs text-slate-400 font-bold">{getTranslation(language, "annualRev")}</span>
              <div className="text-2xl font-black text-cyan-400">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(liveMetrics.yearly)}
              </div>
              <span className="text-[10px] text-slate-500">ARR Projetado</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Area Chart */}
            <div className="lg:col-span-2 bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Faturamento Real-Time (Últimos 7 Dias)
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Distribution Pie Chart */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ChartIcon className="w-4 h-4 text-cyan-400" />
                Distribuição de Assinantes
              </h3>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planDistribution} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                      {planDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#334155", borderRadius: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {planDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 font-medium">{item.name}:</span>
                    <span className="font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Transactions Feed */}
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Histórico de Transações do Servidor (Tempo Real)
              </h3>
              <span className="text-xs text-slate-400">
                {liveTransactions.length} transação(ões) registrada(s)
              </span>
            </div>

            {liveTransactions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-xs text-slate-400">
                  Nenhuma transação registrada no momento. Faça um teste gerando ou pagando um PIX nos planos ou no mercado digital!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#050505] text-slate-400 font-semibold border-b border-white/10">
                    <tr>
                      <th className="p-3">ID Transação</th>
                      <th className="p-3">Plano/Produto</th>
                      <th className="p-3">Email Cliente</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Gateway</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {liveTransactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-cyan-400 font-bold">{tx.id}</td>
                        <td className="p-3 font-semibold text-white">{tx.planName || "Produto Digital"}</td>
                        <td className="p-3 text-slate-300">{tx.userEmail || "cliente@profitaihub.com"}</td>
                        <td className="p-3 font-bold text-white">
                          R$ {Number(tx.amountBRL || 0).toFixed(2)}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {tx.isRealMpTransaction ? "🟢 Mercado Pago API" : "Simulador Gateway"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              tx.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {tx.status === "approved" ? "Aprovado / Pago" : "Pendente PIX"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MERCADO PAGO & PLANS TAB */}
      {activeTab === "plans" && (
        <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {getTranslation(language, "mercadoPagoKeysTitle")}
              </h3>
              <p className="text-xs text-slate-400">
                Insira suas chaves de API oficiais do Mercado Pago para recebimento PIX automático.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveMpKeys} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {getTranslation(language, "accessToken")}
              </label>
              <input
                type="text"
                required
                value={mpAccessToken}
                onChange={(e) => setMpAccessToken(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {getTranslation(language, "publicKey")}
              </label>
              <input
                type="text"
                required
                value={mpPublicKey}
                onChange={(e) => setMpPublicKey(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={savingLoading}
                className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition-all flex items-center gap-2 text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingLoading
                  ? "Salvando..."
                  : savedNotice
                  ? "✅ Salvo em Tempo Real!"
                  : getTranslation(language, "saveCredentials")}
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={!mpAccessToken || testStatus.status === "loading"}
                className="px-4 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-2 text-xs disabled:opacity-40"
              >
                {testStatus.status === "loading" ? "Testando..." : "Testar Conexão MP"}
              </button>
            </div>

            {savedNotice && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Credenciais do Mercado Pago salvas com sucesso no servidor e navegador!</span>
              </div>
            )}

            {testStatus.message && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                  testStatus.status === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border border-red-500/30 text-red-300"
                }`}
              >
                <span>{testStatus.message}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Gerenciamento de Usuários Registrados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#050505] text-slate-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="p-3 rounded-l-xl">ID</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Plano</th>
                  <th className="p-3 rounded-r-xl">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sampleUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="p-3 font-mono text-slate-400">{user.id}</td>
                    <td className="p-3 font-bold text-white">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 font-bold text-cyan-400 capitalize">{user.plan}</td>
                    <td className="p-3">
                      <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-semibold">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COUPONS TAB */}
      {activeTab === "coupons" && (
        <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Cupons de Desconto & Ofertas Relâmpago</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleCoupons.map((c) => (
              <div key={c.code} className="p-4 rounded-2xl bg-[#050505] border border-white/10 flex justify-between items-center">
                <div>
                  <span className="font-mono text-cyan-400 font-extrabold text-sm">{c.code}</span>
                  <span className="block text-xs text-slate-400">{c.discountPercent}% de Desconto</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {c.usageCount} / {c.maxUsage} Usos
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
