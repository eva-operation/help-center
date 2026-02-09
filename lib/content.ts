import { notion } from "./notion";

// Use the correct ENV var from .env.local
export const NOTION_ARTICLES_DB_ID = process.env.NOTION_ARTICLES_DB_ID || "";

export type Article = {
    id: string;
    title: string;
    slug: string;
    app: string;
    category: string;
    contentType: string;
    audience: string;
    excerpt: string;
    lastReviewed?: string;
    relatedArticleIds?: string[];
    excerptRich?: any[];
};

function readPlainText(rich: any[]): string {
    if (!Array.isArray(rich)) return "";
    return rich.map((t) => t?.plain_text || "").join("");
}

function getPropText(prop: any): string {
    if (!prop) return "";
    if (prop.type === "title") return readPlainText(prop.title);
    if (prop.type === "rich_text") return readPlainText(prop.rich_text);
    if (prop.type === "select") return prop.select?.name || "";
    if (prop.type === "number") return String(prop.number ?? "");
    if (prop.type === "date") return prop.date?.start || "";
    return "";
}

function getPropRelationIds(prop: any): string[] {
    if (!prop || prop.type !== "relation") return [];
    return prop.relation.map((r: any) => r.id);
}

function getRequiredProps(page: any) {
    const p = page.properties || {};
    return {
        title: getPropText(p.Title),
        slug: getPropText(p.Slug),
        // App property does not exist as text, so we default to "" (which becomes "Other" in nav)
        // or we could try to look at relations if we wanted to fetch them.
        app: getPropText(p.App),
        category: getPropText(p.Category),
        contentType: getPropText(p["Content Type"]) || "Help Article",
        audience: getPropText(p.Audience) || "General",
        excerpt: getPropText(p.Excerpt),
        excerptRich: p.Excerpt?.rich_text || [],
        lastReviewed: getPropText(p["Last Reviewed"]) || undefined,
        relatedArticleIds: getPropRelationIds(p["Related Articles"]),
    };
}

function getVisibilityFilter(visibility: string) {
    return { property: "Visibility", select: { equals: visibility } };
}

export async function listPublishedArticles(visibility: string = "Public"): Promise<Article[]> {
    if (!NOTION_ARTICLES_DB_ID) throw new Error("NOTION_ARTICLES_DB_ID is missing");

    const res = await notion.databases.query({
        database_id: NOTION_ARTICLES_DB_ID,
        filter: {
            and: [
                { property: "Status", select: { equals: "Published" } },
                getVisibilityFilter(visibility),
            ],
        },
        // NOTE: Do not use sorts unless you're 100% sure the property exists in the DB.
        // We'll sort locally in nav/tree.
    });

    return res.results
        .map((page: any) => {
            const x = getRequiredProps(page);
            return {
                id: page.id,
                title: x.title,
                slug: x.slug,
                app: x.app,
                category: x.category,
                contentType: x.contentType,
                audience: x.audience,
                excerpt: x.excerpt,
                lastReviewed: x.lastReviewed,
                relatedArticleIds: x.relatedArticleIds,
                excerptRich: x.excerptRich,
            } as Article;
        })
        .filter((a) => a.slug && a.title);
}

export async function getArticleBySlug(slug: string | undefined | null, visibility: string = "Public"): Promise<Article | null> {
    if (!NOTION_ARTICLES_DB_ID) throw new Error("NOTION_ARTICLES_DB_ID is missing");

    const safeSlug = (slug ?? "").trim();
    if (!safeSlug) return null;

    const res = await notion.databases.query({
        database_id: NOTION_ARTICLES_DB_ID,
        filter: {
            and: [
                { property: "Slug", rich_text: { equals: safeSlug } },
                { property: "Status", select: { equals: "Published" } },
                getVisibilityFilter(visibility),
            ],
        },
    });

    const page: any = res.results?.[0];
    if (!page) return null;

    const x = getRequiredProps(page);
    return {
        id: page.id,
        title: x.title,
        slug: x.slug,
        app: x.app,
        category: x.category,
        contentType: x.contentType,
        audience: x.audience,
        excerpt: x.excerpt,
        lastReviewed: x.lastReviewed,
        relatedArticleIds: x.relatedArticleIds,
        excerptRich: x.excerptRich,
    };
}


export async function fetchAllBlocks(blockId: string): Promise<any[]> {
    const blocks: any[] = [];
    let cursor: string | undefined = undefined;

    while (true) {
        const res = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: cursor,
            page_size: 100,
        });

        const results = res.results;

        // Fetch children recursively for blocks that have them
        // We use Map to run these in parallel where possible, but be mindful of rate limits
        await Promise.all(results.map(async (block: any) => {
            if (block.has_children) {
                // Prevent infinite recursion for unsupported types or special cases if needed
                // For now, we just fetch recursively
                const children = await fetchAllBlocks(block.id);
                block.children = children;
            }
        }));

        blocks.push(...results);

        if (!res.has_more) break;
        cursor = res.next_cursor ?? undefined;
    }

    return blocks;
}
