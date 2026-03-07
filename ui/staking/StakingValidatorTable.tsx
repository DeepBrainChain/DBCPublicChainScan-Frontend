import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Skeleton, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import LinkInternal from 'ui/shared/LinkInternal';
import type { StakingValidatorsResponse } from 'types/api/staking';

interface Props {
  data: StakingValidatorsResponse | undefined;
  isLoading: boolean;
}

const truncateAddress = (addr: string) => {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const formatStake = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
};

const SkeletonRows = () => (
  <>
    { Array.from({ length: 10 }).map((_, i) => (
      <Tr key={ i }>
        { Array.from({ length: 8 }).map((_, j) => (
          <Td key={ j }><Skeleton h="16px" w="80px"/></Td>
        )) }
      </Tr>
    )) }
  </>
);

const StakingValidatorTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflow="auto">
      <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
        <Text fontSize="lg" fontWeight="bold">{ t('staking_validators') }</Text>
      </Box>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{ t('staking_rank') }</Th>
            <Th>{ t('staking_validators') }</Th>
            <Th isNumeric>{ t('staking_total_stake') }</Th>
            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ t('staking_own_stake') }</Th>
            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{ t('staking_nominators') }</Th>
            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{ t('staking_commission') }</Th>
            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ t('staking_era_points') }</Th>
            <Th>{ t('staking_status') }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { isLoading ? (
            <SkeletonRows/>
          ) : (
            data?.items.map((v, index) => (
              <Tr key={ v.address }>
                <Td fontWeight="bold">{ index + 1 }</Td>
                <Td>
                  <LinkInternal href={ `/substrate/account/${v.address}` } color="link_hovered">
                    <Text fontWeight="medium">{ v.name || truncateAddress(v.address) }</Text>
                    { v.name && <Text fontSize="xs" color="gray.500">{ truncateAddress(v.address) }</Text> }
                  </LinkInternal>
                </Td>
                <Td isNumeric>{ formatStake(v.total_stake) }</Td>
                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ formatStake(v.own_stake) }</Td>
                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>{ v.nominator_count }</Td>
                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>{ v.commission }%</Td>
                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>{ v.era_points }</Td>
                <Td>
                  <Badge colorScheme={ v.is_active ? 'green' : 'gray' } variant="subtle">
                    { v.is_active ? t('staking_active') : t('staking_inactive') }
                  </Badge>
                </Td>
              </Tr>
            ))
          ) }
        </Tbody>
      </Table>
    </Box>
  );
};

export default StakingValidatorTable;
