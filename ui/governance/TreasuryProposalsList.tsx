import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import LinkInternal from 'ui/shared/LinkInternal';
import type { TreasuryProposalsResponse } from 'types/api/governance';

interface Props {
  data: TreasuryProposalsResponse | undefined;
  isLoading: boolean;
}

const truncateAddress = (addr: string) => {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const getStatusColorScheme = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved') return 'green';
  if (normalized === 'rejected') return 'red';
  if (normalized === 'pending') return 'yellow';
  return 'gray';
};

const getStatusTranslationKey = (status: string) => `governance_status_${status.toLowerCase()}`;

const formatDBCValue = (value: string) => {
  const num = parseFloat(value);

  if (Number.isNaN(num)) {
    return `${value} DBC`;
  }

  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B DBC`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M DBC`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K DBC`;

  return `${num.toFixed(2)} DBC`;
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

const TreasuryProposalsList = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
      <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
        <Text fontSize="lg" fontWeight="bold">{ t('governance_treasury_proposals') }</Text>
      </Box>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{ t('governance_id') }</Th>
            <Th>{ t('governance_status') }</Th>
            <Th display={{ base: 'none', md: 'table-cell' }}>{ t('governance_proposer') }</Th>
            <Th display={{ base: 'none', lg: 'table-cell' }}>{ t('governance_beneficiary') }</Th>
            <Th isNumeric>{ t('governance_value') }</Th>
            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{ t('governance_bond') }</Th>
            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ t('governance_block') }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { isLoading ? (
            <SkeletonRows/>
          ) : (
            data?.items.map((proposal) => (
              <Tr key={ proposal.proposal_id }>
                <Td fontWeight="bold">
                  <LinkInternal href={ `/governance/treasury/${proposal.proposal_id}` } color="link_hovered">
                    { proposal.proposal_id }
                  </LinkInternal>
                </Td>
                <Td>
                  <Badge colorScheme={ getStatusColorScheme(proposal.status) } variant="subtle">
                    { t(getStatusTranslationKey(proposal.status), { defaultValue: proposal.status }) }
                  </Badge>
                </Td>
                <Td display={{ base: 'none', md: 'table-cell' }}>{ truncateAddress(proposal.proposer) }</Td>
                <Td display={{ base: 'none', lg: 'table-cell' }}>{ truncateAddress(proposal.beneficiary) }</Td>
                <Td isNumeric>{ formatDBCValue(proposal.value) }</Td>
                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>{ formatDBCValue(proposal.bond) }</Td>
                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ proposal.created_block }</Td>
              </Tr>
            ))
          ) }
        </Tbody>
      </Table>
    </Box>
  );
};

export default TreasuryProposalsList;
