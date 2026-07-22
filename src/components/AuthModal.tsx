import React, { useState } from "react";
import { Language, User } from "../types";
import { getTranslation } from "../i18n/translations";
import { X, Mail, Lock, User as UserIcon, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  language: Language;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  language,
  onClose,
  onLoginSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [emailVerifiedNotice, setEmailVerifiedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      setEmailVerifiedNotice(true);
      setTimeout(() => {
        const newUser: User = {
          id: "USR-" + Math.floor(10000 + Math.random() * 90000),
          name: name || "Novo Empreendedor",
          email: email || "usuario@empresa.com",
          role: "user",
          plan: "starter",
          billingCycle: "monthly",
          creditsUsed: 12,
          creditsLimit: 1000,
          isTwoFactorEnabled: false,
          emailVerified: true,
          referralCode: "PROFIT-" + Math.floor(1000 + Math.random() * 9000),
          affiliateEarnings: 0,
          joinedAt: new Date().toISOString(),
        };
        onLoginSuccess(newUser);
      }, 1500);
    } else {
      // Login flow
      if (!showTwoFactor) {
        setShowTwoFactor(true);
        return;
      }
      // Demo login
      const loggedUser: User = {
        id: "USR-77821",
        name: email.split("@")[0] || "SaaS Founder",
        email: email || "founder@profitai.com",
        role: email.includes("admin") ? "admin" : "user",
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
      onLoginSuccess(loggedUser);
    }
  };

  const handleSocialLogin = (provider: "Google" | "Facebook") => {
    const socialUser: User = {
      id: `USR-${provider}-` + Math.floor(1000 + Math.random() * 9000),
      name: `${provider} Demo User`,
      email: `user.${provider.toLowerCase()}@profitai.com`,
      role: "user",
      plan: "professional",
      billingCycle: "monthly",
      creditsUsed: 50,
      creditsLimit: 5000,
      isTwoFactorEnabled: false,
      emailVerified: true,
      referralCode: "PROFIT-SOC",
      affiliateEarnings: 0,
      joinedAt: new Date().toISOString(),
    };
    onLoginSuccess(socialUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {isRegister
              ? getTranslation(language, "registerTitle")
              : getTranslation(language, "loginTitle")}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            PROFIT AI HUB • Access 100+ AI Tools
          </p>
        </div>

        {emailVerifiedNotice ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-cyan-400">
              Conta criada com sucesso!
            </h4>
            <p className="text-xs text-slate-300">
              {getTranslation(language, "verifyEmailNotice")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {getTranslation(language, "nameLabel")}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {getTranslation(language, "emailLabel")}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {getTranslation(language, "passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {!isRegister && showTwoFactor && (
              <div className="animate-fadeIn">
                <label className="text-xs font-semibold text-cyan-400 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  {getTranslation(language, "twoFactorCode")}
                </label>
                <input
                  type="text"
                  placeholder="123 456"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full bg-[#050505] border border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-cyan-300 text-center font-mono tracking-widest focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all text-xs"
            >
              {isRegister
                ? getTranslation(language, "navRegister")
                : showTwoFactor
                ? "Confirmar 2FA e Entrar"
                : getTranslation(language, "navLogin")}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-3 bg-[#0A0A0A] text-[10px] text-slate-500 uppercase font-semibold">
                {getTranslation(language, "orContinueWith")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="py-2.5 rounded-xl bg-[#050505] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="py-2.5 rounded-xl bg-[#050505] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-cyan-400 hover:underline"
              >
                {isRegister
                  ? getTranslation(language, "alreadyHaveAccount")
                  : getTranslation(language, "dontHaveAccount")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
