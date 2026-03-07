import {
  Badge, Box, Grid, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';

interface Props {
  eventId: string;
}

const InfoRow = ({ label, value, isLoading }: { label: string; value: React.ReactNode; isLoading: boolean }) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  return (
    <Grid templateColumns="180px 1fr" gap={ 2 } py={ 1 }>
      <Text fontSize="sm" color={ labelColor }>{ label }</Text>
      <Skeleton isLoaded={ !isLoading }><Text fontSize="sm" wordBreak="break-all">{ value }</Text></Skeleton>
    </Grid>
  );
};

const SubstrateEventDetail = ({ eventId }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { data, isPlaceholderData } = useApiQuery('substrate_event' as any, {
    pathParams: { id: eventId },
    queryOptions: { enabled: Boolean(eventId) },
  });

  const detail = data as any;
  const isLoading = isPlaceholderData || !detail;

  return (
    <VStack align="stretch" spacing={ 4 }>
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <Text fontWeight="bold" mb={ 3 }>{ t('substrate_event_info', { defaultValue: 'Event Info' }) }</Text>
        <InfoRow label={ t('substrate_event_index', { defaultValue: 'Event Index' }) } value={ detail?.event_index } isLoading={ isLoading }/>
        <InfoRow label={ t('substrate_block', { defaultValue: 'Block' }) } value={ detail?.block_num } isLoading={ isLoading }/>
        <InfoRow label={ t('substrate_extrinsic', { defaultValue: 'Extrinsic' }) } value={ detail?.extrinsic_hash || `${ detail?.block_num }-${ detail?.extrinsic_idx }` } isLoading={ isLoading }/>
        <InfoRow label={ t('substrate_module', { defaultValue: 'Module' }) } value={ detail?.module_id } isLoading={ isLoading }/>
        <InfoRow label={ t('substrate_event', { defaultValue: 'Event' }) } value={ detail?.event_id } isLoading={ isLoading }/>
        <InfoRow label="Phase" value={ detail?.phase } isLoading={ isLoading }/>
        <InfoRow label="Finalized" value={
          <Badge colorScheme={ detail?.finalized ? 'green' : 'yellow' } variant="subtle">
            { detail?.finalized ? 'Yes' : 'No' }
          </Badge>
        } isLoading={ isLoading }/>
      </Box>

      { detail?.params && detail.params.length > 0 && (
        <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 } overflowX="auto">
          <Text fontWeight="bold" mb={ 3 }>{ t('substrate_params', { defaultValue: 'Parameters' }) }</Text>
          <Table variant="simple" size="sm">
            <Thead><Tr><Th>Name</Th><Th>Type</Th><Th>Value</Th></Tr></Thead>
            <Tbody>
              { detail.params.map((p: any, i: number) => (
                <Tr key={ i }>
                  <Td><Text fontSize="sm">{ p.name }</Text></Td>
                  <Td><Text fontSize="xs" color="gray.500">{ p.type_name || p.type }</Text></Td>
                  <Td><Text fontSize="xs" wordBreak="break-all" maxW="400px" isTruncated>{ typeof p.value === 'object' ? JSON.stringify(p.value) : String(p.value) }</Text></Td>
                </Tr>
              )) }
            </Tbody>
          </Table>
        </Box>
      ) }
    </VStack>
  );
};

export default SubstrateEventDetail;
