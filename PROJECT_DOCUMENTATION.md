# 🚀 Startup Next.js プロジェクト - 包括的開発ドキュメント

## 📋 プロジェクト概要

このプロジェクトは、スタートアップ・SaaS企業向けのNext.jsテンプレートを基に構築された多言語対応Webアプリケーションです。next-intl を使用した国際化機能と、将来のWebApp化を見据えた拡張可能な設計となっています。

## 🛠 技術スタック

### コア技術
- **フレームワーク**: Next.js 15.3.0 (App Router)
- **UI フレームワーク**: Tailwind CSS 4.1.3
- **言語**: TypeScript 5.3.3
- **国際化**: next-intl 4.1.0
- **テーマ**: next-themes 0.2.1

### 開発環境
- **Node.js**: 20.x
- **パッケージマネージャー**: npm
- **コードフォーマッター**: Prettier 3.2.5
- **リンター**: ESLint 9.24.0

## 🏗 プロジェクト構造とファイル役割

### 📁 ディレクトリ構造詳細
```
startup-nextjs/
├── 📁 .github/                    # GitHub設定・CI/CD・開発支援
│   ├── .copilot-instructions.md  # GitHub Copilot開発指示書
│   └── 📁 prompts/
│       └── .prompt.md             # 開発アシスタント用プロンプト
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
│   │   │   │   └── index.tsx      # 💻 CLIENT: フッターコンポーネント
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
│   │   ├── 📁 blog-details/       # ブログ詳細ページ
│   │   │   └── page.tsx           # 🖥️ SERVER: ブログ詳細ページ
│   │   ├── 📁 blog-sidebar/       # ブログサイドバーページ
│   │   │   └── page.tsx           # 🖥️ SERVER: サイドバー付きブログページ
│   │   ├── 📁 contact/            # お問い合わせページ
│   │   │   └── page.tsx           # 🖥️ SERVER: お問い合わせページ
│   │   ├── 📁 error/              # エラーページ
│   │   │   └── page.tsx           # 🖥️ SERVER: エラー表示ページ
│   │   ├── 📁 signin/             # サインインページ
│   │   │   └── page.tsx           # 🖥️ SERVER: ログインページ
│   │   ├── 📁 signup/             # サインアップページ
│   │   │   └── page.tsx           # 🖥️ SERVER: 新規登録ページ
│   │   ├── 📁 styles/             # スタイルファイル
│   │   │   └── index.css          # グローバルCSS・Tailwindインポート
│   │   └── 📁 types/              # TypeScript型定義
│   │       ├── blog.ts            # ブログ関連型
│   │       ├── brand.ts           # ブランド関連型
│   │       ├── menu.ts            # メニュー関連型
│   │       └── testimonial.ts     # 証言関連型
│   ├── 📁 i18n/                   # 国際化設定ファイル群
│   │   ├── routing.ts             # ルーティング設定 (ロケール定義)
│   │   ├── request.ts             # リクエスト設定 (サーバー側i18n)
│   │   └── navigation.ts          # ナビゲーション設定 (クライアント側i18n)
│   └── middleware.ts              # Next.jsミドルウェア (ロケール検出・リダイレクト)
├── 📁 messages/                   # 多言語翻訳ファイル
│   ├── ja.json                    # 日本語翻訳
│   ├── en.json                    # 英語翻訳
│   ├── zh-TW.json                 # 繁体中国語翻訳
│   └── zh-CN.json                 # 簡体中国語翻訳
├── 📁 public/                     # 静的ファイル・アセット
│   ├── favicon.ico                # ファビコン
│   └── 📁 images/                 # 画像ファイル群
│       ├── logo/                  # ロゴ画像
│       ├── hero/                  # ヒーロー画像
│       ├── about/                 # About画像
│       ├── blog/                  # ブログ画像
│       ├── brands/                # ブランド画像
│       ├── testimonials/          # 証言画像
│       └── video/                 # 動画関連画像
├── 📁 utils/                      # ユーティリティ・ヘルパー
│   └── translate_json.py          # 翻訳支援スクリプト (Python)
├── 📁 startup-nodejs/             # Python仮想環境 (翻訳スクリプト用)
├── package.json                   # 依存関係・スクリプト定義
├── next.config.ts                 # Next.js設定 (i18n、画像最適化)
├── next-intl.config.js            # next-intl設定
├── tailwind.config.js             # Tailwind CSS設定
├── tsconfig.json                  # TypeScript設定
├── jsconfig.json                  # JavaScript設定
├── postcss.config.js              # PostCSS設定
├── PROJECT_DOCUMENTATION.md       # 📝 プロジェクト包括ドキュメント
└── README.md                      # プロジェクト基本説明
```

