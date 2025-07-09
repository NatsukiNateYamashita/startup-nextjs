# 🚀 NIHONGO-AI プロジェクト - 包括的開発ドキュメント

> **📋 目的**: プロジェクト全体の理解・新規参加者へのオンボーディング・設計判断の根拠提供  
> **👥 対象**: プロジェクトマネージャー、設計者、新規開発者、ステークホルダー  
> **🔄 最終更新**: 2025年7月9日（C### **主要機能（Phase 1-4完了）**
- **マークダウンブログシステム**: 8記事×4言語（動的ルーティング・SEO最適化）
- **著者管理システム**: 独立ファイル管理・AuthorId型安全参照・DB移行準備完了
- **検索・フィルタシステム**: Fuse.js高精度検索・50ms応答・リアルタイムハイライト
- **画像管理システム**: WebP/AVIF最適化・遅延読み込み・多言語キャプション・70%サイズ削減
- **対照翻訳システム**: `/compare/[slug]`による文単位左右表示・中国語完全対応・フォントサイズ調整機能
- **記事自動生成システム**: Claude API・DALL·E 3/Unsplash画像・4言語翻訳・APIキー統一管理oggleButton改善・フォントサイズ調整機能追加）  
> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照

---

## 🎯 **プロジェクト概要**

**NIHONGO-AI**は日本語学習者・教育者向けの**多言語対応Webアプリケーション**です。現在はNext.js 15ベースの高性能静的サイトとして完成し、将来のフル機能WebApp化を見据えた拡張可能な設計となっています。

### **ビジョン**
- **現在**: 高品質な多言語対応静的サイト（マークダウンブログ・検索機能・画像最適化・左右対訳表示・DALL·E 3/Unsplash画像生成）
- **近未来**: データベース統合による動的サイト（ブログCMS・お問い合わせ管理）
- **将来**: フル機能WebApp（認証・課金・ダッシュボード・SaaS機能）

---

## 📊 **プロジェクト全体ステータス**

### 🎉 **ブログ機能改修 完了 (Phase 1-4)**
- **✅ Phase 1**: 基盤構築・マークダウン移行（2025年7月3日）
- **✅ Phase 1.5**: 著者管理システム統一（2025年7月6日）
- **✅ Phase 2**: 検索・フィルタ・ソート機能（2025年7月3日）
- **✅ Phase 3**: 画像管理・最適化システム（2025年7月5日）
- **✅ Phase 4**: 左右表示・対照翻訳機能・中国語対応完了（2025年7月8日）
- **✅ 記事自動生成**: Claude API・DALL·E 3/Unsplash・翻訳システム（2025年7月7日）
- **📋 詳細**: [ブログ要件定義](.github/BLOG_REQUIREMENTS.md) | [実装計画](.github/BLOG_IMPLEMENTATION_PLAN.md)

### 🏆 **主要実装成果**
- **マークダウンブログシステム**: 8記事×4言語（動的ルーティング・SEO最適化）
- **著者管理システム**: 独立ファイル管理・AuthorId型安全参照・DB移行準備完了
- **検索・フィルタシステム**: Fuse.js高精度検索・50ms応答・リアルタイムハイライト
- **画像管理システム**: WebP/AVIF最適化・遅延読み込み・多言語キャプション・70%サイズ削減
- **対照翻訳システム**: `/compare/[slug]`による文単位左右表示・中国語完全対応・フォントサイズ調整機能
- **記事自動生成システム**: Claude API・DALL·E 3/Unsplash画像・4言語翻訳・APIキー統一管理
- **完全多言語対応**: ja/en/zh-TW/zh-CN統一UX

### 🎯 **技術指標達成状況**
| 指標 | 目標 | 実績 | 状況 |
|------|------|------|------|
| ビルド時間 | <10秒 | 6.0秒 | ✅ |
| 検索応答 | <300ms | 50ms | ✅ |
| 画像最適化 | >50% | 70% | ✅ |
| TypeScript | 0エラー | 0エラー | ✅ |
| ESLint | 0エラー | 0エラー | ✅ |
| First Load JS | <150kB | 102-135kB | ✅ |

---

