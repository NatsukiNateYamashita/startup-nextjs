#!/usr/bin/env python3
"""
記事生成システム

使用方法:
    python article_generator.py --idea-id "006"
    python article_generator.py --custom-title "カスタムタイトル"
"""

import json
import argparse
from datetime import datetime
from pathlib import Path

# 設定ファイルをインポート
from config import (
    get_anthropic_client,
    IDEAS_FILE,
    PROMPTS_DIR,
    BLOG_POSTS_DIR,
    BLOG_IMAGES_DIR,
    BLOG_INDEX_FILE,  # 追加
    DEFAULT_AUTHOR_ID,
    ensure_directories
)

def load_prompt_template():
    """記事生成プロンプトテンプレートを読み込み"""
    prompt_file = PROMPTS_DIR / "article_generation.md"
    
    if not prompt_file.exists():
        print(f"❌ プロンプトファイルが見つかりません: {prompt_file}")
        return None
        
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read()

def load_ideas():
    """保存されたアイディアを読み込み"""
    if not IDEAS_FILE.exists():
        print(f"❌ アイディアファイルが見つかりません: {IDEAS_FILE}")
        print("まず idea_generator.py を実行してアイディアを生成してください。")
        return None
        
    with open(IDEAS_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            print("❌ アイディアファイルの形式が不正です")
            return None

def find_idea_by_id(ideas_data, idea_id):
    """IDでアイディアを検索"""
    if not ideas_data or "ideas" not in ideas_data:
        return None
        
    for idea in ideas_data["ideas"]:
        if idea.get("id") == idea_id:
            return idea
    return None

def list_available_ideas():
    """利用可能なアイディア一覧を表示"""
    ideas_data = load_ideas()
    if not ideas_data:
        return
        
    print("\n📋 利用可能なアイディア:")
    print("-" * 50)
    
    for idea in ideas_data["ideas"]:
        print(f"ID: {idea.get('id', 'N/A')} - {idea.get('title', {}).get('ja', 'N/A')}")
        print(f"   カテゴリ: {idea.get('category', 'N/A')}")
        print()

def create_article_directory(article_id):
    """記事用ディレクトリを作成"""
    article_dir = BLOG_POSTS_DIR / article_id
    images_dir = BLOG_IMAGES_DIR / article_id
    
    article_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)
    
    return article_dir, images_dir

