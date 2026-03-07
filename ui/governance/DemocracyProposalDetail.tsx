import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import LinkInternal from 'ui/shared/LinkInternal';
import type { DemocracyProposalDetail as DemocracyProposalDetailType } from 'types/api/governance';

interface Props {
  proposalId: string;
}

const truncateAddress = (addr: string) => {
  if (!addr) return '—';
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const getStatusColorScheme = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'approved') return 'green';
  if (s === 'rejected' || s === 'disapproved') return 'red';
  if (s === 'proposed') return 'yellow';
  return 'gray';
};

const InfoItem = ({ label, children, isLoading }: { label: string; children: React.ReactNode; isLoading: boolean }) => {
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  return (
    <Box>
      <Text fontSize="xs" color={ secondaryTextColor } mb={ 1 }>{ label }</Text>
      <Skeleton isLoaded={ !isLoading }>{ children }</Skeleton>
    </Box>
  );
};

const DemocracyProposalDetail = ({ proposalId }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const { data, isPlaceholderData, isLoading: queryLoading } = useApiQuery('governance_democracy_proposal_detail' as any, {
    pathParams: { id: proposalId },
    queryOptions: { enabled: Boolean(proposalId) },
  });

  const detail = data as DemocracyProposalDetailType | null | undefined;
  const isLoading = isPlaceholderData || queryLoading;

  if (!isLoading && !detail) {
    return (
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 } textAlign="center">
        <Text color={ secondaryTextColor }>{ t('no_data', { defaultValue: 'No data' }) }</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={ 4 }>
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <HStack justify="space-between" align="center">
          <Skeleton isLoaded={ !isLoading }>
            <Text fontSize="xl" fontWeight="bold">
              { t('governance_democracy_proposal_title', { defaultValue: `Democracy Proposal #${proposalId}` }) }
            </Text>
          </Skeleton>
          <Skeleton isLoaded={ !isLoading }>
            <Badge colorScheme={ getStatusColorScheme(detail?.status || '') } fontSize="md" px={ 3 } py={ 1 } borderRadius="md">
              { t(`governance_status_${(detail?.status || '').toLowerCase()}`, { defaultValue: detail?.status || '' }) }
            </Badge>
          </Skeleton>
        </HStack>
      </Box>

      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <Text fontWeight="bold" mb={ 3 }>{ t('governance_proposal_info', { defaultValue: 'Proposal info' }) }</Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={ 4 }>
          <GridItem>
            <InfoItem label={ t('governance_proposer') } isLoading={ isLoading }>
              <LinkInternal href={ `/substrate/account/${detail?.proposer}` } color="link_hovered">
                <Text fontWeight="medium">{ detail?.proposer_name || truncateAddress(detail?.proposer || '') }</Text>
              </LinkInternal>
            </InfoItem>
          </GridItem>
          <GridItem>
            <InfoItem label={ t('governance_module_call') } isLoading={ isLoading }>
              <Text fontWeight="medium">{ `${detail?.call_module || ''}/${detail?.call_name || ''}` }</Text>
            </InfoItem>
          </GridItem>
          <GridItem>
            <InfoItem label={ t('governance_seconds') } isLoading={ isLoading }>
              <Text fontWeight="medium">{ detail?.seconds || 0 }</Text>
            </InfoItem>
          </GridItem>
          <GridItem>
            <InfoItem label={ t('governance_block') } isLoading={ isLoading }>
              <Text fontWeight="medium">{ detail?.created_block || 0 }</Text>
            </InfoItem>
          </GridItem>
          <GridItem>
            <InfoItem label={ t('governance_created_time', { defaultValue: 'Created time' }) } isLoading={ isLoading }>
              <Text fontWeight="medium">
                { detail?.created_at ? new Date(detail.created_at).toLocaleString() : '—' }
              </Text>
            </InfoItem>
          </GridItem>
          { detail?.value && detail.value !== '0.0000' && (
            <GridItem>
              <InfoItem label={ t('governance_value') } isLoading={ isLoading }>
                <Text fontWeight="bold" color="green.500">{ detail.value } DBC</Text>
              </InfoItem>
            </GridItem>
          ) }
        </Grid>
      </Box>

      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <Text fontWeight="bold" mb={ 3 }>{ t('governance_timeline', { defaultValue: 'Timeline' }) }</Text>
        <VStack align="stretch" spacing={ 2 }>
          { !detail?.timeline?.length ? (
            <Text fontSize="sm" color={ secondaryTextColor }>
              { t('governance_timeline_empty', { defaultValue: 'No timeline events yet.' }) }
            </Text>
          ) : (
            detail.timeline.map((event, idx) => (
              <Box key={ idx } borderWidth="1px" borderColor={ borderColor } borderRadius="md" p={ 3 }>
                <HStack justify="space-between">
                  <HStack spacing={ 2 }>
                    <Badge colorScheme={ getStatusColorScheme(event.status) } variant="subtle">
                      { t(`governance_status_${event.status.toLowerCase()}`, { defaultValue: event.status }) }
                    </Badge>
                    { event.block > 0 && (
                      <Text fontSize="sm" color={ secondaryTextColor }>Block #{ event.block }</Text>
                    ) }
                  </HStack>
                  <Text fontSize="sm" color={ secondaryTextColor }>
                    { event.timestamp ? new Date(event.timestamp).toLocaleString() : '' }
                  </Text>
                </HStack>
              </Box>
            ))
          ) }
        </VStack>
      </Box>
    </VStack>
  );
};

export default DemocracyProposalDetail;
