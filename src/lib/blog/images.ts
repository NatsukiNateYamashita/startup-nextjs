import { BlogImage, ResponsiveSize } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * 最適化された画像の型定義
 */
export interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

/**
 * 記事の画像一覧を取得
 */
export async function getPostImages(postSlug: string): Promise<BlogImage[]> {
  const imagesDir = path.join(process.cwd(), 'src/content/blog/posts', postSlug, 'images');
  
  try {
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)
    );

    const images: BlogImage[] = [];
    
    // 全言語のキャプション情報を取得
    const allCaptions = await getAllImageCaptions(postSlug);
    
    for (const file of imageFiles) {
      const captions = allCaptions[file] || {};
      
      // デフォルトのalt/caption（ファイル名ベース）
      const defaultText = file.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
      const alt: Record<Locale, string> = {
        ja: captions.ja || defaultText,
        en: captions.en || defaultText,
        'zh-TW': captions['zh-TW'] || defaultText,
        'zh-CN': captions['zh-CN'] || defaultText,
      };
      
      images.push({
        filename: file,
        alt,
        caption: alt, // キャプションとaltを同じにする
        width: 800, // デフォルト値
        height: 600, // デフォルト値
        sizes: generateImageSizes(`/content/blog/posts/${postSlug}/images/${file}`),
      });
    }

    return images;
  } catch (error) {
    console.warn(`Images not found for post: ${postSlug}`, error);
    return [];
  }
}

/**
 * 画像のキャプション情報を取得
 */
export async function getImageCaptions(
  postSlug: string, 
  locale: Locale
): Promise<Record<string, string>> {
  const captionsPath = path.join(
    process.cwd(), 
    'src/content/blog/posts', 
    postSlug, 
    'images', 
    'captions.json'
  );
  
  try {
    const captionsData = await fs.readFile(captionsPath, 'utf-8');
    const captions = JSON.parse(captionsData);
    
    // 指定されたロケールのキャプションを抽出
    const localizedCaptions: Record<string, string> = {};
    
    for (const [filename, captionObj] of Object.entries(captions)) {
      if (typeof captionObj === 'object' && captionObj !== null) {
        const localizedCaption = (captionObj as Record<string, string>)[locale];
        if (localizedCaption) {
          localizedCaptions[filename] = localizedCaption;
        }
      }
    }
    
    return localizedCaptions;
  } catch (error) {
    console.warn(`Captions not found for post: ${postSlug}`, error);
    return {};
  }
}

/**
 * 全言語のキャプション情報を取得
 */
export async function getAllImageCaptions(
  postSlug: string
): Promise<Record<string, Record<Locale, string>>> {
  const captionsPath = path.join(
    process.cwd(), 
    'src/content/blog/posts', 
    postSlug, 
    'images', 
    'captions.json'
  );
  
  try {
    const captionsData = await fs.readFile(captionsPath, 'utf-8');
    const captions = JSON.parse(captionsData);
    return captions;
  } catch (error) {
    console.warn(`Captions not found for post: ${postSlug}`, error);
    return {};
  }
}

/**
 * レスポンシブサイズを生成
 */
export function generateImageSizes(originalPath: string): ResponsiveSize[] {
  const sizes: ResponsiveSize[] = [
    { width: 640, height: 480, breakpoint: 'sm' },
    { width: 828, height: 620, breakpoint: 'md' },
    { width: 1080, height: 810, breakpoint: 'lg' },
    { width: 1200, height: 900, breakpoint: 'xl' },
    { width: 1920, height: 1440, breakpoint: '2xl' },
  ];
  
  return sizes;
}

/**
 * 画像を最適化（Next.js Imageコンポーネント用の設定を準備）
 */
export function optimizeImage(
  imagePath: string, 
  sizes: ResponsiveSize[] = generateImageSizes(imagePath)
): OptimizedImage {
  // Next.js Imageコンポーネントが自動的に最適化を処理するため、
  // ここでは設定を準備する
  const srcSet = sizes
    .map(size => `${imagePath}?w=${size.width}&h=${size.height} ${size.width}w`)
    .join(', ');
  
  const sizesAttribute = [
    '(max-width: 640px) 100vw',
    '(max-width: 828px) 100vw', 
    '(max-width: 1080px) 100vw',
    '(max-width: 1200px) 100vw',
    '100vw'
  ].join(', ');

  return {
    src: imagePath,
    srcSet,
    sizes: sizesAttribute,
    width: sizes[sizes.length - 1].width,
    height: sizes[sizes.length - 1].height,
  };
}

/**
 * 画像パスを解決（相対パスから絶対パスへ）
 */
export function resolveImagePath(postSlug: string, imageName: string): string {
  return `/content/blog/posts/${postSlug}/images/${imageName}`;
}

/**
 * ヒーロー画像を取得
 */
export async function getHeroImage(postSlug: string, locale: Locale): Promise<BlogImage | null> {
  const images = await getPostImages(postSlug);
  const heroImage = images.find(img => img.filename.includes('hero'));
  
  if (heroImage) {
    const captions = await getImageCaptions(postSlug, locale);
    const heroCaption = captions['hero.jpg'] || captions['hero.png'] || '';
    
    // 指定されたロケールのキャプションを更新
    heroImage.caption[locale] = heroCaption;
  }
  
  return heroImage || null;
}
