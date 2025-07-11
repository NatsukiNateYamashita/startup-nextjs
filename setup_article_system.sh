#!/bin/bash

# 記事自動作成システム セットアップスクリプト

echo "🚀 記事自動作成システムのセットアップを開始します..."

# 現在のディレクトリを確認
if [ ! -f "package.json" ]; then
    echo "❌ startup-nextjs プロジェクトのルートディレクトリで実行してください"
    exit 1
fi

echo "📁 Python仮想環境をアクティベート中..."

# Python仮想環境をアクティベート
if [ -f "startup-nodejs/bin/activate" ]; then
    source startup-nodejs/bin/activate
    echo "✅ Python仮想環境をアクティベートしました"
else
    echo "❌ Python仮想環境が見つかりません: startup-nodejs/bin/activate"
    echo "まず仮想環境を作成してください"
    exit 1
fi

echo "📦 必要なパッケージをインストール中..."

# utils ディレクトリに移動
cd utils

# パッケージをインストール
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ パッケージのインストールが完了しました"
else
    echo "❌ パッケージのインストールに失敗しました"
    exit 1
fi

echo "🔧 設定をテスト中..."

# 設定ファイルをテスト
python config.py

if [ $? -eq 0 ]; then
    echo "✅ 設定テストが完了しました"
else
    echo "❌ 設定テストに失敗しました"
    exit 1
fi

echo ""
echo "🎉 セットアップが完了しました！"
echo ""
echo "📚 使用方法:"
echo "  cd utils"
echo "  python main.py ideas                    # アイディア生成"
echo "  python main.py generate <idea-id>       # 記事生成"
echo "  python main.py translate <article-id>   # 翻訳"
echo "  python main.py images <article-id>      # 画像生成"
echo "  python main.py validate <article-id>    # 検証"
echo "  python main.py full <article-id>        # 一括実行"
echo ""
echo "💡 まずは以下のコマンドでアイディアを生成してみてください:"
echo "  python main.py ideas"