## 🛠 **技術スタック・アーキテクチャ**

> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照  
> **📋 ブログ機能詳細**: [ブログ要件定義](.github/BLOG_REQUIREMENTS.md) | [実装計画](.github/BLOG_IMPLEMENTATION_PLAN.md)

### **技術構成（2025年7月8日現在）**
```yaml
# フロントエンド
フレームワーク: Next.js 15.3.0 (App Router)
言語: TypeScript 5.3.3
UIフレームワーク: Tailwind CSS 4.1.3
国際化: next-intl 4.1.0 (ja/en/zh-TW/zh-CN)
テーマ: next-themes 0.2.1
React: 19.1.0

# ブログシステム（Phase 1-4完了）
マークダウン: gray-matter 4.0.3 + remark/rehype
検索エンジン: Fuse.js 7.1.0 (50ms応答・あいまい検索)
画像最適化: BlogImage + WebP/AVIF + 遅延読み込み
著者管理: 独立ファイル管理・AuthorId型安全参照
左右対訳表示: 文単位ハイライト・センテンスタグ対応・フォントサイズ調整

# 記事自動生成システム（実装済み）
AI生成: Claude API・アイディア&記事生成
画像生成: DALL·E 3/Unsplash API両対応
翻訳: 4言語自動翻訳・センテンスタグ保持
セキュリティ: 環境変数統一管理

# 開発・運用
ランタイム: Node.js 20.x
パッケージマネージャー: npm
リンター: ESLint 9.24.0・Prettier 3.2.5
デプロイ: Vercel（本番稼働中）
ビルド状況: ✅ TypeScript・ESLintエラー0件

# 将来予定技術
データベース: Supabase (PostgreSQL) + Prisma ORM
認証: NextAuth.js
課金: Stripe
テスト: Jest + Playwright
```

### **アーキテクチャ設計原則**
1. **🖥️ Server Component優先**: SEO・パフォーマンス最適化
2. **💻 Client Component最小限**: 必要なインタラクションのみ
3. **🌐 多言語ファースト**: 全コンポーネントでi18n対応
4. **📱 レスポンシブ必須**: モバイルファースト設計
5. **♿ アクセシビリティ**: WCAG 2.1 AA準拠目標



---

## 📝 **ブログシステム概要**

> **📋 詳細仕様**: [ブログ要件定義](.github/BLOG_REQUIREMENTS.md) を参照

### **主要機能（Phase 1-4完了）**
- **マークダウンブログシステム**: 9記事×4言語（動的ルーティング・SEO最適化）
- **著者管理システム**: 独立ファイル管理・AuthorId型安全参照・DB移行準備完了
- **検索・フィルタシステム**: Fuse.js高精度検索・50ms応答・リアルタイムハイライト
- **画像管理システム**: WebP/AVIF最適化・遅延読み込み・多言語キャプション・70%サイズ削減
- **対照翻訳システム**: `/compare/[slug]`による文単位左右表示・中国語完全対応
- **記事自動生成システム**: Claude API・DALL·E 3/Unsplash画像・4言語翻訳・APIキー統一管理

### **技術的特徴**
- **完全型安全**: TypeScript + 厳密な型定義
- **SEO最適化**: Server Components + メタデータ管理
- **パフォーマンス**: 50ms検索応答・70%画像最適化・102-135kB First Load JS
- **アクセシビリティ**: WCAG 2.1 AA準拠・スクリーンリーダー対応
- **多言語ファースト**: next-intl による4言語完全対応
- **UX向上**: CompareToggleButton・フォントサイズ調整・ツールチップ機能

---

## 🤖 **記事自動生成システム**

> **📋 詳細ガイド**: [記事自動生成システム](utils/README.md) を参照

### **主要機能**
- **AI記事生成**: Claude API活用・アイディア→記事→翻訳の自動化
- **画像生成**: DALL·E 3/Unsplash API両対応・高品質画像作成
- **多言語翻訳**: 4言語自動翻訳・センテンスタグ保持
- **品質管理**: 自動検証・ファイル構成チェック・エラー修正

