import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleClearAndReload = this.handleClearAndReload.bind(this);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public handleReset() {
    this.setState({ hasError: false, error: undefined }, () => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    });
  }

  public handleClearAndReload() {
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[350px] w-full p-8 rounded-3xl bg-[#0A0A0A] border border-red-500/30 text-white flex flex-col items-center justify-center text-center space-y-4 my-8 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-lg font-bold text-white">
              {this.props.fallbackMessage || "Ocorreu uma oscilação na exibição deste componente"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O sistema protegeu a interface contra falhas fatais. Clique no botão abaixo para recarregar a aplicação.
            </p>
            {this.state.error?.message && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-[11px] font-mono text-red-300 break-words mt-2 max-w-full overflow-hidden">
                {this.state.error.message}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs transition-all flex items-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar Aplicação
            </button>

            <button
              onClick={this.handleClearAndReload}
              className="px-4 py-2.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              Limpar Cache e Reiniciar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
