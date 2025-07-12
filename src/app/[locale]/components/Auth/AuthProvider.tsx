// 🚀 NextAuth Session Provider
// 作成日: 2025-07-11
// 説明: NextAuth.jsのセッション管理プロバイダー

"use client"

import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
