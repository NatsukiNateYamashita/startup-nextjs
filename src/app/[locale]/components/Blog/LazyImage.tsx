"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { BlogImage } from "@/app/[locale]/types/blog";
import { Locale } from "@/i18n/routing";
import { getOptimizedImageUrl, retryImageLoad } from "@/lib/blog/imageOptimization";

interface LazyImageProps {
  image: BlogImage;
  postSlug: string;
  locale: Locale;
  className?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  enableRetry?: boolean;
  maxRetries?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  image,
  postSlug,
  locale,
  className = "",
  priority = false,
  quality = 85,
  onLoad,
  onError,
  enableRetry = true,
  maxRetries = 3,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState<string>("");
  const imgRef = useRef<HTMLDivElement>(null);

  // 画像URLを取得
  useEffect(() => {
    const getImageUrl = async () => {
      try {
        const url = await getOptimizedImageUrl(image, postSlug, {
          quality,
          formats: ['webp', 'original'],
          enableLazyLoading: !priority,
          enableBlurDataURL: true,
        });
        setImageSrc(url);
      } catch (error) {
        console.error('Failed to get optimized image URL:', error);
        setImageSrc(`/images/blog/${postSlug}/${image.filename}`);
      }
    };

    getImageUrl();
  }, [image, postSlug, quality, priority]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // 画像読み込み成功時の処理
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  // 画像読み込みエラー時の処理
  const handleError = useCallback(async () => {
    if (enableRetry && !hasError) {
      try {
        // リトライ処理
        await retryImageLoad(imageSrc, maxRetries);
        handleLoad();
      } catch (retryError) {
        setIsLoading(false);
        setHasError(true);
        onError?.(retryError as Error);
      }
    } else {
      setIsLoading(false);
      setHasError(true);
      onError?.(new Error(`Failed to load image: ${imageSrc}`));
    }
  }, [enableRetry, hasError, imageSrc, maxRetries, handleLoad, onError]);

  const alt = image.alt[locale] || image.alt.ja || image.filename;

  // 遅延読み込み時のプレースホルダー
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse ${className}`}
        style={{
          width: "100%",
          aspectRatio: `${image.width} / ${image.height}`,
          minHeight: "200px",
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 text-gray-300 dark:text-gray-700">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px] ${className}`}
      >
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
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

  // メイン画像の表示
  return (
    <div className={`relative ${className}`}>
      {/* ローディング状態 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse z-10">
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 text-gray-400 dark:text-gray-600">
              <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 画像 */}
      <Image
        src={imageSrc}
        alt={alt}
        width={image.width}
        height={image.height}
        priority={priority}
        quality={quality}
        className={`w-full h-auto transition-all duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, (max-width: 1280px) 70vw, 60vw"
      />
    </div>
  );
};

export default LazyImage;
