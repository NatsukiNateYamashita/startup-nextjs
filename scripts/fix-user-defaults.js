// 既存ユーザーのデフォルト値を設定するスクリプト
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserDefaults() {
  console.log('🔧 既存ユーザーのデフォルト値を設定中...');
  
  try {
    // すべてのユーザーを取得
    const users = await prisma.user.findMany();
    console.log(`📊 ${users.length}人のユーザーを見つけました`);
    
    for (const user of users) {
      const updateData = {};
      
      // subscriptionStatusがnullの場合はACTIVEに設定
      if (!user.subscriptionStatus) {
        updateData.subscriptionStatus = 'ACTIVE';
      }
      
      // currentPlanがnullの場合はFREEに設定
      if (!user.currentPlan) {
        updateData.currentPlan = 'FREE';
      }
      
      // loginCountが0または未設定の場合は1に設定
      if (!user.loginCount || user.loginCount === 0) {
        updateData.loginCount = 1;
      }
      
      // lastLoginAtが未設定の場合は現在時刻に設定
      if (!user.lastLoginAt) {
        updateData.lastLoginAt = new Date();
      }
      
      // アップデートが必要な場合のみ実行
      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });
        console.log(`✅ ユーザー ${user.email} を更新しました:`, updateData);
      } else {
        console.log(`⏭️  ユーザー ${user.email} は既に適切に設定されています`);
      }
    }
    
    console.log('🎉 すべてのユーザーの設定が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserDefaults();
