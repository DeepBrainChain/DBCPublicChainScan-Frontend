import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import LinkInternal from 'ui/shared/LinkInternal';
import type { DemocracyProposalsResponse } from 'types/api/governance';

interface Props {
  data: DemocracyProposalsResponse | undefined;
  isLoading: boolean;
}

const truncateAddress = (addr: string) => {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const getStatusColorScheme = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'active') return 'green';
  if (normalized === 'approved') return 'green';
  if (normalized === 'rejected') return 'red';
  if (normalized === 'disapproved') return 'red';
  if (normalized === 'proposed') return 'yellow';
  return 'gray';
};

const getStatusTranslationKey = (status: string) => `governance_status_${status.toLowerCase()}`;

const formatTime = (proposal: DemocracyProposalsResponse['items'][number]) => {
  const withCreatedAt = proposal as typeof proposal & { created_at?: string };

  if (withCreatedAt.created_at) {
    const timestamp = new Date(withCreatedAt.created_at).getTime();
    if (!Number.isNaN(timestamp)) {
      return new Date(timestamp).toLocaleString();
    }
  }

  return '—';
};

const SkeletonRows = () => (
  <>
    { Array.from({ length: 10 }).map((_, i) => (
      <Tr key={ i }>
        { Array.from({ length: 7 }).map((_, j) => (
          <Td key={ j }><Skeleton h="16px" w="80px"/></Td>
        )) }
      </Tr>
    )) }
  </>
);

const DemocracyProposalsList = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
      <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
        <Text fontSize="lg" fontWeight="bold">{ t('governance_democracy_proposals') }</Text>
      </Box>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{ t('governance_id') }</Th>
            <Th>{ t('governance_status') }</Th>
            <Th>{ t('governance_module_call') }</Th>
            <Th display={{ base: 'none', md: 'table-cell' }}>{ t('governance_proposer') }</Th>
            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ t('governance_seconds') }</Th>
            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{ t('governance_block_number') }</Th>
            <Th display={{ base: 'none', lg: 'table-cell' }}>{ t('governance_time') }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { isLoading ? (
            <SkeletonRows/>
          ) : data?.items.length === 0 ? (
            <Tr>
              <Td colSpan={ 7 }>
                <Text textAlign="center" color="gray.500" py={ 8 }>
                  { t('no_data', { defaultValue: 'No data' }) }
                </Text>
              </Td>
            </Tr>
          ) : (
            data?.items.map((proposal) => (
              <Tr key={ proposal.proposal_id }>
                <Td fontWeight="bold">
                  <LinkInternal href={ `/governance/democracy/${proposal.proposal_id}` } color="link_hovered">
                    { proposal.proposal_id }
                  </LinkInternal>
                </Td>
                <Td>
                  <Badge colorScheme={ getStatusColorScheme(proposal.status) } variant="subtle">
                    { t(getStatusTranslationKey(proposal.status), { defaultValue: proposal.status }) }
                  </Badge>
                </Td>
                <Td>{ `${proposal.call_module}/${proposal.call_name}` }</Td>
                <Td display={{ base: 'none', md: 'table-cell' }}>{ truncateAddress(proposal.proposer) }</Td>
                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ proposal.seconds }</Td>
                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>{ proposal.created_block }</Td>
                <Td display={{ base: 'none', lg: 'table-cell' }}>{ formatTime(proposal) }</Td>
              </Tr>
            ))
          ) }
        </Tbody>
      </Table>
    </Box>
  );
};

export default DemocracyProposalsList;
