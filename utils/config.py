"""
記事自動作成システム - 設定ファイル

このファイルには API キーやディレクトリパスなどの設定を管理します。
"""

import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

BASE_DIR = Path(__file__).parent.parent
BLOG_POSTS_DIR = BASE_DIR / "src" / "content" / "blog" / "posts"
BLOG_IMAGES_DIR = BASE_DIR / "public" / "images" / "blog"
BLOG_INDEX_FILE = BASE_DIR / "src" / "content" / "blog" / "index.json"
UTILS_DIR = BASE_DIR / "utils"
PROMPTS_DIR = UTILS_DIR / "prompts"
IDEAS_FILE = UTILS_DIR / "generated_ideas.json"

SUPPORTED_LANGUAGES = {
    "ja": "日本語",
    "en": "English",
    "zh-CN": "中文(简体)",
    "zh-TW": "中文(繁體)"
}

DEFAULT_AUTHOR_ID = "nihongo-ai"
ARTICLE_ID_PREFIX = ""

def get_api_key(key_name: str) -> str:
    """環境変数からAPIキーを取得"""
    v = os.getenv(key_name)
    if not v:
        raise ValueError(f"環境変数 {key_name} が設定されていません")
    return v

def ensure_directories():
    """必要なディレクトリが存在することを確認"""
    for d in [BLOG_POSTS_DIR, BLOG_IMAGES_DIR, PROMPTS_DIR]:
        d.mkdir(parents=True, exist_ok=True)

def get_anthropic_client():
    """Anthropic クライアントを取得"""
    try:
        import anthropic
        return anthropic.Anthropic(api_key=get_api_key("ANTHROPIC_API_KEY"))
    except ImportError:
        print("❌ anthropic パッケージがインストールされていません。pip install anthropic してね！")
        return None
