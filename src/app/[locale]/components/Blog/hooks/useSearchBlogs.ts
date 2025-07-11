'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { BlogPost } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import {
  SearchResult,
  SearchIndex,
  buildSearchIndex,
  searchPosts,
  filterPostsByTag,
  sortSearchResults,
} from '@/lib/blog/search';

/**
 * ソート方法の型定義
 */
export type SortOption = 'relevance' | 'date' | 'title';

/**
 * 検索状態の型定義
 */
interface SearchState {
  searchQuery: string;
  selectedTags: string[];
  sortBy: SortOption;
  isLoading: boolean;
}

/**
 * 検索ブログのカスタムフック
 */
export function useSearchBlogs(posts: BlogPost[], locale: Locale) {
  // 検索状態
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: '',
    selectedTags: [],
    sortBy: 'relevance',
    isLoading: false,
  });

  // 検索インデックスをメモ化
  const searchIndex = useMemo<SearchIndex>(() => {
    return buildSearchIndex(posts);
  }, [posts]);

  // 利用可能なタグ一覧（現在のロケールのみ）
  const availableTags = useMemo(() => {
    const localeTagsSet = new Set<string>();
    posts.forEach(post => {
      const localeTags = post.tags[locale] || [];
      localeTags.forEach(tag => localeTagsSet.add(tag));
    });
    return Array.from(localeTagsSet).sort();
  }, [posts, locale]);

  // 検索とフィルタリングの実行
  const filteredAndSearchedPosts = useMemo(() => {
    let results: SearchResult[] = [];

    // 検索実行
    if (searchState.searchQuery.trim()) {
      results = searchPosts(searchState.searchQuery, searchIndex, locale);
    } else {
      // 検索クエリがない場合は全記事を結果として返す
      results = posts.map(post => ({
        post,
        score: 0,
        matchedFields: [],
        highlights: {},
      }));
    }

    // タグフィルタリング
    if (searchState.selectedTags.length > 0) {
      const filteredPosts = filterPostsByTag(
        results.map(r => r.post),
        searchState.selectedTags
      );
      results = results.filter(result =>
        filteredPosts.some(post => post.id === result.post.id)
      );
    }

    // ソート
    results = sortSearchResults(results, searchState.sortBy);

    return results;
  }, [searchState, searchIndex, posts, locale]);

  // 検索クエリの更新
  const setSearchQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      searchQuery: query,
      sortBy: query.trim() ? 'relevance' : 'date', // 検索時は関連度順、通常時は日付順
    }));
  }, []);

  // タグの切り替え
  const toggleTag = useCallback((tag: string) => {
    setSearchState(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  }, []);

  // タグをクリア
  const clearTags = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      selectedTags: [],
    }));
  }, []);

  // 全フィルターをクリア
  const clearAllFilters = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      searchQuery: '',
      selectedTags: [],
      sortBy: 'date',
    }));
  }, []);

  // ソート方法の変更
  const setSortBy = useCallback((sortBy: SortOption) => {
    setSearchState(prev => ({
      ...prev,
      sortBy,
    }));
  }, []);

  // 検索統計
  const searchStats = useMemo(() => {
    const hasQuery = searchState.searchQuery.trim().length > 0;
    const hasFilters = searchState.selectedTags.length > 0;
    const totalResults = filteredAndSearchedPosts.length;
    const isFiltered = hasQuery || hasFilters;

    return {
      totalResults,
      totalPosts: posts.length,
      hasQuery,
      hasFilters,
      isFiltered,
      searchQuery: searchState.searchQuery,
      selectedTags: searchState.selectedTags,
    };
  }, [filteredAndSearchedPosts, posts, searchState]);

  // デバウンス検索（オプション）
  const [debouncedQuery, setDebouncedQuery] = useState(searchState.searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchState.searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchState.searchQuery]);

  return {
    // 検索結果
    searchResults: filteredAndSearchedPosts,
    posts: filteredAndSearchedPosts.map(result => result.post),
    
    // 検索状態
    searchQuery: searchState.searchQuery,
    selectedTags: searchState.selectedTags,
    sortBy: searchState.sortBy,
    isLoading: searchState.isLoading,
    
    // 利用可能なオプション
    availableTags,
    
    // アクション
    setSearchQuery,
    toggleTag,
    clearTags,
    clearAllFilters,
    setSortBy,
    
    // 統計情報
    searchStats,
    
    // デバウンス検索
    debouncedQuery,
  };
}

/**
 * URLパラメータと連動する検索フック
 */
export function useSearchBlogsWithURL(posts: BlogPost[], locale: Locale) {
  const searchHook = useSearchBlogs(posts, locale);

  // URLパラメータの読み込み（クライアントサイドのみ）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const queryFromURL = urlParams.get('q') || '';
    const tagsFromURL = urlParams.get('tags')?.split(',').filter(Boolean) || [];

    if (queryFromURL !== searchHook.searchQuery) {
      searchHook.setSearchQuery(queryFromURL);
    }

    // タグの同期
    const currentTags = searchHook.selectedTags.sort().join(',');
    const urlTags = tagsFromURL.sort().join(',');
    if (urlTags !== currentTags) {
      tagsFromURL.forEach(tag => {
        if (!searchHook.selectedTags.includes(tag)) {
          searchHook.toggleTag(tag);
        }
      });
    }
  }, [searchHook]);

  // URL更新
  const updateURL = useCallback(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams();
    
    if (searchHook.searchQuery.trim()) {
      urlParams.set('q', searchHook.searchQuery);
    }
    
    if (searchHook.selectedTags.length > 0) {
      urlParams.set('tags', searchHook.selectedTags.join(','));
    }

    const newURL = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  }, [searchHook.searchQuery, searchHook.selectedTags]);

  // 検索状態が変更されたらURL更新
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL();
    }, 500);

    return () => clearTimeout(timer);
  }, [updateURL]);

  return {
    ...searchHook,
    updateURL,
  };
}