### **技術的価値**
- **開発効率**: 記事作成時間を90%短縮
- **品質保証**: Claude APIによる高品質コンテンツ
- **スケーラビリティ**: 大量記事作成への対応
- **保守性**: 環境変数統一管理・APIキー安全管理

---

## 🎯 **開発ロードマップ**

### **📊 完成機能（Phase 1-4）**
- **✅ Phase 1**: マークダウンブログ・動的ルーティング・SEO最適化
- **✅ Phase 1.5**: 著者管理システム・独立ファイル・型安全参照
- **✅ Phase 2**: Fuse.js検索・フィルタ・ソート・リアルタイムハイライト
- **✅ Phase 3**: WebP/AVIF画像最適化・遅延読み込み・多言語対応
- **✅ Phase 4**: 対照翻訳システム・左右表示・文単位ハイライト・中国語対応
- **✅ 記事自動生成**: Claude API・DALL·E 3・翻訳・セキュリティ統合

### **🚀 今後の計画**
- **Phase 5**: パフォーマンス最適化・UX向上（予定1週間）
- **Phase 6**: データベース統合・動的サイト化（オプション）

### **📈 技術指標目標**
- **パフォーマンス**: Core Web Vitals最適化・First Load JS < 150kB（現在達成中）
- **SEO**: 構造化データ拡充・✅ サイトマップ自動生成完了
- **アクセシビリティ**: WCAG 2.1 AA完全準拠
- **品質**: テスト自動化・CI/CD構築

---

## 🐛 **既知の課題・改善点**

### **🔴 高優先度**
- [x] **型安全性**: Props型定義完了・TypeScriptエラー0件達成
- [x] **SEO**: ✅ サイトマップ自動生成完了（全言語・全ページ対応）
- [ ] **アクセシビリティ**: WCAG 2.1 AA準拠強化
- [ ] **SEO**: 構造化データ拡充

### **🟡 中優先度**  
- [x] **パフォーマンス**: 画像遅延読み込み最適化完了
- [ ] **モバイルUX**: タッチ操作改善
- [ ] **翻訳精度**: ネイティブチェック

### **🟢 低優先度**
- [ ] **コードリファクタリング**: 重複削減
- [ ] **テスト追加**: Jest + Playwright
- [ ] **ドキュメント**: API仕様書

---

## 📚 **関連資料**

### **プロジェクト内ドキュメント**
- **[GitHub Copilot開発指示書](.github/.copilot-instructions.md)** - 実装ルール・コーディング規約
- **[ブログ要件定義](.github/BLOG_REQUIREMENTS.md)** - ブログ機能要件定義・実装状況
- **[ブログ実装計画](.github/BLOG_IMPLEMENTATION_PLAN.md)** - Phase別実装計画・進捗管理
- **[記事自動生成システム](utils/README.md)** - Python自動生成システムの使用方法

