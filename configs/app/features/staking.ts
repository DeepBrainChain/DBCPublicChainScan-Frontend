import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Staking dashboard';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  const apiEndpoint = getEnvValue('NEXT_PUBLIC_API_HOST');

  if (apiEndpoint) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiEndpoint,
        basePath: '/api/v2/staking',
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
