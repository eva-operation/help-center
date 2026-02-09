import React from "react";

export default function InternalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            <div className="bg-amber-600 text-white text-[10px] font-bold py-1 px-4 text-center tracking-widest uppercase z-40 sticky top-0">
                Internal Help Center - Confidential Information
            </div>
            {children}
        </div>
    );
}
