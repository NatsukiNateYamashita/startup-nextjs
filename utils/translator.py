#!/usr/bin/env python3
"""
記事翻訳システム

使用方法:
    python translator.py --article-id "006"
    python translator.py --article-id "006" --languages en zh-CN
"""

import json
import argparse
from pathlib import Path

# 設定ファイルをインポート
from config import (
    get_anthropic_client,
    BLOG_POSTS_DIR,
    PROMPTS_DIR,
    SUPPORTED_LANGUAGES
)

def load_translation_prompt():
    """翻訳プロンプトテンプレートを読み込み"""
    prompt_file = PROMPTS_DIR / "translation.md"
    
    if not prompt_file.exists():
        print(f"❌ プロンプトファイルが見つかりません: {prompt_file}")
        return None
        
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read()

def load_source_article(article_id):
    """日本語の元記事を読み込み"""
    article_dir = BLOG_POSTS_DIR / article_id
    ja_md_path = article_dir / "ja.md"
    
    if not ja_md_path.exists():
        print(f"❌ 日本語記事が見つかりません: {ja_md_path}")
        print("まず article_generator.py で記事を生成してください。")
        return None
    
    with open(ja_md_path, "r", encoding="utf-8") as f:
        return f.read()

def translate_article(source_content, target_language):
    """記事を指定した言語に翻訳"""
    print(f"🌏 {SUPPORTED_LANGUAGES.get(target_language, target_language)} への翻訳中...")
    
    # Anthropicクライアントを取得
    client = get_anthropic_client()
    if not client:
        return None
    
    # プロンプトテンプレートを読み込み
    prompt_template = load_translation_prompt()
    if not prompt_template:
        return None
    
    # プロンプトに情報を挿入
    prompt = prompt_template.replace("{source_content}", source_content)
    prompt = prompt.replace("{target_language}", SUPPORTED_LANGUAGES.get(target_language, target_language))
    
    try:
        # API呼び出し
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            # model="claude-sonnet-4-20250514",
            max_tokens=8000,
            temperature=0.3,  # 翻訳では低めの温度を使用
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        content = response.content[0].text
        
        # Markdown部分を抽出
        md_start = content.find("---")
        if md_start != -1:
            return content[md_start:].strip()
        else:
            # フォールバック: コンテンツ全体を返す
            return content.strip()
        
    except Exception as e:
        print(f"❌ 翻訳API呼び出しエラー: {e}")
        return None

def save_translated_article(article_id, language, translated_content):
    """翻訳された記事を保存"""
    article_dir = BLOG_POSTS_DIR / article_id
    translated_file = article_dir / f"{language}.md"
    
    with open(translated_file, "w", encoding="utf-8") as f:
        f.write(translated_content)
    
    print(f"✅ {SUPPORTED_LANGUAGES.get(language, language)} 記事を保存: {translated_file}")
    return translated_file

