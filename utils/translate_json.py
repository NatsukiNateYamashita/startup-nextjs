import os
import json
import uuid
import requests
from typing import Dict, List

# --- 設定 ---
API_KEY = "BkvN1A8doHUIrdEeuIFyYa7yYUkiEPhOz2LEU7cfpHReyrM0sU1oJQQJ99BEACi0881XJ3w3AAAbACOGU2B1"
ENDPOINT = "https://api.cognitive.microsofttranslator.com"
LOCATION = "japaneast"
SOURCE_LANG = "ja"
TARGET_LANGS = ["en", "zh-CN", "zh-TW"]
LANG_MAP = {"ja": "ja", "en":"en", "zh-CN": "zh-Hans", "zh-TW": "zh-Hant"}  # for API lang code mapping
MESSAGES_DIR = os.path.join(os.path.dirname(__file__), "../messages")

assert SOURCE_LANG not in TARGET_LANGS, "source_language must not be in target_languages"

# --- ユーティリティ関数 ---

def flatten_json(data: dict, parent_key: str = '') -> dict:
    """ネストされた辞書を平坦化"""
    items = {}
    for k, v in data.items():
        new_key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            items.update(flatten_json(v, new_key))
        else:
            items[new_key] = v
    return items

def unflatten_json(flat_dict: dict) -> dict:
    """平坦化された辞書をネスト構造に戻す"""
    result = {}
    for compound_key, value in flat_dict.items():
        keys = compound_key.split('.')
        d = result
        for k in keys[:-1]:
            d = d.setdefault(k, {})
        d[keys[-1]] = value
    return result

def load_json(lang: str) -> dict:
    path = os.path.join(MESSAGES_DIR, f"{lang}.json")
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(lang: str, data: dict):
    path = os.path.join(MESSAGES_DIR, f"{lang}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def extract_diff_keys(src_lang: str, tgt_lang: str) -> Dict[str, str]:
    src_data = flatten_json(load_json(src_lang))
    tgt_data = flatten_json(load_json(tgt_lang))
    return {k: v for k, v in src_data.items() if k not in tgt_data}

def build_translation_body(texts: Dict[str, str]) -> List[dict]:
    return [{"text": v} for v in texts.values()]

def call_translator_api(texts: Dict[str, str]) -> List[dict]:
    """Microsoft Translator API を呼び出す"""
    url = f"{ENDPOINT}/translate"
    params = {
        "api-version": "3.0",
        "from": SOURCE_LANG,
        "to": TARGET_LANGS,
    }
    headers = {
        "Ocp-Apim-Subscription-Key": API_KEY,
        "Ocp-Apim-Subscription-Region": LOCATION,
        "Content-type": "application/json",
        "X-ClientTraceId": str(uuid.uuid4())
    }
    body = build_translation_body(texts)
    response = requests.post(url, params=params, headers=headers, json=body)
    response.raise_for_status()
    return response.json()

def parse_translations(response: List[dict], keys: List[str]) -> Dict[str, Dict[str, str]]:
    """APIレスポンスを言語別に分割してマッピング"""
    parsed = {lang: {} for lang in LANG_MAP}
    for idx, item in enumerate(response):
        for lang, api_lang in LANG_MAP.items():
            for trans in item.get("translations", []):
                if trans["to"] == api_lang:
                    parsed[lang][keys[idx]] = trans["text"]
    return parsed

# --- メイン処理 ---

def main(use_mock: bool = False):
    # 各言語で未翻訳のキーを収集
    src_data = flatten_json(load_json(SOURCE_LANG))
    all_diff = {k: v for k, v in src_data.items() if any(k not in flatten_json(load_json(lang)) for lang in TARGET_LANGS)}
    if not all_diff:
        print("差分なし。翻訳は不要です。")
        return

    src_keys = list(all_diff.keys())

    # 翻訳実行（またはモックデータを使う）
    if use_mock:
        # ダミー翻訳レスポンス（デバッグ用）
        response = [{
            "translations": [
                {"text": f"{v} [JA]", "to": "ja"},
                {"text": f"{v} [ZH-CN]", "to": "zh-Hans"},
                {"text": f"{v} [ZH-TW]", "to": "zh-Hant"}
            ]
        } for v in all_diff.values()]
    else:
        response = call_translator_api(all_diff)

    # 言語別に翻訳を分割
    parsed_by_lang = parse_translations(response, src_keys)

    # 各言語ファイルに統合・保存
    for lang in LANG_MAP:
        existing = flatten_json(load_json(lang))
        existing.update(parsed_by_lang[lang])
        save_json(lang, unflatten_json(existing))

    print("翻訳完了。各言語ファイルを更新しました。")

if __name__ == "__main__":
    main(use_mock=False)
