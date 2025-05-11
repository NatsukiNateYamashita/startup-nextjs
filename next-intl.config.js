// next-intl.config.js
const path = require('path');

module.exports = {
  locales: ['en', 'ja', 'zh-TW', 'zh-CN'],
  defaultLocale: 'en',
  messages: {
    en: path.resolve(process.cwd(), 'messages/en.json'),
    ja: path.resolve(process.cwd(), 'messages/ja.json'),
    'zh-TW': path.resolve(process.cwd(), 'messages/zh-TW.json'),
    'zh-CN': path.resolve(process.cwd(), 'messages/zh-CN.json')
  }
};