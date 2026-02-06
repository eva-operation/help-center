
import React from 'react';

import { generateHeadingId } from '../../utils/headingUtils';

// Helper to extract plain text from rich text for ID generation
const getPlainText = (text: any[]): string => {
    if (!text || !Array.isArray(text)) return "";
    return text.map(t => t.plain_text || "").join("");
};

// --- Types ---

const RichText = ({ text }: { text: any[] }) => {
    if (!text || !Array.isArray(text)) return null;

    return (
        <>
            {text.map((t, index) => {
                const { annotations } = t;
                const { bold, italic, strikethrough, underline, code, color } = annotations;

                let content: React.ReactNode = t.plain_text;

                // Inline Equation Support
                if (t.type === 'equation') {
                    content = <span className="font-mono text-sm bg-[var(--bg-tertiary)] px-1 rounded mx-0.5" title="Equation">{t.equation.expression}</span>;
                }

                // Apply styles
                const classNames: string[] = [];
                if (bold) classNames.push("font-bold");
                if (italic) classNames.push("italic");
                if (strikethrough) classNames.push("!line-through text-[var(--text-muted)]");
                if (underline) classNames.push("!underline decoration-[var(--brand-blue)] decoration-1 underline-offset-4");
                if (code) classNames.push("bg-[var(--bg-tertiary)] px-1 py-0.5 rounded text-sm font-mono text-[var(--brand-blue)] border border-[var(--neutral-border)]");

                // Color handling
                if (color && color !== 'default') {
                    if (color.endsWith('_background')) {
                        classNames.push(`notion-bg-${color.replace('_background', '')}`);
                    } else {
                        classNames.push(`notion-color-${color}`);
                    }
                }

                if (classNames.length > 0) {
                    content = <span className={classNames.join(" ")}>{content}</span>;
                }

                if (t.href) {
                    content = (
                        <a href={t.href} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-blue)] hover:underline decoration-1 underline-offset-2">
                            {content}
                        </a>
                    );
                }

                return <React.Fragment key={index}>{content}</React.Fragment>;
            })}
        </>
    );
};

// Helper to get color class from Notion color string
const getColorClass = (color?: string): string => {
    if (!color || color === 'default') return "";
    if (color.endsWith('_background')) {
        return `notion-bg-${color.replace('_background', '')}`;
    }
    return `notion-color-${color}`;
};

// --- Block Renderers ---

const ParagraphBlock = ({ block }: { block: any }) => {
    const color = block.paragraph?.color;
    const colorClass = getColorClass(color);
    const isBackground = color?.includes('_background');

    return (
        <p className={`my-2 text-[var(--text-primary)] leading-relaxed min-h-[1.5em] whitespace-pre-wrap ${colorClass} ${isBackground ? 'p-4 rounded-lg' : ''}`}>
            <RichText text={block.paragraph.rich_text} />
        </p>
    );
};

const Heading1Block = ({ block, children }: { block: any, children?: React.ReactNode }) => {
    const text = getPlainText(block.heading_1.rich_text);
    const id = generateHeadingId(text);
    const colorClass = getColorClass(block.heading_1.color);
    const isBackground = block.heading_1.color?.includes('_background');
    const isToggleable = block.heading_1.is_toggleable;

    const content = (
        <h1 id={id} className={`mt-10 mb-4 text-3xl font-bold text-[var(--text-primary)] tracking-tight scroll-mt-24 ${colorClass} ${isBackground ? 'p-4 rounded-lg' : ''}`}>
            <RichText text={block.heading_1.rich_text} />
        </h1>
    );

    if (isToggleable) {
        return (
            <details className="group">
                <summary className="list-none cursor-pointer flex items-center gap-2 hover:bg-[var(--neutral-bg)] rounded transition-colors p-1">
                    <span className="text-[var(--text-muted)] text-xs transition-transform group-open:rotate-90">▶</span>
                    <div className="flex-1">{content}</div>
                </summary>
                <div className="ml-6 border-l border-[var(--neutral-border)] pl-4">
                    {children}
                </div>
            </details>
        );
    }

    return content;
};

