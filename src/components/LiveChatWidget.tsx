import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string; time: string }[]
  >([
    {
      sender: "bot",
      text: "Olá! Como posso ajudar você no PROFIT AI HUB hoje?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Obrigado por sua mensagem! Nossa equipe de atendimento e o assistente de IA estão prontos para ajudar. Você também pode testar as 100+ ferramentas no menu principal!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-96 animate-scaleUp text-white">
          {/* Chat Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Atendimento PROFIT AI</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Suporte Online
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                    m.sender === "user"
                      ? "bg-amber-500 text-slate-950 font-medium rounded-br-none"
                      : "bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] text-right ${
                      m.sender === "user" ? "text-slate-900/70" : "text-slate-500"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-2xl shadow-amber-500/40 flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <MessageSquare className="w-6 h-6 fill-slate-950" />
        </button>
      )}
    </div>
  );
};
