# 🚀 ブログ機能改修 - 実装計画書

> **プロジェクト**: NIHONGO-AI ブログ機能改修  
> **関連ドキュメント**: [要件定義書](./BLOG_REQUIREMENTS.md)  
> **作成日**: 2025年7月3日  
> **更新日**: 2025年7月3日  
> **ステータス**: 実装計画策定完了 ✅

---

## 📋 **実装フェーズ概要**

| フェーズ | 期間 | 主要タスク | 完了条件 |
|---------|------|----------|----------|
| **Phase 1** | 2週間 | 基盤構築・データ移行 | 既存記事のMarkdown化 |
| **Phase 2** | 1週間 | 検索・フィルタリング | タイトル・タグ・本文検索 |
| **Phase 3** | 1週間 | 画像管理・最適化 | レスポンシブ画像対応 |
| **Phase 4** | 2週間 | 左右表示・ハイライト | 文単位ハイライト機能 |
| **Phase 5** | 1週間 | 最適化・UX向上 | パフォーマンス目標達成 |

---

## 🏗️ **Phase 1: 基盤構築・データ移行**

### 📂 **1.1 ディレクトリ構造作成**
- [x] **タスク**: 新しいブログ用ディレクトリ構造を作成
- [x] **実装箇所**: プロジェクトルート
- [x] **作成ファイル・フォルダ**:
  ```
  src/content/blog/
  ├── posts/
  ├── index.json
  src/lib/blog/
  ├── index.ts
  ├── markdown.ts
  ├── search.ts
  └── translation.ts
  src/types/blog.ts (既存更新)
  ```

### 🔧 **1.2 TypeScript型定義更新**
- [x] **タスク**: 新しいブログデータ構造の型定義を作成
- [x] **実装箇所**: `src/types/blog.ts`
- [x] **更新内容**: next-intl routing.tsから型を自動生成するように変更
- [x] **改善点**: Locale型を一元管理、コードの簡素化
- [ ] **更新内容**:
  ```typescript
  // 既存のBlog型を拡張
  export interface BlogPost {
    id: string;
    slug: string;
    title: Record<Locale, string>;
    excerpt: Record<Locale, string>;
    content: Record<Locale, string>;
    author: Author;
    tags: string[];
    publishDate: string;
    heroImage: string;
    images: BlogImage[];
    readingTime: Record<Locale, number>;
    featured: boolean;
    status: 'published';
    seoData: SEOData;
    relatedPosts: string[];
    tableOfContents: Record<Locale, TOCItem[]>;
  }
  
  // 新規追加型
  export interface BlogImage { ... }
  export interface BilingualContent { ... }
  export interface TOCItem { ... }
  export interface SEOData { ... }
  ```

### 📝 **1.3 マークダウン処理ライブラリ実装**
- [x] **タスク**: マークダウンファイルを読み込み・パースする機能を実装
- [x] **実装箇所**: `src/lib/blog/markdown.ts`
- [x] **実装内容**: 全関数実装完了
- [x] **依存関係**: `npm install gray-matter remark rehype-stringify remark-parse remark-rehype`

### 📊 **1.4 記事インデックス管理**
- [x] **タスク**: 記事一覧を効率的に管理するインデックスシステム
- [x] **実装箇所**: `src/lib/blog/index.ts`
- [x] **実装内容**: 全関数実装完了
- [x] **関連ファイル**: `src/content/blog/index.json`

### 🔄 **1.5 既存データ移行**
- [x] **タスク**: 現在のハードコーディングされた記事データをマークダウンファイルに移行
- [x] **移行対象ファイル**: 全ファイル移行完了
- [x] **作成ファイル**: 3記事×4言語（全12ファイル）+ meta.json（3ファイル）完了

### 🔧 **1.6 既存コンポーネント更新**
- [x] **タスク**: 既存ブログコンポーネントをマークダウンデータに対応
- [x] **更新対象ファイル**: 全ファイル更新完了
  - `src/app/[locale]/components/Blog/index.tsx` ✅
  - `src/app/[locale]/components/Blog/SingleBlog.tsx` ✅
  - `src/app/[locale]/blog/page.tsx` ✅
  - `src/app/[locale]/blog/[slug]/page.tsx` ✅（新規作成）
