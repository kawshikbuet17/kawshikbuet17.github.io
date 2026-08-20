'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Github, Package, PlayCircle, FileText, ExternalLink, GitMerge } from 'lucide-react';
import { CardPageConfig } from '@/types/page';

// Parse links from content
function parseLinks(content: string) {
    const linksMatch = content.match(/\*\*Links:\*\*([\s\S]*?)$/);
    const mainContent = linksMatch ? content.replace(linksMatch[0], '').trim() : content;
    const linksText = linksMatch ? linksMatch[1].trim() : '';

    const linkMatches = linksText.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    const links = linkMatches.map(match => {
        const textMatch = match.match(/\[([^\]]+)\]/);
        const urlMatch = match.match(/\(([^)]+)\)/);
        const text = textMatch ? textMatch[1] : '';
        const url = urlMatch ? urlMatch[1] : '';
        const lowerText = text.toLowerCase();
        const isDemo = lowerText.includes('demo') || lowerText.includes('live');
        const isHuggingFace = url.includes('huggingface.co');
        const isMaven = lowerText.includes('maven') || url.includes('sonatype') || url.includes('maven');
        const isGitHubPackage = lowerText.includes('package') || url.includes('/packages/');
        const isPullRequest = lowerText.includes('pull request') || url.includes('/pull/');
        const isGitHub = url.includes('github.com');
        const isPaper = lowerText.includes('paper') || lowerText.includes('article') || url.includes('doi.org') || url.includes('arxiv');

        let kind: 'demo' | 'huggingface' | 'maven' | 'ghpackage' | 'pr-merged' | 'github' | 'paper' | 'default' = 'default';
        if (isDemo) kind = 'demo';
        else if (isHuggingFace) kind = 'huggingface';
        else if (isMaven) kind = 'maven';
        else if (isGitHubPackage) kind = 'ghpackage';
        else if (isPullRequest) kind = 'pr-merged';
        else if (isGitHub) kind = 'github';
        else if (isPaper) kind = 'paper';

        return { text, url, kind };
    });

    return { mainContent, links };
}

const linkStyles: Record<string, string> = {
    demo: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60 dark:hover:bg-emerald-900/30',
    huggingface: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60 dark:hover:bg-amber-900/30',
    maven: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/60 dark:hover:bg-orange-900/30',
    ghpackage: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60 dark:hover:bg-blue-900/30',
    'pr-merged': 'bg-[#8250df] text-white border-[#8250df] hover:bg-[#6639ba] dark:bg-[#ab7df8] dark:text-[#24292f] dark:border-[#ab7df8] dark:hover:bg-[#c297ff]',
    github: 'bg-neutral-800 text-white border-neutral-800 hover:bg-neutral-900 dark:bg-neutral-200 dark:text-neutral-900 dark:border-neutral-200 dark:hover:bg-white',
    paper: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/60 dark:hover:bg-purple-900/30',
    default: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
};

function LinkIcon({ kind }: { kind: string }) {
    const className = 'h-3.5 w-3.5';
    switch (kind) {
        case 'demo':
            return <PlayCircle className={className} />;
        case 'huggingface':
            return <span className="text-sm leading-none">🤗</span>;
        case 'maven':
        case 'ghpackage':
            return <Package className={className} />;
        case 'pr-merged':
            return <GitMerge className={className} />;
        case 'github':
            return <Github className={className} />;
        case 'paper':
            return <FileText className={className} />;
        default:
            return <ExternalLink className={className} />;
    }
}

// Component to render card content with subtitle and links on same row
function CardContent({ content, subtitle, embedded }: { content: string; subtitle?: string; embedded?: boolean }) {
    const { mainContent, links } = parseLinks(content);

    return (
        <div className="flex flex-col">
            {(subtitle || links.length > 0) && (
                <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1 mb-2">
                    {subtitle && (
                        <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium`}>{subtitle}</p>
                    )}
                    {links.length > 0 && (
                        <div className="flex items-center flex-wrap gap-1.5">
                            {links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-sm hover:-translate-y-px ${linkStyles[link.kind]}`}
                                    title={link.text}
                                >
                                    <LinkIcon kind={link.kind} />
                                    <span>{link.kind === 'pr-merged' ? 'Merged' : link.text}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-normal`}>
                <ReactMarkdown components={markdownComponents}>
                    {mainContent}
                </ReactMarkdown>
            </div>
        </div>
    );
}

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ href, children, ...props }: React.ComponentProps<'a'> & { href?: string }) => {
        return (
            <a
                {...props}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
            >
                {children}
            </a>
        );
    },
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

interface CardPageProps {
    config: CardPageConfig & { sections?: { id: string; title: string; description?: string; items: CardPageConfig['items'] }[] };
    embedded?: boolean;
    social?: {
        github?: string;
    };
}

export default function CardPage({ config, embedded = false, social }: CardPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-3" : "mb-6"}>
                <h1 className={`${embedded ? "text-xl" : "text-3xl"} font-serif font-bold text-primary mb-3`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-normal mb-3`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
                {social?.github && (
                    <a
                        href={social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-gray-800 text-white text-xs font-medium hover:bg-gray-900 transition-colors"
                    >
                        <Github className="h-3.5 w-3.5 mr-1.5" />
                        GitHub
                    </a>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-3" : "gap-4"}`}>
                {config.sections ? (
                    // Render sections
                    config.sections.map((section, sectionIndex) => (
                        <div key={section.id} className="space-y-2">
                            {/* Section Header */}
                            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-3">
                                <h2 className={`${embedded ? "text-lg" : "text-xl"} font-serif font-semibold text-primary`}>
                                    {section.title}
                                </h2>
                                {section.description && (
                                    <p className="text-sm text-neutral-500 mt-1">{section.description}</p>
                                )}
                            </div>
                            {/* Section Items */}
                            <div className={`grid gap-2.5`}>
                                {section.items.map((item, index) => (
                                    <motion.div
                                        key={`${section.id}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * (sectionIndex * 3 + index) }}
                                        className={`bg-white dark:bg-neutral-900 p-3.5 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3 className={`${embedded ? "text-base" : "text-lg"} font-semibold text-primary`}>{item.title}</h3>
                                            {item.date && (
                                                <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                    {item.date}
                                                </span>
                                            )}
                                        </div>
                                        {item.content && (
                                            <CardContent content={item.content} subtitle={item.subtitle} embedded={embedded} />
                                        )}
                                        {item.tags && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Render flat items (backward compatible)
                    config.items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className={`bg-white dark:bg-neutral-900 p-3.5 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <h3 className={`${embedded ? "text-base" : "text-lg"} font-semibold text-primary`}>{item.title}</h3>
                                {item.date && (
                                    <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                        {item.date}
                                    </span>
                                )}
                            </div>
                            {item.content && (
                                <CardContent content={item.content} subtitle={item.subtitle} embedded={embedded} />
                            )}
                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