def generate_article_content(idea):
    """Anthropic APIを使って記事コンテンツを生成"""
    print("🤖 記事生成中...")
    
    # Anthropicクライアントを取得
    client = get_anthropic_client()
    if not client:
        return None
    
    # プロンプトテンプレートを読み込み
    prompt_template = load_prompt_template()
    if not prompt_template:
        return None
    
    # プロンプトにアイディア情報を挿入
    current_date = datetime.now().isoformat()
    
    # プロンプトテンプレートのプレースホルダーを置換（format()の代わりにreplace()を使用）
    prompt = prompt_template
    prompt = prompt.replace("{title}", idea.get('title', {}).get('ja', ''))
    prompt = prompt.replace("{category}", idea.get('category', ''))
    prompt = prompt.replace("{target_audience}", idea.get('target_audience', ''))
    prompt = prompt.replace("{key_points}", '\n'.join([f"- {point}" for point in idea.get('key_points', [])]))
    prompt = prompt.replace("{word_count}", str(idea.get('estimated_word_count', 3000)))
    prompt = prompt.replace("{article_id}", idea.get('id', ''))
    prompt = prompt.replace("{current_date}", current_date)
    
    try:
        # API呼び出し
        response = client.messages.create(
            # model="claude-3-5-sonnet-20241022",
            # max_tokens=8000,  # Claude-3.5-sonnetの上限に合わせる
            model="claude-sonnet-4-20250514",
            max_tokens=16000,  # Claude-4-sonnetの上限に合わせる
            temperature=0.7,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        content = response.content[0].text
        
        # レスポンス全体をファイルに出力してデバッグ
        debug_file = "/tmp/claude_response_debug.txt"
        with open(debug_file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"🔍 デバッグ: 全レスポンスを {debug_file} に保存しました")
        print(f"🔍 APIレスポンス長: {len(content)} 文字")
        
        return parse_generated_content(content, idea)
        
    except Exception as e:
        print(f"❌ API呼び出しエラー: {e}")
        return None

def parse_generated_content(content, idea):
    """生成されたコンテンツを解析してファイルごとに分離"""
    
    result = {
        "markdown": "",
        "meta_json": {},
        "captions_json": {}
    }
    
    # Markdownコンテンツを抽出
    md_start = content.find("# 1. 日本語記事（ja.md）")
    meta_start = content.find("# 2. メタデータ（meta.json）")
    
    if md_start != -1:
        md_content_start = content.find("```markdown", md_start)
        if md_content_start != -1:
            md_content_start = content.find("\n", md_content_start) + 1
            # meta_startの前にある```を見つける
            if meta_start != -1:
                # meta_startより前の最後の```を探す
                md_content_end = content.rfind("```", md_content_start, meta_start)
            else:
                # meta_startが見つからない場合は通常通り最初の```を使用
                md_content_end = content.find("```", md_content_start)
            
            if md_content_end != -1:
                result["markdown"] = content[md_content_start:md_content_end].strip()
    
    # meta.jsonを抽出
    if meta_start != -1:
        meta_json_start = content.find("```json", meta_start)
        if meta_json_start != -1:
            meta_json_start = content.find("\n", meta_json_start) + 1
            meta_json_end = content.find("```", meta_json_start)
            if meta_json_end != -1:
                try:
                    meta_json_str = content[meta_json_start:meta_json_end].strip()
                    result["meta_json"] = json.loads(meta_json_str)
                except json.JSONDecodeError:
                    print("⚠️  メタデータJSONの解析に失敗しました。デフォルト値を使用します。")
                    result["meta_json"] = create_default_meta(idea)
    
    # captions.jsonを抽出
    captions_start = content.find("# 3. 画像情報（captions.json）")
    if captions_start != -1:
        captions_json_start = content.find("```json", captions_start)
        if captions_json_start != -1:
            captions_json_start = content.find("\n", captions_json_start) + 1
            captions_json_end = content.find("```", captions_json_start)
            if captions_json_end != -1:
                try:
                    captions_json_str = content[captions_json_start:captions_json_end].strip()
                    result["captions_json"] = json.loads(captions_json_str)
                except json.JSONDecodeError:
                    print("⚠️  画像JSONの解析に失敗しました。デフォルト値を使用します。")
                    result["captions_json"] = create_default_captions(idea)
    
    # デフォルト値の設定
    if not result["markdown"]:
        print("⚠️  Markdownコンテンツの抽出に失敗しました。")
        return None
    
    if not result["meta_json"]:
        result["meta_json"] = create_default_meta(idea)
    
    if not result["captions_json"]:
        result["captions_json"] = create_default_captions(idea)
    
    return result

def create_default_meta(idea):
    """デフォルトのメタデータを作成"""
    return {
        "authorId": DEFAULT_AUTHOR_ID,
        "tags": {
            "ja": idea.get('seo_keywords', [])[:3],
            "en": idea.get('seo_keywords', [])[:3],
            "zh-CN": idea.get('seo_keywords', [])[:3],
            "zh-TW": idea.get('seo_keywords', [])[:3]
        },
        "publishDate": datetime.now().isoformat(),
        "heroImage": f"/images/blog/{idea.get('id', '')}/hero.jpg",
        "featured": False,
        "relatedPosts": []
    }

def create_default_captions(idea):
    """デフォルトの画像キャプションを作成"""
    return {
        "hero.jpg": {
            "alt": {
                "ja": f"{idea.get('title', {}).get('ja', '')}のイメージ",
                "en": f"Image for {idea.get('title', {}).get('en', '')}"
            },
            "caption": {
                "ja": "記事のヒーロー画像",
                "en": "Hero image for the article"
            }
        }
    }

def save_generated_files(article_id, content_data):
    """生成されたファイルを保存"""
    
    article_dir, images_dir = create_article_directory(article_id)
    
    # ja.mdを保存
    ja_md_path = article_dir / "ja.md"
    with open(ja_md_path, "w", encoding="utf-8") as f:
        f.write(content_data["markdown"])
    print(f"✅ 日本語記事を保存: {ja_md_path}")
    
    # meta.jsonを保存
    meta_json_path = article_dir / "meta.json"
    with open(meta_json_path, "w", encoding="utf-8") as f:
        json.dump(content_data["meta_json"], f, ensure_ascii=False, indent=2)
    print(f"✅ メタデータを保存: {meta_json_path}")
    
    # captions.jsonを保存
    captions_json_path = images_dir / "captions.json"
    with open(captions_json_path, "w", encoding="utf-8") as f:
        json.dump(content_data["captions_json"], f, ensure_ascii=False, indent=2)
    print(f"✅ 画像情報を保存: {captions_json_path}")
    
    return {
        "article_dir": article_dir,
        "images_dir": images_dir,
        "files": {
            "ja_md": ja_md_path,
            "meta_json": meta_json_path,
            "captions_json": captions_json_path
        }
    }

def rebuild_blog_index():
    """既存の全記事をスキャンしてブログインデックスファイルを再構築"""
    print("📚 ブログインデックスを再構築中...")
    
    # 記事ディレクトリをスキャン
    posts = []
    all_tags = set()
    
    if not BLOG_POSTS_DIR.exists():
        print(f"⚠️  記事ディレクトリが存在しません: {BLOG_POSTS_DIR}")
        # 空のインデックスを作成
        index_data = {"posts": [], "tags": [], "lastUpdated": datetime.now().isoformat(), "totalPosts": 0}
    else:
        # 各記事ディレクトリをスキャン
        for article_dir in BLOG_POSTS_DIR.iterdir():
            if not article_dir.is_dir():
                continue
                
            article_id = article_dir.name
            meta_file = article_dir / "meta.json"
            
            if not meta_file.exists():
                raise FileNotFoundError(f"❌ meta.jsonが見つかりません: {meta_file}")
            
            try:
                with open(meta_file, "r", encoding="utf-8") as f:
                    meta_data = json.load(f)
            except json.JSONDecodeError as e:
                raise ValueError(f"❌ meta.jsonの解析に失敗しました ({meta_file}): {e}")
            
            # 記事情報を作成
            post_info = {
                "id": article_id,
                "slug": article_id,
                "publishDate": meta_data.get("publishDate", datetime.now().isoformat()),
                "featured": meta_data.get("featured", False),
                "authorId": meta_data.get("authorId", DEFAULT_AUTHOR_ID)
            }
            posts.append(post_info)
            
            # タグ情報を収集
            if "tags" in meta_data:
                for lang_tags in meta_data["tags"].values():
                    if isinstance(lang_tags, list):
                        all_tags.update(lang_tags)
            
            print(f"📄 記事をスキャン: {article_id}")
        
        # インデックスデータを作成
        index_data = {
            "posts": sorted(posts, key=lambda x: x["publishDate"], reverse=True),  # 新しい順にソート
            "tags": sorted(list(all_tags)),
            "lastUpdated": datetime.now().isoformat(),
            "totalPosts": len(posts)
        }
    
    # ファイルに保存
    with open(BLOG_INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ ブログインデックスを再構築: {BLOG_INDEX_FILE}")
    print(f"📊 総記事数: {len(posts)}")

def main():
    parser = argparse.ArgumentParser(description="ブログ記事を生成します")
    parser.add_argument("--idea-id", help="使用するアイディアのID")
    parser.add_argument("--list", action="store_true", help="利用可能なアイディア一覧を表示")
    
    args = parser.parse_args()
    
    print("🚀 記事生成システム")
    print("-" * 50)
    
    if args.list:
        list_available_ideas()
        return
    
    if not args.idea_id:
        print("❌ --idea-id を指定してください")
        print("利用可能なアイディア一覧を見るには --list を使用してください")
        return
    
    # アイディアを読み込み
    ideas_data = load_ideas()
    if not ideas_data:
        return
    
    # 指定されたIDのアイディアを検索
    idea = find_idea_by_id(ideas_data, args.idea_id)
    if not idea:
        print(f"❌ ID '{args.idea_id}' のアイディアが見つかりません")
        list_available_ideas()
        return
    
    print(f"📝 記事を生成します: {idea.get('title', {}).get('ja', 'N/A')}")
    print(f"🏷️  ID: {args.idea_id}")
    
    # 記事コンテンツを生成
    content_data = generate_article_content(idea)
    if not content_data:
        print("❌ 記事の生成に失敗しました")
        return
    
    # ファイルを保存
    saved_files = save_generated_files(args.idea_id, content_data)
    
    # ブログインデックスを再構築
    rebuild_blog_index()
    
    print("\n✅ 記事生成が完了しました！")
    print(f"📁 記事ディレクトリ: {saved_files['article_dir']}")
    print(f"🖼️  画像ディレクトリ: {saved_files['images_dir']}")
    print("\n次のステップ:")
    print("1. translator.py で他言語への翻訳")
    print("2. image_generator.py で画像生成")
    print("3. validator.py でファイル構成チェック")

if __name__ == "__main__":
    main()