const Heading2Block = ({ block, children }: { block: any, children?: React.ReactNode }) => {
    const text = getPlainText(block.heading_2.rich_text);
    const id = generateHeadingId(text);
    const colorClass = getColorClass(block.heading_2.color);
    const isBackground = block.heading_2.color?.includes('_background');
    const isToggleable = block.heading_2.is_toggleable;

    const content = (
        <h2 id={id} className={`mt-8 mb-3 text-2xl font-bold text-[var(--text-primary)] pb-2 border-b border-[var(--neutral-border)] tracking-tight scroll-mt-24 ${colorClass} ${isBackground ? 'p-4 rounded-lg' : ''}`}>
            <RichText text={block.heading_2.rich_text} />
        </h2>
    );

    if (isToggleable) {
        return (
            <details className="group">
                <summary className="list-none cursor-pointer flex items-center gap-2 hover:bg-[var(--neutral-bg)] rounded transition-colors p-1">
                    <span className="text-[var(--text-muted)] text-xs transition-transform group-open:rotate-90">▶</span>
                    <div className="flex-1">{content}</div>
                </summary>
                <div className="ml-6 border-l border-[var(--neutral-border)] pl-4">
                    {children}
                </div>
            </details>
        );
    }

    return content;
};

const Heading3Block = ({ block, children }: { block: any, children?: React.ReactNode }) => {
    const text = getPlainText(block.heading_3.rich_text);
    const id = generateHeadingId(text);
    const colorClass = getColorClass(block.heading_3.color);
    const isBackground = block.heading_3.color?.includes('_background');
    const isToggleable = block.heading_3.is_toggleable;

    const content = (
        <h3 id={id} className={`mt-6 mb-2 text-xl font-semibold text-[var(--text-primary)] scroll-mt-24 ${colorClass} ${isBackground ? 'p-4 rounded-lg' : ''}`}>
            <RichText text={block.heading_3.rich_text} />
        </h3>
    );

    if (isToggleable) {
        return (
            <details className="group">
                <summary className="list-none cursor-pointer flex items-center gap-2 hover:bg-[var(--neutral-bg)] rounded transition-colors p-1">
                    <span className="text-[var(--text-muted)] text-xs transition-transform group-open:rotate-90">▶</span>
                    <div className="flex-1">{content}</div>
                </summary>
                <div className="ml-6 border-l border-[var(--neutral-border)] pl-4">
                    {children}
                </div>
            </details>
        );
    }

    return content;
};

const ListItemContent = ({ block, children }: { block: any, children?: React.ReactNode }) => {
    const richText = block.type === 'bulleted_list_item' ? block.bulleted_list_item.rich_text : block.numbered_list_item.rich_text;

    return (
        <li className="my-1 text-[var(--text-primary)] leading-relaxed pl-1">
            <div className="inline-block">
                <RichText text={richText} />
            </div>
            {children}
        </li>
    );
};

const QuoteBlock = ({ block }: { block: any }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-[var(--brand-purple)] bg-[var(--bg-tertiary)] py-3 px-4 rounded-r-lg italic text-[var(--text-secondary)]">
        <RichText text={block.quote.rich_text} />
    </blockquote>
);

const CalloutBlock = ({ block, children }: { block: any, children?: React.ReactNode }) => {
    const icon = block.callout.icon;
    const color = block.callout.color;
    const colorClass = getColorClass(color);

    let iconEl = null;
    if (icon?.type === 'emoji') {
        iconEl = <span className="text-xl select-none">{icon.emoji}</span>;
    } else if (icon?.type === 'external' || icon?.type === 'file') {
        const url = icon.type === 'external' ? icon.external.url : icon.file.url;
        iconEl = <img src={url} alt="Icon" className="w-5 h-5 mt-0.5 object-contain select-none" loading="lazy" />;
    }

    return (
        <div className={`my-4 p-4 rounded-lg border border-[var(--neutral-border)] flex items-start gap-3 ${colorClass || 'bg-[var(--bg-tertiary)]'}`}>
            {iconEl}
            <div className="text-[var(--text-primary)] flex-1">
                <RichText text={block.callout.rich_text} />
                {children && <div className="mt-2 space-y-1">{children}</div>}
            </div>
        </div>
    );
};