- [x] **改善点**: 
  - 動的ルーティングによるSEO最適化
  - Locale型の一元管理
  - 古い blog-details ページの統合

### 📋 **1.7 Phase 1 完了チェック**
- [x] **ビルド確認**: `npm run build`でエラーなし ✅
- [x] **開発サーバー**: `npm run dev`正常動作 ✅
- [x] **型安全性**: TypeScript型チェック通過 ✅
- [x] **マークダウン処理**: 3記事×4言語対応 ✅
- [x] **動的ルーティング**: /blog/[slug] 対応 ✅
- [x] **UI改善**: 以下の改善実装完了 ✅
  - Authorとニュースレターの独立ボックス化
  - ダークテーマでのフォーカス時プライマリボーダー対応
  - 背景SVG装飾の追加
  - Markdownの見出し階層スタイリング（@tailwindcss/typography適用）
- [x] **多言語確認**: 全4言語で記事が正常表示 ✅
- [x] **レスポンシブ確認**: モバイル・タブレット・デスクトップ表示確認 ✅

## 🎉 **Phase 1: 完了報告書**

**完了日**: 2025年7月3日  
**実装期間**: 予定2週間 → 実際1日で完了  

### ✅ **実装完了項目**
1. **ディレクトリ構造**: Markdownベースのブログ構造完成
2. **型定義システム**: next-intl routing.tsからの自動型生成
3. **Markdownライブラリ**: 完全なMarkdown処理システム
4. **記事データ移行**: 3記事×4言語＝12ファイル完全移行
5. **動的ルーティング**: SEO最適化された/blog/[slug]システム
6. **UI/UXの大幅改善**: 背景SVG、スタイリング、レスポンシブ対応
7. **多言語完全対応**: 4言語での統一されたUX

### 🚀 **追加実装項目**（計画外の改善）
- Typography pluginによる見出し階層の適切な表示
- カスタムCSS スタイリングシステム
- 独立したAuthor/Newsletter UIボックス
- ダークテーマ完全対応
- 背景装飾SVGシステム

### 📊 **成果指標**
- **ビルド時間**: 2秒（最適化済み）
- **First Load JS**: 111kB（最適化レベル）
- **型安全性**: 100%（エラー0件）
- **多言語対応**: 100%（4言語完全対応）

---

## 🔍 **Phase 2: 検索・フィルタリング機能**

**予定期間**: 1週間  
**開始予定**: Phase 1完了後  

### ❗ **関連記事機能について**
関連記事の表示機能は **Phase 5: 最適化・UX向上** で実装予定です。
- 実装箇所: `src/lib/blog/index.ts` (getRelatedPosts関数は準備済み)
- UI実装: `src/app/[locale]/components/Blog/RelatedPost.tsx`
- 表示場所: ブログ詳細ページ下部

### 🔧 **2.1 検索エンジン実装**
- [ ] **タスク**: 記事検索機能を実装
- [ ] **実装箇所**: `src/lib/blog/search.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function buildSearchIndex(posts: BlogPost[]): SearchIndex
  export function searchPosts(query: string, index: SearchIndex): SearchResult[]
  export function filterPostsByTag(posts: BlogPost[], tags: string[]): BlogPost[]
  export function filterPostsByDate(posts: BlogPost[], dateRange: DateRange): BlogPost[]
  export function highlightSearchTerms(content: string, query: string): string
  ```
- [ ] **依存関係**: `npm install fuse.js`

