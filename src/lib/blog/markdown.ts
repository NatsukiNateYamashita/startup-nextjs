import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { BlogPost, BlogMetadata, TOCItem, Author, AuthorId } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import { getPostImages, IMAGE_PRESETS } from './images';
import { getAuthor, getDefaultAuthor as getDefaultAuthorData } from './authors';

// コンテンツディレクトリのパス
const CONTENT_DIR = join(process.cwd(), 'src/content/blog/posts');

/**
 * マークダウン内の画像をBlogImageコンポーネントに変換するプラグイン（Phase 3強化版）
 */
function remarkBlogImages(postSlug: string) {
  return function transformer(tree: any) {
    visit(tree, 'image', (node: any) => {
      // 画像のURLを解析
      const { url, alt, title } = node;
      
      // ローカル画像の場合のみ変換
      if (!url.startsWith('http')) {
        // 画像ファイル名を取得
        const imageFilename = url.split('/').pop() || url;
        const imagePath = `/images/blog/${postSlug}/${imageFilename}`;
        
        // BlogImageコンポーネントのJSXに変換（Phase 3機能対応）
        node.type = 'html';
        node.value = `<div class="blog-image-wrapper my-8">
          <div 
            data-image-component="true"
            data-post-slug="${postSlug}"
            data-filename="${imageFilename}"
            data-alt="${alt || imageFilename}"
            class="blog-image-container"
          >
            <div class="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg group">
              <img 
                src="${imagePath}"
                alt="${alt || imageFilename}"
                class="w-full h-auto object-cover transition-all duration-300 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            ${title ? `<p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic leading-relaxed">${title}</p>` : ''}
          </div>
        </div>`;
      }
    });
  };
}

// マークダウン処理のプロセッサー（画像変換機能付き）
function createMarkdownProcessor(postSlug: string) {
  return remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => remarkBlogImages(postSlug)) // 画像変換プラグインを追加
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify);
}

/**
 * 指定されたスラッグと言語の記事を取得
 */
export async function getMarkdownPost(slug: string, locale: Locale): Promise<BlogPost | null> {
  try {
    const postDir = join(CONTENT_DIR, slug);
    const markdownPath = join(postDir, `${locale}.md`);
    const metaPath = join(postDir, 'meta.json');

    // ファイルの存在確認
    try {
      await stat(markdownPath);
    } catch (error) {
      console.warn(`Markdown file not found: ${markdownPath}`);
      return null;
    }

    // マークダウンファイルの読み込み
    const markdownContent = await readFile(markdownPath, 'utf-8');
    const { data: frontMatter, content } = matter(markdownContent);

    // メタデータの読み込み
    let metadata: any = {};
    try {
      const metaContent = await readFile(metaPath, 'utf-8');
      metadata = JSON.parse(metaContent);
    } catch (error) {
      console.warn(`Meta file not found: ${metaPath}`);
    }

    // HTMLに変換（画像変換機能付き）
    const markdownProcessor = createMarkdownProcessor(slug);
    const processedContent = await markdownProcessor.process(content);
    const htmlContent = processedContent.toString();

    // 全言語のコンテンツを取得
    const allContent = await getAllLanguageContent(slug);
    const allTitles = await getAllLanguageTitles(slug);
    const allExcerpts = await getAllLanguageExcerpts(slug);

    // 全言語の目次を生成
    const allToc = await getAllLanguageTableOfContents(slug);
    
    // 全言語の読了時間を計算
    const allReadingTime = await getAllLanguageReadingTime(slug);

    // 記事の画像一覧を取得（Phase 3で強化）
    const postImages = await getPostImages(slug, IMAGE_PRESETS.content);

    // 著者情報の解決
    let resolvedAuthor: Author;
    if (metadata.authorId) {
      // 新しい形式: authorIdから著者情報を解決
      const author = await getAuthor(metadata.authorId);
      resolvedAuthor = author || getDefaultAuthorData();
    } else if (metadata.author) {
      // 古い形式: 直接埋め込まれた著者情報（下位互換性のため）
      resolvedAuthor = metadata.author;
    } else {
      // デフォルト著者を使用
      resolvedAuthor = getDefaultAuthorData();
    }

    // BlogPost オブジェクトを構築
    const blogPost: BlogPost = {
      id: slug,
      slug,
      title: allTitles,
      excerpt: allExcerpts,
      content: allContent,
      author: resolvedAuthor,
      tags: metadata.tags || [],
      publishDate: metadata.publishDate || new Date().toISOString(),
      heroImage: metadata.heroImage || '/images/blog/default-hero.jpg',
      images: postImages, // Phase 3で実装完了
      readingTime: allReadingTime,
      featured: metadata.featured || false,
      status: 'published',
      seoData: {
        title: allTitles,
        description: allExcerpts,
        keywords: metadata.tags ? (Object.values(metadata.tags).flat() as string[]) : [],
        ogImage: metadata.heroImage,
      },
      relatedPosts: metadata.relatedPosts || [],
      tableOfContents: allToc,
    };

    return blogPost;
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

/**
 * 全記事を取得
 */
export async function getAllPosts(locale?: Locale): Promise<BlogPost[]> {
  try {
    const postDirs = await readdir(CONTENT_DIR);
    const posts: BlogPost[] = [];

    for (const postDir of postDirs) {
      const postPath = join(CONTENT_DIR, postDir);
      const postStat = await stat(postPath);

      if (postStat.isDirectory()) {
        if (locale) {
          const post = await getMarkdownPost(postDir, locale);
          if (post) {
            posts.push(post);
          }
        } else {
          // 言語指定がない場合は日本語を優先
          const post = await getMarkdownPost(postDir, 'ja');
          if (post) {
            posts.push(post);
          }
        }
      }
    }

    // 公開日順でソート
    return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error loading all posts:', error);
    return [];
  }
}

/**
 * タグで記事を絞り込み（多言語対応）
 */
export async function getPostsByTag(tag: string, locale?: Locale): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter(post => {
    // 全言語のタグを確認
    const allPostTags = Object.values(post.tags).flat();
    return allPostTags.includes(tag);
  });
}

/**
 * 指定されたスラッグの全言語コンテンツを取得
 */
async function getAllLanguageContent(slug: string): Promise<Record<Locale, string>> {
  const locales: Locale[] = ['ja', 'en', 'zh-TW', 'zh-CN'];
  const content: Record<Locale, string> = {} as Record<Locale, string>;

  for (const locale of locales) {
    try {
      const postDir = join(CONTENT_DIR, slug);
      const markdownPath = join(postDir, `${locale}.md`);
      const markdownContent = await readFile(markdownPath, 'utf-8');
      const { content: rawContent } = matter(markdownContent);
      
      // 各言語用のマークダウンプロセッサーを作成
      const markdownProcessor = createMarkdownProcessor(slug);
      const processedContent = await markdownProcessor.process(rawContent);
      content[locale] = processedContent.toString();
    } catch (error) {
      console.warn(`Content not found for ${slug} in ${locale}`);
      content[locale] = '';
    }
  }

  return content;
}

/**
 * 指定されたスラッグの全言語タイトルを取得
 */
async function getAllLanguageTitles(slug: string): Promise<Record<Locale, string>> {
  const locales: Locale[] = ['ja', 'en', 'zh-TW', 'zh-CN'];
  const titles: Record<Locale, string> = {} as Record<Locale, string>;

  for (const locale of locales) {
    try {
      const postDir = join(CONTENT_DIR, slug);
      const markdownPath = join(postDir, `${locale}.md`);
      const markdownContent = await readFile(markdownPath, 'utf-8');
      const { data: frontMatter } = matter(markdownContent);
      
      titles[locale] = frontMatter.title || `Untitled Post (${locale})`;
    } catch (error) {
      console.warn(`Title not found for ${slug} in ${locale}`);
      titles[locale] = `Untitled Post (${locale})`;
    }
  }

  return titles;
}

/**
 * 指定されたスラッグの全言語要約を取得
 */
async function getAllLanguageExcerpts(slug: string): Promise<Record<Locale, string>> {
  const locales: Locale[] = ['ja', 'en', 'zh-TW', 'zh-CN'];
  const excerpts: Record<Locale, string> = {} as Record<Locale, string>;

  for (const locale of locales) {
    try {
      const postDir = join(CONTENT_DIR, slug);
      const markdownPath = join(postDir, `${locale}.md`);
      const markdownContent = await readFile(markdownPath, 'utf-8');
      const { data: frontMatter, content } = matter(markdownContent);
      
      // フロントマターにexcerptがあればそれを使用、なければコンテンツの最初の150文字
      excerpts[locale] = frontMatter.excerpt || content.substring(0, 150).replace(/\n/g, ' ') + '...';
    } catch (error) {
      console.warn(`Excerpt not found for ${slug} in ${locale}`);
      excerpts[locale] = '';
    }
  }

  return excerpts;
}

/**
 * 目次を生成
 */
export function generateTableOfContents(content: string): TOCItem[] {
  const lines = content.split('\n');
  const toc: TOCItem[] = [];
  let currentId = 0;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2];
      const id = `heading-${currentId++}`;

      toc.push({
        id,
        level,
        title,
        children: [],
      });
    }
  }

  return toc;
}

/**
 * 読了時間を計算（分単位）
 */
export function calculateReadingTime(content: string, locale: Locale): number {
  const wordsPerMinute = getReadingSpeed(locale);
  const wordCount = getWordCount(content, locale);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * 言語別の読み取り速度（分あたりの単語数）
 */
function getReadingSpeed(locale: Locale): number {
  switch (locale) {
    case 'ja':
      return 400; // 日本語：400文字/分
    case 'en':
      return 200; // 英語：200単語/分
    case 'zh-TW':
    case 'zh-CN':
      return 300; // 中国語：300文字/分
    default:
      return 200;
  }
}

/**
 * 言語別の単語数カウント
 */
function getWordCount(content: string, locale: Locale): number {
  // マークダウン記法を除去
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // コードブロック除去
    .replace(/`[^`]*`/g, '') // インラインコード除去
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像除去
    .replace(/\[.*?\]\(.*?\)/g, '') // リンク除去
    .replace(/#+\s/g, '') // ヘッダー記号除去
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // 太字・斜体除去
    .replace(/\n+/g, ' ') // 改行を空白に変換
    .trim();

  if (locale === 'ja' || locale === 'zh-TW' || locale === 'zh-CN') {
    // 日本語・中国語：文字数でカウント
    return cleanContent.length;
  } else {
    // 英語：単語数でカウント
    return cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  }
}

/**
 * デフォルトの著者情報（多言語対応）
 */
function getDefaultAuthor(): Author {
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
 * 記事の存在確認
 */
export async function postExists(slug: string, locale: Locale): Promise<boolean> {
  try {
    const postDir = join(CONTENT_DIR, slug);
    const markdownPath = join(postDir, `${locale}.md`);
    await stat(markdownPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 利用可能な言語を取得
 */
export async function getAvailableLocales(slug: string): Promise<Locale[]> {
  const locales: Locale[] = ['ja', 'en', 'zh-TW', 'zh-CN'];
  const availableLocales: Locale[] = [];

  for (const locale of locales) {
    if (await postExists(slug, locale)) {
      availableLocales.push(locale);
    }
  }

  return availableLocales;
}

/**
 * 指定されたスラッグの全言語の目次を取得
 */
async function getAllLanguageTableOfContents(slug: string): Promise<Record<Locale, TOCItem[]>> {
  const locales: Locale[] = ['ja', 'en', 'zh-TW', 'zh-CN'];
  const toc: Record<Locale, TOCItem[]> = {} as Record<Locale, TOCItem[]>;

  for (const locale of locales) {
    try {
      const postDir = join(CONTENT_DIR, slug);
      const markdownPath = join(postDir, `${locale}.md`);
      const markdownContent = await readFile(markdownPath, 'utf-8');
      const { content } = matter(markdownContent);
      
      toc[locale] = generateTableOfContents(content);
    } catch (error) {
      console.warn(`Table of contents not found for ${slug} in ${locale}`);
      toc[locale] = [];
    }
  }

  return toc;
}

/**
 * 指定されたスラッグの全言語の読了時間を取得
 */
async function getAllLanguageReadingTime(slug: string): Promise<Record<Locale, number>> {
  const locales: Locale[] = ['ja', 'en', 'zh-TW', 'zh-CN'];
  const readingTime: Record<Locale, number> = {} as Record<Locale, number>;

  for (const locale of locales) {
    try {
      const postDir = join(CONTENT_DIR, slug);
      const markdownPath = join(postDir, `${locale}.md`);
      const markdownContent = await readFile(markdownPath, 'utf-8');
      const { content } = matter(markdownContent);
      
      readingTime[locale] = calculateReadingTime(content, locale);
    } catch (error) {
      console.warn(`Reading time not found for ${slug} in ${locale}`);
      readingTime[locale] = 0;
    }
  }

  return readingTime;
}
