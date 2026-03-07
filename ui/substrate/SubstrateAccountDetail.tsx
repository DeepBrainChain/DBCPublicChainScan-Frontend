import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  address: string;
}

const PAGE_SIZE = 25;

const formatDbc = (value: string | undefined) => {
  if (!value || value === '0') return '0 DBC';
  const num = Number(value) / 1e15;
  return `${ num.toLocaleString(undefined, { maximumFractionDigits: 4 }) } DBC`;
};

const formatDbcDirect = (value: string | undefined) => {
  if (!value || value === '0') return '0 DBC';
  const num = Number(value);
  return `${ num.toLocaleString(undefined, { maximumFractionDigits: 4 }) } DBC`;
};

const truncateAddress = (addr: string) => {
  if (!addr) return '—';
  if (addr.length <= 18) return addr;
  return `${ addr.slice(0, 10) }...${ addr.slice(-8) }`;
};

const formatTime = (timestamp: number) => {
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  return new Date(ms).toLocaleString();
};

const PROXY = '/node-api/proxy/api/v2/substrate';

/* ── Generic paginated fetch hook ── */
function usePaginatedFetch<T>(url: string | null, pageSize = PAGE_SIZE) {
  const [ page, setPage ] = React.useState(0);
  const [ items, setItems ] = React.useState<Array<T>>([]);
  const [ totalCount, setTotalCount ] = React.useState(0);
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(`${ url }${ url.includes('?') ? '&' : '?' }row=${ pageSize }&page=${ page }`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d?.items || []);
        setTotalCount(d?.total_count || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ url, page, pageSize ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  return { items, totalCount, loading, page, setPage, totalPages };
}

/* ── Pagination bar ── */
const PaginationBar = ({ page, setPage, totalPages, totalCount, borderColor, t }: any) => (
  totalCount > 0 ? (
    <Flex justify="space-between" align="center" px={ 4 } py={ 3 } borderTopWidth="1px" borderColor={ borderColor }>
      <Text fontSize="sm" color="gray.500">
        { t('substrate_total', { defaultValue: 'Total' }) }: { Number(totalCount).toLocaleString() }
      </Text>
      <HStack spacing={ 2 }>
        <Button size="sm" onClick={ () => setPage(0) } isDisabled={ page === 0 }>&laquo;</Button>
        <Button size="sm" onClick={ () => setPage((p: number) => Math.max(0, p - 1)) } isDisabled={ page === 0 }>
          { t('substrate_prev', { defaultValue: 'Prev' }) }
        </Button>
        <Text fontSize="sm" minW="80px" textAlign="center">{ page + 1 } / { totalPages || 1 }</Text>
        <Button size="sm" onClick={ () => setPage((p: number) => p + 1) } isDisabled={ page + 1 >= totalPages }>
          { t('substrate_next', { defaultValue: 'Next' }) }
        </Button>
        <Button size="sm" onClick={ () => setPage(totalPages - 1) } isDisabled={ page + 1 >= totalPages }>&raquo;</Button>
      </HStack>
    </Flex>
  ) : null
);

const InfoRow = ({ label, children, isLoading, labelColor }: {
  label: string; children: React.ReactNode; isLoading: boolean; labelColor: string;
}) => (
  <Grid templateColumns="180px 1fr" gap={ 4 } py={ 3 } borderBottomWidth="1px" borderColor="inherit">
    <GridItem><Text color={ labelColor } fontWeight="medium">{ label }</Text></GridItem>
    <GridItem><Skeleton isLoaded={ !isLoading }>{ children }</Skeleton></GridItem>
  </Grid>
);

const SubstrateAccountDetail = ({ address }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  const { data, isLoading } = useApiQuery('substrate_account' as any, {
    pathParams: { id: address },
    queryOptions: { enabled: Boolean(address) },
  });

  const accountData = data as any;
  const native = accountData?.native?.[0];

  // Nominators
  const [ nominators, setNominators ] = React.useState<Array<any>>([]);
  const [ nominatorsLoading, setNominatorsLoading ] = React.useState(true);
  React.useEffect(() => {
    if (!address) return;
    setNominatorsLoading(true);
    fetch(`${ PROXY }/account/${ address }/nominators`)
      .then((r) => r.json())
      .then((d) => { setNominators(d?.items || []); setNominatorsLoading(false); })
      .catch(() => setNominatorsLoading(false));
  }, [ address ]);

  // Paginated data
  const extrinsics = usePaginatedFetch<any>(address ? `${ PROXY }/extrinsics?address=${ address }` : null);
  const transfers = usePaginatedFetch<any>(address ? `${ PROXY }/transfers?address=${ address }` : null);

  // Lazy-loaded tabs: only fetch when tab is activated
  const [ activeTab, setActiveTab ] = React.useState(0);
  const rewards = usePaginatedFetch<any>(activeTab === 2 && address ? `${ PROXY }/account/${ address }/reward_slash?category=Reward` : null);
  const slashes = usePaginatedFetch<any>(activeTab === 3 && address ? `${ PROXY }/account/${ address }/reward_slash?category=Slash` : null);
  const multisig = usePaginatedFetch<any>(activeTab === 4 && address ? `${ PROXY }/account/${ address }/multisig` : null);

  // Balance history (non-paginated)
  const [ balanceHistory, setBalanceHistory ] = React.useState<Array<any>>([]);
  const [ balHistLoading, setBalHistLoading ] = React.useState(false);
  React.useEffect(() => {
    if (activeTab !== 5 || !address) return;
    setBalHistLoading(true);
    fetch(`${ PROXY }/account/${ address }/balance_history`)
      .then((r) => r.json())
      .then((d) => { setBalanceHistory(d?.history || []); setBalHistLoading(false); })
      .catch(() => setBalHistLoading(false));
  }, [ activeTab, address ]);

  const noDataRow = (cols: number) => (
    <Tr><Td colSpan={ cols }><Text color="gray.500" textAlign="center" py={ 4 }>{ t('no_data', { defaultValue: 'No data' }) }</Text></Td></Tr>
  );

  const skeletonRows = (cols: number, rows = 5) =>
    Array.from({ length: rows }).map((_, i) => (
      <Tr key={ i }>{ Array.from({ length: cols }).map((_, j) => <Td key={ j }><Skeleton h="16px" w="80px"/></Td>) }</Tr>
    ));

  return (
    <>
      {/* Account Info Card */}
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 } mb={ 6 }>
        <InfoRow label={ t('substrate_address', { defaultValue: 'Address' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
            { address }
            <CopyToClipboard text={ address } ml={ 2 }/>
          </Text>
        </InfoRow>
        <InfoRow label={ t('substrate_balance', { defaultValue: 'Balance' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text fontWeight="bold" fontSize="lg">{ formatDbc(native?.balance) }</Text>
        </InfoRow>
        <InfoRow label={ t('substrate_locked', { defaultValue: 'Locked' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ formatDbc(native?.lock) }</Text>
        </InfoRow>
        <InfoRow label={ t('substrate_reserved', { defaultValue: 'Reserved' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ formatDbc(native?.reserved) }</Text>
        </InfoRow>
        <InfoRow label={ t('substrate_bonded', { defaultValue: 'Bonded' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ formatDbc(native?.bonded) }</Text>
        </InfoRow>
        <InfoRow label={ t('substrate_unbonding', { defaultValue: 'Unbonding' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ formatDbc(native?.unbonding) }</Text>
        </InfoRow>
      </Box>

      {/* Nominators (only for validators) */}
      { (nominators.length > 0 || nominatorsLoading) && (
        <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto" mb={ 6 }>
          <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
            <Text fontSize="lg" fontWeight="bold">
              { t('substrate_nominators', { defaultValue: 'Nominators' }) }
              { !nominatorsLoading && nominators.length > 0 && (
                <Text as="span" fontSize="sm" fontWeight="normal" color={ labelColor } ml={ 2 }>({ nominators.length })</Text>
              ) }
            </Text>
          </Box>
          <Table variant="simple" size="sm">
            <Thead><Tr><Th width="60px">#</Th><Th>Address</Th><Th isNumeric>Bonded</Th></Tr></Thead>
            <Tbody>
              { nominatorsLoading ? skeletonRows(3, 3) : nominators.map((nom, idx) => (
                <Tr key={ nom.address }>
                  <Td>{ idx + 1 }</Td>
                  <Td>
                    <LinkInternal href={ `/substrate/account/${ nom.address }` } color="link_hovered">
                      <Text fontFamily="mono" fontSize="sm">{ truncateAddress(nom.address) }</Text>
                    </LinkInternal>
                    { nom.name && <Text fontSize="xs" color={ labelColor }>{ nom.name }</Text> }
                  </Td>
                  <Td isNumeric><Text fontWeight="medium">{ Number(nom.bonded).toLocaleString(undefined, { maximumFractionDigits: 4 }) } DBC</Text></Td>
                </Tr>
              )) }
            </Tbody>
          </Table>
        </Box>
      ) }

      {/* Tabbed Data Sections */}
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflowX="auto">
        <Tabs index={ activeTab } onChange={ setActiveTab } isLazy variant="line" colorScheme="blue">
          <TabList px={ 4 } overflowX="auto" flexWrap="nowrap">
            <Tab fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
              Extrinsics{ extrinsics.totalCount > 0 && ` (${ extrinsics.totalCount.toLocaleString() })` }
            </Tab>
            <Tab fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
              Transfers{ transfers.totalCount > 0 && ` (${ transfers.totalCount.toLocaleString() })` }
            </Tab>
            <Tab fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
              Reward{ rewards.totalCount > 0 && ` (${ rewards.totalCount.toLocaleString() })` }
            </Tab>
            <Tab fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
              Slash{ slashes.totalCount > 0 && ` (${ slashes.totalCount.toLocaleString() })` }
            </Tab>
            <Tab fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
              Multisig{ multisig.totalCount > 0 && ` (${ multisig.totalCount.toLocaleString() })` }
            </Tab>
            <Tab fontSize="sm" fontWeight="medium" whiteSpace="nowrap">Balance History</Tab>
          </TabList>

          <TabPanels>
            {/* ── Extrinsics Tab ── */}
            <TabPanel p={ 0 }>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Extrinsic ID</Th><Th>Block</Th>
                    <Th display={{ base: 'none', md: 'table-cell' }}>Time</Th>
                    <Th>Module/Call</Th><Th>Result</Th><Th isNumeric>Fee</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { extrinsics.loading ? skeletonRows(6) : extrinsics.items.length === 0 ? noDataRow(6) :
                    extrinsics.items.map((item: any, idx: number) => (
                      <Tr key={ item.extrinsic_index || item.id || idx }>
                        <Td><LinkInternal href={ `/substrate/extrinsic/${ item.extrinsic_index || item.id }` } color="link_hovered" fontWeight="medium"><Text fontSize="sm">{ item.extrinsic_index || item.id }</Text></LinkInternal></Td>
                        <Td><LinkInternal href={ `/substrate/block/${ item.block_num || item.block_number }` } color="link_hovered" fontSize="sm">{ item.block_num || item.block_number }</LinkInternal></Td>
                        <Td display={{ base: 'none', md: 'table-cell' }}><Text fontSize="xs">{ item.block_timestamp ? formatTime(item.block_timestamp) : '—' }</Text></Td>
                        <Td><Text fontSize="sm">{ `${ item.call_module || item.module || '-' }.${ item.call_module_function || item.call_function || '-' }` }</Text></Td>
                        <Td><Badge colorScheme={ item.success ? 'green' : 'red' } variant="subtle" fontSize="xs">{ item.success ? 'Success' : 'Failed' }</Badge></Td>
                        <Td isNumeric><Text fontSize="sm">{ item.fee || '-' }</Text></Td>
                      </Tr>
                    )) }
                </Tbody>
              </Table>
              <PaginationBar { ...extrinsics } borderColor={ borderColor } t={ t }/>
            </TabPanel>

            {/* ── Transfers Tab ── */}
            <TabPanel p={ 0 }>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Extrinsic</Th><Th>Block</Th>
                    <Th display={{ base: 'none', md: 'table-cell' }}>Time</Th>
                    <Th>From</Th><Th>To</Th><Th isNumeric>Amount</Th><Th>Result</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { transfers.loading ? skeletonRows(7) : transfers.items.length === 0 ? noDataRow(7) :
                    transfers.items.map((item: any, idx: number) => {
                      const isSender = item.from?.toLowerCase() === address?.toLowerCase();
                      return (
                        <Tr key={ item.extrinsic_index || item.hash || idx }>
                          <Td>{ item.extrinsic_index ? <LinkInternal href={ `/substrate/extrinsic/${ item.extrinsic_index }` } color="link_hovered"><Text fontSize="sm">{ item.extrinsic_index }</Text></LinkInternal> : <Text fontSize="sm">—</Text> }</Td>
                          <Td><LinkInternal href={ `/substrate/block/${ item.block_num }` } color="link_hovered" fontSize="sm">{ item.block_num }</LinkInternal></Td>
                          <Td display={{ base: 'none', md: 'table-cell' }}><Text fontSize="xs">{ item.block_timestamp ? formatTime(item.block_timestamp) : '—' }</Text></Td>
                          <Td>{ isSender ? <Text fontSize="xs" fontFamily="mono" fontWeight="bold">{ truncateAddress(item.from) }</Text> : <LinkInternal href={ `/substrate/account/${ item.from }` } color="link_hovered"><Text fontSize="xs" fontFamily="mono">{ truncateAddress(item.from) }</Text></LinkInternal> }</Td>
                          <Td>{ !isSender ? <Text fontSize="xs" fontFamily="mono" fontWeight="bold">{ truncateAddress(item.to) }</Text> : <LinkInternal href={ `/substrate/account/${ item.to }` } color="link_hovered"><Text fontSize="xs" fontFamily="mono">{ truncateAddress(item.to) }</Text></LinkInternal> }</Td>
                          <Td isNumeric><Text fontSize="sm" color={ isSender ? 'red.500' : 'green.500' } fontWeight="medium">{ isSender ? '-' : '+' }{ formatDbcDirect(item.amount) }</Text></Td>
                          <Td><Badge colorScheme={ item.success ? 'green' : 'red' } variant="subtle" fontSize="xs">{ item.success ? 'Success' : 'Failed' }</Badge></Td>
                        </Tr>
                      );
                    }) }
                </Tbody>
              </Table>
              <PaginationBar { ...transfers } borderColor={ borderColor } t={ t }/>
            </TabPanel>

            {/* ── Reward Tab ── */}
            <TabPanel p={ 0 }>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>Event</Th><Th>Era</Th><Th>Time</Th><Th>Action</Th><Th isNumeric>Amount</Th></Tr>
                </Thead>
                <Tbody>
                  { rewards.loading ? skeletonRows(5) : rewards.items.length === 0 ? noDataRow(5) :
                    rewards.items.map((item: any, idx: number) => (
                      <Tr key={ item.event_index || idx }>
                        <Td>
                          { item.event_index ? (
                            <LinkInternal href={ `/substrate/event/${ item.event_index }` } color="link_hovered">
                              <Text fontSize="sm">{ item.event_index }</Text>
                            </LinkInternal>
                          ) : <Text fontSize="sm">—</Text> }
                        </Td>
                        <Td><Text fontSize="sm">{ item.era }</Text></Td>
                        <Td><Text fontSize="xs">{ item.block_timestamp ? formatTime(item.block_timestamp) : '—' }</Text></Td>
                        <Td><Badge colorScheme="green" variant="subtle" fontSize="xs">{ item.event_id || 'Rewarded' }</Badge></Td>
                        <Td isNumeric><Text fontSize="sm" color="green.500" fontWeight="medium">+{ item.amount } DBC</Text></Td>
                      </Tr>
                    )) }
                </Tbody>
              </Table>
              <PaginationBar { ...rewards } borderColor={ borderColor } t={ t }/>
            </TabPanel>

            {/* ── Slash Tab ── */}
            <TabPanel p={ 0 }>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>Event</Th><Th>Era</Th><Th>Time</Th><Th>Action</Th><Th isNumeric>Amount</Th></Tr>
                </Thead>
                <Tbody>
                  { slashes.loading ? skeletonRows(5) : slashes.items.length === 0 ? noDataRow(5) :
                    slashes.items.map((item: any, idx: number) => (
                      <Tr key={ item.event_index || idx }>
                        <Td>
                          { item.event_index ? (
                            <LinkInternal href={ `/substrate/event/${ item.event_index }` } color="link_hovered">
                              <Text fontSize="sm">{ item.event_index }</Text>
                            </LinkInternal>
                          ) : <Text fontSize="sm">—</Text> }
                        </Td>
                        <Td><Text fontSize="sm">{ item.era }</Text></Td>
                        <Td><Text fontSize="xs">{ item.block_timestamp ? formatTime(item.block_timestamp) : '—' }</Text></Td>
                        <Td><Badge colorScheme="red" variant="subtle" fontSize="xs">{ item.event_id || 'Slashed' }</Badge></Td>
                        <Td isNumeric><Text fontSize="sm" color="red.500" fontWeight="medium">-{ item.amount } DBC</Text></Td>
                      </Tr>
                    )) }
                </Tbody>
              </Table>
              <PaginationBar { ...slashes } borderColor={ borderColor } t={ t }/>
            </TabPanel>

            {/* ── Multisig Tab ── */}
            <TabPanel p={ 0 }>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr><Th>ID</Th><Th>Time</Th><Th>Call</Th><Th>Threshold</Th><Th>Status</Th></Tr>
                </Thead>
                <Tbody>
                  { multisig.loading ? skeletonRows(5) : multisig.items.length === 0 ? noDataRow(5) :
                    multisig.items.map((item: any, idx: number) => (
                      <Tr key={ item.multi_id || idx }>
                        <Td><Text fontSize="sm" fontFamily="mono">{ item.multi_id }</Text></Td>
                        <Td><Text fontSize="xs">{ item.block_timestamp ? formatTime(item.block_timestamp) : '—' }</Text></Td>
                        <Td><Text fontSize="sm">{ `${ item.call_module || '-' }.${ item.call_module_function || '-' }` }</Text></Td>
                        <Td><Text fontSize="sm">{ item.threshold }</Text></Td>
                        <Td>
                          <Badge colorScheme={ item.status === 'Executed' ? 'green' : item.status === 'Cancelled' ? 'red' : 'yellow' } variant="subtle" fontSize="xs">
                            { item.status }
                          </Badge>
                        </Td>
                      </Tr>
                    )) }
                </Tbody>
              </Table>
              <PaginationBar { ...multisig } borderColor={ borderColor } t={ t }/>
            </TabPanel>

            {/* ── Balance History Tab ── */}
            <TabPanel p={ 0 }>
              { balHistLoading ? (
                <Table variant="simple" size="sm">
                  <Thead><Tr><Th>Date</Th><Th isNumeric>Balance (DBC)</Th></Tr></Thead>
                  <Tbody>{ skeletonRows(2, 5) }</Tbody>
                </Table>
              ) : balanceHistory.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={ 8 }>{ t('no_data', { defaultValue: 'No data' }) }</Text>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr><Th>Date</Th><Th isNumeric>Balance (DBC)</Th></Tr>
                  </Thead>
                  <Tbody>
                    { balanceHistory.slice(-60).reverse().map((item: any, idx: number) => (
                      <Tr key={ item.date || idx }>
                        <Td><Text fontSize="sm">{ item.date }</Text></Td>
                        <Td isNumeric><Text fontSize="sm" fontWeight="medium">{ Number(item.balance).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</Text></Td>
                      </Tr>
                    )) }
                  </Tbody>
                </Table>
              ) }
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default SubstrateAccountDetail;
