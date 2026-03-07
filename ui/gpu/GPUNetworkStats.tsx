import { Box, Grid, GridItem, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface StatCardProps {
  label: string;
  value: string;
  isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => {
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

const GPUNetworkStats = () => {
  const { t } = useTranslation('common');

  // TODO: Replace mock data with actual contract reads when ABIs are available
  const stats = {
    totalGpusOnline: '1,247',
    dailyMiningReward: '125,000 DLC',
    totalStakedValue: '45.2M DBC',
    networkUtilization: '78.3%',
  };

  const isLoading = false;

  return (
    <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={ 4 }>
      <GridItem>
        <StatCard
          label={ t('gpu_total_gpus_online', { defaultValue: 'Total GPUs Online' }) }
          value={ stats.totalGpusOnline }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('gpu_daily_mining_reward', { defaultValue: 'Daily Mining Reward' }) }
          value={ stats.dailyMiningReward }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('gpu_total_staked_value', { defaultValue: 'Total Staked Value' }) }
          value={ stats.totalStakedValue }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('gpu_network_utilization', { defaultValue: 'Network Utilization' }) }
          value={ stats.networkUtilization }
          isLoading={ isLoading }
        />
      </GridItem>
    </Grid>
  );
};

export default GPUNetworkStats;
