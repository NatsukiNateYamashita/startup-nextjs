'use client';

import { BlogImage } from '@/app/[locale]/types/blog';
import { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { useState } from 'react';

interface BlogImageProps {
  image: BlogImage;
  postSlug: string;
  locale: Locale;
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
}

const BlogImageComponent: React.FC<BlogImageProps> = ({
  image,
  postSlug,
  locale,
  priority = false,
  className = '',
  showCaption = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 画像のソースパスを構築
  const imageSrc = `/content/blog/posts/${postSlug}/images/${image.filename}`;
  
  // 現在のロケールのalt/captionを取得
  const alt = image.alt[locale] || image.alt.ja || image.filename;
  const caption = image.caption[locale] || image.caption.ja || '';

  // sizes属性を構築（レスポンシブ対応）
  const sizes = "(max-width: 640px) 100vw, (max-width: 828px) 100vw, (max-width: 1080px) 100vw, (max-width: 1200px) 100vw, 100vw";

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // エラー時のフォールバック表示
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            画像を読み込めませんでした
          </p>
        </div>
      </div>
    );
  }

  return (
    <figure className={`relative ${className}`}>
      {/* ローディング状態の表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
          <div className="w-8 h-8 text-gray-400 dark:text-gray-600">
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}

      {/* メイン画像 */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <Image
          src={imageSrc}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className={`w-full h-auto object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoadingComplete}
          onError={handleError}
          quality={90}
        />
      </div>

      {/* キャプション */}
      {showCaption && caption && (
        <figcaption className="mt-2 text-center text-sm text-body-color/80 dark:text-body-color-dark/80 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default BlogImageComponent;
