import React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * FIX: Explicitly extending React.Component<Props, State> to ensure the base class is correctly 
 * recognized and that inherited members like 'this.props' and 'this.state' are typed.
 */
class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Properly initialize state as a class field to resolve ambiguity in the component's state management.
  state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
  }

  // Lifecycle method to update state when an error occurs in children components.
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // FIX: Use React.ErrorInfo type to explicitly handle error reporting and logging.
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('STUBRO CRITICAL FAILURE:', error, errorInfo);
  }

  render() {
    // FIX: inheritance is now properly established, allowing access to this.state and this.props.
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

    // FIX: props is now correctly recognized as a member of the component.
    return this.props.children;
  }
}

export default ErrorBoundary;