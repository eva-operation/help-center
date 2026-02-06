import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppByKey } from "../../../../../../../lib/apps";
import { listModulesByAppId } from "../../../../../../../lib/modules";
import { listTopicsByAppAndModule, getTopicByKey } from "../../../../../../../lib/topics";
import { listArticlesByTopicId } from "../../../../../../../lib/articles";

type PageProps = {
    params: Promise<{ appKey: string; moduleKey: string; topicKey: string }>;
};

export default async function TopicPage({ params }: PageProps) {
    const { appKey, moduleKey, topicKey } = await params;

    const app = await getAppByKey(appKey);
    if (!app) return notFound();

    const modules = await listModulesByAppId(app.id);
    const activeModule = modules.find((m) => m.key === moduleKey) || null;
    if (!activeModule) return notFound();

    const topics = await listTopicsByAppAndModule(app.id, activeModule.id);
    const activeTopic = topics.find((t) => t.key === topicKey) || null;
    if (!activeTopic) return notFound();

    const articles = await listArticlesByTopicId(activeTopic.id);

    return (
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <aside className="h-fit rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-4">
                <div className="text-xs text-[var(--text-muted)]">{app.name}</div>
                <div className="mt-1 text-sm font-semibold">Modules</div>

                <div className="mt-3 space-y-1">
                    {modules.map((m) => (
                        <Link
                            key={m.id}
                            href={`/a/${app.key}/m/${m.key}`}
                            className={[
                                "block rounded-md px-2 py-1 text-sm",
                                m.key === activeModule.key ? "bg-[var(--brand-blue)] text-white" : "hover:bg-[var(--neutral-bg)]",
                            ].join(" ")}
                        >
                            {m.name}
                        </Link>
                    ))}
                </div>

                <div className="mt-5 text-sm font-semibold">Topics</div>
                <div className="mt-3 space-y-1">
                    {topics.map((t) => (
                        <Link
                            key={t.id}
                            href={`/a/${app.key}/m/${activeModule.key}/t/${t.key}`}
                            className={[
                                "block rounded-md px-2 py-1 text-sm",
                                t.key === activeTopic.key ? "bg-[var(--neutral-bg)]" : "hover:bg-[var(--neutral-bg)]",
                            ].join(" ")}
                        >
                            {t.name}
                        </Link>
                    ))}
                </div>
            </aside>

            <main>
                <div className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-6">
                    <div className="flex items-start gap-4">
                        {activeTopic.iconUrl ? (
                            <img
                                src={activeTopic.iconUrl}
                                alt={activeTopic.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-[var(--brand-purple)] flex items-center justify-center flex-shrink-0">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        )}
                        <div>
                            <div className="text-xs text-[var(--text-muted)]">
                                {activeModule.name} / Topic
                            </div>
                            <h1 className="mt-1 text-2xl font-semibold">{activeTopic.name}</h1>
                            {activeTopic.description ? (
                                <p className="mt-2 text-sm text-[var(--text-secondary)]">{activeTopic.description}</p>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-3">
                    {articles.map((a) => (
                        <Link
                            key={a.id}
                            href={`/docs/${a.slug}`}
                            className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-4 hover:bg-[var(--neutral-bg)] transition"
                        >
                            <div className="font-medium">{a.title}</div>
                            {a.excerpt ? (
                                <div className="mt-1 text-sm text-[var(--text-secondary)]">{a.excerpt}</div>
                            ) : null}
                        </Link>
                    ))}

                    {articles.length === 0 ? (
                        <div className="text-sm text-[var(--text-secondary)]">
                            No published public articles found for this topic yet.
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
}
