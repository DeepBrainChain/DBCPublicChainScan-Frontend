import { Box, Heading, Flex, Text, VStack, Skeleton, HStack, Tag, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import LinkInternal from 'ui/shared/LinkInternal';

const LatestSubstrateExtrinsics = () => {
  const { t } = useTranslation('common');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { data, isPlaceholderData, isError } = useApiQuery('substrate_extrinsics' as any, {
    queryParams: { row: 5, page: 0 },
    queryOptions: {
      refetchInterval: 15000,
    },
  });

  const items = (data as any)?.items;

  if (isError) {
    return null;
  }

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <Heading as="h4" size="sm" mb={ 4 }>
        { t('home_latest_substrate_extrinsics', { defaultValue: 'Latest DBC Mainchain Extrinsics' }) }
      </Heading>
      <VStack spacing={ 3 } mb={ 4 } alignItems="stretch">
        { Array.isArray(items) && items.slice(0, 5).map((item: any, index: number) => (
          <Box
            key={ item.extrinsic_index || index }
            borderRadius="md"
            border="1px solid"
            borderColor={ borderColor }
            p={ 4 }
          >
            <Flex justifyContent="space-between" alignItems="center" mb={ 2 }>
              <Skeleton isLoaded={ !isPlaceholderData }>
                <LinkInternal
                  href={ `/substrate/extrinsic/${item.extrinsic_index}` }
                  fontWeight={ 500 }
                  fontSize="sm"
                  color="link"
                  _hover={{ color: 'link_hovered' }}
                >
                  { item.extrinsic_index }
                </LinkInternal>
              </Skeleton>
              <Skeleton isLoaded={ !isPlaceholderData }>
                <Text fontSize="xs" color="text_secondary">
                  { item.block_timestamp ? dayjs(item.block_timestamp * 1000).fromNow() : '—' }
                </Text>
              </Skeleton>
            </Flex>
            <HStack spacing={ 2 }>
              <Skeleton isLoaded={ !isPlaceholderData }>
                <Tag size="sm" colorScheme="cyan" variant="subtle">
                  { item.call_module || '—' }
                </Tag>
              </Skeleton>
              <Skeleton isLoaded={ !isPlaceholderData }>
                <Text fontSize="xs" color="text_secondary">
                  { item.call_module_function || '—' }
                </Text>
              </Skeleton>
              { item.success !== undefined && (
                <Skeleton isLoaded={ !isPlaceholderData }>
                  <Tag size="sm" colorScheme={ item.success ? 'green' : 'red' } variant="subtle">
                    { item.success ? '✓' : '✗' }
                  </Tag>
                </Skeleton>
              ) }
            </HStack>
          </Box>
        )) }
        { !items && isPlaceholderData && Array.from({ length: 5 }).map((_, i) => (
          <Box key={ i } borderRadius="md" border="1px solid" borderColor={ borderColor } p={ 4 }>
            <Skeleton h="20px" mb={ 2 }/>
            <Skeleton h="16px" w="60%"/>
          </Box>
        )) }
      </VStack>
      <Flex justifyContent="center">
        <LinkInternal fontSize="sm" href="/substrate/extrinsics">
          { t('home_view_all_substrate_extrinsics', { defaultValue: 'View all DBC mainchain extrinsics' }) }
        </LinkInternal>
      </Flex>
    </Box>
  );
};

export default LatestSubstrateExtrinsics;
