# 🚀 NIHONGO-AI プロジェクト - 包括的開発ドキュメント

> **📋 目的**: プロジェクト全体の理解・新規参加者へのオンボーディング・設計判断の根拠提供  
> **👥 対象**: プロジェクトマネージャー、設計者、新規開発者、ステークホルダー  
> **🔄 最終更新**: 2025年7月7日（記事自動生成システム・画像生成改善・セキュリティ強化完了）  
> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照

---

## 🎯 **プロジェクト概要**

**NIHONGO-AI**は日本語学習者・教育者向けの**多言語対応Webアプリケーション**です。現在はNext.js 15ベースの高性能静的サイトとして完成し、将来のフル機能WebApp化を見据えた拡張可能な設計となっています。

### **ビジョン**
- **現在**: 高品質な多言語対応静的サイト（マークダウンブログ・検索機能・画像最適化・DALL·E 3/Unsplash画像生成）
- **近未来**: データベース統合による動的サイト（ブログCMS・お問い合わせ管理）
- **将来**: フル機能WebApp（認証・課金・ダッシュボード・SaaS機能）

---

## � **プロジェクト全体ステータス**

### 🎉 **ブログ機能改修 完了 (Phase 1-3)**
- **✅ Phase 1**: 基盤構築・マークダウン移行（2025年7月3日）
- **✅ Phase 1.5**: 著者管理システム統一（2025年7月6日）
- **✅ Phase 2**: 検索・フィルタ・ソート機能（2025年7月3日）
- **✅ Phase 3**: 画像管理・最適化システム（2025年7月5日）
- **✅ 記事自動生成**: Claude API・DALL·E 3/Unsplash・翻訳システム（2025年7月7日）
- **📋 詳細**: [ブログ要件定義](.github/BLOG_REQUIREMENTS.md) | [実装計画](.github/BLOG_IMPLEMENTATION_PLAN.md)

### 🏆 **主要実装成果**
- **マークダウンブログシステム**: 9記事×4言語（動的ルーティング・SEO最適化）
- **著者管理システム**: 独立ファイル管理・AuthorId型安全参照・DB移行準備完了
- **検索・フィルタシステム**: Fuse.js高精度検索・50ms応答・リアルタイムハイライト
- **画像管理システム**: WebP/AVIF最適化・遅延読み込み・多言語キャプション・70%サイズ削減
- **記事自動生成システム**: Claude API・DALL·E 3/Unsplash画像・4言語翻訳・APIキー統一管理
- **完全多言語対応**: ja/en/zh-TW/zh-CN統一UX

### � **技術指標達成状況**
| 指標 | 目標 | 実績 | 状況 |
|------|------|------|------|
| ビルド時間 | <3秒 | 2秒 | ✅ |
| 検索応答 | <300ms | 50ms | ✅ |
| 画像最適化 | >50% | 70% | ✅ |
| TypeScript | 0エラー | 0エラー | ✅ |
| ESLint | 0エラー | 0エラー | ✅ |
| First Load JS | <150kB | 135kB | ✅ |

---

## 🛠 **技術スタック・アーキテクチャ**

> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照  
> **📋 ブログ機能詳細**: [ブログ要件定義](.github/BLOG_REQUIREMENTS.md) | [実装計画](.github/BLOG_IMPLEMENTATION_PLAN.md)

