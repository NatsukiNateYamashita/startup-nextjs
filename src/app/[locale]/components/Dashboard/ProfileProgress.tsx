"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateProfileCompletion, getNextSteps } from '@/lib/constants/user-profile';
import QuickProfileForm from './QuickProfileForm';

interface ProfileProgressProps {
  user: {
    id: string;
    profile_completion: number;
    age?: number | null;
    organization?: string | null;
    japanese_language_level?: number | null;
    is_educator?: boolean | null;
    role?: string | null;
    interests?: string[] | null;
    goals?: string[] | null;
    budget_range?: string | null;
    [key: string]: any;
  };
  locale: string;
}

const ProfileProgress = ({ user, locale }: ProfileProgressProps) => {
  const t = useTranslations('ProfileProgress');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(user.profile_completion || 20);
  
  // プロフィール完成度を再計算
  const actualProgress = calculateProfileCompletion(user);
  const progress = Math.max(currentProgress, actualProgress);
  const nextSteps = getNextSteps(user);
  
  const handleProgressUpdate = (newProgress: number) => {
    setCurrentProgress(newProgress);
    if (newProgress === 100) {
      setIsExpanded(false);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-6 rounded-lg mb-6">
      {/* プロフィール完成度バー */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {t('title')}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">{progress}%</span>
          {progress === 100 && <span className="text-2xl">🎉</span>}
        </div>
      </div>
      
      {/* プログレスバー */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
          style={{width: `${progress}%`}}
        >
          {progress > 50 && (
            <div className="flex items-center justify-center h-full">
              <span className="text-xs text-white font-medium">
                {progress}%
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* 特典メッセージ */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {progress < 100 ? (
            <>
              {t('remaining', { count: Math.ceil((100 - progress) / 10) })}
              <span className="font-semibold text-primary ml-1">
                {t('reward')}
              </span>
            </>
          ) : (
            <span className="text-green-600 font-semibold flex items-center">
              <span className="mr-2">✅</span>
              {t('completed')}
            </span>
          )}
        </p>
        
        {progress < 100 && nextSteps.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            {isExpanded ? t('collapse') : t('expand')}
          </button>
        )}
      </div>
      
      {/* クイック入力フォーム */}
      {isExpanded && progress < 100 && nextSteps.length > 0 && (
        <QuickProfileForm 
          user={user} 
          nextSteps={nextSteps} 
          locale={locale}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
};

export default ProfileProgress;