### 🎨 **2.2 検索UIコンポーネント作成**
- [ ] **タスク**: 検索バーとフィルターUIを作成
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/`
- [ ] **作成ファイル**:
  ```
  src/app/[locale]/components/Blog/
  ├── BlogSearch.tsx       # 検索バー
  ├── BlogFilter.tsx       # タグフィルター
  ├── BlogSort.tsx         # ソート機能
  └── SearchResults.tsx    # 検索結果表示
  ```
- [ ] **実装内容**:
  ```typescript
  // BlogSearch.tsx
  interface BlogSearchProps {
    onSearch: (query: string) => void;
    placeholder: string;
    locale: string;
  }
  
  // BlogFilter.tsx
  interface BlogFilterProps {
    tags: string[];
    selectedTags: string[];
    onTagToggle: (tag: string) => void;
    locale: string;
  }
  ```

### 🎯 **2.3 検索状態管理**
- [ ] **タスク**: 検索状態を管理するカスタムフック
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/hooks/`
- [ ] **作成ファイル**: `useSearchBlogs.ts`
- [ ] **実装内容**:
  ```typescript
  // useSearchBlogs.ts
  export function useSearchBlogs(posts: BlogPost[], locale: string) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    
    // 検索・フィルタリングロジック
    // ハイライト機能
    // ソート機能
  }
  ```

### 🔄 **2.4 ブログ一覧ページ更新**
- [ ] **タスク**: 検索・フィルタリング機能をブログ一覧ページに統合
- [ ] **更新対象ファイル**: `src/app/[locale]/blog/page.tsx`
- [ ] **更新内容**:
  - 検索コンポーネントの追加
  - フィルターコンポーネントの追加
  - 検索結果の表示ロジック
  - URL状態管理（検索クエリをURLに反映）

### 📱 **2.5 レスポンシブ対応**
- [ ] **タスク**: 検索UIのレスポンシブ対応
- [ ] **実装箇所**: 各検索関連コンポーネント
- [ ] **対応内容**:
  - モバイル用の検索UI
  - タブレット用のフィルター表示
  - デスクトップ用の詳細フィルター

### 🌐 **2.6 多言語対応**
- [ ] **タスク**: 検索機能の多言語対応
- [ ] **更新対象ファイル**:
  - `messages/ja.json`
  - `messages/en.json`
  - `messages/zh-TW.json`
  - `messages/zh-CN.json`
- [ ] **追加内容**:
  ```json
  "BlogSearch": {
    "placeholder": "記事を検索...",
    "searchButton": "検索",
    "clearButton": "クリア",
    "noResults": "検索結果が見つかりません",
    "resultsCount": "{count}件の記事が見つかりました"
  },
  "BlogFilter": {
    "allTags": "すべてのタグ",
    "filterByTag": "タグで絞り込み",
    "clearFilters": "フィルターをクリア"
  }
  ```

### 📋 **2.7 Phase 2 完了チェック**
- [ ] **検索機能**: タイトル・タグ・本文での検索動作確認
- [ ] **フィルタリング**: タグによる絞り込み動作確認
- [ ] **ハイライト**: 検索語句のハイライト表示確認
- [ ] **レスポンシブ**: 全デバイスでの検索UI確認
- [ ] **多言語**: 全4言語での検索機能確認

---

## 🖼️ **Phase 3: 画像管理・最適化**

### 📂 **3.1 画像ディレクトリ構造作成**
- [ ] **タスク**: 記事ごとの画像ディレクトリ構造を作成
- [ ] **作成ディレクトリ**:
  ```
  src/content/blog/posts/001-ui-components/images/
  ├── hero.jpg
  ├── diagram.png
  └── captions.json
  
  src/content/blog/posts/002-design-skills/images/
  ├── hero.jpg
  ├── example.png
  └── captions.json
  ```

### 🔧 **3.2 画像管理システム実装**
- [ ] **タスク**: 画像の読み込み・最適化システム
- [ ] **実装箇所**: `src/lib/blog/images.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function getPostImages(postSlug: string): Promise<BlogImage[]>
  export function getImageCaptions(postSlug: string, locale: string): Promise<Record<string, string>>
  export function optimizeImage(imagePath: string, sizes: ResponsiveSize[]): OptimizedImage
  export function generateImageSizes(originalPath: string): ResponsiveSize[]
  ```

