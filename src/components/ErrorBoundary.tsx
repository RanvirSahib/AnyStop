import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AnyStop Uncaught Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear potentially corrupted reports or state while preserving user login if possible
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleHardReset = () => {
    try {
      localStorage.removeItem('anystop_spotted_reports');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF4ED] dark:bg-[#15122B] text-[#231F3D] dark:text-[#F6F1FF] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#201B40] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E2D4C6] dark:border-[#383060] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Transit Radar Recovered
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6585] dark:text-[#A9A2C8] leading-relaxed">
                An unexpected input or network interruption occurred. We've safely guarded your session so you won't lose your place.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] font-mono text-left text-rose-600 dark:text-rose-400 break-words max-h-24 overflow-y-auto border border-black/10 dark:border-white/10">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF5A4E] to-[#FFB020] text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
              <button
                type="button"
                onClick={this.handleHardReset}
                className="px-4 h-11 rounded-xl border border-[#E2D4C6] dark:border-[#383060] text-[#6B6585] dark:text-[#A9A2C8] font-bold text-xs hover:text-[#231F3D] dark:hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Clears corrupted search cache and restarts fresh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

