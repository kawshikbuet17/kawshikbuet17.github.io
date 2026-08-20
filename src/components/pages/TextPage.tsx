'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ExternalLink } from 'lucide-react';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

// Check if content contains PDF embed directive
function isPdfContent(content: string): boolean {
    return content.trim().startsWith('<!-- PDF:') || content.includes(':::pdf');
}

// Extract PDF path from content
function extractPdfPath(content: string): string | null {
    // Check for HTML comment format: <!-- PDF: /path/to/file.pdf -->
    const htmlCommentMatch = content.match(/<!--\s*PDF:\s*(.+?)\s*-->/);
    if (htmlCommentMatch) {
        return htmlCommentMatch[1].trim();
    }

    // Check for markdown directive format: :::pdf /path/to/file.pdf
    const markdownMatch = content.match(/:::pdf\s*(.+?)(?:\s|$)/);
    if (markdownMatch) {
        return markdownMatch[1].trim();
    }

    return null;
}

// Extract file ID from Google Drive URL and create download link
function getGoogleDriveDownloadUrl(url: string): string {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    const pdfPath = isPdfContent(content) ? extractPdfPath(content) : null;
    const isGoogleDrive = pdfPath?.includes('drive.google.com') || false;
    const downloadUrl = pdfPath ? getGoogleDriveDownloadUrl(pdfPath) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <h1 className={`${embedded ? "text-xl" : "text-3xl"} font-serif font-bold text-primary mb-3`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 mb-6 max-w-2xl`}>
                    {config.description}
                </p>
            )}

            {pdfPath ? (
                // PDF Embed View
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                            {isGoogleDrive ? 'Viewing Directly from Google Drive' : `Viewing PDF: ${pdfPath.split('/').pop()}`}
                        </p>
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download
                                className="text-sm text-accent font-medium hover:underline"
                            >
                                Download PDF
                            </a>
                        )}
                    </div>
                    <div className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                        <iframe
                            src={pdfPath}
                            className="w-full h-[800px]"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            ) : (
                // Regular Markdown Content
                <div className="text-neutral-700 dark:text-neutral-600 leading-normal">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h1 className="text-2xl font-serif font-bold text-primary mt-6 mb-3">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl font-serif font-bold text-primary mt-6 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-serif font-semibold text-primary mt-6 mb-2">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            a: ({ children, ...props }) => (
                                <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                                >
                                    {children}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            )}
        </motion.div>
    );
}