### 🖥️💻 Server Component vs Client Component 分類

#### 🖥️ Server Components (現在の実装)
**理由**: SEO最適化、初期レンダリング高速化、翻訳データのサーバー側取得

- **ページコンポーネント**: すべてのpage.tsx
- **セクションコンポーネント**: Hero, Features, About, Blog, Testimonials, Video, Brands, Contact
- **データ表示コンポーネント**: SingleBlog, SingleFeature, SingleTestimonial等
- **静的コンポーネント**: SectionTitle, Breadcrumb等

#### 💻 Client Components (必要最小限)
**理由**: ユーザーインタラクション、状態管理、ブラウザAPI使用

- **インタラクティブUI**: Header (スクロール検出)、LanguageSwitcher、ThemeToggler
- **フォーム処理**: NewsLatterBoxClient (バリデーション、送信処理)
- **状態管理**: PricingClient (月額/年額切替)、VideoPlayButton (モーダル制御)
- **レイアウト管理**: ClientLayout (プロバイダー統合)、ScrollToTop
- **モーダル・オーバーレイ**: video-modal

#### ⚠️ 改善推奨事項
以下のコンポーネントは不必要にクライアント化されている可能性:
- **Footer**: 静的コンテンツのため Server Component 推奨
- **一部のデータ表示**: より多くを Server Component に移行可能

## 🌐 国際化（i18n）システム

### サポート言語
- **日本語** (ja) - デフォルト言語
- **英語** (en)
- **繁体中国語** (zh-TW)
- **簡体中国語** (zh-CN)

### 国際化の実装方法

#### 1. ルーティング設定
```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['ja', 'en', 'zh-TW', 'zh-CN'],
  defaultLocale: 'ja'
});
```

#### 2. 翻訳ファイルの構造
```json
// messages/ja.json の例
{
  "HomePage": {
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
Header (ナビゲーション + 言語切替 + テーマ切替)
├── Hero (メインビジュアル)
├── Features (機能紹介)
├── About (会社紹介)
├── Video (紹介動画)
├── Brands (パートナー企業)
├── Testimonials (顧客の声)
├── Pricing (料金プラン)
├── Blog (ブログセクション)
├── Contact (お問い合わせ)
└── Footer (フッター情報)
```

## 🚀 開発予定と拡張計画

### Phase 1: コンテンツカスタマイズ
- [ ] 各ページのテンプレートから独自コンテンツへの修正
- [ ] ブランドカラー・ロゴの変更
- [ ] 画像・動画コンテンツの差し替え

### Phase 2: ページ機能拡張
- [ ] 新規ページの追加・削除
- [ ] カスタムページレイアウトの作成
- [ ] SEOメタタグの最適化

### Phase 3: ブログシステム強化
- [ ] ブログエディター機能の実装
- [ ] カテゴリ・タグ機能の追加
- [ ] 検索機能の実装

### Phase 4: データベース統合
- [ ] **データベース選択**: 
  - Supabase (推奨) - PostgreSQL + リアルタイム機能
  - PlanetScale - MySQL互換
  - MongoDB Atlas - NoSQL
