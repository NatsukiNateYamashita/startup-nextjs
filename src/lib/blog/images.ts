import { BlogImage, ResponsiveSize, ImageOptimizationConfig } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * 画像キャプション情報の型定義
 */
export interface ImageCaptionData {
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  metadata?: Record<string, any>;
}

/**
 * 最適化された画像の型定義
 */
export interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

/**
 * 画像最適化のデフォルト設定
 */
export const DEFAULT_IMAGE_CONFIG: ImageOptimizationConfig = {
  quality: 85,
  formats: ['webp', 'avif', 'original'],
  enableLazyLoading: true,
  enableBlurDataURL: true,
  compression: {
    webp: { quality: 80 },
    avif: { quality: 75 },
  },
};

/**
 * 画像のメタデータを取得（非同期）
 */
export async function getImageMetadata(imagePath: string): Promise<{
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
} | null> {
  try {
    // 直接ファイルパスが渡されることを前提とする
    const stats = await fs.stat(imagePath);
    
    // 簡易的な画像情報取得（実際の実装では画像解析ライブラリを使用）
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.gif': 'image/gif',
    };

    // デフォルトサイズ（実際の実装では画像解析が必要）
    return {
      width: 800,
      height: 600,
      mimeType: mimeTypes[ext] || 'image/jpeg',
      fileSize: stats.size,
    };
  } catch (error) {
    console.warn(`Failed to get image metadata for ${imagePath}:`, error);
    return null;
  }
}

/**
 * ブラーデータURLを生成（プレースホルダー用）
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // SVGベースの簡易ブラー画像
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `.trim();
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * 記事の画像一覧を取得（強化版）
 */
