# 記事自動作成システム

## 概要
Anthropic Claude APIを使用してブログ記事を自動生成・翻訳・画像作成・配置するシステムです。

## システム構成

### 実行ファイル
- `idea_generator.py` - 記事アイディア生成
- `article_generator.py` - 記事・メタデータ・画像情報生成
- `translator.py` - 多言語翻訳
- `image_generator.py` - 画像生成（AI画像生成API連携）
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
# .env.exampleをコピーして.envファイルを作成
cp .env.example .env

# .envファイルを編集してAPIキーを設定
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 3. メインスクリプトで一括操作
```bash
cd utils

# アイディア生成
python main.py ideas

# 特定テーマでアイディア生成
python main.py ideas --theme "AI教育"

# 記事生成（アイディアIDを指定）
python main.py generate 006

# 翻訳〜検証まで一括実行
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

# 画像生成
python image_generator.py --article-id "006"

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

## API設定
- Anthropic API Keyは `config.py` で管理
- ローカル開発時のみ使用

## 注意事項
- 本システムはローカル開発環境での使用を想定
- API Keyの本番環境での直接使用は禁止
- 生成されたコンテンツは必ず人間による確認・編集を推奨

## 更新履歴
- 2025-07-07: 初版作成
