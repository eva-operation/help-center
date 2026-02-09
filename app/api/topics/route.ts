import { NextRequest, NextResponse } from "next/server";
import { listTopicsByAppAndModule } from "../../../lib/topics";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get("appId");
    const moduleId = searchParams.get("moduleId");

    const visibility = searchParams.get("visibility") || "Public";

    if (!appId || !moduleId) {
        return NextResponse.json({ error: "appId and moduleId are required" }, { status: 400 });
    }

    try {
        const topics = await listTopicsByAppAndModule(appId, moduleId, visibility);
        return NextResponse.json(topics);
    } catch (error) {
        console.error("Error fetching topics:", error);
        return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
    }
}
