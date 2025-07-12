// 🚀 ログアウトボタン Client Component
// 作成日: 2025-07-11
// 説明: NextAuth.js signOut機能の実装

"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className = "" }: LogoutButtonProps) => {
  const t = useTranslations("Auth");

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/", // ログアウト後にホームページにリダイレクト
        redirect: true,
      });
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white 
        hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
        transition-colors duration-200 ease-in-out
        ${className}
      `}
    >
      <svg
        className="mr-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      {t("logout")}
    </button>
  );
};

export default LogoutButton;
