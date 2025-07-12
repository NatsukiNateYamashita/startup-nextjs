// 🎯 ユーザー属性収集システム - 型定義
// プログレッシブ・プロフィール完成方式

export const USER_ROLES = {
  JAPANESE_TEACHER: 'japanese_teacher',
  JAPANESE_LEARNER: 'japanese_learner', 
  SCHOOL_STAFF: 'school_staff',
  ENGINEER: 'engineer',
  RESEARCHER: 'researcher',
  OTHER: 'other'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  ONE_TO_THREE: '1-3years',
  THREE_TO_TEN: '3-10years', 
  OVER_TEN: '10years+'
} as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVELS[keyof typeof EXPERIENCE_LEVELS];

export const INTERESTS = {
  AI_ARTICLE: 'ai_article',
  MATERIAL_CREATION: 'material_creation',
  TRANSLATION: 'translation',
  COMMUNITY: 'community'
} as const;

export type Interest = typeof INTERESTS[keyof typeof INTERESTS];

export const BUDGET_RANGES = {
  FREE_ONLY: 'free_only',
  UP_TO_3000: 'up_to_3000',
  UP_TO_10000: 'up_to_10000',
  OVER_10000: 'over_10000'
} as const;

export type BudgetRange = typeof BUDGET_RANGES[keyof typeof BUDGET_RANGES];

export const JAPANESE_LEVELS = {
  BEGINNER: 1,      // N5-N4
  ELEMENTARY: 2,    // N3
  INTERMEDIATE: 3,  // N2
  ADVANCED: 4,      // N1
  SUPER_ADVANCED: 5, // 超上級
  NATIVE: 6         // ネイティブ
} as const;

export type JapaneseLevel = typeof JAPANESE_LEVELS[keyof typeof JAPANESE_LEVELS];

// 翻訳キーとの対応
export const ROLE_TRANSLATION_KEYS = {
  [USER_ROLES.JAPANESE_TEACHER]: 'options.role.japanese_teacher',
  [USER_ROLES.JAPANESE_LEARNER]: 'options.role.japanese_learner',
  [USER_ROLES.SCHOOL_STAFF]: 'options.role.school_staff', 
  [USER_ROLES.ENGINEER]: 'options.role.engineer',
  [USER_ROLES.RESEARCHER]: 'options.role.researcher',
  [USER_ROLES.OTHER]: 'options.role.other'
};

export const EXPERIENCE_TRANSLATION_KEYS = {
  [EXPERIENCE_LEVELS.BEGINNER]: 'options.experience.beginner',
  [EXPERIENCE_LEVELS.ONE_TO_THREE]: 'options.experience.one_to_three',
  [EXPERIENCE_LEVELS.THREE_TO_TEN]: 'options.experience.three_to_ten',
  [EXPERIENCE_LEVELS.OVER_TEN]: 'options.experience.over_ten'
};

export const INTEREST_TRANSLATION_KEYS = {
  [INTERESTS.AI_ARTICLE]: 'options.interests.ai_article',
  [INTERESTS.MATERIAL_CREATION]: 'options.interests.material_creation',
  [INTERESTS.TRANSLATION]: 'options.interests.translation',
  [INTERESTS.COMMUNITY]: 'options.interests.community'
};

export const BUDGET_TRANSLATION_KEYS = {
  [BUDGET_RANGES.FREE_ONLY]: 'options.budget.free_only',
  [BUDGET_RANGES.UP_TO_3000]: 'options.budget.up_to_3000',
  [BUDGET_RANGES.UP_TO_10000]: 'options.budget.up_to_10000',
  [BUDGET_RANGES.OVER_10000]: 'options.budget.over_10000'
};

export const JAPANESE_LEVEL_TRANSLATION_KEYS = {
  [JAPANESE_LEVELS.BEGINNER]: 'options.japanese_level.beginner',
  [JAPANESE_LEVELS.ELEMENTARY]: 'options.japanese_level.elementary',
  [JAPANESE_LEVELS.INTERMEDIATE]: 'options.japanese_level.intermediate',
  [JAPANESE_LEVELS.ADVANCED]: 'options.japanese_level.advanced',
  [JAPANESE_LEVELS.SUPER_ADVANCED]: 'options.japanese_level.super_advanced',
  [JAPANESE_LEVELS.NATIVE]: 'options.japanese_level.native'
};

// プロフィール質問の定義
export interface ProfileQuestion {
  field: string;
  type: 'select' | 'multiselect' | 'input' | 'boolean';
  options?: string[];
  weight: number; // プロフィール完成度への貢献度
  required?: boolean;
}

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    field: 'role',
    type: 'select',
    options: Object.values(USER_ROLES),
    weight: 15,
    required: true
  },
  {
    field: 'japanese_language_level',
    type: 'select',
    options: Object.values(JAPANESE_LEVELS).map(String),
    weight: 10,
    required: false
  },
  {
    field: 'is_educator',
    type: 'boolean',
    weight: 10,
    required: false
  },
  {
    field: 'interests',
    type: 'multiselect',
    options: Object.values(INTERESTS),
    weight: 15,
    required: false
  },
  {
    field: 'goals',
    type: 'input',
    weight: 10,
    required: false
  },
  {
    field: 'budget_range',
    type: 'select',
    options: Object.values(BUDGET_RANGES),
    weight: 10,
    required: false
  },
  {
    field: 'age',
    type: 'input',
    weight: 5,
    required: false
  },
  {
    field: 'organization',
    type: 'input',
    weight: 5,
    required: false
  }
];

// プロフィール完成度計算
export const calculateProfileCompletion = (user: any): number => {
  let progress = 20; // 基本情報（メール、名前）
  
  if (user.age) progress += 5;
  if (user.organization) progress += 5;
  if (user.japanese_language_level) progress += 10;
  if (user.is_educator !== null && user.is_educator !== undefined) progress += 10;
  if (user.role) progress += 15;
  if (user.interests && user.interests.length > 0) progress += 15;
  if (user.goals && user.goals.length > 0) progress += 10;
  if (user.budget_range) progress += 10;
  
  return Math.min(progress, 100);
};

// 次に入力すべき項目を取得
export const getNextSteps = (user: any): ProfileQuestion[] => {
  const missingFields: ProfileQuestion[] = [];
  
  PROFILE_QUESTIONS.forEach(question => {
    const fieldValue = user[question.field];
    
    if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
      missingFields.push(question);
    }
  });
  
  // 重要度順にソート
  return missingFields.sort((a, b) => b.weight - a.weight).slice(0, 3); // 上位3つ
};
