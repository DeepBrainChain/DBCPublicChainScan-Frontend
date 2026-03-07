import {
  Box, Button, Flex, HStack, Select, Table, Thead, Tbody, Tr, Th, Td, Text, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import LinkInternal from 'ui/shared/LinkInternal';

const PAGE_SIZE = 25;

const MODULES = [
  '', 'system', 'balances', 'staking', 'timestamp', 'utility', 'session',
  'im_online', 'grandpa', 'treasury', 'council', 'democracy', 'elections',
  'scheduler', 'proxy', 'multisig', 'identity', 'sudo', 'ethereum',
  'evm', 'baseFee', 'transactionPayment',
];

const formatTime = (timestamp: number) => {
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  return new Date(ms).toLocaleString();
};

const SubstrateEventsList = () => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [ page, setPage ] = React.useState(0);
  const [ module, setModule ] = React.useState('');

  const queryParams: Record<string, string> = {
    row: String(PAGE_SIZE),
    page: String(page),
  };
  if (module) queryParams.module = module;

  const { data, isPlaceholderData, isLoading } = useApiQuery('substrate_events' as any, {
    queryParams: queryParams as any,
    queryOptions: { refetchInterval: page === 0 && !module ? 15000 : undefined },
  });

  const typedData = data as { items?: Array<any>; total_count?: number } | undefined;
  const items = typedData?.items ?? [];
  const totalCount = typedData?.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const loading = isLoading || isPlaceholderData;

  const handleModuleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setModule(e.target.value);
    setPage(0);
  }, []);

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflowX="auto">
      <Flex px={ 4 } py={ 3 } gap={ 3 } align="center" borderBottomWidth="1px" borderColor={ borderColor } flexWrap="wrap">
        <Select
          size="sm"
          maxW="200px"
          value={ module }
          onChange={ handleModuleChange }
          placeholder={ t('substrate_all_modules', { defaultValue: 'All Modules' }) }
        >
          { MODULES.filter(Boolean).map((m) => (
            <option key={ m } value={ m }>{ m }</option>
          )) }
        </Select>
        { module && (
          <Button size="sm" variant="ghost" onClick={ () => { setModule(''); setPage(0); } }>
            { t('substrate_clear_filter', { defaultValue: 'Clear' }) }
          </Button>
        ) }
      </Flex>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{ t('substrate_event_index', { defaultValue: 'Event Index' }) }</Th>
            <Th>{ t('substrate_block', { defaultValue: 'Block' }) }</Th>
            <Th>{ t('substrate_time', { defaultValue: 'Time' }) }</Th>
            <Th>{ t('substrate_extrinsic', { defaultValue: 'Extrinsic' }) }</Th>
            <Th>{ t('substrate_module', { defaultValue: 'Module' }) }</Th>
            <Th>{ t('substrate_event', { defaultValue: 'Event' }) }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { items.length === 0 && !loading ? (
            <Tr><Td colSpan={ 6 }><Text color="gray.500" textAlign="center" py={ 4 }>{ t('no_data', { defaultValue: 'No data' }) }</Text></Td></Tr>
          ) : items.map((item: any, idx: number) => {
            const blockNum = item.block_num || item.event_index?.split('-')[0];
            return (
              <Tr key={ item.event_index || idx }>
                <Td>
                  <Skeleton isLoaded={ !loading }>
                    <LinkInternal href={ `/substrate/event/${ item.event_index }` } color="link_hovered">
                      { item.event_index }
                    </LinkInternal>
                  </Skeleton>
                </Td>
                <Td>
                  <Skeleton isLoaded={ !loading }>
                    <LinkInternal href={ `/substrate/block/${ blockNum }` } color="link_hovered">
                      { blockNum }
                    </LinkInternal>
                  </Skeleton>
                </Td>
                <Td><Skeleton isLoaded={ !loading }><Text fontSize="xs">{ formatTime(item.block_timestamp) }</Text></Skeleton></Td>
                <Td>
                  <Skeleton isLoaded={ !loading }>
                    { item.extrinsic_index ? (
                      <LinkInternal href={ `/substrate/extrinsic/${ item.extrinsic_index }` } color="link_hovered" fontSize="sm">
                        { item.extrinsic_index }
                      </LinkInternal>
                    ) : <Text fontSize="sm">—</Text> }
                  </Skeleton>
                </Td>
                <Td><Skeleton isLoaded={ !loading }><Text fontSize="sm">{ item.module_id || item.module }</Text></Skeleton></Td>
                <Td><Skeleton isLoaded={ !loading }><Text fontSize="sm">{ item.event_id || item.event }</Text></Skeleton></Td>
              </Tr>
            );
          }) }
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

export default SubstrateEventsList;
