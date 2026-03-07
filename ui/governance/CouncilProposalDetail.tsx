import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Progress,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';
import LinkInternal from 'ui/shared/LinkInternal';
import type { CouncilProposalDetail as CouncilProposalDetailType } from 'types/api/governance';

interface Props {
  proposalId: string;
}

const truncateAddress = (addr: string) => {
  if (!addr) return '—';
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const getStatusColorScheme = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved' || normalized === 'executed') return 'green';
  if (normalized === 'disapproved' || normalized === 'rejected') return 'red';
  if (normalized === 'proposed') return 'yellow';
  if (normalized === 'closed') return 'gray';
  if (normalized === 'voting') return 'blue';
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

const CouncilProposalDetail = ({ proposalId }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const subtleBg = useColorModeValue('gray.50', 'gray.700');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const { data, isPlaceholderData, isLoading: queryLoading } = useApiQuery('governance_council_proposal_detail', {
    pathParams: { id: proposalId },
    queryOptions: { enabled: Boolean(proposalId) },
  });

  const detail = data as CouncilProposalDetailType | null | undefined;
  const isLoading = isPlaceholderData || queryLoading;

  if (!isLoading && !detail) {
    return (
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 } textAlign="center">
        <Text color={ secondaryTextColor }>{ t('no_data', { defaultValue: 'No data' }) }</Text>
      </Box>
    );
  }

  const totalVotes = (detail?.aye_votes || 0) + (detail?.nay_votes || 0);
  const ayeRatio = totalVotes > 0 ? ((detail?.aye_votes || 0) / totalVotes) * 100 : 0;

  return (
    <VStack align="stretch" spacing={ 4 }>
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <HStack justify="space-between" align="center">
          <Skeleton isLoaded={ !isLoading }>
            <Text fontSize="xl" fontWeight="bold">
              { t('governance_council_motion_title', { defaultValue: `Council Motion #${proposalId}` }) }
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
          { detail?.proposal_hash && (
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <InfoItem label={ t('governance_proposal_hash', { defaultValue: 'Proposal Hash' }) } isLoading={ isLoading }>
                <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">{ detail.proposal_hash }</Text>
              </InfoItem>
            </GridItem>
          ) }
        </Grid>
      </Box>

      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <Text fontWeight="bold" mb={ 3 }>{ t('governance_vote_breakdown', { defaultValue: 'Vote breakdown' }) }</Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={ 4 } mb={ 3 }>
          <GridItem>
            <Box bg={ subtleBg } borderRadius="md" p={ 3 }>
              <Text fontSize="sm" color="green.500">{ t('governance_aye_votes', { defaultValue: 'Aye votes' }) }</Text>
              <Skeleton isLoaded={ !isLoading }>
                <Text fontSize="2xl" fontWeight="bold">{ detail?.aye_votes || 0 }</Text>
              </Skeleton>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg={ subtleBg } borderRadius="md" p={ 3 }>
              <Text fontSize="sm" color="red.500">{ t('governance_nay_votes', { defaultValue: 'Nay votes' }) }</Text>
              <Skeleton isLoaded={ !isLoading }>
                <Text fontSize="2xl" fontWeight="bold">{ detail?.nay_votes || 0 }</Text>
              </Skeleton>
            </Box>
          </GridItem>
        </Grid>
        <Skeleton isLoaded={ !isLoading }>
          <Progress value={ ayeRatio } size="md" colorScheme="green" borderRadius="md"/>
        </Skeleton>
        <Skeleton isLoaded={ !isLoading }>
          <Text mt={ 3 } fontSize="sm" color={ secondaryTextColor }>
            { t('governance_threshold', { defaultValue: 'Threshold' }) }: { detail?.member_threshold || 0 }
          </Text>
        </Skeleton>
      </Box>

      { detail?.votes && detail.votes.length > 0 && (
        <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
          <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
            <Text fontWeight="bold">
              { t('governance_votes', { defaultValue: 'Votes' }) }
              <Text as="span" fontSize="sm" fontWeight="normal" color={ secondaryTextColor } ml={ 2 }>
                ({ detail.votes.length })
              </Text>
            </Text>
          </Box>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>{ t('governance_voter', { defaultValue: 'Voter' }) }</Th>
                <Th>{ t('governance_vote_result', { defaultValue: 'Vote' }) }</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>{ t('governance_time') }</Th>
              </Tr>
            </Thead>
            <Tbody>
              { detail.votes.map((vote, idx) => (
                <Tr key={ idx }>
                  <Td>
                    <LinkInternal href={ `/substrate/account/${vote.address}` } color="link_hovered">
                      <Text fontWeight="medium">{ vote.name || truncateAddress(vote.address) }</Text>
                    </LinkInternal>
                  </Td>
                  <Td>
                    <Badge colorScheme={ vote.passed ? 'green' : 'red' } variant="subtle">
                      { vote.passed ? 'Aye' : 'Nay' }
                    </Badge>
                  </Td>
                  <Td display={{ base: 'none', md: 'table-cell' }}>
                    <Text fontSize="sm" color={ secondaryTextColor }>
                      { vote.voting_time ? new Date(vote.voting_time).toLocaleString() : '—' }
                    </Text>
                  </Td>
                </Tr>
              )) }
            </Tbody>
          </Table>
        </Box>
      ) }

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

export default CouncilProposalDetail;
