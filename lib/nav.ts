import type { Article } from "./content";

export type NavTree = Record<string, Record<string, Record<string, Article[]>>>;

// App -> Category -> Content Type -> Articles[]
export function buildNavTree(articles: Article[]): NavTree {
    const tree: NavTree = {};

    for (const a of articles) {
        const app = a.app || "Other";
        const cat = a.category || "Other";
        const type = a.contentType || "Help Article";

        tree[app] ??= {};
        tree[app][cat] ??= {};
        tree[app][cat][type] ??= [];
        tree[app][cat][type].push(a);
    }

    // Local stable sort (since Notion "Order" does not exist)
    for (const app of Object.keys(tree)) {
        for (const cat of Object.keys(tree[app])) {
            for (const type of Object.keys(tree[app][cat])) {
                tree[app][cat][type].sort((x, y) => x.title.localeCompare(y.title));
            }
        }
    }

    return tree;
}
