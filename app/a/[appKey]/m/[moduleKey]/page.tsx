import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppByKey } from "../../../../../lib/apps";
import { getModuleByKey, listModulesByAppId } from "../../../../../lib/modules";
import { listTopicsByAppAndModule } from "../../../../../lib/topics";

type PageProps = {
    params: Promise<{ appKey: string; moduleKey: string }>;
};

export default async function ModulePage({ params }: PageProps) {
    const { appKey, moduleKey } = await params;

    const app = await getAppByKey(appKey);
    if (!app) return notFound();

    const modules = await listModulesByAppId(app.id);
    const activeModule = modules.find((m) => m.key === moduleKey) || null;
    if (!activeModule) return notFound();

    const topics = await listTopicsByAppAndModule(app.id, activeModule.id);

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
            </aside>

            <main>
                <div className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-6">
                    <div className="flex items-start gap-4">
                        {activeModule.iconUrl ? (
                            <img
                                src={activeModule.iconUrl}
                                alt={activeModule.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-[var(--brand-purple)] flex items-center justify-center flex-shrink-0">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        )}
                        <div>
                            <div className="text-xs text-[var(--text-muted)]">Module</div>
                            <h1 className="mt-1 text-2xl font-semibold">{activeModule.name}</h1>
                            {activeModule.description ? (
                                <p className="mt-2 text-sm text-[var(--text-secondary)]">{activeModule.description}</p>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((t) => (
                        <Link
                            key={t.id}
                            href={`/a/${app.key}/m/${activeModule.key}/t/${t.key}`}
                            className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-5 hover:bg-[var(--neutral-bg)] transition"
                        >
                            <div className="font-medium">{t.name}</div>
                            {t.description ? (
                                <div className="mt-2 text-sm text-[var(--text-secondary)]">{t.description}</div>
                            ) : null}
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
