"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../lib/i18n";

interface Props {
    redirectUrl: string;
}

export function ArticleLanguageWatcher({ redirectUrl }: Props) {
    const { language } = useLanguage();
    const router = useRouter();
    const initialLanguage = useRef(language);

    useEffect(() => {
        if (language !== initialLanguage.current) {
            router.push(redirectUrl);
        }
    }, [language, redirectUrl, router]);

    return null;
}
