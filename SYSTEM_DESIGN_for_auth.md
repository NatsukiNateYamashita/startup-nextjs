# 🚀 認証・課金システム設計書

> **📖 目的**: 日本語教育支援プラットフォームの認証・課金機能設計仕様  
> **🎯 対象**: 開発チーム全体（フロントエンド・バックエンド・デザイナー）  
> **🔄 最終更新**: 2025年7月11日  
> **📋 関連資料**: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

## 📋 **1. プロジェクト要件定義**

### 1.1 プロジェクト概要
```yaml
プロジェクト名: "日本語教育支援プラットフォーム"
コアミッション: "AI活用による日本語教育の効率化と国際展開"

開発フェーズ:
  Phase 1: 認証機能 + 基本課金システム (3週間)
  Phase 2: Python AI連携 + 高度機能 (4-5週間)
  Phase 3: 分析・企業向け機能 (継続開発)

対象ユーザー:
  プライマリ: 日本語教育者
  セカンダリ: 日本語学習者
  年齢層: 20-60代
  技術リテラシー: 中程度
  グローバル展開: 4言語対応（日本語、英語、中国語繁体字・簡体字）
```

### 1.2 課金モデル
```yaml
料金体系:
  フリーミアム: 無料プラン + 有料プラン
  課金方法: 月額サブスクリプション + 年額プラン + 単発購入
  価格帯: 月額1,000円〜10,000円

プラン構成:
  Free Plan:
    - 基本翻訳機能（月10回まで）
    - ブログ閲覧
    - 基本的な教材テンプレート
  
  Basic Plan (月額2,980円 / 年額29,800円):
    - ブログ対訳機能無制限
    - AI教案作成（月30回）
    - 音声認識練習（月20回）
    - 基本画像処理（月10回）
  
  Premium Plan (月額7,980円 / 年額79,800円):
    - 全機能無制限
    - 高度AI機能
    - 優先サポート
    - カスタム教材作成
  
  Enterprise (要相談):
    - カスタム機能開発
    - 専用サポート
    - オンプレミス対応
```

---

## 🔐 **2. 認証システム設計**

### 2.1 認証方式
```yaml
基本認証:
  - メール + パスワード
  - メール認証必須
  - パスワードリセット機能

ソーシャルログイン（必須）:
  - Google OAuth 2.0
  - LINE Login
  - Instagram Basic Display

セキュリティ:
  - HTTPS必須
  - CSRF保護
  - セッション管理（JWT）
  - レート制限
  - 2FA: Phase 3で検討（現状不要）
```

### 2.2 ユーザーデータモデル
```typescript
interface User {
  // 基本情報
  id: string;
  email: string;
  password?: string; // ソーシャルログインのみの場合null
  name: string;
  age?: number;
  organization?: string;
  
  // 教育・言語情報
  is_educator: boolean;
  nationality: string;          // 国籍
  residence_country: string;    // 居住地
  native_language: string;      // 母語
  language_skills: LanguageSkill[]; // 言語別レベル
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // システム管理
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
  last_login?: Date;
  
  // 課金関連
  stripe_customer_id?: string;
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  subscription_period_start?: Date;
  subscription_period_end?: Date;
  billing_cycle?: 'monthly' | 'yearly';
}

// 言語スキル（5段階評価）
interface LanguageSkill {
  id: string;
  user_id: string;
  language_code: string; // ISO 639-1 (ja, en, zh, etc.)
  proficiency_level: 1 | 2 | 3 | 4 | 5; // 1:初級 → 5:ネイティブレベル
  created_at: Date;
  updated_at: Date;
}

// ソーシャルアカウント連携
interface SocialAccount {
  id: string;
  user_id: string;
  provider: 'google' | 'line' | 'instagram';
  provider_user_id: string;
  provider_email?: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

---

## 💰 **3. 課金システム設計**

### 3.1 Stripe連携アーキテクチャ
```yaml
Stripe Integration Best Practices:

