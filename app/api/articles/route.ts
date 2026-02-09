import { NextRequest, NextResponse } from "next/server";
import { listArticlesByTopicId, listArticlesByModuleId, listArticlesByAppId } from "../../../lib/articles";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");
    const moduleId = searchParams.get("moduleId");
    const appId = searchParams.get("appId");
    const lang = searchParams.get("lang") || undefined;
    const visibility = searchParams.get("visibility") || "Public";

    try {
        if (topicId) {
            const articles = await listArticlesByTopicId(topicId, lang, visibility);
            return NextResponse.json(articles);
        } else if (moduleId) {
            const articles = await listArticlesByModuleId(moduleId, lang, visibility);
            return NextResponse.json(articles);
        } else if (appId) {
            const articles = await listArticlesByAppId(appId, lang, visibility);
            return NextResponse.json(articles);
        } else {
            return NextResponse.json({ error: "Either topicId, moduleId or appId is required" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}
