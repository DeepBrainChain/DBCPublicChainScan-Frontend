import { Grid, GridItem, Box, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { StakingOverview as StakingOverviewType } from 'types/api/staking';

interface Props {
  data: StakingOverviewType | undefined;
  isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: { label: string; value: string | number; isLoading: boolean }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
      <Text fontSize="sm" color="gray.500" mb={ 1 }>{ label }</Text>
      <Skeleton isLoaded={ !isLoading }>
        <Text fontSize="xl" fontWeight="bold">{ value }</Text>
      </Skeleton>
    </Box>
  );
};

const StakingOverview = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');

  const formatStake = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B DBC`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M DBC`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K DBC`;
    return `${num.toFixed(2)} DBC`;
  };

  return (
    <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={ 4 } mb={ 8 }>
      <GridItem>
        <StatCard
          label={ t('staking_total_staked') }
          value={ data ? formatStake(data.total_staked) : '—' }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('staking_active_validators') }
          value={ data ? `${data.active_validator_count}/${data.validator_count}` : '—' }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('staking_nominators') }
          value={ data?.nominator_count ?? '—' }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('staking_inflation_rate') }
          value={ data ? `${data.inflation_rate}%` : '—' }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('staking_current_era') }
          value={ data?.current_era ?? '—' }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('staking_unbonding_period') }
          value={ data ? `${data.unbonding_period} eras` : '—' }
          isLoading={ isLoading }
        />
      </GridItem>
    </Grid>
  );
};

export default StakingOverview;
