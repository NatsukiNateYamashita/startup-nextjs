#!/usr/bin/env python3
"""
記事生成システム（左右対訳対応版）

新機能:
- sentenceタグ自動挿入
- 多言語間のsentenceタグID整合性チェック
- 左右対訳ページ対応記事生成

使用方法:
    python article_generator_v2.py --idea-id "010"
    python article_generator_v2.py --custom-title "カスタムタイトル"
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
    DEFAULT_AUTHOR_ID,
    ensure_directories
)

def load_prompt_template():
    """記事生成プロンプトテンプレートを読み込み（左右対訳対応版）"""
    # 新しいsentenceタグ対応プロンプトを優先的に使用
    prompt_file = PROMPTS_DIR / "article_generation_with_sentence_tags.md"
    
    if not prompt_file.exists():
        print(f"❌ プロンプトファイルが見つかりません: {prompt_file}")
        return None
        
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read()

def validate_sentence_tags(content: str) -> dict:
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
        markdown_match = re.search(r'```markdown\s*\n(.*?)\n```', content, re.DOTALL)
        if markdown_match:
            result["markdown"] = markdown_match.group(1).strip()
            
            # sentenceタグの自動挿入
            result["markdown"] = inject_sentence_tags(result["markdown"])
        
        # meta.json部分を抽出
        meta_match = re.search(r'```json\s*\n(\{.*?"authorId".*?\})\s*\n```', content, re.DOTALL)
        if meta_match:
            try:
                result["meta_json"] = json.loads(meta_match.group(1))
            except json.JSONDecodeError:
                print("⚠️  meta.json のパースに失敗しました")
        
        # captions.json部分を抽出
        captions_match = re.search(r'```json\s*\n(\{.*?"ja":.*?\})\s*\n```', content, re.DOTALL)
        if captions_match:
            try:
                result["captions_json"] = json.loads(captions_match.group(1))
            except json.JSONDecodeError:
                print("⚠️  captions.json のパースに失敗しました")
        
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

def main():
    """メイン実行関数"""
    parser = argparse.ArgumentParser(description="記事生成システム（左右対訳対応版）")
    parser.add_argument("--idea-id", help="使用するアイディアのID")
    parser.add_argument("--custom-title", help="カスタムタイトル")
    
    args = parser.parse_args()
    
    print("🚀 記事生成システム（左右対訳対応版）")
    print("=" * 50)
    
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
        ideas = json.load(open(IDEAS_FILE, "r", encoding="utf-8"))
        idea = next((i for i in ideas["ideas"] if i["id"] == args.idea_id), None)
        if not idea:
            print(f"❌ アイディアID '{args.idea_id}' が見つかりません")
            return
    else:
        print("❌ --idea-id または --custom-title を指定してください")
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
    print(f"💡 左右対訳ページで確認:")
    print(f"   http://localhost:3003/ja/compare/{idea['id']}?left=ja&right=en")
    print(f"\n📝 次のステップ:")
    print(f"   1. translator.py で多言語化")
    print(f"   2. image_generator.py で画像生成")

if __name__ == "__main__":
    main()