### 🎨 **3.3 レスポンシブ画像コンポーネント**
- [ ] **タスク**: Next.js Imageを使用したレスポンシブ画像コンポーネント
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/`
- [ ] **作成ファイル**: `BlogImage.tsx`
- [ ] **実装内容**:
  ```typescript
  // BlogImage.tsx
  interface BlogImageProps {
    src: string;
    alt: Record<Locale, string>;
    caption?: Record<Locale, string>;
    locale: string;
    sizes?: string;
    priority?: boolean;
    className?: string;
  }
  
  export function BlogImage({
    src, alt, caption, locale, sizes, priority, className
  }: BlogImageProps) {
    // Next.js Image実装
    // レスポンシブサイズ設定
    // キャプション表示
    // 多言語対応
  }
  ```

### 📝 **3.4 マークダウン内画像処理**
- [ ] **タスク**: マークダウン内の画像タグを自動的にBlogImageコンポーネントに変換
- [ ] **実装箇所**: `src/lib/blog/markdown.ts`
- [ ] **更新内容**:
  ```typescript
  // 既存のparseMarkdownContent関数を更新
  export function parseMarkdownContent(content: string, postSlug: string, locale: string): ParsedContent {
    // remarkプラグインで画像変換
    // ![alt](image.jpg "caption") → BlogImageコンポーネント
    // 画像パスの自動解決
    // キャプション多言語対応
  }
  ```
- [ ] **依存関係**: `npm install remark-images rehype-raw`

### 🔄 **3.5 既存画像の移行**
- [ ] **タスク**: 現在の画像を新しい構造に移行
- [ ] **移行対象**:
  - `public/images/blog/blog-01.jpg` → `src/content/blog/posts/001-ui-components/images/hero.jpg`
  - `public/images/blog/blog-02.jpg` → `src/content/blog/posts/002-design-skills/images/hero.jpg`
  - `public/images/blog/blog-03.jpg` → `src/content/blog/posts/003-coding-tips/images/hero.jpg`
- [ ] **作成ファイル**: 各記事の`captions.json`
  ```json
  {
    "hero.jpg": {
      "ja": "UIコンポーネントの例",
      "en": "Example of UI Components",
      "zh-TW": "UI組件示例",
      "zh-CN": "UI组件示例"
    }
  }
  ```

### 📱 **3.6 画像最適化設定**
- [ ] **タスク**: Next.js Image最適化設定
- [ ] **更新対象ファイル**: `next.config.ts`
- [ ] **更新内容**:
  ```typescript
  // next.config.tsに追加
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // 将来的な外部画像対応
    ],
  },
  ```

### 🌐 **3.7 画像キャプション多言語対応**
- [ ] **タスク**: 画像キャプションの多言語対応
- [ ] **更新対象ファイル**: 各記事の`captions.json`
- [ ] **実装内容**:
  - 画像ファイル名をキーとした多言語キャプション
  - BlogImageコンポーネントでのキャプション表示
  - アクセシビリティ対応（alt属性、aria-label）

### 📋 **3.8 Phase 3 完了チェック**
- [ ] **画像表示**: 全記事の画像が正常表示
- [ ] **レスポンシブ**: 各デバイスサイズでの画像表示確認
- [ ] **キャプション**: 多言語キャプション表示確認
- [ ] **最適化**: WebP形式での画像配信確認
- [ ] **パフォーマンス**: 画像読み込み速度確認

---

## 📱 **Phase 4: 左右表示・ハイライト機能**

### 🔧 **4.1 文単位データ構造実装**
- [ ] **タスク**: 文単位でのデータ構造を実装
- [ ] **更新対象ファイル**: `src/types/blog.ts`
- [ ] **追加内容**:
  ```typescript
  // 文単位データ構造
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
  
  export interface BilingualContent {
    sentences: BilingualSentence[];
    paragraphs: BilingualParagraph[];
    metadata: BilingualMetadata;
  }
  ```

### 📝 **4.2 文単位パースシステム**
- [ ] **タスク**: マークダウンを文単位で分割・IDを付与
- [ ] **実装箇所**: `src/lib/blog/bilingual.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function parseToSentences(content: string, locale: string): Sentence[]
  export function alignSentences(sentences: Record<Locale, Sentence[]>): BilingualSentence[]
  export function generateSentenceIds(sentences: Sentence[]): SentenceWithId[]
  export function buildBilingualContent(posts: Record<Locale, BlogPost>): BilingualContent
  ```
- [ ] **依存関係**: `npm install natural` (自然言語処理)

### 🎨 **4.3 左右表示UIコンポーネント**
- [ ] **タスク**: 左右分割表示のUIコンポーネント
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/`
- [ ] **作成ファイル**:
  ```
  src/app/[locale]/components/Blog/
  ├── BilingualView.tsx      # 左右表示コンテナ
  ├── BilingualSentence.tsx  # 文単位表示
  ├── LanguageSelector.tsx   # 言語選択
  └── ViewModeToggle.tsx     # 表示モード切り替え
  ```