Customer Management:
  - Stripe Customer作成時にユーザーIDをmetadataに保存
  - メール変更時のStripe Customer同期
  - 顧客情報の定期的な整合性チェック

Subscription Management:
  - Stripe Checkout Session（新規登録・プラン変更）
  - Customer Portal（セルフサービス管理）
  - Webhook処理（リアルタイム状態同期）

Payment Methods:
  - クレジットカード（Visa, MasterCard, JCB, AMEX）
  - デビットカード
  - Apple Pay / Google Pay（将来的）
  - コンビニ決済（日本向け・将来的）

Tax Calculation:
  - Stripe Tax自動計算
  - 国別税率対応
  - インボイス制度対応（日本）
```

### 3.2 データ追跡・分析設計
```typescript
// 課金履歴（マーケティング分析用）
interface BillingHistory {
  id: string;
  user_id: string;
  stripe_subscription_id?: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  plan: Plan;
  billing_cycle: BillingCycle;
  payment_method_type: string; // card, apple_pay, google_pay
  status: PaymentStatus;
  
  // マーケティング分析用
  promotion_code?: string;      // プロモーションコード
  referral_source?: string;     // 流入元
  user_agent?: string;          // デバイス情報
  country_code?: string;        // 決済時の国
  
  created_at: Date;
  updated_at: Date;
}

// プラン変更履歴（料金設定分析用）
interface PlanChangeHistory {
  id: string;
  user_id: string;
  from_plan: Plan;
  to_plan: Plan;
  change_reason: 'upgrade' | 'downgrade' | 'canceled' | 'reactivated';
  change_trigger: 'user_initiated' | 'payment_failed' | 'admin_action';
  
  // 分析用データ
  days_since_signup: number;    // 登録からの日数
  previous_plan_duration: number; // 前プランの利用日数
  usage_stats?: UsageSnapshot;  // 変更時点の使用状況
  
  created_at: Date;
}

// 使用状況スナップショット（将来の使用量課金用）
interface UsageSnapshot {
  ai_chat_usage: number;
  lesson_plan_usage: number;
  voice_analysis_usage: number;
  image_processing_usage: number;
  translation_usage: number;
  feature_usage_distribution: Record<string, number>;
}

// A/Bテスト・実験用
interface ExperimentTracking {
  id: string;
  user_id: string;
  experiment_name: string;
  variant: string;
  conversion_event?: string;
  conversion_date?: Date;
  created_at: Date;
}
```

### 3.3 収益分析・KPI追跡
```yaml
重要指標の自動追跡:

Revenue Metrics:
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - Customer LTV (Lifetime Value)
  - ARPU (Average Revenue Per User)

Conversion Metrics:
  - Free → Paid 転換率
  - Trial → Subscription 転換率
  - プラン別アップグレード率
  - チャーン率（解約率）

User Behavior:
  - 機能別使用頻度
  - プラン変更パターン
  - 地域別収益分析
  - デバイス別購入行動

Future Planning:
  - 価格弾力性分析データ
  - 機能別価値測定
  - ユーザーセグメント別分析
  - 競合比較データ
```

---

## 🏗️ **4. アーキテクチャ設計**

### 4.1 システム構成図
```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (Next.js 15)                      │
├─────────────────────────────────────────────────────────────┤
│  Auth UI  │  Billing UI  │  Dashboard  │  Profile  │  Admin │
│  - SignIn │  - Pricing   │  - Usage    │  - Lang   │  - KPI │
│  - SignUp │  - Checkout  │  - History  │  - Social │  - User│
│  - OAuth  │  - Portal    │  - Settings │  - Prefs  │  - Logs│
└─────────────────────────────────────────────────────────────┘
                               │
                    ┌─────────────────┐
                    │   API Routes    │
                    │   (Next.js)     │
                    │   + tRPC        │
                    └─────────────────┘
                               │
