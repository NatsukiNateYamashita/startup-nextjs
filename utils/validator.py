#!/usr/bin/env python3
"""
記事ファイル構成検証・修正システム

使用方法:
    python validator.py --article-id "006"
    python validator.py --article-id "006" --fix
"""

import json
import argparse
from pathlib import Path
from datetime import datetime

# 設定ファイルをインポート
from config import (
    BLOG_POSTS_DIR,
    BLOG_IMAGES_DIR,
    BLOG_INDEX_FILE,
    SUPPORTED_LANGUAGES,
    DEFAULT_AUTHOR_ID
)

class ArticleValidator:
    def __init__(self, article_id):
        self.article_id = article_id
        self.article_dir = BLOG_POSTS_DIR / article_id
        self.images_dir = BLOG_IMAGES_DIR / article_id
        self.errors = []
        self.warnings = []
        self.info = []
    
    def log_error(self, message):
        """エラーを記録"""
        self.errors.append(message)
        print(f"❌ {message}")
    
    def log_warning(self, message):
        """警告を記録"""
        self.warnings.append(message)
        print(f"⚠️  {message}")
    
    def log_info(self, message):
        """情報を記録"""
        self.info.append(message)
        print(f"ℹ️  {message}")
    
    def check_directory_structure(self):
        """ディレクトリ構造をチェック"""
        print("📁 ディレクトリ構造をチェック中...")
        
        if not self.article_dir.exists():
            self.log_error(f"記事ディレクトリが存在しません: {self.article_dir}")
            return False
        
        if not self.images_dir.exists():
            self.log_warning(f"画像ディレクトリが存在しません: {self.images_dir}")
        
        return True
    
    def check_markdown_files(self):
        """Markdownファイルをチェック"""
        print("📝 Markdownファイルをチェック中...")
        
        required_files = []
        optional_files = []
        
        # 日本語ファイルは必須
        ja_file = self.article_dir / "ja.md"
        if ja_file.exists():
            required_files.append("ja.md")
            self.log_info("日本語記事ファイルが存在します")
        else:
            self.log_error("日本語記事ファイル (ja.md) が見つかりません")
            return False
        
        # 他言語ファイルをチェック
        for lang in SUPPORTED_LANGUAGES:
            if lang == "ja":
                continue
            
            lang_file = self.article_dir / f"{lang}.md"
            if lang_file.exists():
                optional_files.append(f"{lang}.md")
                self.log_info(f"{SUPPORTED_LANGUAGES[lang]} 記事ファイルが存在します")
        
        return True
    
    def check_markdown_format(self, file_path):
        """Markdownファイルの形式をチェック"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # frontmatterのチェック
            if not content.startswith("---"):
                self.log_error(f"{file_path.name}: frontmatterが見つかりません")
                return False
            
            # frontmatter終了の確認
            frontmatter_end = content.find("---", 3)
            if frontmatter_end == -1:
                self.log_error(f"{file_path.name}: frontmatterの終了が見つかりません")
                return False
            
            # 必要なfrontmatterフィールドをチェック
            frontmatter = content[3:frontmatter_end]
            if "title:" not in frontmatter:
                self.log_warning(f"{file_path.name}: titleフィールドが見つかりません")
            if "excerpt:" not in frontmatter:
                self.log_warning(f"{file_path.name}: excerptフィールドが見つかりません")
            
            return True
            
        except Exception as e:
            self.log_error(f"{file_path.name}: ファイル読み込みエラー - {e}")
            return False
    
    def check_meta_json(self):
        """meta.jsonをチェック"""
        print("🏷️  メタデータをチェック中...")
        
        meta_file = self.article_dir / "meta.json"
        if not meta_file.exists():
            self.log_error("meta.json が見つかりません")
            return False
        
        try:
            with open(meta_file, "r", encoding="utf-8") as f:
                meta_data = json.load(f)
            
            # 必須フィールドをチェック
            required_fields = ["authorId", "tags", "publishDate", "heroImage"]
            for field in required_fields:
                if field not in meta_data:
                    self.log_error(f"meta.json: 必須フィールド '{field}' が見つかりません")
            
            # tagsの言語チェック
            if "tags" in meta_data:
                tags = meta_data["tags"]
                for lang in SUPPORTED_LANGUAGES:
                    if lang not in tags:
                        self.log_warning(f"meta.json: {SUPPORTED_LANGUAGES[lang]} のタグが見つかりません")
            
            # heroImageパスのチェック
            if "heroImage" in meta_data:
                hero_path = meta_data["heroImage"]
                expected_path = f"/images/blog/{self.article_id}/"
                if not hero_path.startswith(expected_path):
                    self.log_warning(f"meta.json: heroImageパスが不正: {hero_path}")
            
            return True
            
        except json.JSONDecodeError as e:
            self.log_error(f"meta.json: JSON形式エラー - {e}")
            return False
        except Exception as e:
            self.log_error(f"meta.json: 読み込みエラー - {e}")
            return False
    
    def check_captions_json(self):
        """captions.jsonをチェック"""
        print("🖼️  画像キャプションをチェック中...")
        
        captions_file = self.images_dir / "captions.json"
        if not captions_file.exists():
            self.log_warning("captions.json が見つかりません")
            return False
        
        try:
            with open(captions_file, "r", encoding="utf-8") as f:
                captions_data = json.load(f)
            
            # 各画像のキャプション形式をチェック
            for image_key, image_data in captions_data.items():
                if "alt" not in image_data:
                    self.log_warning(f"captions.json: {image_key} に alt が見つかりません")
                if "caption" not in image_data:
                    self.log_warning(f"captions.json: {image_key} に caption が見つかりません")
                
                # 各言語のキャプションをチェック
                for field in ["alt", "caption"]:
                    if field in image_data:
                        for lang in SUPPORTED_LANGUAGES:
                            if lang not in image_data[field]:
                                self.log_info(f"captions.json: {image_key}.{field} に {SUPPORTED_LANGUAGES[lang]} がありません")
            
            return True
            
        except json.JSONDecodeError as e:
            self.log_error(f"captions.json: JSON形式エラー - {e}")
            return False
        except Exception as e:
            self.log_error(f"captions.json: 読み込みエラー - {e}")
            return False
    
    def check_images(self):
        """画像ファイルをチェック"""
        print("🖼️  画像ファイルをチェック中...")
        
        if not self.images_dir.exists():
            self.log_warning("画像ディレクトリが存在しません")
            return False
        
        # captions.jsonから必要な画像リストを取得
        captions_file = self.images_dir / "captions.json"
        required_images = []
        
        if captions_file.exists():
            try:
                with open(captions_file, "r", encoding="utf-8") as f:
                    captions_data = json.load(f)
                required_images = list(captions_data.keys())
            except:
                self.log_warning("captions.jsonの読み込みに失敗しました")
        
        # 実際の画像ファイルをチェック
        existing_images = []
        for img_file in self.images_dir.glob("*.jpg"):
            existing_images.append(img_file.name)
        for img_file in self.images_dir.glob("*.png"):
            existing_images.append(img_file.name)
        
        # 不足している画像をチェック
        missing_images = []
        for required_img in required_images:
            if required_img not in existing_images:
                missing_images.append(required_img)
                self.log_warning(f"画像ファイルが見つかりません: {required_img}")
        
        # 余分な画像をチェック
        extra_images = []
        for existing_img in existing_images:
            if existing_img not in required_images and existing_img != "captions.json":
                extra_images.append(existing_img)
                self.log_info(f"captions.jsonにない画像ファイル: {existing_img}")
        
        if not missing_images:
            self.log_info("すべての必要な画像ファイルが存在します")
        
        return len(missing_images) == 0
    
    def fix_missing_directories(self):
        """不足しているディレクトリを作成"""
        print("🔧 ディレクトリを修正中...")
        
        if not self.article_dir.exists():
            self.article_dir.mkdir(parents=True, exist_ok=True)
            self.log_info(f"記事ディレクトリを作成: {self.article_dir}")
        
        if not self.images_dir.exists():
            self.images_dir.mkdir(parents=True, exist_ok=True)
            self.log_info(f"画像ディレクトリを作成: {self.images_dir}")
    
    def fix_meta_json(self):
        """meta.jsonを修正・作成"""
        print("🔧 meta.jsonを修正中...")
        
        meta_file = self.article_dir / "meta.json"
        
        if meta_file.exists():
            try:
                with open(meta_file, "r", encoding="utf-8") as f:
                    meta_data = json.load(f)
            except:
                meta_data = {}
        else:
            meta_data = {}
        
        # デフォルト値を設定
        defaults = {
            "authorId": DEFAULT_AUTHOR_ID,
            "tags": {lang: [] for lang in SUPPORTED_LANGUAGES},
            "publishDate": datetime.now().isoformat(),
            "heroImage": f"/images/blog/{self.article_id}/hero.jpg",
            "featured": False,
            "relatedPosts": []
        }
        
        for key, default_value in defaults.items():
            if key not in meta_data:
                meta_data[key] = default_value
                self.log_info(f"meta.json: {key} を追加しました")
        
        # ファイルに保存
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(meta_data, f, ensure_ascii=False, indent=2)
        
        self.log_info(f"meta.jsonを更新: {meta_file}")
    
    def validate(self, fix=False):
        """全体の検証を実行"""
        print(f"🔍 記事 '{self.article_id}' の検証を開始...")
        print("=" * 50)
        
        if fix:
            self.fix_missing_directories()
        
        # ディレクトリ構造チェック
        if not self.check_directory_structure():
            if not fix:
                return False
        
        # Markdownファイルチェック
        self.check_markdown_files()
        
        # 各Markdownファイルの形式チェック
        for lang in SUPPORTED_LANGUAGES:
            lang_file = self.article_dir / f"{lang}.md"
            if lang_file.exists():
                self.check_markdown_format(lang_file)
        
        # meta.jsonチェック
        self.check_meta_json()
        if fix:
            self.fix_meta_json()
        
        # captions.jsonチェック
        self.check_captions_json()
        
        # 画像ファイルチェック
        self.check_images()
        
        # 結果表示
        print("\n" + "=" * 50)
        print("🔍 検証結果")
        print(f"❌ エラー: {len(self.errors)}個")
        print(f"⚠️  警告: {len(self.warnings)}個")
        print(f"ℹ️  情報: {len(self.info)}個")
        
        if self.errors:
            print("\n❌ エラー一覧:")
            for error in self.errors:
                print(f"   • {error}")
        
        if self.warnings:
            print("\n⚠️  警告一覧:")
            for warning in self.warnings:
                print(f"   • {warning}")
        
        success = len(self.errors) == 0
        if success:
            print("\n✅ 検証が完了しました！記事は正常な構成です。")
        else:
            print(f"\n❌ {len(self.errors)}個のエラーを修正してください。")
            if not fix:
                print("--fix オプションで自動修正を試行できます。")
        
        return success

def main():
    parser = argparse.ArgumentParser(description="記事ファイル構成を検証・修正します")
    parser.add_argument("--article-id", required=True, help="検証する記事のID")
    parser.add_argument("--fix", action="store_true", help="問題を自動修正する")
    
    args = parser.parse_args()
    
    print("🔍 記事検証システム")
    print(f"📝 記事ID: {args.article_id}")
    if args.fix:
        print("🔧 自動修正モード")
    print("-" * 50)
    
    validator = ArticleValidator(args.article_id)
    success = validator.validate(fix=args.fix)
    
    if success:
        print("\n🎉 すべてのチェックが完了しました！")
    else:
        exit(1)

if __name__ == "__main__":
    main()
