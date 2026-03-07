import {
  Badge,
  Box,
  Code,
  Grid,
  GridItem,
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
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  extrinsicId: string;
}

const InfoItem = ({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: React.ReactNode;
  isLoading: boolean;
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box>
      <Text fontSize="xs" color={ labelColor } mb={ 1 }>{ label }</Text>
      <Skeleton isLoaded={ !isLoading }>
        <Text fontWeight="medium" wordBreak="break-all">{ value || '-' }</Text>
      </Skeleton>
    </Box>
  );
};

const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) {
    return '-';
  }

  return new Date(timestamp * 1000).toLocaleString();
};

const truncateHash = (hash: string) => {
  if (!hash || hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

const SubstrateExtrinsicDetail = ({ extrinsicId }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBg = useColorModeValue('gray.50', 'gray.900');

  const { data, isLoading } = useApiQuery('substrate_extrinsic' as any, {
    pathParams: { id: extrinsicId },
    queryOptions: {
      enabled: Boolean(extrinsicId),
    },
  });

  const detail = (data as any) || {};

  // Params from Subscan is array of {name, type, value} objects
  const params: Array<{ name: string; type: string; value: any }> = (() => {
    if (!detail?.params) return [];
    if (typeof detail.params === 'string') {
      try { return JSON.parse(detail.params); } catch { return []; }
    }
    if (Array.isArray(detail.params)) return detail.params;
    return [];
  })();

  const events = Array.isArray(detail?.event) ? detail.event : [];

  const signerDisplay = detail?.signer_name
    ? `${detail.signer_name} (${truncateHash(detail.signer || '')})`
    : detail?.signer || '-';

  const isInherent = !detail?.signer && !detail?.signature;
  const blockNum = detail?.block_number ?? detail?.block;
  const extrinsicHash = detail?.hash ?? detail?.extrinsic_hash;

  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={ 4 }>
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
          <Text fontWeight="bold" mb={ 4 }>{ t('substrate_basic_info', { defaultValue: 'Basic Info' }) }</Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={ 4 }>
            <InfoItem
              label={ t('substrate_block', { defaultValue: 'Block' }) }
              value={ blockNum ? (
                <LinkInternal href={ `/substrate/block/${blockNum}` } color="link_hovered">
                  { blockNum }
                </LinkInternal>
              ) : '-' }
              isLoading={ isLoading }
            />
            <InfoItem label={ t('substrate_extrinsic_index', { defaultValue: 'Extrinsic Index' }) } value={ detail?.extrinsic_index } isLoading={ isLoading }/>
            <InfoItem
              label={ t('substrate_hash', { defaultValue: 'Hash' }) }
              value={ extrinsicHash ? (
                <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
                  { extrinsicHash }
                  <CopyToClipboard text={ extrinsicHash } ml={ 2 }/>
                </Text>
              ) : '-' }
              isLoading={ isLoading }
            />
            <InfoItem
              label={ t('substrate_block_hash', { defaultValue: 'Block Hash' }) }
              value={ detail?.block_hash ? (
                <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
                  { detail.block_hash }
                  <CopyToClipboard text={ detail.block_hash } ml={ 2 }/>
                </Text>
              ) : '-' }
              isLoading={ isLoading }
            />
            <InfoItem label={ t('substrate_timestamp', { defaultValue: 'Timestamp' }) } value={ formatTime(detail?.block_timestamp) } isLoading={ isLoading }/>
            <InfoItem
              label={ t('substrate_module_call', { defaultValue: 'Module/Call' }) }
              value={ `${detail?.module ?? detail?.call_module ?? '-'}.${detail?.call_function ?? detail?.call_name ?? '-'}` }
              isLoading={ isLoading }
            />
            <InfoItem
              label={ t('substrate_signer', { defaultValue: 'Signer' }) }
              value={ isInherent ? (
                <Badge colorScheme="purple" variant="subtle">Inherent</Badge>
              ) : (
                <LinkInternal href={ `/substrate/account/${detail?.signer}` } color="link_hovered">
                  { signerDisplay }
                </LinkInternal>
              ) }
              isLoading={ isLoading }
            />
            <InfoItem label={ t('substrate_nonce', { defaultValue: 'Nonce' }) } value={ isInherent ? '-' : detail?.nonce } isLoading={ isLoading }/>
            <InfoItem
              label={ t('substrate_result', { defaultValue: 'Result' }) }
              value={ (
                <Badge colorScheme={ detail?.success ? 'green' : 'red' } variant="subtle">
                  { detail?.success
                    ? t('substrate_success', { defaultValue: 'Success' })
                    : t('substrate_failed', { defaultValue: 'Failed' }) }
                </Badge>
              ) }
              isLoading={ isLoading }
            />
            <InfoItem label={ t('substrate_fee', { defaultValue: 'Fee' }) } value={ detail?.fee ? `${detail.fee} DBC` : '-' } isLoading={ isLoading }/>
            { detail?.tip && detail.tip !== '0.0000' && detail.tip !== '0' && (
              <InfoItem label={ t('substrate_tip', { defaultValue: 'Tip' }) } value={ `${detail.tip} DBC` } isLoading={ isLoading }/>
            ) }
            { detail?.lifetime && (
              <InfoItem
                label={ t('substrate_lifetime', { defaultValue: 'Lifetime' }) }
                value={ `${detail.lifetime.birth} ~ ${detail.lifetime.death}` }
                isLoading={ isLoading }
              />
            ) }
          </Grid>
        </Box>
      </GridItem>

      { detail?.signature && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
            <Text fontWeight="bold" mb={ 2 }>{ t('substrate_signature', { defaultValue: 'Signature' }) }</Text>
            <Code fontSize="xs" wordBreak="break-all" p={ 2 } display="block" bg={ codeBg }>
              { detail.signature }
            </Code>
          </Box>
        </GridItem>
      ) }

      { params.length > 0 && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
            <Text fontWeight="bold" mb={ 4 }>{ t('substrate_params', { defaultValue: 'Params' }) }</Text>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>{ t('substrate_param_name', { defaultValue: 'Name' }) }</Th>
                  <Th>{ t('substrate_param_type', { defaultValue: 'Type' }) }</Th>
                  <Th>{ t('substrate_param_value', { defaultValue: 'Value' }) }</Th>
                </Tr>
              </Thead>
              <Tbody>
                { params.map((p: any, idx: number) => (
                  <Tr key={ p.name || idx }>
                    <Td fontWeight="medium">{ p.name || '-' }</Td>
                    <Td><Code fontSize="xs">{ p.type || p.type_name || '-' }</Code></Td>
                    <Td maxW="500px" wordBreak="break-all" fontSize="sm">
                      { typeof p.value === 'string' ? p.value : JSON.stringify(p.value) }
                    </Td>
                  </Tr>
                )) }
              </Tbody>
            </Table>
          </Box>
        </GridItem>
      ) }

      { detail?.transfer && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
            <Text fontWeight="bold" mb={ 4 }>{ t('substrate_transfer', { defaultValue: 'Transfer' }) }</Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={ 4 }>
              <InfoItem
                label={ t('substrate_from', { defaultValue: 'From' }) }
                value={
                  <LinkInternal href={ `/substrate/account/${detail.transfer.from}` } color="link_hovered">
                    { truncateHash(detail.transfer.from || '') }
                  </LinkInternal>
                }
                isLoading={ isLoading }
              />
              <InfoItem
                label={ t('substrate_to', { defaultValue: 'To' }) }
                value={
                  <LinkInternal href={ `/substrate/account/${detail.transfer.to}` } color="link_hovered">
                    { truncateHash(detail.transfer.to || '') }
                  </LinkInternal>
                }
                isLoading={ isLoading }
              />
              <InfoItem label={ t('substrate_amount', { defaultValue: 'Amount' }) } value={ `${detail.transfer.amount} DBC` } isLoading={ isLoading }/>
            </Grid>
          </Box>
        </GridItem>
      ) }

      { events.length > 0 && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 } overflow="auto">
            <Text fontWeight="bold" mb={ 4 }>{ t('substrate_events', { defaultValue: 'Events' }) } ({ events.length })</Text>
            <Table variant="simple" size="sm" minWidth="700px">
              <Thead>
                <Tr>
                  <Th>{ t('substrate_event_index', { defaultValue: 'Event Index' }) }</Th>
                  <Th>{ t('substrate_module', { defaultValue: 'Module' }) }</Th>
                  <Th>{ t('substrate_event', { defaultValue: 'Event' }) }</Th>
                  <Th>{ t('substrate_phase', { defaultValue: 'Phase' }) }</Th>
                </Tr>
              </Thead>
              <Tbody>
                { events.map((event: any, index: number) => (
                  <Tr key={ `${event?.event_index ?? index}` }>
                    <Td>
                      { event?.event_index ? (
                        <LinkInternal href={ `/substrate/event/${event.event_index}` } color="link_hovered">
                          { event.event_index }
                        </LinkInternal>
                      ) : String(index) }
                    </Td>
                    <Td>{ event?.module ?? event?.event_module ?? '-' }</Td>
                    <Td>{ event?.event ?? event?.event_name ?? '-' }</Td>
                    <Td>{ event?.phase ?? '-' }</Td>
                  </Tr>
                )) }
              </Tbody>
            </Table>
          </Box>
        </GridItem>
      ) }
    </Grid>
  );
};

export default SubstrateExtrinsicDetail;
