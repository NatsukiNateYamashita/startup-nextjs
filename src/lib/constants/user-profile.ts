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

// 母国語の選択肢
export const NATIVE_LANGUAGES = {
  JAPANESE: 'japanese',
  ENGLISH: 'english',
  CHINESE: 'chinese',
  KOREAN: 'korean',
  SPANISH: 'spanish',
  FRENCH: 'french',
  GERMAN: 'german',
  THAI: 'thai',
  VIETNAMESE: 'vietnamese',
  PORTUGUESE: 'portuguese',
  RUSSIAN: 'russian',
  ARABIC: 'arabic',
  OTHER: 'other'
} as const;

export type NativeLanguage = typeof NATIVE_LANGUAGES[keyof typeof NATIVE_LANGUAGES];

// 話せる言語（複数選択可）
export const AVAILABLE_LANGUAGES = {
  JAPANESE: 'japanese',
  ENGLISH: 'english', 
  CHINESE: 'chinese',
  KOREAN: 'korean',
  SPANISH: 'spanish',
  FRENCH: 'french',
  GERMAN: 'german',
  THAI: 'thai',
  VIETNAMESE: 'vietnamese',
  PORTUGUESE: 'portuguese',
  RUSSIAN: 'russian',
  ARABIC: 'arabic'
} as const;

export type AvailableLanguage = typeof AVAILABLE_LANGUAGES[keyof typeof AVAILABLE_LANGUAGES];

// 現在の課題
export const PAIN_POINTS = {
  GRAMMAR_DIFFICULTY: 'grammar_difficulty',
  VOCABULARY_SHORTAGE: 'vocabulary_shortage',
  LISTENING_COMPREHENSION: 'listening_comprehension',
  SPEAKING_CONFIDENCE: 'speaking_confidence',
  CULTURAL_UNDERSTANDING: 'cultural_understanding',
  LACK_OF_PRACTICE: 'lack_of_practice',
  FINDING_MATERIALS: 'finding_materials',
  TIME_MANAGEMENT: 'time_management'
} as const;

export type PainPoint = typeof PAIN_POINTS[keyof typeof PAIN_POINTS];

// 学習目標
export const LEARNING_GOALS = {
  DAILY_CONVERSATION: 'daily_conversation',
  BUSINESS_JAPANESE: 'business_japanese',
  ACADEMIC_STUDY: 'academic_study',
  TRAVEL_COMMUNICATION: 'travel_communication',
  ANIME_UNDERSTANDING: 'anime_understanding',
  JLPT_PREPARATION: 'jlpt_preparation',
  CULTURAL_EXPLORATION: 'cultural_exploration',
  TEACHING_PREPARATION: 'teaching_preparation'
} as const;

export type LearningGoal = typeof LEARNING_GOALS[keyof typeof LEARNING_GOALS];

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

export const NATIVE_LANGUAGE_TRANSLATION_KEYS = {
  [NATIVE_LANGUAGES.JAPANESE]: 'options.native_language.japanese',
  [NATIVE_LANGUAGES.ENGLISH]: 'options.native_language.english',
  [NATIVE_LANGUAGES.CHINESE]: 'options.native_language.chinese',
  [NATIVE_LANGUAGES.KOREAN]: 'options.native_language.korean',
  [NATIVE_LANGUAGES.SPANISH]: 'options.native_language.spanish',
  [NATIVE_LANGUAGES.FRENCH]: 'options.native_language.french',
  [NATIVE_LANGUAGES.GERMAN]: 'options.native_language.german',
  [NATIVE_LANGUAGES.THAI]: 'options.native_language.thai',
  [NATIVE_LANGUAGES.VIETNAMESE]: 'options.native_language.vietnamese',
  [NATIVE_LANGUAGES.PORTUGUESE]: 'options.native_language.portuguese',
  [NATIVE_LANGUAGES.RUSSIAN]: 'options.native_language.russian',
  [NATIVE_LANGUAGES.ARABIC]: 'options.native_language.arabic',
  [NATIVE_LANGUAGES.OTHER]: 'options.native_language.other'
};

