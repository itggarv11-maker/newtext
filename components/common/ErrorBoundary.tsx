
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  // FIX: Made children optional to resolve "Property 'children' is missing in type '{}' but required in type 'Props'" error in main.tsx
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary class to catch and handle UI-level exceptions.
 * Inheriting from Component<Props, State> ensures that 'this.props' and 'this.state' are correctly typed.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // Added constructor with super(props) to resolve "Property 'props' does not exist" error
  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('StuBro Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#010208] flex items-center justify-center p-8 text-center">
          <div className="max-w-md p-10 glass-card rounded-[2.5rem] border-red-500/30">
            <h2 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">NEURAL LINK BROKEN</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">The system encountered an unexpected logic error. Attempting to recalibrate...</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Restart Core
            </button>
          </div>
        </div>
      );
    }

    // FIX: Using explicit property access on props to resolve "Property 'props' does not exist on type 'ErrorBoundary'" error
    return (this as any).props.children;
  }
}

export default ErrorBoundary;
