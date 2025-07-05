"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface BlogFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  locale: string;
  className?: string;
}

const BlogFilter: React.FC<BlogFilterProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  onClearFilters,
  locale,
  className = "",
}) => {
  const t = useTranslations("BlogPage.filter");
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  const handleTagClick = (tag: string) => {
    onTagToggle(tag);
  };

  const toggleTagsExpanded = () => {
    setIsTagsExpanded(!isTagsExpanded);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* フィルターヘッダー */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-body-color dark:text-body-color-dark">
          {t("filterByTag")}
        </h3>
        
        {selectedTags.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary/80 dark:hover:text-primary/80 transition-colors duration-200"
          >
            {t("clearFilters")}
          </button>
        )}
      </div>

      {/* 全タグ一覧 */}
      <div className="space-y-2">
        {/* タグ一覧ヘッダー（レスポンシブ対応） */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-body-color/80 dark:text-body-color-dark/80">
              {t("allTags")} ({tags.length})
            </p>
            
            {/* タブレットサイズ以下で表示される折りたたみボタン */}
            <button
              onClick={toggleTagsExpanded}
              className="md:hidden flex items-center gap-1 text-xs text-body-color/60 dark:text-body-color-dark/60 hover:text-primary dark:hover:text-primary transition-colors duration-200"
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isTagsExpanded ? 'rotate-180' : ''
                }`}
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
            </button>
          </div>
        </div>

        {/* タグ一覧（レスポンシブ対応） */}
        <div className={`
          ${isTagsExpanded ? 'block' : 'hidden'} md:block
          flex flex-wrap gap-2
        `}>
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-body-color dark:text-body-color-dark hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md"
                }`}
              >
                {tag}
                {isSelected && (
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* タグが存在しない場合 */}
      {tags.length === 0 && (
        <div className="text-center py-8">
          <p className="text-body-color/60 dark:text-body-color-dark/60">
            {t("noTags")}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogFilter;
