import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { http } from 'viem';
import type { CreateConfigParameters } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
const feature = config.features.blockchainInteraction;
import { getEnvValue } from '../../configs/app/utils';

const wagmiConfig = (() => {
  console.log(currentChain, 'web3配置信息');
  console.log(getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'), 'rpc节点');
  // const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL || 'https://rpc-testnet.dbcwallet.io';
  console.log(getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') || 'https://rpc.dbcwallet.io', '最终rpc节点');
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
      ssr: true,
    });

    return wagmiConfig;
  } catch (error) {}
})();

export default wagmiConfig;
