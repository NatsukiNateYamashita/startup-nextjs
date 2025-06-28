# 🚀 Startup Next.js プロジェクト - 包括的開発ドキュメント

> **📋 目的**: プロジェクト全体の理解・新規参加者へのオンボーディング・設計判断の根拠提供  
> **👥 対象**: プロジェクトマネージャー、設計者、新規開発者、ステークホルダー  
> **🔄 更新頻度**: プロジェクト仕様変更時・新機能追加時  
> **⚙️ 実装詳細**: [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照

---

## 📋 **プロジェクト概要**

このプロジェクトは、**スタートアップ・SaaS企業向けのNext.jsテンプレート**を基に構築された**多言語対応Webアプリケーション**です。next-intl を使用した国際化機能と、将来のWebApp化を見据えた拡張可能な設計となっています。

### 🎯 **プロジェクトビジョン**
- **現在**: 高品質な多言語対応静的サイト（コーポレート・ランディングページ）
- **近未来**: データベース統合による動的サイト（ブログCMS、お問い合わせ管理）
- **将来**: フル機能WebApp（認証、課金、ダッシュボード、SaaS機能）

## 🛠 **技術スタック・アーキテクチャ**

> **💡 実装詳細**: [開発指示書](.github/.copilot-instructions.md#-アーキテクチャ設計規則) の「アーキテクチャ設計規則」セクションを参照

### **現在の技術構成**
```yaml
# フロントエンド
フレームワーク: Next.js 15.3.0 (App Router)
言語: TypeScript 5.3.3
UIフレームワーク: Tailwind CSS 4.1.3
国際化: next-intl 4.1.0
テーマ: next-themes 0.2.1

# 開発環境
ランタイム: Node.js 20.x
パッケージマネージャー: npm
リンター: ESLint 9.24.0
フォーマッター: Prettier 3.2.5

# 将来予定
データベース: Supabase (PostgreSQL) + Prisma ORM
認証: NextAuth.js
課金: Stripe
テスト: Jest + Playwright
CI/CD: GitHub Actions
```

### **アーキテクチャ原則**
1. **🖥️ Server Component優先**: SEO・パフォーマンス最適化
2. **💻 Client Component最小限**: 必要な場合のみ使用
3. **🌐 多言語ファースト**: 全コンポーネントでi18n対応
4. **📱 レスポンシブ必須**: モバイルファースト設計
5. **♿ アクセシビリティ**: WCAG 2.1 AA準拠

## 🏗 **プロジェクト構造・ファイル構成**

> **⚙️ 実装ガイド**: [開発指示書](.github/.copilot-instructions.md#️-アーキテクチャ設計規則) の「ディレクトリ構造」「Server vs Client Component分類」を参照

### **📁 主要ディレクトリ役割**

| ディレクトリ | 役割 | 重要度 | 詳細 |
|--------------|------|--------|------|
| `src/app/[locale]/` | **App Routerルーティング** | 🔴 必須 | 多言語対応ページ・レイアウト |
| `src/app/[locale]/components/` | **UIコンポーネント群** | 🔴 必須 | 再利用可能コンポーネント |
| `src/i18n/` | **国際化設定** | 🔴 必須 | ルーティング・翻訳設定 |
| `messages/` | **翻訳ファイル** | 🔴 必須 | 4言語対応JSON |
| `public/images/` | **静的アセット** | 🟡 重要 | 画像・アイコン・ロゴ |
| `.github/` | **GitHub設定・開発支援** | 🟡 重要 | Copilot指示書・CI/CD |

### **🖥️💻 コンポーネント分類（最適化完了✅）**

#### **🖥️ Server Components** (SEO・パフォーマンス最適化)
```
ページ: 全page.tsx (layout.tsx, ホーム, About, ブログ等)
セクション: Hero, Features, About, Blog, Testimonials, Video, Footer
データ表示: SingleBlog, SingleFeature, SingleTestimonial
静的UI: SectionTitle, Breadcrumb
```

#### **💻 Client Components** (インタラクション必須のみ)
```
ナビゲーション: Header, LanguageSwitcher, ThemeToggler
フォーム: NewsLatterBoxClient, PricingClient
UI制御: VideoPlayButton, ScrollToTop, video-modal
レイアウト: ClientLayout, providers.tsx
```
```
startup-nextjs/
├── 📁 .github/                    # GitHub設定・CI/CD・開発支援
│   └── .copilot-instructions.md  # GitHub Copilot開発指示書 + 開発プロンプト統合
├── 📁 src/
│   ├── 📁 app/[locale]/           # App Routerによる多言語ルーティング
│   │   ├── layout.tsx             # 🖥️ SERVER: ルートレイアウト (i18n設定、メタデータ)
│   │   ├── page.tsx               # 🖥️ SERVER: ホームページ (全セクション統合)
│   │   ├── ClientLayout.tsx       # 💻 CLIENT: クライアントレイアウト (Provider統合)
│   │   ├── providers.tsx          # 💻 CLIENT: テーマプロバイダー (next-themes)
│   │   ├── 📁 components/         # UIコンポーネント群
│   │   │   ├── 📁 Header/         # ナビゲーション・ヘッダー関連
│   │   │   │   ├── index.tsx      # 💻 CLIENT: メインヘッダー (スクロール、サブメニュー)
│   │   │   │   ├── LanguageSwitcher.tsx  # 💻 CLIENT: 言語切替 (ドロップダウン)
│   │   │   │   ├── ThemeToggler.tsx      # 💻 CLIENT: テーマ切替 (ダーク/ライト)
│   │   │   │   └── menuData.tsx   # 📊 DATA: ナビゲーションデータ
│   │   │   ├── 📁 Hero/           # メインビジュアル・ヒーローセクション
│   │   │   │   └── index.tsx      # 🖥️ SERVER: ヒーローセクション (i18n対応)
│   │   │   ├── 📁 Features/       # 機能紹介セクション
│   │   │   │   ├── index.tsx      # 🖥️ SERVER: 機能一覧表示
│   │   │   │   ├── SingleFeature.tsx     # 🖥️ SERVER: 個別機能コンポーネント
│   │   │   │   └── featuresData.tsx      # 📊 DATA: 機能データ
│   │   │   ├── 📁 About/          # About・会社紹介セクション
│   │   │   │   ├── AboutSectionOne.tsx   # 🖥️ SERVER: About第1セクション
│   │   │   │   └── AboutSectionTwo.tsx   # 🖥️ SERVER: About第2セクション
│   │   │   ├── 📁 Blog/           # ブログ関連コンポーネント
│   │   │   │   ├── index.tsx      # �️ SERVER: ブログセクション
│   │   │   │   ├── SingleBlog.tsx # 🖥️ SERVER: 個別ブログカード
│   │   │   │   ├── RelatedPost.tsx        # 🖥️ SERVER: 関連記事表示
│   │   │   │   ├── SharePost.tsx  # 🖥️ SERVER: SNSシェアボタン
│   │   │   │   ├── TagButton.tsx  # 🖥️ SERVER: タグボタン
│   │   │   │   └── blogData.tsx   # 📊 DATA: ブログデータ
│   │   │   ├── �📁 Contact/        # お問い合わせ関連
│   │   │   │   ├── index.tsx      # 🖥️ SERVER: お問い合わせセクション
│   │   │   │   ├── NewsLatterBox.tsx      # 🖥️ SERVER: ニュースレター (サーバー)
│   │   │   │   └── NewsLatterBoxClient.tsx # 💻 CLIENT: ニュースレター (フォーム)
│   │   │   ├── 📁 Footer/         # フッター関連
│   │   │   │   └── index.tsx      # �️ SERVER: フッターコンポーネント (i18n対応)
│   │   │   ├── 📁 Pricing/        # 料金プラン関連
│   │   │   │   ├── index.tsx      # �️ SERVER: 料金プランセクション
│   │   │   │   ├── PricingClient.tsx      # 💻 CLIENT: 料金切替機能
│   │   │   │   ├── PricingBox.tsx # 🖥️ SERVER: 料金ボックス
│   │   │   │   └── OfferList.tsx  # 🖥️ SERVER: 特典リスト
│   │   │   ├── �📁 Testimonials/   # 顧客の声・証言セクション
│   │   │   │   ├── index.tsx      # 🖥️ SERVER: 証言セクション
│   │   │   │   ├── SingleTestimonial.tsx # �️ SERVER: 個別証言カード
│   │   │   │   └── testimonialData.tsx    # 📊 DATA: 証言データ
│   │   │   ├── �📁 Video/          # 動画セクション関連
│   │   │   │   ├── index.tsx      # �️ SERVER: 動画セクション
│   │   │   │   └── VideoPlayButton.tsx   # 💻 CLIENT: 動画再生ボタン
│   │   │   ├── �📁 Brands/         # ブランド・パートナー表示
│   │   │   │   ├── index.tsx      # 🖥️ SERVER: ブランド一覧
│   │   │   │   ├── SingleBrand.tsx       # 🖥️ SERVER: 個別ブランド
│   │   │   │   └── brandsData.tsx # 📊 DATA: ブランドデータ
│   │   │   ├── 📁 Common/         # 共通・再利用可能コンポーネント
│   │   │   │   ├── SectionTitle.tsx      # 🖥️ SERVER: セクションタイトル
│   │   │   │   ├── Breadcrumb.tsx # 🖥️ SERVER: パンくずリスト
│   │   │   │   └── ScrollUp.tsx   # 💻 CLIENT: スクロールアップ
│   │   │   ├── 📁 ScrollToTop/    # スクロールトップ機能
│   │   │   │   └── index.tsx      # 💻 CLIENT: スクロールトップボタン
│   │   │   └── video-modal.tsx    # 💻 CLIENT: 動画モーダル
│   │   ├── 📁 about/              # Aboutページ
│   │   │   └── page.tsx           # 🖥️ SERVER: Aboutページコンポーネント
│   │   ├── 📁 blog/               # ブログ一覧ページ
│   │   │   └── page.tsx           # 🖥️ SERVER: ブログ一覧ページ
## 🌐 **国際化（i18n）システム**

> **⚙️ 実装ガイド**: [開発指示書](.github/.copilot-instructions.md#-国際化i18n実装規則) の「国際化実装規則」を参照

### **サポート言語**
- **🇯🇵 日本語** (ja) - デフォルト言語
- **🇺🇸 英語** (en)  
- **🇹🇼 繁体中国語** (zh-TW)
- **🇨🇳 簡体中国語** (zh-CN)

### **翻訳システム概要**
```yaml
設定: next-intl 4.1.0
ルーティング: /[locale]/page → /ja/page, /en/page
翻訳ファイル: messages/*.json (4言語)
実装パターン:
  Server: getTranslations("PageName")
  Client: useTranslations('PageName')
```

## 🎨 **デザインシステム・UI/UX**

> **⚙️ 実装ガイド**: [開発指示書](.github/.copilot-instructions.md#-スタイリングui設計規則) の「スタイリング・UI設計規則」を参照

### **デザイン原則**
1. **🌙 ダークモード対応**: 全UIでライト/ダークテーマ
2. **📱 レスポンシブ**: モバイルファースト設計
3. **♿ アクセシブル**: WCAG 2.1 AA準拠
4. **⚡ パフォーマンス**: 最適化されたCSS・画像

### **テーマシステム**
```css
/* Tailwind設定例 */
colors: {
  primary: "#3182ce",
  white: "#ffffff", 
  dark: "#1a202c",
  body: "#637381"
}
```
    "title": "ハローワールド！",
    "paragraph": "当社のウェブサイトへようこそ。"
  },
  "HeroPage": {
    "heading": "スタートアップとSaaSのための...",
    "description": "..."
  }
}
```

#### 3. コンポーネントでの使用方法
```tsx
import { useTranslations } from 'next-intl';

const Component = () => {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
};
```

## 🎨 デザインシステム

### テーマシステム
- **ライトテーマ / ダークテーマ** 対応
- **next-themes** による動的テーマ切り替え
- **CSS変数** を使用したカラーシステム

### カラーパレット
```css
:root {
  --color-primary: #3182ce;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-dark: #1a202c;
  --color-body-color: #637381;
  --color-body-color-dark: #8492a6;
}
```

### レスポンシブデザイン
- **モバイルファースト** アプローチ
- **Tailwind CSS** のブレークポイント使用
- **フレキシブルレイアウト** でデバイス対応

## 📄 現在のページ構成

### 実装済みページ
1. **ホームページ** (`/`) - ヒーロー、機能、About、証言などを含むランディングページ
2. **Aboutページ** (`/about`) - 会社・サービス紹介
3. **ブログ一覧** (`/blog`) - ブログ記事一覧表示
4. **ブログ詳細** (`/blog-details`) - 個別記事表示
5. **ブログサイドバー** (`/blog-sidebar`) - サイドバー付きブログ表示
6. **お問い合わせ** (`/contact`) - 問い合わせフォーム
7. **サインイン** (`/signin`) - ログインページ
8. **サインアップ** (`/signup`) - 新規登録ページ
9. **エラーページ** (`/error`) - エラー表示

### コンポーネント構成図
```
## 📄 **現在のページ・機能構成**

### **実装済みページ**
| ページ | URL | 主要機能 | コンポーネント例 |
|--------|-----|----------|------------------|
| ホーム | `/` | ランディングページ | Hero, Features, Testimonials, Pricing |
| About | `/about` | 会社紹介 | AboutSectionOne, AboutSectionTwo |
| ブログ | `/blog` | 記事一覧 | BlogSection, SingleBlog |
| ブログ詳細 | `/blog-details` | 記事表示 | RelatedPost, SharePost, TagButton |
| お問い合わせ | `/contact` | フォーム | ContactSection, NewsLatterBox |
| 認証 | `/signin`, `/signup` | ログイン・登録 | 将来実装予定 |

### **主要コンポーネント構成**
```
Header → Hero → Features → About → Video → Brands 
  ↓
Testimonials → Pricing → Blog → Contact → Footer
```

## 🎯 **開発ロードマップ・計画チェックリスト**

### **📊 プロジェクト進捗状況・機能完成度**

#### 🔥 **完成済み機能（✅）**

**🌐 多言語対応 **
- [x] next-intl多言語化システム
- [x] LanguageSwitcher（4言語対応）
- [x] 日本語（ja）- デフォルト言語
- [x] 英語（en）完全対応
- [x] 繁体中国語（zh-TW）完全対応
- [x] 簡体中国語（zh-CN）完全対応
- [x] 翻訳用ツール実装（Azure translate api）

**� Client Component最適化 **
- [x] Header + ナビゲーション
- [x] ThemeToggler（ダーク/ライトモード）
- [x] PricingClient（月額/年額切替）
- [x] NewsLatterBoxClient（フォーム処理）
- [x] ScrollToTop + VideoModal

** ブランドカラー・ロゴカスタマイズ **
- [x] オレンジ系統に変更
- [x] 色のハードコーディングから.css参照への変更

** 画像生成 **
- [x] favicon作成(https://github.com/NatsukiNateYamashita/favicon_generator)
- [x] logo作成(https://github.com/NatsukiNateYamashita/logo_generator)

#### 🚧 **進行中・改善必要（⚠️）**

**🔍 SEO対応（80%）**
- [x] 基本メタデータ設定
- [x] 構造化マークアップ（一部）
- [ ] JSON-LD構造化データ拡充
- [ ] サイトマップ自動生成
- [ ] robots.txt最適化

**♿ アクセシビリティ（65%）**
- [x] 基本キーボードナビゲーション
- [x] 色コントラスト対応（ダークモード）
- [ ] WCAG 2.1 AA完全準拠
- [ ] スクリーンリーダー最適化
- [ ] focus表示改善

**⚡ パフォーマンス（85%）**
- [x] Server Component最適化
- [x] 基本的な画像最適化
- [ ] 画像遅延読み込み拡充
- [ ] バンドルサイズ最適化
- [ ] Core Web Vitals改善

**📱 モバイル対応（85%）**
- [x] レスポンシブデザイン
- [x] タッチ操作基本対応
- [ ] モバイル専用UX改善
- [ ] PWA対応検討

#### ⏳ **未実装・予定機能**

**🔐 セキュリティ・認証（50%）**
- [ ] NextAuth.js認証システム
- [ ] ユーザー管理機能
- [ ] JWT + セッション管理
- [ ] パスワードリセット機能
- [ ] 2FA（二段階認証）

**💾 データベース統合（0%）**
- [ ] Supabase + Prisma ORM導入
- [ ] ユーザーデータ管理
- [ ] ブログCMS機能
- [ ] フォーム送信データ保存

**📝 コンテンツ管理（20%）**
- [x] 静的コンテンツ表示
- [ ] ダミーテキスト → 実際のコンテンツ
- [ ] ブログエディター（リッチテキスト）
- [ ] 画像・動画アップロード機能
- [ ] カテゴリ・タグ管理

**💰 課金・決済（0%）**
- [ ] Stripe課金システム
- [ ] サブスクリプション管理
- [ ] 料金プラン動的管理
- [ ] 請求書・領収書生成

**📊 管理画面・ダッシュボード（0%）**
- [ ] 管理者ダッシュボード
- [ ] アナリティクス統合
- [ ] ユーザー管理画面
- [ ] コンテンツ管理インターフェース

### **🚀 開発フェーズ・優先度別タスク**

#### **🔥 Phase 1: コンテンツ最適化（1-2週間）**
- [ ] ダミーテキスト → 実際のコンテンツ置換
- [ ] 画像・動画素材差し替え
- [ ] フォーム送信機能実装（基本）
- [ ] 404ページ・プライバシーポリシー追加
- [ ] エラーメッセージ多言語対応完了

#### **📋 Phase 2: データベース統合（1-2ヶ月）**
- [ ] Supabase環境構築
- [ ] Prisma ORM設定・スキーマ設計
- [ ] ブログCMS機能（CRUD操作）
- [ ] お問い合わせフォーム → DB保存
- [ ] 管理画面プロトタイプ
- [ ] ニュースレター購読機能

#### **📋 Phase 3: WebApp化（3-6ヶ月）**
- [ ] NextAuth.js認証システム実装
- [ ] ユーザー登録・ログイン機能
- [ ] Stripe課金システム統合
- [ ] ダッシュボード機能開発
- [ ] 通知システム（メール・アプリ内）
- [ ] API設計・実装

#### **🔧 Phase 4: 最適化・運用準備（継続）**
- [ ] CI/CD パイプライン構築
- [ ] テスト自動化（Jest + Playwright）
- [ ] パフォーマンス監視
- [ ] ログ・エラー監視システム
- [ ] バックアップ・災害復旧対策

### **📈 次回リリース予定**

#### **v1.1.0（2週間後）**
- コンテンツカスタマイズ完了
- フォーム送信機能実装
- パフォーマンス改善
- 翻訳精度向上

#### **v1.2.0（1ヶ月後）**
- ブログシステム強化
- データベース統合開始
- 管理画面プロトタイプ
- SEO構造化データ拡充

#### **v2.0.0（3ヶ月後）**
- 認証システム実装
- WebApp機能追加
- 課金システム統合
- PWA対応完了

### **🔧 開発環境・ツール不足項目**

#### **追加すべきnpmスクリプト**
```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch", 
    "test:e2e": "playwright test",
    "build:analyze": "ANALYZE=true npm run build",
    "clean": "rm -rf .next out",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  }
}
```

#### **追加すべき開発ツール**
- [ ] jest + @testing-library/react（単体テスト）
- [ ] playwright（E2Eテスト）
- [ ] @next/bundle-analyzer（バンドルサイズ分析）
- [ ] eslint-plugin-jsx-a11y（アクセシビリティ）
- [ ] prettier-plugin-organize-imports（インポート整理）

#### **不足ファイル（作成推奨）**
```
設定ファイル:
├── .env.example                 # 環境変数テンプレート
├── jest.config.js              # テスト設定
└── .github/workflows/ci.yml    # CI/CD

型定義:
├── src/types/user.ts           # ユーザー関連型
├── src/types/api.ts            # API型定義
└── src/types/form.ts           # フォーム型

ページ:
├── src/app/[locale]/pricing/page.tsx    # 料金ページ
├── src/app/[locale]/privacy/page.tsx    # プライバシーポリシー
└── src/app/[locale]/404.tsx             # カスタム404
```

### **📊 進捗メトリクス**

| 分野 | 進捗率 | 状況 | 次のアクション |
|------|--------|------|----------------|
| **基本機能** | 95% | ✅ ほぼ完成 | 細部調整・コンテンツ改善 |
| **国際化** | 98% | ✅ Footer対応完了 | エラーメッセージ追加 |
| **UI/UX** | 85% | 🚧 調整中 | ユーザビリティ向上 |
| **SEO対応** | 80% | 🚧 改善中 | 構造化データ追加 |
| **モバイル対応** | 85% | 🚧 最適化中 | タッチ操作改善 |
| **アクセシビリティ** | 65% | 🔄 要改善 | WCAG準拠強化 |
| **パフォーマンス** | 85% | 🚧 Server Component最適化完了 | 画像遅延読み込み |
| **セキュリティ** | 50% | ⏳ 今後実装 | 認証システム準備 |

---

> **💡 重要**: このチェックリストは開発の全体像と進捗を把握するためのマスタープランです。  
> **各タスクの詳細実装手順**は [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照してください。  
> **新機能追加時**は、必ず多言語対応・レスポンシブ・アクセシビリティを考慮してください。

## 🔧 ファイル別詳細分析と不足項目

### 🎉 最新の最適化完了事項 (2025年6月28日)

#### Footer Server Component化
**実装内容:**
- `"use client"` directive 削除
- `getTranslations` を使用したサーバー側翻訳処理
- 4言語完全対応（ja/en/zh-TW/zh-CN）
- layout.tsx での直接呼び出しによるClient境界回避

**技術的メリット:**
- ✅ **SEO強化**: 検索エンジンがFooterリンクを即座に認識
- ✅ **パフォーマンス向上**: LCP（Largest Contentful Paint）最適化
- ✅ **バンドルサイズ削減**: クライアント側JSの軽量化
- ✅ **多言語最適化**: サーバー側で言語判定・翻訳処理

**アーキテクチャ変更:**
```typescript
// Before: Client境界内での実行
ClientLayout (Client Component)
  └── Footer (Server Componentにしたかったが制約あり)

// After: 最適な分離
RootLayout (Server)
  ├── ClientLayout (Client Component)
  │   └── Header, ScrollToTop (Client Components)
  └── Footer (Server Component - 直接呼び出し)
```

### 📁 `.github/` - GitHub設定・開発支援
| ファイル | 役割 | 不足項目 |
|----------|------|----------|
| `.copilot-instructions.md` | GitHub Copilot開発指示 + 開発プロンプト統合 | ✅ 完備 |
| **不足ファイル** | **CI/CD設定** | ❌ ワークフロー未実装 |

**追加すべきファイル:**
- `.github/workflows/ci.yml` - CI/CD パイプライン
- `.github/workflows/deploy.yml` - デプロイ自動化
- `.github/ISSUE_TEMPLATE/` - Issue テンプレート
- `.github/PULL_REQUEST_TEMPLATE.md` - PR テンプレート

### 📁 `src/app/[locale]/` - メインアプリケーション

#### ページコンポーネント (page.tsx)
| ページ | 状況 | 不足項目 |
|--------|------|----------|
| `page.tsx` (ホーム) | ✅ 完成 | - |
| `about/page.tsx` | ✅ 完成 | - |
| `blog/page.tsx` | ✅ 完成 | ページネーション |
| `blog-details/page.tsx` | ✅ 完成 | 動的ルーティング |
| `blog-sidebar/page.tsx` | ✅ 完成 | - |
| `contact/page.tsx` | ✅ 完成 | フォーム送信機能 |
| `signin/page.tsx` | ✅ 完成 | 認証ロジック |
| `signup/page.tsx` | ✅ 完成 | 認証ロジック |
| `error/page.tsx` | ✅ 完成 | エラー種別対応 |

**追加すべきページ:**
- `pricing/page.tsx` - 料金プランページ
- `privacy/page.tsx` - プライバシーポリシー
- `terms/page.tsx` - 利用規約
- `faq/page.tsx` - よくある質問
- `404.tsx` - カスタム404ページ

#### コンポーネント分析

##### 🖥️ Server Components (推奨継続)
| コンポーネント | 理由 | 改善点 |
|---------------|------|--------|
| Hero, Features, About | SEO重要、静的コンテンツ | - |
| Blog関連 | SSG対応、検索エンジン最適化 | ISR実装 |
| Testimonials | 構造化データ対応 | JSON-LD追加 |

##### 💻 Client Components (必要最小限)
| コンポーネント | 理由 | 改善可能性 |
|---------------|------|------------|
| Header | スクロール検出、サブメニュー | - |
| LanguageSwitcher | 動的言語変更 | - |
| ThemeToggler | テーマ状態管理 | - |
| PricingClient | 月額/年額切替 | - |
| NewsLatterBoxClient | フォーム処理 | - |
| **Footer** | **✅ Server Component に変更完了** | **最適化済み** |

### 📁 `messages/` - 多言語翻訳
| ファイル | 状況 | 不足項目 |
|----------|------|----------|
| `ja.json` | ✅ 基本完成 + Footer対応 | エラーメッセージ |
| `en.json` | ✅ 基本完成 + Footer対応 | エラーメッセージ |
| `zh-TW.json` | ✅ 基本完成 + Footer対応 | エラーメッセージ |
| `zh-CN.json` | ✅ 基本完成 + Footer対応 | エラーメッセージ |

**追加すべき翻訳カテゴリ:**
- `ErrorPage` - エラーメッセージ
- `FormValidation` - バリデーションメッセージ
- `Metadata` - SEOメタデータ
- `API` - API レスポンスメッセージ

### 📁 `src/types/` - 型定義
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
- [ ] **型安全性**: anyタイプの具体化
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

---

> **💡 重要**: このドキュメントは**プロジェクト全体の理解**を目的としています。  
> **実装詳細**は [GitHub Copilot開発指示書](.github/.copilot-instructions.md) を参照してください。  
> **疑問がある場合**は、既存のコードパターンを参考にしながら開発を進めてください。
