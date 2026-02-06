"use client";

import Link from "next/link";
import { useLanguage } from "../../lib/i18n";

export default function Footer() {
    const { language, t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--neutral-border)] py-12 mt-auto">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="https://lh3.googleusercontent.com/sitesv/APaQ0SQa24_mE_XWc26sJX41irqiNYgQAAdB_I_Y5PlAuL-FQ_RjbYuQh-y8xxwHJdobxO422vzzKw25nNjUPTI9oFMTCgaXwZT5drB-mQhnoC0hjug9j4wWwTlyARtGlechiAq9BFps1r6fO5YDVDjz10IQQzFeWke6qGSoFjqX5bPsN29bruqtxy9FxsC-1lYV7vu0oHMjNUgbxjQ1zESb_xy6Bx5_cKhQFO9uRb0=w1280"
                                alt="Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-[var(--brand-purple)] to-[var(--brand-blue)] bg-clip-text text-transparent italic">
                                Eva Operation
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {language === 'tr'
                                ? "Eva Operation sistemleri için kapsamlı dokümantasyon ve yardım merkezi."
                                : "Comprehensive documentation and help center for Eva Operation systems."}
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
                                    {language === 'tr' ? 'Yardım Merkezi' : 'Help Center'}
                                </Link>
                            </li>
                            <li>
                                <a href="https://github.com/eva-operation" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors">
                                    GitHub
                                </a>
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
                                className={`text-sm ${language === 'tr' ? 'text-[var(--brand-blue)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'}`}
                                onClick={() => { localStorage.setItem('lang', 'tr'); window.location.reload(); }}
                            >
                                TR
                            </button>
                            <button
                                className={`text-sm ${language === 'en' ? 'text-[var(--brand-blue)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'}`}
                                onClick={() => { localStorage.setItem('lang', 'en'); window.location.reload(); }}
                            >
                                EN
                            </button>
                            <button
                                className={`text-sm ${language === 'zh' ? 'text-[var(--brand-blue)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors'}`}
                                onClick={() => { localStorage.setItem('lang', 'zh'); window.location.reload(); }}
                            >
                                ZH
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--neutral-border)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[var(--text-muted)] text-center md:text-left">
                        © {currentYear} Eva Operation Group. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
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