├─────────────────────────────────────────────────────────────┤
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│ NextAuth.js │  Stripe API  │  Supabase  │  Prisma ORM  │    │
│   + OAuth   │  + Webhooks  │    (DB)    │  (Type-safe) │    │
└─────────────────────────────────────────────────────────────┘
                               │
                    ┌─────────────────┐
                    │   Future APIs   │
                    │   (Python)      │
                    │   FastAPI       │
                    └─────────────────┘
```

### 4.2 データベーススキーマ（Prisma）

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                   String   @id @default(cuid())
  email                String   @unique
  password             String?
  name                 String
  age                  Int?
  organization         String?
  
  // 地理・文化情報
  nationality          String
  residence_country    String
  native_language      String
  is_educator          Boolean  @default(false)
  gender               Gender?
  
  // システム管理
  created_at           DateTime @default(now())
  updated_at           DateTime @updatedAt
  email_verified       Boolean  @default(false)
  email_verified_at    DateTime?
  last_login           DateTime?
  
  // 課金関連
  stripe_customer_id   String?  @unique
  subscription_plan    Plan     @default(FREE)
  subscription_status  SubscriptionStatus @default(ACTIVE)
  subscription_period_start DateTime?
  subscription_period_end   DateTime?
  billing_cycle        BillingCycle?
  
  // リレーション
  language_skills      LanguageSkill[]
  social_accounts      SocialAccount[]
  billing_history      BillingHistory[]
  plan_change_history  PlanChangeHistory[]
  experiment_tracking  ExperimentTracking[]
  
  @@map("users")
}

model LanguageSkill {
  id                String @id @default(cuid())
  user_id           String
  language_code     String // ISO 639-1
  proficiency_level Int    @db.SmallInt // 1-5
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  user              User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@unique([user_id, language_code])
  @@map("language_skills")
}

model SocialAccount {
  id                String @id @default(cuid())
  user_id           String
  provider          Provider
  provider_user_id  String
  provider_email    String?
  access_token      String
  refresh_token     String?
  expires_at        DateTime?
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  user              User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@unique([provider, provider_user_id])
  @@map("social_accounts")
}

model BillingHistory {
  id                        String @id @default(cuid())
  user_id                   String
  stripe_subscription_id    String?
  stripe_payment_intent_id  String?
  amount                    Int
  currency                  String @default("jpy")
  plan                      Plan
  billing_cycle             BillingCycle
  payment_method_type       String
  status                    PaymentStatus
  
  // マーケティング分析用
  promotion_code            String?
  referral_source           String?
  user_agent                String?
  country_code              String?
  
  created_at                DateTime @default(now())
  updated_at                DateTime @updatedAt
  
  user                      User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@map("billing_history")
}

model PlanChangeHistory {
  id                    String @id @default(cuid())
  user_id               String
  from_plan             Plan
  to_plan               Plan
  change_reason         ChangeReason
  change_trigger        ChangeTrigger
  days_since_signup     Int
  previous_plan_duration Int
  usage_stats_snapshot  Json?
  created_at            DateTime @default(now())
  
  user                  User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@map("plan_change_history")
}

model ExperimentTracking {
  id                String @id @default(cuid())
  user_id           String
  experiment_name   String
  variant           String
  conversion_event  String?
  conversion_date   DateTime?
  created_at        DateTime @default(now())
  
  user              User @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@unique([user_id, experiment_name])
  @@map("experiment_tracking")
}

// Enums
enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum Provider {
  GOOGLE
  LINE
  INSTAGRAM
}

enum Plan {
  FREE
  BASIC
  PREMIUM
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  INCOMPLETE
  INCOMPLETE_EXPIRED
  TRIALING
  UNPAID
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum PaymentStatus {
  SUCCEEDED
  FAILED
  PENDING
  REQUIRES_ACTION
  CANCELED
}

enum ChangeReason {
  UPGRADE
  DOWNGRADE
  CANCELED
  REACTIVATED
}

enum ChangeTrigger {
  USER_INITIATED
  PAYMENT_FAILED
  ADMIN_ACTION
  EXPERIMENT
}
```

