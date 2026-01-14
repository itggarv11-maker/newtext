import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * FIX: Explicitly extending React.Component<Props, State> ensures that 'props' and 'state' 
 * are correctly typed and recognized by the TypeScript compiler.
 */
class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Explicitly declaring the 'state' property resolves "Property 'state' does not exist on type 'ErrorBoundary'".
  public override state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
    // Removed direct state assignment in constructor to use the property initialization above.
  }

  // Lifecycle method to update state when an error occurs in children components.
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('STUBRO CRITICAL FAILURE:', error, errorInfo);
  }

  public override render() {
    // FIX: Using 'this.state.hasError' now correctly resolves through the generic State interface.
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#010208] flex items-center justify-center p-8 text-center">
          <div className="max-w-md p-10 glass-card rounded-[2.5rem] border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">NEURAL LINK BROKEN</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              The neural interface encountered a logic paradox. Resetting core systems might restore connectivity.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-violet-500 transition-all active:scale-95 shadow-lg shadow-violet-600/30"
            >
              Restart Core
            </button>
            <p className="mt-6 text-[8px] font-mono text-slate-700 uppercase tracking-widest">
              Err_Trace: {this.state.error?.message || "Unknown Logic Failure"}
            </p>
          </div>
        </div>
      );
    }

    // FIX: Using 'this.props.children' now correctly resolves through the generic Props interface.
    return this.props.children;
  }
}

export default ErrorBoundary;