"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { HelpCenterArticle } from "../../lib/types";
import { useLanguage } from "../../lib/i18n";

export default function SearchClient() {
    const router = useRouter();
    const { language, t } = useLanguage();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("query") || searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<HelpCenterArticle[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Debounced search on query change
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSelectedResultIndex(-1);
            return;
        }

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        setSearching(true);
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}&lang=${language}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setSearchResults(data);
                    setSelectedResultIndex(-1);
                } else {
                    console.error("Search failed:", data);
                    setSearchResults([]);
                }
            } catch (err) {
                console.error("Search error:", err);
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery, language]);

    return (
        <div className="min-h-screen">
            {/* Search Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--neutral-border)]">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <Link href="/" className="text-sm text-[var(--brand-blue)] hover:underline mb-4 block">
                        ← {t.search.backToHome}
                    </Link>
                    <h1 className="text-3xl font-bold mb-4">{t.search.title}</h1>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown" && searchResults.length > 0) {
                                    e.preventDefault();
                                    setSelectedResultIndex((prev) =>
                                        prev < searchResults.length - 1 ? prev + 1 : prev
                                    );
                                } else if (e.key === "ArrowUp" && searchResults.length > 0) {
                                    e.preventDefault();
                                    setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : -1));
                                } else if (e.key === "Enter") {
                                    if (selectedResultIndex >= 0 && searchResults[selectedResultIndex]) {
                                        e.preventDefault();
                                        router.push(`/docs/${searchResults[selectedResultIndex].slug}`);
                                    } else if (searchQuery.trim()) {
                                        e.preventDefault();
                                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                                    }
                                }
                            }}
                            placeholder={t.search.placeholder}
                            className="w-full px-4 py-3 pl-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--neutral-border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                            autoFocus
                        />
                        <svg className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="mx-auto max-w-4xl px-6 py-12">
                {searching && <div className="text-center text-[var(--text-secondary)]">{t.search.searching}</div>}

                {!searching && searchResults.length === 0 && searchQuery.trim() && (
                    <div className="text-center text-[var(--text-secondary)]">
                        {t.search.noResults.replace('{query}', searchQuery)}
                    </div>
                )}

                {!searching && searchQuery.trim() === "" && (
                    <div className="text-center text-[var(--text-secondary)]">{t.search.enterQuery}</div>
                )}

                {!searching && searchResults.length > 0 && (
                    <div>
                        <p className="mb-6 text-sm text-[var(--text-secondary)]">
                            {t.search.foundResults.replace('{count}', searchResults.length.toString())}
                        </p>
                        <div className="space-y-3">
                            {searchResults.map((article, idx) => (
                                <Link
                                    key={article.id}
                                    href={`/docs/${article.slug}`}
                                    className={`block rounded-lg border p-4 transition-all ${idx === selectedResultIndex
                                        ? "border-[var(--brand-blue)] bg-[var(--brand-blue-muted)] ring-2 ring-[var(--brand-blue)]"
                                        : "border-[var(--neutral-border)] bg-[var(--bg-card)] hover:bg-[var(--neutral-bg)]"
                                        }`}
                                >
                                    <div className="font-medium text-[var(--text-primary)]">{article.title}</div>
                                    {article.excerpt && (
                                        <div className="mt-2 text-sm text-[var(--text-secondary)]">{article.excerpt}</div>
                                    )}
                                    <div className="mt-3 text-xs text-[var(--text-muted)]">{article.contentType}</div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 text-xs text-[var(--text-muted)]">
                            {t.search.instructions}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
