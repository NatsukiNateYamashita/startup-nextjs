#!/usr/bin/env python3
"""
Sentence Tag Injector for Compare Feature
========================================
左右対訳ページ対応のため、マークダウンファイルにsentenceタグ（<!-- s1 -->, <!-- s2 -->など）を自動挿入

使用方法:
    python add_sentence_tags.py

機能:
- マークダウンファイルのH1, H2, H3, 段落, リストに自動でsentenceタグを挿入
- 既存のsentenceタグがある場合はスキップ
- フロントマターは保持
- バックアップファイル作成
"""

import os
import re
import shutil
from pathlib import Path
from typing import List, Tuple

def backup_file(file_path: Path) -> Path:
    """ファイルのバックアップを作成"""
    backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")
    shutil.copy2(file_path, backup_path)
    print(f"📁 バックアップ作成: {backup_path}")
    return backup_path

def extract_frontmatter_and_content(text: str) -> Tuple[str, str]:
    """フロントマターとコンテンツを分離"""
    if text.startswith('---\n'):
        # フロントマターを検出
        parts = text.split('---\n', 2)
        if len(parts) >= 3:
            frontmatter = f"---\n{parts[1]}---\n"
            content = parts[2]
            return frontmatter, content
    return "", text

def has_sentence_tags(content: str) -> bool:
    """既にsentenceタグが含まれているかチェック"""
    return bool(re.search(r'<!--\s*s\d+\s*-->', content))

def add_sentence_tags_to_content(content: str) -> str:
    """コンテンツにsentenceタグを追加"""
    if has_sentence_tags(content):
        print("⚠️  既にsentenceタグが存在します。スキップします。")
        return content
    
    lines = content.split('\n')
    result = []
    tag_counter = 1
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # 空行はそのまま追加
        if not stripped:
            result.append(line)
            continue
        
        # sentenceタグを追加する条件をチェック
        should_add_tag = False
        
        # H1, H2, H3見出し
        if re.match(r'^#{1,3}\s+', stripped):
            should_add_tag = True
        
        # 段落（文字で始まる行、コードブロックや特殊記号以外）
        elif re.match(r'^[^\-\*\`\#\|\<\>]', stripped) and not stripped.startswith('```'):
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
        elif stripped.startswith('```') and not any('```' in lines[j] for j in range(max(0, i-3), i)):
            should_add_tag = True
        
        if should_add_tag:
            result.append(f"<!-- s{tag_counter} -->")
            result.append(line)
            tag_counter += 1
        else:
            result.append(line)
    
    return '\n'.join(result)

def process_markdown_file(file_path: Path) -> bool:
    """マークダウンファイルを処理"""
    try:
        print(f"\n🔄 処理中: {file_path}")
        
        # ファイル読み込み
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # フロントマターとコンテンツを分離
        frontmatter, content = extract_frontmatter_and_content(original_content)
        
        # sentenceタグの追加
        processed_content = add_sentence_tags_to_content(content)
        
        # 変更があった場合のみ保存
        final_content = frontmatter + processed_content
        if final_content != original_content:
            # バックアップ作成
            backup_file(file_path)
            
            # 新しいコンテンツを保存
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(final_content)
            
            print(f"✅ 更新完了: {file_path}")
            return True
        else:
            print(f"ℹ️  変更なし: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ エラー: {file_path} - {e}")
        return False

def find_blog_posts() -> List[Path]:
    """ブログ記事のマークダウンファイルを検索"""
    blog_dir = Path("../src/content/blog/posts")
    if not blog_dir.exists():
        # utilsディレクトリから実行された場合の相対パス調整
        blog_dir = Path("./src/content/blog/posts")
        if not blog_dir.exists():
            blog_dir = Path("src/content/blog/posts")
    
    markdown_files = []
    if blog_dir.exists():
        for post_dir in blog_dir.iterdir():
            if post_dir.is_dir():
                for md_file in post_dir.glob("*.md"):
                    markdown_files.append(md_file)
    
    return sorted(markdown_files)

def main():
    """メイン実行関数"""
    print("🚀 Sentence Tag Injector for Compare Feature")
    print("=" * 50)
    
    # ブログ記事を検索
    markdown_files = find_blog_posts()
    
    if not markdown_files:
        print("❌ マークダウンファイルが見つかりません。")
        print("   src/content/blog/posts/ ディレクトリを確認してください。")
        return
    
    print(f"📝 見つかった記事: {len(markdown_files)}件")
    
    # 各ファイルを処理
    updated_count = 0
    for file_path in markdown_files:
        if process_markdown_file(file_path):
            updated_count += 1
    
    print(f"\n🎉 処理完了!")
    print(f"   更新されたファイル: {updated_count}件")
    print(f"   総ファイル数: {len(markdown_files)}件")
    
    if updated_count > 0:
        print(f"\n💡 左右対訳ページでの確認:")
        print(f"   http://localhost:3003/ja/compare/[slug]?left=ja&right=en")

if __name__ == "__main__":
    main()
