import { Box, Text, Progress, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { StakingOverview } from 'types/api/staking';

interface Props {
  data: StakingOverview | undefined;
  isLoading: boolean;
}

const StakingEraProgress = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 }>
      <Text fontSize="lg" fontWeight="bold" mb={ 4 }>{ t('staking_era_progress') }</Text>

      <Box mb={ 6 }>
        <Flex justify="space-between" mb={ 2 }>
          <Text fontSize="sm" color="gray.500">
            { t('staking_current_era') }: <Text as="span" fontWeight="bold">{ data?.current_era ?? '—' }</Text>
          </Text>
          <Skeleton isLoaded={ !isLoading }>
            <Text fontSize="sm">{ data?.era_progress ?? 0 }%</Text>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={ !isLoading }>
          <Progress value={ data?.era_progress ?? 0 } colorScheme="blue" borderRadius="full" size="sm"/>
        </Skeleton>
        <Text fontSize="xs" color="gray.500" mt={ 1 }>
          { data?.era_length?.toLocaleString() ?? '—' } blocks per era
        </Text>
      </Box>

      <Box>
        <Flex justify="space-between" mb={ 2 }>
          <Text fontSize="sm" color="gray.500">
            { t('staking_current_epoch') }: <Text as="span" fontWeight="bold">{ data?.current_epoch ?? '—' }</Text>
          </Text>
          <Skeleton isLoaded={ !isLoading }>
            <Text fontSize="sm">{ data?.epoch_progress ?? 0 }%</Text>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={ !isLoading }>
          <Progress value={ data?.epoch_progress ?? 0 } colorScheme="green" borderRadius="full" size="sm"/>
        </Skeleton>
        <Text fontSize="xs" color="gray.500" mt={ 1 }>
          { data?.epoch_length?.toLocaleString() ?? '—' } blocks per epoch
        </Text>
      </Box>
    </Box>
  );
};

export default StakingEraProgress;
