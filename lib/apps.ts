import { notion } from "./notion";
import { readPlainText, getPropText, getFileUrl, getIconUrl } from "./notion_helpers";
import type { HelpCenterApp } from "./types";

const DB_APPS_NAME = "Help Center Apps";

async function resolveDatabaseIdByName(dbName: string): Promise<string> {
    throw new Error(
        `Missing DB id for "${dbName}". Add env vars: NOTION_APPS_DB_ID, NOTION_MODULES_DB_ID, NOTION_TOPICS_DB_ID, NOTION_ARTICLES_DB_ID`
    );
}

export const NOTION_APPS_DB_ID = process.env.NOTION_APPS_DB_ID || "";

export async function listApps(visibility: string = "Public"): Promise<HelpCenterApp[]> {
    if (!NOTION_APPS_DB_ID) throw new Error("NOTION_APPS_DB_ID is missing");

    let res;
    try {
        res = await notion.databases.query({
            database_id: NOTION_APPS_DB_ID,
            filter: {
                and: [
                    { property: "Status", select: { equals: "Active" } },
                    { property: "Visibility", select: { equals: visibility } },
                ]
            },
            sorts: [{ property: "Order", direction: "ascending" }],
        });
    } catch (error: any) {
        // If Visibility property is missing in Notion, fallback to just Status filter
        if (error.code === 'object_not_found' || error.message.includes('Visibility')) {
            console.warn(`Visibility property missing in Apps DB (${NOTION_APPS_DB_ID}). Showing all Active apps.`);
            res = await notion.databases.query({
                database_id: NOTION_APPS_DB_ID,
                filter: { property: "Status", select: { equals: "Active" } },
                sorts: [{ property: "Order", direction: "ascending" }],
            });
        } else {
            throw error;
        }
    }

    return res.results.map((page: any) => {
        const p = page.properties || {};
        return {
            id: page.id,
            name: getPropText(p.Name) || getPropText(p.Title) || "",
            key: String(getPropText(p.Key) || "").trim(),
            description: String(getPropText(p.Description) || ""),
            descriptionTR: String(getPropText(p["TR Description"]) || ""),
            descriptionZH: String(getPropText(p["ZH Description"]) || ""),
            iconUrl: getFileUrl(p.Icon) || getIconUrl(page.icon),
            order: Number(getPropText(p.Order) || 0),
            status: String(getPropText(p.Status) || "Active"),
            visibility: String(getPropText(p.Visibility) || "Public"),
        } satisfies HelpCenterApp;
    });
}

export async function getAppByKey(appKey: string): Promise<HelpCenterApp | null> {
    if (!NOTION_APPS_DB_ID) throw new Error("NOTION_APPS_DB_ID is missing");
    const safeKey = (appKey || "").trim();
    if (!safeKey) return null;

    const res = await notion.databases.query({
        database_id: NOTION_APPS_DB_ID,
        filter: {
            and: [
                { property: "Key", rich_text: { equals: safeKey } },
                { property: "Status", select: { equals: "Active" } },
            ],
        },
    });

    const page: any = res.results?.[0];
    if (!page) return null;

    const p = page.properties || {};
    return {
        id: page.id,
        name: String(getPropText(p.Name) || ""),
        key: String(getPropText(p.Key) || "").trim(),
        description: String(getPropText(p.Description) || ""),
        descriptionTR: String(getPropText(p["TR Description"]) || ""),
        descriptionZH: String(getPropText(p["ZH Description"]) || ""),
        iconUrl: getFileUrl(p.Icon) || getIconUrl(page.icon),
        order: Number(getPropText(p.Order) || 0),
        status: String(getPropText(p.Status) || "Active"),
    };
}

export async function getAppById(appId: string): Promise<HelpCenterApp | null> {
    if (!appId) return null;
    try {
        const page: any = await notion.pages.retrieve({ page_id: appId });
        if (!page) return null;

        const p = page.properties || {};
        return {
            id: page.id,
            name: String(getPropText(p.Name) || ""),
            key: String(getPropText(p.Key) || "").trim(),
            description: String(getPropText(p.Description) || ""),
            descriptionTR: String(getPropText(p["TR Description"]) || ""),
            descriptionZH: String(getPropText(p["ZH Description"]) || ""),
            iconUrl: getFileUrl(p.Icon) || getIconUrl(page.icon),
            order: Number(getPropText(p.Order) || 0),
            status: String(getPropText(p.Status) || "Active"),
        };
    } catch (e) {
        console.error("Failed to fetch app", e);
        return null;
    }
}
