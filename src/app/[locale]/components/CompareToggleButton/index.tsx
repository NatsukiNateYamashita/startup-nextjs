"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CompareToggleButtonProps {
  locale: string;
  slug: string;
}

export default function CompareToggleButton({ locale, slug }: CompareToggleButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("CompareToggleButton");
  const [showTooltip, setShowTooltip] = useState(false);

  // 現在のページタイプを判定
  const isComparePage = pathname.includes('/compare/');

  useEffect(() => {
    // localStorage のキーを多言語対応
    const storageKey = `compareButtonTooltip_${locale}`;
    const hasSeenTooltip = localStorage.getItem(storageKey);
    
    if (!hasSeenTooltip) {
      // 1秒後に表示（ページ読み込み完了を待つ）
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [locale]);

  // 遷移先を決定する関数
  const getTargetPath = () => {
    if (isComparePage) {
      // compareページ → blogページ
      return `/blog/${slug}`;
    } else {
      // blogページ → compareページ
      return `/compare/${slug}`;
    }
  };

  // ページ遷移処理
  const handleNavigation = () => {
    const targetPath = getTargetPath();
    router.push(targetPath);
  };

  const handleDontShowAgain = () => {
    const storageKey = `compareButtonTooltip_${locale}`;
    localStorage.setItem(storageKey, 'seen');
    setShowTooltip(false);
  };

  const handleClose = () => {
    setShowTooltip(false);
  };

  // アイコンを決定
  const renderIcon = () => {
    if (isComparePage) {
      // 文書アイコン（記事に戻る）
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M3 2h8v1H3V2zm0 2h10v1H3V4zm0 2h8v1H3V6zm0 2h10v1H3V8zm0 2h6v1H3v-1z"
            fill="currentColor"
          />
          <rect
            x="2"
            y="1"
            width="12"
            height="13"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      );
    } else {
      // 比較アイコン（2つの文書を並べた感じ）
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          {/* 左の文書 */}
          <rect
            x="0"
            y="2"
            width="6"
            height="10"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <line x1="2" y1="4" x2="6" y2="4" stroke="currentColor" strokeWidth="0.5" />
          <line x1="2" y1="6" x2="6" y2="6" stroke="currentColor" strokeWidth="0.5" />
          <line x1="2" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="0.5" />
          
          {/* 右の文書 */}
          <rect
            x="10"
            y="2"
            width="6"
            height="10"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <line x1="10" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="0.5" />
          
          {/* 比較を表す矢印 */}
          <path
            d="M7.5 7L8.5 7"
            stroke="currentColor"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="4"
              markerHeight="4"
              refX="3"
              refY="2"
              orient="auto"
            >
              <polygon
                points="0 0, 4 2, 0 4"
                fill="currentColor"
              />
            </marker>
          </defs>
        </svg>
      );
    }
  };

  // アリアラベルを決定
  const getAriaLabel = () => {
    if (isComparePage) {
      return "back to article";
    } else {
      return "compare translations";
    }
  };


  return (
    <>
      <div className="relative mb-20">
        {/* ツールチップ */}
        {showTooltip && (
          <div className="animate-slideIn absolute right-0 z-50">
            <div className="relative w-72 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-4 text-sm text-white shadow-xl">
              {/* 閉じるボタン */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label={t("tooltip.close")}
              >
                ×
              </button>

              {/* コンテンツ */}
              <div className="pr-2">
                <h4 className="mb-2 text-sm font-bold text-white">
                  {t("tooltip.title")}
                </h4>
                <div className="text-xs leading-relaxed">
                  {t("tooltip.description")
                    .split("\n")
                    .map((line, index) => (
                      <p key={index} className="text-white/90">
                        {line}
                      </p>
                    ))}
                  <p className="text-blue-200">{t("tooltip.backToNormal")}</p>
                </div>

                {/* アクションボタン */}
                <div className="flex justify-end">
                  <button
                    onClick={handleDontShowAgain}
                    className="font-small rounded-full bg-white/20 px-3 py-1.5 text-xs transition-colors hover:bg-white/30"
                  >
                    {t("tooltip.dontShowAgain")}
                  </button>
                </div>
              </div>
              {/* 矢印 - ボタンの上から下に向く */}
              <div className="absolute bottom-[-8px] right-2 transform">
                <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-purple-600"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative mb-4">
        {/* ボタン本体 */}
        <button
          onClick={handleNavigation}
          className="bg-primary hover:shadow-signUp flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white shadow-md transition duration-300 ease-in-out hover:scale-105"
          aria-label={getAriaLabel()}
        >
          {renderIcon()}
        </button>
      </div>
    </>
  );
}
