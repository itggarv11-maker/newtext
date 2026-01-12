import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'https://esm.sh/react-markdown@9.0.1';
import remarkGfm from 'https://esm.sh/remark-gfm@4.0.0';

interface MathRendererProps {
  text?: string | null;
  className?: string;
  isChat?: boolean;
}

/**
 * Precision Content Processor
 * Optimized for Mobile Responsiveness.
 */
const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "", isChat = false }) => {
    const safeText = (text ?? "").replace(/\$/g, ""); // Stripping residual $ signs

    if (!safeText) return null;

    return (
        <div className={`precision-content-block break-words overflow-hidden ${className} ${isChat ? 'text-sm md:text-base' : 'text-base md:text-xl'}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => <p className={`${isChat ? 'mb-2' : 'mb-6'} leading-relaxed font-medium break-words`}>{children}</p>,
                    strong: ({ children }) => <strong className="font-black text-cyan-400 italic break-words">{children}</strong>,
                    em: ({ children }) => <em className="text-violet-400 font-bold not-italic break-words">{children}</em>,
                    h1: ({ children }) => <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-4 border-l-4 border-violet-600 pl-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-200 mb-3">{children}</h2>,
                    li: ({ children }) => <li className="mb-2 pl-2 marker:text-cyan-500 break-words">{children}</li>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                    code: ({ children }) => <code className="bg-black/40 px-2 py-0.5 rounded font-mono-code text-pink-400 border border-white/5 text-xs md:text-sm inline-block max-w-full overflow-x-auto whitespace-pre-wrap">{children}</code>
                }}
            >
                {safeText}
            </ReactMarkdown>
        </div>
    );
};

export default MathRenderer;