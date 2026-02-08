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

    const [bgParticles, setBgParticles] = useState<any[]>([]);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const logoUrls = [
            "https://orchid-hexagon-821.notion.site/image/attachment%3Ad38d26f4-f29f-4680-b6c1-fcc30f6f8ab8%3AEVA_Brand_Flow_(no_bg_medium).png?table=block&id=301505ff-3c1f-80cb-aab7-d542d13bd05c&spaceId=0c8505ff-3c1f-81ec-a609-00038f16f0ac&width=1420&userId=&cache=v2",
            "https://orchid-hexagon-821.notion.site/image/attachment%3A2e501b1b-1f05-427b-812d-092a76657cbf%3AEVA_Conversion_Intelligence_(no_bg_medium).png?table=block&id=301505ff-3c1f-80e2-94eb-cfe1cb6c6b3e&spaceId=0c8505ff-3c1f-81ec-a609-00038f16f0ac&width=1420&userId=&cache=v2",
            "https://orchid-hexagon-821.notion.site/image/attachment%3Ae1327aa1-14ae-41b8-8722-6c01c1ce3930%3AevaAI_gradient_for_dark_bg_medium.png?table=block&id=301505ff-3c1f-8081-88cc-f7c79f66dab3&spaceId=0c8505ff-3c1f-81ec-a609-00038f16f0ac&width=1420&userId=&cache=v2",
            "https://orchid-hexagon-821.notion.site/image/attachment%3A605e4280-c2f2-46e4-8505-8aaf1b2f70ce%3Aeva_logo_flat_for_white_bg_use_medium.png?table=block&id=301505ff-3c1f-805b-a3e2-d0c60aa12634&spaceId=0c8505ff-3c1f-81ec-a609-00038f16f0ac&width=1420&userId=&cache=v2",
            "https://orchid-hexagon-821.notion.site/image/attachment%3A74b65356-951b-41d3-81b3-c6f866617d75%3Aeva_E_-_Favicon.png?table=block&id=301505ff-3c1f-805c-9934-d57ef9f70f70&spaceId=0c8505ff-3c1f-81ec-a609-00038f16f0ac&width=590&userId=&cache=v2"
        ];

        const particles = [...Array(80)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 50 + 15}px`, // 15px to 65px (text character size)
            opacity: Math.random() * 0.10 + 0.02,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${Math.random() * 20 + 20}s`,
            filter: `hue-rotate(${Math.random() * 360}deg) brightness(${Math.random() * 0.5 + 0.8}) saturate(${Math.random() * 1 + 0.5})`,
            transform: `rotate(${Math.random() * 360}deg)`,
            baseX: Math.random() * 100, // Store base positions for interaction
            baseY: Math.random() * 100,
            logoUrl: logoUrls[Math.floor(Math.random() * logoUrls.length)],
        }));
        setBgParticles(particles);

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const [isInteracted, setIsInteracted] = useState(false);
    const [exploreData, setExploreData] = useState<Record<string, { moduleName: string, topics: HelpCenterTopic[] }>>({});
    const [loadingExplore, setLoadingExplore] = useState(false);

    // Synchronize isInteracted with URL params
    useEffect(() => {
        const appKey = searchParams.get("app");
        const moduleKey = searchParams.get("module");
        const topicKey = searchParams.get("topic");

        if (appKey || moduleKey || topicKey || searchQuery) {
            setIsInteracted(true);
        }
    }, [searchParams, searchQuery]);

    // Fetch Explore Data (Apps -> 1st Module -> Topics)
    useEffect(() => {
        if (isInteracted && Object.keys(exploreData).length === 0 && !loadingExplore) {
            fetchExploreData();
        }
    }, [isInteracted]);

    async function fetchExploreData() {
        setLoadingExplore(true);
        const data: Record<string, { moduleName: string, topics: HelpCenterTopic[] }> = {};

        try {
            await Promise.all(apps.map(async (app) => {
                const modRes = await fetch(`/api/modules?appId=${app.id}`);
                const modules: HelpCenterModule[] = await modRes.json();

                if (Array.isArray(modules) && modules.length > 0) {
                    const firstModule = modules[0];
                    const topRes = await fetch(`/api/topics?appId=${app.id}&moduleId=${firstModule.id}`);
                    const topics: HelpCenterTopic[] = await topRes.json();

                    if (Array.isArray(topics)) {
                        data[app.id] = {
                            moduleName: getName(firstModule),
                            topics: topics.slice(0, 5) // Show top 5 topics
                        };
                    }
                }
            }));
            setExploreData(data);
        } catch (err) {
            console.error("Error fetching explore data:", err);
        } finally {
            setLoadingExplore(false);
        }
    }

    // Consolidated URL -> State Synchronization
    useEffect(() => {
        const appKey = searchParams.get("app");
        const moduleKey = searchParams.get("module");
        const topicKey = searchParams.get("topic");

        // Sync App
        let appObj: HelpCenterApp | null = null;
        if (appKey) {
            appObj = apps.find(a => normalize(a.key) === normalize(appKey)) || null;
            if (appObj && appObj.id !== selectedApp?.id) {
                setSelectedApp(appObj);
                setModules([]);
                setSelectedModule(null);
                setTopics([]);
                setSelectedTopic(null);
            }
        } else if (selectedApp) {
            setSelectedApp(null);
            setModules([]);
            setSelectedModule(null);
        }

        // Sync Module
        if (moduleKey && modules.length > 0) {
            const modObj = modules.find(m => normalize(m.key) === normalize(moduleKey)) || null;
            if (modObj && modObj.id !== selectedModule?.id) {
                setSelectedModule(modObj);
                setTopics([]);
                setSelectedTopic(null);
            }
        } else if (!moduleKey && selectedModule) {
            setSelectedModule(null);
            setTopics([]);
            setSelectedTopic(null);
        }

        // Sync Topic
        if (topicKey && topics.length > 0) {
            const topObj = topics.find(t => normalize(t.key) === normalize(topicKey)) || null;
            if (topObj && topObj.id !== selectedTopic?.id) {
                setSelectedTopic(topObj);
            }
        } else if (!topicKey && selectedTopic) {
            setSelectedTopic(null);
        }
    }, [searchParams, apps, modules, topics]);

    // Fetch modules when app is selected
    useEffect(() => {
        if (!selectedApp) {
            setModules([]);
            return;
        }
        setLoadingModules(true);
        fetch(`/api/modules?appId=${selectedApp.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setModules(data);
                    // If no module is selected in URL, select the first one
                    const moduleKey = searchParams.get("module");
                    if (!moduleKey && data.length > 0) {
                        setSelectedModule(data[0]);
                    }
                }
            })
            .finally(() => setLoadingModules(false));
    }, [selectedApp?.id]);

    // Fetch topics when module is selected
    useEffect(() => {
        if (!selectedModule || !selectedApp) {
            setTopics([]);
            return;
        }
        setLoadingTopics(true);
        fetch(`/api/topics?appId=${selectedApp.id}&moduleId=${selectedModule.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTopics(data);
            })
            .finally(() => setLoadingTopics(false));
    }, [selectedModule?.id, selectedApp?.id]);

    // Fetch topic articles
    useEffect(() => {
        if (!selectedTopic) {
            setTopicArticles([]);
            return;
        }
        setLoadingArticles(true);
        fetch(`/api/articles?topicId=${selectedTopic.id}&lang=${language}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTopicArticles(data);
            })
            .finally(() => setLoadingArticles(false));
    }, [selectedTopic?.id, language]);

    // Fetch all module articles
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
                    setAllModuleArticles([]);
                }
            })
            .catch(() => setAllModuleArticles([]));
    }, [selectedModule?.id, language]);

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
                setSearchResults([]);
            }
        } catch (err) {
            console.error("Search error:", err);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }

    const getArticleUrl = (article: HelpCenterArticle, source: 'topic' | 'module' | 'search') => {
        const params = new URLSearchParams();
        if (selectedApp) params.set("appId", selectedApp.id);
        if (selectedModule) params.set("moduleId", selectedModule.id);
        if (source === 'topic' && selectedTopic) params.set("topicId", selectedTopic.id);
        return `/docs/${article.slug}?${params.toString()}`;
    };

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--bg-primary)]">
            <div ref={containerRef} className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none transition-opacity duration-1000 ${selectedApp ? 'opacity-0' : 'opacity-100'}`} style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}>
                {/* Background Gradient Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-blue-muted)] opacity-20 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 opacity-20 blur-[120px] rounded-full animate-pulse-slow delay-700"></div>

                {/* Floating Multi-colored Logo Shards */}
                {bgParticles.map((p) => {
                    // Simple interaction logic: move away from mouse
                    // Convert % position to approx px for interaction calculation (rough estimate)
                    const particleX = (parseFloat(p.left) / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000);
                    const particleY = (parseFloat(p.top) / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1000);

                    const dx = mousePos.x - particleX;
                    const dy = mousePos.y - particleY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 500; // Increased interaction radius

                    let moveX = 0;
                    let moveY = 0;

                    if (distance < maxDist) {
                        const force = (maxDist - distance) / maxDist;
                        const angle = Math.atan2(dy, dx);
                        moveX = Math.cos(angle) * force * 300; // Increased pull strength
                        moveY = Math.sin(angle) * force * 300;
                    }

                    return (
                        <div
                            key={p.id}
                            className="absolute animate-float-particles transition-transform duration-300 ease-out"
                            style={{
                                top: p.top,
                                left: p.left,
                                width: p.width,
                                height: 'auto',
                                opacity: p.opacity,
                                animationDelay: p.animationDelay,
                                animationDuration: p.animationDuration,
                                filter: p.filter,
                                transform: `${p.transform} translate(${moveX}px, ${moveY}px)`,
                            }}
                        >
                            <img
                                src={p.logoUrl}
                                alt=""
                                className="w-full h-auto"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Stage Container */}
            <div className={`flex-1 flex flex-col transition-all duration-700 ease-in-out relative z-10 ${!isInteracted ? 'justify-center pb-32 mt-[-5vh]' : 'pt-12'}`}>
                <div className="mx-auto w-full max-w-7xl px-6">
                    {/* Hero Header */}
                    <div className="text-center transition-all duration-700 relative z-40">
                        <h1 className={`font-bold tracking-tight text-[var(--text-primary)] transition-all duration-700 ${!isInteracted ? 'text-6xl md:text-8xl mb-12 drop-shadow-sm' : 'text-3xl mb-6'}`}>
                            {t.home.heroTitle}
                        </h1>

                        <div className={`relative max-w-2xl mx-auto transition-all duration-1000 z-50 ${!isInteracted ? 'scale-110' : 'scale-100'}`}>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onFocus={() => setIsInteracted(true)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (searchResults.length === 0) return;
                                        if (e.key === "ArrowDown") {
                                            e.preventDefault();
                                            setSelectedResultIndex(prev => prev < searchResults.length - 1 ? prev + 1 : prev);
                                        } else if (e.key === "ArrowUp") {
                                            e.preventDefault();
                                            setSelectedResultIndex(prev => prev > 0 ? prev - 1 : -1);
                                        } else if (e.key === "Enter" && selectedResultIndex >= 0) {
                                            e.preventDefault();
                                            window.location.href = `/docs/${searchResults[selectedResultIndex].slug}`;
                                        }
                                    }}
                                    placeholder={t.home.searchPlaceholder}
                                    className="w-full px-8 py-5 pl-14 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--neutral-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all group-hover:border-[var(--brand-blue)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-blue-muted)] focus:bg-[var(--bg-primary)] text-xl"
                                />
                                <span className="absolute left-6 top-5 material-icons-outlined text-[var(--text-secondary)] text-3xl group-focus-within:text-[var(--brand-blue)] transition-colors">search</span>
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 mt-3 bg-[var(--bg-card)] border border-[var(--neutral-border)] rounded-2xl shadow-2xl z-50 max-h-96 overflow-auto animate-in slide-in-from-top-2">
                                    {searching ? (
                                        <div className="p-6 text-center text-[var(--text-secondary)]">{t.home.searching}</div>
                                    ) : (
                                        <>
                                            {searchResults.map((r, idx) => (
                                                <Link
                                                    key={r.id}
                                                    href={getArticleUrl(r, 'search')}
                                                    className={`block px-6 py-4 border-b last:border-b-0 transition-colors ${idx === selectedResultIndex ? "bg-[var(--brand-blue)] text-white" : "hover:bg-[var(--neutral-bg)]"}`}
                                                >
                                                    <div className="font-semibold text-lg">{r.title}</div>
                                                    {r.excerpt && <div className={`text-sm mt-1 line-clamp-1 ${idx === selectedResultIndex ? "text-blue-100" : "text-[var(--text-secondary)]"}`}>{r.excerpt}</div>}
                                                </Link>
                                            ))}
                                            <div className="px-6 py-3 text-xs text-center border-t bg-[var(--bg-tertiary)]">
                                                {t.home.searchInstructions}{" "}
                                                <Link href={`/search?query=${encodeURIComponent(searchQuery)}`} className="text-[var(--brand-blue)] font-bold hover:underline">
                                                    {t.home.viewFullResults}
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Explore Cards Section */}
                    {isInteracted && !selectedApp && (
                        <div className="mt-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-8 text-center opacity-60">{t.home.waysToGetStarted}</h2>
                            <div className="flex flex-wrap justify-center gap-8">
                                {apps.map(app => (
                                    <div key={app.id} className="group relative w-full sm:w-[380px] rounded-3xl border border-[var(--neutral-border)] bg-[var(--bg-card)] p-8 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] hover:border-[var(--brand-blue)] hover:-translate-y-2 transition-all duration-500 text-center flex flex-col">
                                        <div className="flex flex-col items-center gap-4 mb-8">
                                            <div className="flex-shrink-0 w-24 h-16 rounded-2xl bg-white shadow-sm p-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                {app.iconUrl ? (
                                                    <img src={app.iconUrl} className="w-full h-full object-contain" alt={app.name} />
                                                ) : (
                                                    <span className="material-icons-outlined text-[var(--brand-blue)] text-4xl">apps</span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">{t.home.exploreApp.replace("{app}", app.name)}</h3>
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <div className="space-y-3 mb-8 text-left">
                                                {loadingExplore ? (
                                                    <div className="space-y-3">
                                                        <div className="h-4 w-3/4 bg-[var(--neutral-bg)] animate-pulse rounded"></div>
                                                        <div className="h-4 w-1/2 bg-[var(--neutral-bg)] animate-pulse rounded"></div>
                                                    </div>
                                                ) : exploreData[app.id]?.topics.map(topic => (
                                                    <Link
                                                        key={topic.id}
                                                        href={`/?app=${app.key}&topic=${topic.key}`}
                                                        className="block group/item flex items-center gap-3 py-2 text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors"
                                                    >
                                                        <span className="material-icons-outlined text-sm opacity-0 -ml-4 group-hover/item:opacity-100 group-hover/item:ml-0 transition-all duration-300">east</span>
                                                        <span className="font-medium">{getName(topic)}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => router.push(`/?app=${app.key}`)}
                                                className="mt-auto w-full py-4 rounded-xl font-bold bg-[var(--neutral-bg)] text-[var(--text-primary)] hover:bg-[var(--brand-blue)] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                {t.home.startGuide} <span className="material-icons-outlined text-lg">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Old Help Site Redirect */}
                            <div className="mt-12 mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                <a
                                    href="https://help.eva.guru/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--neutral-border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--brand-blue)] hover:border-[var(--brand-blue)] transition-all duration-300 group"
                                >
                                    <span className="material-icons-outlined text-lg">history</span>
                                    <span className="text-sm font-medium">
                                        {language === 'tr' ? 'Önceki Eva Help\'i mi arıyorsunuz?' : language === 'zh' ? '寻找以前的 Eva Help？' : 'Looking for the previous Eva Help?'}
                                    </span>
                                    <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    )}


                    {/* Content View Logic (Moved from original) */}
                    {selectedApp && (
                        <div className="mt-12 animate-in fade-in duration-500">
                            {/* Breadcrumb */}
                            {selectedTopic && (
                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-10 overflow-x-auto pb-4">
                                    <button onClick={() => router.push('/')} className="hover:text-[var(--brand-blue)] transition-colors flex items-center gap-1 font-medium">{t.home.breadcrumbHome}</button>
                                    <span className="material-icons-outlined text-xs">chevron_right</span>
                                    <button onClick={() => router.push(`/?app=${selectedApp.key}`)} className="hover:text-[var(--brand-blue)] transition-colors font-medium">{selectedApp.name}</button>
                                    {selectedModule && (
                                        <>
                                            <span className="material-icons-outlined text-xs">chevron_right</span>
                                            <button onClick={() => router.push(`/?app=${selectedApp.key}&module=${selectedModule.key}`)} className="hover:text-[var(--brand-blue)] transition-colors font-medium">{getName(selectedModule)}</button>
                                        </>
                                    )}
                                    <span className="material-icons-outlined text-xs">chevron_right</span>
                                    <span className="text-[var(--text-primary)] font-bold">{getName(selectedTopic)}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
                                {/* Sidebar */}
                                <aside className="space-y-8">
                                    <div className="rounded-3xl border border-[var(--neutral-border)] bg-[var(--bg-card)] p-6 space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-6 opacity-50 px-3">{t.home.knowledgeModules}</div>
                                        {modules.map(module => (
                                            <button
                                                key={module.id}
                                                onClick={() => {
                                                    router.push(`/?app=${selectedApp.key}&module=${module.key}`);
                                                }}
                                                className={`w-full text-left rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${selectedModule?.id === module.id
                                                    ? 'bg-[var(--brand-blue)] text-white shadow-lg'
                                                    : 'text-[var(--text-primary)] hover:bg-[var(--neutral-bg)]'}`}
                                            >
                                                {module.iconUrl ? (
                                                    <img src={module.iconUrl} className={`w-5 h-5 object-contain ${selectedModule?.id === module.id ? 'brightness-0 invert' : ''}`} alt="" />
                                                ) : (
                                                    <span className="material-icons-outlined text-lg">{module.id === selectedModule?.id ? 'folder_open' : 'folder'}</span>
                                                )}
                                                <span className="font-bold text-sm tracking-tight leading-tight">{getName(module)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </aside>

                                {/* Main Content Area */}
                                <main className="min-w-0">
                                    {selectedTopic ? (
                                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 tracking-tighter">{getName(selectedTopic)}</h2>
                                            {getDescription(selectedTopic) && <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed max-w-2xl">{getDescription(selectedTopic)}</p>}

                                            <div className="grid gap-4">
                                                {topicArticles.map(article => (
                                                    <Link
                                                        key={article.id}
                                                        href={getArticleUrl(article, 'topic')}
                                                        className="group flex items-center justify-between p-6 rounded-3xl border border-[var(--neutral-border)] bg-[var(--bg-card)] hover:border-[var(--brand-blue)] hover:shadow-xl transition-all"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-blue-muted)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                <span className="material-icons-outlined text-[var(--brand-blue)]">article</span>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">{article.title}</div>
                                                                {article.excerpt && <div className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">{article.excerpt}</div>}
                                                            </div>
                                                        </div>
                                                        <span className="material-icons-outlined text-[var(--text-secondary)] group-hover:text-[var(--brand-blue)] group-hover:translate-x-1 transition-all">chevron_right</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : selectedModule && (
                                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                            <div className="mb-10">
                                                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tighter">{getName(selectedModule)}</h2>
                                                <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl">{getDescription(selectedModule)}</p>
                                            </div>

                                            <div className="space-y-4">
                                                {loadingTopics ? (
                                                    <div className="p-12 text-center text-[var(--text-secondary)]">{t.home.loadingTopics}</div>
                                                ) : topics.length === 0 ? (
                                                    <div className="p-12 text-center text-[var(--text-secondary)]">{t.home.noTopicsInModule}</div>
                                                ) : (
                                                    topics.map(topic => (
                                                        <button
                                                            key={topic.id}
                                                            onClick={() => {
                                                                const newParams = new URLSearchParams(searchParams.toString());
                                                                newParams.set("app", selectedApp.key);
                                                                newParams.set("module", selectedModule.key);
                                                                newParams.set("topic", topic.key);
                                                                router.push(`/?${newParams.toString()}`);
                                                            }}
                                                            className="w-full text-left group flex items-center justify-between p-6 rounded-3xl border border-[var(--neutral-border)] bg-[var(--bg-card)] hover:border-[var(--brand-blue)] hover:shadow-xl transition-all"
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 rounded-2xl bg-[var(--brand-blue-muted)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    {topic.iconUrl ? (
                                                                        <img src={topic.iconUrl} className="w-9 h-9 object-contain" alt="" />
                                                                    ) : (
                                                                        <span className="material-icons-outlined text-[var(--brand-blue)] text-3xl">category</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">{getName(topic)}</h3>
                                                                    {getDescription(topic) && (
                                                                        <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">{getDescription(topic)}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">{t.home.exploreTopics}</span>
                                                                <span className="material-icons-outlined text-[var(--text-secondary)] group-hover:text-[var(--brand-blue)] group-hover:translate-x-1 transition-all">chevron_right</span>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </main>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes wander-particles {
                    0% { 
                        transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
                    }
                    25% { 
                        transform: translate3d(5vw, 5vh, 100px) rotateX(90deg) rotateY(45deg) rotateZ(90deg) scale(1.2);
                    }
                    50% { 
                        transform: translate3d(10vw, -2vh, -50px) rotateX(180deg) rotateY(90deg) rotateZ(180deg) scale(0.8);
                    }
                    75% { 
                        transform: translate3d(-5vw, 8vh, 150px) rotateX(270deg) rotateY(135deg) rotateZ(270deg) scale(1.1);
                    }
                    100% { 
                        transform: translate3d(0, 0, 0) rotateX(360deg) rotateY(180deg) rotateZ(360deg) scale(1);
                    }
                }
                @keyframes pulse-slow {
                    0%, 100% { 
                        transform: scale(1) translateZ(0); 
                        opacity: 0.15; 
                        filter: blur(120px) brightness(1);
                    }
                    50% { 
                        transform: scale(1.3) translateZ(50px); 
                        opacity: 0.3; 
                        filter: blur(140px) brightness(1.2);
                    }
                }
                .animate-float-particles {
                    animation: wander-particles linear infinite;
                    will-change: transform;
                    transform-style: preserve-3d;
                    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
                }
                .animate-pulse-slow {
                    animation: pulse-slow 15s ease-in-out infinite;
                    will-change: transform, opacity;
                    transform-style: preserve-3d;
                }
            `}</style>
        </div>
    );
}
