import { Grid, GridItem, Box, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { GovernanceOverview as GovernanceOverviewType } from 'types/api/governance';

interface Props {
  data: GovernanceOverviewType | undefined;
  isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: { label: string; value: string | number; isLoading: boolean }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
      <Text fontSize="sm" color="gray.500" mb={ 1 }>{ label }</Text>
      <Skeleton isLoaded={ !isLoading }>
        <Text fontSize="xl" fontWeight="bold">{ value }</Text>
      </Skeleton>
    </Box>
  );
};

const GovernanceOverview = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');

  // Build stat cards dynamically, only show modules that have data
  const cards: Array<{ label: string; value: number | string }> = [];

  const democracy = data?.democracy_proposal_count ?? 0;
  if (democracy > 0) {
    cards.push({ label: t('governance_democracy_proposals'), value: democracy });
  }

  const referendum = data?.referendum_count ?? 0;
  if (referendum > 0) {
    cards.push({ label: t('governance_active_referenda'), value: referendum });
  }

  const council = data?.council_motion_count ?? 0;
  cards.push({ label: t('governance_council_motions'), value: isLoading ? '—' : council });

  const treasury = data?.treasury_proposal_count ?? 0;
  cards.push({ label: t('governance_treasury_proposals'), value: isLoading ? '—' : treasury });

  const bounty = data?.bounty_count ?? 0;
  if (bounty > 0) {
    cards.push({ label: t('governance_total_bounties'), value: bounty });
  }

  const cols = cards.length <= 2 ? 'repeat(2, 1fr)' : `repeat(${Math.min(cards.length, 4)}, 1fr)`;

  return (
    <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: cols }} gap={ 4 } mb={ 8 }>
      { cards.map((card) => (
        <GridItem key={ card.label }>
          <StatCard label={ card.label } value={ card.value } isLoading={ isLoading }/>
        </GridItem>
      )) }
    </Grid>
  );
};

export default GovernanceOverview;
