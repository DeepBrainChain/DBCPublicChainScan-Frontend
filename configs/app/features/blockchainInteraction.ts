import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue } from '../utils';

const walletConnectProjectId =
  getEnvValue('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID') || '6d6a227f7cc614e482316b8a51b348d6';

const title = 'Blockchain interaction (writing to contract, etc.)';

const config: Feature<{ walletConnect: { projectId: string } }> = (() => {
  if (
    // all chain parameters are required for wagmi provider
    // @wagmi/chains/dist/index.d.ts
    chain.id &&
    chain.name &&
    chain.currency.name &&
    chain.currency.symbol &&
    chain.currency.decimals &&
    chain.rpcUrl &&
    walletConnectProjectId
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      walletConnect: {
        projectId: walletConnectProjectId,
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
