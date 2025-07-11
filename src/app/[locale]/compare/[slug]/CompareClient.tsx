"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import type { BilingualSentenceWithTag } from "@/lib/blog/compare";
import ScrollToTop from "@/app/[locale]/components/ScrollToTop";
import CompareToggleButton from "@/app/[locale]/components/CompareToggleButton";

interface Props {
  leftLang: string;
  rightLang: string;
  bilingual: BilingualSentenceWithTag[];
  slug: string;
  locale: string;
}

// 文レンダリング用コンポーネント分割（高さ同期対応版）
interface SentenceProps {
  html: string;
  tag?: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isEmpty?: boolean;
  fontSize: 'small' | 'medium' | 'large';
  minHeight?: string; // 最小高さを指定
}

const SentenceRenderer = ({ html, tag, isActive, onMouseEnter, onMouseLeave, isEmpty = false, fontSize, minHeight }: SentenceProps) => {
  // フォントサイズ別の余白設定
  const getSpacingClasses = (fontSize: 'small' | 'medium' | 'large') => {
    switch (fontSize) {
      case 'small':
        return {
          containerMargin: 'mb-0.5',
          innerMargin: 'mb-0.5',
          padding: 'p-2'
        };
      case 'medium':
        return {
          containerMargin: 'mb-1',
          innerMargin: 'mb-0.5',
          padding: 'p-2'
        };
      case 'large':
        return {
          containerMargin: 'mb-1.5',
          innerMargin: 'mb-1',
          padding: 'p-2'
        };
      default:
        return {
          containerMargin: "mb-0.5",
          innerMargin: "mb-0.5",
          padding: "p-2",
        };
    }
  };

  const spacing = getSpacingClasses(fontSize);

  const baseClasses = `${spacing.containerMargin} transition-all duration-200 cursor-pointer rounded-md ${
    isActive 
      ? `bg-primary/20 ring-2 ring-primary/30 ${spacing.padding}` 
      : isEmpty 
        ? `hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${spacing.padding}` 
        : `hover:bg-gray-50 dark:hover:bg-gray-800 ${spacing.padding}`
  } ${isEmpty ? "opacity-60" : ""}`;
  
  // フォントサイズと行間を一緒に管理
  const getFontSizeClasses = (tag: string) => {
    const sizeMap = {
      small: {
        h1: "text-lg sm:text-2xl md:text-3xl leading-tight",
        h2: "text-base sm:text-lg lg:text-base xl:text-lg leading-snug",
        h3: "text-sm sm:text-base leading-normal",
        default: "text-xs sm:text-sm leading-normal"
      },
      medium: {
        h1: "text-2xl sm:text-3xl md:text-4xl leading-tight",
        h2: "text-xl sm:text-2xl lg:text-xl xl:text-2xl leading-snug",
        h3: "text-lg sm:text-xl leading-normal",
        default: "text-base sm:text-lg leading-relaxed"
      },
      large: {
        h1: "text-3xl sm:text-4xl md:text-5xl leading-tight",
        h2: "text-2xl sm:text-3xl lg:text-2xl xl:text-3xl leading-snug",
        h3: "text-xl sm:text-2xl leading-normal",
        default: "text-lg sm:text-xl leading-relaxed"
      }
    };
    
    const currentSizeMap = sizeMap[fontSize];
    return (currentSizeMap as any)[tag] || currentSizeMap.default;
  };
  
  // サーバーサイドで既にマークダウンがHTMLに変換されているため、
  // クライアントサイドでは追加の変換処理は行わない
  const renderContent = () => {
    const commonClasses = "text-black dark:text-white";
    
    switch (tag) {
      case "h1": 
        return (
          <div 
            className={`${spacing.innerMargin} ${getFontSizeClasses('h1')} font-bold ${commonClasses}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case "h2": 
        return (
          <div 
            className={`${spacing.innerMargin} ${getFontSizeClasses('h2')} font-bold ${commonClasses}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case "h3": 
        return (
          <div 
            className={`${spacing.innerMargin} ${getFontSizeClasses('h3')} font-semibold ${commonClasses}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case "li": 
        return (
          <div
            className={`${spacing.innerMargin} ${getFontSizeClasses("default")} ${commonClasses}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      default: 
        return (
          <div 
            className={`${spacing.innerMargin} ${getFontSizeClasses('default')} ${commonClasses}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
    }
  };

  return (
    <div
      className={baseClasses}
      style={{ minHeight: minHeight || 'auto' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderContent()}
    </div>
  );
};

// 新しい対訳ペアコンポーネント
interface BilingualPairProps {
  sentence: BilingualSentenceWithTag;
  leftLang: string;
  rightLang: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  fontSize: 'small' | 'medium' | 'large';
  noCorrespondingMessage: string;
}

const BilingualPair = ({ 
  sentence, 
  leftLang, 
  rightLang, 
  isActive, 
  onMouseEnter, 
  onMouseLeave, 
  fontSize,
  noCorrespondingMessage 
}: BilingualPairProps) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<string>('auto');

  // 高さ同期のリセット機能追加
  const resetHeight = useCallback(() => {
    setMinHeight('auto');
    if (leftRef.current && rightRef.current) {
      leftRef.current.style.minHeight = 'auto';
      rightRef.current.style.minHeight = 'auto';
    }
  }, []);

  // 高さを同期させる効果（完全リセット版）
  const syncHeight = useCallback(() => {
    // まず完全にリセット
    resetHeight();
    
    // CSS適用を確実に待つ
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (leftRef.current && rightRef.current) {
          // 自然な高さを取得
          const leftHeight = leftRef.current.offsetHeight;
          const rightHeight = rightRef.current.offsetHeight;
          const maxHeight = Math.max(leftHeight, rightHeight);
          
          // 同じ高さを設定（ただし、差が小さい場合はスキップ）
          if (Math.abs(leftHeight - rightHeight) > 5) {
            const newMinHeight = `${maxHeight}px`;
            setMinHeight(newMinHeight);
          }
        }
      });
    }, 150); // より長い遅延でCSS適用確実に待機
  }, [resetHeight]);

  // フォントサイズ変更時は必ずリセット
  useEffect(() => {
    resetHeight(); // まずリセット
    const timer = setTimeout(() => {
      syncHeight(); // その後同期
    }, 200); // フォントサイズ変更後に十分な遅延
    
    return () => clearTimeout(timer);
  }, [fontSize, resetHeight, syncHeight]);

  // コンテンツ変更時の同期（フォントサイズ変更以外）
  useEffect(() => {
    if (sentence.left || sentence.right) {
      syncHeight();
    }
  }, [sentence.left, sentence.right, syncHeight]);

  // ウィンドウリサイズ時の同期
  useEffect(() => {
    const handleResize = () => {
      resetHeight();
      setTimeout(() => syncHeight(), 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resetHeight, syncHeight]);

  // ペア間の余白もフォントサイズに連動
  const getPairMargin = (fontSize: 'small' | 'medium' | 'large') => {
    switch (fontSize) {
      case 'small': return 'mb-1';
      case 'medium': return 'mb-1.5';
      case 'large': return 'mb-2';
      default: return 'mb-1.5';
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-4 ${getPairMargin(fontSize)}`}>
      {/* Left Panel */}
      <div ref={leftRef}>
        <SentenceRenderer
          html={
            sentence.left ||
            `<div class="text-gray-400 italic">${noCorrespondingMessage}</div>`
          }
          tag={sentence.leftTag}
          isActive={isActive}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          isEmpty={!sentence.left}
          fontSize={fontSize}
          minHeight={minHeight}
        />
      </div>

      {/* Right Panel */}
      <div ref={rightRef}>
        <SentenceRenderer
          html={
            sentence.right ||
            `<div class="text-gray-400 italic">${noCorrespondingMessage}</div>`
          }
          tag={sentence.rightTag}
          isActive={isActive}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          isEmpty={!sentence.right}
          fontSize={fontSize}
          minHeight={minHeight}
        />
      </div>
    </div>
  );
};

export default function CompareClient({ leftLang, rightLang, bilingual, slug, locale }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('small');
  const t = useTranslations('Compare');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const LANG_OPTIONS = [
    { value: "ja", label: t('languageLabels.ja') },
    { value: "en", label: t('languageLabels.en') },
    { value: "zh-CN", label: t('languageLabels.zh-CN') },
    { value: "zh-TW", label: t('languageLabels.zh-TW') },
  ];

  // 言語変更ハンドラー
  const handleLanguageChange = (side: 'left' | 'right', newLang: string) => {
    // URLパラメータを更新
    const params = new URLSearchParams(searchParams.toString());
    params.set(side === 'left' ? 'left' : 'right', newLang);
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Page Header Section */}
      <section className="pt-[150px] pb-[40px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[580px] text-center">
                <h1 className="mb-5 text-2xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight dark:text-white">
                  {t("title", { slug })}
                </h1>
                <p className="text-body-color dark:text-body-color-dark mb-12 text-base !leading-relaxed sm:text-lg md:text-xl">
                  {t("description")}
                </p>
                {/* Language Selection */}
                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-body-color dark:text-body-color-dark text-sm font-medium">
                      {t("leftLanguage")}
                    </label>
                    <select
                      value={leftLang}
                      onChange={(e) =>
                        handleLanguageChange("left", e.target.value)
                      }
                      className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary rounded border bg-[#f8f8f8] px-3 py-2 text-base transition-all duration-300 outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                    >
                      {LANG_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-primary mx-4 text-xl font-bold">⇔</div>

                  <div className="flex items-center gap-2">
                    <label className="text-body-color dark:text-body-color-dark text-sm font-medium">
                      {t("rightLanguage")}
                    </label>
                    <select
                      value={rightLang}
                      onChange={(e) =>
                        handleLanguageChange("right", e.target.value)
                      }
                      className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary rounded border bg-[#f8f8f8] px-3 py-2 text-base transition-all duration-300 outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                    >
                      {LANG_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Font Size Control */}
                <a>font size: </a>
                <div className="mb-8 flex justify-center gap-2">
                  <button
                    onClick={() => setFontSize("small")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      fontSize === "small"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    S
                  </button>
                  <button
                    onClick={() => setFontSize("medium")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      fontSize === "medium"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      fontSize === "large"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    L
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Content - 新しいレイアウト */}
      <section className="pt-[0px] pb-[120px]">
        <div className="container">
          <div className="shadow-three dark:bg-gray-dark rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
            {/* Header Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                {LANG_OPTIONS.find((l) => l.value === leftLang)?.label}
              </h2>
              <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                {LANG_OPTIONS.find((l) => l.value === rightLang)?.label}
              </h2>
            </div>

            {/* Content Rows */}
            <div className="max-h-[70vh] overflow-y-auto">
              {bilingual.map((sentence) => (
                <BilingualPair
                  key={sentence.id}
                  sentence={sentence}
                  leftLang={leftLang}
                  rightLang={rightLang}
                  isActive={hoverId === sentence.id}
                  onMouseEnter={() => setHoverId(sentence.id)}
                  onMouseLeave={() => setHoverId(null)}
                  fontSize={fontSize}
                  noCorrespondingMessage={t("noCorrespondingSentence")}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}