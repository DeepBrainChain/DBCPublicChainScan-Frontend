import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { http } from 'viem';
import type { CreateConfigParameters } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
const feature = config.features.blockchainInteraction;
// import { getEnvValue } from '../../configs/app/utils';

const wagmiConfig = (() => {
  const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL || 'https://rpc-testnet.dbcwallet.io';
  console.log('RPC URLAAAAAAAAAAAAAAAAAAAAA:', rpcUrl);
  try {
    if (!feature.isEnabled) {
      throw new Error();
    }
    // https://rpc.dbcwallet.io
    const chains: CreateConfigParameters['chains'] = [currentChain];

    const wagmiConfig = defaultWagmiConfig({
      chains,
      multiInjectedProviderDiscovery: true,
      transports: {
        [currentChain.id]: http('https://rpc.dbcwallet.io'),
      },
      projectId: feature.walletConnect.projectId,
      metadata: {
        name: `${config.chain.name} explorer`,
        description: `${config.chain.name} explorer`,
        url: config.app.baseUrl,
        icons: [config.UI.sidebar.icon.default].filter(Boolean),
      },
      enableEmail: true,
      ssr: true,
    });

    return wagmiConfig;
  } catch (error) {}
})();

export default wagmiConfig;
