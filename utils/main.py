#!/usr/bin/env python3
"""
記事自動作成システム - メインスクリプト

使用方法:
    python main.py ideas                    # アイディア生成
    python main.py generate 006             # 記事生成
    python main.py translate 006            # 翻訳
    python main.py images 006               # 画像生成
    python main.py validate 006             # 検証
    python main.py full 006                 # 翻訳〜検証まで一括実行
"""

import sys
import subprocess
import argparse
from pathlib import Path

# utilsディレクトリのパス
UTILS_DIR = Path(__file__).parent

def run_script(script_name, args=None):
    """指定されたPythonスクリプトを実行"""
    script_path = UTILS_DIR / script_name
    
    if not script_path.exists():
        print(f"❌ スクリプトが見つかりません: {script_path}")
        return False
    
    cmd = [sys.executable, str(script_path)]
    if args:
        cmd.extend(args)
    
    try:
        result = subprocess.run(cmd, cwd=UTILS_DIR, check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"❌ スクリプト実行エラー: {e}")
        return False

def generate_ideas(theme=None):
    """アイディア生成"""
    print("🚀 アイディア生成を開始...")
    
    args = ["--save"]
    if theme:
        args.extend(["--theme", theme])
    
    return run_script("idea_generator.py", args)

def generate_article(idea_id):
    """記事生成"""
    print(f"📝 記事生成を開始... (ID: {idea_id})")
    
    args = ["--idea-id", idea_id]
    return run_script("article_generator.py", args)

def translate_article(article_id, languages=None):
    """記事翻訳"""
    print(f"🌏 記事翻訳を開始... (ID: {article_id})")
    
    args = ["--article-id", article_id]
    if languages:
        args.extend(["--languages"] + languages)
    
    return run_script("translator.py", args)

def generate_images(article_id, service="dalle"):
    """画像生成"""
    print(f"🖼️  画像生成を開始... (ID: {article_id}, service: {service})")
    
    args = ["--article-id", article_id, "--service", service]
    return run_script("image_generator.py", args)

def validate_article(article_id, fix=False):
    """記事検証"""
    print(f"🔍 記事検証を開始... (ID: {article_id})")
    
    args = ["--article-id", article_id]
    if fix:
        args.append("--fix")
    
    return run_script("validator.py", args)

def full_pipeline(article_id):
    """記事生成〜検証まで一括実行"""
    print(f"🔄 フルパイプライン実行... (ID: {article_id})")
    print("=" * 50)
    
    steps = [
        ("記事生成", lambda: generate_article(article_id)),
        ("翻訳", lambda: translate_article(article_id)),
        ("画像生成", lambda: generate_images(article_id)),
        ("検証", lambda: validate_article(article_id, fix=True))
    ]
    
    for step_name, step_func in steps:
        print(f"\n🔄 {step_name}を実行中...")
        try:
            success = step_func()
            if not success:
                print(f"❌ {step_name}に失敗しました。パイプラインを停止します。")
                print(f"🛑 後続の処理をスキップして終了します。")
                return False
            print(f"✅ {step_name}が完了しました。")
        except Exception as e:
            print(f"❌ {step_name}でエラーが発生しました: {e}")
            print(f"🛑 後続の処理をスキップして終了します。")
            return False
    
    print("\n🎉 フルパイプラインが完了しました！")
    return True

def main():
    parser = argparse.ArgumentParser(
        description="記事自動作成システム",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python main.py ideas                      # アイディア生成
  python main.py ideas --theme "AI教育"     # テーマ指定でアイディア生成
  python main.py generate 006              # ID 006 の記事生成
  python main.py translate 006             # ID 006 の記事翻訳
  python main.py images 006                # ID 006 の画像生成
  python main.py validate 006              # ID 006 の記事検証
  python main.py full 006                  # ID 006 の翻訳〜検証まで一括実行
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="実行するコマンド")
    
    # アイディア生成
    ideas_parser = subparsers.add_parser("ideas", help="記事アイディアを生成")
    ideas_parser.add_argument("--theme", help="アイディア生成のテーマ")
    
    # 記事生成
    generate_parser = subparsers.add_parser("generate", help="記事を生成")
    generate_parser.add_argument("idea_id", help="使用するアイディアID")
    
    # 翻訳
    translate_parser = subparsers.add_parser("translate", help="記事を翻訳")
    translate_parser.add_argument("article_id", help="翻訳する記事ID")
    translate_parser.add_argument("--languages", nargs="+", help="翻訳先言語")
    
    # 画像生成
    images_parser = subparsers.add_parser("images", help="画像を生成")
    images_parser.add_argument("article_id", help="画像を生成する記事ID")
    images_parser.add_argument("--service", default="dalle", help="画像生成サービス")
    
    # 検証
    validate_parser = subparsers.add_parser("validate", help="記事を検証")
    validate_parser.add_argument("article_id", help="検証する記事ID")
    validate_parser.add_argument("--fix", action="store_true", help="問題を自動修正")
    
    # フルパイプライン
    full_parser = subparsers.add_parser("full", help="翻訳〜検証まで一括実行")
    full_parser.add_argument("article_id", help="処理する記事ID")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    print("🤖 記事自動作成システム")
    print(f"🔧 コマンド: {args.command}")
    print("-" * 50)
    
    success = False
    
    if args.command == "ideas":
        success = generate_ideas(args.theme)
        
    elif args.command == "generate":
        success = generate_article(args.idea_id)
        
    elif args.command == "translate":
        success = translate_article(args.article_id, args.languages)
        
    elif args.command == "images":
        success = generate_images(args.article_id, args.service)
        
    elif args.command == "validate":
        success = validate_article(args.article_id, args.fix)
        
    elif args.command == "full":
        success = full_pipeline(args.article_id)
    
    if success:
        print("\n✅ 処理が正常に完了しました！")
    else:
        print("\n❌ 処理に失敗しました。")
        sys.exit(1)

if __name__ == "__main__":
    main()
