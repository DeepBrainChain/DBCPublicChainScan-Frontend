import { createConfig, http } from '@wagmi/core';
const deepBrainChainMainnet = {
  id: 19880818, // NEXT_PUBLIC_NETWORK_ID
  name: 'DeepBrainChain Mainnet', // NEXT_PUBLIC_NETWORK_NAME
  nativeCurrency: {
    decimals: 18, // NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS
    name: 'DeepBrainChain', // NEXT_PUBLIC_NETWORK_CURRENCY_NAME
    symbol: 'DBC', // NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.dbcwallet.io'], // NEXT_PUBLIC_NETWORK_RPC_URL
    },
    public: {
      http: ['https://rpc.dbcwallet.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'DBC Explorer',
      url: 'https://www.dbcscan.io', // NEXT_PUBLIC_APP_PROTOCOL + NEXT_PUBLIC_APP_HOST
    },
  },
  testnet: false, // NEXT_PUBLIC_IS_TESTNET
};

// 写死的 wagmi 配置
export const config = createConfig({
  chains: [deepBrainChainMainnet],
  transports: {
    [19880818]: http('https://rpc.dbcwallet.io'),
  },
});
