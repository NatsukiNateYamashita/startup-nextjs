// 🚀 NextAuth.js API Route Handler
// 作成日: 2025-07-11

import { handlers } from "@/lib/auth"

// Node.js Runtime を指定（bcryptjs対応）
export const runtime = "nodejs"

export const { GET, POST } = handlers
