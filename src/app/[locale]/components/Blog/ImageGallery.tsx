"use client";

import { useState } from "react";
import { BlogImage } from "@/app/[locale]/types/blog";
import { Locale } from "@/i18n/routing";
import BlogImageComponent from "./BlogImage";
import { calculateOptimizationStats } from "@/lib/blog/imageOptimization";

interface ImageGalleryProps {
  images: BlogImage[];
  postSlug: string;
  locale: Locale;
  showStats?: boolean;
  enableLightbox?: boolean;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  postSlug,
  locale,
  showStats = false,
  enableLightbox = true,
  className = "",
}) => {
  const [selectedImage, setSelectedImage] = useState<BlogImage | null>(null);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

  if (images.length === 0) {
    return null;
  }

  const stats = showStats ? calculateOptimizationStats(images) : null;

  // ライトボックスを閉じる
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  // ESCキーでライトボックスを閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  return (
    <div className={`image-gallery ${className}`}>
      {/* 統計情報パネル */}
      {showStats && stats && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              画像統計
            </h3>
            <button
              onClick={() => setShowStatsPanel(!showStatsPanel)}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {showStatsPanel ? '隠す' : '詳細'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">総画像数:</span>
              <span className="ml-2 font-medium">{stats.totalImages}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">最適化済み:</span>
              <span className="ml-2 font-medium">{stats.optimizedImages}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">圧縮率:</span>
              <span className="ml-2 font-medium">
                {Math.round((1 - stats.compressionRatio) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">形式:</span>
              <span className="ml-2 font-medium">
                {Object.keys(stats.formatDistribution).join(', ')}
              </span>
            </div>
          </div>

          {showStatsPanel && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium mb-2">形式別分布</h4>
              <div className="space-y-1">
                {Object.entries(stats.formatDistribution).map(([format, count]) => (
                  <div key={format} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{format.toUpperCase()}</span>
                    <span>{count} 枚</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 画像グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={image.filename} className="group">
            <div
              className={`${
                enableLightbox 
                  ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                  : ""
              }`}
              onClick={() => enableLightbox && setSelectedImage(image)}
            >
              <BlogImageComponent
                image={image}
                postSlug={postSlug}
                locale={locale}
                priority={index === 0}
                className="w-full"
                enableLazyLoading={index > 2}
                enableOptimization={true}
              />
            </div>
            
            {/* 画像情報 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div>{image.width}×{image.height}</div>
                {image.fileSize && (
                  <div>{Math.round(image.fileSize / 1024)}KB</div>
                )}
                <div>{image.mimeType}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ライトボックス */}
      {selectedImage && enableLightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-full max-h-full">
            {/* 閉じるボタン */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 画像 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <BlogImageComponent
                image={selectedImage}
                postSlug={postSlug}
                locale={locale}
                priority={true}
                className="max-w-screen-lg max-h-screen object-contain"
                enableLazyLoading={false}
                enableOptimization={true}
              />
            </div>

            {/* 画像情報 */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
              <h3 className="font-medium">{selectedImage.alt[locale]}</h3>
              {selectedImage.caption[locale] && (
                <p className="text-sm opacity-80 mt-1">
                  {selectedImage.caption[locale]}
                </p>
              )}
              <div className="text-xs opacity-60 mt-2">
                {selectedImage.width}×{selectedImage.height}
                {selectedImage.fileSize && (
                  <span className="ml-2">
                    ({Math.round(selectedImage.fileSize / 1024)}KB)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
