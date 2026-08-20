'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { NewsPageConfig, NewsItem } from '@/types/page';
import { CalendarIcon, BellIcon } from '@heroicons/react/24/outline';
import { ExternalLink } from 'lucide-react';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
    a: ({ children, ...props }: React.ComponentProps<'a'>) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent font-medium transition-all duration-200 rounded hover:underline hover:underline-offset-2"
        >
            {children}
            <ExternalLink className="h-3 w-3" />
        </a>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
};

interface NewsPageProps {
    config: NewsPageConfig;
    news: NewsItem[];
    embedded?: boolean;
}

export default function NewsPage({ config, news, embedded = false }: NewsPageProps) {
    // Sort news by date (newest first)
    const sortedNews = [...news].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Group news by year
    const groupedByYear = sortedNews.reduce((acc, item) => {
        const year = item.date.split('-')[0];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(item);
        return acc;
    }, {} as Record<string, NewsItem[]>);

    const years = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

    // Get month name from date
    const getMonthName = (dateStr: string) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthNum = parseInt(dateStr.split('-')[1]) - 1;
        return months[monthNum] || '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-6"}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/70 text-white flex items-center justify-center shadow-lg">
                        <BellIcon className="w-4 h-4" />
                    </div>
                    <h1 className={`${embedded ? "text-xl" : "text-3xl"} font-serif font-bold text-primary`}>
                        {config.title}
                    </h1>
                </div>
                {config.description && (
                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Gradient vertical line */}
                <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/50 to-transparent rounded-full" />

                <div className="space-y-8">
                    {years.map((year, yearIndex) => (
                        <motion.div
                            key={year}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * yearIndex }}
                        >
                            {/* Year marker */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 text-white flex items-center justify-center font-bold text-sm md:text-base shadow-lg ring-4 ring-white dark:ring-neutral-900">
                                    {year.slice(-2)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl md:text-2xl font-serif font-bold text-primary">{year}</span>
                                    <div className="h-px w-16 bg-gradient-to-r from-neutral-300 to-transparent" />
                                </div>
                            </div>

                            {/* News items for this year */}
                            <div className="ml-5 md:ml-6 space-y-3">
                                {groupedByYear[year].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.05 * index }}
                                        className="relative pl-8 group"
                                    >
                                        {/* Dot on timeline */}
                                        <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-white dark:bg-neutral-800 border-2 border-accent shadow-sm group-hover:scale-125 transition-transform" />

                                        {/* Connector line */}
                                        <div className="absolute left-[5px] top-[18px] w-6 h-px bg-neutral-200 dark:bg-neutral-700" />

                                        {/* Content card */}
                                        <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800/50 p-3.5 rounded-lg shadow-sm border border-neutral-200/60 dark:border-neutral-700/60 hover:shadow-md hover:border-accent/20 transition-all duration-300">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <CalendarIcon className="w-4 h-4 text-accent" />
                                                <span className="text-sm font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                                                    {getMonthName(item.date)} {item.date.split('-')[0]}
                                                </span>
                                            </div>
                                            <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[15px]">
                                                <ReactMarkdown components={markdownComponents}>
                                                    {item.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
