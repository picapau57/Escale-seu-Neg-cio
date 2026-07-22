import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Language, Plan } from "../types";
import { getTranslation } from "../i18n/translations";
import { X, Copy, CheckCircle2, ShieldCheck, QrCode, RefreshCw, FileText, Download, Sparkles, Clock } from "lucide-react";

interface PixPaymentModalProps {
  language: Language;
  selectedPlan: Plan;
  billingCycle: "monthly" | "annual";
  userEmail: string;
  onClose: () => void;
  onSuccess: (planId: Plan["id"]) => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  language,
  selectedPlan,
  billingCycle,
  userEmail,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [paymentApproved, setPaymentApproved] = useState(false);

  const amountBRL =
    billingCycle === "monthly"
      ? selectedPlan.priceMonthlyBRL
      : selectedPlan.priceAnnualBRL * 12;

  // Create PIX transaction on mount
  useEffect(() => {
    async function createPix() {
      try {
        setLoading(true);
        const res = await fetch("/api/payments/pix/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlan.id,
            planName: selectedPlan.nameKey,
            amountBRL,
            userEmail,
            billingCycle,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setTransaction(data.transaction);

          // Generate QR Code Data URL
          const url = await QRCode.toDataURL(data.transaction.pixCopyPaste, {
            width: 280,
            margin: 2,
            color: {
              dark: "#0f172a",
              light: "#ffffff",
            },
          });
          setQrCodeDataUrl(url);
        }
      } catch (err) {
        console.error("PIX Generation Error:", err);
      } finally {
        setLoading(false);
      }
    }

    createPix();
  }, [selectedPlan, billingCycle, amountBRL, userEmail]);

  // Expiration timer
  useEffect(() => {
    if (paymentApproved) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentApproved]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyPix = () => {
    if (!transaction) return;
    navigator.clipboard.writeText(transaction.pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = async () => {
    if (!transaction) return;
    try {
      const res = await fetch("/api/payments/pix/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transaction.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentApproved(true);
        setTimeout(() => {
          onSuccess(selectedPlan.id);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentApproved ? (
          <div className="text-center py-6 space-y-4 animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <CheckCircle2 className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-cyan-400">
              {getTranslation(language, "paymentApproved")}
            </h3>
            <p className="text-slate-300 text-sm">
              {getTranslation(language, "subscriptionActivated")}
            </p>

            <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Plano:</span>
                <span className="text-white font-bold">{selectedPlan.nameKey}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ciclo:</span>
                <span className="text-cyan-400 font-bold capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Valor Pago:</span>
                <span className="text-cyan-400 font-extrabold">
                  R$ {amountBRL.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transação Mercado Pago:</span>
                <span className="text-slate-300 font-mono">{transaction?.id}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onSuccess(selectedPlan.id)}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                Ir para o Painel e Usar Ferramentas
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Title & Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {getTranslation(language, "pixCheckoutTitle")}
                </h3>
                <p className="text-xs text-slate-400">
                  Mercado Pago Gateway • Processamento Instantâneo
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-300">
                  Gerando Código PIX e QR Code no Mercado Pago...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Plan Summary */}
                <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Total a pagar:</span>
                    <p className="text-2xl font-black text-cyan-400">
                      R$ {amountBRL.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Plano {selectedPlan.nameKey}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1 capitalize">
                      Cobrança {billingCycle}
                    </span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-2xl text-center shadow-xl max-w-[220px] mx-auto border-4 border-white/10">
                  {qrCodeDataUrl && (
                    <img
                      src={qrCodeDataUrl}
                      alt="Mercado Pago PIX QR Code"
                      className="w-full h-auto rounded-lg mx-auto"
                    />
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{getTranslation(language, "pixExpiration")}:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Copy Paste Code */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    {getTranslation(language, "copyPixCode")}:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={transaction?.pixCopyPaste || ""}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none select-all"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-cyan-500/20"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          {getTranslation(language, "copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    {getTranslation(language, "simulatePixApproval")}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Pagamento seguro processado via API Mercado Pago com protocolo SSL 256-bit
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
