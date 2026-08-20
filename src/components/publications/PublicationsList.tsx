'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ExternalLink } from 'lucide-react';
import { Publication, PublicationStatus } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
    social?: {
        google_scholar?: string;
        research_gate?: string;
    };
    researchInterests?: string[];
}

// Fixed order of statuses
const statusOrder: PublicationStatus[] = ['in-progress', 'preprint', 'submitted', 'under-review', 'accepted', 'published'];

const statusLabels: Record<PublicationStatus, string> = {
    'in-progress': 'In Progress',
    preprint: 'Preprint',
    submitted: 'Submitted',
    'under-review': 'Under Review',
    accepted: 'Accepted',
    published: 'Published',
};

export default function PublicationsList({ config, publications, embedded = false, social, researchInterests }: PublicationsListProps) {
    const messages = useMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<PublicationStatus | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    const statuses = useMemo(() => {
        const uniqueStatuses = Array.from(new Set(publications.map(p => p.status)));
        // Filter to only include statuses in the defined order, then sort by that order
        return uniqueStatuses
            .filter((s): s is PublicationStatus => statusOrder.includes(s as PublicationStatus))
            .sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));
    }, [publications]);

    // Filter publications
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = selectedStatus === 'all' || pub.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [publications, searchQuery, selectedStatus]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-6">
                <h1 className={`${embedded ? "text-xl" : "text-3xl"} font-serif font-bold text-primary mb-3`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 max-w-2xl mb-3`}>
                        {config.description}
                    </p>
                )}
                
                {/* Research Interests */}
                {researchInterests && researchInterests.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Research Interests</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {researchInterests.map((interest, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full border border-accent/20"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {(social?.google_scholar || social?.research_gate) && (
                    <div className="flex flex-wrap gap-2">
                        {social?.google_scholar && (
                            <a
                                href={social.google_scholar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                                Google Scholar
                            </a>
                        )}
                        {social?.research_gate && (
                            <a
                                href={social.research_gate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors"
                            >
                                <svg className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
                                </svg>
                                ResearchGate
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-3">
                {/* ... (keep existing controls) ... */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder={messages.publications.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200",
                            showFilters
                                ? "bg-accent text-white border-accent"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent"
                        )}
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        {messages.publications.filters}
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-6">
                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                        <DocumentTextIcon className="h-4 w-4 mr-1" /> Status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedStatus('all')}
                                            className={cn(
                                                "px-3 py-1 text-xs rounded-full transition-colors",
                                                selectedStatus === 'all'
                                                    ? "bg-accent text-white"
                                                    : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                            )}
                                        >
                                            {messages.common.all}
                                        </button>
                                        {statuses.map((status: PublicationStatus) => (
                                            <button
                                                key={status}
                                                onClick={() => setSelectedStatus(status)}
                                                className={cn(
                                                    "px-3 py-1 text-xs rounded-full transition-colors",
                                                    selectedStatus === status
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                {statusLabels[status]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Publications Grid */}
            <div className="space-y-4">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        {messages.publications.noResults}
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                {pub.preview && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={pub.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary leading-tight`}>
                                            {pub.title}
                                        </h3>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                                {pub.year}
                                            </span>
                                            {pub.status && (
                                                <span className={cn(
                                                    "inline-block px-2 py-0.5 text-xs rounded-full whitespace-nowrap",
                                                    pub.status === 'published' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                                                    pub.status === 'accepted' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                                                    pub.status === 'under-review' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                    pub.status === 'submitted' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                                                    pub.status === 'preprint' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                                                    pub.status === 'in-progress' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                )}>
                                                    {statusLabels[pub.status]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-400 mb-2`}>
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                    {author.name}
                                                </span>
                                                {author.isCorresponding && (
                                                    <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    {/* Tags */}
                                    {pub.tags && pub.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {pub.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md border border-neutral-200 dark:border-neutral-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Period */}
                                    {pub.period && (
                                        <div className="flex items-center gap-2 mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>{pub.period}</span>
                                        </div>
                                    )}

                                    {pub.description && (
                                        <div className="text-sm text-neutral-600 dark:text-neutral-500 mb-4">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-0">{children}</p>,
                                                    a: ({ href, children }) => (
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
                                                }}
                                            >
                                                {pub.description}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                                        <div className="flex flex-wrap gap-2">
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-sm hover:-translate-y-px bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                DOI
                                            </a>
                                        )}
                                        {!pub.doi && pub.url && (
                                            <a
                                                href={pub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-sm hover:-translate-y-px bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                Preprint
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-200 hover:shadow-sm hover:-translate-y-px bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                {messages.publications.code}
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                                    expandedAbstractId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                                                {messages.publications.abstract}
                                            </button>
                                        )}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract ? (
                                            <motion.div
                                                key="abstract"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-500 leading-relaxed">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
