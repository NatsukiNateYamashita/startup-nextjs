import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { calculateProfileCompletion } from '@/lib/constants/user-profile';

const prisma = new PrismaClient();

// プロフィール更新のバリデーションスキーマ
const updateProfileSchema = z.object({
  role: z.string().optional(),
  experience: z.string().optional(),
  japanese_language_level: z.number().int().min(1).max(6).optional(),
  interests: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
  pain_points: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  budget_range: z.string().optional(),
  is_educator: z.boolean().optional(),
  // 個人情報 (オプショナル)
  age: z.number().int().min(0).max(120).optional(),
  occupation: z.string().optional(),
  location: z.string().optional(),
  // 行動データ
  timezone: z.string().optional(),
  region: z.string().optional(),
  native_language: z.string().optional(),
  available_languages: z.array(z.string()).optional(),
  device_type: z.string().optional(),
  access_pattern: z.string().optional(),
  decision_maker: z.boolean().optional(),
  // プロフィール完成度を手動で更新する場合
  profile_completion: z.number().min(0).max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // リクエストボディをパース
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // ユーザーの現在のデータを取得
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // データを更新
    const updateData: any = {};
    
    if (validatedData.role !== undefined) {
      updateData.role = validatedData.role;
    }
    if (validatedData.experience !== undefined) {
      updateData.experience = validatedData.experience;
    }
    if (validatedData.japanese_language_level !== undefined) {
      updateData.japanese_language_level = validatedData.japanese_language_level;
    }
    if (validatedData.interests !== undefined) {
      updateData.interests = validatedData.interests;
    }
    if (validatedData.learningGoals !== undefined) {
      updateData.learningGoals = validatedData.learningGoals;
    }
    if (validatedData.pain_points !== undefined) {
      updateData.pain_points = validatedData.pain_points;
    }
    if (validatedData.goals !== undefined) {
      updateData.goals = validatedData.goals;
    }
    if (validatedData.budget_range !== undefined) {
      updateData.budget_range = validatedData.budget_range;
    }
    if (validatedData.is_educator !== undefined) {
      updateData.is_educator = validatedData.is_educator;
    }
    if (validatedData.age !== undefined) {
      updateData.age = validatedData.age;
    }
    if (validatedData.occupation !== undefined) {
      updateData.occupation = validatedData.occupation;
    }
    if (validatedData.location !== undefined) {
      updateData.location = validatedData.location;
    }
    if (validatedData.timezone !== undefined) {
      updateData.timezone = validatedData.timezone;
    }
    if (validatedData.region !== undefined) {
      updateData.region = validatedData.region;
    }
    if (validatedData.native_language !== undefined) {
      updateData.native_language = validatedData.native_language;
    }
    if (validatedData.available_languages !== undefined) {
      updateData.available_languages = validatedData.available_languages;
    }
    if (validatedData.device_type !== undefined) {
      updateData.device_type = validatedData.device_type;
    }
    if (validatedData.access_pattern !== undefined) {
      updateData.access_pattern = validatedData.access_pattern;
    }
    if (validatedData.decision_maker !== undefined) {
      updateData.decision_maker = validatedData.decision_maker;
    }

    // 現在のデータとマージして完成度を計算
    const mergedData = { ...currentUser, ...updateData };
    const completionPercentage = validatedData.profile_completion ?? 
      calculateProfileCompletion(mergedData);

    updateData.profile_completion = completionPercentage;
    updateData.profile_last_updated = new Date();

    // データベースを更新
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        experience: true,
        japanese_language_level: true,
        interests: true,
        learningGoals: true,
        pain_points: true,
        goals: true,
        budget_range: true,
        is_educator: true,
        age: true,
        occupation: true,
        location: true,
        timezone: true,
        profile_completion: true,
        profile_last_updated: true,
        region: true,
        native_language: true,
        available_languages: true,
        device_type: true,
        access_pattern: true,
        decision_maker: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      completionPercentage,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET エンドポイント: プロフィール情報を取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        experience: true,
        japanese_language_level: true,
        interests: true,
        learningGoals: true,
        pain_points: true,
        goals: true,
        budget_range: true,
        is_educator: true,
        age: true,
        occupation: true,
        location: true,
        timezone: true,
        profile_completion: true,
        profile_last_updated: true,
        region: true,
        native_language: true,
        available_languages: true,
        device_type: true,
        access_pattern: true,
        decision_maker: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 完成度を再計算して最新にする
    const completionPercentage = calculateProfileCompletion(user);
    
    if (completionPercentage !== user.profile_completion) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { profile_completion: completionPercentage },
      });
      user.profile_completion = completionPercentage;
    }

    return NextResponse.json({
      user,
      completionPercentage,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