export async function getPostImages(
  postSlug: string, 
  config: Partial<ImageOptimizationConfig> = {}
): Promise<BlogImage[]> {
  const imagesDir = path.join(process.cwd(), 'public/images/blog', postSlug);
  const finalConfig = { ...DEFAULT_IMAGE_CONFIG, ...config };
  
  try {
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file)
    );

    const images: BlogImage[] = [];
    
    // 全言語のキャプション情報を取得
    const allCaptions = await getAllImageCaptions(postSlug);
    
    for (const file of imageFiles) {
      const captions = allCaptions[file] as ImageCaptionData || {};
      const imagePath = `/images/blog/${postSlug}/${file}`;
      const actualImagePath = path.join(process.cwd(), 'public/images/blog', postSlug, file);
      
      // 画像メタデータを取得
      const metadata = await getImageMetadata(actualImagePath);
      
      // デフォルトのテキスト（ファイル名ベース）
      const defaultText = file.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '');
      
      // altテキストを構築（アクセシビリティ用）
      const alt: Record<Locale, string> = {
        ja: captions.alt?.ja || defaultText,
        en: captions.alt?.en || defaultText,
        'zh-TW': captions.alt?.['zh-TW'] || defaultText,
        'zh-CN': captions.alt?.['zh-CN'] || defaultText,
      };
      
      // キャプションを構築（UI表示用）
      const caption: Record<Locale, string> = {
        ja: captions.caption?.ja || '',
        en: captions.caption?.en || '',
        'zh-TW': captions.caption?.['zh-TW'] || '',
        'zh-CN': captions.caption?.['zh-CN'] || '',
      };
      
      // 最適化された画像パスを構築
      const optimizedPaths = finalConfig.formats.reduce((acc, format) => {
        if (format === 'original') {
          acc.original = imagePath;
        } else {
          // 実際の実装では、最適化済み画像のパスを指定
          acc[format as keyof typeof acc] = imagePath.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
        }
        return acc;
      }, {} as { webp?: string; avif?: string; original: string });

      images.push({
        filename: file,
        alt,
        caption,
        width: metadata?.width || 800,
        height: metadata?.height || 600,
        mimeType: metadata?.mimeType,
        fileSize: metadata?.fileSize,
        sizes: generateImageSizes(imagePath),
        blurDataURL: finalConfig.enableBlurDataURL 
          ? generateBlurDataURL(metadata?.width || 800, metadata?.height || 600)
          : undefined,
        optimized: optimizedPaths,
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
    'public/images/blog', 
    postSlug, 
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
): Promise<Record<string, ImageCaptionData>> {
  const captionsPath = path.join(
    process.cwd(), 
    'public/images/blog', 
    postSlug, 
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
 * レスポンシブサイズを生成（Phase 3強化版）
 */
export function generateImageSizes(
  originalPath: string,
  baseWidth: number = 800,
  baseHeight: number = 600
): ResponsiveSize[] {
  const aspectRatio = baseWidth / baseHeight;
  
  const sizes: ResponsiveSize[] = [
    { width: 480, height: Math.round(480 / aspectRatio), breakpoint: 'xs' },
    { width: 640, height: Math.round(640 / aspectRatio), breakpoint: 'sm' },
    { width: 768, height: Math.round(768 / aspectRatio), breakpoint: 'md' },
    { width: 1024, height: Math.round(1024 / aspectRatio), breakpoint: 'lg' },
    { width: 1280, height: Math.round(1280 / aspectRatio), breakpoint: 'xl' },
    { width: 1920, height: Math.round(1920 / aspectRatio), breakpoint: '2xl' },
  ];
  
  return sizes;
}

/**
 * 画像を最適化（Next.js Imageコンポーネント用の設定を準備）
 */
export function optimizeImage(
  imagePath: string, 
  sizes: ResponsiveSize[] = generateImageSizes(imagePath),
  config: Partial<ImageOptimizationConfig> = {}
): OptimizedImage {
  const finalConfig = { ...DEFAULT_IMAGE_CONFIG, ...config };
  
  // srcSetを生成（レスポンシブ対応）
  const srcSet = sizes
    .map(size => `${imagePath}?w=${size.width}&h=${size.height}&q=${finalConfig.quality} ${size.width}w`)
    .join(', ');
  
  // sizes属性を構築（効率的なレスポンシブ読み込み）
  const sizesAttribute = [
    '(max-width: 640px) 100vw',
    '(max-width: 768px) 90vw',
    '(max-width: 1024px) 80vw',
    '(max-width: 1280px) 70vw',
    '60vw'
  ].join(', ');

  const largestSize = sizes[sizes.length - 1];

  return {
    src: imagePath,
    srcSet,
    sizes: sizesAttribute,
    width: largestSize.width,
    height: largestSize.height,
    blurDataURL: finalConfig.enableBlurDataURL 
      ? generateBlurDataURL(largestSize.width, largestSize.height)
      : undefined,
  };
}

/**
 * 画像パスを解決（相対パスから絶対パスへ）
 */
export function resolveImagePath(postSlug: string, imageName: string): string {
  return `/images/blog/${postSlug}/${imageName}`;
}

/**
 * ヒーロー画像を取得（強化版）
 */
export async function getHeroImage(
  postSlug: string, 
  locale: Locale,
  config: Partial<ImageOptimizationConfig> = {}
): Promise<BlogImage | null> {
  const images = await getPostImages(postSlug, config);
  const heroImage = images.find(img => 
    img.filename.includes('hero') || 
    img.filename.includes('main') ||
    img.filename.includes('cover')
  );
  
  if (heroImage) {
    const captions = await getImageCaptions(postSlug, locale);
    const heroCaption = captions['hero.jpg'] || captions['hero.png'] || captions['hero.webp'] || '';
    
    // 指定されたロケールのキャプションを更新
    if (heroCaption) {
      heroImage.caption[locale] = heroCaption;
    }
  }
  
  return heroImage || null;
}

/**
 * 画像最適化のプリセット設定
 */
export const IMAGE_PRESETS = {
  // ヒーロー画像用（高品質）
  hero: {
    quality: 90,
    formats: ['avif', 'webp', 'original'],
    enableLazyLoading: false, // Above the fold
    enableBlurDataURL: true,
    compression: {
      webp: { quality: 85 },
      avif: { quality: 80 },
    },
  },
  
  // コンテンツ画像用（バランス）
  content: {
    quality: 85,
    formats: ['webp', 'original'],
    enableLazyLoading: true,
    enableBlurDataURL: true,
    compression: {
      webp: { quality: 80 },
      avif: { quality: 75 },
    },
  },
  
  // サムネイル用（軽量）
  thumbnail: {
    quality: 75,
    formats: ['webp', 'original'],
    enableLazyLoading: true,
    enableBlurDataURL: false,
    compression: {
      webp: { quality: 70 },
      avif: { quality: 65 },
    },
  },
} as const;

/**
 * 画像最適化の統計情報を取得
 */
export async function getImageOptimizationStats(postSlug: string): Promise<{
  totalImages: number;
  totalFileSize: number;
  averageFileSize: number;
  formatDistribution: Record<string, number>;
}> {
  const images = await getPostImages(postSlug);
  
  const totalImages = images.length;
  const totalFileSize = images.reduce((sum, img) => sum + (img.fileSize || 0), 0);
  const averageFileSize = totalImages > 0 ? totalFileSize / totalImages : 0;
  
  const formatDistribution = images.reduce((acc, img) => {
    const ext = path.extname(img.filename).toLowerCase().slice(1);
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalImages,
    totalFileSize,
    averageFileSize,
    formatDistribution,
  };
}
