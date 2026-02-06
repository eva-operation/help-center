"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../lib/i18n";

interface ExcerptRendererProps {
    excerpt: string;
    excerptRich?: any[];
}

export function ExcerptRenderer({ excerpt, excerptRich }: ExcerptRendererProps) {
    const [thinking, setThinking] = useState(true);
    const [charCount, setCharCount] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const timer = setTimeout(() => {
            setThinking(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (thinking || isCollapsed) return;

        const totalLength = excerpt.length;
        if (charCount < totalLength) {
            const timer = setTimeout(() => {
                setCharCount(prev => prev + 1);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [thinking, charCount, excerpt, isCollapsed]);

    const renderRichTyped = (rich: any[], limit: number) => {
        let currentTotal = 0;
        const result: React.ReactNode[] = [];

        for (let i = 0; i < rich.length; i++) {
            if (currentTotal >= limit) break;

            const r = rich[i];
            const text = r.plain_text || "";
            const remaining = limit - currentTotal;
            const toShow = text.slice(0, remaining);

            const annotations = r.annotations || {};
            const { bold, italic, strikethrough, underline, code, color } = annotations;

            const classNames: string[] = [];
            if (bold) classNames.push("font-bold");
            if (italic) classNames.push("italic");
            if (strikethrough) classNames.push("line-through opacity-60");
            if (underline) classNames.push("underline decoration-1 underline-offset-4");
            if (code) classNames.push("bg-[var(--bg-tertiary)] px-1 rounded font-mono text-sm border border-[var(--neutral-border)]");

            if (color && color !== 'default') {
                if (color.endsWith('_background')) {
                    classNames.push(`notion-bg-${color.replace('_background', '')}`);
                } else {
                    classNames.push(`notion-color-${color}`);
                }
            }

            result.push(
                <span key={i} className={classNames.join(" ")}>
                    {toShow}
                </span>
            );

            currentTotal += text.length;
        }

        return result;
    };

    const isComplete = charCount >= excerpt.length;

    return (
        <div className="mt-6 rounded-xl border border-[var(--neutral-border)] bg-[var(--bg-card)] shadow-sm overflow-hidden transition-all duration-300">
            {/* Header / Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[var(--neutral-bg)] transition-colors border-b border-[var(--neutral-border)]"
            >
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-[13px] font-bold text-[var(--text-primary)] tracking-wider">{(t as any).article.aiSummaryTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-tighter">
                        {isCollapsed ? (t as any).article.expand : (t as any).article.collapse}
                    </span>
                    <svg
                        className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isCollapsed ? "-rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <div className={`transition-all duration-500 ease-in-out ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"}`}>
                <div className="p-6">
                    {thinking ? (
                        <div className="flex items-center gap-4 text-[var(--brand-blue)] font-medium">
                            <div className="flex gap-1.5 items-center">
                                <div className="w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 rounded-full bg-[var(--brand-blue)] animate-bounce"></div>
                            </div>
                            <span className="text-sm">{(t as any).article.generatingExcerpt}</span>
                        </div>
                    ) : (
                        <>
                            <div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap text-base font-medium">
                                <div className="inline">
                                    {excerptRich && excerptRich.length > 0
                                        ? renderRichTyped(excerptRich, charCount)
                                        : excerpt.slice(0, charCount)
                                    }
                                    {!isComplete && (
                                        <span className="inline-block w-1.5 h-4 ml-1 bg-[var(--brand-blue)] animate-pulse align-middle"></span>
                                    )}
                                </div>
                            </div>

                            {/* Disclaimer Footer */}
                            <div className="mt-6 pt-5 border-t border-[var(--neutral-border)] flex items-start gap-2.5 opacity-50">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs leading-relaxed italic">
                                    {(t as any).article.aiDisclaimer}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
