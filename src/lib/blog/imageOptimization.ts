/**
 * 画像処理・最適化ユーティリティ（Phase 3）
 * @description 画像の最適化、リサイズ、形式変換などの高度な機能を提供
 */

import { BlogImage, ImageOptimizationConfig } from '@/app/[locale]/types/blog';

/**
 * WebP対応チェック（クライアントサイド）
 */
export function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * AVIF対応チェック（クライアントサイド）
 */
export function checkAVIFSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
  });
}

/**
 * 画像の最適な形式を選択
 */
export async function getOptimalImageFormat(
  originalFormat: string,
  supportedFormats: readonly string[]
): Promise<string> {
  // 元の形式がサポートされている場合はそのまま使用
  if (supportedFormats.includes(originalFormat)) {
    return originalFormat;
  }

  // ブラウザサポートをチェックして最適な形式を選択
  if (typeof window !== 'undefined') {
    const [supportsAVIF, supportsWebP] = await Promise.all([
      checkAVIFSupport(),
      checkWebPSupport(),
    ]);

    if (supportsAVIF && supportedFormats.includes('avif')) {
      return 'avif';
    }
    if (supportsWebP && supportedFormats.includes('webp')) {
      return 'webp';
    }
  }

  // フォールバック：originalまたは最初の形式
  return supportedFormats.includes('original') 
    ? 'original' 
    : supportedFormats[0] || 'original';
}

/**
 * 画像URLを最適化された形式で取得
 */
export async function getOptimizedImageUrl(
  image: BlogImage,
  postSlug: string,
  config: Partial<ImageOptimizationConfig> = {}
): Promise<string> {
  const basePath = `/content/blog/posts/${postSlug}/images/${image.filename}`;
  
  // 最適化が無効または最適化済み画像がない場合
  if (!config.formats || !image.optimized) {
    return basePath;
  }

  // 最適な形式を選択
  const optimalFormat = await getOptimalImageFormat(
    getImageFormat(image.filename),
    config.formats
  );

  // 最適化済み画像のURLを返す
  if (optimalFormat === 'avif' && image.optimized.avif) {
    return image.optimized.avif;
  }
  if (optimalFormat === 'webp' && image.optimized.webp) {
    return image.optimized.webp;
  }
  
  return image.optimized.original || basePath;
}

/**
 * ファイル名から画像形式を取得
 */
export function getImageFormat(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'avif':
      return 'avif';
    case 'gif':
      return 'gif';
    default:
      return 'jpeg';
  }
}

/**
 * 画像のアスペクト比を計算
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * レスポンシブ画像のsrcSet文字列を生成
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[],
  quality: number = 85
): string {
  return widths
    .map(width => `${baseUrl}?w=${width}&q=${quality} ${width}w`)
    .join(', ');
}

/**
 * 画像読み込みエラーのリトライ処理
 */
export function retryImageLoad(
  src: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<string> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryLoad = () => {
      const img = new Image();
      
      img.onload = () => resolve(src);
      
      img.onerror = () => {
        attempts++;
        if (attempts >= maxRetries) {
          reject(new Error(`Failed to load image after ${maxRetries} attempts: ${src}`));
        } else {
          setTimeout(tryLoad, delay * attempts);
        }
      };
      
      img.src = src;
    };

    tryLoad();
  });
}

/**
 * 画像のプリロード
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 複数画像の並列プリロード
 */
export async function preloadImages(
  srcs: string[],
  maxConcurrent: number = 3
): Promise<void> {
  const chunks = [];
  for (let i = 0; i < srcs.length; i += maxConcurrent) {
    chunks.push(srcs.slice(i, i + maxConcurrent));
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(preloadImage));
  }
}

/**
 * 画像の遅延読み込み判定
 */
export function shouldLazyLoad(
  element: HTMLElement,
  threshold: number = 200
): boolean {
  if (typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  return rect.top > windowHeight + threshold;
}

/**
 * 画像最適化の統計情報を計算
 */
export function calculateOptimizationStats(images: BlogImage[]): {
  totalImages: number;
  optimizedImages: number;
  compressionRatio: number;
  formatDistribution: Record<string, number>;
} {
  const totalImages = images.length;
  const optimizedImages = images.filter(img => img.optimized).length;
  
  const originalSizes = images.map(img => img.fileSize || 0);
  const totalOriginalSize = originalSizes.reduce((sum, size) => sum + size, 0);
  
  // 圧縮率の概算（実際の最適化済みファイルサイズが必要）
  const estimatedOptimizedSize = totalOriginalSize * 0.7; // 30% 削減の仮定
  const compressionRatio = totalOriginalSize > 0 ? estimatedOptimizedSize / totalOriginalSize : 1;
  
  const formatDistribution = images.reduce((acc, img) => {
    const format = getImageFormat(img.filename);
    acc[format] = (acc[format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalImages,
    optimizedImages,
    compressionRatio,
    formatDistribution,
  };
}
