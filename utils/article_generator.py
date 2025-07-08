#!/usr/bin/env python3
"""
記事生成システム（左右対訳対応版）

新機能:
- sentenceタグ自動挿入
- 多言語間のsentenceタグID整合性チェック
- 左右対訳ページ対応記事生成

使用方法:
    python article_generator.py --idea-id "010"
    python article_generator.py --custom-title "カスタムタイトル"
"""

import json
import re
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
    """記事生成プロンプトテンプレートを読み込み（左右対訳対応版）"""
    # 新しいsentenceタグ対応プロンプトを優先的に使用
    prompt_file = PROMPTS_DIR / "article_generation_with_sentence_tags.md"
    
    if not prompt_file.exists():
        print(f"⚠️  左右対訳対応プロンプトが見つかりません: {prompt_file}")
        print("⚠️  従来版のプロンプトを使用します")
        prompt_file = PROMPTS_DIR / "article_generation.md"
    
    if not prompt_file.exists():
        print(f"❌ プロンプトファイルが見つかりません: {prompt_file}")
        return None
        
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read()

def validate_sentence_tags(content: str):
    """sentenceタグの妥当性をチェック"""
    tags = re.findall(r'<!--\s*s(\d+)\s*-->', content)
    tag_numbers = [int(tag) for tag in tags]
    
    return {
        "has_tags": len(tag_numbers) > 0,
        "total_tags": len(tag_numbers),
        "tag_numbers": tag_numbers,
        "is_sequential": tag_numbers == list(range(1, len(tag_numbers) + 1)),
        "duplicates": len(tag_numbers) != len(set(tag_numbers))
    }

def inject_sentence_tags(content: str) -> str:
    """生成されたマークダウンにsentenceタグを自動挿入"""
    if '<!-- s1 -->' in content:
        print("✅ sentenceタグが既に含まれています")
        return content
    
    print("🔧 sentenceタグを自動挿入中...")
    
    lines = content.split('\n')
    result = []
    tag_counter = 1
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # 空行はそのまま追加
        if not stripped:
            result.append(line)
            continue
        
        # frontmatterは保持
        if stripped == '---' and i < 5:
            result.append(line)
            continue
        
        # sentenceタグを追加する条件をチェック
        should_add_tag = False
        
        # H1, H2, H3見出し
        if re.match(r'^#{1,3}\s+', stripped):
            should_add_tag = True
        
        # 段落（文字で始まる行、コードブロックや特殊記号以外）
        elif re.match(r'^[^\-\*\`\#\|\<\>\[]', stripped) and not stripped.startswith('```'):
            # 前の行が空行または見出しの場合のみ段落開始とみなす
            if i == 0 or not lines[i-1].strip() or re.match(r'^#{1,3}\s+', lines[i-1].strip()):
                should_add_tag = True
        
        # リスト項目の最初
        elif re.match(r'^[\-\*]\s+\*\*', stripped):  # "- **項目**:" 形式
            should_add_tag = True
        
        # 番号リストの最初
        elif re.match(r'^\d+\.\s+\*\*', stripped):  # "1. **項目**:" 形式
            should_add_tag = True
        
        # コードブロックの前
        elif stripped.startswith('```') and not any('```' in prev_line for prev_line in lines[max(0, i-3):i]):
            should_add_tag = True
        
        if should_add_tag:
            result.append(f"<!-- s{tag_counter} -->")
            result.append(line)
            tag_counter += 1
        else:
            result.append(line)
    
    final_content = '\n'.join(result)
    
    # バリデーション
    validation = validate_sentence_tags(final_content)
    print(f"📊 sentenceタグ統計: {validation['total_tags']}個のタグ")
    if not validation['is_sequential']:
        print("⚠️  警告: sentenceタグの番号が連続していません")
    
    return final_content

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

