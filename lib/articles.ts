import { notion } from "./notion";
import { getPropText, getRelationIds } from "./notion_helpers";
import type { HelpCenterArticle } from "./types";

export const NOTION_ARTICLES_DB_ID = process.env.NOTION_ARTICLES_DB_ID || "";

const REL_APPS_ON_ARTICLES = "Help Center Apps";
const REL_MODULES_ON_ARTICLES = "Help Center Modules";
const REL_TOPICS_ON_ARTICLES = "Help Center Topics";

/**
 * Handle language filtering.
 * Since Notion API throws a validation error if we use 'rich_text' filter on a 'select' property 
 * (and vice versa), we must specify the correct type.
 * The error confirmed the property is of type 'select'.
 */
function getLanguageFilter(language: string) {
    // If language is provided, we filter by it. 
    // We try both lowercase and uppercase as select options are case-sensitive.
    return {
        or: [
            { property: "Language", select: { equals: language } },
            { property: "Language", select: { equals: language.toUpperCase() } },
        ]
    };
}

function getVisibilityFilter(visibility: string) {
    return { property: "Visibility", select: { equals: visibility } };
}

export async function listArticlesByTopicId(topicId: string, language?: string, visibility: string = "Public"): Promise<HelpCenterArticle[]> {
    if (!NOTION_ARTICLES_DB_ID) throw new Error("NOTION_ARTICLES_DB_ID is missing");
    if (!topicId) return [];

    const filters: any[] = [
        { property: "Status", select: { equals: "Published" } },
        getVisibilityFilter(visibility),
        { property: REL_TOPICS_ON_ARTICLES, relation: { contains: topicId } },
    ];

    if (language) {
        filters.push(getLanguageFilter(language));
    }

    const res = await notion.databases.query({
        database_id: NOTION_ARTICLES_DB_ID,
        filter: { and: filters },
        sorts: [
            { property: "Order", direction: "ascending" },
            { property: "Last Reviewed", direction: "descending" },
        ],
    });

    return res.results.map((page: any) => {
        const p = page.properties || {};
        return {
            id: page.id,
            title: String(getPropText(p.Title) || ""),
            slug: String(getPropText(p.Slug) || "").trim(),
            excerpt: String(getPropText(p.Excerpt) || ""),
            status: String(getPropText(p.Status) || ""),
            visibility: String(getPropText(p.Visibility) || ""),
            contentType: String(getPropText(p["Content Type"]) || ""),
            order: Number(getPropText(p.Order) || 0),
            lastReviewed: (getPropText(p["Last Reviewed"]) as any) || undefined,
            appIds: getRelationIds(p[REL_APPS_ON_ARTICLES]),
            moduleIds: getRelationIds(p[REL_MODULES_ON_ARTICLES]),
            topicIds: getRelationIds(p[REL_TOPICS_ON_ARTICLES]),
            language: String(getPropText(p.Language) || ""),
        } satisfies HelpCenterArticle;
    }).filter(a => a.slug && a.title);
}

export async function listArticlesByModuleId(moduleId: string, language?: string, visibility: string = "Public"): Promise<HelpCenterArticle[]> {
    if (!NOTION_ARTICLES_DB_ID) throw new Error("NOTION_ARTICLES_DB_ID is missing");
    if (!moduleId) return [];

    const filters: any[] = [
        { property: "Status", select: { equals: "Published" } },
        getVisibilityFilter(visibility),
        { property: REL_MODULES_ON_ARTICLES, relation: { contains: moduleId } },
    ];

    if (language) {
        filters.push(getLanguageFilter(language));
    }

    const res = await notion.databases.query({
        database_id: NOTION_ARTICLES_DB_ID,
        filter: { and: filters },
        sorts: [
            { property: "Order", direction: "ascending" },
            { property: "Last Reviewed", direction: "descending" },
        ],
    });

    return res.results.map((page: any) => {
        const p = page.properties || {};
        return {
            id: page.id,
            title: String(getPropText(p.Title) || ""),
            slug: String(getPropText(p.Slug) || "").trim(),
            excerpt: String(getPropText(p.Excerpt) || ""),
            status: String(getPropText(p.Status) || ""),
            visibility: String(getPropText(p.Visibility) || ""),
            contentType: String(getPropText(p["Content Type"]) || ""),
            order: Number(getPropText(p.Order) || 0),
            lastReviewed: (getPropText(p["Last Reviewed"]) as any) || undefined,
            appIds: getRelationIds(p[REL_APPS_ON_ARTICLES]),
            moduleIds: getRelationIds(p[REL_MODULES_ON_ARTICLES]),
            topicIds: getRelationIds(p[REL_TOPICS_ON_ARTICLES]),
            language: String(getPropText(p.Language) || ""),
        } satisfies HelpCenterArticle;
    }).filter(a => a.slug && a.title);
}