### **技術構成（2025年7月7日現在）**
```yaml
# フロントエンド
フレームワーク: Next.js 15.3.0 (App Router)
言語: TypeScript 5.3.3
UIフレームワーク: Tailwind CSS 4.1.3
国際化: next-intl 4.1.0 (ja/en/zh-TW/zh-CN)
テーマ: next-themes 0.2.1

# ブログシステム（Phase 1-3完了）
マークダウン: gray-matter + remark/rehype
検索エンジン: Fuse.js (50ms応答・あいまい検索)
画像最適化: BlogImage + WebP/AVIF + 遅延読み込み
著者管理: 独立ファイル管理・AuthorId型安全参照

# 記事自動生成システム（実装済み）
AI生成: Claude API・アイディア&記事生成
画像生成: DALL·E 3/Unsplash API両対応
翻訳: 4言語自動翻訳システム
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

## 🏗 **プロジェクト構造**

### **重要ディレクトリ構成**
```
startup-nextjs/
├── 📁 src/app/[locale]/           # App Router多言語ルーティング
│   ├── layout.tsx                # ルートレイアウト (Server)
│   ├── page.tsx                  # ホームページ (Server)
│   ├── components/               # UIコンポーネント群
│   └── blog/                     # ブログ関連ページ
├── 📁 src/content/               # コンテンツ管理
│   ├── blog/posts/               # マークダウン記事（9記事×4言語）
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

## 📝 **ブログシステム詳細**

### **記事管理構造（9記事×4言語完成）**
```
posts/001-ui-components/
├── ja.md                        # 日本語コンテンツ
├── en.md                        # 英語コンテンツ
├── zh-CN.md, zh-TW.md          # 中国語コンテンツ
├── meta.json                    # 記事メタデータ
└── images/                      # 記事専用画像
    ├── hero.jpg
    ├── example.png
    └── captions.json            # 多言語キャプション
```

### **著者管理システム（Phase 1.5実装）**
```
authors/
├── natsuki-yamashita.json       # 著者詳細
├── nihongo-ai.json
└── samuel-josh.json

# meta.jsonでの参照
{
  "authorId": "natsuki-yamashita",  // ID参照のみ
  "tags": { "ja": ["AI"], "en": ["AI"] },
  "publishDate": "2025-07-06T11:33:00.000Z"
}
```

### **完成済み記事一覧（9記事）**
1. **001-ui-components**: UIコンポーネント設計
2. **002-design-skills**: デザインスキル向上  
3. **003-coding-tips**: 効率的コーディング
4. **004-ai-japanese-education**: AI×日本語教育
5. **005-online-japanese-class-tips**: オンライン授業のコツ
6. **006-ai-japanese-learning**: 日本語学習AI活用
7. **007-ai-learning-material-creation**: AI学習教材作成術
8. **008-japanese-input-optimization**: 日本語入力最適化
9. **009-japanese-ai-tool-evaluation**: 日本語AIツール評価

---

## 🔧 **記事自動生成システム（実装済み）**

### **システム構成**
```
utils/
├── idea_generator.py            # Claude APIによるアイディア生成
├── article_generator.py         # 多言語記事・メタデータ自動作成
├── image_generator.py           # DALL·E 3/Unsplash API画像生成
├── translator.py               # 4言語自動翻訳システム
├── config.py                   # 環境変数・APIキー統一管理
└── main.py                     # 全体統合・実行スクリプト
```

### **利用方法**
```bash
# 記事自動生成（アイディア→記事→画像→翻訳）
cd utils
python main.py

# 個別実行も可能
python idea_generator.py       # アイディア生成のみ
python article_generator.py    # 記事生成のみ
python image_generator.py      # 画像生成のみ
```

---

## 🎯 **開発ロードマップ**

### **📊 完成機能（Phase 1-3）**
- **✅ Phase 1**: マークダウンブログ・動的ルーティング・SEO最適化
- **✅ Phase 1.5**: 著者管理システム・独立ファイル・型安全参照
- **✅ Phase 2**: Fuse.js検索・フィルタ・ソート・リアルタイムハイライト
- **✅ Phase 3**: WebP/AVIF画像最適化・遅延読み込み・多言語対応
- **✅ 記事自動生成**: Claude API・DALL·E 3・翻訳・セキュリティ統合

### **🚀 今後の計画**
- **Phase 4**: 左右表示・対照翻訳機能（予定2週間）
- **Phase 5**: パフォーマンス最適化・UX向上（予定1週間）
- **Phase 6**: データベース統合・動的サイト化（オプション）