- [ ] **ORM/クエリビルダー**:
  - Prisma (推奨) - 型安全なORM
  - Drizzle ORM - 軽量・高性能
- [ ] ブログ記事のDB格納
- [ ] 管理画面の実装

### Phase 5: WebApp機能開発
- [ ] **認証システム**:
  - NextAuth.js (推奨)
  - Supabase Auth
  - Clerk
- [ ] ダッシュボード機能
- [ ] ユーザープロファイル管理

### Phase 6: ユーザー登録システム
- [ ] **認証フロー**:
  - メール認証
  - ソーシャルログイン (Google, GitHub等)
  - パスワードリセット
- [ ] **権限管理**:
  - ロールベースアクセス制御
  - 管理者/一般ユーザー区分

### Phase 7: 課金システム
- [ ] **決済プラットフォーム**:
  - Stripe (推奨) - 豊富な機能
  - PayPal - 国際対応
- [ ] **サブスクリプション管理**:
  - プラン変更
  - 請求履歴
  - 自動更新

### Phase 8: マーケティングシステム
- [ ] **分析ツール**:
  - Google Analytics 4
  - Vercel Analytics
- [ ] **メール配信**:
  - SendGrid
  - Resend
- [ ] **A/Bテスト機能**
- [ ] **SEO最適化**

## 📋 タスクと進捗管理

### 🎯 現在の開発状況

#### ✅ 完了済み
- [x] **基本プロジェクト構築** - Next.js 15 + TypeScript + Tailwind CSS
- [x] **国際化実装** - next-intl による4言語対応 (ja/en/zh-TW/zh-CN)
- [x] **テーマシステム** - ダークモード対応
- [x] **コンポーネント設計** - 再利用可能なコンポーネント構築
- [x] **ページ実装** - 9つの主要ページ完成
- [x] **レスポンシブデザイン** - モバイルファースト対応
- [x] **言語切替機能** - ヘッダーでの動的言語変更
- [x] **SEO最適化** - メタデータ・構造化データ対応

#### 🚧 進行中
- [ ] **ドキュメント整備** - 開発ガイドライン・API仕様書
- [ ] **エラーハンドリング** - 統一的なエラー処理実装
- [ ] **パフォーマンス最適化** - Core Web Vitals改善

#### 📅 短期計画 (1-2週間)
- [ ] **コンテンツカスタマイズ**
  - [ ] ダミーテキストを実際のコンテンツに変更
  - [ ] ブランドロゴ・カラーの適用
  - [ ] 画像・動画の差し替え
- [ ] **フォーム機能実装**
  - [ ] お問い合わせフォームの送信機能
  - [ ] ニュースレター登録機能
  - [ ] バリデーション強化
- [ ] **ページ機能拡張**
  - [ ] 404ページの実装
  - [ ] プライバシーポリシー・利用規約ページ
  - [ ] FAQページの追加

#### 📅 中期計画 (1-2ヶ月)
- [ ] **ブログシステム強化**
  - [ ] ブログエディター機能
  - [ ] カテゴリ・タグ機能
  - [ ] 検索・フィルター機能
  - [ ] コメント機能
- [ ] **データベース統合**
  - [ ] Supabase セットアップ
  - [ ] Prisma ORM 導入
  - [ ] ブログ記事のDB格納
  - [ ] 管理画面の実装

#### 📅 長期計画 (3-6ヶ月)
- [ ] **認証システム**
  - [ ] NextAuth.js 実装
  - [ ] ソーシャルログイン
  - [ ] ロールベース認証
- [ ] **課金システム**
  - [ ] Stripe 統合
  - [ ] サブスクリプション管理
  - [ ] 請求・決済機能
- [ ] **WebApp機能**
  - [ ] ユーザーダッシュボード
  - [ ] プロファイル管理
  - [ ] 通知システム

### 🐛 既知の課題

#### 🔴 高優先度
- [ ] **型安全性**: 一部のanyタイプを具体的な型に変更
- [ ] **アクセシビリティ**: WCAG 2.1 AA準拠の改善点
- [ ] **SEO**: 構造化データの拡充

