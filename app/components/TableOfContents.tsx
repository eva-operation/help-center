"use client";

import { useEffect, useState } from "react";
import { generateHeadingId } from "../utils/headingUtils";
import { useLanguage } from "../../lib/i18n";

interface TableOfContentsEntry {
    id: string;
    title: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TableOfContentsEntry[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // ... (useEffect remains same as before)
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const extractedHeadings: TableOfContentsEntry[] = [];
        const usedIds = new Set<string>();
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const rawTitle = match[2];
            const title = rawTitle.replace(/(\*\*|__)(.*?)\1/g, "$2").replace(/(\*|_)(.*?)\1/g, "$2");
            let baseId = generateHeadingId(title) || "heading";

            let finalId = baseId;
            let counter = 1;
            while (usedIds.has(finalId)) {
                finalId = `${baseId}-${counter}`;
                counter++;
            }
            usedIds.add(finalId);

            extractedHeadings.push({
                id: finalId,
                title,
                level
            });
        }

        setHeadings(extractedHeadings);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px", threshold: 0 }
        );

        setTimeout(() => {
            const elements = document.querySelectorAll("h1, h2, h3");
            elements.forEach((el) => {
                if (el.id) {
                    observer.observe(el);
                }
            });
        }, 100);

        return () => observer.disconnect();
    }, [content]);

    if (headings.length === 0) {
        return null;
    }

    const getIndent = (level: number) => {
        if (level === 1) return "";
        if (level === 2) return "ml-3";
        if (level === 3) return "ml-6";
        return "";
    };

    return (
        <div className="rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] overflow-hidden">
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between p-4 hover:bg-[var(--neutral-bg)] transition-colors"
            >
                <div className="text-sm font-semibold">{(t as any).article.tableOfContents}</div>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`px-4 pb-4 space-y-1 transition-all duration-200 ease-in-out ${isCollapsed ? "max-h-0 opacity-0 pointer-events-none" : "max-h-[2000px] opacity-100"}`}>
                <nav className="space-y-1">
                    {headings.map((heading) => (
                        <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className={`block text-sm rounded-md px-3 py-1.5 transition-colors ${activeId === heading.id
                                ? "bg-[var(--brand-blue)] text-white font-medium shadow-sm"
                                : "text-[var(--text-primary)] hover:bg-[var(--neutral-bg-hover)]"
                                } ${getIndent(heading.level)}`}
                        >
                            {heading.title}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