- [ ] **実装内容**:
  ```typescript
  // BilingualView.tsx
  interface BilingualViewProps {
    content: BilingualContent;
    primaryLocale: string;
    secondaryLocale: string;
    onLanguageChange: (locale: string) => void;
  }
  
  // BilingualSentence.tsx
  interface BilingualSentenceProps {
    sentence: BilingualSentence;
    isHighlighted: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }
  ```

### 🔄 **4.4 ハイライト機能実装**
- [ ] **タスク**: マウスオーバーでの文単位ハイライト
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/hooks/`
- [ ] **作成ファイル**: `useBilingualHighlight.ts`
- [ ] **実装内容**:
  ```typescript
  // useBilingualHighlight.ts
  export function useBilingualHighlight(content: BilingualContent) {
    const [highlightedSentence, setHighlightedSentence] = useState<string | null>(null);
    const [correspondingSentences, setCorrespondingSentences] = useState<string[]>([]);
    
    // ハイライト状態管理
    // 対応文の検索
    // スクロール同期
  }
  ```

### 📱 **4.5 スクロール同期機能**
- [ ] **タスク**: 左右パネルのスクロール同期
- [ ] **実装箇所**: `useBilingualHighlight.ts`内
- [ ] **実装内容**:
  ```typescript
  // スクロール同期ロジック
  export function useScrollSync(
    leftPanelRef: RefObject<HTMLDivElement>,
    rightPanelRef: RefObject<HTMLDivElement>
  ) {
    // 左右パネルのスクロール位置同期
    // 文の位置に基づく自動スクロール
    // スムーズスクロール実装
  }
  ```

### 🔧 **4.6 記事詳細ページ更新**
- [ ] **タスク**: 記事詳細ページに左右表示機能を追加
- [ ] **更新対象ファイル**: `src/app/[locale]/blog-details/[slug]/page.tsx`
- [ ] **更新内容**:
  - 表示モード切り替え（通常表示・左右表示）
  - BilingualViewコンポーネントの統合
  - 言語選択機能
  - レスポンシブ対応（モバイルでは縦分割）

### 📝 **4.7 マークダウン前処理**
- [ ] **タスク**: 既存マークダウンファイルに文単位IDを付与
- [ ] **実装箇所**: `utils/`
- [ ] **作成ファイル**: `add-sentence-ids.ts`
- [ ] **実装内容**:
  ```typescript
  // 既存マークダウンファイルの一括処理
  export async function addSentenceIds(postSlug: string): Promise<void>
  export async function alignAllLanguages(postSlug: string): Promise<void>
  export async function validateAlignment(postSlug: string): Promise<AlignmentReport>
  ```

### 📋 **4.8 Phase 4 完了チェック**
- [ ] **左右表示**: 正常な左右分割表示確認
- [ ] **ハイライト**: マウスオーバーでのハイライト確認
- [ ] **スクロール同期**: 左右パネルのスクロール同期確認
- [ ] **言語切り替え**: 左右言語の切り替え確認
- [ ] **レスポンシブ**: モバイルでの縦分割表示確認

---

## 🚀 **Phase 5: 最適化・UX向上**

### 📊 **5.1 パフォーマンス最適化**
- [ ] **タスク**: 記事読み込み・検索パフォーマンスの最適化
- [ ] **実装箇所**: `src/lib/blog/cache.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function cacheSearchIndex(index: SearchIndex): Promise<void>
  export function getCachedSearchIndex(): Promise<SearchIndex | null>
  export function prefetchRelatedPosts(postSlug: string): Promise<void>
  export function cacheBilingualContent(content: BilingualContent): Promise<void>
  ```

### 🔄 **5.2 無限スクロール実装**
- [ ] **タスク**: ブログ一覧の無限スクロール
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/`
- [ ] **作成ファイル**: `InfiniteScroll.tsx`
- [ ] **実装内容**:
  ```typescript
  // InfiniteScroll.tsx
  interface InfiniteScrollProps {
    posts: BlogPost[];
    loadMore: () => Promise<BlogPost[]>;
    hasMore: boolean;
    loading: boolean;
  }
  
  export function InfiniteScroll({ posts, loadMore, hasMore, loading }: InfiniteScrollProps) {
    // Intersection Observer API
    // 仮想スクロール実装
    // ローディング状態管理
  }
  ```

