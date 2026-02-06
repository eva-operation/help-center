import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[var(--text-secondary)]">Loading search...</div>
            </div>
        }>
            <SearchClient />
        </Suspense>
    );
}
