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
                <a href="https://eva.guru" className="flex items-center gap-3 group">
                    <img
                        src="https://lh3.googleusercontent.com/sitesv/APaQ0STn1U71ADo5WKknsUpOfU5cSwv_X4CdLcTYG-mnvIUZyvlL5LaQ0WP0ZkWJqKIxO7PQqp_jk0YOWvZpIPnOMIwvu2a3dEsnBeIenS3Ec8A2b-lx9Nds9O1EzrFiEsqyzG7zVjTXBn6qJzgGs6g6AZilf2J4cCbK9qgIspD2E3mXXOx3qhhm-ievbChP3D7wrdz740XY99oSUIGPoq4rl_OxehIBypclr3vCirc=w1280"
                        alt="Eva Logo"
                        className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                    <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                        <span className="text-[var(--brand-blue)]">E-Commerce Intelligence</span>
                    </span>
                </a>

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
