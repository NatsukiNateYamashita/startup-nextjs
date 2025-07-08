"use client";
import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import type { BilingualSentenceWithTag } from "@/lib/blog/compare";

interface Props {
  leftLang: string;
  rightLang: string;
  bilingual: BilingualSentenceWithTag[];
  slug: string;
}

// 文レンダリング用コンポーネント分割
interface SentenceProps {
  html: string;
  tag?: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isEmpty?: boolean;
}

const SentenceRenderer = ({ html, tag, isActive, onMouseEnter, onMouseLeave, isEmpty = false }: SentenceProps) => {
  const baseClasses = `mb-4 transition-all duration-200 cursor-pointer rounded-md ${
    isActive 
      ? "bg-primary/20 ring-2 ring-primary/30 p-3" 
      : isEmpty 
        ? "hover:bg-gray-50/50 dark:hover:bg-gray-800/50 p-2" 
        : "hover:bg-gray-50 dark:hover:bg-gray-800 p-2"
  } ${isEmpty ? "opacity-60" : ""}`;
  
  // サーバーサイドで既にマークダウンがHTMLに変換されているため、
  // クライアントサイドでは追加の変換処理は行わない
  const renderContent = () => {
    const commonClasses = "text-black dark:text-white";
    
    switch (tag) {
      case "h1": 
        return (
          <div 
            className={`mb-5 text-2xl font-bold leading-tight ${commonClasses} sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight prose-h1:mb-0`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case "h2": 
        return (
          <div 
            className={`mb-4 text-xl font-bold ${commonClasses} sm:text-2xl lg:text-xl xl:text-2xl prose-h2:mb-0`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case "h3": 
        return (
          <div 
            className={`mb-3 text-lg font-semibold ${commonClasses} sm:text-xl prose-h3:mb-0`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      case "li": 
        return (
          <div 
            className={`mb-2 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg prose-li:mb-0`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      default: 
        return (
          <div 
            className={`mb-2 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg prose-p:mb-0`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
    }
  };

  return (
    <div
      className={baseClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderContent()}
    </div>
  );
};

export default function CompareClient({ leftLang, rightLang, bilingual, slug }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
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

  // スクロール同期用のrefs
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // スクロール同期用の状態
  const [isScrolling, setIsScrolling] = useState(false);

  // スクロール同期ハンドラー
  const handleScrollSync = useCallback((source: 'left' | 'right') => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    const sourcePanel = source === 'left' ? leftPanelRef.current : rightPanelRef.current;
    const targetPanel = source === 'left' ? rightPanelRef.current : leftPanelRef.current;
    
    if (sourcePanel && targetPanel) {
      const scrollRatio = sourcePanel.scrollTop / (sourcePanel.scrollHeight - sourcePanel.clientHeight);
      const targetScrollTop = scrollRatio * (targetPanel.scrollHeight - targetPanel.clientHeight);
      targetPanel.scrollTop = targetScrollTop;
    }
    
    // 短時間でスクロールを再度有効化
    setTimeout(() => setIsScrolling(false), 50);
  }, [isScrolling]);

  return (
    <>
      {/* Page Header Section */}
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[580px] text-center">
                <h1 className="mb-5 text-2xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  {t('title', { slug })}
                </h1>
                <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  {t('description')}
                </p>
                
                {/* Language Selection */}
                <div className="mb-8 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-body-color dark:text-body-color-dark">
                      {t('leftLanguage')}
                    </label>
                    <select 
                      value={leftLang} 
                      onChange={(e) => handleLanguageChange('left', e.target.value)}
                      className="rounded border border-stroke bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      {LANG_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mx-4 text-xl font-bold text-primary">⇔</div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-body-color dark:text-body-color-dark">
                      {t('rightLanguage')}
                    </label>
                    <select 
                      value={rightLang} 
                      onChange={(e) => handleLanguageChange('right', e.target.value)}
                      className="rounded border border-stroke bg-[#f8f8f8] px-3 py-2 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      {LANG_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Content */}
      <section className="pb-[120px] pt-[40px]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="w-full">
              <div className="rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h2 className="mb-6 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  {LANG_OPTIONS.find(l => l.value === leftLang)?.label}
                </h2>
                <div 
                  ref={leftPanelRef}
                  className="max-h-[70vh] overflow-y-auto space-y-2"
                  onScroll={() => handleScrollSync('left')}
                >
                  {bilingual.map((s) => (
                    <SentenceRenderer
                      key={`left-${s.id}`}
                      html={s.left || `<div class="text-gray-400 italic">${t('noCorrespondingSentence')}</div>`}
                      tag={s.leftTag}
                      isActive={hoverId === s.id}
                      onMouseEnter={() => setHoverId(s.id)}
                      onMouseLeave={() => setHoverId(null)}
                      isEmpty={!s.left}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full">
              <div className="rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h2 className="mb-6 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  {LANG_OPTIONS.find(l => l.value === rightLang)?.label}
                </h2>
                <div 
                  ref={rightPanelRef}
                  className="max-h-[70vh] overflow-y-auto space-y-2"
                  onScroll={() => handleScrollSync('right')}
                >
                  {bilingual.map((s) => (
                    <SentenceRenderer
                      key={`right-${s.id}`}
                      html={s.right || `<div class="text-gray-400 italic">${t('noCorrespondingSentence')}</div>`}
                      tag={s.rightTag}
                      isActive={hoverId === s.id}
                      onMouseEnter={() => setHoverId(s.id)}
                      onMouseLeave={() => setHoverId(null)}
                      isEmpty={!s.right}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
