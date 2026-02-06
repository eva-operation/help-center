import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppByKey } from "../../../lib/apps";
import { listModulesByAppId } from "../../../lib/modules";

type PageProps = {
    params: Promise<{ appKey: string }>;
};

export default async function AppPage({ params }: PageProps) {
    const { appKey } = await params;

    const app = await getAppByKey(appKey);
    if (!app) return notFound();

    const modules = await listModulesByAppId(app.id);

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <div className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-6">
                <div className="flex items-start gap-4">
                    {app.iconUrl ? (
                        <img
                            src={app.iconUrl}
                            alt={app.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center flex-shrink-0">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                    )}
                    <div>
                        <div className="text-xs text-[var(--text-muted)]">App</div>
                        <h1 className="mt-1 text-2xl font-semibold">{app.name}</h1>
                        {app.description ? (
                            <p className="mt-2 text-sm text-[var(--text-secondary)]">{app.description}</p>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-3">
                {modules.map((m) => (
                    <Link
                        key={m.id}
                        href={`/a/${app.key}/m/${m.key}`}
                        className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] p-4 hover:bg-[var(--neutral-bg)] transition"
                    >
                        <div className="font-medium">{m.name}</div>
                        {m.description ? (
                            <div className="mt-1 text-sm text-[var(--text-secondary)]">{m.description}</div>
                        ) : null}
                    </Link>
                ))}
            </div>
        </main>
    );
}