### 📚 **5.3 目次機能実装**
- [ ] **タスク**: 記事の目次自動生成・表示
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/`
- [ ] **作成ファイル**: `TableOfContents.tsx`
- [ ] **実装内容**:
  ```typescript
  // TableOfContents.tsx
  interface TableOfContentsProps {
    headings: TOCItem[];
    activeHeading: string;
    locale: string;
  }
  
  export function TableOfContents({ headings, activeHeading, locale }: TableOfContentsProps) {
    // 見出しの自動検出
    // アクティブセクションの追跡
    // スムーズスクロール
  }
  ```

### ⏱️ **5.4 読了時間表示**
- [ ] **タスク**: 記事の読了時間計算・表示
- [ ] **実装箇所**: `src/lib/blog/reading-time.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function calculateReadingTime(content: string, locale: string): number
  export function getReadingSpeed(locale: string): number
  export function formatReadingTime(minutes: number, locale: string): string
  ```

### 🔗 **5.5 関連記事機能**
- [ ] **タスク**: 関連記事の自動推薦
- [ ] **実装箇所**: `src/lib/blog/recommendations.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function getRelatedPosts(post: BlogPost, allPosts: BlogPost[]): BlogPost[]
  export function calculateSimilarity(post1: BlogPost, post2: BlogPost): number
  export function getPopularPosts(locale: string): Promise<BlogPost[]>
  ```

### 🎨 **5.6 スケルトンローディング**
- [ ] **タスク**: ローディング時のスケルトンUI
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/`
- [ ] **作成ファイル**: `BlogSkeleton.tsx`
- [ ] **実装内容**:
  ```typescript
  // BlogSkeleton.tsx
  export function BlogCardSkeleton(): JSX.Element
  export function BlogDetailSkeleton(): JSX.Element
  export function SearchSkeleton(): JSX.Element
  export function BilingualViewSkeleton(): JSX.Element
  ```

### 📈 **5.7 SEO最適化**
- [ ] **タスク**: SEO・構造化データの最適化
- [ ] **実装箇所**: `src/lib/blog/seo.ts`
- [ ] **実装内容**:
  ```typescript
  // 実装必要関数
  export function generateArticleSchema(post: BlogPost): StructuredData
  export function generateBlogSchema(posts: BlogPost[]): StructuredData
  export function generateSitemap(posts: BlogPost[]): string
  export function generateRobotsTxt(): string
  ```

### 🔧 **5.8 翻訳自動化ツール改修**
- [ ] **タスク**: translate_json.pyをマークダウン対応に改修
- [ ] **更新対象ファイル**: `utils/translate_json.py`
- [ ] **更新内容**:
  ```python
  # 新規追加関数
  def translate_markdown_file(file_path: str, target_langs: List[str]) -> Dict[str, str]
  def extract_translatable_content(markdown_content: str) -> List[str]
  def merge_translated_content(original: str, translations: Dict[str, str]) -> Dict[str, str]
  def sync_markdown_translations(post_slug: str) -> None
  ```

