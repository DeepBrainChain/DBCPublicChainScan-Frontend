import {
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import LinkInternal from 'ui/shared/LinkInternal';

const PAGE_SIZE = 25;

interface SubstrateAccountItem {
  address: string;
  balance: string;
  lock: string;
  count_extrinsic: number;
  account_display?: {
    display?: string;
  };
}

const truncateAddress = (addr: string) => {
  if (!addr) return '—';
  if (addr.length <= 18) return addr;
  return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
};

const formatDbcBalance = (value: string) => {
  const num = Number(value || '0') / 1e15;
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 4 })} DBC`;
};

const SubstrateAccountsList = () => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const [ page, setPage ] = React.useState(0);

  const { data, isPlaceholderData, isLoading } = useApiQuery('substrate_accounts' as any, {
    queryParams: { row: String(PAGE_SIZE), page: String(page) } as any,
    queryOptions: { refetchInterval: 30000 },
  });

  const typedData = data as { items?: Array<SubstrateAccountItem>; total_count?: number } | undefined;
  const items = typedData?.items ?? [];
  const totalCount = typedData?.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const loading = isLoading || isPlaceholderData;

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflowX="auto">
      <Table variant="simple" size="sm" minWidth="900px">
        <Thead>
          <Tr>
            <Th width="80px">{ t('substrate_rank', { defaultValue: 'Rank(#)' }) }</Th>
            <Th>{ t('substrate_address', { defaultValue: 'Address' }) }</Th>
            <Th isNumeric>{ t('substrate_balance', { defaultValue: 'Balance' }) }</Th>
            <Th isNumeric>{ t('substrate_locked', { defaultValue: 'Locked' }) }</Th>
            <Th isNumeric>{ t('substrate_extrinsics', { defaultValue: 'Extrinsics' }) }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { items.length === 0 && !loading ? (
            <Tr>
              <Td colSpan={ 5 }>
                <Text color={ labelColor } textAlign="center" py={ 4 }>
                  { t('no_data', { defaultValue: 'No data' }) }
                </Text>
              </Td>
            </Tr>
          ) : (
            items.map((item, index) => (
              <Tr key={ item.address || String(index) }>
                <Td>
                  <Skeleton isLoaded={ !loading }>
                    <Text>{ page * PAGE_SIZE + index + 1 }</Text>
                  </Skeleton>
                </Td>
                <Td>
                  <Skeleton isLoaded={ !loading }>
                    <LinkInternal href={ `/substrate/account/${item.address}` } color="link_hovered" fontWeight="medium">
                      <Text fontFamily="mono" fontSize="sm">{ truncateAddress(item.address) }</Text>
                    </LinkInternal>
                    { item.account_display?.display && (
                      <Text fontSize="xs" color={ labelColor } mt={ 1 }>{ item.account_display.display }</Text>
                    ) }
                  </Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton isLoaded={ !loading }>
                    <Text>{ formatDbcBalance(item.balance) }</Text>
                  </Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton isLoaded={ !loading }>
                    <Text>{ formatDbcBalance(item.lock) }</Text>
                  </Skeleton>
                </Td>
                <Td isNumeric>
                  <Skeleton isLoaded={ !loading }>
                    <Text>{ Number(item.count_extrinsic || 0).toLocaleString() }</Text>
                  </Skeleton>
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

export default SubstrateAccountsList;
