import { ArticlePageContent } from "../../../components/ArticlePageContent";

export const dynamic = 'force-dynamic';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function InternalDocPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const sp = await searchParams;

    return <ArticlePageContent slug={slug} searchParams={sp} visibility="Internal Only" />;
}