### **📈 技術指標目標**
- **パフォーマンス**: Core Web Vitals最適化・First Load JS < 150kB
- **SEO**: 構造化データ拡充・サイトマップ自動生成
- **アクセシビリティ**: WCAG 2.1 AA完全準拠
- **品質**: テスト自動化・CI/CD構築

---

## 🐛 **既知の課題・改善点**

### **🔴 高優先度**
- [x] **型安全性**: Props型定義完了・TypeScriptエラー0件達成
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

> **📋 目的**: プロジェクト全体の理解・新規参加者へのオンボーディング・設計判断の根拠提供  
> **👥 対象**: プロジェクトマネージャー、設計者、新規開発者、ステークホルダー  
> **🔄 最終更新**: 2025年7月3日（ブログ機能改修Phase 1&2完了）  
> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照

---

## 📋 **プロジェクト全体ステータス**

### 🎉 **Phase 1完了 (ブログ機能改修)**
- **✅ 完了日**: 2025年7月3日
- **� 要件定義**: [BLOG_REQUIREMENTS.md](.github/BLOG_REQUIREMENTS.md)
- **📋 実装計画**: [BLOG_IMPLEMENTATION_PLAN.md](.github/BLOG_IMPLEMENTATION_PLAN.md)

### 🏆 **主要実装成果**
- **マークダウンベースブログシステム**: 3記事×4言語完全移行
- **動的ルーティング**: SEO最適化された/blog/[slug]システム
- **型安全性**: next-intl routingからの自動型生成
- **UI/UX大幅改善**: Typography plugin、背景SVG、独立UIボックス
- **完全多言語対応**: ja/en/zh-TW/zh-CN統一UX
- [x] Header + ナビゲーション（Clientで継続）
- [x] Footer Server Component化完了
- [x] ThemeToggler（ダーク/ライトモード）
- [x] PricingClient（月額/年額切替）
- [x] NewsLatterBoxClient（フォーム処理）
- [x] ScrollToTop + VideoModal

**🎨 ブランドカラー・ロゴカスタマイズ **
- [x] オレンジ系統に変更
- [x] 色のハードコーディングから.css参照への変更

