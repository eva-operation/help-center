"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/i18n";

export default function Footer() {
    const { language, setLanguage, t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--neutral-border)] py-12 mt-auto">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <a href="https://eva.guru" className="flex items-center gap-3 group">
                                <img
                                    src="https://orchid-hexagon-821.notion.site/image/attachment%3Aab2c4f67-54b6-47d6-8b58-b6dc4cf09dcf%3Aeva_logo_gradient_for_dark_bg_use_medium.png?table=block&id=301505ff-3c1f-8051-849f-cd82e81f5edb&spaceId=0c8505ff-3c1f-81ec-a609-00038f16f0ac&width=1420&userId=&cache=v2"
                                    alt="Eva Logo"
                                    className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                                    <span className="text-[var(--brand-blue)]">Intelligence</span>
                                </span>
                            </a>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {t.footer.description}
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            {t.footer.resources}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    {t.footer.hub}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            {t.footer.support}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/search" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    {t.footer.search}
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:customersuccess@eva.guru" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    {t.footer.contactSupport}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Language Switch */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            {t.footer.language}
                        </h4>
                        <div className="flex gap-4">
                            <button
                                className={`text-sm ${language === 'en' ? 'text-[var(--brand-blue)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'}`}
                                onClick={() => setLanguage('en')}
                            >
                                EN
                            </button>
                            <button
                                className={`text-sm ${language === 'zh' ? 'text-[var(--brand-blue)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'}`}
                                onClick={() => setLanguage('zh')}
                            >
                                ZH
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--neutral-border)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[var(--text-muted)] text-center md:text-left">
                        © {currentYear} Eva E-Commerce Intelligence. {t.footer.allRightsReserved}
                    </p>
                    <div className="flex gap-6 text-xs text-[var(--text-muted)]">
                        <a href="https://eva.guru/privacy-policy/" className="hover:text-[var(--brand-blue)] transition-colors">
                            {t.footer.privacyPolicy}
                        </a>
                        <a href="https://eva.guru/terms-and-conditions/" className="hover:text-[var(--brand-blue)] transition-colors">
                            {t.footer.termsOfService}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
