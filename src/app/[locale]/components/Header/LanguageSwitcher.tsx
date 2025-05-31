"use client";
import { useState, useRef, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

const locales = routing.locales;

const localeLabels: Record<string, string> = {
  ja: "日",
  en: "EN",
  "zh-TW": "繁",
  "zh-CN": "简",
};

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split("/")[1];
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // 外側クリックで閉じる
  useLayoutEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // ドロップダウンの位置調整
  useLayoutEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      let top = buttonRect.bottom;
      setDropdownStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${buttonRect.right - dropdownRef.current.offsetWidth}px`,
        zIndex: 9999,
      });
    }
  }, [open]);

  const handleSelect = (locale: string) => {
    if (locale !== currentLocale) {
      const segments = pathname.split("/");
      segments[1] = locale;
      const newPath = segments.join("/");
      router.push(newPath);
    }
    setOpen(false);
  };

  return (
    <div className="relative ml-2 flex items-center" ref={ref}>
      <button
        type="button"
        aria-label="言語切り替え"
        onClick={() => setOpen((v) => !v)}
        className="focus:outline-none"
        ref={buttonRef}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 stroke-current md:h-6 md:w-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M2 12h20" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M12 2c2 3 3 7 3 10s-1 7-3 10c-2-3-3-7-3-10s1-7 3-10z"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          ref={dropdownRef}
          style={dropdownStyle}
          className="rounded border border-gray-200 bg-white text-sm shadow dark:border-gray-700 dark:bg-gray-800"
        >
          {locales.map((locale) => (
            <li
              key={locale}
              className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleSelect(locale)}
            >
              <span className="flex-1">
                {localeLabels[locale] || locale.toUpperCase()}
              </span>
              {locale === currentLocale && (
                <svg
                  className="ml-2 h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
