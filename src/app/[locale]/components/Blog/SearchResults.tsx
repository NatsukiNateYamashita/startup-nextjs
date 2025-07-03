'use client';

import { useTranslations } from 'next-intl';
import { SearchResult } from '@/lib/blog/search';
import { Locale } from '@/i18n/routing';
import SingleBlog from './SingleBlog';

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  selectedTags: string[];
  totalPosts: number;
  locale: Locale;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchQuery,
  selectedTags,
  totalPosts,
  locale,
  className = '',
}) => {
  const t = useTranslations('BlogPage.search');

  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasFilters = selectedTags.length > 0;
  const isFiltered = hasSearchQuery || hasFilters;

  return (
    <div className={className}>
      {/* 検索結果ヘッダー */}
      <div className="mb-8">
        {isFiltered ? (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-body-color dark:text-body-color-dark">
              {t('searchResultsCount', { count: results.length })}
            </h2>
            
            {/* 検索条件の表示 */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-body-color/80 dark:text-body-color-dark/80">
              {hasSearchQuery && (
                <div className="flex items-center gap-1">
                  <span>{t('searchFor')}:</span>
                  <span className="font-medium text-primary">&quot;{searchQuery}&quot;</span>
                </div>
              )}
              
              {hasFilters && (
                <div className="flex items-center gap-1">
                  <span>{t('filteredByTags')}:</span>
                  <div className="flex gap-1">
                    {selectedTags.map((tag, index) => (
                      <span key={tag} className="font-medium text-primary">
                        {tag}{index < selectedTags.length - 1 && ','}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-body-color dark:text-body-color-dark">
            {t('allPosts', { count: totalPosts })}
          </h2>
        )}
      </div>

      {/* 検索結果 */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {results.map((result) => (
            <div key={result.post.id} className="w-full">
              <SingleBlog 
                blog={result.post} 
                locale={locale}
                searchHighlight={hasSearchQuery ? {
                  query: searchQuery,
                  highlights: result.highlights,
                } : undefined}
              />
              
              {/* 検索スコア表示（開発モード） */}
              {process.env.NODE_ENV === 'development' && hasSearchQuery && (
                <div className="mt-2 text-xs text-body-color/60 dark:text-body-color-dark/60">
                  Score: {result.score.toFixed(3)} | 
                  Fields: {result.matchedFields.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <NoResults 
          searchQuery={searchQuery}
          selectedTags={selectedTags}
          isFiltered={isFiltered}
        />
      )}
    </div>
  );
};

/**
 * 検索結果なしの表示コンポーネント
 */
interface NoResultsProps {
  searchQuery: string;
  selectedTags: string[];
  isFiltered: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  selectedTags,
  isFiltered,
}) => {
  const t = useTranslations('BlogPage.search');

  return (
    <div className="text-center py-16">
      <div className="space-y-4">
        {/* アイコン */}
        <div className="mx-auto w-16 h-16 text-body-color/30 dark:text-body-color-dark/30">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* メッセージ */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-body-color dark:text-body-color-dark">
            {t('noResults')}
          </h3>
          
          {isFiltered ? (
            <div className="space-y-2">
              <p className="text-body-color/80 dark:text-body-color-dark/80">
                {t('noResultsWithFilters')}
              </p>
              
              {/* 検索条件の再表示 */}
              <div className="space-y-1 text-sm">
                {searchQuery && (
                  <p className="text-body-color/60 dark:text-body-color-dark/60">
                    {t('searchQuery')}: <span className="font-medium">&quot;{searchQuery}&quot;</span>
                  </p>
                )}
                {selectedTags.length > 0 && (
                  <p className="text-body-color/60 dark:text-body-color-dark/60">
                    {t('selectedTags')}: <span className="font-medium">{selectedTags.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-body-color/80 dark:text-body-color-dark/80">
              {t('noPostsAvailable')}
            </p>
          )}
        </div>

        {/* 提案 */}
        {isFiltered && (
          <div className="pt-4">
            <p className="text-sm text-body-color/60 dark:text-body-color-dark/60">
              {t('searchSuggestions')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
