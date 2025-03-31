import type { WalletProvider } from 'types/web3';

type CPreferences = {
  zone: string;
  width: string;
  height: string;
};

declare global {
  export interface Window {
    ethereum?: WalletProvider | undefined;
    coinzilla_display: Array<CPreferences>;
    ga?: {
      getAll: () => Array<{ get: (prop: string) => string }>;
    };
    AdButler: {
      ads: Array<unknown>;
      register: (...args: unknown) => void;
    };
    abkw: string;
    __envs: Record<string, string>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
}
// jsx.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any; // 允许任意 HTML 标签及其属性
  }
}

// react-icons.d.ts
// 定义通用的图标属性接口
// react-icons.d.ts
interface IconProps {
  size?: string | number;
  className?: string;
  [key: string]: any; // 允许其他自定义属性
}

declare module 'react-icons/*' {
  const IconComponent: (props: IconProps) => JSX.Element;
  export = IconComponent; // 兼容 CommonJS 默认导出
}
export {};