#### 🟡 中優先度
- [ ] **パフォーマンス**: 画像の遅延読み込み最適化
- [ ] **モバイル体験**: タッチ操作の改善
- [ ] **多言語**: 翻訳の精度向上

#### 🟢 低優先度
- [ ] **コードリファクタリング**: 重複コードの削減
- [ ] **テスト**: 単体テスト・E2Eテストの追加
- [ ] **ドキュメント**: コメントの追加・更新

### 📊 進捗メトリクス

| 分野 | 進捗率 | 状況 |
|------|--------|------|
| **基本機能** | 90% | ✅ ほぼ完成 |
| **UI/UX** | 80% | 🚧 調整中 |
| **国際化** | 95% | ✅ ほぼ完成 |
| **SEO対応** | 70% | 🚧 改善中 |
| **モバイル対応** | 85% | 🚧 最適化中 |
| **アクセシビリティ** | 60% | 🔄 要改善 |
| **パフォーマンス** | 75% | 🚧 最適化中 |
| **セキュリティ** | 50% | ⏳ 今後実装 |

### 📈 次回リリース予定

#### v1.1.0 (2週間後)
- コンテンツカスタマイズ完了
- フォーム送信機能実装
- パフォーマンス改善

#### v1.2.0 (1ヶ月後)
- ブログシステム強化
- データベース統合開始
- 管理画面プロトタイプ

#### v2.0.0 (3ヶ月後)
- 認証システム実装
- WebApp機能追加
- 課金システム統合

## 🔧 ファイル別詳細分析と不足項目

### 📁 `.github/` - GitHub設定・開発支援
| ファイル | 役割 | 不足項目 |
|----------|------|----------|
| `.copilot-instructions.md` | GitHub Copilot開発指示 | ✅ 完備 |
| `prompts/.prompt.md` | 開発プロンプト集 | ✅ 完備 |
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
| **Footer** | **⚠️ 不要な Client 化** | **Server に変更推奨** |

### 📁 `messages/` - 多言語翻訳
| ファイル | 状況 | 不足項目 |
|----------|------|----------|
| `ja.json` | ✅ 基本完成 | エラーメッセージ |
| `en.json` | ✅ 基本完成 | エラーメッセージ |
| `zh-TW.json` | ✅ 基本完成 | エラーメッセージ |
| `zh-CN.json` | ✅ 基本完成 | エラーメッセージ |

**追加すべき翻訳カテゴリ:**
- `ErrorPage` - エラーメッセージ
- `FormValidation` - バリデーションメッセージ
- `Metadata` - SEOメタデータ
- `API` - API レスポンスメッセージ

### 📁 `src/types/` - 型定義
| ファイル | 役割 | 不足項目 |
|----------|------|----------|
| `blog.ts` | ブログ型定義 | DB対応型 |
| `brand.ts` | ブランド型定義 | - |
| `menu.ts` | メニュー型定義 | - |
| `testimonial.ts` | 証言型定義 | - |

**追加すべき型定義:**
- `user.ts` - ユーザー関連型
- `auth.ts` - 認証関連型
- `api.ts` - API レスポンス型
- `form.ts` - フォーム関連型
- `payment.ts` - 決済関連型

### 🗂️ 設定ファイル分析
| ファイル | 状況 | 改善点 |
|----------|------|--------|
| `package.json` | ✅ 適切 | 開発スクリプト追加 |
| `next.config.ts` | ✅ i18n対応 | 環境変数対応 |
| `tailwind.config.js` | ✅ カスタマイズ済み | アニメーション追加 |
| `tsconfig.json` | ✅ 厳格設定 | パス短縮設定 |

**追加すべき設定:**
- `.env.example` - 環境変数テンプレート
- `jest.config.js` - テスト設定
- `playwright.config.ts` - E2Eテスト設定
- `.gitignore` - より詳細な除外設定
