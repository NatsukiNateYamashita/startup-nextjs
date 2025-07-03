import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ja', 'en', 'zh-TW', 'zh-CN'],
 
  // Used when no locale matches
  defaultLocale: 'ja'
});

// 型を自動生成してエクスポート
export type Locale = typeof routing.locales[number];

