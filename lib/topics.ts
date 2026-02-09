import { notion } from "./notion";
import { getPropText, getRelationIds, getFileUrl, getIconUrl } from "./notion_helpers";
import type { HelpCenterTopic } from "./types";

export const NOTION_TOPICS_DB_ID = process.env.NOTION_TOPICS_DB_ID || "";

const REL_APP_ON_TOPICS = "Help Center Apps"; // limit 1
const REL_MODULES_ON_TOPICS = "Help Center Modules";

export async function listTopicsByAppAndModule(appId: string, moduleId: string, visibility: string = "Public"): Promise<HelpCenterTopic[]> {
    if (!NOTION_TOPICS_DB_ID) throw new Error("NOTION_TOPICS_DB_ID is missing");
    if (!appId || !moduleId) return [];

    let res;
    try {
        res = await notion.databases.query({
            database_id: NOTION_TOPICS_DB_ID,
            filter: {
                and: [
                    { property: "Status", select: { equals: "Active" } },
                    { property: "Visibility", select: { equals: visibility } },
                    { property: REL_APP_ON_TOPICS, relation: { contains: appId } },
                    { property: REL_MODULES_ON_TOPICS, relation: { contains: moduleId } },
                ],
            },
            sorts: [{ property: "Order", direction: "ascending" }],
        });
    } catch (error: any) {
        if (error.message.includes('Visibility')) {
            console.warn(`Visibility property missing in Topics DB (${NOTION_TOPICS_DB_ID})`);
            res = await notion.databases.query({
                database_id: NOTION_TOPICS_DB_ID,
                filter: {
                    and: [
                        { property: "Status", select: { equals: "Active" } },
                        { property: REL_APP_ON_TOPICS, relation: { contains: appId } },
                        { property: REL_MODULES_ON_TOPICS, relation: { contains: moduleId } },
                    ],
                },
                sorts: [{ property: "Order", direction: "ascending" }],
            });
        } else {
            throw error;
        }
    }

    return res.results.map((page: any) => {
        const p = page.properties || {};
        const appIds = getRelationIds(p[REL_APP_ON_TOPICS]);
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
            appId: appIds?.[0] || "",
            moduleIds: getRelationIds(p[REL_MODULES_ON_TOPICS]),
        } satisfies HelpCenterTopic;
    });
}

export async function getTopicByKey(topicKey: string): Promise<HelpCenterTopic | null> {
    if (!NOTION_TOPICS_DB_ID) throw new Error("NOTION_TOPICS_DB_ID is missing");
    const safeKey = (topicKey || "").trim();
    if (!safeKey) return null;

    const res = await notion.databases.query({
        database_id: NOTION_TOPICS_DB_ID,
        filter: { and: [{ property: "Key", rich_text: { equals: safeKey } }] },
    });

    const page: any = res.results?.[0];
    if (!page) return null;

    const p = page.properties || {};
    const appIds = getRelationIds(p[REL_APP_ON_TOPICS]);

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
        status: String(getPropText(p.Status) || ""),
        appId: appIds?.[0] || "",
        moduleIds: getRelationIds(p[REL_MODULES_ON_TOPICS]),
    };
}

export async function getTopicById(topicId: string): Promise<HelpCenterTopic | null> {
    if (!topicId) return null;
    try {
        const page: any = await notion.pages.retrieve({ page_id: topicId });
        if (!page) return null;

        const p = page.properties || {};
        const appIds = getRelationIds(p[REL_APP_ON_TOPICS]);

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
            status: String(getPropText(p.Status) || ""),
            appId: appIds?.[0] || "",
            moduleIds: getRelationIds(p[REL_MODULES_ON_TOPICS]),
        };
    } catch (e) {
        console.error("Failed to fetch topic", e);
        return null;
    }
}
