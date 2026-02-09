import { notion } from "./notion";
import { getPropText, getRelationIds, getFileUrl, getIconUrl } from "./notion_helpers";
import type { HelpCenterModule } from "./types";

export const NOTION_MODULES_DB_ID = process.env.NOTION_MODULES_DB_ID || "";

const REL_APPS_ON_MODULES = "Help Center Apps";

export async function listModulesByAppId(appId: string, visibility: string = "Public"): Promise<HelpCenterModule[]> {
    if (!NOTION_MODULES_DB_ID) throw new Error("NOTION_MODULES_DB_ID is missing");
    if (!appId) return [];

    let res;
    try {
        res = await notion.databases.query({
            database_id: NOTION_MODULES_DB_ID,
            filter: {
                and: [
                    { property: "Status", select: { equals: "Active" } },
                    { property: "Visibility", select: { equals: visibility } },
                    { property: REL_APPS_ON_MODULES, relation: { contains: appId } },
                ],
            },
            sorts: [
                { property: "Order", direction: "ascending" },
                { property: "Name", direction: "ascending" },
            ],
        });
    } catch (error: any) {
        if (error.message.includes('Visibility')) {
            console.warn(`Visibility property missing in Modules DB (${NOTION_MODULES_DB_ID})`);
            res = await notion.databases.query({
                database_id: NOTION_MODULES_DB_ID,
                filter: {
                    and: [
                        { property: "Status", select: { equals: "Active" } },
                        { property: REL_APPS_ON_MODULES, relation: { contains: appId } },
                    ],
                },
                sorts: [
                    { property: "Order", direction: "ascending" },
                    { property: "Name", direction: "ascending" },
                ],
            });
        } else {
            throw error;
        }
    }

    return res.results.map((page: any) => {
        const p = page.properties || {};
        return {
            id: page.id,
            name: String(getPropText(p.Name) || ""),
            nameTR: String(getPropText(p["TR Name"]) || ""),
            nameZH: String(getPropText(p["ZH Name"]) || ""),
            key: String(getPropText(p.Key) || "").trim(),
            description: String(getPropText(p.Description) || ""),
            descriptionTR: String(getPropText(p["TR Description"]) || ""),
            descriptionZH: String(getPropText(p["ZH Description"]) || ""),
            iconUrl: getFileUrl(p.Icon) || getIconUrl(page.icon),
            order: Number(getPropText(p.Order) || 0),
            status: String(getPropText(p.Status) || "Active"),
            visibility: String(getPropText(p.Visibility) || "Public"),
            appIds: getRelationIds(p[REL_APPS_ON_MODULES]),
        } satisfies HelpCenterModule;
    });
}

export async function getModuleByKey(moduleKey: string): Promise<HelpCenterModule | null> {
    if (!NOTION_MODULES_DB_ID) throw new Error("NOTION_MODULES_DB_ID is missing");
    const safeKey = (moduleKey || "").trim();
    if (!safeKey) return null;

    const res = await notion.databases.query({
        database_id: NOTION_MODULES_DB_ID,
        filter: { and: [{ property: "Key", rich_text: { equals: safeKey } }] },
    });

    const page: any = res.results?.[0];
    if (!page) return null;

    const p = page.properties || {};
    return {
        id: page.id,
        name: String(getPropText(p.Name) || ""),
        nameTR: String(getPropText(p["TR Name"]) || ""),
        nameZH: String(getPropText(p["ZH Name"]) || ""),
        key: String(getPropText(p.Key) || "").trim(),
        iconUrl: getFileUrl(p.Icon) || getIconUrl(page.icon),
        description: String(getPropText(p.Description) || ""),
        descriptionTR: String(getPropText(p["TR Description"]) || ""),
        descriptionZH: String(getPropText(p["ZH Description"]) || ""),
        order: Number(getPropText(p.Order) || 0),
        status: String(getPropText(p.Status) || ""),
        appIds: getRelationIds(p[REL_APPS_ON_MODULES]),
    };
}

export async function getModuleById(moduleId: string): Promise<HelpCenterModule | null> {
    if (!moduleId) return null;
    try {
        const page: any = await notion.pages.retrieve({ page_id: moduleId });
        if (!page) return null;

        const p = page.properties || {};
        return {
            id: page.id,
            name: String(getPropText(p.Name) || ""),
            nameTR: String(getPropText(p["TR Name"]) || ""),
            nameZH: String(getPropText(p["ZH Name"]) || ""),
            key: String(getPropText(p.Key) || "").trim(),
            iconUrl: getFileUrl(p.Icon) || getIconUrl(page.icon),
            description: String(getPropText(p.Description) || ""),
            descriptionTR: String(getPropText(p["TR Description"]) || ""),
            descriptionZH: String(getPropText(p["ZH Description"]) || ""),
            order: Number(getPropText(p.Order) || 0),
            status: String(getPropText(p.Status) || ""),
            appIds: getRelationIds(p[REL_APPS_ON_MODULES]),
        };
    } catch (e) {
        console.error("Failed to fetch module", e);
        return null;
    }
}
