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
import requests
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io
import os
from typing import Optional, Dict, Any, List

try:
    import openai
except ImportError:
    openai = None

# 設定ファイルをインポート
from config import (
    BLOG_IMAGES_DIR,
    BLOG_POSTS_DIR,
    get_api_key
)

class UnsplashImageGenerator:
    def __init__(self):
        self.access_key = get_api_key("UNSPLASH_ACCESS_KEY")
        self.base_url = "https://api.unsplash.com"
    
    def search_and_download_image(self, keyword, filename, width=1200, height=800) -> Dict[str, Any]:
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

class DalleImageGenerator:
    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key: Optional[str] = api_key or get_api_key("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI APIキーが設定されてないよ！環境変数OPENAI_API_KEYをセットしてね！")
        try:
            import openai
            self.openai = openai
        except ImportError:
            raise ImportError("openaiパッケージが入ってない！pip install openai してね！")
        self.openai.api_key = str(self.api_key)

    def generate_and_download_image(
        self, prompt: str, filename: str, width: int = 1792, height: int = 1024
    ) -> Dict[str, Any]:
        try:
            print(f"🧠 DALL·E 3で画像生成中...\nPrompt: {prompt}")
            response = self.openai.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size=f"{width}x{height}",
                quality="standard",
                response_format="url"
            )
            image_url: str = response.data[0].url
            img_response = requests.get(image_url)
            if img_response.status_code == 200:
                with open(filename, 'wb') as f:
                    f.write(img_response.content)
                print(f"✅ DALL·E画像保存完了: {filename}")
                return {
                    "success": True,
                    "dalle_url": image_url,
                    "source": "OpenAI DALL·E 3",
                    "prompt": prompt
                }
            else:
                print(f"❌ DALL·E画像ダウンロード失敗: {img_response.status_code}")
                return {"success": False, "error": "DALL·E画像ダウンロード失敗"}
        except Exception as e:
            print(f"❌ DALL·E生成エラー: {str(e)}")
            return {"success": False, "error": str(e)}


