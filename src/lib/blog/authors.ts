import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { Author } from '@/app/[locale]/types/blog';

// 著者データディレクトリのパス
const AUTHORS_DIR = join(process.cwd(), 'src/content/authors');

// 著者ID型
export type AuthorId = string;

// 著者データキャッシュ
let authorsCache: Record<AuthorId, Author> | null = null;

/**
 * 指定されたIDの著者情報を取得
 */
export async function getAuthor(authorId: AuthorId): Promise<Author | null> {
  try {
    const authorPath = join(AUTHORS_DIR, `${authorId}.json`);
    const authorContent = await readFile(authorPath, 'utf-8');
    const authorData = JSON.parse(authorContent);
    
    // idフィールドを除外してAuthor型として返す
    const { id, ...author } = authorData;
    return author as Author;
  } catch (error) {
    console.warn(`Author not found: ${authorId}`);
    return null;
  }
}

/**
 * すべての著者情報を取得（キャッシュ付き）
 */
export async function getAllAuthors(): Promise<Record<AuthorId, Author>> {
  if (authorsCache) {
    return authorsCache;
  }

  try {
    const authorFiles = await readdir(AUTHORS_DIR);
    const authors: Record<AuthorId, Author> = {};

    for (const file of authorFiles) {
      if (file.endsWith('.json')) {
        const authorId = file.replace('.json', '');
        const author = await getAuthor(authorId);
        if (author) {
          authors[authorId] = author;
        }
      }
    }

    authorsCache = authors;
    return authors;
  } catch (error) {
    console.error('Error loading authors:', error);
    return {};
  }
}

/**
 * 著者IDの有効性を検証
 */
export async function validateAuthorId(authorId: string): Promise<boolean> {
  const author = await getAuthor(authorId);
  return author !== null;
}

/**
 * 著者キャッシュをクリア（開発・テスト用）
 */
export function clearAuthorsCache(): void {
  authorsCache = null;
}

/**
 * デフォルトの著者情報を取得
 */
export function getDefaultAuthor(): Author {
  return {
    name: {
      ja: 'NIHONGO-AI',
      en: 'NIHONGO-AI',
      'zh-CN': 'NIHONGO-AI',
      'zh-TW': 'NIHONGO-AI'
    },
    image: '/images/blog/default-author.png',
    designation: {
      ja: 'AIアシスタント',
      en: 'AI Assistant',
      'zh-CN': 'AI助手',
      'zh-TW': 'AI助手'
    },
  };
}

/**
 * 利用可能な著者IDの一覧を取得
 */
export async function getAuthorIds(): Promise<AuthorId[]> {
  try {
    const authors = await getAllAuthors();
    return Object.keys(authors);
  } catch (error) {
    console.error('Error getting author IDs:', error);
    return [];
  }
}
