'use client';

import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import NewsPage from '@/components/pages/NewsPage';
import { Publication } from '@/types/publication';
import {
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
  NewsPageConfig,
  NewsItem,
} from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export type DynamicPageLocaleData =
  | { type: 'publication'; config: PublicationPageConfig; publications: Publication[]; researchInterests?: string[] }
  | { type: 'text'; config: TextPageConfig; content: string }
  | { type: 'card'; config: CardPageConfig }
  | { type: 'news'; config: NewsPageConfig; news: NewsItem[] };

interface DynamicPageClientProps {
  dataByLocale: Record<string, DynamicPageLocaleData>;
  defaultLocale: string;
  social?: {
    google_scholar?: string;
    research_gate?: string;
    github?: string;
  };
}

export default function DynamicPageClient({ dataByLocale, defaultLocale, social }: DynamicPageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const pageData = dataByLocale[locale] || fallback;

  if (!pageData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {pageData.type === 'publication' && (
        <PublicationsList 
          config={pageData.config} 
          publications={pageData.publications} 
          social={social}
          researchInterests={pageData.researchInterests}
        />
      )}
      {pageData.type === 'text' && (
        <TextPage config={pageData.config} content={pageData.content} />
      )}
      {pageData.type === 'card' && (
        <CardPage config={pageData.config} social={social} />
      )}
      {pageData.type === 'news' && (
        <NewsPage config={pageData.config} news={pageData.news} />
      )}
    </div>
  );
}
