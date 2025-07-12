#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
翻訳キーの使用状況を詳細に分析し、新しいja.jsonを生成するスクリプト
"""

import json
import re
import os
from pathlib import Path
from typing import Dict, List, Set, Tuple

def load_translation_file(file_path: str) -> Dict:
    """翻訳ファイルを読み込み"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_translation_usage_per_file(file_path: str) -> Tuple[Set[str], Set[str]]:
    """
    ファイルごとの翻訳使用状況を抽出
    Returns: (namespaces, translation_keys)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        namespaces = set()
        translation_keys = set()
        
        # useTranslations()の使用箇所を検索
        translations_matches = re.findall(r'useTranslations\(["\']([^"\']+)["\']\)', content)
        
        # getTranslations()の使用箇所も検索
        get_translations_matches = re.findall(r'getTranslations\([^}]+namespace:\s*["\']([^"\']+)["\']', content)
        
        # namespaceを記録
        for namespace in translations_matches + get_translations_matches:
            namespaces.add(namespace)
        
        # t()の使用箇所を検索（より厳密に）
        t_patterns = [
            r't\(\s*["\']([^"\']+)["\']\s*\)',  # t("key")
            r't\(\s*["`]([^"`]+)["`]\s*\)',    # t(`key`)
        ]
        
        t_keys = set()
        for pattern in t_patterns:
            matches = re.findall(pattern, content)
            t_keys.update(matches)
        
        # namespaceと組み合わせた完全なキーを生成
        for namespace in namespaces:
            for t_key in t_keys:
                if '.' in t_key:
                    # すでに完全なパス
                    translation_keys.add(t_key)
                else:
                    # namespaceと組み合わせ
                    full_key = f"{namespace}.{t_key}"
                    translation_keys.add(full_key)
        
        # namespaceがない場合のt()キーも追加
        if not namespaces:
            for t_key in t_keys:
                translation_keys.add(t_key)
                
        return namespaces, translation_keys
        
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return set(), set()

def analyze_all_files(src_dir: str) -> Dict[str, Dict[str, Set[str]]]:
    """全ファイルの翻訳使用状況を分析"""
    file_analysis = {}
    
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, src_dir)
                
                namespaces, translation_keys = extract_translation_usage_per_file(file_path)
                
                if namespaces or translation_keys:
                    file_analysis[relative_path] = {
                        'namespaces': namespaces,
                        'translation_keys': translation_keys
                    }
    
    return file_analysis

def collect_used_keys(file_analysis: Dict) -> Set[str]:
    """使用されている翻訳キーを全て収集"""
    used_keys = set()
    
    for file_info in file_analysis.values():
        used_keys.update(file_info['translation_keys'])
        # namespaceもキーとして追加
        used_keys.update(file_info['namespaces'])
    
    return used_keys

def create_minimal_translations(original: Dict, used_keys: Set[str]) -> Dict:
    """使用されているキーのみを含む最小限の翻訳ファイルを作成"""
    def get_nested_value(obj: Dict, key_path: str):
        """ネストされたオブジェクトから値を取得"""
        keys = key_path.split('.')
        current = obj
        
        for key in keys:
            if isinstance(current, dict) and key in current:
                current = current[key]
            else:
                return None
        return current
    
    def set_nested_value(obj: Dict, key_path: str, value):
        """ネストされたオブジェクトに値を設定"""
        keys = key_path.split('.')
        current = obj
        
        for key in keys[:-1]:
            if key not in current:
                current[key] = {}
            current = current[key]
        
        current[keys[-1]] = value
    
    minimal = {}
    
    # 使用されているキーをソートして処理
    for key in sorted(used_keys):
        value = get_nested_value(original, key)
        if value is not None:
            set_nested_value(minimal, key, value)
    
    return minimal

def main():
    """メイン実行関数"""
    project_root = "/Users/yamashitanatsuki/Documents/WorkingSpace/startup-nextjs"
    ja_file = os.path.join(project_root, "messages", "ja.json")
    src_dir = os.path.join(project_root, "src")
    
    print("🔍 詳細な翻訳キー分析を実行中...")
    
    # 現在のja.jsonを読み込み
    original_translations = load_translation_file(ja_file)
    
    # 全ファイルの翻訳使用状況を分析
    file_analysis = analyze_all_files(src_dir)
    
    print(f"📁 分析したファイル数: {len(file_analysis)}")
    
    # ファイルごとの詳細表示
    print("\n📋 ファイルごとの翻訳使用状況:")
    for file_path, info in file_analysis.items():
        if info['namespaces'] or info['translation_keys']:
            print(f"  {file_path}:")
            if info['namespaces']:
                print(f"    Namespaces: {', '.join(sorted(info['namespaces']))}")
            if info['translation_keys']:
                print(f"    Keys: {len(info['translation_keys'])}個")
    
    # 使用されているキーを収集
    used_keys = collect_used_keys(file_analysis)
    
    print(f"\n✅ 実際に使用されている翻訳キー: {len(used_keys)}個")
    print(f"📊 元のja.jsonのキー数: {len(get_all_keys(original_translations))}個")
    
    # 最小限の翻訳ファイルを作成
    minimal_translations = create_minimal_translations(original_translations, used_keys)
    
    # 新しいja.jsonファイルとして保存
    output_file = os.path.join(project_root, "messages", "ja_minimal.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(minimal_translations, f, ensure_ascii=False, indent=2)
    
    print(f"💾 最小化されたja.jsonを作成: {output_file}")
    print(f"📉 削減されたキー数: {len(get_all_keys(original_translations)) - len(get_all_keys(minimal_translations))}個")

def get_all_keys(obj: Dict, prefix: str = "") -> Set[str]:
    """ネストしたオブジェクトの全キーを取得"""
    keys = set()
    for key, value in obj.items():
        if prefix:
            full_key = f"{prefix}.{key}"
        else:
            full_key = key
            
        keys.add(full_key)
        
        if isinstance(value, dict):
            keys.update(get_all_keys(value, full_key))
            
    return keys

if __name__ == "__main__":
    main()
