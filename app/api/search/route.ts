import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "../../../lib/articles";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = String(searchParams.get("query") || "").trim();
    const lang = searchParams.get("lang") || undefined;
    const visibility = searchParams.get("visibility") || "Public";

    if (!q) {
        return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    try {
        const results = await searchArticles(q, lang, visibility);
        return NextResponse.json(results);
    } catch (err) {
        console.error("Search error:", err);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