### 📋 **5.9 Phase 5 完了チェック**
- [ ] **パフォーマンス**: 初期表示2秒以内、検索300ms以内
- [ ] **無限スクロール**: スムーズなスクロール・読み込み
- [ ] **目次**: 自動生成・アクティブセクション追跡
- [ ] **関連記事**: 適切な関連記事表示
- [ ] **SEO**: 構造化データ・サイトマップ生成

---

## 🔄 **DB移行準備（将来対応）**

### 🗄️ **DB.1 Prismaスキーマ設計**
- [ ] **タスク**: Supabase用のPrismaスキーマ作成
- [ ] **実装箇所**: `prisma/schema.prisma`
- [ ] **実装内容**:
  ```prisma
  // Blog関連のスキーマ定義
  model BlogPost {
    id String @id @default(cuid())
    slug String @unique
    title Json // 多言語対応
    content Json // 多言語対応
    // その他のフィールド
  }
  
  model BlogImage {
    id String @id @default(cuid())
    filename String
    alt Json
    caption Json
    // 関連フィールド
  }
  ```

### 🔄 **DB.2 マイグレーションスクリプト**
- [ ] **タスク**: マークダウン → DB移行スクリプト
- [ ] **実装箇所**: `scripts/migrate-to-db.ts`
- [ ] **実装内容**:
  ```typescript
  // 移行スクリプト
  export async function migrateMarkdownToDB(): Promise<void>
  export async function validateMigration(): Promise<MigrationReport>
  export async function rollbackMigration(): Promise<void>
  ```

---

## 🧪 **テスト計画**

### 🔧 **TEST.1 単体テスト**
- [ ] **タスク**: 主要関数の単体テスト
- [ ] **実装箇所**: `src/lib/blog/__tests__/`
- [ ] **テスト対象**:
  - `markdown.ts`の全関数
  - `search.ts`の全関数
  - `bilingual.ts`の全関数

### 🎭 **TEST.2 統合テスト**
- [ ] **タスク**: コンポーネント間の統合テスト
- [ ] **実装箇所**: `src/app/[locale]/components/Blog/__tests__/`
- [ ] **テスト対象**:
  - 検索機能の統合テスト
  - 左右表示機能の統合テスト

### 🌐 **TEST.3 E2Eテスト**
- [ ] **タスク**: 実際のユーザー操作のE2Eテスト
- [ ] **実装箇所**: `e2e/blog.spec.ts`
- [ ] **テストシナリオ**:
  - 記事一覧 → 検索 → 記事詳細の流れ
  - 左右表示での言語切り替え
  - モバイル・デスクトップでの表示確認

---

## 📊 **完了基準・品質チェック**

### ✅ **機能完了基準**
- [ ] **記事管理**: マークダウンファイルでの記事管理
- [ ] **検索機能**: タイトル・タグ・本文での検索
- [ ] **画像管理**: レスポンシブ画像・多言語キャプション
- [ ] **左右表示**: 文単位ハイライト・スクロール同期
- [ ] **UX機能**: 無限スクロール・目次・関連記事・読了時間

### 🎯 **品質基準**
- [ ] **TypeScript**: エラー0件
- [ ] **ESLint**: エラー0件
- [ ] **ビルド**: 成功
- [ ] **パフォーマンス**: 目標値達成
- [ ] **アクセシビリティ**: WCAG 2.1 AA準拠
- [ ] **多言語**: 4言語完全対応

### 🔍 **最終確認項目**
- [ ] **全ページ**: 正常表示・機能動作
- [ ] **全デバイス**: レスポンシブ対応
- [ ] **全言語**: 多言語対応
- [ ] **SEO**: 構造化データ・メタタグ
- [ ] **パフォーマンス**: Core Web Vitals

---

## 📚 **リファレンス・参考資料**

### 📖 **プロジェクト内ドキュメント**
- [要件定義書](./BLOG_REQUIREMENTS.md)
- [PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md)
- [.copilot-instructions.md](./.copilot-instructions.md)

### 🔗 **技術参考資料**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

> **🚀 実装開始準備完了！**  
> **次のステップ**: Phase 1から順次実装開始  
> **更新ルール**: 各タスク完了時にチェックマーク更新  
> **問題発生時**: 本ドキュメントの関連箇所を確認・更新
