import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { VERIFIED_CONTRACTS_COUNTERS } from 'stubs/contract';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import { useTranslation } from 'next-i18next';
const VerifiedContractsCounters = () => {
  const countersQuery = useApiQuery('verified_contracts_counters', {
    queryOptions: {
      placeholderData: VERIFIED_CONTRACTS_COUNTERS,
    },
  });
  const { t } = useTranslation('common');

  if (!countersQuery.data) {
    return null;
  }

  return (
    <Box columnGap={3} rowGap={3} mb={6} display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label={t('deep_total_contracts')}
        value={Number(countersQuery.data.smart_contracts).toLocaleString()}
        diff={countersQuery.data.new_smart_contracts_24h}
        diffFormatted={Number(countersQuery.data.new_smart_contracts_24h).toLocaleString()}
        isLoading={countersQuery.isPlaceholderData}
        href={{ pathname: '/stats', query: { chartId: 'contractsGrowth' } }}
      />
      <StatsWidget
        label={t('deep_verified_contracts')}
        value={Number(countersQuery.data.verified_smart_contracts).toLocaleString()}
        diff={countersQuery.data.new_verified_smart_contracts_24h}
        diffFormatted={Number(countersQuery.data.new_verified_smart_contracts_24h).toLocaleString()}
        isLoading={countersQuery.isPlaceholderData}
        href={{ pathname: '/stats', query: { chartId: 'verifiedContractsGrowth' } }}
      />
    </Box>
  );
};

export default VerifiedContractsCounters;
