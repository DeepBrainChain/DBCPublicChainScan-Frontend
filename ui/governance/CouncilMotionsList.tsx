import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import LinkInternal from 'ui/shared/LinkInternal';
import type { CouncilMotionsResponse } from 'types/api/governance';

interface Props {
  data: CouncilMotionsResponse | undefined;
  isLoading: boolean;
}

const truncateAddress = (addr: string) => {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const getStatusColorScheme = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved') return 'green';
  if (normalized === 'disapproved') return 'red';
  if (normalized === 'proposed') return 'yellow';
  return 'gray';
};

const getStatusTranslationKey = (status: string) => `governance_status_${status.toLowerCase()}`;

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

const CouncilMotionsList = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
      <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
        <Text fontSize="lg" fontWeight="bold">{ t('governance_council_motions') }</Text>
      </Box>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{ t('governance_motion_id') }</Th>
            <Th>{ t('governance_status') }</Th>
            <Th>{ t('governance_module_call') }</Th>
            <Th display={{ base: 'none', md: 'table-cell' }}>{ t('governance_proposer') }</Th>
            <Th isNumeric>{ t('governance_aye_nay_votes') }</Th>
            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{ t('governance_threshold') }</Th>
            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ t('governance_block') }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { isLoading ? (
            <SkeletonRows/>
          ) : (
            data?.items.map((motion) => (
              <Tr key={ motion.motion_id }>
                <Td fontWeight="bold">
                  <LinkInternal href={ `/governance/council/${motion.motion_id}` } color="link_hovered">
                    { motion.motion_id }
                  </LinkInternal>
                </Td>
                <Td>
                  <Badge colorScheme={ getStatusColorScheme(motion.status) } variant="subtle">
                    { t(getStatusTranslationKey(motion.status), { defaultValue: motion.status }) }
                  </Badge>
                </Td>
                <Td>{ `${motion.call_module}/${motion.call_name}` }</Td>
                <Td display={{ base: 'none', md: 'table-cell' }}>{ truncateAddress(motion.proposer) }</Td>
                <Td isNumeric>{ `${motion.aye_votes}/${motion.nay_votes}` }</Td>
                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>{ motion.member_threshold }</Td>
                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ motion.created_block }</Td>
              </Tr>
            ))
          ) }
        </Tbody>
      </Table>
    </Box>
  );
};

export default CouncilMotionsList;
