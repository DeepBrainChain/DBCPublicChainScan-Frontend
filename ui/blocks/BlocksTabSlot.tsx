import { Flex, Box, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import useApiQuery from 'lib/api/useApiQuery';
import { nbsp } from 'lib/html-entities';
import { HOMEPAGE_STATS } from 'stubs/stats';
import Pagination from 'ui/shared/pagination/Pagination';
import { useTranslation } from 'next-i18next';

interface Props {
  pagination: PaginationParams;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const statsQuery = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });
  const { t } = useTranslation('common');

  return (
    <Flex alignItems="center" columnGap={8} display={{ base: 'none', lg: 'flex' }}>
      {statsQuery.data?.network_utilization_percentage !== undefined && (
        <Box>
          <Text as="span" fontSize="sm">
            {t('deep_network_utilization')} ({t('deep_last_50_blocks')}):{nbsp}
          </Text>
          <Skeleton
            display="inline-block"
            fontSize="sm"
            color="blue.400"
            fontWeight={600}
            isLoaded={!statsQuery.isPlaceholderData}
          >
            <span>{statsQuery.data.network_utilization_percentage.toFixed(2)}%</span>
          </Skeleton>
        </Box>
      )}
      <Pagination my={1} {...pagination} />
    </Flex>
  );
};

export default BlocksTabSlot;
