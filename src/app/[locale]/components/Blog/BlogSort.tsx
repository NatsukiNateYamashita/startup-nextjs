'use client';

import { useTranslations } from 'next-intl';
import { SortOption } from './hooks/useSearchBlogs';

interface BlogSortProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  locale: string;
  className?: string;
}

const BlogSort: React.FC<BlogSortProps> = ({
  sortBy,
  onSortChange,
  locale,
  className = '',
}) => {
  const t = useTranslations('BlogPage.sort');

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: t('relevance') },
    { value: 'date', label: t('date') },
    { value: 'title', label: t('title') },
  ];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm text-body-color/80 dark:text-body-color-dark/80 whitespace-nowrap">
        {t('sortBy')}:
      </span>
      
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-white/90 dark:bg-gray-dark/90 backdrop-blur-sm border border-transparent rounded-lg px-4 py-2 pr-8 text-sm text-body-color dark:text-body-color-dark outline-none focus:border-primary dark:focus:border-primary shadow-one transition-all duration-200"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* カスタム矢印アイコン */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-body-color/60 dark:text-body-color-dark/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* ソート方向アイコン（関連度以外） */}
      {sortBy !== 'relevance' && (
        <div className="flex items-center text-body-color/60 dark:text-body-color-dark/60">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default BlogSort;
