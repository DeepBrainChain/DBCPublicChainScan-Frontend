// import { type Chain } from 'viem';

// import config from 'configs/app';

// const currentChain = {
//   id: Number(config.chain.id),
//   name: config.chain.name ?? '',
//   nativeCurrency: {
//     decimals: config.chain.currency.decimals,
//     name: config.chain.currency.name ?? '',
//     symbol: config.chain.currency.symbol ?? '',
//   },
//   rpcUrls: {
//     'default': {
//       http: [ config.chain.rpcUrl ?? '' ],
//     },
//   },
//   blockExplorers: {
//     'default': {
//       name: 'Blockscout',
//       url: config.app.baseUrl,
//     },
//   },
//   testnet: config.chain.isTestnet,
// } as const satisfies Chain;

// export default currentChain;

import { type Chain } from 'viem';

import config from 'configs/app';

const currentChain = {
  id: 19880818,
  name: 'DeepBrainChain Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'DeepBrainChain',
    symbol: 'DBC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.dbcwallet.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://dbcscan.io',
    },
  },
  testnet: false,
} as const satisfies Chain;
export default currentChain;
