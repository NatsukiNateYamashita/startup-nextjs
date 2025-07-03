import Fuse, { IFuseOptions, FuseResult, FuseResultMatch } from 'fuse.js';
import { BlogPost } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';

/**
 * 検索結果の型定義
 */
export interface SearchResult {
  post: BlogPost;
  score: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

/**
 * 検索インデックスの型定義
 */
export interface SearchIndex {
  posts: BlogPost[];
  fuse: Fuse<BlogPost>;
  tags: string[];
  lastUpdated: string;
}

/**
 * 日付範囲の型定義
 */
export interface DateRange {
  start: string;
  end: string;
}

/**
 * 検索設定
 */
const searchOptions: IFuseOptions<BlogPost> = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.4, // 検索の曖昧さ (0=完全一致, 1=すべて一致)
  keys: [
    {
      name: 'title.ja',
      weight: 3,
    },
    {
      name: 'title.en',
      weight: 3,
    },
    {
      name: 'title.zh-TW',
      weight: 3,
    },
    {
      name: 'title.zh-CN',
      weight: 3,
    },
    {
      name: 'excerpt.ja',
      weight: 2,
    },
    {
      name: 'excerpt.en',
      weight: 2,
    },
    {
      name: 'excerpt.zh-TW',
      weight: 2,
    },
    {
      name: 'excerpt.zh-CN',
      weight: 2,
    },
    {
      name: 'tags',
      weight: 2,
    },
    {
      name: 'content.ja',
      weight: 1,
    },
    {
      name: 'content.en',
      weight: 1,
    },
    {
      name: 'content.zh-TW',
      weight: 1,
    },
    {
      name: 'content.zh-CN',
      weight: 1,
    },
    {
      name: 'author.name',
      weight: 1,
    },
  ],
};

/**
 * 検索インデックスを構築
 */
export function buildSearchIndex(posts: BlogPost[]): SearchIndex {
  const fuse = new Fuse(posts, searchOptions);
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  return {
    posts,
    fuse,
    tags: allTags,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * 記事を検索
 */
export function searchPosts(
  query: string,
  index: SearchIndex,
  locale: Locale
): SearchResult[] {
  if (!query.trim()) {
    return index.posts.map(post => ({
      post,
      score: 0,
      matchedFields: [],
      highlights: {},
    }));
  }

  const results = index.fuse.search(query);

  return results.map(result => {
    const matchedFields = result.matches?.map(match => match.key || '') || [];
    const highlights = generateHighlights([...result.matches || []], query, locale);

    return {
      post: result.item,
      score: result.score || 0,
      matchedFields,
      highlights,
    };
  });
}

/**
 * タグで記事をフィルタリング
 */
export function filterPostsByTag(posts: BlogPost[], tags: string[]): BlogPost[] {
  if (tags.length === 0) {
    return posts;
  }

  return posts.filter(post =>
    tags.some(tag => post.tags.includes(tag))
  );
}

/**
 * 日付範囲で記事をフィルタリング
 */
export function filterPostsByDate(posts: BlogPost[], dateRange: DateRange): BlogPost[] {
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);

  return posts.filter(post => {
    const postDate = new Date(post.publishDate);
    return postDate >= startDate && postDate <= endDate;
  });
}

/**
 * 検索語句をハイライト
 */
export function highlightSearchTerms(content: string, query: string): string {
  if (!query.trim()) {
    return content;
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return content.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

/**
 * 検索結果のハイライトを生成
 */
function generateHighlights(
  matches: FuseResultMatch[],
  query: string,
  locale: Locale
): Record<string, string> {
  const highlights: Record<string, string> = {};

  matches.forEach(match => {
    if (match.key && match.value) {
      const highlightedValue = highlightSearchTerms(match.value, query);
      highlights[match.key] = highlightedValue;
    }
  });

  return highlights;
}

/**
 * 正規表現用のエスケープ処理
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 検索結果をソート
 */
export function sortSearchResults(
  results: SearchResult[],
  sortBy: 'relevance' | 'date' | 'title'
): SearchResult[] {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return a.score - b.score; // スコアが低いほど関連性が高い
      
      case 'date':
        return new Date(b.post.publishDate).getTime() - new Date(a.post.publishDate).getTime();
      
      case 'title':
        // 現在のロケールに基づいてタイトルでソート（日本語を優先）
        const titleA = a.post.title.ja || a.post.title.en || '';
        const titleB = b.post.title.ja || b.post.title.en || '';
        return titleA.localeCompare(titleB);
      
      default:
        return 0;
    }
  });
}

/**
 * 検索統計情報を取得
 */
export function getSearchStats(results: SearchResult[]): {
  totalResults: number;
  averageScore: number;
  topMatchedFields: string[];
} {
  const totalResults = results.length;
  const averageScore = totalResults > 0 
    ? results.reduce((sum, result) => sum + result.score, 0) / totalResults
    : 0;

  // 最も多くマッチしたフィールドを集計
  const fieldCounts: Record<string, number> = {};
  results.forEach(result => {
    result.matchedFields.forEach(field => {
      fieldCounts[field] = (fieldCounts[field] || 0) + 1;
    });
  });

  const topMatchedFields = Object.entries(fieldCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([field]) => field);

  return {
    totalResults,
    averageScore,
    topMatchedFields,
  };
}
