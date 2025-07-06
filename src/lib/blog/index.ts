import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { BlogPost, BlogMetadata, BlogIndex, AuthorId } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import { getAllPosts } from './markdown';

// インデックスファイルのパス
const INDEX_FILE = join(process.cwd(), 'src/content/blog/index.json');

/**
 * BlogPostからauthorIdを抽出するヘルパー関数
 * (将来的にはmeta.jsonで直接authorIdを管理するようになるが、
 *  現在は著者オブジェクトから逆算する必要がある)
 */
function getAuthorIdFromPost(post: BlogPost): AuthorId {
  // NIHONGO-AIの場合
  if (post.author.name.ja === 'NIHONGO-AI') {
    return 'nihongo-ai';
  }
  // Samuel Joshの場合
  if (post.author.name.en === 'Samuel Josh') {
    return 'samuel-josh';
  }
  // デフォルトはnihongo-ai
  return 'nihongo-ai';
}

/**
 * ブログインデックスを構築
 */
export async function buildBlogIndex(): Promise<BlogIndex> {
  try {
    const posts = await getAllPosts('ja'); // 日本語をベースにインデックス構築
    const metadata: BlogMetadata[] = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      publishDate: post.publishDate,
      authorId: getAuthorIdFromPost(post), // authorIdを使用
      tags: Object.values(post.tags).flat(), // 多言語タグを平坦化
      heroImage: post.heroImage,
      featured: post.featured,
      status: post.status,
    }));

    // すべてのタグを収集（多言語対応）
    const allTags = [...new Set(posts.flatMap(post => Object.values(post.tags).flat()))];

    const index: BlogIndex = {
      posts: metadata,
      tags: allTags,
      lastUpdated: new Date().toISOString(),
      totalPosts: posts.length,
    };

    // インデックスファイルを更新
    await writeFile(INDEX_FILE, JSON.stringify(index, null, 2));

    return index;
  } catch (error) {
    console.error('Error building blog index:', error);
    throw error;
  }
}

/**
 * ブログインデックスを取得
 */
export async function getBlogIndex(): Promise<BlogIndex> {
  try {
    const indexContent = await readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(indexContent);
  } catch (error) {
    console.warn('Blog index not found, building new index...');
    return await buildBlogIndex();
  }
}

/**
 * ブログインデックスを更新（単一記事）
 */
export async function updateBlogIndex(post: BlogPost): Promise<void> {
  try {
    const currentIndex = await getBlogIndex();
    
    // 既存の記事を更新または新規追加
    const existingIndex = currentIndex.posts.findIndex(p => p.id === post.id);
    const newMetadata: BlogMetadata = {
      id: post.id,
      slug: post.slug,
      publishDate: post.publishDate,
      authorId: getAuthorIdFromPost(post), // authorIdを使用
      tags: Object.values(post.tags).flat(), // 多言語タグを平坦化
      heroImage: post.heroImage,
      featured: post.featured,
      status: post.status,
    };

    if (existingIndex !== -1) {
      currentIndex.posts[existingIndex] = newMetadata;
    } else {
      currentIndex.posts.push(newMetadata);
    }

    // タグを更新
    const allTags = [...new Set(currentIndex.posts.flatMap(p => p.tags))];
    currentIndex.tags = allTags;
    currentIndex.totalPosts = currentIndex.posts.length;
    currentIndex.lastUpdated = new Date().toISOString();

    // インデックスファイルを更新
    await writeFile(INDEX_FILE, JSON.stringify(currentIndex, null, 2));
  } catch (error) {
    console.error('Error updating blog index:', error);
    throw error;
  }
}

/**
 * 記事を検索（基本的なテキスト検索）
 */
export async function searchPosts(query: string, locale: Locale): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts(locale);
    const searchTerm = query.toLowerCase();

    return posts.filter(post => {
      const title = post.title[locale]?.toLowerCase() || '';
      const excerpt = post.excerpt[locale]?.toLowerCase() || '';
      const tags = Object.values(post.tags).flat().map(tag => tag.toLowerCase()).join(' ');
      const content = post.content[locale]?.toLowerCase() || '';

      return title.includes(searchTerm) || 
             excerpt.includes(searchTerm) || 
             tags.includes(searchTerm) || 
             content.includes(searchTerm);
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

/**
 * 人気記事を取得（フィーチャーされた記事を優先）
 */
export async function getPopularPosts(locale: Locale, limit: number = 3): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts(locale);
    
    // フィーチャーされた記事を優先して、日付順でソート
    const sortedPosts = posts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    return sortedPosts.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular posts:', error);
    return [];
  }
}

/**
 * 関連記事を取得
 */
export async function getRelatedPosts(currentPost: BlogPost, locale: Locale, limit: number = 3): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllPosts(locale);
    const relatedPosts = allPosts.filter(post => post.id !== currentPost.id);

    // タグの一致度で関連度を計算（多言語対応）
    const postsWithScore = relatedPosts.map(post => {
      const postTags = Object.values(post.tags).flat();
      const currentPostTags = Object.values(currentPost.tags).flat();
      const commonTags = postTags.filter(tag => currentPostTags.includes(tag));
      const score = commonTags.length;
      return { post, score };
    });

    // スコア順でソートして上位を返す
    return postsWithScore
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  } catch (error) {
    console.error('Error getting related posts:', error);
    return [];
  }
}

/**
 * 最新記事を取得
 */
export async function getLatestPosts(locale: Locale, limit: number = 5): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts(locale);
    return posts.slice(0, limit);
  } catch (error) {
    console.error('Error getting latest posts:', error);
    return [];
  }
}

/**
 * 記事の統計情報を取得
 */
export async function getBlogStats(): Promise<{
  totalPosts: number;
  totalTags: number;
  lastUpdated: string;
  postsByMonth: Record<string, number>;
}> {
  try {
    const index = await getBlogIndex();
    
    // 月別の記事数を計算
    const postsByMonth: Record<string, number> = {};
    index.posts.forEach(post => {
      const month = new Date(post.publishDate).toISOString().substring(0, 7); // YYYY-MM
      postsByMonth[month] = (postsByMonth[month] || 0) + 1;
    });

    return {
      totalPosts: index.totalPosts,
      totalTags: index.tags.length,
      lastUpdated: index.lastUpdated,
      postsByMonth,
    };
  } catch (error) {
    console.error('Error getting blog stats:', error);
    return {
      totalPosts: 0,
      totalTags: 0,
      lastUpdated: new Date().toISOString(),
      postsByMonth: {},
    };
  }
}