def generate_article_content(client, idea):
    """Claude APIを使用して記事コンテンツを生成"""
    print(f"🤖 記事生成中: {idea.get('title', {}).get('ja', '')}")
    
    # プロンプトテンプレートを読み込み
    prompt_template = load_prompt_template()
    if not prompt_template:
        return None
    
    # プロンプトにアイディア情報を挿入
    current_date = datetime.now().isoformat()
    
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
            model="claude-sonnet-4-20250514",
            max_tokens=16000,
            temperature=0.7,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        content = response.content[0].text
        
        print(f"✅ Claude API レスポンス取得完了 ({len(content)} 文字)")
        
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
    
    try:
        # マークダウン部分を抽出
        markdown_match = re.search(r'```markdown\s*\n(.*?)(?=\n```json|\n```\s*$|$)', content, re.DOTALL)
        if markdown_match:
            result["markdown"] = markdown_match.group(1).strip()
            
            # sentenceタグの自動挿入
            result["markdown"] = inject_sentence_tags(result["markdown"])
        
        # meta.json部分を抽出
        meta_match = re.search(r'```json\s*\n(\{.*?"authorId".*?\})\s*\n```', content, re.DOTALL)
        if meta_match:
            try:
                result["meta_json"] = json.loads(meta_match.group(1))
                print("✅ meta.jsonを正常にパースしました")
            except json.JSONDecodeError:
                print("⚠️  meta.json のパースに失敗しました")
        
        # captions.json部分を抽出（戦略的アプローチ）
        # 1. まずすべてのJSONブロックを見つける
        all_json_blocks = re.findall(r'```json\s*\n(.*?)\n```', content, re.DOTALL)
        print(f"🔍 見つかったJSONブロック数: {len(all_json_blocks)}")
        
        captions_found = False
        for i, json_block in enumerate(all_json_blocks):
            print(f"🔍 JSONブロック {i+1} の分析中...")
            
            # meta.jsonは既に処理したのでスキップ
            if '"authorId"' in json_block:
                print(f"   → meta.jsonブロック、スキップ")
                continue
            
            # captions.jsonの特徴を探す
            has_image_keys = any(ext in json_block for ext in ['.jpg', '.jpeg', '.png', '.webp'])
            has_lang_keys = any(lang in json_block for lang in ['"ja":', '"en":', '"zh-CN":', '"zh-TW":'])
            has_alt_or_caption = any(key in json_block for key in ['"alt":', '"caption":'])
            
            print(f"   → 画像ファイル拡張子: {has_image_keys}")
            print(f"   → 言語キー: {has_lang_keys}")
            print(f"   → alt/captionキー: {has_alt_or_caption}")
            
            # captions.jsonの可能性が高い場合
            if has_image_keys or (has_lang_keys and has_alt_or_caption):
                print(f"   → captions.jsonの可能性が高い、パース試行")
                try:
                    # JSON開始の { から最後の } までを抽出
                    json_start = json_block.find('{')
                    if json_start >= 0:
                        json_end = json_block.rfind('}')
                        if json_end > json_start:
                            clean_json = json_block[json_start:json_end+1]
                            result["captions_json"] = json.loads(clean_json)
                            print("✅ captions.jsonを正常にパースしました")
                            captions_found = True
                            break
                except json.JSONDecodeError as e:
                    print(f"   → パースエラー: {str(e)}")
                    continue
            else:
                print(f"   → captions.jsonの特徴なし、スキップ")
        
        # captions.jsonが見つからない場合のフォールバック
        if not captions_found:
            print("⚠️  captions.jsonが見つかりません。デフォルトを作成します")
            result["captions_json"] = create_default_captions(idea)
        
        return result
        
    except Exception as e:
        print(f"❌ コンテンツ解析エラー: {e}")
        return None

def save_article_files(article_data, article_id):
    """記事ファイルを保存"""
    article_dir = BLOG_POSTS_DIR / article_id
    images_dir = BLOG_IMAGES_DIR / article_id
    
    # ディレクトリ作成
    article_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # 日本語マークダウンファイル
    if article_data["markdown"]:
        ja_file = article_dir / "ja.md"
        with open(ja_file, "w", encoding="utf-8") as f:
            f.write(article_data["markdown"])
        print(f"✅ 日本語記事を保存: {ja_file}")
        
        # sentenceタグの統計表示
        validation = validate_sentence_tags(article_data["markdown"])
        print(f"📊 sentenceタグ統計: {validation['total_tags']}個")
    
    # meta.jsonファイル
    if article_data["meta_json"]:
        meta_file = article_dir / "meta.json"
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(article_data["meta_json"], f, ensure_ascii=False, indent=2)
        print(f"✅ メタデータを保存: {meta_file}")
    
    # captions.jsonファイル
    if article_data["captions_json"]:
        captions_file = images_dir / "captions.json"
        with open(captions_file, "w", encoding="utf-8") as f:
            json.dump(article_data["captions_json"], f, ensure_ascii=False, indent=2)
        print(f"✅ 画像キャプションを保存: {captions_file}")
    
    return article_dir
    
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
    """メイン実行関数"""
    parser = argparse.ArgumentParser(description="記事生成システム（左右対訳対応版）")
    parser.add_argument("--idea-id", help="使用するアイディアのID")
    parser.add_argument("--custom-title", help="カスタムタイトル")
    parser.add_argument("--list", action="store_true", help="利用可能なアイディア一覧を表示")
    
    args = parser.parse_args()
    
    print("🚀 記事生成システム（左右対訳対応版）")
    print("=" * 50)
    
    if args.list:
        list_available_ideas()
        return
    
    # ディレクトリ確認
    ensure_directories()
    
    # Claude APIクライアント初期化
    client = get_anthropic_client()
    if not client:
        return
    
    # アイディアの準備
    if args.custom_title:
        idea = {
            "id": f"custom-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "title": {"ja": args.custom_title},
            "category": "カスタム",
            "target_audience": "一般",
            "key_points": ["カスタム記事"],
            "estimated_word_count": 3000
        }
    elif args.idea_id:
        ideas_data = load_ideas()
        if not ideas_data:
            return
        
        idea = find_idea_by_id(ideas_data, args.idea_id)
        if not idea:
            print(f"❌ アイディアID '{args.idea_id}' が見つかりません")
            list_available_ideas()
            return
    else:
        print("❌ --idea-id または --custom-title を指定してください")
        list_available_ideas()
        return
    
    # 記事生成
    article_data = generate_article_content(client, idea)
    if not article_data:
        print("❌ 記事生成に失敗しました")
        return
    
    # ファイル保存
    article_dir = save_article_files(article_data, idea["id"])
    
    print(f"\n🎉 記事生成完了!")
    print(f"📁 保存先: {article_dir}")
    print(f"� 左右対訳ページで確認:")
    print(f"   http://localhost:3001/ja/compare/{idea['id']}?left=ja&right=en")
    print(f"\n📝 次のステップ:")
    print(f"   1. translator.py で多言語化")
    print(f"   2. image_generator.py で画像生成")

if __name__ == "__main__":
    main()
