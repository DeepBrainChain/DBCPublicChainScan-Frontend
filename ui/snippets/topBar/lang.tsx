import { Text, Menu, MenuButton, MenuItem, MenuList, MenuButtonProps, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LANG_MAP } from '../../../lib/constants/lang';

const langIcon = (
  <svg
    style={{ color: 'var(--chakra-colors-blue-300)' }}
    viewBox="0 0 24 24"
    focusable="false"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z "
      className="css-c4d79v"
    />
  </svg>
);

const LangSelect: React.FC<MenuButtonProps> = (props) => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    console.log(newLocale, 'newLocale');
    setIsLoading(true); // 开始加载
    document.cookie = `NEXT_LOCALE=${newLocale}; max-age=31536000; path=/`;
    router.push({ pathname, query }, asPath, { locale: newLocale as any }).then(() => {
      setIsLoading(false); // 加载完成
    });
  };

  // useEffect(() => {
  //   console.log(navigator.language, 'navigator.language');
  //   if (navigator.language === 'zh-CN') {
  //     handleLanguageChange('zh');
  //   } else {
  //     handleLanguageChange(navigator.language);
  //   }
  // }, []);

  return (
    <div className={'!z-[99999]'}>
      <Menu autoSelect={false}>
        <MenuButton p="12px" {...props} disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : langIcon}
        </MenuButton>
        <MenuList w="max-content" minW="120px">
          {Object.entries(LANG_MAP).map(([key, lang]) => (
            <MenuItem
              key={key}
              display="flex"
              alignItems="center"
              fontSize="sm"
              onClick={() => handleLanguageChange(key)}
              isDisabled={isLoading}
            >
              <Text mr="8px">{lang.icon}</Text>
              <Text>{lang.label}</Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default LangSelect;
