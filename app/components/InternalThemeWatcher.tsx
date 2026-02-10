"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "../../lib/theme";

export function InternalThemeWatcher() {
    const pathname = usePathname();
    const { setTheme } = useTheme();

    useEffect(() => {
        if (pathname?.startsWith("/internal")) {
            setTheme("dark");
        }
    }, [pathname, setTheme]);

    return null;
}
