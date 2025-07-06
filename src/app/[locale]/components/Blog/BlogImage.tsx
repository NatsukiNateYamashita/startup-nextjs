'use client';

import { BlogImage } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface BlogImageProps {
  image: BlogImage;
  postSlug: string;
  locale: Locale;
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
  enableLazyLoading?: boolean;
  enableOptimization?: boolean;
}

const BlogImageComponent: React.FC<BlogImageProps> = ({
  image,
  postSlug,
  locale,
  priority = false,
  className = '',
  showCaption = true,
  enableLazyLoading = true,
  enableOptimization = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!enableLazyLoading || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableLazyLoading || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [enableLazyLoading, priority, isInView]);

  // 画像のソースパスを構築（最適化対応）
  const getImageSrc = () => {
    const basePath = `/images/blog/${postSlug}/${image.filename}`;
    
    if (!enableOptimization) return basePath;
    
    // WebP対応ブラウザの場合はWebP画像を優先
    if (image.optimized?.webp && typeof window !== 'undefined') {
      // WebP対応チェック（簡易版）
      const canvas = document.createElement('canvas');
      const canSupportWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      if (canSupportWebP) {
        return image.optimized.webp;
      }
    }
    
    return image.optimized?.original || basePath;
  };
  
  // 現在のロケールのalt/captionを取得
  const alt = image.alt[locale] || image.alt.ja || image.filename;
  const caption = image.caption[locale] || image.caption.ja || '';

  // sizes属性を構築（レスポンシブ対応強化）
  const sizes = [
    "(max-width: 640px) 100vw",
    "(max-width: 768px) 90vw", 
    "(max-width: 1024px) 80vw",
    "(max-width: 1280px) 70vw",
    "60vw"
  ].join(", ");

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 遅延読み込み時のプレースホルダー
  if (enableLazyLoading && !isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse ${className}`}
        style={{ 
          minHeight: `${Math.min(image.height, 400)}px`,
          aspectRatio: `${image.width} / ${image.height}`
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 text-gray-300 dark:text-gray-700">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // エラー時のフォールバック表示
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px] ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            画像を読み込めませんでした
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {image.filename}
          </p>
        </div>
      </div>
    );
  }

  return (
    <figure className={`relative group ${className}`}>
      {/* ローディング状態の表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse z-10">
          <div className="w-8 h-8 text-gray-400 dark:text-gray-600">
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}

      {/* メイン画像 */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        <Image
          src={getImageSrc()}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className={`w-full h-auto object-cover transition-all duration-300 ${
            isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          } group-hover:scale-105`}
          onLoad={handleLoadingComplete}
          onError={handleError}
          quality={enableOptimization ? 85 : 90}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
        />
        
        {/* 画像情報のオーバーレイ（開発時のみ） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {image.width}×{image.height}
            {image.fileSize && (
              <span className="ml-1">
                ({Math.round(image.fileSize / 1024)}KB)
              </span>
            )}
          </div>
        )}
      </div>

      {/* キャプション */}
      {showCaption && caption && (
        <figcaption className="mt-3 text-center text-sm text-body-color/80 dark:text-body-color-dark/80 italic leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default BlogImageComponent;
