import { NextRequest, NextResponse } from "next/server";
import { listModulesByAppId } from "../../../lib/modules";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const appId = searchParams.get("appId");

    if (!appId) {
        return NextResponse.json({ error: "appId is required" }, { status: 400 });
    }

    try {
        const modules = await listModulesByAppId(appId);
        return NextResponse.json(modules);
    } catch (error) {
        console.error("Error fetching modules:", error);
        return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 });
    }
}
