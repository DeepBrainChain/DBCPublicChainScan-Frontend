import {
  Badge, Box, Button, Flex, HStack, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import LinkInternal from 'ui/shared/LinkInternal';

const PAGE_SIZE = 25;

const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString();
};

const truncateHash = (hash: string) => {
  if (!hash || hash.length <= 20) return hash || '-';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

const SkeletonRows = () => (
  <>
    { Array.from({ length: PAGE_SIZE }).map((_, i) => (
      <Tr key={ i }>
        { Array.from({ length: 7 }).map((__, j) => (
          <Td key={ j }><Skeleton h="16px" w="80px"/></Td>
        )) }
      </Tr>
    )) }
  </>
);

const SubstrateBlocksList = () => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [ page, setPage ] = React.useState(0);

  const { data, isLoading, isPlaceholderData } = useApiQuery('substrate_blocks' as any, {
    queryParams: { row: String(PAGE_SIZE), page: String(page) } as any,
    queryOptions: { refetchInterval: page === 0 ? 15000 : undefined },
  });

  const typedData = data as { items?: Array<any>; total_count?: number } | undefined;
  const items = typedData?.items ?? [];
  const totalCount = typedData?.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const loading = isLoading || isPlaceholderData;

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
      <Table variant="simple" size="sm" minWidth="900px">
        <Thead>
          <Tr>
            <Th>{ t('substrate_block', { defaultValue: 'Block' }) }</Th>
            <Th>{ t('substrate_time', { defaultValue: 'Time' }) }</Th>
            <Th>{ t('substrate_validator', { defaultValue: 'Validator' }) }</Th>
            <Th isNumeric>{ t('substrate_extrinsics', { defaultValue: 'Extrinsics' }) }</Th>
            <Th isNumeric>{ t('substrate_events', { defaultValue: 'Events' }) }</Th>
            <Th>{ t('substrate_hash', { defaultValue: 'Hash' }) }</Th>
            <Th>{ t('substrate_status', { defaultValue: 'Status' }) }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { loading && items.length === 0 ? (
            <SkeletonRows/>
          ) : items.length === 0 ? (
            <Tr>
              <Td colSpan={ 7 }>
                <Text color="gray.500" textAlign="center" py={ 4 }>
                  { t('no_data', { defaultValue: 'No data' }) }
                </Text>
              </Td>
            </Tr>
          ) : (
            items.map((item: any) => (
              <Tr key={ item.block_num }>
                <Td>
                  <LinkInternal href={ `/substrate/block/${item.block_num}` } color="link_hovered" fontWeight="bold">
                    { item.block_num }
                  </LinkInternal>
                </Td>
                <Td><Text fontSize="xs">{ formatTime(item.block_timestamp) }</Text></Td>
                <Td>
                  { item.validator ? (
                    <LinkInternal href={ `/substrate/account/${item.validator}` } color="link_hovered">
                      <Text fontSize="xs" fontFamily="mono">
                        { item.validator_name || truncateHash(item.validator) }
                      </Text>
                    </LinkInternal>
                  ) : <Text fontSize="xs">-</Text> }
                </Td>
                <Td isNumeric>{ item.extrinsics_count }</Td>
                <Td isNumeric>{ item.event_count }</Td>
                <Td>
                  <Text fontFamily="mono" fontSize="xs">{ truncateHash(item.hash) }</Text>
                </Td>
                <Td>
                  <Badge colorScheme={ item.finalized ? 'green' : 'yellow' } variant="subtle" fontSize="xs">
                    { item.finalized
                      ? t('substrate_finalized', { defaultValue: 'Finalized' })
                      : t('substrate_pending', { defaultValue: 'Pending' }) }
                  </Badge>
                </Td>
              </Tr>
            ))
          ) }
        </Tbody>
      </Table>

      { totalCount > 0 && (
        <Flex justify="space-between" align="center" px={ 4 } py={ 3 } borderTopWidth="1px" borderColor={ borderColor }>
          <Text fontSize="sm" color="gray.500">
            { t('substrate_total', { defaultValue: 'Total' }) }: { Number(totalCount).toLocaleString() }
          </Text>
          <HStack spacing={ 2 }>
            <Button size="sm" onClick={ () => setPage(0) } isDisabled={ page === 0 }>&laquo;</Button>
            <Button size="sm" onClick={ () => setPage((p) => Math.max(0, p - 1)) } isDisabled={ page === 0 }>
              { t('substrate_prev', { defaultValue: 'Prev' }) }
            </Button>
            <Text fontSize="sm" minW="80px" textAlign="center">{ page + 1 } / { totalPages || 1 }</Text>
            <Button size="sm" onClick={ () => setPage((p) => p + 1) } isDisabled={ page + 1 >= totalPages }>
              { t('substrate_next', { defaultValue: 'Next' }) }
            </Button>
            <Button size="sm" onClick={ () => setPage(totalPages - 1) } isDisabled={ page + 1 >= totalPages }>&raquo;</Button>
          </HStack>
        </Flex>
      ) }
    </Box>
  );
};

export default SubstrateBlocksList;
