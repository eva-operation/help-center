export function readPlainText(rich: any[]): string {
    if (!Array.isArray(rich)) return "";
    return rich.map((t) => t?.plain_text || "").join("");
}

export function getPropText(prop: any): string {
    if (!prop) return "";
    if (prop.type === "title") return readPlainText(prop.title);
    if (prop.type === "rich_text") return readPlainText(prop.rich_text);
    if (prop.type === "select") return prop.select?.name || "";
    if (prop.type === "number") return prop.number ?? 0;
    if (prop.type === "date") return prop.date?.start || "";
    return "";
}

export function getFileUrl(prop: any): string | undefined {
    if (!prop) return undefined;
    if (prop.type === "files") {
        const f = prop.files?.[0];
        if (!f) return undefined;
        if (f.type === "external") return f.external?.url;
        if (f.type === "file") return f.file?.url;
    }
    return undefined;
}

export function getIconUrl(icon: any): string | undefined {
    if (!icon) return undefined;
    if (icon.type === "external") return icon.external?.url;
    if (icon.type === "file") return icon.file?.url;
    if (icon.type === "emoji") return undefined; // or return as-is if handled elsewhere
    return undefined;
}

export function getRelationIds(prop: any): string[] {
    if (!prop || prop.type !== "relation") return [];
    return (prop.relation || []).map((r: any) => r?.id).filter(Boolean);
}