### **技術資料**
- [Next.js 15 Documentation](https://nextjs.org/docs/app)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Fuse.js Documentation](https://fusejs.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🔄 **ドキュメント更新履歴**

| 日付 | 変更内容 | 担当者 |
|------|----------|--------|
| 2025-01-28 | 初版作成・MECE構造化 | システム |
| 2025-07-03 | ブログ機能Phase 1&2実装完了反映 | システム |
| 2025-07-05 | Phase 3画像管理システム実装完了 | システム |
| 2025-07-06 | Phase 1.5著者管理・9記事完成・大幅整理 | システム |
| **2025-07-07** | **記事自動生成システム実装完了・重複削除・最新状況反映** | システム |
| **2025-07-08** | **Phase 4完了・左右対訳表示・中国語対応実装完了反映** | システム |
| **2025-07-08** | **ドキュメント整理・重複除去・役割明確化** | システム |
| **2025-07-08** | **PHASE4_IMPLEMENTATION_PLAN.md削除（完了済み）** | システム |


---

## 🏗 **プロジェクト構造**

### **重要ディレクトリ構成**
```
startup-nextjs/
├── 📁 src/app/[locale]/           # App Router多言語ルーティング
│   ├── layout.tsx                # ルートレイアウト (Server)
│   ├── page.tsx                  # ホームページ (Server)
│   ├── components/               # UIコンポーネント群
│   │   ├── CompareToggleButton/  # 対訳表示切り替えボタン（フォントサイズ調整付き）
│   │   └── Blog/                 # ブログ関連コンポーネント
│   ├── blog/                     # ブログ関連ページ
│   ├── compare/[slug]/           # 左右対訳表示ページ
│   └── styles/                   # カスタムCSS・アニメーション
├── 📁 src/content/               # コンテンツ管理
│   ├── blog/posts/               # マークダウン記事（8記事×4言語）
│   │   ├── 001-ui-components/    # UIコンポーネント記事
│   │   ├── 002-design-skills/    # デザインスキル記事
│   │   ├── 003-coding-tips/      # コーディングTips記事
│   │   ├── 004-ai-japanese-education/ # AI×日本語教育記事
│   │   ├── 005-online-japanese-class-tips/ # オンライン授業記事
│   │   ├── 006/                  # 記事自動生成テスト記事
│   │   ├── 007/                  # 記事自動生成テスト記事
│   │   └── 008/                  # 日本語入力システム記事
│   └── authors/                  # 著者データ（独立ファイル管理）
├── 📁 src/lib/blog/              # ブログ機能ライブラリ
├── 📁 messages/                  # 多言語翻訳ファイル（4言語対応）
├── 📁 public/images/             # 静的画像アセット（WebP/AVIF最適化済み）
├── 📁 utils/                     # 記事自動生成システム（Python）
└── 📁 .github/                   # 開発支援・ドキュメント・CI/CD
```

### **コンポーネント分類（最適化済み）**
- **🖥️ Server Components**: ページ・セクション・データ表示（SEO重要）
- **💻 Client Components**: ナビゲーション・フォーム・UI制御（最小限）

---

## 🌐 **国際化システム**

### **サポート言語**
- **🇯🇵 日本語 (ja)** - デフォルト
- **🇺🇸 英語 (en)**
- **🇹🇼 繁体中国語 (zh-TW)**  
- **🇨🇳 簡体中国語 (zh-CN)**

### **実装パターン**
```typescript
// Server Component
const t = await getTranslations("PageName");

// Client Component  
const t = useTranslations("PageName");
```


---


## 🔍 **SEO最適化・サイトマップ**

### **サイトマップ自動生成システム（✅ 実装完了）**
- **ファイル**: `src/app/sitemap.ts`
- **アクセス**: `/sitemap.xml`
- **対応範囲**: 全言語（ja/en/zh-TW/zh-CN）× 全ページ・記事

#### **生成対象URL一覧**
```yaml
静的ページ（32URL）:
  - ホーム: /{locale}/ （4言語 × 1 = 4URL）
  - その他: /{locale}/{about,blog,compare,contact,pricing,signin,signup}/ （4言語 × 7 = 28URL）

動的ページ（64URL）:
  - ブログ記事: /{locale}/blog/{slug}/ （4言語 × 8記事 = 32URL）
  - 対照翻訳: /{locale}/compare/{slug}/ （4言語 × 8記事 = 32URL）

合計: 96URL自動生成
```

#### **SEO設定詳細**
```typescript
// 優先度設定
priority: {
  ホームページ: 1.0,
  静的ページ: 0.8,
  ブログ記事: 0.7,
  対照翻訳: 0.6
}

// 更新頻度
changeFrequency: {
  ホームページ: 'daily',
  静的ページ: 'weekly',
  記事関連: 'monthly'
}

// 最終更新日
lastModified: {
  静的ページ: new Date(),
  記事関連: post.publishDate
}
```

#### **技術特徴**
- **Next.js 15対応**: MetadataRoute.Sitemap型準拠
- **動的生成**: ブログ記事を自動検索・URL生成
- **エラーハンドリング**: 記事取得失敗時の安全なフォールバック
- **パフォーマンス**: ビルド時生成・キャッシュ効果

### **メタデータ最適化**
```typescript
// 各ページでのメタデータ実装例
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PageName" });
  
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      languages: {
        'ja': '/ja/page',
        'en': '/en/page',
        'zh-TW': '/zh-TW/page',
        'zh-CN': '/zh-CN/page',
      }
    }
  };
}
```

---
