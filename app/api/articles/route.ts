import { NextRequest, NextResponse } from "next/server";
import { listArticlesByTopicId, listArticlesByModuleId } from "../../../lib/articles";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");
    const moduleId = searchParams.get("moduleId");
    const lang = searchParams.get("lang") || undefined;

    try {
        if (topicId) {
            const articles = await listArticlesByTopicId(topicId, lang);
            return NextResponse.json(articles);
        } else if (moduleId) {
            const articles = await listArticlesByModuleId(moduleId, lang);
            return NextResponse.json(articles);
        } else {
            return NextResponse.json({ error: "Either topicId or moduleId is required" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}
