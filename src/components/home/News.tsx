'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ExternalLink } from 'lucide-react';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-0">{children}</p>,
    a: ({ href, children }: React.ComponentProps<'a'>) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent font-medium hover:underline"
        >
            {children}
            <ExternalLink className="h-3 w-3" />
        </a>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
};

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-xl font-serif font-bold text-primary mb-3">{resolvedTitle}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <div className="text-sm text-neutral-700">
                            <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
