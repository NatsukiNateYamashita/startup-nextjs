#!/usr/bin/env python3
"""
記事アイディア生成システム

使用方法:
    python idea_generator.py
    python idea_generator.py --theme "AI教育"
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
    ensure_directories
)

def load_prompt_template():
    """プロンプトテンプレートを読み込み"""
    prompt_file = PROMPTS_DIR / "idea_generation.md"
    
    if not prompt_file.exists():
        print(f"❌ プロンプトファイルが見つかりません: {prompt_file}")
        return None
        
    with open(prompt_file, "r", encoding="utf-8") as f:
        return f.read()

def load_existing_ideas():
    """既存のアイディアを読み込み"""
    if IDEAS_FILE.exists():
        with open(IDEAS_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print("⚠️  既存のアイディアファイルの形式が不正です。新規作成します。")
                return {"ideas": [], "generated_at": []}
    else:
        return {"ideas": [], "generated_at": []}

def save_ideas(ideas_data):
    """アイディアをファイルに保存"""
    ensure_directories()
    
    with open(IDEAS_FILE, "w", encoding="utf-8") as f:
        json.dump(ideas_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ アイディアを保存しました: {IDEAS_FILE}")

def get_next_article_id(existing_ideas):
    """次の記事IDを生成"""
    if not existing_ideas["ideas"]:
        return "006"
    
    # 既存IDから最大値を取得
    max_id = 0
    for idea in existing_ideas["ideas"]:
        try:
            id_num = int(idea["id"].split("-")[0])
            max_id = max(max_id, id_num)
        except (ValueError, IndexError):
            continue
    
    return f"{max_id + 1:03d}"

def generate_ideas(theme="日本語教育・AI・技術関連のトピック"):
    """Anthropic APIを使ってアイディアを生成"""
    
    print("🤖 アイディア生成中...")
    
    # Anthropicクライアントを取得
    client = get_anthropic_client()
    if not client:
        return None
    
    # プロンプトテンプレートを読み込み
    prompt_template = load_prompt_template()
    if not prompt_template:
        return None
    
    # 既存アイディアを読み込み
    existing_ideas = load_existing_ideas()
    next_id = get_next_article_id(existing_ideas)
    
    # プロンプトにテーマを挿入
    prompt = prompt_template.replace("{theme_input}", theme)
    prompt += f"\n\n※ 記事IDは {next_id} から開始してください。"
    
    try:
        # API呼び出し
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            # model="claude-sonnet-4-20250514",
            max_tokens=4000,
            temperature=0.7,
            messages=[
                {
                    "role": "user", 
                    "content": prompt
                }
            ]
        )
        
        # レスポンスからJSONを抽出
        content = response.content[0].text
        
        # JSON部分を抽出（```json ``` で囲まれている場合）
        json_start = content.find("```json")
        if json_start != -1:
            json_start = content.find("{", json_start)
            json_end = content.rfind("}")
            if json_end != -1:
                json_content = content[json_start:json_end + 1]
                try:
                    new_ideas = json.loads(json_content)
                    return new_ideas
                except json.JSONDecodeError as e:
                    print(f"❌ JSON解析エラー: {e}")
                    print("生成された内容:")
                    print(content)
                    return None
        else:
            # JSON部分を直接探す
            json_start = content.find("{")
            json_end = content.rfind("}")
            if json_start != -1 and json_end != -1:
                json_content = content[json_start:json_end + 1]
                try:
                    new_ideas = json.loads(json_content)
                    return new_ideas
                except json.JSONDecodeError as e:
                    print(f"❌ JSON解析エラー: {e}")
                    return None
        
        print("❌ JSONフォーマットが見つかりませんでした")
        print("生成された内容:")
        print(content)
        return None
        
    except Exception as e:
        print(f"❌ API呼び出しエラー: {e}")
        return None

def display_ideas(ideas_data):
    """生成されたアイディアを表示"""
    if not ideas_data or "ideas" not in ideas_data:
        print("❌ アイディアデータが無効です")
        return
    
    print("\n" + "="*60)
    print("🎯 生成されたブログ記事アイディア")
    print("="*60)
    
    for i, idea in enumerate(ideas_data["ideas"], 1):
        print(f"\n【{i}】 ID: {idea.get('id', 'N/A')}")
        print(f"📝 タイトル（日）: {idea.get('title', {}).get('ja', 'N/A')}")
        print(f"📝 タイトル（英）: {idea.get('title', {}).get('en', 'N/A')}")
        print(f"🏷️  カテゴリ: {idea.get('category', 'N/A')}")
        print(f"👥 ターゲット: {idea.get('target_audience', 'N/A')}")
        print(f"📊 難易度: {idea.get('difficulty_level', 'N/A')}")
        print(f"📏 推定文字数: {idea.get('estimated_word_count', 'N/A')}")
        
        if 'key_points' in idea:
            print("🔑 主要ポイント:")
            for point in idea['key_points']:
                print(f"   • {point}")
        
        if 'seo_keywords' in idea:
            print(f"🔍 SEOキーワード: {', '.join(idea['seo_keywords'])}")

def main():
    parser = argparse.ArgumentParser(description="ブログ記事のアイディアを生成します")
    parser.add_argument(
        "--theme", 
        default="日本語教育・AI・技術関連のトピック",
        help="アイディア生成のテーマ"
    )
    parser.add_argument(
        "--save",
        action="store_true",
        help="生成したアイディアを保存する"
    )
    
    args = parser.parse_args()
    
    print("🚀 記事アイディア生成システム")
    print(f"📋 テーマ: {args.theme}")
    print("-" * 50)
    
    # アイディア生成
    new_ideas = generate_ideas(args.theme)
    
    if new_ideas:
        # アイディア表示
        display_ideas(new_ideas)
        
        # 保存確認
        if args.save:
            save_choice = "y"
        else:
            save_choice = input("\n💾 これらのアイディアを保存しますか？ (y/n): ").strip().lower()
        
        if save_choice in ['y', 'yes', 'はい']:
            # 既存データに追加
            existing_data = load_existing_ideas()
            existing_data["ideas"].extend(new_ideas["ideas"])
            existing_data["generated_at"].append({
                "timestamp": datetime.now().isoformat(),
                "theme": args.theme,
                "count": len(new_ideas["ideas"])
            })
            
            save_ideas(existing_data)
            
            print(f"\n✅ {len(new_ideas['ideas'])}個のアイディアを保存しました！")
            print("次は article_generator.py を使って記事を生成できます。")
        else:
            print("💡 アイディアは保存されませんでした。")
    else:
        print("❌ アイディアの生成に失敗しました。")

if __name__ == "__main__":
    main()