export async function searchArticles(query: string, language?: string, visibility: string = "Public"): Promise<HelpCenterArticle[]> {
    if (!NOTION_ARTICLES_DB_ID) throw new Error("NOTION_ARTICLES_DB_ID is missing");
    if (!query) return [];

    const filters: any[] = [
        { property: "Status", select: { equals: "Published" } },
        getVisibilityFilter(visibility),
        {
            or: [
                { property: "Title", title: { contains: query } },
                { property: "Excerpt", rich_text: { contains: query } },
            ],
        },
    ];

    if (language) {
        filters.push(getLanguageFilter(language));
    }

    const res = await notion.databases.query({
        database_id: NOTION_ARTICLES_DB_ID,
        filter: { and: filters },
        sorts: [
            { property: "Order", direction: "ascending" },
            { property: "Last Reviewed", direction: "descending" },
        ],
        page_size: 50,
    });

    return res.results.map((page: any) => {
        const p = page.properties || {};
        return {
            id: page.id,
            title: String(getPropText(p.Title) || ""),
            slug: String(getPropText(p.Slug) || "").trim(),
            excerpt: String(getPropText(p.Excerpt) || ""),
            status: String(getPropText(p.Status) || ""),
            visibility: String(getPropText(p.Visibility) || ""),
            contentType: String(getPropText(p["Content Type"]) || ""),
            order: Number(getPropText(p.Order) || 0),
            lastReviewed: (getPropText(p["Last Reviewed"]) as any) || undefined,
            appIds: getRelationIds(p[REL_APPS_ON_ARTICLES]),
            moduleIds: getRelationIds(p[REL_MODULES_ON_ARTICLES]),
            topicIds: getRelationIds(p[REL_TOPICS_ON_ARTICLES]),
            language: String(getPropText(p.Language) || ""),
        } satisfies HelpCenterArticle;
    }).filter(a => a.slug && a.title);
}
export async function listArticlesByAppId(appId: string, language?: string, visibility: string = "Public"): Promise<HelpCenterArticle[]> {
    if (!NOTION_ARTICLES_DB_ID) throw new Error("NOTION_ARTICLES_DB_ID is missing");
    if (!appId) return [];

    const filters: any[] = [
        { property: "Status", select: { equals: "Published" } },
        getVisibilityFilter(visibility),
        { property: REL_APPS_ON_ARTICLES, relation: { contains: appId } },
    ];

    if (language) {
        filters.push(getLanguageFilter(language));
    }

    const res = await notion.databases.query({
        database_id: NOTION_ARTICLES_DB_ID,
        filter: { and: filters },
        sorts: [
            { property: "Order", direction: "ascending" },
            { property: "Last Reviewed", direction: "descending" },
        ],
    });

    return res.results.map((page: any) => {
        const p = page.properties || {};
        return {
            id: page.id,
            title: String(getPropText(p.Title) || ""),
            slug: String(getPropText(p.Slug) || "").trim(),
            excerpt: String(getPropText(p.Excerpt) || ""),
            status: String(getPropText(p.Status) || ""),
            visibility: String(getPropText(p.Visibility) || ""),
            contentType: String(getPropText(p["Content Type"]) || ""),
            order: Number(getPropText(p.Order) || 0),
            lastReviewed: (getPropText(p["Last Reviewed"]) as any) || undefined,
            appIds: getRelationIds(p[REL_APPS_ON_ARTICLES]),
            moduleIds: getRelationIds(p[REL_MODULES_ON_ARTICLES]),
            topicIds: getRelationIds(p[REL_TOPICS_ON_ARTICLES]),
            language: String(getPropText(p.Language) || ""),
        } satisfies HelpCenterArticle;
    }).filter(a => a.slug && a.title);
}
