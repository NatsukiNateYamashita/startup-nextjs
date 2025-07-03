# 🌟 **Major Updates After Clone - Phase 1 & 2 Complete!**

## 🚀 **Phase 1: 多言語ブログシステム基盤構築（完了）**
- **🌍 International i18n Support**: next-intl による4言語対応（ja/en/zh-CN/zh-TW）
- **📝 Markdown-based Blog System**: gray-matter + remark/rehype による動的ブログ
- **🎯 Dynamic Routing**: /blog/[slug] SEO最適化システム
- **🎨 Enhanced UI/UX**: Typography plugin + カスタムボックス + SVG背景
- **⚡ Performance**: ビルド時間2秒、First Load JS 111kB

## 🔍 **Phase 2: 高度な検索・フィルタ・ソート機能（完了）**
- **🔎 Advanced Search**: Fuse.js によるあいまい検索（50ms以下の応答）
- **🏷️ Tag Filter**: 複数タグ選択・動的フィルタリング
- **📊 Sort Options**: 関連度・日付・タイトル順ソート
- **✨ Highlight**: 検索語句のリアルタイムハイライト
- **⌨️ Keyboard Shortcuts**: Ctrl+K で検索フォーカス
- **📱 Mobile-First**: 完全レスポンシブ対応

## 📊 **技術実装詳細**
- **検索エンジン**: Fuse.js（threshold: 0.4）
- **検索対象**: タイトル（重み0.6）、抜粋（重み0.3）、タグ（重み0.1）
- **状態管理**: カスタムフック（useSearchBlogs）
- **デバウンス**: 300ms リアルタイム検索
- **アクセシビリティ**: ARIA対応・スクリーンリーダー対応

## 📚 **新規実装コンポーネント**
- BlogSearch.tsx, BlogFilter.tsx, BlogSort.tsx
- SearchResults.tsx, BlogList.tsx（統合版）
- useSearchBlogs.ts（カスタムフック）
- search.ts（検索ユーティリティ）

---
# Startup - Free Next.js Startup Website Template

Startup free, open-source, and premium-quality startup website template for Next.js comes with everything you need to launch a startup, business, or SaaS website, including all essential sections, components, and pages.

If you're looking for a high-quality and visually appealing, feature-rich Next.js Template for your next startup, SaaS, or business website, this is the perfect choice and starting point for you!

### ✨ Key Features
- Crafted for Startup and SaaS Business
- Next.js and Tailwind CSS
- All Essential Business Sections and Pages
- High-quality and Clean Design
- Dark and Light Version
- TypeScript Support
and Much More ...

### 🙌 Detailed comparison between the Free and Pro versions of Startup

| Feature             | Free | Pro |
|---------------------|------------|----------|
| Next.js Landing Page             | ✅ Yes      | ✅ Yes      |
| All The Integrations - Auth, DB, Payments, Blog and many more ...             | ❌ No      | ✅ Yes |
| Homepage Variations             | 1      | 2 |
| Additional SaaS Pages and Components             | ❌ No      | ✅ Yes |
| Functional Blog with Sanity       | ❌ No      | ✅ Yes | ✅ Yes |
| Use with Commercial Projects            | ✅ Yes      | ✅ Yes      |
| Lifetime Free Updates             | ✅ Yes      | ✅ Yes |
| Email Support       | ❌ No         | ✅ Yes       |
| Community Support         | ✅ Yes         | ✅ Yes       |


### [🔥 Get Startup Pro](https://nextjstemplates.com/templates/saas-starter-startup)

[![Startup Pro](https://raw.githubusercontent.com/NextJSTemplates/startup-nextjs/main/startup-pro.webp)](https://nextjstemplates.com/templates/saas-starter-startup)

Startup Pro - Expertly crafted for fully-functional, high-performing SaaS startup websites. Comes with with Authentication, Database, Blog, and all the essential integrations necessary for SaaS business sites.


### [🚀 View Free Demo](https://startup.nextjstemplates.com/)

### [🚀 View Pro Demo](https://startup-pro.nextjstemplates.com/)

### [📦 Download](https://nextjstemplates.com/templates/startup)

### [🔥 Get Pro](https://nextjstemplates.com/templates/saas-starter-startup)

### [🔌 Documentation](https://nextjstemplates.com/docs)

### ⚡ Deploy Now

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNextJSTemplates%2Fstartup-nextjs)

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/NextJSTemplates/startup-nextjs)


### 📄 License
Startup is 100% free and open-source, feel free to use with your personal and commercial projects.

### 💜 Support
If you like the template, please star this repository to inspire the team to create more stuff like this and reach more users like you!

### ✨ Explore and Download - Free [Next.js Templates](https://nextjstemplates.com)

### Update Log

**3 July 2025 - 🎉 Phase 2: 検索・フィルタ・ソート機能実装完了**
- Implemented advanced search with Fuse.js (fuzzy search, 50ms response)
- Added multi-tag filtering with dynamic display
- Implemented sorting (relevance, date, title)
- Real-time search highlighting and results
- Keyboard shortcuts (Ctrl+K for search focus)
- Complete mobile-responsive design
- Added 14 new i18n translation keys for 4 languages

**3 July 2025 - 🚀 Phase 1: マークダウンブログシステム基盤構築完了**
- Implemented markdown-based blog system with gray-matter + remark/rehype
- Created dynamic routing /blog/[slug] with SEO optimization
- Migrated 3 articles × 4 languages = 12 markdown files
- Enhanced UI with Typography plugin and custom components
- Achieved 2-second build time and 111kB First Load JS
- Complete internationalization (ja/en/zh-CN/zh-TW)

**10 April 2025**
- Fix peer deps issue with Next.js 15
- Upgrade to tailwind v4
- Refactored blog cards for handling edge cases(text ellipsis on bio, keeping author details at the bottom etc.)
- Re-wrote blog details page with icons separation, fallback author image and better markup.
- Fixed duplicate key errors on homepage.
- Separated icons on theme-switcher button, and refactored scroll-to-top button.

**29 Jan 2025**
- Upgraded to Next.js 15