const CodeBlock = ({ block }: { block: any }) => (
    <div className="my-4 relative group">
        <pre className="p-4 rounded-lg bg-[#1e1e1e] border border-[var(--neutral-border)] overflow-x-auto text-sm font-mono text-[var(--text-primary)] shadow-inner">
            <code>
                <RichText text={block.code.rich_text} />
            </code>
        </pre>
        {block.code.language && (
            <span className="absolute top-2 right-2 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded opacity-50 group-hover:opacity-100 transition-opacity uppercase select-none">
                {block.code.language}
            </span>
        )}
    </div>
);

const ToggleBlock = ({ block, children }: { block: any, children?: React.ReactNode }) => {
    return (
        <details className="my-2 group">
            <summary className="cursor-pointer list-none flex items-start gap-2 text-[var(--text-primary)] font-medium p-2 rounded hover:bg-[var(--neutral-bg)] transition-colors select-none">
                <span className="mt-0.5 transition-transform group-open:rotate-90 text-[var(--text-muted)] text-xs">▶</span>
                <div className="flex-1">
                    <RichText text={block.toggle.rich_text} />
                </div>
            </summary>
            {/* Wrapper div for children content indentation */}
            <div className="ml-6 mt-1 pl-4 border-l border-[var(--neutral-border)]">
                {children}
            </div>
        </details>
    );
}

const DividerBlock = () => (
    <hr className="my-8 border-[var(--neutral-border)]" />
);

const ImageBlock = ({ block }: { block: any }) => {
    const src = block.image.type === 'external' ? block.image.external.url : block.image.file?.url;
    const caption = block.image.caption?.length > 0 ? block.image.caption : null;

    if (!src) return null;

    return (
        <figure className="my-6">
            <img src={src} alt="Notion Image" className="rounded-lg border border-[var(--neutral-border)] w-full h-auto max-h-[600px] object-contain bg-[var(--bg-tertiary)]" loading="lazy" />
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-[var(--text-muted)] italic">
                    <RichText text={caption} />
                </figcaption>
            )}
        </figure>
    );
};

const BookmarkBlock = ({ block }: { block: any }) => {
    const url = block.bookmark.url;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block my-4 p-4 rounded-lg border border-[var(--neutral-border)] bg-[var(--bg-card)] hover:bg-[var(--neutral-bg)] hover:border-[var(--brand-blue)] transition-all group">
            <div className="flex items-center gap-3">
                <span className="text-[var(--brand-blue)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </span>
                <span className="truncate text-[var(--text-primary)] group-hover:text-[var(--brand-blue)] transition-colors">{url}</span>
            </div>
        </a>
    );
}

const EquationBlock = ({ block }: { block: any }) => {
    return (
        <div className="my-4 p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--neutral-border)] text-center font-mono text-lg overflow-x-auto">
            {block.equation.expression}
        </div>
    );
}

const TableBlock = ({ block }: { block: any }) => {
    const rows = block.children || [];
    return (
        <div className="my-6 overflow-x-auto rounded-lg border border-[var(--neutral-border)]">
            <table className="w-full text-left text-sm border-collapse">
                <tbody>
                    {rows.map((row: any) => <TableRowBlock key={row.id} block={row} />)}
                </tbody>
            </table>
        </div>
    );
};

const TableRowBlock = ({ block }: { block: any }) => {
    const cells = block.table_row?.cells || [];
    return (
        <tr className="border-b border-[var(--neutral-border)] last:border-0 bg-[var(--bg-card)] hover:bg-[var(--bg-tertiary)] transition-colors">
            {cells.map((cell: any[], idx: number) => {
                // Check if the cell should have a background color (based on first segment)
                const firstColor = cell?.[0]?.annotations?.color;
                const bgClass = firstColor?.endsWith('_background') ? getColorClass(firstColor) : "";

                return (
                    <td key={idx} className={`px-4 py-3 border-r border-[var(--neutral-border)] last:border-0 whitespace-pre-wrap min-w-[150px] ${bgClass}`}>
                        <RichText text={cell} />
                    </td>
                );
            })}
        </tr>
    );
}

