import Link from "next/link";
import { notFound } from "next/navigation";
import { TableOfContents } from "../../components/TableOfContents";
import { ArticleSearch } from "../../components/ArticleSearch";
import { NotionRenderer } from "../../components/notion/NotionRenderer";
import { ExcerptRenderer } from "../../components/ExcerptRenderer";
import { cache, Suspense } from "react";
import type { ReactNode } from "react";

import { NotionToMarkdown } from "notion-to-md";
import { notion } from "../../../lib/notion";
import { listPublishedArticles, fetchAllBlocks } from "../../../lib/content";
// import { buildNavTree } from "../../../lib/nav";
import { getModuleById } from "../../../lib/modules";
import { getTopicById } from "../../../lib/topics";
import { getAppById } from "../../../lib/apps";

export const dynamic = 'force-dynamic';

const normalize = (s: string) =>
    (s ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

const getCachedArticles = cache(async () => {
    return await listPublishedArticles();
});



type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;

    const articles = await getCachedArticles();
    const safeSlug = normalize(slug);

    const a = articles.find((x) => normalize(x.slug) === safeSlug);
    if (!a) return {};

    const site = process.env.SITE_URL || "";
    return {
        title: `${a.title} | Help Center`,
        description: a.excerpt,
        alternates: { canonical: site ? `${site}/docs/${a.slug}` : undefined },
        openGraph: {
            title: a.title,
            description: a.excerpt,
            type: "article",
        },
        twitter: {
            card: "summary",
            title: a.title,
            description: a.excerpt,
        },
    };
}

import { ArticleLanguageWatcher } from "../../components/ArticleLanguageWatcher";

export default async function DocPage({ params, searchParams }: PageProps) {
    try {
        const { slug } = await params;
        const sp = await searchParams; // Await search params in Next.js 15+

        const articles = await getCachedArticles();
        const safeSlug = normalize(slug);

        const a = articles.find((x) => normalize(x.slug) === safeSlug);
        if (!a) return notFound();

        const blocks = await fetchAllBlocks(a.id);
        const n2m = new NotionToMarkdown({ notionClient: notion });
        const mdBlocks = await n2m.blocksToMarkdown(blocks);
        const mdString = n2m.toMarkdownString(mdBlocks).parent || "";

        // Breadcrumb Context Logic
        const contextAppId = typeof sp.appId === 'string' ? sp.appId : null;
        const contextModuleId = typeof sp.moduleId === 'string' ? sp.moduleId : null;
        const contextTopicId = typeof sp.topicId === 'string' ? sp.topicId : null;

        let bApp = null;
        let bModule = null;
        let bTopic = null;

        if (contextAppId) {
            bApp = await getAppById(contextAppId);
        }
        if (contextModuleId) {
            bModule = await getModuleById(contextModuleId);
            // If we have a module but no app object yet, try to fetch it
            if (bModule && !bApp && bModule.appIds?.[0]) {
                bApp = await getAppById(bModule.appIds[0]);
            }
        }
        if (contextTopicId) {
            bTopic = await getTopicById(contextTopicId);
        }

        const isContextual = !!bModule && !!bApp;

        // Calculate redirect URL for language changes
        let redirectUrl = "/";
        if (isContextual) {
            if (bTopic) {
                redirectUrl = `/?app=${bApp?.key}&module=${bModule?.key}&topic=${bTopic.key}`;
            } else {
                redirectUrl = `/?app=${bApp?.key}&module=${bModule?.key}`;
            }
        }

        return (
            <div className="mx-auto max-w-7xl px-6 py-8">
                <ArticleLanguageWatcher redirectUrl={redirectUrl} />
                <a href="#main-content" className="sr-only focus:not-sr-only mb-4 block">Skip to content</a>
                {/* Breadcrumb - Moved out of the article box */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 overflow-x-auto whitespace-nowrap px-1">
                    <Link href="/" className="hover:text-[var(--brand-blue)] transition-colors flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Home
                    </Link>

                    {isContextual ? (
                        <>
                            <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            <Link
                                href={`/?app=${bApp?.key}&module=${bModule?.key}`}
                                className="hover:text-[var(--brand-blue)] transition-colors"
                            >
                                {bModule?.name}
                            </Link>
                            <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            <Link
                                href={bTopic ? `/?app=${bApp?.key}&module=${bModule?.key}&topic=${bTopic.key}` : "#"}
                                className="hover:text-[var(--brand-blue)] transition-colors"
                            >
                                {bTopic ? bTopic.name : "All Articles"}
                            </Link>
                        </>
                    ) : (
                        <>
                            {a.app && (
                                <>
                                    <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    <Link href={`/a/${normalize(a.app)}`} className="hover:text-[var(--brand-blue)] transition-colors">
                                        {a.app}
                                    </Link>
                                </>
                            )}
                            {a.category && (
                                <>
                                    <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    <Link
                                        href={a.app ? `/a/${normalize(a.app)}/m/${normalize(a.category)}` : "#"}
                                        className="hover:text-[var(--brand-blue)] transition-colors"
                                    >
                                        {a.category}
                                    </Link>
                                </>
                            )}
                        </>
                    )}

                    <svg className="w-3 h-3 text-[var(--neutral-border)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    <span className="text-[var(--text-primary)] font-medium truncate max-w-[250px]">
                        {a.title}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    <aside className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] flex flex-col">
                        <div className="sticky top-0 z-20 bg-[var(--bg-card)] p-4 border-b border-[var(--neutral-border)]">
                            <ArticleSearch />
                        </div>
                        <div className="p-4 space-y-6">
                            <TableOfContents content={mdString} />

                            {a.relatedArticleIds && a.relatedArticleIds.length > 0 && (
                                <>
                                    <div className="border-t border-[var(--neutral-border)]"></div>
                                    <div>
                                        <div className="text-sm font-semibold mb-3">Related Articles</div>
                                        <div className="space-y-2">
                                            {articles
                                                .filter((art) => a.relatedArticleIds?.includes(art.id))
                                                .map((art) => (
                                                    <Link
                                                        key={art.id}
                                                        href={`/docs/${art.slug}`}
                                                        className="block rounded-md px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--neutral-bg)] transition-colors border border-transparent hover:border-[var(--neutral-border)]"
                                                    >
                                                        {art.title}
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>

                    <main id="main-content" className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-8">

                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{a.title}</h1>
                        {a.excerpt ? <ExcerptRenderer excerpt={a.excerpt} excerptRich={a.excerptRich} /> : null}

                        <div className="mt-8 border-t border-[var(--neutral-border)] pt-8">
                            <article className="prose prose-invert max-w-none">
                                <NotionRenderer blocks={blocks} allArticles={articles as any} />
                            </article>
                        </div>
                    </main>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to load article:", error);
        return notFound();
    }
}
