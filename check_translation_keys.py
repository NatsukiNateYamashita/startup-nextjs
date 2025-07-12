#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
翻訳キーの使用状況をチェックするスクリプト
ja.jsonの各キーがコード内で実際に使われているかを確認し、使用されていないキーを特定します。
"""

import json
import re
import os
from pathlib import Path
from typing import Dict, List, Set

def load_translation_file(file_path: str) -> Dict:
    """翻訳ファイルを読み込み"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def flatten_keys(obj: Dict, prefix: str = "") -> Set[str]:
    """ネストしたオブジェクトのキーを平坦化"""
    keys = set()
    for key, value in obj.items():
        if prefix:
            full_key = f"{prefix}.{key}"
        else:
            full_key = key
            
        keys.add(full_key)
        
        if isinstance(value, dict):
            keys.update(flatten_keys(value, full_key))
            
    return keys

def find_translation_usages(src_dir: str) -> Set[str]:
    """ソースコード内の翻訳キー使用を検索"""
    used_keys = set()
    
    # TypeScriptとJavaScriptファイルを検索
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # useTranslations()の使用箇所を検索
                    translations_matches = re.findall(r'useTranslations\(["\']([^"\']+)["\']\)', content)
                    
                    # getTranslations()の使用箇所も検索
                    get_translations_matches = re.findall(r'getTranslations\(["\']([^"\']+)["\']\)', content)
                    
                    # ベースキー
                    base_keys = translations_matches + get_translations_matches
                    
                    # useTranslationsで指定されたベースキーを記録
                    for base_key in base_keys:
                        used_keys.add(base_key)
                        
                    # t()の使用箇所を検索（より厳密に）
                    # 文字列リテラルのパターンを改善
                    t_patterns = [
                        r't\([\s]*["\']([^"\']+)["\'][\s]*\)',  # t("key")
                        r't\([\s]*["`]([^"`]+)["`][\s]*\)',    # t(`key`)
                    ]
                    
                    t_keys = set()
                    for pattern in t_patterns:
                        matches = re.findall(pattern, content)
                        t_keys.update(matches)
                    
                    # ベースキーと組み合わせた形で使用されているキーを追加
                    for base_key in base_keys:
                        for t_key in t_keys:
                            # t_keyがすでに完全なパスの場合はそのまま
                            if '.' in t_key:
                                used_keys.add(t_key)
                            else:
                                # ベースキーと組み合わせ
                                combined_key = f"{base_key}.{t_key}"
                                used_keys.add(combined_key)
                    
                    # ベースキーがない場合のt()キーも追加
                    if not base_keys:
                        for t_key in t_keys:
                            used_keys.add(t_key)
                                
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
                    
    return used_keys

def analyze_translation_keys(ja_file: str, src_dir: str):
    """翻訳キーの使用状況を分析"""
    print("🔍 翻訳キーの使用状況を分析中...")
    
    # ja.jsonの翻訳キーを読み込み
    ja_translations = load_translation_file(ja_file)
    all_ja_keys = flatten_keys(ja_translations)
    
    print(f"📋 ja.jsonに定義されている翻訳キー数: {len(all_ja_keys)}")
    
    # ソースコード内で使用されている翻訳キーを検索
    used_keys = find_translation_usages(src_dir)
    
    print(f"🔗 コード内で使用されている翻訳キー数: {len(used_keys)}")
    
    # 使用されていないキーを特定
    unused_keys = all_ja_keys - used_keys
    
    # 使用されているが定義されていないキーを特定
    undefined_keys = used_keys - all_ja_keys
    
    print(f"\n❌ 使用されていない翻訳キー ({len(unused_keys)}個):")
    for key in sorted(unused_keys):
        print(f"  - {key}")
        
    print(f"\n⚠️  使用されているが定義されていない翻訳キー ({len(undefined_keys)}個):")
    for key in sorted(undefined_keys):
        print(f"  - {key}")
        
    print(f"\n✅ 正しく使用されている翻訳キー: {len(all_ja_keys & used_keys)}個")
    
    return unused_keys, undefined_keys, all_ja_keys & used_keys

if __name__ == "__main__":
    # プロジェクトのパス設定
    project_root = "/Users/yamashitanatsuki/Documents/WorkingSpace/startup-nextjs"
    ja_file = os.path.join(project_root, "messages", "ja.json")
    src_dir = os.path.join(project_root, "src")
    
    if not os.path.exists(ja_file):
        print(f"❌ ja.jsonファイルが見つかりません: {ja_file}")
        exit(1)
        
    if not os.path.exists(src_dir):
        print(f"❌ srcディレクトリが見つかりません: {src_dir}")
        exit(1)
        
    analyze_translation_keys(ja_file, src_dir)