---

## 🚀 **5. 実装ロードマップ**

### Phase 1: 認証・基本課金システム（3週間）

#### **Week 1: 認証基盤 + UI**
```yaml
Day 1-2: 環境セットアップ
  - NextAuth.js v5設定
  - Prismaスキーマ作成・マイグレーション
  - Supabase環境構築

Day 3-4: 基本認証実装
  - メール認証システム
  - パスワードリセット機能
  - セッション管理

Day 5-7: ソーシャル認証
  - Google OAuth設定
  - LINE Login統合
  - Instagram Basic Display統合
  - 認証UI実装（多言語対応）
```

#### **Week 2: 課金システム統合**
```yaml
Day 1-3: Stripe統合
  - Stripe Checkout設定
  - Customer作成・同期
  - Webhook処理実装

Day 4-5: プラン管理
  - サブスクリプション作成・変更
  - プラン選択UI
  - Customer Portal統合

Day 6-7: 使用量追跡基盤
  - 基本的な使用量カウント
  - プラン制限チェック機能
```

#### **Week 3: プロフィール + 仕上げ**
```yaml
Day 1-3: プロフィール管理
  - 言語スキル設定UI
  - 地理・個人情報設定
  - アカウント連携管理

Day 4-5: 請求・履歴機能
  - 請求履歴表示
  - プラン変更履歴
  - ダウンロード機能

Day 6-7: テスト・バグ修正
  - 統合テスト
  - セキュリティチェック
  - パフォーマンス最適化
```

### Phase 2: Python API連携（4-5週間）
```yaml
Week 1-2: API基盤設計
  - FastAPI プロジェクト構築
  - 認証連携（JWT検証）
  - データベース設計（Python側）

Week 3-4: AI機能統合
  - OpenAI API統合
  - 音声認識API
  - 画像処理機能

Week 5: リアルタイム機能
  - WebSocket通信
  - 使用量制限・監視
  - パフォーマンス最適化
```

---

## 💡 **6. 技術スタック**

### 6.1 フロントエンド
```yaml
Core Framework:
  - Next.js 15 (App Router)
  - TypeScript 5+
  - Tailwind CSS
  - next-intl (国際化)

UI Components:
  - Headless UI / Radix UI
  - React Hook Form
  - Zod (バリデーション)

State Management:
  - React Query (Server State)
  - Zustand (Client State)
  - React Context (Global State)
```

### 6.2 認証・セキュリティ
```yaml
Authentication:
  - NextAuth.js v5
  - OAuth Providers: Google, LINE, Instagram
  - JWT + Secure Cookies

Security:
  - HTTPS Only
  - CSRF Protection
  - Rate Limiting
  - Input Sanitization
  - SQL Injection Prevention
```

### 6.3 バックエンド・インフラ
```yaml
Database:
  - Supabase (PostgreSQL)
  - Prisma ORM v5
  - Connection Pooling

Payment Processing:
  - Stripe Checkout
  - Stripe Customer Portal
  - Stripe Webhooks
  - Stripe Tax (自動税計算)

API Design:
  - tRPC (Type-safe APIs)
  - RESTful APIs (Python連携)
  - WebSocket (リアルタイム)

Deployment:
  - Vercel (Frontend)
  - Railway/Render (Python Backend)
  - Supabase (Database)
```

### 6.4 監視・分析
```yaml
Application Monitoring:
  - Vercel Analytics
  - Sentry (Error Tracking)
  - Prisma Metrics

Business Analytics:
  - Stripe Dashboard
  - Custom KPI Dashboard
  - Google Analytics 4

Performance:
  - Core Web Vitals
  - Real User Monitoring
  - Database Query Optimization
```

---

## 🔒 **7. セキュリティ要件**

### 7.1 データ保護
```yaml
Personal Data Protection:
  - GDPR Compliance (EU users)
  - 個人情報保護法対応 (Japan)
  - Data Encryption at Rest
  - Data Encryption in Transit

User Privacy:
  - Cookie Consent Management
  - Data Retention Policies
  - Right to Data Deletion
  - Data Export Functionality
```

