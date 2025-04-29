import type { ChakraProps } from '@chakra-ui/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import type { NextPageWithLayout } from 'nextjs/types';
import config from 'configs/app';
import useQueryClientConfig from 'lib/api/useQueryClientConfig';
import { AppContextProvider } from 'lib/contexts/app';
import { ChakraProvider } from 'lib/contexts/chakra';
import { MarketplaceContextProvider } from 'lib/contexts/marketplace';
import { ScrollDirectionProvider } from 'lib/contexts/scrollDirection';
import { growthBook } from 'lib/growthbook/init';
import useLoadFeatures from 'lib/growthbook/useLoadFeatures';
import useNotifyOnNavigation from 'lib/hooks/useNotifyOnNavigation';
import { SocketProvider } from 'lib/socket/context';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import GoogleAnalytics from 'ui/shared/GoogleAnalytics';
import Layout from 'ui/shared/layout/Layout';
import Web3ModalProvider from 'ui/shared/Web3ModalProvider';
import { appWithTranslation } from 'next-i18next';
import '../style/index.css';
import 'lib/setLocale';
import { LANG_MAP } from '../lib/constants/lang';

import { WagmiProvider } from 'wagmi'; // 替换 WagmiConfig 为 WagmiProvider
import wagmiConfig from '../lib/web3/wagmiConfig'; // 导入你的 wagmiConfig
import { useRouter } from 'next/router';

// import 'focus-visible/dist/focus-visible';
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const ERROR_SCREEN_STYLES: ChakraProps = {
  h: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: 'fit-content',
  maxW: '800px',
  margin: '0 auto',
  p: { base: 4, lg: 0 },
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useLoadFeatures();
  useNotifyOnNavigation();

  const queryClient = useQueryClientConfig();
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const handleError = React.useCallback((error: Error) => {
    Sentry.captureException(error);
  }, []);

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  useEffect(() => {
    console.log('应用初始化，浏览器语言:', navigator.language);

    // 标准化语言代码
    const normalizeLanguage = (lang: string): string => {
      const lowerLang = lang.toLowerCase();
      // 特殊处理越南语（vi -> vn）
      if (lowerLang.startsWith('vi')) return 'vn';
      // 提取主要语言代码（例如 zh-CN -> zh）
      return lowerLang.split('-')[0];
    };

    // 获取浏览器语言
    const browserLanguage = navigator.language || navigator.languages[0] || 'en';
    const newLocale = normalizeLanguage(browserLanguage);

    // 检查是否在 LANG_MAP 中
    if (newLocale in LANG_MAP) {
      console.log(`匹配到支持的语言: ${newLocale}, 设置 NEXT_LOCALE cookie 和路由`);

      // 设置 NEXT_LOCALE cookie（有效期 1 年）
      document.cookie = `NEXT_LOCALE=${newLocale}; max-age=31536000; path=/`;

      // 切换语言环境
      router.push({ pathname, query }, asPath, { locale: newLocale as any });
    } else {
      console.log(`不支持的语言: ${newLocale}, 回退到默认语言 en`);
      // 设置默认语言
      document.cookie = `NEXT_LOCALE=en; max-age=31536000; path=/`;
      router.push({ pathname, query }, asPath, { locale: 'en' });
    }
  }, []); // 依赖 router 相关属性

  return (
    <ChakraProvider cookies={pageProps.cookies}>
      <AppErrorBoundary {...ERROR_SCREEN_STYLES} onError={handleError}>
        <WagmiProvider config={wagmiConfig}>
          <Web3ModalProvider>
            <AppContextProvider pageProps={pageProps}>
              <QueryClientProvider client={queryClient}>
                <GrowthBookProvider growthbook={growthBook}>
                  <ScrollDirectionProvider>
                    <SocketProvider url={`${config.api.socket}${config.api.basePath}/socket/v2`}>
                      <MarketplaceContextProvider>{getLayout(<Component {...pageProps} />)}</MarketplaceContextProvider>
                    </SocketProvider>
                  </ScrollDirectionProvider>
                </GrowthBookProvider>
                <ReactQueryDevtools buttonPosition="bottom-left" position="left" />
                <GoogleAnalytics />
              </QueryClientProvider>
            </AppContextProvider>
          </Web3ModalProvider>
        </WagmiProvider>
      </AppErrorBoundary>
    </ChakraProvider>
  );
}

export default appWithTranslation(MyApp);
