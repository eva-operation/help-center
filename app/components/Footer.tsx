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
                                    src="https://lh3.googleusercontent.com/sitesv/APaQ0STn1U71ADo5WKknsUpOfU5cSwv_X4CdLcTYG-mnvIUZyvlL5LaQ0WP0ZkWJqKIxO7PQqp_jk0YOWvZpIPnOMIwvu2a3dEsnBeIenS3Ec8A2b-lx9Nds9O1EzrFiEsqyzG7zVjTXBn6qJzgGs6g6AZilf2J4cCbK9qgIspD2E3mXXOx3qhhm-ievbChP3D7wrdz740XY99oSUIGPoq4rl_OxehIBypclr3vCirc=w1280"
                                    alt="Eva Logo"
                                    className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                                    <span className="text-[var(--brand-blue)]">Intelligence</span>
                                </span>
                            </a>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {language === 'tr'
                                ? "Eva E-Commerce Intelligence için kapsamlı dokümantasyon ve bilgi merkezi."
                                : "Comprehensive documentation and resource center for Eva E-Commerce Intelligence."}
                        </p>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            {language === 'tr' ? 'Kaynaklar' : 'Resources'}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    {language === 'tr' ? 'Intelligence Hub' : 'Intelligence Hub'}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            {language === 'tr' ? 'Destek' : 'Support'}
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/search" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    {language === 'tr' ? 'Arama' : 'Search'}
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@eva.guru" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    {language === 'tr' ? 'İletişim' : 'Contact Support'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Language Switch */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                            {language === 'tr' ? 'Dil' : 'Language'}
                        </h4>
                        <div className="flex gap-4">
                            <button
                                className={`text-sm ${language === 'tr' ? 'text-[var(--brand-blue)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'}`}
                                onClick={() => setLanguage('tr')}
                            >
                                TR
                            </button>
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
                        © {currentYear} Eva E-Commerce Intelligence. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
                    </p>
                    <div className="flex gap-6 text-xs text-[var(--text-muted)]">
                        <Link href="/privacy" className="hover:text-[var(--brand-blue)] transition-colors">
                            {language === 'tr' ? 'Gizlilik' : 'Privacy Policy'}
                        </Link>
                        <Link href="/terms" className="hover:text-[var(--brand-blue)] transition-colors">
                            {language === 'tr' ? 'Şartlar' : 'Terms of Service'}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
