"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { HelpCenterApp, HelpCenterModule, HelpCenterTopic, HelpCenterArticle } from "../lib/types";
import { useLanguage } from "../lib/i18n";

const normalize = (s: string) => (s ?? "").trim().toLowerCase();

type Props = {
    apps: HelpCenterApp[];
};

export function HelpCenterClient({ apps }: Props) {
    const [selectedApp, setSelectedApp] = useState<HelpCenterApp | null>(null);
    const [selectedModule, setSelectedModule] = useState<HelpCenterModule | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<HelpCenterTopic | null>(null);

    const [modules, setModules] = useState<HelpCenterModule[]>([]);
    const [topics, setTopics] = useState<HelpCenterTopic[]>([]);
    const [topicArticles, setTopicArticles] = useState<HelpCenterArticle[]>([]);
    const [allModuleArticles, setAllModuleArticles] = useState<HelpCenterArticle[]>([]);

    const [loadingModules, setLoadingModules] = useState(false);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<HelpCenterArticle[]>([]);
    const [searching, setSearching] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const { language, t } = useLanguage();

    const getDescription = (item: HelpCenterApp | HelpCenterModule | HelpCenterTopic | null) => {
        if (!item) return "";
        if (language === 'tr') return item.descriptionTR || item.description;
        if (language === 'zh') return item.descriptionZH || item.description;
        return item.description;
    };

    const getName = (item: HelpCenterApp | HelpCenterModule | HelpCenterTopic | null) => {
        if (!item) return "";
        if (language === 'tr' && 'nameTR' in item) return item.nameTR || item.name;
        if (language === 'zh' && 'nameZH' in item) return item.nameZH || item.name;
        return item.name;
    };

    const router = useRouter();
    const searchParams = useSearchParams();

    // Consolidated URL -> State Synchronization
    useEffect(() => {
        const appKey = searchParams.get("app");
        const moduleKey = searchParams.get("module");
        const topicKey = searchParams.get("topic");

        // DEFAULT REDIRECT: If no app is selected, pick the first one
        if (!appKey && apps.length > 0) {
            const firstApp = apps[0];
            router.replace(`/?app=${firstApp.key}`, { scroll: false });
            return;
        }

        console.log("[Sync] URL changed:", { appKey, moduleKey, topicKey });

        // 1. Sync App
        let appObj: HelpCenterApp | null = null;
        if (appKey) {
            appObj = apps.find(a => normalize(a.key) === normalize(appKey)) || null;
            if (appObj && appObj.id !== selectedApp?.id) {
                console.log("[Sync] Setting App:", appObj.name);
                setSelectedApp(appObj);
                // Clear children immediately if app changed to avoid stale data
                setModules([]);
                setSelectedModule(null);
                setTopics([]);
                setSelectedTopic(null);
            }
        } else if (selectedApp) {
            console.log("[Sync] Clearing App");
            setSelectedApp(null);
            setModules([]);
            setSelectedModule(null);
        }

        // 2. Sync Module (wait for modules to be loaded if appKey is present)
        if (moduleKey && modules.length > 0) {
            const modObj = modules.find(m => normalize(m.key) === normalize(moduleKey)) || null;
            if (modObj) {
                if (modObj.id !== selectedModule?.id) {
                    console.log("[Sync] Setting Module:", modObj.name);
                    setSelectedModule(modObj);
                    // Clear topic if module changed
                    setTopics([]);
                    setSelectedTopic(null);
                }
            } else {
                console.warn("[Sync] Module key in URL but not found in list:", moduleKey);
            }
        } else if (!moduleKey && selectedModule) {
            console.log("[Sync] Clearing Module");
            setSelectedModule(null);
            setTopics([]);
            setSelectedTopic(null);
        }

        // 3. Sync Topic (wait for topics to be loaded if topicKey is present)
        if (topicKey && topics.length > 0) {
            const topObj = topics.find(t => normalize(t.key) === normalize(topicKey)) || null;
            if (topObj) {
                if (topObj.id !== selectedTopic?.id) {
                    console.log("[Sync] Setting Topic:", topObj.name);
                    setSelectedTopic(topObj);
                }
            } else {
                console.warn("[Sync] Topic key in URL but not found in list:", topicKey);
            }
        } else if (!topicKey && selectedTopic) {
            console.log("[Sync] Clearing Topic");
            setSelectedTopic(null);
        }
    }, [searchParams, apps, modules, topics]); // This handles all transitions centrally

    // Debounced search on input change
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
        debounceTimer.current = setTimeout(() => {
            doSearch();
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery]);

    // Fetch modules when app is selected
    useEffect(() => {
        if (!selectedApp) {
            setModules([]);
            setSelectedModule(null);
            return;
        }

        setLoadingModules(true);
        fetch(`/api/modules?appId=${selectedApp.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setModules(data);
                    // DEFAULT REDIRECT: If no module is selected in URL, pick the first one from the loaded list
                    if (!searchParams.get("module") && data.length > 0) {
                        const newParams = new URLSearchParams(searchParams.toString());
                        newParams.set("module", data[0].key);
                        router.replace(`/?${newParams.toString()}`, { scroll: false });
                    }
                } else {
                    console.error("Failed to load modules:", data);
                    setModules([]);
                }
                setLoadingModules(false);
            })
            .catch(() => {
                setModules([]);
                setLoadingModules(false);
            });
    }, [selectedApp?.id]); // Use ID for stability

    // Fetch topics when module is selected
    useEffect(() => {
        if (!selectedApp || !selectedModule) {
            setTopics([]);
            setSelectedTopic(null);
            return;
        }

        setLoadingTopics(true);
        fetch(`/api/topics?appId=${selectedApp.id}&moduleId=${selectedModule.id}`)
            .then((res) => {
                console.log(`[Topics] Fetched for app=${selectedApp.id} module=${selectedModule.id}. Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log(`[FetchTopics] Data received (${data?.length ?? 0} items)`);
                if (Array.isArray(data)) {
                    setTopics(data);
                } else {
                    console.error("[FetchTopics] Failed to load topics:", data);
                    setTopics([]);
                }
                setLoadingTopics(false);
            })
            .catch((err) => {
                console.error("[FetchTopics] Error loading topics:", err);
                setTopics([]);
                setLoadingTopics(false);
            });
    }, [selectedApp?.id, selectedModule?.id, language]); // Use IDs and language for stability

    // Fetch articles when topic is selected
    useEffect(() => {
        if (!selectedTopic) {
            setTopicArticles([]);
            return;
        }

        setLoadingArticles(true);
        fetch(`/api/articles?topicId=${selectedTopic.id}&lang=${language}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTopicArticles(data);
                } else {
                    console.error("Failed to load topic articles:", data);
                    setTopicArticles([]);
                }
                setLoadingArticles(false);
            })
            .catch(() => {
                setTopicArticles([]);
                setLoadingArticles(false);
            });
    }, [selectedTopic, language]);

    async function doSearch() {
        const q = String(searchQuery || "").trim();
        if (!q) return;

        setSearching(true);
        setSearchResults([]);
        try {
            const res = await fetch(`/api/search?query=${encodeURIComponent(q)}&lang=${language}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSearchResults(data.slice(0, 20));
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
    }

    // Helper to generate article URL with context
    const getArticleUrl = (article: HelpCenterArticle, source: 'topic' | 'module' | 'search') => {
        const params = new URLSearchParams();
        if (selectedApp) params.set("appId", selectedApp.id);
        if (selectedModule) params.set("moduleId", selectedModule.id);
        if (source === 'topic' && selectedTopic) params.set("topicId", selectedTopic.id);
        return `/docs/${article.slug}?${params.toString()}`;
    };

    // Fetch all module articles when module is selected
    useEffect(() => {
        if (!selectedModule) {
            setAllModuleArticles([]);
            return;
        }

        fetch(`/api/articles?moduleId=${selectedModule.id}&lang=${language}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setAllModuleArticles(data);
                } else {
                    console.error("Failed to load module articles:", data);
                    setAllModuleArticles([]);
                }
            })
            .catch(() => {
                setAllModuleArticles([]);
            });
    }, [selectedModule?.id, language]); // Use ID and language for stability

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-[var(--bg-secondary)] border-b border-[var(--neutral-border)]">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex justify-center mb-4">
                        {!logoError ? (
                            <img
                                src="https://lh3.googleusercontent.com/sitesv/APaQ0SQa24_mE_XWc26sJX41irqiNYgQAAdB_I_Y5PlAuL-FQ_RjbYuQh-y8xxwHJdobxO422vzzKw25nNjUPTI9oFMTCgaXwZT5drB-mQhnoC0hjug9j4wWwTlyARtGlechiAq9BFps1r6fO5YDVDjz10IQQzFeWke6qGSoFjqX5bPsN29bruqtxy9FxsC-1lYV7vu0oHMjNUgbxjQ1zESb_xy6Bx5_cKhQFO9uRb0=w1280"
                                alt="Logo"
                                className="w-10 h-10 object-contain"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <svg viewBox="0 0 800 200" className="w-48 h-auto object-contain" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="g1" x1="0" x2="1">
                                        <stop offset="0%" stopColor="#6b21a8" />
                                        <stop offset="50%" stopColor="#00d4ff" />
                                        <stop offset="100%" stopColor="#f3a7c1" />
                                    </linearGradient>
                                </defs>
                                <g fill="url(#g1)">
                                    <path d="M60 100a40 40 0 1 1 0-0z" />
                                </g>
                                <text x="320" y="125" fontFamily="Poppins, Arial" fontSize="64" fill="currentColor">Eva</text>
                            </svg>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-center">
                        {t.home.heroTitle}
                    </h1>
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (searchResults.length === 0) return;

                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        setSelectedResultIndex((prev) =>
                                            prev < searchResults.length - 1 ? prev + 1 : prev
                                        );
                                    } else if (e.key === "ArrowUp") {
                                        e.preventDefault();
                                        setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : -1));
                                    } else if (e.key === "Enter" && selectedResultIndex >= 0) {
                                        e.preventDefault();
                                        const result = searchResults[selectedResultIndex];
                                        window.location.href = `/docs/${result.slug}`;
                                    }
                                }}
                                placeholder={t.home.searchPlaceholder}
                                className="w-full px-4 py-3 pl-10 rounded-lg bg-[var(--bg-card)] border border-[var(--neutral-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] shadow-sm transition-all hover:border-[var(--brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:bg-[var(--bg-primary)]"
                            />
                            <svg className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            {searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--neutral-border)] rounded-lg shadow-lg z-40 max-h-64 overflow-auto">
                                    {searching ? (
                                        <div className="p-3 text-sm text-[var(--text-secondary)]">{t.home.searching}</div>
                                    ) : (
                                        <>
                                            {searchResults.map((r, idx) => (
                                                <Link
                                                    key={r.id}
                                                    href={getArticleUrl(r, 'search')}
                                                    onClick={() => {
                                                        setSearchResults([]);
                                                        setSearchQuery("");
                                                        setSelectedResultIndex(-1);
                                                    }}
                                                    className={`block px-4 py-3 border-b last:border-b-0 transition-colors ${idx === selectedResultIndex
                                                        ? "bg-[var(--brand-blue)] text-white"
                                                        : "hover:bg-[var(--neutral-bg)]"
                                                        }`}
                                                >
                                                    <div className="font-medium">{r.title}</div>
                                                    {r.excerpt && <div className="text-xs text-[var(--text-secondary)] mt-1">{r.excerpt}</div>}
                                                </Link>
                                            ))}
                                            <div className="px-4 py-2 text-xs text-[var(--text-muted)] border-t bg-[var(--bg-tertiary)]">
                                                {t.home.searchInstructions}{" "}
                                                <Link href={`/search?query=${encodeURIComponent(searchQuery)}`} className="text-[var(--brand-blue)] hover:underline">
                                                    {t.home.viewFullResults}
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* App Selection - Moved inside header, below searchbox */}
                    {!selectedTopic && (
                        <div className="mt-8 max-w-2xl mx-auto">
                            <div className="flex flex-wrap justify-center gap-4">
                                {apps.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            const newParams = new URLSearchParams();
                                            newParams.set("app", app.key);
                                            router.push(`/?${newParams.toString()}`, { scroll: false });
                                        }}
                                        className={`flex-1 min-w-[200px] rounded-xl border p-6 text-center transition-all ${selectedApp?.id === app.id
                                            ? "border-[var(--brand-blue)] bg-[var(--brand-blue-muted)] ring-2 ring-[var(--brand-blue)]"
                                            : "border-[var(--neutral-border)] bg-[var(--bg-card)] hover:border-[var(--brand-blue)] hover:bg-[var(--neutral-bg)]"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            {app.iconUrl ? (
                                                <img
                                                    src={app.iconUrl}
                                                    alt={app.name}
                                                    className="w-auto h-12 object-contain"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="font-bold text-[var(--text-primary)] text-lg">{app.name}</div>
                                                {getDescription(app) && (
                                                    <div className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 max-w-[180px] mx-auto">{getDescription(app)}</div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area with Sidebar */}
            {selectedApp && (
                <div className="mx-auto max-w-7xl px-6 pt-12 pb-12">
                    {/* Global Explorer Breadcrumb - Only visible when a topic is selected */}
                    {selectedTopic && (
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8 overflow-x-auto whitespace-nowrap pt-4 px-1">
                            <button
                                onClick={() => {
                                    router.push(`/`, { scroll: false });
                                }}
                                className="hover:text-[var(--brand-blue)] transition-colors flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                {t.home.breadcrumbHome}
                            </button>
                            <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>

                            <button
                                onClick={() => {
                                    const newParams = new URLSearchParams();
                                    newParams.set("app", selectedApp.key);
                                    router.push(`/?${newParams.toString()}`, { scroll: false });
                                }}
                                className="hover:text-[var(--brand-blue)] transition-colors"
                            >
                                {selectedApp.name}
                            </button>

                            {selectedModule && (
                                <>
                                    <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    <button
                                        onClick={() => {
                                            const newParams = new URLSearchParams();
                                            newParams.set("app", selectedApp.key);
                                            newParams.set("module", selectedModule.key);
                                            router.push(`/?${newParams.toString()}`, { scroll: false });
                                        }}
                                        className="hover:text-[var(--brand-blue)] transition-colors"
                                    >
                                        {getName(selectedModule)}
                                    </button>
                                </>
                            )}

                            <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            <span className="text-[var(--text-primary)] font-medium">
                                {getName(selectedTopic)}
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        {/* Left Sidebar - Modules */}
                        <aside className="h-fit rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-4">
                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-4">{t.home.sidebarTitle}</div>
                            <div className="space-y-3">
                                {loadingModules ? (
                                    <div className="text-sm text-[var(--text-secondary)]">{t.home.loading}</div>
                                ) : modules.length === 0 ? (
                                    <div className="text-sm text-[var(--text-secondary)]">{t.home.noModules}</div>
                                ) : (
                                    modules.map((module) => (
                                        <button
                                            key={module.id}
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams.toString());
                                                newParams.set("app", selectedApp.key);
                                                newParams.set("module", module.key);
                                                newParams.delete("topic");
                                                router.push(`/?${newParams.toString()}`, { scroll: false });
                                            }}
                                            className={`w-full text-left rounded-lg px-4 py-3 transition-all flex items-center gap-3 text-sm ${selectedModule?.id === module.id
                                                ? "bg-[#1a1a1a] text-white font-medium"
                                                : "text-[var(--text-primary)] hover:bg-[var(--neutral-bg)]"
                                                }`}
                                        >
                                            {module.iconUrl ? (
                                                <img
                                                    src={module.iconUrl}
                                                    alt={module.name}
                                                    className="w-5 h-5 rounded object-contain flex-shrink-0"
                                                />
                                            ) : (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            )}
                                            <span className="truncate">{getName(module)}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </aside>

                        {/* Right Content Area */}
                        {selectedModule && (
                            <main>
                                {selectedTopic ? (
                                    // Topic Detail View
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <h2 className="text-2xl font-semibold mb-2">{getName(selectedTopic)}</h2>
                                        {getDescription(selectedTopic) && (
                                            <p className="text-sm text-[var(--text-secondary)] mb-6">{getDescription(selectedTopic)}</p>
                                        )}

                                        {loadingArticles ? (
                                            <div className="text-sm text-[var(--text-secondary)]">{t.home.loadingArticles}</div>
                                        ) : topicArticles.length === 0 ? (
                                            <div className="text-sm text-[var(--text-secondary)]">{t.home.noArticlesInTopic}</div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {topicArticles.map((article) => (
                                                    <Link
                                                        key={article.id}
                                                        href={getArticleUrl(article, 'topic')}
                                                        className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-4 hover:bg-[var(--neutral-bg)] hover:border-[var(--brand-blue)] transition-all group"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded bg-[var(--brand-blue-muted)] flex items-center justify-center flex-shrink-0 text-[var(--brand-blue)]">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0 pt-0.5">
                                                                <div className="font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">
                                                                    {article.title}
                                                                </div>
                                                                {article.excerpt && (
                                                                    <div className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                                                                        {article.excerpt}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Module Overview (Topics Grid + All Articles)
                                    <>
                                        {/* Featured Resources - Topics */}
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-semibold mb-4">{getName(selectedModule)}</h2>
                                            <p className="text-sm text-[var(--text-secondary)] mb-6">
                                                {getDescription(selectedModule) || t.home.moduleDescriptionFallback.replace('{app}', selectedApp.name)}
                                            </p>

                                            {loadingTopics ? (
                                                <div className="text-sm text-[var(--text-secondary)]">{t.home.loadingTopics}</div>
                                            ) : topics.length === 0 ? (
                                                <div className="text-sm text-[var(--text-secondary)]">{t.home.noTopicsInModule}</div>
                                            ) : (
                                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                    {topics.map((topic) => (
                                                        <button
                                                            key={topic.id}
                                                            onClick={() => {
                                                                const newParams = new URLSearchParams(searchParams.toString());
                                                                newParams.set("app", selectedApp.key);
                                                                newParams.set("module", selectedModule.key);
                                                                newParams.set("topic", topic.key);
                                                                router.push(`/?${newParams.toString()}`, { scroll: false });
                                                            }}
                                                            className={`rounded-lg border p-5 text-left transition-all border-[var(--neutral-border)] bg-[var(--bg-card)] hover:border-[var(--brand-purple)] hover:bg-[var(--bg-tertiary)]`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-[var(--brand-purple)] flex items-center justify-center flex-shrink-0">
                                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs text-[var(--text-muted)] uppercase mb-1">
                                                                        {getName(selectedModule)}
                                                                    </div>
                                                                    <div className="font-semibold text-[var(--text-primary)]">{getName(topic)}</div>
                                                                    {getDescription(topic) && (
                                                                        <div className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
                                                                            {getDescription(topic)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* All Module Articles */}
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4">{t.home.allArticlesInModule.replace('{module}', getName(selectedModule))}</h3>
                                            {allModuleArticles.length === 0 ? (
                                                <div className="text-sm text-[var(--text-secondary)]">{t.home.noArticlesInModule}</div>
                                            ) : (
                                                <div className="grid gap-3">
                                                    {allModuleArticles.map((article) => (
                                                        <Link
                                                            key={article.id}
                                                            href={getArticleUrl(article, 'module')}
                                                            className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-4 hover:bg-[var(--neutral-bg)] hover:border-[var(--brand-blue)] transition-all group"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <svg className="w-5 h-5 text-[var(--text-secondary)] mt-0.5 flex-shrink-0 group-hover:text-[var(--brand-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">
                                                                        {article.title}
                                                                    </div>
                                                                    {article.excerpt && (
                                                                        <div className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                                                                            {article.excerpt}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </main>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
}
