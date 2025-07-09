"use client";

import { useRouter, usePathname } from "@/i18n/navigation";

interface CompareToggleButtonProps {
  locale: string;
  slug: string;
}

export default function CompareToggleButton({ locale, slug }: CompareToggleButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 現在のページタイプを判定
  const isComparePage = pathname.includes('/compare/');

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
          className="h-4 w-4"
        >
          {/* 左の文書 */}
          <rect
            x="1"
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
            x="9"
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
    <div
      onClick={handleNavigation}
      aria-label={getAriaLabel()}
      className="bg-primary hover:shadow-signUp flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-white shadow-md transition duration-300 ease-in-out"
    >
      {renderIcon()}
    </div>
  );
}
