#!/usr/bin/env python3
"""
画像生成システム

注意: このスクリプトは画像生成API（DALL-E、Stable Diffusion、Unsplash等）の実装例です。
実際の使用には適切な画像生成APIサービスとの連携が必要です。

使用方法:
    python image_generator.py --article-id "006"
    python image_generator.py --article-id "006" --service "unsplash"
"""

import json
import argparse
import requests
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io

# 設定ファイルをインポート
from config import (
    BLOG_IMAGES_DIR,
    BLOG_POSTS_DIR,
    get_anthropic_client
)

# Unsplash API設定
UNSPLASH_ACCESS_KEY = "FC3pujO19B3C3e3RMxdV874S3Iz6IOjdnYbb3FvZoo0"
UNSPLASH_SECRET_KEY = "MbqDJbWyD2X_SWHkQukMPdBH4be7AfytJsLe2GkyDTI"

class UnsplashImageGenerator:
    def __init__(self):
        self.access_key = UNSPLASH_ACCESS_KEY
        self.base_url = "https://api.unsplash.com"
    
    def search_and_download_image(self, keyword, filename, width=1200, height=800):
        """Unsplashから画像を検索してダウンロード"""
        try:
            search_url = f"{self.base_url}/photos/random"
            params = {
                "query": keyword,
                "orientation": "landscape",
                "w": width,
                "h": height,
                "content_filter": "high"
            }
            
            headers = {
                "Authorization": f"Client-ID {self.access_key}"
            }
            
            print(f"🔍 '{keyword}'で画像を検索中...")
            response = requests.get(search_url, params=params, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                image_url = data['urls']['regular']
                alt_description = data.get('alt_description', keyword)
                photographer = data['user']['name']
                
                print(f"📸 見つけた画像: {alt_description} by {photographer}")
                
                # 画像をダウンロード
                img_response = requests.get(image_url)
                if img_response.status_code == 200:
                    with open(filename, 'wb') as f:
                        f.write(img_response.content)
                    
                    print(f"✅ 画像保存完了: {filename}")
                    return {
                        "success": True,
                        "alt_description": alt_description,
                        "photographer": photographer,
                        "unsplash_url": data['links']['html']
                    }
                else:
                    print(f"❌ 画像ダウンロード失敗: {img_response.status_code}")
                    return {"success": False, "error": "画像ダウンロード失敗"}
            else:
                print(f"❌ API呼び出し失敗: {response.status_code}")
                print(f"エラー詳細: {response.text}")
                return {"success": False, "error": f"API error: {response.status_code}"}
                
        except Exception as e:
            print(f"❌ エラーが発生: {str(e)}")
            return {"success": False, "error": str(e)}

def load_captions_data(article_id):
    """captions.jsonを読み込み"""
    images_dir = BLOG_IMAGES_DIR / article_id
    captions_path = images_dir / "captions.json"
    
    if not captions_path.exists():
        raise FileNotFoundError(f"❌ captions.jsonが見つかりません: {captions_path}")
    
    try:
        with open(captions_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"❌ captions.jsonの読み込みエラー: {e}")

def load_english_content(article_id):
    """英語コンテンツ（en.md, meta.json）を読み込み"""
    posts_dir = BLOG_POSTS_DIR / article_id
    en_md_path = posts_dir / "en.md"
    meta_json_path = posts_dir / "meta.json"
    
    content_data = {
        "title": "",
        "content": "",
        "tags": []
    }
    
    # en.mdを読み込み
    if not en_md_path.exists():
        raise FileNotFoundError(f"❌ en.mdが見つかりません: {en_md_path}")
    
    try:
        with open(en_md_path, "r", encoding="utf-8") as f:
            en_content = f.read()
            
            # frontmatterからタイトルを抽出
            if en_content.startswith('---'):
                end_pos = en_content.find('---', 3)
                if end_pos != -1:
                    frontmatter = en_content[3:end_pos]
                    for line in frontmatter.split('\n'):
                        if line.startswith('title:'):
                            content_data["title"] = line.split(':', 1)[1].strip().strip('"\'')
                    
                    # 本文部分を取得
                    content_data["content"] = en_content[end_pos + 3:].strip()
    except Exception as e:
        raise IOError(f"❌ en.md読み込みエラー: {e}")
    
    # meta.jsonからタグを読み込み
    if not meta_json_path.exists():
        raise FileNotFoundError(f"❌ meta.jsonが見つかりません: {meta_json_path}")
    
    try:
        with open(meta_json_path, "r", encoding="utf-8") as f:
            meta_data = json.load(f)
            if "tags" in meta_data and "en" in meta_data["tags"]:
                content_data["tags"] = meta_data["tags"]["en"]
    except Exception as e:
        raise ValueError(f"❌ meta.json読み込みエラー: {e}")
    
    return content_data

def create_search_query(english_content, image_key, caption_data):
    """英語コンテンツとキャプション情報から検索クエリを作成"""
    query_parts = []
    
    # 記事タイトルから重要な部分を抽出（短縮）
    title = english_content.get("title", "")
    if title:
        # タイトルを適度な長さに制限（最初の5-6語程度）
        title_words = title.split()[:6]
        title_short = " ".join(title_words)
        query_parts.append(title_short)
    
    # caption.enのalt textを追加
    en_alt = caption_data.get("alt", {}).get("en", "")
    if en_alt:
        query_parts.append(en_alt)
    
    # caption.enのcaptionを追加（alt textと異なる場合）
    en_caption = caption_data.get("caption", {}).get("en", "")
    if en_caption and en_caption != en_alt:
        query_parts.append(en_caption)
    
    # meta.jsonのenタグを追加（最初の2-3個だけ）
    tags = english_content.get("tags", [])
    if tags:
        selected_tags = tags[:3]  # 最初の3個のタグのみ
        query_parts.extend(selected_tags)
    
    # クエリを結合して適度な長さに制限
    full_query = " ".join(query_parts)
    
    # 長すぎる場合は切り詰める（Unsplashの検索効率を考慮）
    words = full_query.split()
    if len(words) > 8:  # 8語以内に制限
        full_query = " ".join(words[:8])
    
    return full_query.strip()

def generate_image_prompt(image_key, caption_data):
    """画像生成用のプロンプトを作成"""
    ja_alt = caption_data.get("alt", {}).get("ja", "")
    ja_caption = caption_data.get("caption", {}).get("ja", "")
    en_alt = caption_data.get("alt", {}).get("en", "")
    
    # 英語の説明を優先し、日本語も参考にしてプロンプトを構築
    prompt_parts = []
    
    if en_alt:
        prompt_parts.append(en_alt)
    elif ja_alt:
        prompt_parts.append(f"Japanese education related: {ja_alt}")
    
    if ja_caption and ja_caption != ja_alt:
        prompt_parts.append(f"Context: {ja_caption}")
    
    # 画像の種類に応じたスタイル指定
    if "hero" in image_key.lower():
        style = "professional, modern, clean design, technology theme, educational"
    else:
        style = "clean, educational, illustrative, modern design"
    
    prompt = " | ".join(prompt_parts)
    full_prompt = f"{prompt} | Style: {style} | High quality, suitable for blog article"
    
    return full_prompt

def generate_with_unsplash(article_id, captions_data):
    """Unsplash APIを使って画像を生成（英語コンテンツベース）"""
    generator = UnsplashImageGenerator()
    images_dir = BLOG_IMAGES_DIR / article_id
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # 英語コンテンツを読み込み
    english_content = load_english_content(article_id)
    
    generated_images = []
    updated_captions = {}
    
    for image_key, caption_data in captions_data.items():
        if not image_key.endswith(('.jpg', '.jpeg', '.png')):
            continue
            
        print(f"🖼️  処理中: {image_key}")
        
        # 英語コンテンツとキャプションから検索クエリを生成
        search_query = create_search_query(english_content, image_key, caption_data)
        print(f"   検索クエリ: {search_query}")
        
        # 画像ファイルパス
        image_file = images_dir / image_key
        
        # Unsplashから画像をダウンロード
        result = generator.search_and_download_image(search_query, str(image_file))
        
        if result["success"]:
            generated_images.append(image_file)
            
            # キャプション情報を更新（写真家クレジット追加）
            updated_captions[image_key] = {
                **caption_data,
                "photographer": result["photographer"],
                "unsplash_url": result["unsplash_url"],
                "source": "Unsplash",
                "search_query": search_query  # 使用したクエリも保存
            }
            print(f"✅ {image_key} 生成完了！ by {result['photographer']}")
        else:
            print(f"❌ {image_key} 生成失敗: {result['error']}")
            raise RuntimeError(f"画像生成に失敗しました: {image_key} - {result['error']}")
    
    # 更新されたキャプション情報を保存
    captions_file = images_dir / "captions.json"
    with open(captions_file, "w", encoding="utf-8") as f:
        json.dump(updated_captions, f, ensure_ascii=False, indent=2)
    
    return generated_images

def generate_images(article_id, service="unsplash"):
    """画像生成のメイン関数"""
    print(f"🎨 記事 {article_id} の画像生成を開始...")
    
    # キャプション情報を読み込み
    captions_data = load_captions_data(article_id)
    
    # サービスに応じて画像生成
    if service == "unsplash":
        return generate_with_unsplash(article_id, captions_data)
    else:
        raise ValueError(f"❌ 未対応のサービス: {service}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="画像生成システム")
    parser.add_argument("--article-id", required=True, help="記事ID")
    parser.add_argument("--service", default="unsplash", choices=["unsplash"], help="画像生成サービス")
    
    args = parser.parse_args()
    
    result = generate_images(args.article_id, args.service)
    print(f"✅ 生成完了: {len(result)} 枚の画像")
  