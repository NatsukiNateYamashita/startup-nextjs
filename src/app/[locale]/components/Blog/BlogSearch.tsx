'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  locale: string;
  initialValue?: string;
  className?: string;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  placeholder,
  locale,
  initialValue = '',
  className = '',
}) => {
  const t = useTranslations('BlogPage.search');
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* 検索アイコン */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-body-color/60 dark:text-body-color-dark/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 検索入力フィールド */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder || t('placeholder')}
            className="w-full pl-10 pr-12 py-3 text-base text-body-color dark:text-body-color-dark bg-white/90 dark:bg-gray-dark/90 backdrop-blur-sm border border-transparent rounded-lg shadow-one outline-none focus:border-primary dark:focus:border-primary focus-visible:shadow-none transition-all duration-300"
          />

          {/* クリアボタン */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-body-color/60 dark:text-body-color-dark/60 hover:text-primary dark:hover:text-primary transition-colors duration-200"
              aria-label={t('clearButton')}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* 検索ショートカットヒント（デスクトップのみ） */}
      <div className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
        {!query && (
          <div className="flex items-center space-x-1 text-xs text-body-color/40 dark:text-body-color-dark/40">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border text-xs">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border text-xs">
              K
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSearch;
