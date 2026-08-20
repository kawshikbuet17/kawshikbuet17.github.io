'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2 className="text-xl font-serif font-bold text-primary mb-3">{resolvedTitle}</h2>
            <div className="text-neutral-700 dark:text-neutral-600 leading-normal">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-2xl font-serif font-bold text-primary mt-6 mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-serif font-bold text-primary mt-6 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-semibold text-primary mt-5 mb-2">{children}</h3>,
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ children, href }) => {
                            const className = "text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm";
                            if (href && href.startsWith('/')) {
                                return (
                                    <Link href={href} className={className}>
                                        {children}
                                    </Link>
                                );
                            }
                            return (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 ${className}`}
                                >
                                    {children}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            );
                        },
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
        </motion.section>
    );
}
