import { useState, useEffect } from 'react';

const useBrowserLanguage = (): string => {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const browserLanguage = navigator.language || 'en';
    console.log(navigator.language, 'navigator.language');
    if (browserLanguage === 'zh-CN') {
      setLanguage('zh');
    } else {
      setLanguage(browserLanguage);
    }
  }, []);

  return language;
};

export default useBrowserLanguage;
