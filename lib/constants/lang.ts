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
} as const;
