
// 🚀 NIHONGO-AI Middleware
// 作成日: 2025-07-11 (更新)
// 説明: 認証保護と国際化対応のミドルウェア

import { auth } from "@/lib/auth"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

// next-intlミドルウェア作成
const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: 'always', // 常に /ja のようにロケールを含める
})

// 認証が必要なページ
const protectedPaths = [
  '/dashboard',
  '/profile', 
  '/billing',
  '/settings',
  '/subscription'
]

// 認証済みユーザーがアクセスできないページ
const authPaths = [
  '/signin',
  '/signup'
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  
  // パスから言語コードを除去
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/'
  
  // 保護されたページへの未認証アクセス
  if (!isLoggedIn && protectedPaths.some(path => pathWithoutLocale.startsWith(path))) {
    const locale = pathname.split('/')[1] || 'ja'
    const signInUrl = new URL(`/${locale}/signin`, req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return Response.redirect(signInUrl)
  }
  
  // 認証済みユーザーがauth系ページにアクセス
  if (isLoggedIn && authPaths.some(path => pathWithoutLocale.startsWith(path))) {
    const locale = pathname.split('/')[1] || 'ja'
    return Response.redirect(new URL(`/${locale}/dashboard`, req.url))
  }
  
  // next-intlミドルウェアを実行
  return intlMiddleware(req)
})

export const config = {
  // next-intlとNextAuth.jsの両方に対応
  matcher: [
    // APIルートとstatic filesを除外
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}