"use client";

import React from "react";

export default function InternalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            {children}
        </div>
    );
}
