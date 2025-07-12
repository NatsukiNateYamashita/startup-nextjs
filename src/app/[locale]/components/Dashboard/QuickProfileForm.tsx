"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProfileQuestion, USER_ROLES, JAPANESE_LEVELS, INTERESTS, BUDGET_RANGES } from '@/lib/constants/user-profile';

interface QuickProfileFormProps {
  user: any;
  nextSteps: ProfileQuestion[];
  locale: string;
  onProgressUpdate?: (progress: number) => void;
}

const QuickProfileForm = ({ user, nextSteps, locale, onProgressUpdate }: QuickProfileFormProps) => {
  const t = useTranslations('QuickProfile');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const currentQuestion = nextSteps[currentStep];
  
  const handleSubmit = async (value: any) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [currentQuestion.field]: value
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // 成功アニメーション
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 800);
        
        // プログレス更新
        onProgressUpdate?.(result.completion);
        
        // 次の質問へ or 完了
        if (currentStep < nextSteps.length - 1) {
          setTimeout(() => {
            setCurrentStep(currentStep + 1);
          }, 1000);
        } else {
          // 全て完了
          setTimeout(() => {
            // フォームを閉じる
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionIcon = (field: string, option: string): string => {
    if (field === 'role') {
      const roleIcons: Record<string, string> = {
        [USER_ROLES.JAPANESE_TEACHER]: '👩‍🏫',
        [USER_ROLES.JAPANESE_LEARNER]: '📚',
        [USER_ROLES.SCHOOL_STAFF]: '🏫',
        [USER_ROLES.ENGINEER]: '💻',
        [USER_ROLES.RESEARCHER]: '🔬',
        [USER_ROLES.OTHER]: '👤'
      };
      return roleIcons[option] || '📋';
    }
    
    if (field === 'japanese_language_level') {
      const levelIcons: Record<string, string> = {
        [JAPANESE_LEVELS.BEGINNER]: '🌱',
        [JAPANESE_LEVELS.ELEMENTARY]: '🌿',
        [JAPANESE_LEVELS.INTERMEDIATE]: '🌳',
        [JAPANESE_LEVELS.ADVANCED]: '🎯',
        [JAPANESE_LEVELS.SUPER_ADVANCED]: '⭐',
        [JAPANESE_LEVELS.NATIVE]: '🌸'
      };
      return levelIcons[parseInt(option)] || '📚';
    }
    
    if (field === 'interests') {
      const interestIcons: Record<string, string> = {
        [INTERESTS.AI_ARTICLE]: '🤖',
        [INTERESTS.MATERIAL_CREATION]: '📝',
        [INTERESTS.TRANSLATION]: '🌐',
        [INTERESTS.COMMUNITY]: '👥'
      };
      return interestIcons[option] || '✨';
    }
    
    if (field === 'budget_range') {
      const budgetIcons: Record<string, string> = {
        [BUDGET_RANGES.FREE_ONLY]: '🆓',
        [BUDGET_RANGES.UP_TO_3000]: '💰',
        [BUDGET_RANGES.UP_TO_10000]: '💳',
        [BUDGET_RANGES.OVER_10000]: '💎'
      };
      return budgetIcons[option] || '💵';
    }
    
    return '📋';
  };
  
  const renderQuestion = () => {
    if (showSuccess) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <p className="text-lg font-medium text-green-600">
            更新しました！
          </p>
        </div>
      );
    }
    
    switch (currentQuestion.type) {
      case 'select':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-black dark:text-white mb-4">
              {t(`questions.${currentQuestion.field}.title`)}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options?.map(option => (
                <button
                  key={option}
                  onClick={() => handleSubmit(option)}
                  disabled={isSubmitting}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getOptionIcon(currentQuestion.field, option)}</span>
                    <span className="text-sm">
                      {currentQuestion.field === 'role' && t(`options.role.${option}`)}
                      {currentQuestion.field === 'japanese_language_level' && t(`options.japanese_level.${option}`)}
                      {currentQuestion.field === 'interests' && t(`options.interests.${option}`)}
                      {currentQuestion.field === 'budget_range' && t(`options.budget.${option}`)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'multiselect':
        return <MultiSelectQuestion question={currentQuestion} onSubmit={handleSubmit} />;
        
      case 'boolean':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-black dark:text-white">
              {t(`questions.${currentQuestion.field}.title`)}
            </h4>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex-1 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <span className="text-2xl mb-2 block">👍</span>
                <span className="text-sm">{t('yes')}</span>
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                <span className="text-2xl mb-2 block">👎</span>
                <span className="text-sm">{t('no')}</span>
              </button>
            </div>
          </div>
        );
        
      case 'input':
        return (
          <InputQuestion question={currentQuestion} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
      {/* プログレス表示 */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          {t('step', { current: currentStep + 1, total: nextSteps.length })}
        </span>
        <div className="flex space-x-1">
          {nextSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* 質問レンダリング */}
      {renderQuestion()}
      
      {/* スキップボタン */}
      {!showSuccess && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (currentStep < nextSteps.length - 1) {
                setCurrentStep(currentStep + 1);
              }
            }}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            {t('skip')}
          </button>
        </div>
      )}
    </div>
  );
};

// マルチセレクト質問コンポーネント
const MultiSelectQuestion = ({ question, onSubmit }: { question: ProfileQuestion, onSubmit: (value: any) => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const t = useTranslations('QuickProfile');
  
  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(s => s !== option)
      : [...selected, option];
    setSelected(newSelected);
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-black dark:text-white">
        {t(`questions.${question.field}.title`)}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {question.options?.map(option => (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            className={`p-3 border rounded-lg transition-all ${
              selected.includes(option) 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">✨</span>
              <span className="text-sm">{t(`options.interests.${option}`)}</span>
            </div>
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <button
          onClick={() => onSubmit(selected)}
          className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          決定 ({selected.length}個選択)
        </button>
      )}
    </div>
  );
};

// インプット質問コンポーネント
const InputQuestion = ({ question, onSubmit, isSubmitting }: { 
  question: ProfileQuestion, 
  onSubmit: (value: any) => void,
  isSubmitting: boolean 
}) => {
  const [value, setValue] = useState('');
  const t = useTranslations('QuickProfile');
  
  const handleSubmit = () => {
    if (value.trim()) {
      if (question.field === 'age') {
        onSubmit(parseInt(value));
      } else {
        onSubmit(value);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-black dark:text-white">
        {t(`questions.${question.field}.title`)}
      </h4>
      <div className="flex space-x-2">
        <input
          type={question.field === 'age' ? 'number' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
          placeholder={question.field === 'age' ? '例: 30' : '例: 株式会社○○'}
          disabled={isSubmitting}
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          送信
        </button>
      </div>
    </div>
  );
};

export default QuickProfileForm;