// --- Main Renderer ---

const RenderBlock = ({ block }: { block: any }) => {
    // If block has children, recursively render them.
    // SKIP for 'table' because TableBlock handles its own children (rows) manually
    // to ensure valid HTML structure (no div wrapper between table and tr).
    let children = null;
    if (block.type !== 'table' && block.children && block.children.length > 0) {
        children = <NotionRenderer blocks={block.children} />;
    }

    switch (block.type) {
        case 'paragraph': return <ParagraphBlock block={block} />;
        case 'heading_1': return <Heading1Block block={block}>{children}</Heading1Block>;
        case 'heading_2': return <Heading2Block block={block}>{children}</Heading2Block>;
        case 'heading_3': return <Heading3Block block={block}>{children}</Heading3Block>;
        case 'bulleted_list_item': return <ListItemContent block={block}>{children}</ListItemContent>;
        case 'numbered_list_item': return <ListItemContent block={block}>{children}</ListItemContent>;
        case 'toggle': return <ToggleBlock block={block}>{children}</ToggleBlock>;
        case 'quote': return <QuoteBlock block={block} />;
        case 'callout': return <CalloutBlock block={block}>{children}</CalloutBlock>;
        case 'code': return <CodeBlock block={block} />;
        case 'divider': return <DividerBlock />;
        case 'image': return <ImageBlock block={block} />;
        case 'bookmark': return <BookmarkBlock block={block} />;
        case 'equation': return <EquationBlock block={block} />;
        // Table handles its own children to ensure valid HTML (no div inside tbody)
        case 'table': return <TableBlock block={block} />;
        case 'table_row': return <TableRowBlock block={block} />;
        default:
            if (children) return <div className="pl-4">{children}</div>;
            return null;
    }
};

type Props = {
    blocks: any[];
};

export function NotionRenderer({ blocks }: Props) {
    if (!blocks || blocks.length === 0) return null;

    const result: React.ReactNode[] = [];
    let currentList: any[] = [];
    let currentListType: 'bulleted_list_item' | 'numbered_list_item' | null = null;

    // We iterate and group list items
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
            if (currentListType && currentListType !== block.type) {
                // Determine previous list tag
                const Tag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
                const className = currentListType === 'bulleted_list_item'
                    ? "list-disc ml-6 my-2 space-y-1"
                    : "list-decimal ml-6 my-2 space-y-1";

                result.push(
                    <Tag key={`list-${i}`} className={className}>
                        {currentList.map(b => <RenderBlock key={b.id} block={b} />)}
                    </Tag>
                );
                currentList = [];
            }
            currentListType = block.type;
            currentList.push(block);
        } else {
            // Close list if open
            if (currentList.length > 0 && currentListType) {
                const Tag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
                const className = currentListType === 'bulleted_list_item'
                    ? "list-disc ml-6 my-2 space-y-1"
                    : "list-decimal ml-6 my-2 space-y-1";

                result.push(
                    <Tag key={`list-${i}`} className={className}>
                        {currentList.map(b => <RenderBlock key={b.id} block={b} />)}
                    </Tag>
                );
                currentList = [];
                currentListType = null;
            }

            // Render normal block
            result.push(<RenderBlock key={block.id} block={block} />);
        }
    }

    // Flush remaining list
    if (currentList.length > 0 && currentListType) {
        const Tag = currentListType === 'bulleted_list_item' ? 'ul' : 'ol';
        const className = currentListType === 'bulleted_list_item'
            ? "list-disc ml-6 my-2 space-y-1"
            : "list-decimal ml-6 my-2 space-y-1";

        result.push(
            <Tag key={`list-end`} className={className}>
                {currentList.map(b => <RenderBlock key={b.id} block={b} />)}
            </Tag>
        );
    }

    return (
        <div className="notion-content text-[var(--text-primary)]">
            {result}
        </div>
    );
}
