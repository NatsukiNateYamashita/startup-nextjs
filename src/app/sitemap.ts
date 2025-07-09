import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/blog/markdown';

const baseUrl = 'https://nihongo-ai.jp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 静的ページのパスを定義
  const staticPaths = [
    '',
    '/about',
    '/blog',
    '/compare',
    '/contact',
    '/pricing',
    '/signin',
    '/signup',
  ];

  // 各ロケールで静的ページのURLを生成
  for (const locale of locales) {
    for (const path of staticPaths) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // ブログ記事のURLを生成
  try {
    for (const locale of locales) {
      const posts = await getAllPosts(locale);
      for (const post of posts) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
        
        // Compare機能があるブログ記事用
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/compare/${post.slug}`,
          lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error);
  }

  return sitemapEntries;
}