**🖼️ 画像管理 **
- [x] favicon作成(https://github.com/NatsukiNateYamashita/favicon_generator)
- [x] logo作成(https://github.com/NatsukiNateYamashita/logo_generator)
- [x] **WebP/AVIF画像最適化実装完了**
- [x] **Intersection Observer遅延読み込み完了**
- [x] **多言語キャプション・alt属性対応完了**
- [x] **BlogImage・LazyImage・ImageGalleryコンポーネント実装完了**---

## 🛠 **技術スタック・アーキテクチャ**

> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md#-アーキテクチャ設計規則) を参照  
> **📋 ブログ機能詳細**: [ブログ要件定義](.github/BLOG_REQUIREMENTS.md) | [実装計画](.github/BLOG_IMPLEMENTATION_PLAN.md) を参照

### **技術構成（2025年7月6日現在）**
```yaml
# フロントエンド
フレームワーク: Next.js 15.3.0 (App Router)
言語: TypeScript 5.3.3
UIフレームワーク: Tailwind CSS 4.1.3
国際化: next-intl 4.1.0 (ja/en/zh-TW/zh-CN)
テーマ: next-themes 0.2.1

# ブログシステム（Phase 1-3完了）
マークダウン: gray-matter + remark/rehype
検索エンジン: Fuse.js (50ms応答・あいまい検索)
画像最適化: BlogImage + WebP/AVIF + 遅延読み込み
著者管理: 独立ファイル管理・AuthorId型安全参照

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

## 🏗 **プロジェクト構造**

### **重要ディレクトリ構成**
```
startup-nextjs/
├── 📁 src/app/[locale]/           # App Router多言語ルーティング
│   ├── layout.tsx                # ルートレイアウト (Server)
│   ├── page.tsx                  # ホームページ (Server)
│   ├── components/               # UIコンポーネント群
│   └── blog/                     # ブログ関連ページ
├── 📁 src/content/               # コンテンツ管理
│   ├── blog/posts/               # マークダウン記事
│   └── authors/                  # 著者データ
├── 📁 src/lib/blog/              # ブログ機能ライブラリ
├── 📁 messages/                  # 多言語翻訳ファイル
├── 📁 public/images/             # 静的画像アセット
└── 📁 .github/                   # 開発支援・CI/CD
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

## 📝 **ブログシステム詳細**

### **記事管理構造**
```
posts/001-ui-components/
├── ja.md                        # 日本語コンテンツ
├── en.md                        # 英語コンテンツ
├── zh-CN.md, zh-TW.md          # 中国語コンテンツ
├── meta.json                    # 記事メタデータ
└── images/                      # 記事専用画像
    ├── hero.jpg
    ├── example.png
    └── captions.json            # 多言語キャプション
```

### **著者管理システム（Phase 1.5実装）**
```
authors/
├── natsuki-yamashita.json       # 著者詳細
├── nihongo-ai.json
└── samuel-josh.json

# meta.jsonでの参照
{
  "authorId": "natsuki-yamashita",  // ID参照
  "tags": { "ja": ["AI"], "en": ["AI"] },
  "publishDate": "2025-07-06T11:33:00.000Z"
}
```

### **現在の記事一覧**
1. **001-ui-components**: UIコンポーネント設計
2. **002-design-skills**: デザインスキル向上
3. **003-coding-tips**: コーディングのコツ
4. **004-ai-japanese-education**: AI×日本語教育
5. **005-online-japanese-class-tips**: オンライン授業のコツ

---

## 🎯 **開発ロードマップ**

### **📊 完成機能（Phase 1-3）**
- **✅ 基盤構築**: マークダウンブログ・動的ルーティング
- **✅ 著者管理**: 独立ファイル・型安全参照・DB移行準備
- **✅ 検索システム**: Fuse.js高精度検索・フィルタ・ソート
- **✅ 画像管理**: WebP/AVIF最適化・遅延読み込み・多言語対応

### **🚀 今後の計画**
- **Phase 4**: 左右表示・対照翻訳機能（予定2週間）
- **Phase 5**: 最適化・UX向上（予定1週間）
- **Phase 6**: データベース統合（オプション）

### **📈 技術指標目標**
- **パフォーマンス**: Core Web Vitals最適化
- **SEO**: 構造化データ拡充・サイトマップ自動生成
- **アクセシビリティ**: WCAG 2.1 AA完全準拠
- **品質**: テスト自動化・CI/CD構築

---

## 📚 **関連資料**

### **プロジェクト内ドキュメント**
- **[.copilot-instructions.md](.github/.copilot-instructions.md)** - 実装ルール・コーディング規約
- **[BLOG_REQUIREMENTS.md](.github/BLOG_REQUIREMENTS.md)** - ブログ機能要件定義
- **[BLOG_IMPLEMENTATION_PLAN.md](.github/BLOG_IMPLEMENTATION_PLAN.md)** - 実装計画・進捗管理

### **技術資料**
- [Next.js 15 Documentation](https://nextjs.org/docs/app)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Fuse.js Documentation](https://fusejs.io/)

---

## 🔄 **ドキュメント更新履歴**

| 日付 | 変更内容 | 担当者 |
|------|----------|--------|
| 2025-01-28 | 初版作成 | システム |
| 2025-07-03 | ブログ機能Phase 1&2実装完了反映 | システム |
| 2025-07-05 | Phase 3画像管理システム実装完了 | システム |
| 2025-07-06 | Phase 1.5著者管理・005記事追加・大幅整理 | システム |
## 🔧 **開発環境・セットアップ**

> **⚙️ 実装詳細**: [開発指示書](.github/.copilot-instructions.md#-開発ワークフロー実装手順) の「開発ワークフロー・実装手順」を参照

### **開発開始手順**
```bash
# 1. 依存関係インストール
npm install

# 2. 開発サーバー起動
npm run dev         # http://localhost:3000

# 3. ビルド確認
npm run build       # 本番ビルドテスト
npm run lint        # ESLintチェック
```

### **開発ルール・ベストプラクティス**
```yaml
必須対応:
  - 多言語対応: 全テキストは翻訳ファイルから取得
  - TypeScript: any型の使用禁止、型安全性の確保
  - レスポンシブ: 全画面サイズ対応
  - アクセシビリティ: WCAG 2.1 AA準拠

推奨パターン:
  - Server Component優先: SEO・パフォーマンス最適化
  - Client Component最小限: 必要な場合のみ使用
  - コンポーネント再利用: Common/フォルダの活用
```

## 🐛 **既知の課題・改善点**

### **🔴 高優先度**
- [x] **型安全性**: Props型定義完了・TypeScriptエラー0件達成
- [ ] **アクセシビリティ**: WCAG 2.1 AA準拠強化
- [ ] **SEO**: 構造化データ拡充

### **🟡 中優先度**  
- [ ] **パフォーマンス**: 画像遅延読み込み最適化
- [ ] **モバイルUX**: タッチ操作改善
- [ ] **翻訳精度**: ネイティブチェック

### **🟢 低優先度**
- [ ] **コードリファクタリング**: 重複削減
- [ ] **テスト追加**: Jest + Playwright
- [ ] **ドキュメント**: API仕様書

## 📚 **参考資料・関連リンク**

### **プロジェクト内資料**
- **[.github/.copilot-instructions.md](.github/.copilot-instructions.md)** - 開発実装ガイド
- **[README.md](README.md)** - プロジェクト基本説明
- **[package.json](package.json)** - 依存関係・スクリプト
- **[next.config.ts](next.config.ts)** - Next.js設定

### **外部技術資料**
- **Next.js 15**: [App Router Documentation](https://nextjs.org/docs/app)
- **next-intl**: [Internationalization Guide](https://next-intl-docs.vercel.app/)
- **Tailwind CSS**: [Utility-First Framework](https://tailwindcss.com/)
- **TypeScript**: [Official Handbook](https://www.typescriptlang.org/docs/)

---

## � **ドキュメント更新履歴**

| 日付 | 変更内容 | 担当者 |
|------|----------|--------|
| 2025-01-28 | 初版作成・MECE構造化 | システム |
| 2025-01-28 | Footer Server Component化反映 | システム |
| 2025-01-28 | 開発指示書との役割分担明確化 | システム |
| 2025-07-02 | **Git履歴・実装状況を基に全面更新** | システム |
| 2025-07-02 | プロジェクト名をNIHONGO-AIに修正 | システム |
| 2025-07-02 | 進捗状況を実際のコード・ビルド結果に合わせて更新 | システム |
| 2025-07-02 | Props型定義解決・技術的問題解決状況を反映 | システム |
| 2025-07-02 | 全ページ実装完了状況を反映 | システム |
| **2025-07-03** | **ブログ機能改修Phase 1&2完了を反映** | システム |
| **2025-07-03** | **マークダウンベースブログシステム実装完了** | システム |
| **2025-07-03** | **動的ルーティング・多言語対応・UI改善完了** | システム |
| **2025-07-03** | **Fuse.js検索・フィルタ・ソート機能実装完了** | システム |
| **2025-07-03** | **リアルタイム検索・ハイライト機能追加** | システム |
| **2025-07-03** | **14個の新規i18nキー追加（4言語対応）** | システム |
| **2025-07-05** | **Phase 3画像管理システム実装完了を反映** | システム |
| **2025-07-05** | **WebP/AVIF最適化・遅延読み込み・多言語キャプション完了** | システム |
| **2025-07-05** | **BlogImage・LazyImage・ImageGallery新規コンポーネント追加** | システム |
