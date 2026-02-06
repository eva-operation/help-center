"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../lib/i18n";

interface SearchResult {
    text: string;
    index: number;
    element: HTMLElement;
}

export function ArticleSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const { t } = useLanguage();

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setCurrentIndex(-1);
            // Clear highlights if any
            return;
        }

        const mainContent = document.getElementById("main-content");
        if (!mainContent) return;

        // Simple search logic: find all text nodes containing the query
        // Note: In a real app we might want to highlight the actual text in the DOM.
        // For simplicity here, we'll find elements containing text.
        const elements = mainContent.querySelectorAll("p, h1, h2, h3, li, span");
        const found: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        elements.forEach((el) => {
            const text = el.textContent || "";
            if (text.toLowerCase().includes(lowerQuery)) {
                found.push({
                    text: text.substring(0, 60) + (text.length > 60 ? "..." : ""),
                    index: found.length,
                    element: el as HTMLElement
                });
            }
        });

        setResults(found);
        setCurrentIndex(found.length > 0 ? 0 : -1);
    }, [query]);

    const scrollToResult = (index: number) => {
        if (results[index]) {
            setCurrentIndex(index);
            results[index].element.scrollIntoView({ behavior: "smooth", block: "center" });

            // Add a temporary highlight
            const originalBg = results[index].element.style.backgroundColor;
            const originalTransition = results[index].element.style.transition;

            results[index].element.style.transition = "background-color 0.3s ease";
            results[index].element.style.backgroundColor = "var(--brand-blue-muted)";

            setTimeout(() => {
                results[index].element.style.backgroundColor = originalBg;
                setTimeout(() => {
                    results[index].element.style.transition = originalTransition;
                }, 300);
            }, 2000);
        }
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.search.inArticlePlaceholder}
                    className="w-full px-4 py-2 pl-9 text-sm rounded-lg bg-[var(--bg-card)] border border-[var(--neutral-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] transition-all"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {results.length > 0 && (
                <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--neutral-border)] overflow-hidden">
                    <div className="px-3 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--neutral-border)] flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                            {t.search.foundInArticle.replace('{current}', (currentIndex + 1).toString()).replace('{total}', results.length.toString())}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => scrollToResult((currentIndex - 1 + results.length) % results.length)}
                                className="p-1 hover:bg-[var(--neutral-bg-hover)] rounded transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button
                                onClick={() => scrollToResult((currentIndex + 1) % results.length)}
                                className="p-1 hover:bg-[var(--neutral-bg-hover)] rounded transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {query.trim().length >= 2 && results.length === 0 && (
                <div className="text-xs text-[var(--text-muted)] px-1">{t.search.noResultsInArticle}</div>
            )}
        </div>
    );
}
