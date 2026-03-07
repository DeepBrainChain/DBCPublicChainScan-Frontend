import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Select,
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

const MODULES = [
  '', 'balances', 'staking', 'timestamp', 'system', 'utility', 'session',
  'im_online', 'grandpa', 'treasury', 'council', 'democracy', 'elections',
  'scheduler', 'proxy', 'multisig', 'identity', 'sudo',
];

const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString();
};

const formatHash = (hash: string | undefined) => {
  if (!hash) return '-';
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

const SkeletonRows = () => (
  <>
    { Array.from({ length: PAGE_SIZE }).map((_, i) => (
      <Tr key={ i }>
        { Array.from({ length: 7 }).map((__, j) => (
          <Td key={ j }><Skeleton h="16px" w="90px"/></Td>
        )) }
      </Tr>
    )) }
  </>
);

const SubstrateExtrinsicsList = () => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [ page, setPage ] = React.useState(0);
  const [ module, setModule ] = React.useState('');
  const [ signedOnly, setSignedOnly ] = React.useState(false);

  const queryParams: Record<string, string> = {
    row: String(PAGE_SIZE),
    page: String(page),
  };
  if (module) queryParams.module = module;
  if (signedOnly) queryParams.signed = 'true';

  const { data, isLoading, isPlaceholderData } = useApiQuery('substrate_extrinsics' as any, {
    queryParams: queryParams as any,
    queryOptions: { refetchInterval: page === 0 && !module && !signedOnly ? 15000 : undefined },
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

  const handleSignedToggle = React.useCallback(() => {
    setSignedOnly((v) => !v);
    setPage(0);
  }, []);

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
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
        <Button
          size="sm"
          variant={ signedOnly ? 'solid' : 'outline' }
          colorScheme={ signedOnly ? 'blue' : 'gray' }
          onClick={ handleSignedToggle }
        >
          { t('substrate_signed_only', { defaultValue: 'Signed Only' }) }
        </Button>
        { (module || signedOnly) && (
          <Button size="sm" variant="ghost" onClick={ () => { setModule(''); setSignedOnly(false); setPage(0); } }>
            { t('substrate_clear_filter', { defaultValue: 'Clear' }) }
          </Button>
        ) }
      </Flex>

      <Table variant="simple" size="sm" minWidth="950px">
        <Thead>
          <Tr>
            <Th>{ t('substrate_extrinsic_id', { defaultValue: 'Extrinsic ID' }) }</Th>
            <Th>{ t('substrate_block', { defaultValue: 'Block' }) }</Th>
            <Th>{ t('substrate_time', { defaultValue: 'Time' }) }</Th>
            <Th>{ t('substrate_module_call', { defaultValue: 'Module/Call' }) }</Th>
            <Th>{ t('substrate_hash', { defaultValue: 'Hash' }) }</Th>
            <Th>{ t('substrate_result', { defaultValue: 'Result' }) }</Th>
            <Th isNumeric>{ t('substrate_fee', { defaultValue: 'Fee' }) }</Th>
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
            items.map((item, index) => {
              const extrinsicId = item?.extrinsic_index ?? item?.id ?? `${item?.block_number ?? '-'}-${index}`;
              const block = item?.block_number ?? item?.block ?? item?.block_num ?? '-';
              const moduleName = item?.module ?? item?.call_module ?? '-';
              const callName = item?.call_function ?? item?.call_name ?? item?.call_module_function ?? '-';
              const hash = item?.hash ?? item?.extrinsic_hash;
              const success = Boolean(item?.success);
              const fee = item?.fee ?? '-';

              return (
                <Tr key={ String(extrinsicId) }>
                  <Td>
                    <LinkInternal href={ `/substrate/extrinsic/${extrinsicId}` } color="link_hovered" fontWeight="medium">
                      { String(extrinsicId) }
                    </LinkInternal>
                  </Td>
                  <Td>
                    <LinkInternal href={ `/substrate/block/${block}` } color="link_hovered">
                      { block }
                    </LinkInternal>
                  </Td>
                  <Td>{ formatTime(item?.block_timestamp) }</Td>
                  <Td>{ `${moduleName}.${callName}` }</Td>
                  <Td>
                    <Text fontFamily="mono" fontSize="sm">{ formatHash(hash) }</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={ success ? 'green' : 'red' } variant="subtle">
                      { success
                        ? t('substrate_success', { defaultValue: 'Success' })
                        : t('substrate_failed', { defaultValue: 'Failed' }) }
                    </Badge>
                  </Td>
                  <Td isNumeric>{ fee }</Td>
                </Tr>
              );
            })
          ) }
        </Tbody>
      </Table>

      { totalCount > 0 && (
        <Flex justify="space-between" align="center" px={ 4 } py={ 3 } borderTopWidth="1px" borderColor={ borderColor }>
          <Text fontSize="sm" color="gray.500">
            { t('substrate_total', { defaultValue: 'Total' }) }: { Number(totalCount).toLocaleString() }
          </Text>
          <HStack spacing={ 2 }>
            <Button size="sm" onClick={ () => setPage(0) } isDisabled={ page === 0 }>
              &laquo;
            </Button>
            <Button size="sm" onClick={ () => setPage((p) => Math.max(0, p - 1)) } isDisabled={ page === 0 }>
              { t('substrate_prev', { defaultValue: 'Prev' }) }
            </Button>
            <Text fontSize="sm" minW="80px" textAlign="center">
              { page + 1 } / { totalPages || 1 }
            </Text>
            <Button size="sm" onClick={ () => setPage((p) => p + 1) } isDisabled={ page + 1 >= totalPages }>
              { t('substrate_next', { defaultValue: 'Next' }) }
            </Button>
            <Button size="sm" onClick={ () => setPage(totalPages - 1) } isDisabled={ page + 1 >= totalPages }>
              &raquo;
            </Button>
          </HStack>
        </Flex>
      ) }
    </Box>
  );
};

export default SubstrateExtrinsicsList;
