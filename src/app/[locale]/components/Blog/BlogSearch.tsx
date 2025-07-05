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
      <h3 className="text-body-color dark:text-body-color-dark text-lg font-semibold">
      {t("searchByKeyword")}
      </h3>
      {/* 検索フォーム */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* 検索アイコン */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="text-body-color/60 dark:text-body-color-dark/60 h-5 w-5"
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
            placeholder={placeholder || t("placeholder")}
            className="text-body-color dark:text-body-color-dark dark:bg-gray-dark/90 shadow-one focus:border-primary dark:focus:border-primary w-full rounded-lg border border-transparent bg-white/90 py-3 pr-12 pl-10 text-base backdrop-blur-sm transition-all duration-300 outline-none focus-visible:shadow-none"
          />

          {/* クリアボタン */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-body-color/60 dark:text-body-color-dark/60 hover:text-primary dark:hover:text-primary absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-200"
              aria-label={t("clearButton")}
            >
              <svg
                className="h-5 w-5"
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
    </div>
  );
};

export default BlogSearch;
