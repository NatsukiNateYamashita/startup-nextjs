// 🚀 NIHONGO-AI NextAuth.js v5設定
// 作成日: 2025-07-11
// 説明: JWT + Prisma Adapter + OAuth統合設定

import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { Provider } from "next-auth/providers"

const prisma = new PrismaClient()

const providers: Provider[] = [
  // Google OAuth
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  
  // メール + パスワード認証
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string }
      })

      if (!user || !user.password) {
        return null
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      )

      if (!isPasswordValid) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    }
  })
]

// 将来的にLINE、Instagram追加予定
// LINE_CLIENT_IDとINSTAGRAM_CLIENT_IDが設定されたら有効化
if (process.env.LINE_CLIENT_ID && process.env.LINE_CLIENT_SECRET) {
  // LINEプロバイダー追加（将来）
}

if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
  // Instagramプロバイダー追加（将来）
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回サインイン時にユーザー情報をトークンに追加
      if (user) {
        token.id = user.id
        
        try {
          // ユーザーが存在することを確認してからアップデート
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
          })
          
          if (existingUser) {
            // ログイン回数を更新
            await prisma.user.update({
              where: { id: user.id },
              data: {
                lastLoginAt: new Date(),
                loginCount: { increment: 1 }
              }
            })
            
            // Stripe顧客情報も取得
            token.currentPlan = existingUser.currentPlan
            token.subscriptionStatus = existingUser.subscriptionStatus
            token.stripeCustomerId = existingUser.stripeCustomerId
          }
        } catch (error) {
          console.error("JWT callback error:", error)
          // エラーが発生してもトークン作成は続行
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // セッションにカスタム情報を追加
      if (token) {
        session.user.id = token.id as string
        session.user.currentPlan = token.currentPlan as string
        session.user.subscriptionStatus = token.subscriptionStatus as string
        session.user.stripeCustomerId = token.stripeCustomerId as string
      }
      
      return session
    },
    async signIn({ user, account, profile }) {
      // ソーシャルログイン時の追加処理
      if (account?.provider === "google" && profile && user.email) {
        try {
          // ユーザーが存在することを確認してからアップデート
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (existingUser) {
            // Google固有の情報を保存
            await prisma.user.update({
              where: { email: user.email },
              data: {
                image: profile.picture as string,
                name: profile.name || existingUser.name,
                // 必要に応じて他の情報も保存
              }
            })
          }
        } catch (error) {
          console.error("SignIn callback error:", error)
          // エラーが発生してもサインインは続行
        }
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // サインイン後のリダイレクト先制御
      // ダッシュボードまたは元のページに戻す
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  events: {
    async createUser({ user }) {
      // 新規ユーザー作成時の処理
      console.log(`新規ユーザー作成: ${user.email}`)
      
      try {
        // 新規ユーザーのデフォルト値を設定
        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentPlan: "FREE",
            subscriptionStatus: "ACTIVE",
            loginCount: 1,
            lastLoginAt: new Date(),
            createdAt: new Date(),
          }
        })
        
        console.log(`新規ユーザー初期化完了: ${user.email}`)
      } catch (error) {
        console.error("Create user event error:", error)
      }
      
      // 将来的にウェルカムメール送信、アナリティクス追跡等
    },
    async signIn({ user, account, profile, isNewUser }) {
      // サインイン時の処理
      console.log(`ユーザーサインイン: ${user.email}`)
      
      if (isNewUser) {
        // 新規ユーザーの場合の追加処理
        console.log("新規ユーザーのオンボーディング開始")
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
})

// TypeScript型拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      currentPlan: string
      subscriptionStatus: string
      stripeCustomerId: string
    } & DefaultSession["user"]
  }
  
  interface JWT {
    id: string
    currentPlan: string
    subscriptionStatus: string
    stripeCustomerId: string
  }
}
