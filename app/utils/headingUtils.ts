export const generateHeadingId = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[\s\t\n\r]+/g, "-") // replace whitespace with hyphens first
        .replace(/[^\p{L}\p{N}-]/gu, "") // remove anything that isn't a letter, number, or hyphen
        .replace(/-+/g, "-") // collapse multiple hyphens
        .replace(/^-+|-+$/g, ""); // trim hyphens from ends
};