export const AVAILABLE_LANGUAGE_TRANSLATION_KEYS = {
  [AVAILABLE_LANGUAGES.JAPANESE]: 'options.available_language.japanese',
  [AVAILABLE_LANGUAGES.ENGLISH]: 'options.available_language.english',
  [AVAILABLE_LANGUAGES.CHINESE]: 'options.available_language.chinese',
  [AVAILABLE_LANGUAGES.KOREAN]: 'options.available_language.korean',
  [AVAILABLE_LANGUAGES.SPANISH]: 'options.available_language.spanish',
  [AVAILABLE_LANGUAGES.FRENCH]: 'options.available_language.french',
  [AVAILABLE_LANGUAGES.GERMAN]: 'options.available_language.german',
  [AVAILABLE_LANGUAGES.THAI]: 'options.available_language.thai',
  [AVAILABLE_LANGUAGES.VIETNAMESE]: 'options.available_language.vietnamese',
  [AVAILABLE_LANGUAGES.PORTUGUESE]: 'options.available_language.portuguese',
  [AVAILABLE_LANGUAGES.RUSSIAN]: 'options.available_language.russian',
  [AVAILABLE_LANGUAGES.ARABIC]: 'options.available_language.arabic'
};

export const PAIN_POINT_TRANSLATION_KEYS = {
  [PAIN_POINTS.GRAMMAR_DIFFICULTY]: 'options.pain_points.grammar_difficulty',
  [PAIN_POINTS.VOCABULARY_SHORTAGE]: 'options.pain_points.vocabulary_shortage', 
  [PAIN_POINTS.LISTENING_COMPREHENSION]: 'options.pain_points.listening_comprehension',
  [PAIN_POINTS.SPEAKING_CONFIDENCE]: 'options.pain_points.speaking_confidence',
  [PAIN_POINTS.CULTURAL_UNDERSTANDING]: 'options.pain_points.cultural_understanding',
  [PAIN_POINTS.LACK_OF_PRACTICE]: 'options.pain_points.lack_of_practice',
  [PAIN_POINTS.FINDING_MATERIALS]: 'options.pain_points.finding_materials',
  [PAIN_POINTS.TIME_MANAGEMENT]: 'options.pain_points.time_management'
};

export const LEARNING_GOAL_TRANSLATION_KEYS = {
  [LEARNING_GOALS.DAILY_CONVERSATION]: 'options.learning_goals.daily_conversation',
  [LEARNING_GOALS.BUSINESS_JAPANESE]: 'options.learning_goals.business_japanese',
  [LEARNING_GOALS.ACADEMIC_STUDY]: 'options.learning_goals.academic_study',
  [LEARNING_GOALS.TRAVEL_COMMUNICATION]: 'options.learning_goals.travel_communication',
  [LEARNING_GOALS.ANIME_UNDERSTANDING]: 'options.learning_goals.anime_understanding',
  [LEARNING_GOALS.JLPT_PREPARATION]: 'options.learning_goals.jlpt_preparation',
  [LEARNING_GOALS.CULTURAL_EXPLORATION]: 'options.learning_goals.cultural_exploration',
  [LEARNING_GOALS.TEACHING_PREPARATION]: 'options.learning_goals.teaching_preparation'
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
  // 必須項目（優先度高）
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
    field: 'budget_range',
    type: 'select',
    options: Object.values(BUDGET_RANGES),
    weight: 10,
    required: false
  },
  
  // 重要項目（優先度中）
  {
    field: 'experience',
    type: 'select',
    options: Object.values(EXPERIENCE_LEVELS),
    weight: 8,
    required: false
  },
  {
    field: 'interests',
    type: 'multiselect',
    options: Object.values(INTERESTS),
    weight: 8,
    required: false
  },
  {
    field: 'native_language',
    type: 'select',
    options: Object.values(NATIVE_LANGUAGES),
    weight: 8,
    required: false
  },
  {
    field: 'learningGoals',  // Note: schema field name
    type: 'multiselect',
    options: Object.values(LEARNING_GOALS),
    weight: 8,
    required: false
  },
  {
    field: 'decision_maker',
    type: 'boolean',
    weight: 5,
    required: false
  },
  
  // 任意項目（優先度低）
  {
    field: 'educate_experience',
    type: 'input',
    weight: 5,
    required: false
  },
  {
    field: 'available_languages',
    type: 'multiselect',
    options: Object.values(AVAILABLE_LANGUAGES),
    weight: 5,
    required: false
  },
  {
    field: 'pain_points',
    type: 'multiselect',
    options: Object.values(PAIN_POINTS),
    weight: 5,
    required: false
  },
  {
    field: 'age',
    type: 'input',
    weight: 3,
    required: false
  },
  {
    field: 'organization',
    type: 'input',
    weight: 3,
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
