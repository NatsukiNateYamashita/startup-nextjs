"""
記事自動作成システム - 設定ファイル

このファイルには API キーやディレクトリパスなどの設定を管理します。
"""

import os
from pathlib import Path

# .envファイルを読み込み
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # python-dotenvがインストールされていない場合はスキップ
    pass

# プロジェクトのベースディレクトリ
BASE_DIR = Path(__file__).parent.parent

# Anthropic API設定
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("環境変数 ANTHROPIC_API_KEY が設定されていません")

# ディレクトリパス設定
BLOG_POSTS_DIR = BASE_DIR / "src" / "content" / "blog" / "posts"
BLOG_IMAGES_DIR = BASE_DIR / "public" / "images" / "blog" 
BLOG_INDEX_FILE = BASE_DIR / "src" / "content" / "blog" / "index.json"
UTILS_DIR = BASE_DIR / "utils"
PROMPTS_DIR = UTILS_DIR / "prompts"
IDEAS_FILE = UTILS_DIR / "generated_ideas.json"

# サポートする言語
SUPPORTED_LANGUAGES = {
    "ja": "日本語",
    "en": "English", 
    "zh-CN": "中文(简体)",
    "zh-TW": "中文(繁體)"
}

# デフォルト作者ID
DEFAULT_AUTHOR_ID = "nihongo-ai"

# 記事ID生成用設定
ARTICLE_ID_PREFIX = ""  # 必要に応じて接頭辞を設定

def get_anthropic_client():
    """Anthropic クライアントを取得"""
    try:
        import anthropic
        return anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    except ImportError:
        print("❌ anthropic パッケージがインストールされていません。")
        print("次のコマンドでインストールしてください: pip install anthropic")
        return None

def ensure_directories():
    """必要なディレクトリが存在することを確認"""
    directories = [
        BLOG_POSTS_DIR,
        BLOG_IMAGES_DIR,
        PROMPTS_DIR
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        
def validate_config():
    """設定の妥当性をチェック"""
    if not ANTHROPIC_API_KEY:
        print("❌ ANTHROPIC_API_KEY が設定されていません")
        return False
        
    if not BASE_DIR.exists():
        print(f"❌ ベースディレクトリが見つかりません: {BASE_DIR}")
        return False
        
    return True

if __name__ == "__main__":
    # 設定テスト
    print("🔧 設定ファイルのテスト中...")
    
    if validate_config():
        print("✅ 設定は有効です")
        ensure_directories()
        print("✅ 必要なディレクトリを作成/確認しました")
        
        client = get_anthropic_client()
        if client:
            print("✅ Anthropic クライアントが正常に初期化されました")
        else:
            print("❌ Anthropic クライアントの初期化に失敗しました")
    else:
        print("❌ 設定に問題があります")
