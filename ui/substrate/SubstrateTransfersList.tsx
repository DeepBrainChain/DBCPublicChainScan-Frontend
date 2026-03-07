import {
  Badge, Box, Button, Flex, HStack, Table, Thead, Tbody, Tr, Th, Td, Text, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import LinkInternal from 'ui/shared/LinkInternal';

const PAGE_SIZE = 25;

const truncateAddr = (addr: string) => {
  if (!addr || addr.length <= 16) return addr || '—';
  return `${ addr.slice(0, 8) }...${ addr.slice(-6) }`;
};

const formatTime = (timestamp: number) => {
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  return new Date(ms).toLocaleString();
};

const formatAmount = (item: any) => {
  // Subscan 'amount' is already in human-readable DBC, 'amount_v2' is in Planck
  const raw = item.amount || item.amount_v2;
  if (!raw || raw === '0') return '0 DBC';
  // If amount exists, it's already converted; if only amount_v2, convert from Planck
  const num = item.amount ? Number(item.amount) : Number(item.amount_v2) / 1e15;
  return `${ num.toLocaleString(undefined, { maximumFractionDigits: 4 }) } ${ item.asset_symbol || 'DBC' }`;
};

const SubstrateTransfersList = () => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [ page, setPage ] = React.useState(0);

  const { data, isPlaceholderData, isLoading } = useApiQuery('substrate_transfers' as any, {
    queryParams: { row: String(PAGE_SIZE), page: String(page) } as any,
    queryOptions: { refetchInterval: page === 0 ? 15000 : undefined },
  });

  const typedData = data as { items?: Array<any>; total_count?: number } | undefined;
  const items = typedData?.items ?? [];
  const totalCount = typedData?.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const loading = isLoading || isPlaceholderData;

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{ t('substrate_extrinsic', { defaultValue: 'Extrinsic' }) }</Th>
            <Th>{ t('substrate_block', { defaultValue: 'Block' }) }</Th>
            <Th>{ t('substrate_time', { defaultValue: 'Time' }) }</Th>
            <Th>{ t('substrate_from', { defaultValue: 'From' }) }</Th>
            <Th>{ t('substrate_to', { defaultValue: 'To' }) }</Th>
            <Th>{ t('substrate_amount', { defaultValue: 'Amount' }) }</Th>
            <Th>{ t('substrate_result', { defaultValue: 'Result' }) }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { items.length === 0 && !loading ? (
            <Tr><Td colSpan={ 7 }><Text color="gray.500" textAlign="center" py={ 4 }>{ t('no_data', { defaultValue: 'No data' }) }</Text></Td></Tr>
          ) : items.map((item: any, idx: number) => (
            <Tr key={ item.hash || idx }>
              <Td>
                <Skeleton isLoaded={ !loading }>
                  { item.extrinsic_index ? (
                    <LinkInternal href={ `/substrate/extrinsic/${ item.extrinsic_index }` } color="link_hovered" fontSize="sm">
                      { item.extrinsic_index }
                    </LinkInternal>
                  ) : <Text fontSize="sm">—</Text> }
                </Skeleton>
              </Td>
              <Td>
                <Skeleton isLoaded={ !loading }>
                  <LinkInternal href={ `/substrate/block/${ item.block_num }` } color="link_hovered" fontSize="sm">
                    { item.block_num }
                  </LinkInternal>
                </Skeleton>
              </Td>
              <Td><Skeleton isLoaded={ !loading }><Text fontSize="xs">{ formatTime(item.block_timestamp) }</Text></Skeleton></Td>
              <Td>
                <Skeleton isLoaded={ !loading }>
                  <LinkInternal href={ `/substrate/account/${ item.from }` } color="link_hovered">
                    <Text fontSize="xs" fontFamily="mono">{ truncateAddr(item.from) }</Text>
                  </LinkInternal>
                </Skeleton>
              </Td>
              <Td>
                <Skeleton isLoaded={ !loading }>
                  <LinkInternal href={ `/substrate/account/${ item.to }` } color="link_hovered">
                    <Text fontSize="xs" fontFamily="mono">{ truncateAddr(item.to) }</Text>
                  </LinkInternal>
                </Skeleton>
              </Td>
              <Td><Skeleton isLoaded={ !loading }><Text fontSize="sm">{ formatAmount(item) }</Text></Skeleton></Td>
              <Td>
                <Skeleton isLoaded={ !loading }>
                  <Badge colorScheme={ item.success ? 'green' : 'red' } variant="subtle">
                    { item.success ? t('substrate_success', { defaultValue: 'Success' }) : t('substrate_failed', { defaultValue: 'Failed' }) }
                  </Badge>
                </Skeleton>
              </Td>
            </Tr>
          )) }
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

export default SubstrateTransfersList;
