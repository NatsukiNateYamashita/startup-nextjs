import { Locale } from "@/i18n/routing";

// 検索ハイライト
export interface SearchHighlight {
  query: string;
  highlights: Record<string, string>;
}

// 著者情報（多言語対応）
export type Author = {
  name: Record<Locale, string>;
  image: string;
  designation: Record<Locale, string>;
  bio?: Record<Locale, string>;
  socials?: {
    x?: string;
    linkedin?: string;
    github?: string;
  };
};

// レスポンシブ画像サイズ
export interface ResponsiveSize {
  width: number;
  height: number;
  breakpoint: string;
}

// 画像最適化設定
export interface ImageOptimizationConfig {
  quality: number;
  formats: readonly string[];
  enableLazyLoading: boolean;
  enableBlurDataURL: boolean;
  compression: {
    readonly webp: { readonly quality: number };
    readonly avif: { readonly quality: number };
  };
}

// ブログ画像
export interface BlogImage {
  filename: string;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  width: number;
  height: number;
  sizes: ResponsiveSize[];
  mimeType?: string;
  fileSize?: number;
  blurDataURL?: string;
  optimized?: {
    webp?: string;
    avif?: string;
    original: string;
  };
}

// 目次アイテム
export interface TOCItem {
  id: string;
  level: number;
  title: string;
  children?: TOCItem[];
}

// SEOデータ
export interface SEOData {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  keywords: string[];
  ogImage?: string;
}

// 文単位データ（Phase 4用）
export interface BilingualSentence {
  id: string;
  ja: string;
  en: string;
  zhTW: string;
  zhCN: string;
  alignment: SentenceAlignment;
}

export interface SentenceAlignment {
  confidence: number;
  manually_verified: boolean;
  source_sentence_id: string;
  target_sentence_ids: string[];
}

export interface BilingualParagraph {
  id: string;
  sentences: string[];
}

export interface BilingualContent {
  sentences: BilingualSentence[];
  paragraphs: BilingualParagraph[];
  metadata: {
    aligned_languages: Locale[];
    alignment_quality: number;
    last_updated: string;
  };
}

// 新しいブログ記事型
export interface BlogPost {
  id: string;
  slug: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  content: Record<Locale, string>;
  author: Author;
  tags: Record<Locale, string[]>;
  publishDate: string;
  heroImage: string;
  images: BlogImage[];
  readingTime: Record<Locale, number>;
  featured: boolean;
  status: 'published';
  seoData: SEOData;
  relatedPosts: string[];
  tableOfContents: Record<Locale, TOCItem[]>;
  bilingualContent?: BilingualContent; // Phase 4で使用
}

// 記事メタデータ
export interface BlogMetadata {
  id: string;
  slug: string;
  publishDate: string;
  author: Author;
  tags: string[];
  heroImage: string;
  featured: boolean;
  status: 'published';
}

// 検索結果
export interface SearchResult {
  post: BlogPost;
  score: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

// 検索インデックス
export interface SearchIndex {
  posts: BlogPost[];
  tags: string[];
  lastUpdated: string;
}

// ブログインデックス
export interface BlogIndex {
  posts: BlogMetadata[];
  tags: string[];
  lastUpdated: string;
  totalPosts: number;
}

// 既存のBlog型（互換性のため残す）
export type Blog = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
};
