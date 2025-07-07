# 記事自動作成システム

## 概要
Anthropic Claude APIを使用してブログ記事を自動生成・翻訳・画像作成・配置するシステムです。

> **🔗 関連ドキュメント**  
> - [プロジェクト全体概要](../PROJECT_DOCUMENTATION.md) - NIHONGO-AIプロジェクト全体情報  
> - [ブログ要件定義](../.github/BLOG_REQUIREMENTS.md) - ブログ機能の要件・進捗  
> - [GitHub Copilot実装ガイド](../.github/.copilot-instructions.md) - 開発ルール・設計規則

## システム構成

### 実行ファイル
- `idea_generator.py` - 記事アイディア生成
- `article_generator.py` - 記事・メタデータ・画像情報生成
- `translator.py` - 多言語翻訳
- `image_generator.py` - 画像生成（DALL·E 3/Unsplash API連携・デフォルト: DALL·E 3）
- `validator.py` - ファイル構成検証・修正

### 設定・プロンプトファイル
- `config.py` - 設定管理
- `prompts/` - プロンプトテンプレート
- `generated_ideas.json` - 生成されたアイディア保存

## 使用方法

### 1. 環境セットアップ
```bash
# プロジェクトルートで実行
./setup_article_system.sh
```

### 2. 環境変数設定
```bash
# .env.localをコピーして.envファイルを作成
cp .env.local .env

# .envファイルを編集してAPIキーを設定
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here  
# OPENAI_API_KEY=your_openai_api_key_here
```

> **🔐 APIキー管理**: 全てのAPIキーは`config.py`の`get_api_key()`関数で統一管理されています。

### 3. メインスクリプトで一括操作
```bash
cd utils

# アイディア生成
python main.py ideas

# 特定テーマでアイディア生成
python main.py ideas --theme "AI教育"

# 記事生成（アイディアIDを指定）
python main.py generate 006

# 記事生成〜検証まで一括実行
python main.py full 006
```

### 3. 個別スクリプト実行
```bash
# 記事アイディア生成
python idea_generator.py --save

# 記事生成
python article_generator.py --idea-id "006"

# 翻訳実行
python translator.py --article-id "006"

# 画像生成（デフォルト: DALL·E 3）
python image_generator.py --article-id "006"

# Unsplash使用の場合
python image_generator.py --article-id "006" --service unsplash

# DALL·E 3使用の場合（デフォルト）
python image_generator.py --article-id "006" --service dalle

# 検証・修正
python validator.py --article-id "006" --fix
```

## ファイル構成

### 生成される記事構造
```
startup-nextjs/
├── src/content/blog/posts/{記事ID}/
│   ├── ja.md          # 日本語記事（基準）
│   ├── en.md          # 英語翻訳
│   ├── zh-CN.md       # 中国語簡体字
│   ├── zh-TW.md       # 中国語繁体字
│   └── meta.json      # 記事メタデータ
└── public/images/blog/{記事ID}/
    ├── hero.jpg       # ヒーロー画像
    ├── captions.json  # 画像キャプション
    └── *.jpg          # その他の画像
```

## 画像生成システム

### サポートされている画像生成サービス
- **DALL·E 3** (デフォルト): OpenAI APIによる高品質画像生成
  - 画像サイズ: 1024x1024, 1024x1792, 1792x1024のみサポート
  - 高品質でコンテキストに適した画像生成
- **Unsplash**: 写真素材からの検索・ダウンロード
  - 任意サイズ対応
  - 実際の写真素材

### 使用方法
```bash
# DALL·E 3で画像生成（デフォルト）
python image_generator.py --article-id "006" --service dalle

# Unsplashで画像生成
python image_generator.py --article-id "006" --service unsplash
```

## API設定

### APIキー管理
- 全てのAPIキーは `config.py` の `get_api_key()` 関数で統一管理
- 環境変数（`.env`ファイル）から安全に取得
- 必要なAPIキー:
  - `ANTHROPIC_API_KEY`: Claude API（記事生成・翻訳）
  - `UNSPLASH_ACCESS_KEY`: Unsplash API（画像検索）
  - `OPENAI_API_KEY`: OpenAI API（DALL·E 3画像生成）

## 注意事項
- 本システムはローカル開発環境での使用を想定
- DALL·E 3使用時は画像サイズが制限されます（1024x1024等）
- APIキーは必ず環境変数で管理し、コードにハードコーディングしないでください
- API Keyの本番環境での直接使用は禁止
- 生成されたコンテンツは必ず人間による確認・編集を推奨

## 更新履歴
- 2025-07-07: 初版作成
