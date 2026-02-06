export type HelpCenterApp = {
    id: string;
    name: string;
    key: string;
    description: string;
    descriptionTR?: string;
    descriptionZH?: string;
    iconUrl?: string;
    order: number;
    status: "Active" | "Hidden" | string;
};

export type HelpCenterModule = {
    id: string;
    name: string;
    nameTR?: string;
    nameZH?: string;
    key: string;
    description: string;
    descriptionTR?: string;
    descriptionZH?: string;
    iconUrl?: string;
    order: number;
    status: "Active" | "Hidden" | string;
    appIds: string[]; // relation backref may exist
};

export type HelpCenterTopic = {
    id: string;
    name: string;
    nameTR?: string;
    nameZH?: string;
    key: string;
    description: string;
    descriptionTR?: string;
    descriptionZH?: string;
    iconUrl?: string;
    order: number;
    status: "Active" | "Hidden" | string;
    appId: string; // limit 1
    moduleIds: string[];
};

export type HelpCenterArticle = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    status: "Draft" | "Review" | "Published" | "Archived" | string;
    visibility: "Public" | "Internal Only" | string;
    contentType: "Help Article" | "Release Note" | "Announcement" | string;
    order: number;
    lastReviewed?: string;

    appIds: string[];
    moduleIds: string[];
    topicIds: string[];
    language?: string;
};