def load_captions_data(article_id: str) -> Dict[str, Any]:
    """captions.jsonを読み込み"""
    images_dir = BLOG_IMAGES_DIR / article_id
    captions_path = images_dir / "captions.json"
    
    if not captions_path.exists():
        return {}
    
    with open(captions_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_english_content(article_id: str) -> Dict[str, Any]:
    """英語コンテンツ（en.md, meta.json）を読み込み"""
    posts_dir = BLOG_POSTS_DIR / article_id
    en_md_path = posts_dir / "en.md"
    meta_json_path = posts_dir / "meta.json"
    
    content_data: Dict[str, Any] = {}
    
    # en.mdを読み込み
    if en_md_path.exists():
        with open(en_md_path, "r", encoding="utf-8") as f:
            content_data["en_md"] = f.read()
    
    # meta.jsonを読み込み
    if meta_json_path.exists():
        with open(meta_json_path, "r", encoding="utf-8") as f:
            content_data["meta"] = json.load(f)
    
    return content_data

def create_search_query(
    english_content: Dict[str, Any], image_key: str, caption_data: Dict[str, Any]
) -> str:
    """英語コンテンツとキャプション情報から検索クエリを作成"""
    query_parts: list[str] = []
    
    # 記事タイトルから重要な部分を抽出（短縮）
    title: str = english_content.get("title", "")
    if title:
        # タイトルを適度な長さに制限（最初の5-6語程度）
        title_words: list[str] = title.split()[:6]
        title_short: str = " ".join(title_words)
        query_parts.append(title_short)
    
    # caption.enのalt textを追加
    en_alt: str = caption_data.get("alt", {}).get("en", "")
    if en_alt:
        query_parts.append(en_alt)
    
    # caption.enのcaptionを追加（alt textと異なる場合）
    en_caption: str = caption_data.get("caption", {}).get("en", "")
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

def generate_image_prompt(image_key: str, caption_data: Dict[str, Any]) -> str:
    """画像生成用のプロンプトを作成（両形式対応）"""
    prompt_parts: list[str] = []
    
    # 新形式（直接言語キー）への対応
    if "en" in caption_data and isinstance(caption_data["en"], str):
        prompt_parts.append(caption_data["en"])
        print(f"🔍 新形式のキャプション使用: {caption_data['en']}")
    # 旧形式（alt/caption構造）への対応  
    elif "alt" in caption_data or "caption" in caption_data:
        try: 
            en_alt: str = caption_data.get("alt", {}).get("en", "")
            en_caption: str = caption_data.get("caption", {}).get("en", "")
            if en_alt:
                prompt_parts.append(en_alt)
            if en_caption and en_caption != en_alt:
                prompt_parts.append(f"Context: {en_caption}")
            print(f"🔍 旧形式のキャプション使用: alt={en_alt}, caption={en_caption}")
        except AttributeError:
            # alt/captionがディクショナリでない場合のフォールバック
            prompt_parts.append("AI learning concept")
            print(f"⚠️  キャプション形式が不正、デフォルト使用")
    else:
        # どちらの形式でもない場合のフォールバック
        prompt_parts.append("Educational concept illustration")
        print(f"⚠️  キャプションが見つからない、デフォルト使用")
        
    # 画像の種類に応じたスタイル指定
    if "hero" in image_key.lower():
        prompt_parts.append("Hero image, modern, clean, web design")
    elif "dashboard" in image_key.lower():
        prompt_parts.append("Dashboard interface, data visualization")
    elif "chart" in image_key.lower() or "graph" in image_key.lower():
        prompt_parts.append("Chart, graph, data visualization")
    elif "diagram" in image_key.lower():
        prompt_parts.append("Diagram, flowchart, process illustration")
    
    prompt: str = " | ".join(filter(None, prompt_parts))
    print(f"🎨 生成プロンプト: {prompt}")
    return prompt

def generate_with_unsplash(article_id: str, captions_data: Dict[str, Any]) -> list[str]:
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

def generate_with_dalle(article_id: str, captions_data: Dict[str, Any]) -> List[str]:
    """OpenAI DALL·E 3 APIで画像生成（プロンプトベース）"""
    generator = DalleImageGenerator()
    images_dir = BLOG_IMAGES_DIR / article_id
    images_dir.mkdir(parents=True, exist_ok=True)
    generated_images: List[str] = []
    updated_captions: Dict[str, Any] = {}

    for image_key, caption_data in captions_data.items():
        if not image_key.endswith((".jpg", ".jpeg", ".png")):
            continue
        print(f"🖼️  DALL·E処理中: {image_key}")
        prompt: str = generate_image_prompt(image_key, caption_data)
        image_file = images_dir / image_key
        result = generator.generate_and_download_image(prompt, str(image_file))
        if result["success"]:
            generated_images.append(str(image_file))
            updated_captions[image_key] = {
                **caption_data,
                "source": "OpenAI DALL·E 3",
                "dalle_url": result["dalle_url"],
                "prompt": prompt
            }
            print(f"✅ {image_key} DALL·E生成完了！")
        else:
            print(f"❌ {image_key} DALL·E生成失敗: {result['error']}")
            raise RuntimeError(f"DALL·E画像生成に失敗: {image_key} - {result['error']}")

    captions_file = images_dir / "captions.json"
    with open(captions_file, "w", encoding="utf-8") as f:
        json.dump(updated_captions, f, ensure_ascii=False, indent=2)
    return generated_images

def generate_images(article_id: str, service: str = "dalle") -> List[str]:
    """画像生成のメイン関数"""
    print(f"🎨 記事 {article_id} の画像生成を開始... (service={service})")
    captions_data = load_captions_data(article_id)
    if service == "unsplash":
        return generate_with_unsplash(article_id, captions_data)
    elif service == "dalle":
        return generate_with_dalle(article_id, captions_data)
    else:
        raise ValueError(f"❌ 未対応のサービス: {service}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="画像生成システム")
    parser.add_argument("--article-id", required=True, help="記事ID")
    parser.add_argument("--service", default="dalle", choices=["dalle", "unsplash"], help="画像生成サービス (dalle or unsplash)")
    args = parser.parse_args()
    result = generate_images(args.article_id, args.service)
    print(f"✅ 生成完了: {len(result)} 枚の画像")
