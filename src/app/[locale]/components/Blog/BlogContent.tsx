'use client';

import { useEffect, useRef } from 'react';
import { Locale } from '@/i18n/routing';

interface ImageCaptionData {
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
}

interface BlogContentProps {
  content: string;
  postSlug: string;
  locale: Locale;
}

const BlogContent: React.FC<BlogContentProps> = ({ content, postSlug, locale }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processImages = async () => {
      if (!contentRef.current) return;

      try {
        // captions.jsonを取得
        const captionsResponse = await fetch(`/images/blog/${postSlug}/captions.json`);
        const captions: Record<string, ImageCaptionData> = captionsResponse.ok 
          ? await captionsResponse.json() 
          : {};

        // data-image-componentを持つ要素を検索
        const imageContainers = contentRef.current.querySelectorAll('[data-image-component="true"]');
        
        imageContainers.forEach((container) => {
          const element = container as HTMLElement;
          const filename = element.dataset.filename;
          const postSlugData = element.dataset.postSlug;

          if (filename && postSlugData) {
            const imageCaptions = captions[filename];
            const alt = imageCaptions?.alt?.[locale] || filename;
            const caption = imageCaptions?.caption?.[locale] || '';

            // 既存の画像要素を取得または作成
            let imgElement = element.querySelector('img');
            if (!imgElement) {
              imgElement = document.createElement('img');
              element.appendChild(imgElement);
            }

            // 画像属性を設定
            imgElement.src = `/images/blog/${postSlugData}/${filename}`;
            imgElement.alt = alt;
            imgElement.className = "w-full h-auto object-cover transition-all duration-300 hover:scale-105 rounded-lg";
            imgElement.loading = "lazy";
            imgElement.decoding = "async";

            // キャプションを追加
            if (caption) {
              let figcaption = element.querySelector('figcaption');
              if (!figcaption) {
                figcaption = document.createElement('figcaption');
                figcaption.className = "mt-3 text-center text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed";
                element.appendChild(figcaption);
              }
              figcaption.textContent = caption;
            }
          }
        });
      } catch (error) {
        console.warn('Failed to load image captions:', error);
      }
    };

    processImages();
  }, [content, postSlug, locale]);

  return (
    <div
      ref={contentRef}
      className="blog-details prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
