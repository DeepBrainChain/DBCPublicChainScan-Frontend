import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { http } from 'viem';
import type { CreateConfigParameters } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
const feature = config.features.blockchainInteraction;
import { getEnvValue } from '../../configs/app/utils';

const wagmiConfig: any = (() => {
  try {
    if (!feature.isEnabled) {
      throw new Error();
    }
    const chains: CreateConfigParameters['chains'] = [currentChain];
    console.log(getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'), 'NEXT_PUBLIC_NETWORK_RPC_URL');
    const wagmiConfig: any = defaultWagmiConfig({
      chains,
      multiInjectedProviderDiscovery: true,
      transports: {
        [currentChain.id]: http(getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') || 'https://rpc.dbcwallet.io'),
      },
      projectId: feature.walletConnect.projectId,
      metadata: {
        name: `${config.chain.name} explorer`,
        description: `${config.chain.name} explorer`,
        url: config.app.baseUrl,
        icons: [config.UI.sidebar.icon.default].filter(Boolean),
      },
      enableEmail: true,

      // ssr: true,
    });

    return wagmiConfig;
  } catch (error) {}
})();

export default wagmiConfig;