def update_meta_tags(article_id, translations):
    """meta.jsonのタグ情報を翻訳で更新"""
    article_dir = BLOG_POSTS_DIR / article_id
    meta_json_path = article_dir / "meta.json"
    
    if not meta_json_path.exists():
        print("⚠️  meta.jsonが見つかりません。タグの翻訳をスキップします。")
        return
    
    try:
        with open(meta_json_path, "r", encoding="utf-8") as f:
            meta_data = json.load(f)
        
        # タグの形式をチェック（配列形式か多言語オブジェクト形式か）
        if "tags" in meta_data:
            if isinstance(meta_data["tags"], list):
                # 新形式：配列の場合は多言語オブジェクトに変換
                base_tags = meta_data["tags"]
                meta_data["tags"] = {
                    "ja": base_tags,
                    "en": base_tags,  # 一旦同じタグを設定（将来的には翻訳可能）
                    "zh-CN": base_tags,
                    "zh-TW": base_tags
                }
            elif isinstance(meta_data["tags"], dict):
                # 旧形式：多言語オブジェクトの場合
                base_tags = meta_data["tags"].get("ja", [])
                for lang in translations.keys():
                    if lang not in meta_data["tags"]:
                        meta_data["tags"][lang] = base_tags
        
        with open(meta_json_path, "w", encoding="utf-8") as f:
            json.dump(meta_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ メタデータを更新: {meta_json_path}")
        
    except (json.JSONDecodeError, Exception) as e:
        print(f"⚠️  メタデータの更新に失敗: {e}")

def update_captions(article_id, translations):
    """captions.jsonの各言語キャプションを更新"""
    from config import BLOG_IMAGES_DIR
    
    images_dir = BLOG_IMAGES_DIR / article_id
    captions_path = images_dir / "captions.json"
    
    if not captions_path.exists():
        print("⚠️  captions.jsonが見つかりません。画像キャプションの翻訳をスキップします。")
        return
    
    try:
        with open(captions_path, "r", encoding="utf-8") as f:
            captions_data = json.load(f)
        
        # 簡易実装: 既存の日本語キャプションを他言語にコピー
        # 本格的な実装では各キャプションも翻訳APIを使用
        for image_key, image_data in captions_data.items():
            if "alt" in image_data and "caption" in image_data:
                ja_alt = image_data["alt"].get("ja", "")
                ja_caption = image_data["caption"].get("ja", "")
                
                for lang in translations.keys():
                    if lang not in image_data["alt"]:
                        image_data["alt"][lang] = ja_alt  # 一旦同じ内容を設定
                    if lang not in image_data["caption"]:
                        image_data["caption"][lang] = ja_caption
        
        with open(captions_path, "w", encoding="utf-8") as f:
            json.dump(captions_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 画像キャプションを更新: {captions_path}")
        
    except (json.JSONDecodeError, Exception) as e:
        print(f"⚠️  画像キャプションの更新に失敗: {e}")

def check_article_exists(article_id):
    """記事が存在するかチェック"""
    article_dir = BLOG_POSTS_DIR / article_id
    ja_md_path = article_dir / "ja.md"
    
    if not article_dir.exists():
        print(f"❌ 記事ディレクトリが見つかりません: {article_dir}")
        return False
    
    if not ja_md_path.exists():
        print(f"❌ 日本語記事が見つかりません: {ja_md_path}")
        return False
    
    return True

def main():
    parser = argparse.ArgumentParser(description="記事を多言語に翻訳します")
    parser.add_argument("--article-id", required=True, help="翻訳する記事のID")
    parser.add_argument(
        "--languages", 
        nargs="+",
        default=["en", "zh-CN", "zh-TW"],
        choices=list(SUPPORTED_LANGUAGES.keys()),
        help="翻訳先言語（複数指定可能）"
    )
    parser.add_argument("--force", action="store_true", help="既存ファイルを上書き")
    
    args = parser.parse_args()
    
    print("🌏 記事翻訳システム")
    print(f"📝 記事ID: {args.article_id}")
    print(f"🌐 翻訳言語: {', '.join([SUPPORTED_LANGUAGES.get(lang, lang) for lang in args.languages])}")
    print("-" * 50)
    
    # 記事の存在チェック
    if not check_article_exists(args.article_id):
        return
    
    # 日本語記事を読み込み
    source_content = load_source_article(args.article_id)
    if not source_content:
        return
    
    translations = {}
    
    # 各言語に翻訳
    for language in args.languages:
        if language == "ja":
            print("⚠️  日本語は元記事なのでスキップします")
            continue
        
        # 翻訳実行
        translated_content = translate_article(source_content, language)
        
        if translated_content:
            # 翻訳ファイルを保存
            saved_file = save_translated_article(args.article_id, language, translated_content)
            translations[language] = saved_file
        else:
            print(f"❌ {SUPPORTED_LANGUAGES.get(language, language)} への翻訳に失敗しました")
    
    # メタデータとキャプションを更新
    if translations:
        update_meta_tags(args.article_id, translations)
        update_captions(args.article_id, translations)
        
        print(f"\n✅ 翻訳が完了しました！")
        print(f"📁 記事ディレクトリ: {BLOG_POSTS_DIR / args.article_id}")
        print(f"🗂️  生成されたファイル: {len(translations)}個")
        
        for lang, file_path in translations.items():
            print(f"   • {SUPPORTED_LANGUAGES.get(lang, lang)}: {file_path.name}")
        
        print("\n次のステップ:")
        print("1. image_generator.py で画像生成")
        print("2. validator.py でファイル構成チェック")
    else:
        print("❌ 翻訳に失敗しました")

if __name__ == "__main__":
    main()