### 7.2 アクセス制御
```yaml
Authentication Security:
  - Strong Password Policy
  - Session Timeout
  - Concurrent Session Limit
  - Suspicious Activity Detection

API Security:
  - Rate Limiting
  - IP Whitelisting (Admin)
  - API Key Management
  - Request Validation
```

---

## 📊 **8. 分析・KPI設計**

### 8.1 ビジネスKPI
```yaml
Revenue Metrics:
  - Monthly Recurring Revenue (MRR)
  - Annual Recurring Revenue (ARR)
  - Customer Lifetime Value (CLV)
  - Average Revenue Per User (ARPU)
  - Customer Acquisition Cost (CAC)

Conversion Metrics:
  - Signup → Email Verification Rate
  - Free → Paid Conversion Rate
  - Trial → Subscription Rate
  - Upsell Success Rate
  - Churn Rate by Plan

User Engagement:
  - Daily/Monthly Active Users
  - Feature Usage Distribution
  - Session Duration
  - Return Visit Rate
```

### 8.2 プロダクトKPI
```yaml
Technical Metrics:
  - Page Load Performance
  - API Response Times
  - Error Rates
  - Uptime/Availability

User Experience:
  - User Onboarding Completion
  - Feature Discovery Rate
  - Support Ticket Volume
  - User Satisfaction Score (NPS)
```

---

## 🚨 **9. リスク管理**

### 9.1 技術リスク
```yaml
High Priority:
  - Stripe Webhook障害対応
  - データベース障害対応
  - OAuth Provider変更対応
  - セキュリティ脆弱性対応

Medium Priority:
  - API Rate Limit対応
  - サードパーティ依存リスク
  - スケーラビリティ制約
```

### 9.2 ビジネスリスク
```yaml
Revenue Protection:
  - Payment Failure Handling
  - Subscription Downgrade Prevention
  - Fraud Detection
  - Competitive Response Plan

User Retention:
  - Feature Usage Monitoring
  - Churn Prediction
  - Customer Success Program
  - Feedback Loop Implementation
```

---

## 📞 **10. サポート・運用**

### 10.1 ユーザーサポート
```yaml
Support Channels:
  - In-app Help Center (多言語)
  - Email Support
  - FAQ Database
  - Video Tutorials

Self-Service:
  - Account Management Portal
  - Billing History Access
  - Plan Change Interface
  - Data Export Tools
```

### 10.2 運用監視
```yaml
System Monitoring:
  - Real-time Alerts
  - Performance Dashboards
  - Error Rate Tracking
  - User Activity Monitoring

Business Monitoring:
  - Revenue Tracking
  - Conversion Funnel Analysis
  - User Behavior Analytics
  - Competitive Intelligence
```

---

## 📝 **11. 開発ガイドライン**

### 11.1 コーディング規約
```yaml
TypeScript Best Practices:
  - Strict Type Checking
  - Interface-first Design
  - Proper Error Handling
  - Comprehensive Testing

React Best Practices:
  - Component Composition
  - Performance Optimization
  - Accessibility Compliance
  - SEO Optimization
```

### 11.2 テスト戦略
```yaml
Testing Pyramid:
  Unit Tests:
    - Business Logic
    - Utility Functions
    - Component Logic
  
  Integration Tests:
    - API Endpoints
    - Database Operations
    - Payment Flows
  
  E2E Tests:
    - User Registration Flow
    - Payment Process
    - Critical User Journeys
```

---

**📋 最終チェックリスト**

- [ ] 認証システム（メール + 3つのソーシャル）
- [ ] 課金システム（Stripe + 3プラン）
- [ ] プロフィール管理（5段階言語レベル）
- [ ] 多言語対応（認証画面含む）
- [ ] 分析・追跡システム
- [ ] セキュリティ対策
- [ ] 運用監視体制
