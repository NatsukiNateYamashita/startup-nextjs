// 🚀 認証ユーティリティ関数
// 作成日: 2025-07-11
// 説明: パスワードハッシュ化、バリデーション、ユーザー作成等

import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

// バリデーションスキーマ
export const registerSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100, "名前は100文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/(?=.*[a-z])/, "パスワードには小文字を含めてください")
    .regex(/(?=.*[A-Z])/, "パスワードには大文字を含めてください")
    .regex(/(?=.*\d)/, "パスワードには数字を含めてください"),
  age: z.number().min(13, "13歳以上である必要があります").max(120, "有効な年齢を入力してください").optional(),
  organization: z.string().max(200, "組織名は200文字以内で入力してください").optional(),
})

export const signInSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードは必須です"),
})

// パスワードハッシュ化
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// パスワード検証
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 新規ユーザー作成
export async function createUser(data: z.infer<typeof registerSchema>) {
  try {
    // バリデーション
    const validatedData = registerSchema.parse(data)
    
    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      throw new Error("このメールアドレスは既に使用されています")
    }
    
    // パスワードハッシュ化
    const hashedPassword = await hashPassword(validatedData.password)
    
    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        age: validatedData.age,
        organization: validatedData.organization,
        currentPlan: "FREE",
        // デフォルト言語スキル（日本語学習者向け）
        languageSkills: {
          create: [
            {
              language: "japanese",
              skillType: "reading",
              level: 1, // 初心者レベル
            },
            {
              language: "japanese",
              skillType: "writing", 
              level: 1,
            },
            {
              language: "japanese",
              skillType: "speaking",
              level: 1,
            },
            {
              language: "japanese",
              skillType: "listening",
              level: 1,
            }
          ]
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        currentPlan: true,
        createdAt: true,
      }
    })
    
    return { success: true, user }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "バリデーションエラー",
        details: error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "ユーザー作成に失敗しました"
    }
  }
}

// ユーザー情報取得（プロフィール用）
export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        organization: true,
        occupation: true,
        location: true,
        preferredLanguage: true,
        learningGoals: true,
        currentPlan: true,
        subscriptionStatus: true,
        createdAt: true,
        lastLoginAt: true,
        languageSkills: {
          orderBy: [
            { language: 'asc' },
            { skillType: 'asc' }
          ]
        },
        socialAccounts: {
          where: { isActive: true },
          select: {
            provider: true,
            providerUsername: true,
            connectedAt: true
          }
        }
      }
    })
    
    if (!user) {
      return { success: false, error: "ユーザーが見つかりません" }
    }
    
    return { success: true, user }
  } catch (error) {
    return { 
      success: false, 
      error: "プロフィール取得に失敗しました"
    }
  }
}

// プロフィール更新
export async function updateUserProfile(userId: string, data: Partial<{
  name: string
  age: number
  gender: "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY"
  organization: string
  occupation: string
  location: string
  preferredLanguage: string
  learningGoals: string[]
}>) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: data as any, // 型安全性はクライアント側で保証
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    })
    
    return { success: true, user }
  } catch (error) {
    return { 
      success: false, 
      error: "プロフィール更新に失敗しました"
    }
  }
}

// 言語スキル更新
export async function updateLanguageSkill(
  userId: string, 
  language: string, 
  skillType: string, 
  level: number
) {
  try {
    await prisma.languageSkill.upsert({
      where: {
        userId_language_skillType: {
          userId,
          language,
          skillType
        }
      },
      update: {
        level,
        lastAssessedAt: new Date()
      },
      create: {
        userId,
        language,
        skillType,
        level
      }
    })
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: "言語スキル更新に失敗しました"
    }
  }
}
