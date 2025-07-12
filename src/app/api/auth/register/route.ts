// 🚀 ユーザー登録API Route
// 作成日: 2025-07-11

import { NextRequest, NextResponse } from "next/server"
import { createUser, registerSchema } from "@/lib/auth-utils"

// Node.js Runtime を指定（bcryptjs対応）
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    const validation = registerSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "入力データが正しくありません",
          details: validation.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }
    
    // ユーザー作成
    const result = await createUser(validation.data)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: "ユーザーが正常に作成されました",
        user: result.user 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Register API Error:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "サーバーエラーが発生しました"
      },
      { status: 500 }
    )
  }
}
