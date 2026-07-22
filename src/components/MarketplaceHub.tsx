import React, { useState } from "react";
import { Language, MarketplaceItem, User } from "../types";
import { MARKETPLACE_ITEMS } from "../data/marketplace";
import { getTranslation } from "../i18n/translations";
import {
  Store,
  Search,
  Star,
  Download,
  PlusCircle,
  X,
  CheckCircle2,
  Tag,
  DollarSign,
  Sparkles,
  FileText,
  Lock,
  ExternalLink
} from "lucide-react";

interface MarketplaceHubProps {
  language: Language;
  currentUser: User | null;
  onOpenPixCheckout: (item: { name: string; priceBRL: number }) => void;
  onOpenAuth: () => void;
}

export const MarketplaceHub: React.FC<MarketplaceHubProps> = ({
  language,
  currentUser,
  onOpenPixCheckout,
  onOpenAuth,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("47");
  const [newType, setNewType] = useState<MarketplaceItem["type"]>("prompt");
  const [listSuccess, setListSuccess] = useState(false);

  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    const title = item.title[language] || item.title["pt-BR"];
    const desc = item.description[language] || item.description["pt-BR"];
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setListSuccess(true);
    setTimeout(() => {
      setListSuccess(false);
      setIsListModalOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Header Banner */}
      <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              <Store className="w-3.5 h-3.5 text-cyan-400" /> Marketplace Digital VIP
            </span>
            <span className="text-xs text-slate-400">Comissão da Plataforma: 15%</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {getTranslation(language, "marketplaceTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            {getTranslation(language, "marketplaceSubtitle")}
          </p>
        </div>

        <button
          onClick={() => setIsListModalOpen(true)}
          className="px-5 py-3 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 text-xs shrink-0 relative z-10"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          {getTranslation(language, "sellItem")}
        </button>
      </div>

      {/* Controls: Search + Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por Prompts, Templates, eBooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: "all", label: getTranslation(language, "filterAll") },
            { id: "prompt", label: getTranslation(language, "filterPrompts") },
            { id: "template", label: getTranslation(language, "filterTemplates") },
            { id: "ebook", label: getTranslation(language, "filterEbooks") },
            { id: "marketing", label: getTranslation(language, "filterMarketing") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                  : "bg-[#0A0A0A] text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#0A0A0A] rounded-3xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all group flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Image & Badge */}
              <div className="relative h-44 overflow-hidden bg-[#050505]">
                <img
                  src={item.coverImage}
                  alt={item.title[language] || item.title["pt-BR"]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-cyan-500 to-indigo-600 text-white uppercase shadow-md">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#050505]/90 backdrop-blur-md text-slate-300 border border-white/10">
                  {item.fileFormat}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Por <strong className="text-white">{item.sellerName}</strong></span>
                  <div className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    <span>{item.rating}</span>
                    <span className="text-slate-500">({item.salesCount})</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                  {item.title[language] || item.title["pt-BR"]}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description[language] || item.description["pt-BR"]}
                </p>
              </div>
            </div>

            {/* Bottom Price & Buy */}
            <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Preço do Ativo:</span>
                <span className="text-lg font-black text-cyan-400">
                  R$ {item.priceBRL.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProduct(item)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() =>
                    onOpenPixCheckout({
                      name: item.title[language] || item.title["pt-BR"],
                      priceBRL: item.priceBRL,
                    })
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedProduct.coverImage}
                alt=""
                className="w-full sm:w-48 h-48 object-cover rounded-2xl border border-white/10"
              />
              <div className="space-y-3 flex-1">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {selectedProduct.type.toUpperCase()}
                </span>
                <h3 className="text-xl font-black text-white">
                  {selectedProduct.title[language] || selectedProduct.title["pt-BR"]}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedProduct.description[language] || selectedProduct.description["pt-BR"]}
                </p>

                <div className="pt-2 text-xs space-y-1 text-slate-400">
                  <div>Vendedor: <strong className="text-white">{selectedProduct.sellerName}</strong></div>
                  <div>Formato do Arquivo: <strong className="text-cyan-300">{selectedProduct.fileFormat}</strong></div>
                  <div>Avaliação: <strong className="text-cyan-400">⭐ {selectedProduct.rating} / 5.0</strong> ({selectedProduct.salesCount} vendas)</div>
                </div>
              </div>
            </div>

            {selectedProduct.contentPreview && (
              <div className="bg-[#050505] p-4 rounded-2xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Prévia do Ativo:
                </h4>
                <p className="text-xs text-slate-300 font-mono italic">
                  "{selectedProduct.contentPreview}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <span className="text-xs text-slate-400">Valor Total:</span>
                <p className="text-2xl font-black text-cyan-400">
                  R$ {selectedProduct.priceBRL.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => {
                  const p = selectedProduct;
                  setSelectedProduct(null);
                  onOpenPixCheckout({
                    name: p.title[language] || p.title["pt-BR"],
                    priceBRL: p.priceBRL,
                  });
                }}
                className="px-6 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/20 transition-all text-xs"
              >
                Comprar via PIX Instantâneo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELL PRODUCT MODAL */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6">
            <button
              onClick={() => setIsListModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white">
                {getTranslation(language, "listItemTitle")}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {getTranslation(language, "commissionNote")}
              </p>
            </div>

            {listSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Produto Cadastrado com Sucesso!</h4>
                <p className="text-xs text-slate-400">Seu ativo foi enviado para revisão e aprovação do Admin.</p>
              </div>
            ) : (
              <form onSubmit={handleListSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Título do Produto Digital
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pack 100 Prompts de Vendas em B2B"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Categoria do Produto
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="prompt">Prompts de IA</option>
                    <option value="template">Templates Notion / Figma</option>
                    <option value="ebook">eBook / Guia PDF</option>
                    <option value="marketing">Pack de Marketing / Copys</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Preço de Venda (R$)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Você receberá R$ {(Number(newPrice) * 0.85).toFixed(2)} por cada venda (85%).
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Descreva o que o comprador vai receber..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/20 transition-all text-xs"
                >
                  Enviar Produto para Aprovação
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
