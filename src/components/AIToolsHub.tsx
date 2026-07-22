import React, { useState } from "react";
import { Language, AITool, User } from "../types";
import { AI_TOOLS_DATA } from "../data/tools";
import { getTranslation } from "../i18n/translations";
import {
  Search,
  Sparkles,
  Zap,
  Copy,
  CheckCircle2,
  FileText,
  DollarSign,
  Mail,
  Layout,
  Megaphone,
  Video,
  Briefcase,
  Code,
  Globe,
  Calculator,
  TrendingUp,
  ShieldCheck,
  Bot,
  Send,
  RotateCcw,
  Clock,
  ChevronRight,
  Star,
  Layers
} from "lucide-react";

interface AIToolsHubProps {
  language: Language;
  currentUser: User | null;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
}

export const AIToolsHub: React.FC<AIToolsHubProps> = ({
  language,
  currentUser,
  onOpenPricing,
  onOpenAuth,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<AITool | null>(AI_TOOLS_DATA[0]);
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number>(0);
  const [history, setHistory] = useState<{ toolName: string; text: string; date: string }[]>([]);

  // AI Chat Assistant Mode
  const [isChatMode, setIsChatMode] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("CMO Specialist");
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "ai"; text: string; time: string }[]
  >([
    {
      sender: "ai",
      text: "Olá! Sou seu Diretor Executivo de IA (CMO & Strategist). Como posso ajudar seu negócio a escalar hoje?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Icon mapping helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return <FileText className="w-5 h-5" />;
      case "DollarSign": return <DollarSign className="w-5 h-5" />;
      case "Mail": return <Mail className="w-5 h-5" />;
      case "Layout": return <Layout className="w-5 h-5" />;
      case "Megaphone": return <Megaphone className="w-5 h-5" />;
      case "Video": return <Video className="w-5 h-5" />;
      case "Briefcase": return <Briefcase className="w-5 h-5" />;
      case "Code": return <Code className="w-5 h-5" />;
      case "Globe": return <Globe className="w-5 h-5" />;
      case "Calculator": return <Calculator className="w-5 h-5" />;
      case "TrendingUp": return <TrendingUp className="w-5 h-5" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  // Filter tools
  const filteredTools = AI_TOOLS_DATA.filter((tool) => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    const name = tool.name[language] || tool.name["pt-BR"];
    const desc = tool.description[language] || tool.description["pt-BR"];
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInputChange = (id: string, value: string) => {
    setFormInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedOutput("");

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: selectedTool.id,
          toolName: selectedTool.name[language] || selectedTool.name["pt-BR"],
          inputs: formInputs,
          language,
          systemPrompt: selectedTool.systemPrompt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedOutput(data.result);
        setTokensUsed(data.tokensUsed || 350);
        setHistory((prev) => [
          {
            toolName: selectedTool.name[language] || selectedTool.name["pt-BR"],
            text: data.result.substring(0, 80) + "...",
            date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ]);
      } else {
        setGeneratedOutput(`Erro: ${data.error || "Falha na geração com IA."}`);
      }
    } catch (err: any) {
      setGeneratedOutput(`Erro de conexão: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput("");

    const newMsgs = [
      ...chatMessages,
      {
        sender: "user" as const,
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setChatMessages(newMsgs);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs,
          persona: selectedPersona,
          language,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> 100+ Ferramentas de IA Ativas
            </span>
            <span className="text-xs text-slate-400">• Gemini 3.6 Flash Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            PROFIT AI Business Toolkit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Selecione uma ferramenta abaixo ou converse com os Mentores Virtuais C-Level.
          </p>
        </div>

        {/* Toggle Mode Button */}
        <div className="flex items-center gap-2 bg-[#050505] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setIsChatMode(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              !isChatMode
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Ferramentas (100+)
          </button>
          <button
            onClick={() => setIsChatMode(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isChatMode
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4" />
            Chat Mentor IA
          </button>
        </div>
      </div>

      {isChatMode ? (
        /* AI CHAT ASSISTANT MODE */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Persona Selection */}
          <div className="lg:col-span-1 bg-[#0A0A0A] rounded-3xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              Selecione o Mentor Executivo
            </h3>

            {[
              { id: "CMO Specialist", title: "Diretor de Marketing (CMO)", role: "Growth & Tráfego" },
              { id: "Copywriter Master", title: "Head de Redação (Copy)", role: "Conversão & VSL" },
              { id: "Legal Advisor", title: "Consultor Jurídico & Termos", role: "Contratos & LGPD" },
              { id: "Startup CTO", title: "Diretor de Tecnologia (CTO)", role: "Arquitetura & SaaS" },
            ].map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedPersona === persona.id
                    ? "bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                    : "bg-[#050505] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-xs text-white">{persona.title}</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">{persona.role}</div>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 bg-[#0A0A0A] rounded-3xl p-6 border border-white/10 flex flex-col h-[520px]">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">{selectedPersona}</h4>
                <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  Online • Respondendo via Gemini 3.6 Flash
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs space-y-1 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium rounded-br-none"
                        : "bg-[#050505] border border-white/10 text-slate-200 rounded-bl-none whitespace-pre-line"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] text-right mt-1 ${
                        msg.sender === "user" ? "text-cyan-100/70" : "text-slate-500"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#050505] border border-white/10 p-3 rounded-2xl text-xs text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                    O Mentor está digitando a melhor estratégia...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Digite sua dúvida de negócios..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isChatLoading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center gap-1 text-xs shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* STANDARD 100+ AI TOOLS WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR: Search & Tool Catalog */}
          <div className="lg:col-span-5 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={getTranslation(language, "searchTools")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: getTranslation(language, "allCategories") },
                { id: "Writing", label: getTranslation(language, "catWriting") },
                { id: "Ads", label: getTranslation(language, "catAds") },
                { id: "Business", label: getTranslation(language, "catBusiness") },
                { id: "Utilities", label: getTranslation(language, "catUtilities") },
                { id: "Assistants", label: getTranslation(language, "catAssistants") },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                      : "bg-[#0A0A0A] text-slate-400 hover:text-white border border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tools List */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    setSelectedTool(tool);
                    setFormInputs({});
                    setGeneratedOutput("");
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTool?.id === tool.id
                      ? "bg-[#0A0A0A] border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                      : "bg-[#0A0A0A]/60 border-white/10 hover:border-white/20 hover:bg-[#0A0A0A]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedTool?.id === tool.id
                          ? "bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-bold shadow-md shadow-cyan-500/20"
                          : "bg-[#050505] text-cyan-400 border border-white/10"
                      }`}
                    >
                      {renderIcon(tool.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">
                          {tool.name[language] || tool.name["pt-BR"]}
                        </h4>
                        {tool.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {tool.description[language] || tool.description["pt-BR"]}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT MAIN WORKSPACE: Inputs & Output */}
          <div className="lg:col-span-7 space-y-6">
            {selectedTool && (
              <div className="bg-[#0A0A0A] rounded-3xl p-6 border border-white/10 space-y-6">
                {/* Selected Tool Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    {renderIcon(selectedTool.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      {selectedTool.name[language] || selectedTool.name["pt-BR"]}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedTool.description[language] || selectedTool.description["pt-BR"]}
                    </p>
                  </div>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleGenerate} className="space-y-4">
                  {selectedTool.inputs.map((input) => (
                    <div key={input.id}>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {input.label[language] || input.label["pt-BR"]}
                      </label>

                      {input.type === "textarea" ? (
                        <textarea
                          rows={3}
                          placeholder={
                            input.placeholder?.[language] ||
                            input.placeholder?.["pt-BR"] ||
                            "Digite as informações..."
                          }
                          value={formInputs[input.id] || ""}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      ) : input.type === "select" ? (
                        <select
                          value={formInputs[input.id] || input.options?.[0]?.value || ""}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        >
                          {input.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label[language] || opt.label["pt-BR"]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={input.type}
                          placeholder={
                            input.placeholder?.[language] ||
                            input.placeholder?.["pt-BR"] ||
                            "Digite..."
                          }
                          value={formInputs[input.id] || ""}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3.5 rounded-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-white" />
                        {getTranslation(language, "generating")}
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        {getTranslation(language, "generateBtn")}
                      </>
                    )}
                  </button>
                </form>

                {/* AI Generated Output Display */}
                {generatedOutput && (
                  <div className="pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        <h4 className="text-xs font-bold text-white">
                          {getTranslation(language, "outputTitle")}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          (~{tokensUsed} Créditos Utilizados)
                        </span>
                      </div>

                      <button
                        onClick={handleCopyOutput}
                        className="px-3 py-1.5 rounded-lg bg-[#050505] border border-white/10 hover:border-white/20 text-xs text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            {getTranslation(language, "copied")}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            {getTranslation(language, "copyOutput")}
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#050505] p-4 rounded-2xl border border-white/10 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                      {generatedOutput}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
