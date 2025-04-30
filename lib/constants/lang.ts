// constants/langMap.ts
type LanguageConfig = {
  label: string;
  icon: string;
};

type LanguageMap = {
  [key: string]: LanguageConfig;
};

export const LANG_MAP: LanguageMap = {
  en: { label: 'English', icon: '🇺🇸' },
  zh: { label: '中文', icon: '🇨🇳' },
  ko: { label: '한국어', icon: '🇰🇷' },
  ja: { label: '日本語', icon: '🇯🇵' }, // 日语
  ru: { label: 'Русский', icon: '🇷🇺' }, // 俄语
  vn: { label: 'Việt nam', icon: '🇻🇳' }, // 越南语
  es: { label: 'Español', icon: '🇪🇸' }, // 西班牙语
  fr: { label: 'Français', icon: '🇫🇷' }, // 法语
  de: { label: 'Deutsch', icon: '🇩🇪' }, // 德语
  tr: { label: 'Türkçe', icon: '🇹🇷' }, // 土耳其语
} as const;
