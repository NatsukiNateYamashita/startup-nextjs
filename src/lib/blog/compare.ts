// compare.ts
// 文単位マッピング・左右対訳用ロジック（MVP: 手動タグ型）

export type BilingualSentence = {
  id: string; // 例: 's1', 's2' など
  left: string;
  right: string;
};

export type BilingualSentenceWithTag = {
  id: string;
  left: string;
  right: string;
  leftTag?: string;
  rightTag?: string;
};

/**
 * マークダウン本文から手動タグ（<!-- s1 -->等）で区切られた文リストを抽出
 * @param markdown string
 * @returns Array<{id: string, text: string}>
 */
export function extractSentences(markdown: string): Array<{id: string, text: string}> {
  const regex = /<!--\s*(s\d+)\s*-->([\s\S]*?)(?=<!--|$)/g;
  const result: Array<{id: string, text: string}> = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    result.push({ id: match[1], text: match[2].trim() });
  }
  return result;
}

/**
 * マークダウン本文から手動タグ（<!-- s1 -->等）で区切られた文リストを抽出
 * 各文の直前のmarkdownタグ（h1/h2/p/liなど）も記録
 */
export function extractSentencesWithTag(markdown: string): Array<{id: string, text: string, tag?: string}> {
  // まずはシンプルに文を抽出
  const regex = /<!--\s*(s\d+)\s*-->([\s\S]*?)(?=<!--|$)/g;
  const result: Array<{id: string, text: string, tag?: string}> = [];
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    const id = match[1]; // s1, s2, etc.
    const text = match[2].trim();
    
    // 文の最初の部分からタグを判定
    let tag = 'p'; // デフォルト
    if (text.startsWith('# ')) tag = 'h1';
    else if (text.startsWith('## ')) tag = 'h2';
    else if (text.startsWith('### ')) tag = 'h3';
    else if (text.startsWith('- ') || text.startsWith('* ')) tag = 'li';
    else if (/^\d+\. /.test(text)) tag = 'li';
    
    result.push({ id, text, tag });
  }
  
  return result;
}

/**
 * 2言語分の文リストをidで突き合わせてBilingualSentence配列を生成
 */
export function mapBilingualSentences(
  left: Array<{id: string, text: string}>,
  right: Array<{id: string, text: string}>
): BilingualSentence[] {
  const map = new Map(right.map(s => [s.id, s.text]));
  return left.map(s => ({
    id: s.id,
    left: s.text,
    right: map.get(s.id) ?? ''
  }));
}

/**
 * 2言語分の文リストをidで突き合わせてBilingualSentenceWithTag配列を生成
 */
export function mapBilingualSentencesWithTag(
  left: Array<{id: string, text: string, tag?: string}>,
  right: Array<{id: string, text: string, tag?: string}>
): BilingualSentenceWithTag[] {
  const map = new Map(right.map(s => [s.id, s]));
  return left.map(s => {
    const r = map.get(s.id);
    return {
      id: s.id,
      left: s.text,
      right: r?.text ?? '',
      leftTag: s.tag,
      rightTag: r?.tag,
    };
  });
}
