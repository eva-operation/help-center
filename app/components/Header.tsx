"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../../lib/i18n";
import { Language } from "../../lib/translations";

export default function Header() {
    const [imgError, setImgError] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const [langOpen, setLangOpen] = useState(false);

    const languages: { key: Language; label: string; code: string }[] = [
        { key: "en", label: "English", code: "EN" },
        { key: "tr", label: "Türkçe", code: "TR" },
        { key: "zh", label: "中文", code: "ZH" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--neutral-border)] bg-[var(--bg-secondary)]">
            <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    {!imgError ? (
                        // regular image; if it fails to load we show fallback
                        // object-contain ensures full logo is visible and not cropped
                        <img
                            src="https://lh3.googleusercontent.com/sitesv/APaQ0SSIWw7pyR6RzZBhrcCxN5xffcTXeHhRj3vbl2UbbL-AVVlpmJPBswVzno6tK8FxyoFg0WtZsOJSST7zyn0PcngGItJHrzPevW4LDWCSoHdLGPondTnbT2wp9Y0MB7rVKGNWcPRLlH6n6uGlc7e9FQcsOUKYBsiO1Pmd-RM8OGq9v79sTN46Rhp-xwTJVQdHd9LItNlXKKGxlYI-EjxXByYQzhBxh9NNNsKyIB4=w1280"
                            alt="Logo"
                            className="w-32 h-auto object-contain"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        // inline SVG fallback (visible until you place public/logo.png)
                        <div className="w-36 h-8 flex items-center">
                            <svg viewBox="0 0 800 200" className="w-36 h-8 object-contain" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="g1" x1="0" x2="1">
                                        <stop offset="0%" stopColor="#6b21a8" />
                                        <stop offset="50%" stopColor="#00d4ff" />
                                        <stop offset="100%" stopColor="#f3a7c1" />
                                    </linearGradient>
                                </defs>
                                <g fill="url(#g1)">
                                    <path d="M60 100a40 40 0 1 1 0-0z" />
                                    <path d="M140 60 L180 120 L220 40 L260 120 L300 60" stroke="none" />
                                </g>
                                <text x="320" y="125" fontFamily="Poppins, Arial" fontSize="64" fill="currentColor">Eva</text>
                            </svg>
                        </div>
                    )}
                </Link>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--neutral-bg)] transition-colors text-[var(--text-primary)]"
                        >
                            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="text-sm font-bold tracking-tight">
                                {languages.find(l => l.key === language)?.code}
                            </span>
                        </button>

                        {langOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-36 rounded-lg bg-[var(--bg-card)] border border-[var(--neutral-border)] shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.key}
                                            onClick={() => {
                                                setLanguage(lang.key);
                                                setLangOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${language === lang.key
                                                ? "bg-[var(--brand-blue)] text-white"
                                                : "text-[var(--text-primary)] hover:bg-[var(--neutral-bg)]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold opacity-80">{lang.code}</span>
                                                <span>{lang.label}</span>
                                            </div>
                                            {language === lang.key && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <ThemeToggle />
                    <Link href="/contact" className="text-sm text-[var(--text-primary)] hover:text-[var(--brand-blue)]">
                        {t.header.contactUs}
                    </Link>
                    <Link href="/signup" className="ml-2 inline-block bg-[var(--brand-blue)] text-white text-sm px-3 py-1.5 rounded-md hover:opacity-95">
                        {t.header.signUp}
                    </Link>
                </div>
            </div>
        </header>
    );
}
