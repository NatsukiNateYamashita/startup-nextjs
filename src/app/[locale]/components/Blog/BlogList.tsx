'use client';

import { useSearchBlogs } from "@/app/[locale]/components/Blog/hooks/useSearchBlogs";
import BlogSearch from "@/app/[locale]/components/Blog/BlogSearch";
import BlogFilter from "@/app/[locale]/components/Blog/BlogFilter";
import BlogSort from "@/app/[locale]/components/Blog/BlogSort";
import SearchResults from "@/app/[locale]/components/Blog/SearchResults";
import { BlogPost } from "@/app/[locale]/types/blog";
import { Locale } from "@/i18n/routing";

interface BlogListProps {
  posts: BlogPost[];
  locale: Locale;
}

const BlogList: React.FC<BlogListProps> = ({ posts, locale }) => {
  const searchHook = useSearchBlogs(posts, locale);

  return (
    <div className="container">
      {/* 検索・フィルタ・ソート UI */}
      <div className="mb-8 space-y-4">
        {/* 検索バー */}
        <BlogSearch 
          onSearch={searchHook.setSearchQuery}
          placeholder=""
          locale={locale}
          initialValue={searchHook.searchQuery}
        />
        
        {/* フィルタ・ソート */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BlogFilter 
            tags={searchHook.availableTags}
            selectedTags={searchHook.selectedTags}
            onTagToggle={searchHook.toggleTag}
            onClearFilters={searchHook.clearAllFilters}
            locale={locale}
          />
          
          <BlogSort 
            sortBy={searchHook.sortBy}
            onSortChange={searchHook.setSortBy}
            locale={locale}
          />
        </div>
      </div>

      {/* 検索結果 */}
      <SearchResults 
        results={searchHook.searchResults}
        searchQuery={searchHook.searchQuery}
        selectedTags={searchHook.selectedTags}
        totalPosts={posts.length}
        locale={locale}
      />
    </div>
  );
};

export default BlogList;
